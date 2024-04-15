const express = require('express');
const router = express.Router();

const passwords = [
    { url: 'https://example.com', password: 'password123', lastUpdated: new Date().toLocaleString() },
    { url: 'https://example.net', password: 'password456', lastUpdated: new Date().toLocaleString() }
];

// Get all passwords
router.get('/', (req, res) => {
    res.json(passwords);
});

// Add new URL & password
router.post('/add', (req, res) => {
    const { url, password } = req.body;

    if (!url || !password) {
        return res.status(400).json({ message: "Missing URL or password." });
    }

    // Check if the URL already exists
    const existingPassword = passwords.find(pwd => pwd.url === url);
    if (existingPassword) {
        return res.status(409).json({ message: "URL already exists." });
    }

    // Add the new password to the password list
    passwords.push({ url, password, lastUpdated: new Date().toLocaleString() });

    res.status(201).json({ message: "Password added successfully", url });
});

// Update password by URL
router.put('/update/:url', (req, res) => {
    const url = decodeURIComponent(req.params.url); 
    const newPassword = req.body.newPassword;

    const index = passwords.findIndex(pwd => pwd.url === url);
    if (index === -1) {
        res.status(404).json({ message: 'Password not found' });
    } else {
        passwords[index].password = newPassword;
        passwords[index].lastUpdated = new Date().toLocaleString(); 
        res.json({ message: 'Password updated successfully', password: passwords[index] });
    }
});

// Delete password by URL
router.delete('/delete/:url', (req, res) => {
    const url = decodeURIComponent(req.params.url); 
    const index = passwords.findIndex(pwd => pwd.url === url);
    if (index === -1) {
        res.status(404).json({ message: 'Password not found' });
    } else {
        passwords.splice(index, 1);
        res.json({ message: 'Password deleted successfully' });
    }
});

module.exports = router;
