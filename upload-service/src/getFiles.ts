import path from 'path';
import fs from 'fs'

export const getFiles = (filePath: string) => {
  let res: string[] = []
  const allFiles = fs.readdirSync(filePath);
  allFiles.forEach(data => {
    const fullPath = path.join(filePath, data);
    if (fs.statSync(fullPath).isDirectory()) {
      res = res.concat(getFiles(fullPath))
    }
    else {
      res.push(fullPath);
    }
  })
  return res;
}
