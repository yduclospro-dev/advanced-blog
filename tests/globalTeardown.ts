export default async function globalTeardown() {
  // No-op teardown: CI orchestration is responsible for db stop.
  // Keep a default export because Jest expects it.
}
