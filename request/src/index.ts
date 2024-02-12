import express from "express";
import { S3 } from "aws-sdk";
import { Secrets } from "./config";

const s3 = new S3({
  accessKeyId: Secrets.accessKeyId,
  secretAccessKey: Secrets.secretAccessKey,
  endpoint: Secrets.endpoint,
});

const app = express();

app.get("/*", async (req, res) => {
  const hostName = req.hostname;
  const id = hostName.split(".")[0];
  const filePath = req.path;

  const contents = await s3
    .getObject({
      Bucket: "vercel-clone",
      Key: `/dist/${id}${filePath}`,
    })
    .promise();
  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);
  res.send(contents.Body);
});

app.listen(3001);
