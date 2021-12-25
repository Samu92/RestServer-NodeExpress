const bcrypjs = require('bcryptjs');

const encryptPassword = async(password) => {
    const salt = bcrypjs.genSaltSync();
    return bcrypjs.hashSync(password, salt);
}

module.exports = {
    encryptPassword
}