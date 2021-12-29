const { Router } = require('express');
const { check } = require('express-validator');
const res = require('express/lib/response');
const { loadFile, updateCloudinaryImage, showImage } = require('../controllers/upload');
const { allowedCollections } = require('../helpers/database-validators');
const { validateFile } = require('../middlewares');

const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.post('/', validateFile, loadFile);

router.put('/:collection/:id', [
    check('id', 'The id is not valid').isMongoId(),
    check('collection').custom(collection => allowedCollections(collection, ['users', 'products'])),
    validateFile,
    validateFields
], updateCloudinaryImage)

router.get('/:collection/:id', [
    check('id', 'The id is not valid').isMongoId(),
    check('collection').custom(collection => allowedCollections(collection, ['users', 'products'])),
    validateFields
], showImage)

module.exports = router;