const process = require("process");
const fs = require("fs").promises;

const deleteCoverImg = async (isbn) => {
  const rootPath = process.cwd();

  await fs.unlink(rootPath + "/coverImages/" + isbn + ".jpeg");
};

module.exports = { deleteCoverImg };
