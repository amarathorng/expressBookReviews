const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  // 1. Check missing fields
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  // 2. Check if username already exists
  if (!isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  // 3. Register new user
  users.push({ username, password });

  return res.status(200).json({
    message: "User registered successfully"
  });

});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Simulate async with Promise/Axios (normally Axios is for HTTP, here we just wrap)
    const getBooks = () => new Promise((resolve, reject) => {
      if (books) resolve(books);
      else reject("No books available");
    });

    const allBooks = await getBooks();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const getBookByISBN = () => new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });

    const book = await getBookByISBN();
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});


// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();

    const getBooksByAuthor = () => new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(b => b.author.toLowerCase() === author);
      if (matchingBooks.length > 0) resolve(matchingBooks);
      else reject("No books found for this author");
    });

    const authorBooks = await getBooksByAuthor();
    res.status(200).json(authorBooks);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});


// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();

    const getBooksByTitle = () => new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(b => b.title.toLowerCase() === title);
      if (matchingBooks.length > 0) resolve(matchingBooks);
      else reject("No books found for this title");
    });

    const titleBooks = await getBooksByTitle();
    res.status(200).json(titleBooks);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
