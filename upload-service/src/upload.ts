import { S3 } from "aws-sdk";
import fs from "fs";
import { Secrets } from "./config";

const s3 = new S3({
  accessKeyId: Secrets.accessKeyId,
  secretAccessKey: Secrets.secretAccessKey,
  endpoint: Secrets.endpoint,
});

export const uploadFile = async (fileName: string, localFile: string) => {
  const content = fs.readFileSync(localFile);
  const res = await s3
    .upload({
      Body: content,
      Bucket: "vercel-clone",
      Key: fileName,
    })
    .promise();
  console.log;
};
