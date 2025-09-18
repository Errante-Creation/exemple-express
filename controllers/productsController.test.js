// Importer les fonctions du contrôleur à tester
const { getAllProducts, getProductById, createNewProduct, updateProduct, deleteProduct } = require('./productsController')
// Importe le modèle Product
const Product = require('../models/productsModel')

// jest.mock() remplace le vrai modèle par une version simulée (mock)
jest.mock('../models/productsModel')

describe('Products Controller', () => {
   let req, res;

   // Exécution avant chaque test
   beforeEach(() => {
      // Créer les objets req et res simulés
      req = { params: {}, body: {} }
      res = {
         // mockReturnThis() permet le chainage de méthode (res.status(404).json())
         // jest.fn() : créer une fonction simulée (spy function)
         // mockReturnThis() : fait que la fonction retourn this (retourne l'objet res lui-même)
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
      }
   })

   // Exécuter après chaque test
   afterEach(() => {
      // Nettoie les mocks pour éviter les conflits entre les tests
      jest.clearAllMocks()
   })

   // Groupe de tests
   describe('getAllProducts', () => {
      // it : test individuel
      it('should return all products', async () => {
         // Mock de la fonction find() de Product pour retourner les données
         const mockProducts = [
            { _id: '1', name: 'Product 1', price: '10', stock: 5 },
            { _id: '2', name: 'Product 2', price: '20', stock: 3 }
         ]
         // mockResolvedValue() permet de retourner une valeur prédéfinie
         Product.find.mockResolvedValue(mockProducts)

         // Appel à la fonction getAllProducts() avec req et res
         await getAllProducts(req, res)

         // Vérification que la fonction find() de Product à été appelée
         expect(Product.find).toHaveBeenCalled()
         // Vérification que la fonction res.json() a été appelée avec les données de mockProducts
         expect(res.json).toHaveBeenCalledWith(mockProducts)
      }) // /it

      it('should handle errors', async () => {
         // Mock de la fonction find() de Product pour retourner une erreur
         Product.find.mockRejectedValue(new Error('Database error'))

         // Appl à la fonction getAllproducts() avec req et res
         await getAllProducts(req, res)

         // Vérification que la fonction res.status() a été appelée avec le code 500
         expect(res.status).toHaveBeenCalledWith(500)
         // Vérification que la fonction res.json() a été appelée avec le message "Database error"
         expect(res.json).toHaveBeenCalledWith({ message: 'Database error' })
      })
   }) // /describe getAllProducts

   describe('getProductById', () => {
      it('should return product when found', async () => {
         const mockProduct = { _id: '1', name: 'Product 1', price: '10', stock: 5 }
         req.params.id = '1'
         // Mock de la fonction findById() de Product pour retourner le produit
         Product.findById.mockResolvedValue(mockProduct)

         await getProductById(req, res)

         // Vérification que la fonction findById() de Product a été appelée avec l'ID '1'
         expect(Product.findById).toHaveBeenCalledWith('1')
         // Vérification que la fonction res.json() a été appelée avec le produit 
         expect(res.json).toHaveBeenCalledWith(mockProduct)
      })

      it('should return 404 when product not found', async () => {
         req.params.id = '1'
         Product.findById.mockResolvedValue(null)

         // Appel de la fonction getProductById() avec req et res
         await getProductById(req, res)

         expect(res.status).toHaveBeenCalledWith(404)
         expect(res.json).toHaveBeenCalledWith({ message: 'Produit non trouvé' })
      })

      it('should handle errors', async () => {
         req.params.id = '1'
         Product.findById.mockRejectedValue(new Error('Database error'))

         await getProductById(req, res)

         expect(res.status).toHaveBeenCalledWith(500)
         expect(res.json).toHaveBeenCalledWith({ message: 'Database error' })
      })

   }) // /describe getProductById

   describe('createNewProduct', () => {
      it('should create new product', async () => {
         // Mock de la fonction save() de Product pour retourner le produit
         const productData = { name: 'Nouveau produit', price: 15, stock: 10 }
         const mockProduct = { _id: '1', ...productData }
         req.body = productData

         // Mock de save
         const mockSave = jest.fn().mockResolvedValue(mockProduct)
         Product.mockImplementation(() => ({ save: mockSave }))

         await createNewProduct(req, res)

         // Vérification que la fonction Product a été appelée avec les données du produit
         expect(Product).toHaveBeenCalledWith(productData)
         expect(mockSave).toHaveBeenCalled()
         expect(res.status).toHaveBeenCalledWith(201)
         expect(res.json).toHaveBeenCalledWith(mockProduct)
      })

      it('should handle validation errors', async () => {
         req.body = { name: 'Nouveau produit', price: 15, stock: 10 }
         const mockSave = jest.fn().mockRejectedValue(new Error('Validation error'))
         Product.mockImplementation(() => ({ save: mockSave }))

         await createNewProduct(req, res)

         expect(res.status).toHaveBeenCalledWith(400)
         expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' })

      })
   }) // /describe create new product

   describe('updateProduct', () => {
      it('should update product', async () => {
         const mockProduct = {
            _id: '1',
            name: 'Ancien produit',
            price: 10,
            stock: 5,
            save: jest.fn().mockResolvedValue({ _id: '1', name: 'Produit à jour', price: 11, stock: 4 })
         }
         req.params.id = '1'
         req.body = { name: 'Produit à jour', price: 11, stock: 4 }
         // On cherche dans la base de données (mockée) un produit, il est trouvé, on le renvoie au code
         Product.findById.mockResolvedValue(mockProduct)

         await updateProduct(req, res)

         expect(Product.findById).toHaveBeenCalledWith('1')
         expect(mockProduct.name).toBe('Produit à jour')
         expect(mockProduct.price).toBe(11)
         expect(mockProduct.stock).toBe(4)
         expect(mockProduct.save).toHaveBeenCalled()
      })

      it('should return 404 when product not found', async () => {
         req.params.id = '1'
         Product.findById.mockResolvedValue(null)

         await updateProduct(req, res)

         expect(res.status).toHaveBeenCalledWith(404)
         expect(res.json).toHaveBeenCalledWith({ message: "Produit non trouvé" })
      })

      it('should handle save errors', async () => {
         const mockProduct = {
            save: jest.fn().mockRejectedValue(new Error('Save error'))
         }
         req.params.id = '1'
         req.body = { name: "Produit à mettre à jour" }
         Product.findById.mockResolvedValue(mockProduct)

         await updateProduct(req, res)

         expect(res.status).toHaveBeenCalledWith(400)
         expect(res.json).toHaveBeenCalledWith({ message: 'Save error' })

      })
   }) // /describe updateById

   describe('deleteProduct', () => {
      it('should delete product', async () => {
         // Mock de la fonction deleteOne() de Product pour retourner null
         const mockProduct = {
            _id: '1',
            deleteOne: jest.fn().mockResolvedValue()
         }
         req.params.id = '1'
         Product.findById.mockResolvedValue(mockProduct)

         await deleteProduct(req, res)

         expect(Product.findById).toHaveBeenCalledWith('1')
         expect(mockProduct.deleteOne).toHaveBeenCalled()
         expect(res.json).toHaveBeenCalledWith({ message: "Produit supprimé" })
      })

      it('should return 404 when product not found', async () => {
         req.params.id = '1'
         Product.findById.mockResolvedValue(null)

         await deleteProduct(req, res)

         expect(res.status).toHaveBeenCalledWith(404)
         expect(res.json).toHaveBeenCalledWith({ message: 'Produit non trouvé' })
      })

      it('should handle delete errors', async () => {
         const mockProduct = {
            deleteOne: jest.fn().mockRejectedValue(new Error('Delete error'))
         }
         req.params.id = '1'
         Product.findById.mockResolvedValue(mockProduct)

         await deleteProduct(req, res)

         expect(res.status).toHaveBeenCalledWith(500)
         expect(res.json).toHaveBeenCalledWith({ message: 'Delete error' })
      })
   })

}) // /describe Products Controller