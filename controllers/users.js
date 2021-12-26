const { response } = require('express');
const { encryptPassword } = require('../helpers/common');

const User = require('../models/user');

const getUsers = async(req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = {status: true};

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

const postUser = async(req, res = response) => {
    const {name, email, password, role} = req.body;
    const user = new User({name, email, password, role});

    user.password = await encryptPassword(password);

    await user.save();

    res.json(user);
}

const putUser = async(req, res = response) => {
    const { id } = req.params;
    let {_id, password, google, ...rest} = req.body;

    if(password){
        password = await encryptPassword(password);
    }

    const user = await User.findByIdAndUpdate(id, rest);

    res.json(user);
}

const deleteUser = async(req, res = response) => {
    const { id } = req.params;

    //const user = await User.findByIdAndDelete(id);
    const user = await User.findByIdAndUpdate(id, {status: false});
    const authenticatedUser = req.user;

    res.json(user);
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
