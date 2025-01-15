# HackR-API

## Clone project

`git clone https://github.com/Nathanbaa/HackR-API.git`

## Installation steps

`cd HackR-API`

1. Install the main dependencies :
   `npm install`
2. Install Nodemailer :
   `npm install nodemailer`
3. Create a file `.env` :
   - Copy the file `.env.example` and configure the necessary variables in `.env` :
     `cp .env.example .env`
   - Fill in the values in the `.env` according to your configuration.

## Run API

`npm run start`

## Some links

### Local

**Home:**
[http://localhost:3000/](http://localhost:3000/)

**Swagger Documentation:**
[http://localhost:3000/api-docs/#/](http://localhost:3000/api-docs/#/)

**Register as a user:** _(prénom, email, mot de passe)_
[http://localhost:3000/auth/register](http://localhost:3000/auth/register)

**Login:**
[http://localhost:3000/auth/login](http://localhost:3000/auth/login)

**Disconnexion:**
[http://localhost:3000/auth/logout](http://localhost:3000/auth/logout)

## Login information

### User

Register or with :
email: user@mail.com
password: mdpUser

### Admin

Depending on what you specify in the variables of the .env

## Features

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
