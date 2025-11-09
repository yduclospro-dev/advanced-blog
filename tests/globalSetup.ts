// This file used to run side-effects at import time. It's now a noop that
// delegates to the proper Jest global setup implemented in `setupGlobal.ts`.
export { default } from './setupGlobal';
