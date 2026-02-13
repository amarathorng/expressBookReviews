const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []

const isValid = (username) => {
    let userExists = users.some(user => user.username === username);
    return !userExists;  // return true if username does NOT exist
}


const authenticatedUser = (username, password) => {
    let validUsers = users.filter(user => {
        return user.username === username && user.password === password;
    });
    return validUsers.length > 0;
};

regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // 1. Check missing fields
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // 2. Validate user
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // 3. Generate JWT
    let accessToken = jwt.sign(
        { username: username },
        "fingerprint_customer",
        { expiresIn: "1h" }
    );

    // 4. Store token in session
    req.session.authorization = {
        accessToken
    };

    return res.status(200).json({
        message: "User successfully logged in",
        token: accessToken
    });

});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review; // <-- changed from req.query

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.user.username;

    // 1. Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // 2. Check if user review exists
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({
            message: "You have not posted a review for this book"
        });
    }

    // 3. Delete only that user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully"
    });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;

