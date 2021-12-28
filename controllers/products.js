const { response } = require('express');
const { Product } = require('../models');

const getProducts = async(req, res = response) => {
    try {
        const {limit = 5, from = 0} = req.query;
        const query = {status: true};

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(Number(from))
                .limit(Number(limit))
        ]);

        res.json({
            total,
            products
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Products could not be retrieved correctly',
        });
    }
}

const getProduct = async(req, res = response) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('user', 'name').populate('category', 'name');

        if(product.status === false){
            return res.status(400).json({
                message: 'The product is blocked, please contact your administrator'
            });
        }

        res.json(product);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Product could not be retrieved',
        });
    }
}

const createProduct = async(req, res = response) => {
    try {
        const {status, user, ...body} = req.body;

        const productDB = await Product.findOne({name: body.name});
        if(productDB){
            return res.status(400).json({
                message: `The product ${name} already exists`
            });
        }

        const data = {
            ...body,
            name: body.name.toUpperCase(),
            user: req.user._id
        }
        
        const product = new Product(data);
        await product.save();
        
        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Product could not be saved correctly',
        });
    }
}

const updateProduct = async(req, res = response) => {
    try {
        const { id } = req.params;
        let {status, user, ...data} = req.body;

        data.user = req.user._id;

        const product = await Product.findByIdAndUpdate(id, data, {new: true});

        res.json(product);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Product could not be updated correctly',
        });
    }
}

const deleteProduct = async(req, res = response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, {status: false});

        res.json(product);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Product could not be deleted correctly',
        });
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}