// On va avoir besoin de récupérer les données de la base de données (model)
const Product = require('../models/productsModel')

exports.getAllProducts = async (req, res) => {
   try {
      const products = await Product.find()
      res.json(products)
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.getProductById = async (req, res) => {
   try {
      const product = await Product.findById(req.params.id)
      if (product == null) {
         res.status(404).json({ message: 'Produit non trouvé' })
      }
      res.json(product)
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.createNewProduct = async (req, res) => {
   const product = new Product({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock
   })

   try {
      const newProduct = await product.save()
      res.status(201).json(newProduct)
   } catch (err) {
      res.status(400).json({ message: err.message })
   }
}

exports.updateProduct = async (req, res) => {
   try {
      const product = await Product.findById(req.params.id)
      if (product == null) {
         res.status(404).json({ message: "Produit non trouvé" })
      }

      if (req.body.name != null) {
         product.name = req.body.name
      }

      if (req.body.price != null) {
         product.price = req.body.price
      }

      if (req.body.stock != null) {
         product.stock = req.body.stock
      }

      const updateProduct = await product.save()
      res.json(updateProduct)

   } catch (err) {
      res.status(400).json({ message: err.message })
   }
}

exports.deleteProduct = async (req, res) => {
   try {
      const product = await Product.findById(req.params.id)
      if (product == null) {
         res.status(404).json({ message: 'Produit non trouvé' })
      }

      await product.deleteOne()
      res.json({ message: "Produit supprimé" })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}