const { register, login } = require('./usersController')
const User = require('../models/usersModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

jest.mock('../models/usersModel')
jest.mock('jsonwebtoken')
jest.mock('bcrypt')

describe('Users Controller', () => {
   describe('register', () => {
      let req, res;

      beforeEach(() => {
         req = {
            body: {
               username: 'testuser',
               email: 'test@mail.com',
               password: 'password123'
            }
         }
         res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
         }
      }) // /beforeEach

      afterEach(() => {
         jest.clearAllMocks()
      })

      it('should register new user successfully', async () => {
         process.env.JWT_SECRET = 'test-secret'
         const mockNewUser = {
            _id: 'user123',
            username: 'testuser',
            email: 'test@mail.com',
            save: jest.fn().mockResolvedValue()
         }

         User.findOne.mockResolvedValue(null)
         User.mockImplementation(() => mockNewUser)
         jwt.sign.mockReturnValue('mock-token')

         await register(req, res)

         expect(User.findOne).toHaveBeenCalledWith({ $or: [{ email: 'test@mail.com' }, { username: 'testuser' }] })
         expect(User).toHaveBeenCalledWith({ username: 'testuser', email: 'test@mail.com', password: 'password123' })
         expect(mockNewUser.save).toHaveBeenCalled()
         expect(jwt.sign).toHaveBeenCalledWith(
            {
               id: 'user123',
               username: 'testuser'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
         )
         expect(res.status).toHaveBeenCalledWith(201)
         expect(res.json).toHaveBeenCalledWith({
            message: "Utilisateur créé avec succès",
            user: {
               id: 'user123',
               username: 'testuser',
               email: 'test@mail.com',
            },
            token: 'mock-token'
         })

      })

      it('should return error when user already exists', async () => {
         const existingUser = { _id: 'existing123', email: 'test@mail.com' }
         User.findOne.mockResolvedValue(existingUser)

         await register(req, res)

         expect(res.status).toHaveBeenCalledWith(200)
         expect(res.json).toHaveBeenCalledWith({ message: "Vous ne pouvez pas vous inscrire avec ces informations" })

      })

      it('should handle save errors', async () => {
         const mockNewUser = {
            save: jest.fn().mockRejectedValue(new Error('Save error'))
         }

         User.findOne.mockResolvedValue(null)
         User.mockImplementation(() => mockNewUser)

         await register(req, res)

         expect(res.status).toHaveBeenCalledWith(500)
         expect(res.json).toHaveBeenCalledWith({ message: 'Save error' })
      })

   }) // /register

   describe('login', () => {
      let req, res;

      beforeEach(() => {
         req = {
            body: {
               email: 'test@mail.com',
               password: 'password123'
            }
         }
         res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
         }
         process.env.JWT_SECRET = 'test-secret'
      })

      afterEach(() => {
         jest.clearAllMocks()
      })

      it('should login user and return token when valid credentials', async () => {
         const mockUser = {
            _id: '1',
            username: 'testuser',
            email: 'test@mail.com',
            password: 'hashedpassword'
         }

         User.findOne.mockResolvedValue(mockUser)
         bcrypt.compare.mockResolvedValue(true)
         jwt.sign.mockReturnValue('mock-token')

         await login(req, res)

         expect(User.findOne).toHaveBeenCalledWith({ email: 'test@mail.com' })
         expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword')
         expect(jwt.sign).toHaveBeenCalledWith(
            { id: '1', username: 'testuser' },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
         )
         expect(res.json).toHaveBeenCalledWith({ token: 'mock-token' })
      })

      it('should return error when user not found', async () => {
         User.findOne.mockResolvedValue(null)

         await login(req, res)

         expect(res.status).toHaveBeenCalledWith(401)
         expect(res.json).toHaveBeenCalledWith({ message: "Identifiants invalides" })
      })

      it('should return error when password is incorrect', async () => {
         const mockUser = {
            _id: '1',
            password: 'hashedpassword'
         }

         User.findOne.mockResolvedValue(mockUser)
         bcrypt.compare.mockResolvedValue(false)

         await login(req, res)

         expect(res.status).toHaveBeenCalledWith(401)
         expect(res.json).toHaveBeenCalledWith({ message: "Identifiants invalides" })
      })

      it('should handle database errors', async () => {
         User.findOne.mockRejectedValue(new Error('Database error'))

         await login(req, res)

         expect(res.status).toHaveBeenCalledWith(500)
         expect(res.json).toHaveBeenCalledWith({ message: 'Database error' })
      })

   })
})