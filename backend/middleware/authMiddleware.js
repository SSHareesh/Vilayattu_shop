const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Check for the Authorization header and ensure it is a Bearer token.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // 2. Extract the token from the 'Bearer <token>' string.
    const token = authHeader.split(' ')[1];

    // 3. Verify the token's signature and check if it has expired.
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the decoded user information to the request object.
    req.user = decodedPayload.user;

    // 5. If the token is valid, pass control to the next function in the chain (the route handler).
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token is invalid or expired' });
  }
};

module.exports = { protect };

