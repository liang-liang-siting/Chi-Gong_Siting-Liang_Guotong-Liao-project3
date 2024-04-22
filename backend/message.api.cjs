const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const MessageService = require('./db/message.model.cjs');
const PasswordService = require('./db/password.model.cjs');

// Get messages by receiver username
router.get('/:receiverUserName', async function(request, response) {
    try {
        const receiverUserName = request.params.receiverUserName;
        const messages = await MessageService.getMessageByReceiverUserName(receiverUserName);
        response.json(messages);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Add new message
router.post('/add', async function(request, response) {
    try {
        const id = uuid.v4();
        const message = request.body;
        const result = await MessageService.insertMessage({
            ...message,
            id: id,
        });
        response.status(201).json(result);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.post('/accept', async function(request, response) {
    try {
        const url = request.body.url;
        const id = request.body.id;
        const senderUsername = request.body.senderUsername;
        const receiverUsername = request.body.receiverUsername;
        const passwordEntry = await PasswordService.getPasswordByName(url, senderUsername);
        const newPassWordEntry = {
            ...passwordEntry,
            sharingWith: [...passwordEntry.sharingWith, receiverUsername],
        };
        await PasswordService.updatePassword(newPassWordEntry);
        // delete the message
        await MessageService.deleteMessage(id);
        response.status(200).json({ message: 'Password shared successfully' });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Delete message by id
router.delete('/delete/:id', async function(request, response) {
    try {
        const id = request.params.id;
        const result = await MessageService.deleteMessage(id);
        response.json(result);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;
