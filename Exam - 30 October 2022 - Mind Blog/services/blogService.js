const Blog = require("../models/Blog");


async function getAllBlogs() {
    return Blog.find({}).lean();
}

async function getLatestBlogs() {
    return Blog.find({}).sort({ _id: -1 }).limit(3).lean();
}

async function getAllBlogsCreatedByUser(userId) {
    return Blog.find({ owner: userId }).lean();
}

async function getAllBlogsUserFollows(userId) {
    return Blog.find({ followList: userId }).lean();
}

async function getBlogById(id) {
    return Blog.findById(id).populate('owner', 'email').populate('followList', 'email').lean();
}

async function getBlogByIdRaw(id) {
    return Blog.findById(id);
}

async function createBlog(blog) {
    return Blog.create(blog);
}

async function updateBlogById(blog, data) {
    blog.title = data.title;
    blog.image = data.image;
    blog.content = data.content;
    blog.category = data.category;

    return blog.save();
}

async function deleteBlogById(id) {
    return Blog.findByIdAndDelete(id);
}

async function addBlogToFollowingList(blogId, userId) {
    const blog = await getBlogByIdRaw(blogId);

    blog.followList.push(userId)
    return blog.save();
}

module.exports = {
    getAllBlogs,
    getLatestBlogs,
    getAllBlogsCreatedByUser,
    getAllBlogsUserFollows,
    getBlogById,
    getBlogByIdRaw,
    createBlog,
    updateBlogById,
    deleteBlogById,
    addBlogToFollowingList
}