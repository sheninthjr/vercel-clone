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

export function copyDist(id: string) {
  const folderPath = path.join(__dirname, `output/${id}/dist`);
  const allFiles = getFiles(folderPath);
  allFiles.forEach(async (data) => {
    await uploadFile(`dist/${id}/` + data.slice(folderPath.length + 1), data);
  });
}

export const getFiles = (filePath: string) => {
  let res: string[] = [];
  const allFiles = fs.readdirSync(filePath);
  allFiles.forEach((data) => {
    const fullPath = path.join(filePath, data);
    if (fs.statSync(fullPath).isDirectory()) {
      res = res.concat(getFiles(fullPath));
    } else {
      res.push(fullPath);
    }
  });
  return res;
};

const uploadFile = (fileName: string, localPath: string) => {
  const fileContent = fs.readFileSync(localPath);
  const response = s3
    .upload({
      Body: fileContent,
      Bucket: "vercel-clone",
      Key: fileName,
    })
    .promise();
};
