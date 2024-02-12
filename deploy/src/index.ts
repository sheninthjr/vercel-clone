import { createClient } from "redis";
import { copyDist, downloadFile } from "./download";
import { buildProject } from "./build";

const subscriber = createClient();
subscriber.connect();
const publisher = createClient();
publisher.connect();
async function main() {
  while (true) {
    const res = await subscriber.brPop("build", 0);
    //@ts-ignore
    const id = res.element;
    await downloadFile(`output/${id}`);
    await buildProject(id);
    copyDist(id);
    publisher.hSet("status", id, "deployed");
  }
}

main();
