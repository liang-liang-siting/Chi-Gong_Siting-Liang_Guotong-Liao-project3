const Schema = require('mongoose').Schema;

module.exports = new Schema({
    serviceName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastUpdateTime: {
        type: Date,
        default: Date.now
    }
}, { collection: 'storedpassword' });
