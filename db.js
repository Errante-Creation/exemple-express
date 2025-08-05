const mongoose = require('mongoose')

const dbURI = "mongodb+srv://cours2025:pass1234@cluster0.8fmj9is.mongodb.net/cours2025?retryWrites=true&w=majority&appName=Cluster0" // Utilisez les infos fournies par MongoDB Atlas

mongoose.connect(dbURI)
   .then(() => console.log("Connexion à MongoDB réussie !"))
   .catch(err => console.error("Erreur de connexion à MongoDB :", err))

//  Si vous n'intégrez pas le code dans app.js, on fait l'export
module.exports = mongoose.connection 