const express = require('express')
const {signup, login, me, logout} = require('../controllers/authControllers.js')
const { authMiddleware } = require('../middlewares/authMiddleware.js')

const router = express.Router()

router.post('/signup', signup)
router.post('/register', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authMiddleware, me)

module.exports = router