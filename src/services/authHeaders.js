/**
 * Shared authentication header utility
 *
 * Tries Amplify's fetchAuthSession first. If the session cache hasn't rehydrated
 * yet (common race condition on page load / after PKCE login), falls back to the
 * OPPO_ID_TOKEN key written by AuthContext during the PKCE token exchange.
 */
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * Decode a JWT and return its payload, or null on failure.
 */
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (_) {
    return null;
  }
}

/**
 * Returns true if the JWT is expired (or expires within 60 seconds).
 */
function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now() + 60_000;
}

/**
 * Extract a validated JWT string from an Amplify v6 idToken object (or plain string).
 * Returns null if the value is not a proper 3-part JWT — prevents raw base64 signatures
 * or other non-JWT values from being forwarded in the Authorization header.
 */
function extractJwtString(idToken) {
  if (!idToken) return null;

  // --- DEBUG: log toàn bộ thông tin về idToken object ---
  console.log('[DEBUG extractJwtString] typeof idToken:', typeof idToken);
  console.log('[DEBUG extractJwtString] idToken constructor:', idToken?.constructor?.name);
  console.log('[DEBUG extractJwtString] Object.keys:', typeof idToken === 'object' ? Object.keys(idToken) : 'N/A (string)');
  const toStringResult = idToken?.toString?.();
  console.log('[DEBUG extractJwtString] .toString() result:', toStringResult?.slice?.(0, 60));
  console.log('[DEBUG extractJwtString] .toString() parts count:', toStringResult?.split?.('.')?.length);
  console.log('[DEBUG extractJwtString] idToken.jwtToken:', typeof idToken?.jwtToken, '=', String(idToken?.jwtToken)?.slice?.(0, 40));
  // Amplify v6 JWT class có thể expose .value
  console.log('[DEBUG extractJwtString] idToken.value:', String(idToken?.value)?.slice?.(0, 40));
  // -------------------------------------------------------

  const raw =
    (typeof idToken === 'string' ? idToken : null) ||
    idToken?.jwtToken ||          // Amplify internal field (v5 compat shim)
    idToken?.toString?.() ||      // CognitoIdToken.toString() in Amplify v6
    '';
  const cleaned = raw.trim().replace(/[\r\n\t]/g, '');
  // Must be a 3-part JWT: header.payload.signature
  if (cleaned.split('.').length !== 3) {
    console.warn(
      `⚠️ [getIdToken] Non-JWT value from Amplify (${cleaned.slice(0, 40)}...) — skipping. Parts: ${cleaned.split('.').length}`
    );
    return null;
  }
  return cleaned;
}

/**
 * Returns the raw JWT id-token string, or null if unavailable.
 * If the cached token is expired, forces a session refresh.
 */
export async function getIdToken() {
  try {
    const session = await fetchAuthSession();
    // --- DEBUG: log session structure ---
    console.log('[DEBUG getIdToken] session.tokens keys:', session?.tokens ? Object.keys(session.tokens) : 'null');
    console.log('[DEBUG getIdToken] session.credentials present:', !!session?.credentials);
    // ------------------------------------
    const idToken = session?.tokens?.idToken;
    if (idToken) {
      const cleaned = extractJwtString(idToken);

      if (cleaned) {
        // If the cached token is expired, force a refresh
        if (isTokenExpired(cleaned)) {
          try {
            const refreshed = await fetchAuthSession({ forceRefresh: true });
            const refreshedJwt = extractJwtString(refreshed?.tokens?.idToken);
            if (refreshedJwt) {
              // Persist refreshed token so localStorage fallback stays current
              try { localStorage.setItem('OPPO_ID_TOKEN', refreshedJwt); } catch (_) {}
              return refreshedJwt;
            }
          } catch (_) {
            // Refresh failed — fall through to localStorage
          }
        } else {
          console.log('[DEBUG getIdToken] returning Amplify token, parts:', cleaned.split('.').length);
          return cleaned;
        }
      }
      // cleaned is null (non-JWT from Amplify) — fall through to localStorage
      console.warn('[DEBUG getIdToken] extractJwtString returned null — falling through to localStorage');
    } else {
      console.warn('[DEBUG getIdToken] session.tokens.idToken is null/undefined — falling through to localStorage');
    }
  } catch (err) {
    // Amplify not ready — fall through to localStorage
    console.warn('[DEBUG getIdToken] fetchAuthSession threw:', err?.message);
  }

  // Fallback: token written by AuthContext during PKCE login
  const localToken = localStorage.getItem('OPPO_ID_TOKEN');
  console.log('[DEBUG getIdToken] OPPO_ID_TOKEN in localStorage:', localToken ? `present (${localToken.slice(0,20)}... parts=${localToken.split('.').length})` : 'null');
  if (localToken) {
    const localJwt = extractJwtString(localToken);
    if (!localJwt) {
      console.warn('⚠️ OPPO_ID_TOKEN in localStorage is not a valid JWT — ignoring');
      return null;
    }
    if (isTokenExpired(localJwt)) {
      console.warn('⚠️ OPPO_ID_TOKEN in localStorage is expired. User may need to log in again.');
    }
    return localJwt;
  }

  return null;
}

/**
 * Returns fetch-compatible headers with Authorization bearer token.
 * Retries up to `retries` times with increasing delay to handle the race
 * condition where Amplify's session cache is still being restored.
 *
 * @param {number} retries - number of attempts (default 3)
 * @throws {Error} if no token is available after all retries
 */
export async function getAuthHeaders(retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    if (attempt > 0) {
      await new Promise(r => setTimeout(r, 300 * attempt));
    }

    const token = await getIdToken();
    if (token) {
      // ===== DEBUG: decode và print full JWT payload =====
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          console.log('[DEBUG getAuthHeaders] JWT payload:', JSON.stringify({
            sub: payload.sub,
            aud: payload.aud,
            iss: payload.iss,
            'cognito:groups': payload['cognito:groups'],
            token_use: payload.token_use,
            exp: new Date(payload.exp * 1000).toISOString(),
            remainMin: Math.round(((payload.exp * 1000) - Date.now()) / 60000)
          }));
        }
      } catch (_) {}
      // ===================================================
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
    }
  }

  const err = new Error('No authentication token available');
  console.warn('⚠️ No authentication token available');
  throw err;
}
