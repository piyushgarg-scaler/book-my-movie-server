const express = require('express')
const { ensureAuthenticated } = require('../middlewares/authentication')


const router = express.Router();

router.use(ensureAuthenticated(['admin']))


router.get('/')

router.get('/:id')

router.post('/')

router.patch('/:id')

router.delete('/:id')


module.exports = router