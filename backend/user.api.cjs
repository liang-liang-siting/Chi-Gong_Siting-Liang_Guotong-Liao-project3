const express = require('express');
const router = express.Router();
const UserModel = require('./db/user.model.cjs');

router.get('/', function(request, response) {
    const startOfUsername = request.query.startOfUsername;

    if (startOfUsername) {
        const foundUsers = UserModel.getUserByUsername(startOfUsername);
        return response.json(foundUsers);
    } else {
        return response.json(UserModel.getAllUser());
    }
});

router.get('/:username', function(request, response) {
    const username = request.params.username;
    const user = UserModel.getUserByUsername(username);

    if (user) {
        return response.json(user);
    } else {
        return response.status(404).json({ message: "User not found." });
    }
});

router.post('/login', async function(request, response) {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).json({ message: "Missing username or password." });
    }

    const user = await UserModel.getUserByUsername(username);
    console.log(user);

    if (!user || user.password !== password) {
        return response.status(401).json({ message: "Invalid username or password." });
    }

    // Set user session cookie
    response.cookie('userSession', username, { httpOnly: true });
    response.json({ message: "Login successful", username: user.username });
});

router.post('/register', async function(request, response) {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).json({ message: "Missing username or password." });
    }

    const existingUser = await UserModel.getUserByUsername(username);
    if (existingUser) {
      return response.status(400).json({ message: "Username already exists." });
    }

    try {
      const registerResponse = await UserModel.insertUser({ username, password });
      return response.status(200).json({ message: "Registration successful", username: username, response: registerResponse });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "An error occurred while registering." });
    }
});

router.post('/logout', function (request, response) {
    // Clear user session cookie
    response.clearCookie('userSession');
    response.json({ message: "Logout successful" });
});


module.exports = router;
