require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3333;

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Successfully connected to DB."));

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
app.listen(PORT, () => console.log(`It's alive on port ${PORT}`));
