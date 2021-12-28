const { response } = require('express');
const { Category } = require('../models');

const getCategories = async(req, res = response) => {
    try {
        const { limit = 5, from = 0 } = req.query;
        const query = {status: true};

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .populate('user', 'name')
        ]);

        res.json({
            total,
            categories
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Categories could not be retrieved',
        });
    }
}

const getCategory = async(req, res = response) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id).populate('user', 'name');

        if(category.status === false){
            return res.status(400).json({
                message: 'The category is blocked, please contact your administrator'
            });
        }

        res.json(category);      
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Category could not be retrieved',
        });
    }
}

const createCategory = async(req, res = response) => {

    try {
        const name = req.body.name.toUpperCase();
    
        const categoryDB = await Category.findOne({ name });
        if(categoryDB){
            return res.status(400).json({
                message: `The category ${name} already exists`
            });
        }
    
        const data = {
            name,
            user: req.user._id
        }
    
        const category = new Category(data);
    
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Category could not be saved correctly',
        });
    }
}

const updateCategory = async(req, res = response) => {
    try {
        const { id } = req.params;
        let {status, user, ...data} = req.body;

        data.name = data.name.toUpperCase();
        data.user = req.user._id;

        const category = await Category.findByIdAndUpdate(id, data, {new: true});

        res.json(category);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Category could not be updated correctly',
        });
    }
}

const deleteCategory = async(req, res = response) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, {status: false});

        res.json(category);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Category could not be deleted correctly',
        });
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}