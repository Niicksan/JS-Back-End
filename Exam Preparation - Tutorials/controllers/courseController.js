const courseController = require('express').Router();

const { createCourse, getById, deleteById, updateById, enrollUser } = require('../services/courseService');
const { parseError } = require('../utils/errorParser');
const preloader = require('../middlewares/preloader');
const { isOwner } = require('../middlewares/guards');


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

courseController.get('/details/:id', preloader(true), async (req, res) => {
    const course = res.locals.course;

    // TBD Redirect to 404 Page - item not found

    course.isOwner = course.owner.toString() == req.user._id.toString();
    course.enrolled = course.users.map(x => x.toString()).includes(req.user._id.toString());
    res.render('./course/details', {
        title: course.title,
        course
    });
});

courseController.get('/edit/:id', preloader(true), isOwner(), async (req, res) => {
    const course = res.locals.course;

    // TBD Redirect to 404 Page - item not found

    res.render('./course/edit', {
        title: `Edit Course ${course.title}`,
        course
    });
});

courseController.post('/edit/:id', preloader(), isOwner(), async (req, res) => {
    const course = res.locals.course;

    // TBD Redirect to 404 Page - item not found

    try {
        await updateById(course, req.body);
        res.redirect(`/course/details/${req.params.id}`);
    } catch (error) {
        res.render('./course/edit', {
            title: `Edit Course ${course.title}`,
            errors: parseError(error),
            course: req.body
        });
    }
});

courseController.get('/delete/:id', preloader(), isOwner(), async (req, res) => {
    // TBD Redirect to 404 Page - item not found

    await deleteById(req.params.id);
    res.redirect('/');
});

courseController.get('/enroll/:id', preloader(), async (req, res) => {
    const course = res.locals.course;

    if (course.owner.toString() != req.user._id.toString()
        && course.users.map(x => x.toString()).includes(req.user._id.toString()) == false) {
        await enrollUser(course, req.user._id)
    }

    res.redirect(`/course/details/${req.params.id}`);

    // try {
    //     if (course.owner.toString() == req.user._id.toString()) {
    //         course.isOwner = true;
    //         throw new Error('Can not enroll your own course');
    //     }

    //     if (course.users.map(x => x.toString()).includes(req.user._id.toString())) {
    //         course.enrolled = true;
    //         throw new Error('You are already enrolled to this course')
    //     }

    //     await enrollUser(course, req.user._id);
    //     res.redirect(`/course/details/${req.params.id}`);
    // } catch (error) {
    //     res.render('./course/details', {
    //         title: course.title,
    //         course,
    //         errors: parseError(error)
    //     });
    // }
});

module.exports = courseController;