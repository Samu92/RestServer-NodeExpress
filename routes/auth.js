const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.post('/login', 
[
    check('email', 'The email is not valid').isEmail(),
    check('password', 'The password is mandatory').not().isEmpty(),
    validateFields
],
login);

router.post('/google', 
[
    check('id_token', 'The google token is mandatory').not().isEmpty(),
    validateFields
],
googleSignIn);

module.exports = router;