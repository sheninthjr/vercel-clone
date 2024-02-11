import { createClient } from "redis";

const subscriber = createClient();
subscriber.connect();

async function main() {
  while (true) {
    const res = subscriber.brPop("build", 0);
    console.log(res);
  }
}

main();
