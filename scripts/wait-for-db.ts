import waitOn from "wait-on";

async function main() {
  console.log("⏳ [wait-for-db] Starting...");

  const host = "localhost";
  const port = process.env.TEST_IN_DOCKER === "true" ? "5433" : "5432";

  const resource = `tcp:${host}:${port}`;
  console.log(`🔍 [wait-for-db] Checking resource: ${resource}`);

  try {
    await waitOn({
      resources: [resource],
      timeout: 30000,
      interval: 250,
      window: 1000,
      verbose: true,
      log: true,
    });

    console.log("✅ [wait-for-db] Postgres is ready!");
  } catch (err) {
    console.error("❌ [wait-for-db] Postgres did NOT become ready!");
    console.error(err);
    process.exit(1);
  }
}

main();