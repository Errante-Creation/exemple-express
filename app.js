const express = require('express')
const app = express()
const port = 3000

// Importer la connexion à mongoDB
require('./db')

// Middleware pour parser le JSON
app.use(express.json())

// intégrer les routes
const productsRoutes = require('./routes/productsRoutes')
const usersRoutes = require('./routes/usersRoutes')

app.use('/api/products', productsRoutes)
app.use('/api/users', usersRoutes)



app.get('/', (req, res) => {
   res.send("Il n'y a rien à voir ici !")
})

app.listen(port, () => console.log('Serveur démarré sur http://localhost:3000'))