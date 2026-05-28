import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = import.meta.env.VITE_USER_ROLE_API_URL || '';

async function getAuthToken() {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken;
  if (!idToken) throw new Error('User not authenticated');
  return idToken.toString().trim();
}

export async function updateMyRole(role) {
  if (!['candidate', 'employer'].includes(role)) {
    throw new Error('Invalid role value');
  }

  // Always update local cache first for immediate UX.
  const current = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...current, role };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  localStorage.removeItem('needsGoogleRoleSetup');

  // If backend endpoint is not configured yet, keep local result and exit.
  if (!API_BASE_URL) {
    return { success: true, localOnly: true, user: updatedUser };
  }

  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/users/me/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ role }),
    mode: 'cors'
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || `Role update failed: HTTP ${response.status}`);
  }

  return { success: true, localOnly: false, data };
}
