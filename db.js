const mongoose = require('mongoose')

const dbURI = process.env.MONGO_URI // Utilisez les infos fournies par MongoDB Atlas

mongoose.connect(dbURI)
   .then(() => console.log("Connexion à MongoDB réussie !"))
   .catch(err => console.error("Erreur de connexion à MongoDB :", err))

//  Si vous n'intégrez pas le code dans app.js, on fait l'export
module.exports = mongoose.connection 