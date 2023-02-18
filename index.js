require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3333;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Use JSON middleware
app.use(express.json());

// Import the "books" router
const booksRouter = require("./routes/books");
app.use("/books", booksRouter);

// Import the "scrape" router
const scrapeRouter = require("./routes/scrape");
app.use("/scrape", scrapeRouter);

// Function to serve images from the "coverImages" folder.
// app.use("/images", express.static("coverImages"));

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});
