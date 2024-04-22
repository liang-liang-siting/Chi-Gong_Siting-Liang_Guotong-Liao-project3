const Schema = require('mongoose').Schema;

module.exports = new Schema({
    username: {
        type: String,
        required: true,
    },
    url: {
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
    },
    sharedWith: {
        // list of usernames
        type: [String],
        default: []
    }
}, { collection: 'storedpassword' });
