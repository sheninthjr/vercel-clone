import express from "express";
import cors from "cors";
import { generate } from "./generate";
import simpleGit from "simple-git";
import { createClient } from "redis";
import { getFiles } from "./getFiles";
import path from "path";
import { uploadFile } from "./upload";

const publisher = createClient();
publisher.connect();
const subscriber = createClient();
subscriber.connect();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.post("/upload", async (req, res) => {
  const url = req.body.url;
  const id = generate();
  await simpleGit().clone(url, path.join(__dirname, `output/${id}`));
  const file = getFiles(path.join(__dirname, `output/${id}`));
  file.forEach(async (data) => {
    await uploadFile(data.slice(__dirname.length + 1), data);
  });
  publisher.lPush("build", id);
  publisher.hSet("status", id, "upload");
  res.json({
    id: id,
    file: file,
  });
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});
app.listen(PORT, () => {
  console.log(`Your server is running on ${PORT}`);
});
