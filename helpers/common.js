const bcrypjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const {v4: uuidv4} = require('uuid');

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

const uploadFile = (files, allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') =>  {
    return new Promise((resolve, reject) => {
        const {file} = files;
        const shortName = file.name.split('.');
        const extension = shortName[shortName.length - 1];
    
        if(!allowedExtensions.includes(extension))
        {
            return reject(`The file extension ${extension} is not allowed (${allowedExtensions})`);
        }
    
        const tempName = uuidv4() + '.' + extension;
      
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);
      
        file.mv(uploadPath, (err) => {
          if (err) {
            return reject(err);
          }
      
          resolve(tempName);
        });
    });  
}

module.exports = {
    encryptPassword,
    generateJWT,
    uploadFile
}