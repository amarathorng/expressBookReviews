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

// --------------------
// Task 10: Get all books (async simulation)
// --------------------
public_users.get('/async/books', async (req, res) => {
    try {
        const allBooks = await new Promise((resolve, reject) => {
            if (books) resolve(books);
            else reject("No books available");
        });

        res.status(200).json(allBooks);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// --------------------
// Task 11: Get book by ISBN (async simulation)
// --------------------
public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });

        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// --------------------
// Task 12: Get books by Author (async simulation)
// --------------------
public_users.get('/async/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        const authorBooks = await new Promise((resolve, reject) => {
            const matchingBooks = Object.values(books).filter(b => b.author.toLowerCase() === author);
            if (matchingBooks.length > 0) resolve(matchingBooks);
            else reject("No books found for this author");
        });

        res.status(200).json(authorBooks);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// --------------------
// Task 13: Get books by Title (async simulation)
// --------------------
public_users.get('/async/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        const titleBooks = await new Promise((resolve, reject) => {
            const matchingBooks = Object.values(books).filter(b => b.title.toLowerCase() === title);
            if (matchingBooks.length > 0) resolve(matchingBooks);
            else reject("No books found for this title");
        });

        res.status(200).json(titleBooks);
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
