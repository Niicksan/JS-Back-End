const Course = require('../models/Course');


async function getAllByDate(search) {
    const query = {};
    if (search) {
        query.title = new RegExp(search, 'i');
    }

    return Course.find(query).collation({ locale: 'en', strength: 2 }).sort({ createdAt: 1 }).lean();
}

async function getRecent() {
    return Course.find({}).sort({ usersCount: -1 }).limit(3).lean();
}

async function createCourse(course) {
    return Course.create(course);
}

async function getByIdNotLeaned(id) {
    return Course.findById(id);
}

async function getById(id) {
    try {
        return Course.findById(id).lean();

    } catch (error) {
        return null;
    }
}

async function updateById(id, data) {
    const course = await getByIdNotLeaned(id);

    course.title = data.title;
    course.description = data.description;
    course.imageUrl = data.imageUrl;
    course.duration = data.duration;

    return course.save();
}

async function deleteById(id) {
    return Course.findByIdAndDelete(id);
}

async function enrollUser(courseId, userId) {
    const course = await getByIdNotLeaned(courseId);

    course.users.push(userId)
    course.usersCount++;
    return course.save();
}

module.exports = {
    getAllByDate,
    getRecent,
    createCourse,
    getById,
    updateById,
    deleteById,
    enrollUser
}