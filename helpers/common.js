const bcrypjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const encryptPassword = async(password) => {
    const salt = bcrypjs.genSaltSync();
    return bcrypjs.hashSync(password, salt);
}

const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('The token could not be generated correctly');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    encryptPassword,
    generateJWT
}