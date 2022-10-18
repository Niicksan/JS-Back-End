const { getById, create, update, deleteById, bookRoom } = require('../services/hotelService');
const { parseError } = require('../utils/errorParser');

const hotelController = require('express').Router();


hotelController.get('/details/:id', async (req, res) => {
    const hotel = await getById(req.params.id);

    if (hotel.owner == req.user._id) {
        hotel.isOwner = true;
    } else if (hotel.bookings.map(b => b.toString()).includes(req.user._id.toString())) {
        hotel.isBooked = true;
    }

    res.render('./hotel/details', {
        title: `Hotel ${hotel.name}`,
        hotel
    });
});

hotelController.get('/create', (req, res) => {
    res.render('./hotel/create', {
        title: 'Create Hotel'
    });
});

hotelController.post('/create', async (req, res) => {
    const hotel = {
        name: req.body.name,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        rooms: Number(req.body.rooms),
        owner: req.user._id
    }

    try {
        if (Object.values(hotel).some(v => !v)) {
            throw new Error('All fields are required')
        }

        await create(hotel);
        res.redirect('/');
    } catch (error) {
        res.render('./hotel/create', {
            title: 'Create Hotel',
            body: hotel,
            errors: parseError(error)
        });
    }
})

hotelController.get('/edit/:id', async (req, res) => {
    const hotel = await getById(req.params.id);

    if (hotel.owner != req.user._id) {
        return res.redirect('/');
    }

    res.render('./hotel/edit', {
        title: 'Edit Hotel',
        hotel
    });
});

hotelController.post('/edit/:id', async (req, res) => {
    const hotel = await getById(req.params.id);

    if (hotel.owner != req.user._id) {
        return res.redirect('/');
    }

    const editedHotel = {
        name: req.body.name,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        rooms: Number(req.body.rooms),
    }

    try {
        if (Object.values(editedHotel).some(v => !v)) {
            throw new Error('All fields are required')
        }

        await update(req.params.id, editedHotel);
        res.redirect(`/hotel/details/${req.params.id}`);

    } catch (error) {
        res.render('./hotel/edit', {
            title: 'Edit Hotel',
            hotel: Object.assign(editedHotel, { _id: req.params.id }),
            errors: parseError(error)
        });
    }
})

hotelController.get('/delete/:id', async (req, res) => {
    const hotel = await getById(req.params.id);

    if (hotel.owner != req.user._id) {
        return res.redirect('/');
    }

    await deleteById(req.params.id);
    res.redirect('/');
});

hotelController.get('/book/:id', async (req, res) => {
    const hotel = await getById(req.params.id);

    try {
        if (hotel.owner == req.user._id) {
            hotel.isOwner = true;
            throw new Error('Can not book your own hotel');
        }

        if (hotel.bookings.map(b => b.toString()).includes(req.user._id.toString())) {
            hotel.isBooked = true;
            throw new Error('You are already booked')
        }

        await bookRoom(req.params.id, req.user._id);
        res.redirect(`/hotel/details/${req.params.id}`);
    } catch (error) {
        res.render('./hotel/details', {
            title: `Hotel ${hotel.name}`,
            hotel,
            errors: parseError(error)
        });
    }
});

module.exports = hotelController;