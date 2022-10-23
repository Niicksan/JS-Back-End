const { createCourse, getById, deleteById, updateById, enrollUser } = require('../services/courseService');
const { parseError } = require('../utils/errorParser');

const courseController = require('express').Router();

courseController.get('/details/:id', async (req, res) => {
    const course = await getById(req.params.id);

    // TBD Redirect to 404 Page - item not found
    if (!course) {
        res.render('/', {
            title: 'Home Page',
            cubicle
        });
    }

    course.isOwner = course.owner.toString() == req.user._id.toString();
    course.enrolled = course.users.map(x => x.toString()).includes(req.user._id.toString());
    res.render('./course/details', {
        title: course.title,
        course
    });
});

courseController.get('/create', (req, res) => {
    res.render('./course/create', {
        title: 'Create Course'
    });
});

courseController.post('/create', async (req, res) => {
    const course = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration,
        owner: req.user._id,
    };

    try {
        await createCourse(course);
        res.redirect('/');
    } catch (error) {
        res.render('./course/create', {
            title: 'Create Course',
            errors: parseError(error),
            course: course
        });
    }
});

courseController.get('/edit/:id', async (req, res) => {
    const course = await getById(req.params.id);

    // TBD Redirect to 404 Page - item not found
    if (!course) {
        return res.redirect('/');
    }

    if (course.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    res.render('./course/edit', {
        title: `Edit Course ${course.title}`,
        course
    });
});

courseController.post('/edit/:id', async (req, res) => {
    const course = await getById(req.params.id);

    // TBD Redirect to 404 Page - item not found
    if (!course) {
        return res.redirect('/');
    }

    if (course.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    try {
        await updateById(req.params.id, req.body);
        res.redirect(`/course/details/${req.params.id}`);
    } catch (error) {
        res.render('./course/edit', {
            title: `Edit Course ${course.title}`,
            errors: parseError(error),
            course: req.body
        });
    }
});

courseController.get('/delete/:id', async (req, res) => {
    const course = await getById(req.params.id);

    // TBD Redirect to 404 Page - item not found

    if (course.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/');
});

courseController.get('/enroll/:id', async (req, res) => {
    const course = await getById(req.params.id);

    if (course.owner.toString() != req.user._id.toString()
        && course.users.map(x => x.toString()).includes(req.user._id.toString()) == false) {
        await enrollUser(req.params.id, req.user._id)
    }

    return res.redirect(`/course/details/${req.params.id}`);
});

module.exports = courseController;