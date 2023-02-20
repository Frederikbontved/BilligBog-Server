require("dotenv").config();

const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const {
  saveCoverImgFromUri,
} = require("../utils/cover-images/saveCoverImgFromUri");
const { deleteCoverImg } = require("../utils/cover-images/deleteCoverImg");

// Getting all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one by ISBN.
router.get("/:isbn", getBook, (req, res) => {
  res.json(res.book);
});

// Creating one
router.post("/", async (req, res) => {
  const book = new Book({
    isbn: req.body.isbn,
    title: req.body.title,
    authors: req.body.authors,
  });

  //If URI for image to downloader has been specified, download the cover image from the specified URI.
  if (req.body.imageURI) {
    saveCoverImgFromUri(req.body.imageURI, req.body.isbn);

    // Set hasCoverImg to true in database.
    book.hasCoverImg = true;
  }

  try {
    // Add the book to the database
    const newBook = await book.save();

    // Return successful status and the new book in database.
    res.status(201).json(newBook);
  } catch (err) {
    // Need to delete the image if database post wasn't successfull.
    res.status(400).json({ message: err.message });
  }
});

// Updating one
// Need to be able to update cover Img
router.patch("/:isbn", getBook, async (req, res) => {
  if (req.body.isbn != null) {
    res.book.isbn = req.body.isbn;
  }
  if (req.body.title != null) {
    res.book.title = req.body.title;
  }
  if (req.body.authors != null) {
    res.book.authors = req.body.authors;
  }

  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting one
router.delete("/:isbn", getBook, async (req, res) => {
  try {
    // Delete book from database
    await res.book.remove();

    // Delete cover image from server
    if (res.book.hasCoverImg) {
      deleteCoverImg(res.book.isbn);
    }

    res.json({ message: "Removed book." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBook(req, res, next) {
  let book;
  try {
    book = await Book.findOne({ isbn: req.params.isbn });

    if (book == null) {
      return res.status(404).json({ message: "Cannot find book in database." });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.book = book;
  next();
}

module.exports = router;
