const process = require("process");
const download = require("image-downloader");

const saveCoverImgFromUri = async (imageURI, isbn) => {
  const rootPath = process.cwd();

  const image = await download.image({
    url: imageURI,
    dest: rootPath + "/coverImages/" + isbn + ".jpeg",
  });

  console.log(image);
};

module.exports = { saveCoverImgFromUri };
