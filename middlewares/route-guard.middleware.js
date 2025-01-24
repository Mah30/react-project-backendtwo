const jwt = require('jsonwebtoken')

const isAuthenticated = (req, res, next) => {

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token not provided or invalid' });
  }

    try {
      const token = req.headers.authorization.split(' ')[1]; 

      const payload = jwt.verify(token, process.env.TOKEN_SECRET) // decode token and get payload
  
      req.tokenPayload = payload; // to pass the decoded payload to the next route
      next();
    } catch (error) {
        console.error('Authentication error:', error.message);
      // the middleware will catch error and send 401 if: There is no token , Token is invalid, There is no headers or authorization in req (no token)
      if (error.name === 'TokenExpiredError') {

      console.error('Authentication error:', error.message);
      return res.status(401).json({ message: 'Token expired' });

     /*  res.status(401).json({ message: 'token not provided or not valid'}) */
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(500).json({ message: 'Internal server error during authentication' });
  }
}
  module.exports = { isAuthenticated };