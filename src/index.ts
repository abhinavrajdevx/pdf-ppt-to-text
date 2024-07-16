import { createWorker } from "tesseract.js";
import { Image } from "image-js";
import { fromPath } from "pdf2pic";

const convertPdfToImage = async (
  pdfFilePath: string
): Promise<string | undefined> => {
  const saveFilename = "pdf-to-image-" + Date.now();

  const options = {
    density: 100,
    saveFilename,
    savePath: "./program-cache",
    format: "png",
    preserveAspectRatio: true,
  };

  const convert = fromPath(pdfFilePath, options);
  const pageToConvertAsImage = 1;

  const { path } = await convert(pageToConvertAsImage, {
    responseType: "image",
  }).then((resolve) => {
    console.log("Page 1 is now converted as image");

    return resolve;
  });
  // pdf-to-image-1721101766815.1.png
  console.log(saveFilename);
  return path;
};

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
  const pdfFilePath = "./test-assets//sample.pdf";
  const pdf_to_image_path = await convertPdfToImage(pdfFilePath);

  //@ts-ignore
  const greyscale_image_path = await convertToGreyScale(pdf_to_image_path);

  const worker = await createWorker();

  await worker.load();
  const {
    data: { text },
  } = await worker.recognize(greyscale_image_path);
  await worker.terminate();

  console.log(text);
}
main();
