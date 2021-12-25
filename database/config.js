const mongoose = require('mongoose');

const databaseConnection = async() => 
{
    mongoose.connect(process.env.MONGODB_CNN, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, resp) => {
        if (err) throw err;
        console.log('Connection to database established');
    });
}

module.exports = {
    databaseConnection
}