const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generateJWT } = require('../helpers/common');
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

module.exports = {
    login
}