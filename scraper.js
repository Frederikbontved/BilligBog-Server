const puppeteer = require("puppeteer");

// Function for scraping Saxo.com
const scrapeSaxo = async (isbn) => {
  // Start new browser, go to Saxo.com
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto("https://saxo.com");
  console.log("We are now on Saxo.");

  // Type ISBN into search field and submit form.
  await page.type("#new-search-query", isbn);
  console.log("We have now typed into the search field.");

  await page.click("#search-menu > form > button.icon-search");
  console.log("We have now clicked the button.");

  await page.waitForNavigation();
  console.log("we have now waited for navigation");

  // Define the bookInfo variables
  let title;
  let authors;
  let coverImg;

  // Try to grab book title.
  try {
    title = await page.$eval(
      ".product-page-heading__title",
      (el) => el.textContent
    );
  } catch (err) {
    //console.error("Book title selector not found.");
    return false;
  }

  // Try to grab the book authors.
  try {
    authors = await page.$$eval(
      "#product-info > div > div.product-page-heading > h2 > ul > li",
      (authors) => {
        return authors.map((x) => x.textContent);
      }
    );
  } catch (err) {
    //console.error("Authors selector not found.");
    return false;
  }

  // Grab book cover image
  try {
    coverImg = await page.$eval(
      ".product-page-cover__img-holder img",
      (el) => el.src
    );
  } catch (err) {
    //console.error("Book cover selector not found.");
    return false;
  }

  // Close browser.
  await browser.close();

  // Return book object.
  const bookInfo = {
    isbn,
    title,
    authors,
    coverImg,
  };
  return bookInfo;
};

module.exports = { scrapeSaxo };
