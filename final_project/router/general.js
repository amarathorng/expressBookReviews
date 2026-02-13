const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get all books (Task 10)
public_users.get('/', async (req, res) => {
  try {
    const getBooks = () => new Promise((resolve, reject) => {
      if (books) resolve(books);
      else reject({ message: "No books available" });
    });

    const allBooks = await getBooks();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get book by ISBN (Task 11)
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const getBookByISBN = () => new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject({ message: "Book not found" });
    });

    const book = await getBookByISBN();
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json(error);
  }
});

// Get books by author (Task 12)
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const getBooksByAuthor = () => new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(b => b.author.toLowerCase() === author);
      if (matchingBooks.length > 0) resolve(matchingBooks);
      else reject({ message: "No books found for this author" });
    });

    const authorBooks = await getBooksByAuthor();
    res.status(200).json(authorBooks);
  } catch (error) {
    res.status(404).json(error);
  }
});

// Get books by title (Task 13)
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const getBooksByTitle = () => new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(b => b.title.toLowerCase() === title);
      if (matchingBooks.length > 0) resolve(matchingBooks);
      else reject({ message: "No books found for this title" });
    });

    const titleBooks = await getBooksByTitle();
    res.status(200).json(titleBooks);
  } catch (error) {
    res.status(404).json(error);
  }
});

// Get book reviews (converted to async for consistency)
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const getBookReview = () => new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn].reviews || {});
      else reject({ message: "Book not found" });
    });

    const reviews = await getBookReview();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports.general = public_users;
