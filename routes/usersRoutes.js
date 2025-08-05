const express = require('express')
const router = express.Router()
// Intégrer le middleware d'authentification
// Intégrer le controller des utilisateurs
const usersController = require('../controllers/usersController')

router.post('/register', usersController.register)
router.post("/login", usersController.login)

module.exports = router