const express = require('express');
const axios = require('axios'); // just for simulation, won't actually call external API
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

// Task 10: Get all books using async callback
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});


// Task 11: Get book by ISBN using Promises
public_users.get('/isbn/:isbn', async function(req, res) {
  const isbn = req.params.isbn;

  try{
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(isbn)}`);
    res.status(200).json(response.data);
  } catch (error){
    res.status(404).json({message: "Book not found", error: error.message});
  }
});


// Task 12: Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(author)}`)
        res.status(200).json(response.data);

        res.status(200).json(authorBooks);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Task 13: Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get book reviews (async for consistency)
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const reviews = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn].reviews || {});
            else reject("Book not found");
        });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

module.exports.general = public_users;
