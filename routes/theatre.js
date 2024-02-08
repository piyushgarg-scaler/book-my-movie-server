const express = require('express')
const { ensureAuthenticated } = require('../middlewares/authentication')
const controller = require('../controllers/theatre')

const router = express.Router();

router.use(ensureAuthenticated(['admin']))


router.get('/', controller.handleGetAllTheaters)

router.get('/:id')

router.post('/', controller.handleCreateTheatre)

router.patch('/:id')

router.delete('/:id')


module.exports = router