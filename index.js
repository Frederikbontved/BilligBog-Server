require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Successfully connected to DB."));

const app = express();
const port = 3333;

// Use JSON middleware
app.use(express.json());

// Import the "books" router
const booksRouter = require("./routes/books");
app.use("/books", booksRouter);

// Import the "scrape" router
const scrapeRouter = require("./routes/scrape");
app.use("/scrape", scrapeRouter);

// Function to serve images from the "coverImages" folder.
app.use("/images", express.static("coverImages"));

// Start the server
app.listen(port, ["192.168.8.108", "localhost"], () =>
  console.log("Its alive!")
);
