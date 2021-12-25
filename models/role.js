const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'Role is mandatory']
    }
});

module.exports = model('Role', RoleSchema);