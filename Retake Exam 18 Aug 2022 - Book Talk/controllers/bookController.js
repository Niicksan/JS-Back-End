const bookController = require('express').Router();

const { createBook, updateBookById, deleteBookById, addBookToWishlist, getBookById } = require('../services/bookService');
const { parseError } = require('../utils/errorParser');
const { isOwner } = require('../middlewares/guards');
const preloader = require('../middlewares/preloader');


bookController.get('/create', async (req, res) => {
    res.render('./book/create', {
        title: 'Create Book'
    });
});

bookController.post('/create', async (req, res) => {
    const book = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        stars: req.body.stars,
        image: req.body.image,
        review: req.body.review,
        owner: req.user._id,
    };

    try {
        await createBook(book);
        res.redirect('/catalog');
    } catch (error) {
        res.render('./book/create', {
            title: 'Create Book',
            errors: parseError(error),
            book: book
        });
    }
});

bookController.get('/details/:id', preloader(true), async (req, res) => {
    const book = res.locals.book;

    book.isOwner = book.owner.toString() == req.user._id.toString();
    book.isWished = book.users.map(x => x.toString()).includes(req.user._id.toString());
    res.render('./book/details', {
        title: book.title,
        book
    });
});

bookController.get('/edit/:id', preloader(true), isOwner(), async (req, res) => {
    const book = res.locals.book;

    res.render('./book/edit', {
        title: `Edit Book ${book.title}`,
        book
    });
});

bookController.post('/edit/:id', preloader(), isOwner(), async (req, res) => {
    const book = res.locals.book;

    try {
        await updateBookById(book, req.body);
        res.redirect(`/book/details/${req.params.id}`);
    } catch (error) {
        res.render('./book/edit', {
            title: `Edit Book ${course.title}`,
            errors: parseError(error),
            book: req.body
        });
    }
});

bookController.get('/delete/:id', preloader(), isOwner(), async (req, res) => {
    await deleteBookById(req.params.id);
    res.redirect('/catalog');
});

bookController.get('/wish/:id', preloader(), async (req, res) => {
    const book = res.locals.book;

    // if (course.owner.toString() != req.user._id.toString()
    //     && course.users.map(x => x.toString()).includes(req.user._id.toString()) == false) {
    //     await enrollUser(course, req.user._id)
    // }

    // res.redirect(`/course/details/${req.params.id}`);

    try {
        if (book.owner.toString() == req.user._id.toString()) {
            book.isOwner = true;
            throw new Error('You can not add your own book to the wishlist');
        }

        if (book.users.map(x => x.toString()).includes(req.user._id.toString())) {
            book.isWished = true;
            throw new Error('You are already added this book to your wishlist')
        }

        await addBookToWishlist(book, req.user._id);
        res.redirect(`/book/details/${req.params.id}`);
    } catch (error) {
        res.render('./book/details', {
            title: book.title,
            book: await getBookById(req.params.id),
            errors: parseError(error)
        });
    }
});

module.exports = bookController;