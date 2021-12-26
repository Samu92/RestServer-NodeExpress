const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generateJWT } = require('../helpers/common');
const { googleVerify } = require('../helpers/googleVerify');
const User = require('../models/user');

const login = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'User / password are not valid - email'
            });
        }

        // User status check
        if (!user.status) {
            return res.status(400).json({
                message: 'User / password are not valid - status: false'
            });
        }

        // Verify password
        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                message: 'User / password are not valid - password'
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error - Please contact with an administrator',
        });
    }
}

const googleSignIn = async(req, res = response) => {
    const {id_token} = req.body;

    try {
        const {name, image, email} = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            const data = {
                name,
                email,
                password: 'test',
                role: 'USER_ROLE',
                image,
                google: true
            };

            user = new User(data);
            await user.save();
        }

        if(!user.status){
            return res.status(401).json({
                message: 'User blocked, please contact your administrator'
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });     
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Google token could not be verified',
        });
    }
}

module.exports = {
    login,
    googleSignIn
}