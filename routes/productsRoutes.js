const express = require('express')
const router = express.Router()
const productsController = require('../controllers/productsController')

// Création des routes
router.get('/', productsController.getAllProducts)
router.get('/:id', productsController.getProductById)
router.post('/', productsController.createNewProduct)
router.put('/:id', productsController.updateProduct)
router.delete('/:id', productsController.deleteProduct)

module.exports = router