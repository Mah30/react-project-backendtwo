const jwt = require('jsonwebtoken')

const isAuthenticated = (request, response, next) => {

   /*  if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
        return response.status(401).json({ message: 'Token not provided or invalid' });  //verifica o Header antes de tentar algo
      } */

    try {
      const token = request.headers.authorization.split(' ')[1] 

      const payload = jwt.verify(token, process.env.TOKEN_SECRET) // decode token and get payload
  
      request.tokenPayload = payload // to pass the decoded payload to the next route
      next()
    } catch (error) {
        console.error('Authentication error:', error.message);
      // the middleware will catch error and send 401 if:
      // 1. There is no token
      // 2. Token is invalid
      // 3. There is no headers or authorization in req (no token)

      if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ message: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ message: 'Invalid token' });
      }
      
      response.status(401).json({ message: 'token not provided or not valid'})
    }
  }
  
  module.exports = { isAuthenticated }
  