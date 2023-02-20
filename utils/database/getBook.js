const Book = require("../../models/book");

const getBook = async (isbn) => {
  let book;
  try {
    book = await Book.findOne({ isbn: isbn });

    if (book == null) {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }

  return book;
};

module.exports = { getBook };
