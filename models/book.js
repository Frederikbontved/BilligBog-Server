const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  isbn: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: Array,
    required: true,
  },
  hasCoverImg: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Book", bookSchema);
