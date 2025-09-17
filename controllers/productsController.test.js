// Importer les fonctions du contrôleur à tester
const { getAllProducts, getProductById } = require('./productsController')
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
         exepct(Product.findById).toHaveBeenCalledWith('1')
         // Vérification que la fonction res.json() a été appelée avec le produit 
         expect(res.json).toHaveBeenCalledWith(mockProduct)
      })
   })

}) // /describe Products Controller