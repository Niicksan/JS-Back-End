const profileController = require('express').Router();

const { getAllBlogsCreatedByUser, getAllBlogsUserFollows } = require('../services/blogService');


profileController.get('/', async (req, res) => {
    const blogsCreated = await getAllBlogsCreatedByUser(req.user._id);
    const blogsFollowing = await getAllBlogsUserFollows(req.user._id);

    const createdCount = blogsCreated.length;
    const followingCount = blogsFollowing.length;

    res.render('profile', {
        title: 'Profile Page',
        createdCount,
        followingCount,
        blogsCreated,
        blogsFollowing
    });
});

module.exports = profileController;