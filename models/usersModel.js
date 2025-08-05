const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
   username: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis"],
      unique: true,
      trim: true,
      minlength: [3, "Le nom d'utilisateur doit contenir au moins 3 caractères"],
      maxlength: [30, "Le nom d'utilisateur ne doit pas dépasser 30 caractères"],
      match: [/^[a-zA-Z0-9_]+$/, "Le nom d'utilisateur ne peut contenir que des chiffres, des lettres et underscores"]
   },
   email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/, "Veuillez entrer un mail valide"]
   },
   password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"]
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
   updatedAt: {
      type: Date,
      default: Date.now
   }
})

// Index pour les performances
// userSchema.index({ email: 1})
// userSchema.index({ username: 1})

// Middleware pour hacher le mot de passe
// méthode pre() => se lance avant une action prédéfinie
userSchema.pre('save', async function (next) {
   // On met à jour la date à laquelle la mise à jour a été effectuée
   this.updatedAt = Date.now()

   // Si le mot de passe n'a pas été modifé, on passe simplement à la suite
   if (!this.isModified('password')) return next()

   try {
      const salt = await bcrypt.genSalt(parseInt(12))
      this.password = await bcrypt.hash(this.password, salt)
      next()
   } catch (err) {
      next(err)
   }
})

module.exports = mongoose.model("User", userSchema)