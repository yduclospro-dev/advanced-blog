import { execSync } from "child_process";

function exec(cmd: string): string {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch {
    return "";
  }
}

function main() {
  const running = exec('docker ps --filter "name=redis-dev" --format "{{.Names}}"');
  const exists = exec('docker ps -a --filter "name=redis-dev" --format "{{.Names}}"');

  if (running === "redis-dev") {
    console.log("Redis déjà en cours d'exécution.");
    return;
  }

  if (exists === "redis-dev") {
    console.log("Redis existe mais est arrêté. Démarrage en cours…");
    execSync("docker start redis-dev", { stdio: "inherit" });
    return;
  }

  console.log("Redis n'existe pas. Création du conteneur Redis…");
  execSync(
    'docker run -d --name redis-dev -p 6379:6379 redis:7-alpine redis-server --save "" --appendonly no',
    { stdio: "inherit" }
  );
}

main();