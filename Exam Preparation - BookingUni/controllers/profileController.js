const { getByUserBooking } = require('../services/hotelService');

const profileController = require('express').Router();


profileController.get('/', async (req, res) => {
    const bookings = await getByUserBooking(req.user._id);
    res.render('profile', {
        title: 'Profile Page',
        user: Object.assign({ bookings }, req.user)
    });
});

module.exports = profileController;