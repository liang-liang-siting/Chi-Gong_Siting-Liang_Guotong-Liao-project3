const express = require('express');
const router = express.Router();

const users = [
    {username: 'hunter', password: 'hunter123'},
    {username: 'alex', password: 'alex456'}
];

router.get('/', function(request, response) {
    const startOfUsername = request.query.startOfUsername;

    if (startOfUsername) {
        const foundUsers = users.filter(user => user.username.startsWith(startOfUsername));
        return response.json(foundUsers);
    } else {
        return response.json(users);
    }
});

router.get('/:username', function(request, response) {
    const username = request.params.username;
    const user = users.find(user => user.username === username);

    if (user) {
        return response.json(user);
    } else {
        return response.status(404).json({ message: "User not found." });
    }
});

router.post('/login', function(request, response) {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).json({ message: "Missing username or password." });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return response.status(401).json({ message: "Invalid username or password." });
    }

    response.json({ message: "Login successful", username: user.username });
});

router.post('/register', function(request, response) {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).json({ message: "Missing username or password." });
    }

    if (users.some(u => u.username === username)) {
        return response.status(409).json({ message: "Username already exists." });
    }

    users.push({
        username: username,
        password: password
    });

    response.status(201).json({ message: "Registration successful", username: username });
});

router.post('/logout', function (request, response) {
    // Clear user session cookie
    response.clearCookie('userSession');
    response.json({ message: "Logout successful" });
});


// router.post('/login', function(request, response) {
//     const { username, password } = request.body;

//     console.log('Login request received. Username:', username, 'Password:', password);

//     if (!username || !password) {
//         return response.status(400).json({ message: "Missing username or password." });
//     }

//     const user = users.find(u => u.username === username && u.password === password);

//     if (!user) {
//         return response.status(401).json({ message: "Invalid username or password." });
//     }

//     response.json({ message: "Login successful", username: user.username });
// });

// router.post('/register', function(request, response) {
//     const { username, password } = request.body;

//     console.log('Register request received. Username:', username, 'Password:', password);

//     if (!username || !password) {
//         return response.status(400).json({ message: "Missing username or password." });
//     }

//     if (users.some(u => u.username === username)) {
//         return response.status(409).json({ message: "Username already exists." });
//     }

//     users.push({
//         username: username,
//         password: password
//     });

//     response.status(201).json({ message: "Registration successful", username: username });
// });

module.exports = router;
