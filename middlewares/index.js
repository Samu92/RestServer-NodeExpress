const validateFields  = require('../middlewares/validateFields');
const validateJwt = require('../middlewares/validateJwt');
const validateRole = require('../middlewares/validateRole');
const validateFile = require('../middlewares/validateFile');

module.exports = {
    ...validateFields,
    ...validateJwt,
    ...validateRole,
    ...validateFile
}