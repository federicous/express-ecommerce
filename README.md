# Express Ecommerce

API RESTful para Ecommerce implementado con Node.js y Express

## Características
- Ingreso con usuario y contrseña
- Registro de usuarios
- Autorización basada en JWT (Json Web Token)
- Base de datos configurable MongoDB / SQLite / MySQL
- Chat implementado con Websockets
- Vistas implementadas con EJS
- Avisos por correo para registro de usuario y para ordenes generadas


## Dependencias

Dillinger is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.

| Paquete | Version |
| ------ | ------ |
    |bcryptjs |^2.4.3|
    |connect-mongo |^4.6.0|
    |cookie-parser |^1.4.6|
    |dotenv |^10.0.0|
    |ejs |^3.1.8|
    |express |^4.17.1|
    |express-jwt |^6.1.0|
    |express-session |^1.17.2|
    |joi |^17.5.0|
    |jsonwebtoken |^8.5.1|
    |knex |^0.95.15|
    |mongodb |^4.3.1|
    |mongoose |^6.1.5|
    |mysql |^2.18.1|
    |nodemailer |^6.7.5|
    |passport |^0.5.2|
    |passport-local |^1.0.0|
    |pino |^7.11.0|
    |pino-pretty |^7.6.1|
    |socket.io |^4.4.0|
    |sqlite3 |^5.0.2|
    |uuidv4 |^6.2.12|

## Installation

Express Ecommerce requires [Node.js](https://nodejs.org/) v16.14.0+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd express-ecommerce
npm i
npm run start
```
