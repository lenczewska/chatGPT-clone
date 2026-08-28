import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import ImageKit from "imagekit";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY?.trim();
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim();

if (!publicKey || !privateKey || !urlEndpoint) {
  throw new Error(
    "ImageKit config is incomplete. Add IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT to your environment."
  );
}

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export default imagekit;
