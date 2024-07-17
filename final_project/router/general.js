const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function(req, res) {
    return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
    const isbn = req.params.isbn;
    const bookData = books[isbn];
    if (bookData) {
        return res.status(300).json(bookData);
    } else {
        return res.status(404).send("no data found!");
    }
});

// Get book details based on author
public_users.get('/author/:author', function(req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    let matchingBooks = [];
    bookKeys.forEach(key => {
        if (books[key].author === author) {
            matchingBooks.push(books[key]);
        }
    });
    return res.status(300).json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title', function(req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    let matchingBooks = [];
    bookKeys.forEach(key => {
        if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
            matchingBooks.push(books[key]);
        }
    });
    return res.status(300).json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
    const isbn = req.params.isbn
    const bookData = books[isbn];
    if (bookData) {
        return res.status(300).json(bookData.reviews);
    } else {
        return res.status(404).send("no data found!");
    }
});

module.exports.general = public_users;