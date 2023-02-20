const puppeteer = require("puppeteer");

const scrapeBibliotek = async (isbn) => {
  // Start new browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(`https://bibliotek.dk/da/linkme.php?cql=${isbn}`);
  console.log(`${isbn}: We are now on Bibliotek.`);

  // Expand the search info.
  await page.click(".searchresult-work-title");
  console.log(`${isbn}: We have now expanded.`);

  await page
    .waitForSelector(
      ".field-name-bibdk-mani-title-specific > div.field-items > div > span"
    )
    .then(() => console.log("ajax has now expanded."));

  // Define the bookInfo variables
  let title;
  let authors;
  let coverImg;

  // Try to grab book title.
  try {
    title = await page.$eval(
      ".field-name-bibdk-mani-title-specific > div.field-items > div > span",
      (el) => el.textContent
    );
    console.log(`The title is: ${title}`);
  } catch (err) {
    console.error(`${isbn}: Book title selector was not found.`);
    return false;
  }

  // Try to grab the book authors.
  try {
    authors = await page.$$eval(
      ".field-name-bibdk-mani-creators > div.field-items > div > span > span > a",
      (el) => el.textContent
    );
    console.log(`The authors are: ${authors}`);
  } catch (err) {
    console.error(`${isbn}: Authors selector not found.`);
    return false;
  }

  // Grab book cover image
  try {
    coverImg = await page.$eval(
      ".work-cover.image > div > a > img",
      (el) => el.src
    );
    console.log(`The cover img src is: ${coverImg}`);
  } catch (err) {
    console.error(`${isbn}: CoverImg selector not found.`);
    return false;
  }

  // Close browser.
  await browser.close();
  console.log(`${isbn}: The browser is now closed again.`);

  // Return book object.
  const bookInfo = {
    isbn,
    title,
    authors,
    coverImg,
  };

  console.log(bookInfo);

  /*
  return bookInfo;
  */
};

module.exports = { scrapeBibliotek };
