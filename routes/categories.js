const { Router, response } = require('express');
const { check } = require('express-validator');
const { validateJwt, validateFields, isAdminRole } = require('../middlewares');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { categoryExistsById } = require('../helpers/database-validators');
const router = Router();

router.get('/', getCategories);

router.get('/:id', [
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields
], getCategory);

router.post('/', 
    [validateJwt,
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields
], createCategory);

router.put('/:id', [
    validateJwt,
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields
], updateCategory);

router.delete('/:id', [
    validateJwt,
    isAdminRole,
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields
], deleteCategory);

module.exports = router;