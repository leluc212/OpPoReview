// Utility to load Amplify and Auth regardless of package export shape
export async function loadAmplifyAuth() {
  // Try main package first
  try {
    const mod = await import('aws-amplify');
    // Try to read named exports first (works with modern ESM builds)
    const NamedAuth = mod.Auth;
    const NamedAmplify = mod.Amplify;
    if (NamedAuth || NamedAmplify) {
      return { Amplify: NamedAmplify || (mod.default && mod.default.Amplify) || mod.default || null, Auth: NamedAuth || (mod.default && mod.default.Auth) || null };
    }

    // Fallback to default export shape
    const modDefault = mod.default || mod;
    const Amplify = modDefault.Amplify || modDefault;
    const Auth = modDefault.Auth || (Amplify && Amplify.Auth) || null;
    if (!Auth) {
      console.warn('Amplify loaded but Auth export missing; ensure aws-amplify package is installed and up-to-date');
      console.debug('module keys:', Object.keys(mod || {}));
    }
    return { Amplify, Auth };
  } catch (err) {
    // Provide a clear error for callers
    console.error('Failed to load aws-amplify modules', err);
    return { Amplify: null, Auth: null };
  }
}
