const express = require('express');
const cors = require('cors');

const { databaseConnection } = require('../database/config')

class Server 
{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usersRoutePath = '/api/users';
        this.authPath = '/api/auth';

        // Database connection
        this.databaseConnection();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    async databaseConnection() {
        await databaseConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Body parse and read
        this.app.use(express.json());
        
        // Public directory
        this.app.use(express.static('public'));
    }
    
    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usersRoutePath, require('../routes/users'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;