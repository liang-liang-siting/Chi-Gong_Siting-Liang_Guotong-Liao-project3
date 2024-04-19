const jwt = require('jsonwebtoken');

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

const getToken = (username) => {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: '14d' });
}

module.exports = { authHandler, getToken };
