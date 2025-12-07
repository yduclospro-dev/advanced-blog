const _origConsoleError = console.error;
const quietErrors = process.env.QUIET_TEST_ERRORS !== 'false';

if (quietErrors) {
  console.error = () => {
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
