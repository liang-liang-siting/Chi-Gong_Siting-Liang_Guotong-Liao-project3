const express = require('express');
const router = express.Router();
const ServiceModel = require('./db/service.model.cjs');

router.get('/', async function(request, response) {
    const url = request.query.url;

    if (url) {
        try {
            const foundPasswords = await ServiceModel.getServiceByName(url); 
            return response.json(foundPasswords);
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: "An error occurred while retrieving passwords." });
        }
    } else {
        try {
            const allPasswords = await ServiceModel.getAllServices();
            return response.json(allPasswords);
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: "An error occurred while retrieving passwords." });
        }
    }
});

router.post('/add', async function(request, response) {
    const { serviceName, password } = request.body;

    try {
        if (!serviceName || !password) {
            return response.status(400).json({ message: "Missing URL or password." });
        }

        const existingPassword = await ServiceModel.getServiceByName(serviceName);
        if (existingPassword) {
            return response.status(409).json({ message: "URL already exists." });
        }

        const serviceToAdd = {
            serviceName: serviceName,
            password: password,
            lastUpdateTime: new Date().toLocaleString()
        };

        const addedPassword = await ServiceModel.insertService(serviceToAdd);
        return response.status(201).json({ message: "Password added successfully", serviceName });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while adding password." });
    }
});


router.put('/update/:url', async function(request, response) {
    const url = decodeURIComponent(request.params.url); 
    const newPassword = request.body.password;

    try {
        const existingPassword = await ServiceModel.getServiceByName(url);
        if (!existingPassword) {
            return response.status(404).json({ message: "Password not found." });
        }

        const updatedPassword = await ServiceModel.updateService(url, newPassword);
        return response.json({ message: 'Password updated successfully', password: updatedPassword });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while updating password." });
    }
});

router.delete('/delete/:url', async function(request, response) {
    const url = decodeURIComponent(request.params.url); 

    try {
        const existingPassword = await ServiceModel.getServiceByName(url);
        if (!existingPassword) {
            return response.status(404).json({ message: "Password not found." });
        }

        await ServiceModel.deleteService(url); 
        return response.json({ message: 'Password deleted successfully' });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "An error occurred while deleting password." });
    }
});



module.exports = router;