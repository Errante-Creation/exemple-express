# Gestion de comptes et d'authentification
On ne doit JAMAIS stocker un mot de passe en clair. Vous devez hacher les mots de passe avec la bibliothèque `bcrypt`.

Pour cela, vous devez d'abord commencer par intégrer bcrypt aux dépendances de votre projet grâce à la commande :
```bash
npm install bcrypt
```

Pour l'authentification des utilisateurs, vous allez devoir gérer des jetons d'authentification grâce aux jetons : JSON Web Token (jwt)
```bash
npm install jsonwebtoken
```