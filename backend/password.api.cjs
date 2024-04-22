const express = require('express');
const router = express.Router();
const ServiceModel = require('./db/service.model.cjs');

router.get('/', async function(request, response) {
    const username = request.query.username; 

    if (!username) {
        return response.status(400).json({ message: "Missing username." }); 
    }

    try {
        const foundPasswords = await ServiceModel.getPasswordsByUsername(username);
        return response.json(foundPasswords);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while retrieving passwords." });
    }
});


router.post('/add', async function(request, response) {
    const { serviceName, password, username } = request.body; 

    try {
        if (!serviceName || !password || !username) {
            return response.status(400).json({ message: "Missing serviceName, password, or username." });
        }

        const existingPassword = await ServiceModel.getServiceByName(serviceName, username);
        if (existingPassword) {
            return response.status(409).json({ message: "URL already exists." });
        }

        const serviceToAdd = {
            serviceName: serviceName,
            password: password,
            username: username, 
            lastUpdateTime: new Date().toLocaleString()
        };

        const addedPassword = await ServiceModel.insertService(serviceToAdd);
        return response.status(201).json({ message: "Password added successfully", serviceName });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while adding password." });
    }
});

router.put('/update/:serviceName', async function(request, response) {
    const serviceName = decodeURIComponent(request.params.serviceName); 
    const newPassword = request.body.password;
    const username = request.body.username; 

    try {
        const existingPassword = await ServiceModel.getServiceByName(serviceName, username);
        if (!existingPassword) {
            return response.status(404).json({ message: "Password not found." });
        }

        if (existingPassword.username !== username) {
            return response.status(403).json({ message: "You are not authorized to update this password." });
        }

        const updatedPassword = await ServiceModel.updateService(serviceName, newPassword, username); 
        updatedPassword.lastUpdateTime = Date.now(); 
        return response.json({ message: 'Password updated successfully', password: updatedPassword });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while updating password." });
    }
});


router.delete('/delete/:serviceName', async function(request, response) {
    const serviceName = decodeURIComponent(request.params.serviceName); 
    const username = request.body.username; 

    try {
        const existingPassword = await ServiceModel.getServiceByName(serviceName, username);
        if (!existingPassword) {
            return response.status(404).json({ message: "Password not found." });
        }

        if (existingPassword.username !== username) {
            return response.status(403).json({ message: "You are not authorized to delete this password." });
        }

        await ServiceModel.deleteService(serviceName, username); // Pass username as argument
        return response.json({ message: 'Password deleted successfully' });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while deleting password." });
    }
});


module.exports = router;
