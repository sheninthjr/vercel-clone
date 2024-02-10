import express from "express";
import cors from "cors";
import { generate } from "./generate";
import simpleGit from "simple-git";
import { getFiles } from "./getFiles";
import path from "path";
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.post("/upload", async (req, res) => {
  const url = req.body.url;
  const id = generate();
  await simpleGit().clone(
    url,
    path.join(__dirname, `output/${id}`)
  );
  const file = getFiles(path.join(__dirname, `output/${id}`));
  res.json({
    id: id,
    file: file,
  });
});

app.listen(PORT, () => {
  console.log(`Your server is running on ${PORT}`);
});
