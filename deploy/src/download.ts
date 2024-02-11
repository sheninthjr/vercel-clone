import { S3 } from "aws-sdk";
import path from "path";
import fs from "fs";
import { Secrets } from "./config";

const s3 = new S3({
  accessKeyId: Secrets.accessKeyId,
  secretAccessKey: Secrets.secretAccessKey,
  endpoint: Secrets.endpoint,
});

export async function downloadFile(prefix: string) {
  const allFiles = await s3
    .listObjectsV2({
      Bucket: "vercel-clone",
      Prefix: prefix,
    })
    .promise();
  const files =
    allFiles.Contents?.map(async ({ Key }) => {
      return new Promise(async (resolve) => {
        if (!Key) {
          resolve("");
          return;
        }
        const finalOutputPath = path.join(__dirname, Key);
        const output = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }
        s3.getObject({
          Bucket: "vercel-clone",
          Key,
        })
          .createReadStream()
          .pipe(output)
          .on("finish", () => {
            resolve("");
          });
      });
    }) || [];
  await Promise.all(files.filter((x) => x !== undefined));
}
