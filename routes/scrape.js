const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const { scrapeSaxo } = require("../scraper");

// Scraping the web for a book by ISBN.
router.get("/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  let bookFound = false;

  // First check local DB
  const localCheck = await getBookByIsbn(isbn);

  if (localCheck) {
    console.log("Book found in local DB.");
    bookFound = true;
    return res.json(localCheck);
  }

  console.log("Book was not found in local DB, now checking Saxo..");

  // Then check Saxo.com
  const saxoCheck = await scrapeSaxo(isbn);

  if (saxoCheck) {
    console.log("Book found on Saxo.");
    bookFound = true;
    return res.json(saxoCheck);
  }

  if (!bookFound) {
    console.log("This is a test!");
    // If all other checks have failed, we now send this.
    return res.status(400).json({ message: "Book not found!" });
  }
});

async function getBookByIsbn(isbn) {
  let book;
  try {
    book = await Book.findById(isbn);

    if (book == null) {
      return false;
    }
  } catch (err) {
    return false;
  }

  return book;
}

module.exports = router;
