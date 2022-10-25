const Book = require("../models/Book");


async function getAllBooks() {
    return Book.find({}).lean();
}

async function getAllBooksByUser(userId) {
    return Book.find({ users: userId }).lean();
}

async function getBookById(id) {
    return Book.findById(id).lean();
}

async function getBookByIdRaw(id) {
    return Book.findById(id);
}

async function createBook(book) {
    return Book.create(book);
}

async function updateBookById(book, data) {
    book.title = data.title;
    book.author = data.author;
    book.genre = data.genre;
    book.stars = data.stars;
    book.image = data.image;
    book.review = data.review;

    return book.save();
}

async function deleteBookById(id) {
    return Book.findByIdAndDelete(id);
}

async function addBookToWishlist(book, userId) {
    book.users.push(userId)
    return book.save();
}

module.exports = {
    getAllBooks,
    getAllBooksByUser,
    getBookById,
    getBookByIdRaw,
    createBook,
    updateBookById,
    deleteBookById,
    addBookToWishlist
}