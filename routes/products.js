const { Router, response, query } = require('express');
const { check } = require('express-validator');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { productExistsById, categoryExistsById, userExistsById } = require('../helpers/database-validators');
const { validateJwt, validateFields, isAdminRole } = require('../middlewares');

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom(productExistsById),
    validateFields
], getProduct);

router.post('/', [
    validateJwt,
    check('name', 'The name is mandatory').not().isEmpty(),
    check('category', 'The category id is not valid').isMongoId(),
    check('category', 'The category is mandatory').not().isEmpty(),
    check('category').custom(categoryExistsById),
    check('price', 'The price is mandatory').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    validateFields
], createProduct);

router.put('/:id', [
    validateJwt,
    isAdminRole,
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom(productExistsById),
    check('price', 'The price must be a number').isNumeric(),
    check('user', 'The user id is not valid').isMongoId(),
    check('category', 'The category id is not valid').isMongoId(),
    check('user').custom(userExistsById),
    check('category').custom(categoryExistsById),
    validateFields
], updateProduct);

router.delete('/:id', [
    validateJwt,
    isAdminRole,
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom(productExistsById),
    validateFields
], deleteProduct);


module.exports = router;