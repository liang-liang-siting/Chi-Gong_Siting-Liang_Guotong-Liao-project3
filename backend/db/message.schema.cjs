const Schema = require('mongoose').Schema;

module.exports = new Schema({
    // for identifying the password
    serviceUrl: {
        type: String,
        required: true,
    },
    // display name of the sender
    senderUserName: {
        type: String,
        required: true,
    },
    // display name of the receiver
    receiverUserName: {
        type: String,
        required: true,
    },
    // seems unnecessary
    sharingTime: {
        type: Date,
        default: Date.now
    }
}, { collection: 'message' });
