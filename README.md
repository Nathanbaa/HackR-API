# HackR-API

## Cloner le projet

`git clone https://github.com/Nathanbaa/HackR-API.git`

## Étapes d'installation

0. Se déplacer dans le projet :
   `cd HackR-API`
1. Installer les dépendances principales :
   `npm install`
2. Installer Nodemailer :
   `npm install nodemailer`
3. Créer un fichier `.env` :
   - Copier le fichier `.env.example` et configurez les variables nécessaires dans `.env` :
     `cp .env.example .env`
   - Remplissez les valeurs dans le fichier `.env` selon votre configuration.

## Lancer l'API

`npm run start`

## Liens

### En local

**Accueil:**
http://localhost:3000/

**Documentation swagger:**
http://localhost:3000/api-docs/#/

**S'inscrire en tant que user:** _(prénom, email, mot de passe)_
http://localhost:3000/auth/register

**Se connecter:**
http://localhost:3000/auth/login

**Se déconnecter:**
http://localhost:3000/auth/logout

### En ligne

**Accueil:**
http://nathan.bastard.angers.mds-project.fr/HackR-API

**Documentation swagger:**
http://nathan.bastard.angers.mds-project.fr/api-docs/#/

**S'inscrire en tant que user:** _(prénom, email, mot de passe)_
http://nathan.bastard.angers.mds-project.fr/auth/register

**Se connecter:**
http://nathan.bastard.angers.mds-project.fr/auth/login

**Se déconnecter:**
http://nathan.bastard.angers.mds-project.fr/auth/logout

## Informations de connexion

### User

Email: `user@mail.com`
Mot de passe: `mdpUser`

### Admin

Se rapprocher de l'auteur du repo

## Fonctionnalités

### **Public Routes (Accessible by Admin and User):**

<br>
GET /public/features
Description: Lists all available public routes.

GET /public/features/generate-secured-password
Description: Generates a random secured password using crypto.

GET /public/features/generate-fictive-identity
Description: Generates a fake identity with name, email, phone, address, birthdate, and avatar using Faker.js.

GET /public/features/random-picture
Description: Fetches a random image URL from 'thispersondoesnotexist.com' API.

POST /public/features/verify-email
Description: Verifies the existence of an email address using the Hunter.io API.

POST /public/features/check-common-password
Description: Verifies if a password is too common by checking it against a list of common passwords.

POST /public/features/domain-info
Description: Retrieves subdomains associated with a given domain using the SecurityTrails API.

GET /public/features/crawl-person
Description: Fetches information about a person based on their name and additional details using SerpAPI.

POST /public/features/ddos-simulation
Description: Initiates a DDoS simulation against the specified domain using worker threads.
<br>

### **Private Routes (Accessible only by Admin):**

<br>
GET /private/home
Description: "Hello, you are an Admin!."

POST /private/features/email-spammer
Description: Sends a certain number of emails to a given address with the provided content.

## Auteur

BASTARD Nathan - M1 FullStack
