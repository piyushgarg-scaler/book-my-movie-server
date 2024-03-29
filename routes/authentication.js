const express = require('express')
const controller = require('../controllers/authentication')

const router = express.Router();

router.get('/profile', controller.handleGetUserProfile)

router.post('/signup', controller.handleSignup)

router.post('/signin', controller.handleSignin)

module.exports = router