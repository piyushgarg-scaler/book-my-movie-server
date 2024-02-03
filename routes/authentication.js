const express = require('express')
const controller = require('../controllers/authentication')

const router = express.Router();

router.post('/signup', controller.handleSignup)

router.post('/login')

module.exports = router