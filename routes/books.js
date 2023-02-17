require("dotenv").config();

const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const Book = require("../models/book");
const download = require("image-downloader");

// Getting all
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", getBook, (req, res) => {
  res.json(res.book);
});

// Creating one
router.post("/", async (req, res) => {
  const book = new Book({
    isbn: req.body.isbn,
    title: req.body.title,
    authors: req.body.authors,
  });

  try {
    //If URI for image to downloader has been specified, download the cover image from the specified URI.

    // Need to make it so that img gets deleted again if DB fails.
    if (req.body.imageURI) {
      options = {
        url: req.body.imageURI,
        dest: process.env.COVER_IMG_FOLDER + req.body.isbn + ".jpeg",
      };

      await download.image(options);

      // Set hasCoverImg to true in database.
      book.hasCoverImg = true;
    }

    // Add the book to the database
    const newBook = await book.save();

    // Return successful status and the new book in database.
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating one

// Need to be able to update cover Img
router.patch("/:id", getBook, async (req, res) => {
  if (req.body.isbn != null) {
    res.book.isbn = req.body.isbn;
  }
  if (req.body.title != null) {
    res.book.title = req.body.title;
  }
  if (req.body.authors != null) {
    res.book.authors = req.body.authors;
  }
  if (req.body.hasCoverImg != null) {
    res.book.hasCoverImg = req.body.hasCoverImg;
  }

  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting one
router.delete("/:id", getBook, async (req, res) => {
  try {
    await res.book.remove();

    if (res.book.hasCoverImg) {
      console.log("Book has a cover img.");

      const filepath = process.env.COVER_IMG_FOLDER + res.book.isbn + ".jpeg";

      console.log(filepath);

      await fs.unlink(filepath);

      console.log("Cover img has been removed.");
    }

    res.json({ message: "Removed book." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBook(req, res, next) {
  let book;
  try {
    book = await Book.findById(req.params.id);

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
