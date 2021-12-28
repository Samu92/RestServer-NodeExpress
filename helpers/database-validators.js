const { User, Role, Category, Product } = require('../models');

const isValidRole = async(role = '') => {
    const roleExists = await Role.findOne({role});
    if(!roleExists){
        throw new Error(`Role ${role} is not valid`);
    }
}

const emailExists = async(email = '') => {
    const emailExists = await User.findOne({ email });
    if(emailExists){
        throw new Error(`Email ${email} already exists`);
    }
}

const userExistsById = async(id = '') => {
    const userExists = await User.findById(id);
    if(!userExists){
        throw new Error(`User with ${id} does not exist`);
    }
}

const categoryExistsById = async(id = '') => {
    const categoryExists = await Category.findById(id);
    if(!categoryExists){
        throw new Error(`Category with ${id} does not exist`);
    }
}

const productExistsById = async(id = '') => {
    const productExists = await Product.findById(id);
    if(!productExists){
        throw new Error(`Product with ${id} does not exist`);
    }
}

module.exports = {
    isValidRole,
    emailExists,
    userExistsById,
    categoryExistsById,
    productExistsById
}