import express from 'express'
import cors from 'cors'
import { generate } from './generate';
import simpleGit from 'simple-git';

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(cors())

app.post('/upload', async (req, res) => {
  const url = req.body.url;
  const id = generate();
  await simpleGit().clone(url, `output/${id}`)

  res.json({
    id: id
  })
})

app.listen(PORT, () => {
  console.log(`Your server is running on ${PORT}`)
})
