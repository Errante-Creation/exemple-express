const express = require('express')
const router = express.Router()
const productsController = require('../controllers/productsController')
const authMiddleware = require('../middlewares/authMiddleware')

// Création des routes
router.get('/', productsController.getAllProducts)
router.get('/:id', productsController.getProductById)
router.post('/', authMiddleware, productsController.createNewProduct)
router.put('/:id', authMiddleware, productsController.updateProduct)
router.delete('/:id', authMiddleware, productsController.deleteProduct)

module.exports = router