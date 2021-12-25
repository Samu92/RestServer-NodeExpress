const { response } = require('express');

const getUsers = (req, res = response) => {
    const {page = 1, limit = 5} = req.query;

    res.json({
        msg: 'get API - controller',
        page,
        limit
    });
}

const postUser = (req, res = response) => {
    const {name, age} = req.body;

    res.json({
        msg: 'post API - controller',
        name,
        age
    });
}

const putUser = (req, res = response) => {
    const { id } = req.params;

    res.json({
        msg: 'put API - controller',
        id
    });
}

const deleteUser = (req, res = response) => {
    res.json({
        msg: 'delete API - controller'
    });
}

const patchUser = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser,
    patchUser
}