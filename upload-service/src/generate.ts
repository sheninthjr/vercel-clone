
export function generate() {
  const words = '123456789qwertyuiopasdfghjklzxcvbnm'
  const length = 8;
  let id = '';
  for (let i = 0; i < length; i++) {
    id += words[Math.floor(Math.random() * words.length)]
  }
  return id;
}
