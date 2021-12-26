const { response } = require("express");
const { route } = require("express/lib/application");
const role = require("../models/role");

const isAdminRole = (req, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            message: 'The token has not been verified correctly'
        });
    }

    const {role, name} = req.user;
    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
            message: `${name} is not an administrator - the action is not allowed`
        });
    }
    
    next();
}

const hasRoles = (...roles) => {
    return (req, res = response, next) => {
        console.log(roles, req.user.role);

        if (!req.user) {
            return res.status(500).json({
                message: 'The token has not been verified correctly'
            });
        }

        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                message: `The service requires one of these roles ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    isAdminRole,
    hasRoles
}