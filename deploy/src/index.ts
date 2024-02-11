import { createClient } from "redis";
import { downloadFile } from "./download";

const subscriber = createClient();
subscriber.connect();

async function main() {
  while (true) {
    const res = await subscriber.brPop("build", 0);
    const id = res?.element;
    await downloadFile("output/vfdgpx5b");
  }
}

main();
