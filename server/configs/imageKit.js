import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import ImageKit from "imagekit";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// проверка
console.log("ImageKit publicKey:", process.env.IMAGEKIT_PUBLIC_KEY);

export default imagekit;
