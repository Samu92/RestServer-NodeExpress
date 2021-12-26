const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, putUser, postUser, deleteUser, patchUser } = require('../controllers/users');

const {
    validateFields, validateJwt, isAdminRole, hasRoles
} = require('../middlewares');

const { isValidRole, emailExists, userExistsById } = require('../helpers/database-validators');

const router = Router();

router.get('/', getUsers);

router.put('/:id',[
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(isValidRole),
    validateFields
], putUser);

router.post('/', [
    check('name', 'The name is mandatory').not().isEmpty(),
    check('password', 'The password should have more than 6 characters').isLength({ min: 6 }),
    check('email', 'The email is not valid').isEmail(),
    check('email').custom(emailExists),
    check('role').custom(isValidRole),
    validateFields
], postUser);

router.delete('/:id', [
    validateJwt,
    isAdminRole,
    hasRoles('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'The id is not valid').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], deleteUser);

router.patch('/', patchUser);

module.exports = router;