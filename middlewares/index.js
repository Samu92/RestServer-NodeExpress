const validateFields  = require('../middlewares/validateFields');
const validateJwt = require('../middlewares/validateJwt');
const validateRole = require('../middlewares/validateRole');

module.exports = {
    ...validateFields,
    ...validateJwt,
    ...validateRole
}