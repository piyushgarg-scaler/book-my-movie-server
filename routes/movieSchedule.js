const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authentication');
const controller = require('../controllers/movieSchedule');

const router = express.Router();

router.use(ensureAuthenticated(['admin']));

router.get('/', controller.handleGetAllMovieSchedules);

router.get('/bookings', controller.handleGetAllBookings)

router.get('/:id');

router.post('/', controller.handleCreateMovieSchedule);

router.patch('/:id');

router.delete('/:id');

module.exports = router