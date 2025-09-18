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

      })

      it('should handle save errors', async () => {
         
      })

   }) // /register
})