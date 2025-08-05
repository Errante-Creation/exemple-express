const jwt = require('jsonwebtoken')

const JWT_SECRET = "maSuperCleSecreteQuiNeSeraPasTrouvéeParUnHacker"

const authMiddleware = (req, res, next) => {
   const authHeader = req.headers.authorization

   if (!authHeader || !authHeader.startWith('Bearer ')) {
      return res.status(401).json({ message: "Accès refusé. Token manquant." })
   }

   const token = authHeader.split(' ')[1]

   try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
      next()      
   } catch (err) {
      res.status(401).json({ message: "Token invalide ou expiré."})
   }
}

module.exports = authMiddleware