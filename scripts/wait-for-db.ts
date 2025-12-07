import waitOn from "wait-on";

async function main() {
  console.log("⏳ [wait-for-db] Starting...");

  const isDocker = process.env.TEST_IN_DOCKER === "true";
  const host = isDocker ? "postgres" : "localhost";

  const resource = `tcp:${host}:5432`;
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