const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const validateJwt = async(req = request, res = response, next) => {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({
            message: 'There is no token in the request'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        const user = await User.findById(uid);

        if(!user){
            return res.status(401).json({
                message: 'The token is not valid - the user does not exists in database'
            });
        }

        if(!user.status){
            return res.status(401).json({
                message: 'The token is not valid - user with status false'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'The token is not valid'
        });
    }
}

module.exports = {
    validateJwt
}