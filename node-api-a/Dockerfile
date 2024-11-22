# Utiliser une image Node.js officielle
FROM node:20

# Créer un dossier de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port (doit correspondre au PORT dans votre .env)
EXPOSE ${PORT}

# Démarrer l'application
CMD ["npm", "start"]
