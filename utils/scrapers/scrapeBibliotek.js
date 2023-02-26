const cheerio = require("cheerio");

// This function posts a search query to Bibliotek.dk with a specified ISBN, and scrapes the internal ID for the book on Bibliotek.dk and returns a URL that leads to the single side for the book.
const getProperBibliotekUrl = async (isbn) => {
  // Search Bibliotek.dk with the specific ISBN.
  const response = await fetch(
    `https://bibliotek.dk/linkme.php?cql=is%3D${isbn}`
  );

  // Convert the response into text
  const body = await response.text();

  // Load body data
  const $ = cheerio.load(body);

  // Get the ID of the book.
  let id = $(".mobile-page").attr("id");

  if (!id) {
    return false;
  }

  // Format the ID properly so it can be used in an URL.
  if (id.includes("basis")) {
    id = id.replace("basis", "-basis%3A");
  } else if (id.includes("katalog")) {
    id = id.replace("katalog", "-katalog%3A");
  }

  // A URL that leads to the book with data expanded so it can be scraped.
  url = "https://bibliotek.dk/da/work/" + id;

  console.log(`URL: ${url}`);
  return url;
};

const scrapeBibliotek = async (isbn) => {
  const url = await getProperBibliotekUrl(isbn);

  if (!url) {
    return false;
  }

  // Go to the single page for the book.
  const response = await fetch(url);

  // Convert the response into text
  const body = await response.text();

  // Load body data
  const $ = cheerio.load(body);

  // Define the bookInfo variables
  let title;
  let authors;
  let coverImg;

  try {
    // Grab the title of the book.
    title = $(
      ".field-name-bibdk-mani-title-specific > .field-items > div > span"
    ).text();

    // Clean up the title.
    title = title.trim();
  } catch (err) {
    console.error(err);
    return false;
  }

  try {
    // Grab the book author(s)
    authors = $(".field-name-bibdk-mani-creators")
      .find("a")
      .map((i, el) => $(el).text())
      .get();

    // If no author is specified, use book contributer(s) instead (editors, translators, etc.)
    if (authors.length == 0) {
      authors = $(".field-name-bibdk-mani-contribs > .field-items > div > span")
        .find("a")
        .map((i, el) => $(el).text())
        .get();
    }
  } catch (err) {
    console.error(err);
    return false;
  }

  try {
    // Grab the cover image url.
    coverImg = $(".bibdk-cover > a > img").attr("src");

    // Grab the large version instead of medium version of image.
    coverImg = coverImg.replace("/medium/", "/large/");

    // Split the string at ".jpg"
    coverImg = coverImg.split(".jpg");

    // concatenate the first part and ".jpg" to get the new string
    coverImg = coverImg[0] + ".jpg";
  } catch (err) {
    console.error(err);
    return false;
  }

  // Return book object.
  const bookInfo = {
    isbn,
    title,
    authors,
    coverImg,
  };

  return bookInfo;
};

module.exports = { scrapeBibliotek };
