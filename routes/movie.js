const express = require('express')
const controller = require('../controllers/movie')
const { ensureAuthenticated } = require('../middlewares/authentication')

const router = express.Router();

router.get('/', controller.handleGetAllMovies)

router.post('/', ensureAuthenticated(['admin']), controller.handleCreateMovie)

router.put('/:id')

router.delete('/:id')

module.exports = router