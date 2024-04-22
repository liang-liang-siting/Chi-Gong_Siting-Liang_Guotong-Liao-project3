const express = require('express');
const router = express.Router();
const PasswordService = require('./db/password.model.cjs');
const { authHandler } = require('./auth.cjs');

router.get('/:username', authHandler, async function(request, response) {
    const username = request.params.username;

    if (!username) {
        return response.status(400).json({ message: "Missing username." }); 
    }

    try {
        const foundPasswords = await PasswordService.getPasswordsByUsername(username);
        return response.json(foundPasswords);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while retrieving passwords." });
    }
});


router.post('/add', async function(request, response) {
    const { url, password, username } = request.body; 

    try {
        if (!url || !password || !username) {
            return response.status(400).json({ message: "Missing serviceName, password, or username." });
        }

        const existingPassword = await PasswordService.getPasswordByName(url, username);
        if (existingPassword) {
            return response.status(409).json({ message: "URL already exists." });
        }

        const serviceToAdd = {
            url: url,
            password: password,
            username: username, 
            lastUpdateTime: new Date().toLocaleString()
        };

        await PasswordService.insertPassword(serviceToAdd);
        return response.status(201).json({ message: "Password added successfully", serviceName: url });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while adding password." });
    }
});

router.put('/update', async function(request, response) {
    // const serviceName = decodeURIComponent(request.params.serviceName); 
    const url = request.body.url;
    const username = request.body.username; 

    try {
        const existingPassword = await PasswordService.getPasswordByName(url, username);
        if (!existingPassword) {
            return response.status(404).json({ message: "Password not found." });
        }

        if (existingPassword.username !== username) {
            return response.status(403).json({ message: "You are not authorized to update this password." });
        }

        const updatedPassword = await PasswordService.updatePassword(request.body); 
        return response.json({ message: 'Password updated successfully', password: updatedPassword });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while updating password." });
    }
});


router.delete('/delete', async function(request, response) {
    const username = request.body.username; 
    const url = request.body.url;

    try {
        const existingPassword = await PasswordService.getPasswordByName(url, username);
        if (!existingPassword) {
            return response.status(404).json({ message: "Password not found." });
        }

        if (existingPassword.username !== username) {
            return response.status(403).json({ message: "You are not authorized to delete this password." });
        }

        await PasswordService.deletePassword(url, username); // Pass username as argument
        return response.json({ message: 'Password deleted successfully' });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while deleting password." });
    }
});


module.exports = router;
