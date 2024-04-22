const Schema = require('mongoose').Schema;

module.exports = new Schema({
    id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    // display name of the sender
    senderUsername: {
        type: String,
        required: true,
    },
    // display name of the receiver
    receiverUsername: {
        type: String,
        required: true,
    },
    // seems unnecessary
    sharingTime: {
        type: Date,
        default: Date.now
    }
}, { collection: 'message' });
