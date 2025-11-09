// Node-only Jest setup: keep console.error quieting helpers but avoid any DOM/window usage
// Quiet noisy console.error output during tests by default.
// Set QUIET_TEST_ERRORS=false in the environment to see errors as usual.
const _origConsoleError = console.error;
const quietErrors = process.env.QUIET_TEST_ERRORS !== 'false';

if (quietErrors) {
  console.error = () => {
    // no-op by default during tests
  };

  interface QuietHelpers {
    __quietConsoleErrors: () => () => void;
    __unquietConsoleErrors: () => () => void;
    __lastConsoleError?: unknown[];
  }

  const helpers = globalThis as unknown as QuietHelpers;

  helpers.__quietConsoleErrors = () => {
    const prev = console.error;
    console.error = (...args: unknown[]) => {
      helpers.__lastConsoleError = args;
    };
    return () => {
      console.error = prev;
    };
  };

  helpers.__unquietConsoleErrors = () => {
    console.error = _origConsoleError;
    return () => {
      console.error = () => {};
    };
  };
}
