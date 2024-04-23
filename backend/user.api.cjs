const express = require('express');
const router = express.Router();
const UserService = require('./db/user.model.cjs');
const authHandler = require('./auth.cjs').authHandler;
const getToken = require('./auth.cjs').getToken;

// Will be called when the page is refreshed
router.get('/authenticate', authHandler, async function(request, response) {
    const userName = request.username;
    response.json({ username: userName });
});

// Used to get all users for password sharing
router.get('/', authHandler, async function(request, response) {
    const users = await UserService.getAllUser();
    response.json(users);
});

router.get('/:username', authHandler, async function(request, response) {
    const username = request.params.username;
    const user = await UserService.getUserByUsername(username);
    console.log(user);
    response.json(user);
});

router.post('/login', async function(request, response) {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).json({ message: "Missing username or password." });
    }

    const user = await UserService.getUserByUsername(username);
    console.log(user);

    if (!user || user.password !== password) {
        return response.status(500).json({ message: "Invalid username or password." });
    }

    // Set user session cookie
    const token = getToken(username);
    response.cookie('token', token);
    response.json({ message: "Login successful", username });
});

router.post('/register', async function(request, response) {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).json({ message: "Missing username or password." });
    }

    const existingUser = await UserService.getUserByUsername(username);
    if (existingUser) {
      return response.status(400).json({ message: "Username already exists." });
    }

    try {
      const registerResponse = await UserService.insertUser({ username, password });
      return response.status(200).json({ message: "Registration successful", username: username, response: registerResponse });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "An error occurred while registering." });
    }
});

router.post('/logout', function (request, response) {
    // Clear user session cookie
    response.clearCookie('token');
    response.json({ message: "Logout successfully" });
});


module.exports = router;
