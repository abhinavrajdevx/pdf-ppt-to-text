import { createWorker } from "tesseract.js";
import { Image } from "image-js";

const convertToGreyScale = async (imagePath: string) => {
  let image = await Image.load(imagePath);
  let grey = image.grey();

  const image_path_split = imagePath.split(".");
  const new_image_path =
    "./program-cache/greyscale-" +
    Date.now() +
    "." +
    image_path_split[image_path_split.length - 1];
  await grey.save(new_image_path);
  return new_image_path;
};

async function main() {
  const imagePath = "./test-assets/image.png";
  const greyscale_image_path = await convertToGreyScale(imagePath);

  const worker = await createWorker("eng");

  (async () => {
    await worker.load();
    const {
      data: { text },
    } = await worker.recognize(greyscale_image_path);
    console.log(text);
    await worker.terminate();
  })();
}
main();
