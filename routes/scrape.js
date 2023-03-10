const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const { scrapeSaxo } = require("../utils/scrapers/scrapeSaxo");
const { scrapeBibliotek } = require("../utils/scrapers/scrapeBibliotek");
const { getBook } = require("../utils/database/getBook");

// Scraping the web for a book by ISBN.
router.get("/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  let bookFound = false;

  // First check local DB
  const localCheck = await getBook(isbn);

  if (localCheck) {
    console.log(`Success! Book with isbn ${isbn} was found in local DB.`);
    bookFound = true;
    const responseJson = localCheck.toJSON();
    responseJson.coverImg = `http://134.122.92.30/images/${isbn}.jpeg`;
    return res.json(responseJson);
  }

  console.log(
    `Book with isbn ${isbn} was NOT found in local DB. Now scraping Bibliotek.dk...`
  );

  // Then check bibliotek.dk
  const bibliotekCheck = await scrapeBibliotek(isbn);

  if (bibliotekCheck) {
    console.log(`Success! Book with isbn ${isbn} was found on Bibliotek.dk.`);
    bookFound = true;
    return res.json(bibliotekCheck);
  }

  console.log(
    `Book with isbn ${isbn} was NOT found on Bibliotek.dk. Now scraping Saxo...`
  );

  // Then check Saxo.com
  const saxoCheck = await scrapeSaxo(isbn);

  if (saxoCheck) {
    console.log(`Success! Book with isbn ${isbn} was found on Saxo.`);
    bookFound = true;
    return res.json(saxoCheck);
  }

  if (!bookFound) {
    console.log(`Failure! Book isbn ${isbn} wasn't found anywhere.`);
    // If all other checks have failed, we now send this.
    return res.status(400).json({ message: "Book not found!" });
  }
});

module.exports = router;
