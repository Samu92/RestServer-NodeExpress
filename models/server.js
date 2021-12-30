const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const {createServer} = require('http');

const { databaseConnection } = require('../database/config');
const { socketController } = require('../sockets/socketController');

class Server 
{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);
        this.paths = {
            auth: '/api/auth',
            search: '/api/search',
            upload: '/api/upload',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users'
        }

        // Database connection
        this.databaseConnection();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();

        // Sockets
        this.socketsEvents();
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

        // File upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }
    
    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.upload, require('../routes/upload'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.users, require('../routes/users'));
    }

    socketsEvents() {
        this.io.on("connection", (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;