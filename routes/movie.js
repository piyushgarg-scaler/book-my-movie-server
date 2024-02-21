const express = require('express')
const controller = require('../controllers/movie')
const { ensureAuthenticated } = require('../middlewares/authentication')

const router = express.Router();

router.get('/', controller.handleGetAllMovies)

router.get('/:id/schedule', controller.handleGetMovieSchedule)

router.get('/schedule/:id/book', ensureAuthenticated(), controller.handleCreateBookingOrder)

router.get('/:id', controller.handleGetMovieById)

router.post('/', ensureAuthenticated(['admin']), controller.handleCreateMovie)

router.put('/:id')

router.delete('/:id', ensureAuthenticated(['admin']), controller.handleDeleteMovieById)

module.exports = router