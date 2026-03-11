let _configured = false;

export default async function ensureAmplifyConfigured() {
  if (_configured) return true;
  try {
    const cfgModule = await import('../amplifyConfig');
    const awsCfg = cfgModule.default || cfgModule;

    // Prefer configuring the shared core used by auth: @aws-amplify/core
    try {
      const core = await import('@aws-amplify/core');
      const AmplifyCore = core.Amplify || (core.default && core.default.Amplify) || core.default || core;
      if (AmplifyCore && typeof AmplifyCore.configure === 'function') {
        AmplifyCore.configure(awsCfg);
        _configured = true;
        console.info('Configured @aws-amplify/core');
        return true;
      }
    } catch (coreErr) {
      // fallback to top-level package
      // eslint-disable-next-line no-console
      console.warn('Could not configure @aws-amplify/core directly:', coreErr && coreErr.message ? coreErr.message : coreErr);
    }

    try {
      const mod = await import('aws-amplify');
      const Amplify = mod.Amplify || (mod.default && mod.default.Amplify) || mod.default || mod;
      if (Amplify && typeof Amplify.configure === 'function') {
        Amplify.configure(awsCfg);
        _configured = true;
        console.info('Configured aws-amplify fallback');
        return true;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('ensureAmplifyConfigured: aws-amplify configure failed', err && err.message ? err.message : err);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('ensureAmplifyConfigured: could not load config', err && err.message ? err.message : err);
  }
  return false;
}
