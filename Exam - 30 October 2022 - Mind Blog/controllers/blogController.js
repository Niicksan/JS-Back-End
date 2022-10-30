const blogController = require('express').Router();

const { hasUser, isOwner } = require('../middlewares/guards');
const { createBlog, updateBlogById, deleteBlogById, addBlogToFollowingList } = require('../services/blogService');
const { parseError } = require('../utils/errorParser');
const preloader = require('../middlewares/preloader');


blogController.get('/create', hasUser(), (req, res) => {
    res.render('./blog/create', {
        title: 'Create Blog'
    });
});

blogController.post('/create', hasUser(), async (req, res) => {
    const blog = {
        title: req.body.title,
        image: req.body.image,
        content: req.body.content,
        category: req.body.category,
        owner: req.user._id,
    };

    try {
        if (Object.values(blog).some(v => !v)) {
            throw new Error('All fields are required')
        }

        await createBlog(blog);
        res.redirect('/catalog');
    } catch (error) {
        res.locals.errors = parseError(error);

        res.render('./blog/create', {
            title: 'Create Blog',
            blog
        });
    }
});

blogController.get('/details/:id', preloader(true), async (req, res) => {
    const blog = res.locals.blog;
    const isFollowers = [];

    if (req.user) {
        blog.isOwner = blog.owner._id?.toString() == req.user._id.toString();
        blog.isFollowed = blog.followList.map(x => x._id.toString()).includes(req.user._id.toString());
    }

    if (blog.followList.length > 0) {
        blog.followList.forEach(x => isFollowers.push(x.email))
    }

    const followers = isFollowers.join(', ');

    res.render('./blog/details', {
        title: blog.title,
        blog,
        followers
    });
});

blogController.get('/edit/:id', preloader(true), isOwner(), async (req, res) => {
    const blog = res.locals.blog;

    res.render('./blog/edit', {
        title: `Edit your blog ${blog.title}`,
        blog
    });
});

blogController.post('/edit/:id', preloader(), isOwner(), async (req, res) => {
    const blog = res.locals.blog;

    try {
        if (Object.values(req.body).some(v => !v)) {
            throw new Error('All fields are required')
        }

        await updateBlogById(blog, req.body);
        res.redirect(`/blog/details/${req.params.id}`);
    } catch (error) {
        res.locals.errors = parseError(error);

        res.render('./blog/edit', {
            title: `Edit your blog ${blog.title}`,
            blog: Object.assign(req.body, { _id: req.params.id })
        });
    }
});

blogController.get('/delete/:id', preloader(), isOwner(), async (req, res) => {
    await deleteBlogById(req.params.id);
    res.redirect('/catalog');
});

blogController.get('/follow/:id', preloader(true), async (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    const blog = res.locals.blog;
    blog.isFollowers = [];

    if (blog.followList.length > 0) {
        blog.followList.forEach(x => blog.isFollowers.push(x.email))
    }

    const followers = blog.isFollowers.join(', ');

    try {
        if (blog.owner._id.toString() == req.user._id.toString()) {
            blog.isOwner = true;
            throw new Error('You can not follow your own blog');
        }

        if (blog.followList.map(x => x._id.toString()).includes(req.user._id.toString())) {
            blog.isFollowed = true;
            throw new Error('You are already following this blog');
        }

        await addBlogToFollowingList(req.params.id, req.user._id);
        res.redirect(`/blog/details/${req.params.id}`);
    } catch (error) {
        res.locals.errors = parseError(error);

        res.render('./blog/details', {
            title: blog.title,
            blog,
            followers
        });
    }
});

module.exports = blogController;