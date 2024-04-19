const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserModel = require('./db/user.model.cjs');

// Will be replaced with a ENV variable in production
const SECRET_KEY = 'fowijf9014w80f23ofh0w9f';

// Middleware to check if user is authenticated
const authHandler = (request, response, next) => {
  const token = request.cookies.token;
  if (!token) {
      return response.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, SECRET_KEY, function(err, decoded) {
      if (err) {
          return response.status(401).json({ message: "Unauthorized" });
      }
      request.username = decoded.username;
      next();
  });
}

// Will be called when the page is refreshed
router.get('/authenticate', authHandler, async function(request, response) {
    const userName = request.username;
    response.json({ username: userName });
});

// Used to get all users for password sharing
router.get('/', authHandler, async function(request, response) {
    const users = await UserModel.getAllUser();
    response.json(users);
});

// TODO: delete this method, seems unnecessary
router.get('/:username', authHandler, function(request, response) {
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
        return response.status(500).json({ message: "Invalid username or password." });
    }

    // Set user session cookie
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '14d' });
    response.cookie('token', token);
    response.json({ message: "Login successful", username });
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
    response.clearCookie('token');
    response.json({ message: "Logout successfully" });
});


module.exports = router;
