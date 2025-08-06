const User = require('../models/usersModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
   const { username, password, email } = req.body
   try {
      const user = await User.findOne({ $or: [{ email }, { username }] })
      // const user = await User.findOne({ email })

      if (user) res.status(200).json({ message: "Vous ne pouvez pas vous inscrire avec ces informations" })

      // Créer l'utilisateur, pas besoin de hacher le MDP, puisque le middleware mongoose s'en charge
      const newUser = new User({ username, email, password })
      await newUser.save()

      // on va connecter directement l'utilisateur
      // On génère un JETON d'authentification
      const token = jwt.sign(
         {
            id: newUser._id,
            username: newUser.username
         },
         process.env.JWT_SECRET,
         { expiresIn: '1h' }
      )

      // On renvoie à l'utilisateur les données de l'user ET le token
      res.status(201).json({
         message: "Utilisateur créé avec succès",
         user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
         },
         token
      })

   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.login = async (req, res) => {
   const { email, password } = req.body

   try {
      // Vérifier que le mail est bien lié à un compte
      const user = await User.findOne({ email })

      if(!user) return res.status(401).json({message: "Identifiants invalides"})

      // Vérifier si le mot de passe correspond
                  // password = mot de passe en clair que l'user vient d'envoyer 
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch) return res.status(401).json({message: "Identifiants invalides"})

      // Si le mot de passe correspond, on créé le token et on le renvoi à l'utilisateur
      const token = jwt.sign(
         { id: user._id, username: user.username},
         process.env.JWT_SECRET,
         { expiresIn: "1h"}
      )

      // Envoyer le token à l'utilisateur
      res.json({token})
   } catch (err) {
      res.status(500).json({message: err.message})
   }
}