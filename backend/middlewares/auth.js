const jwt = require('jsonwebtoken');

const _auth = {}

_auth.verifyTokn = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token Not Found' });
  }

  jwt.verify(token, 'Trading_App', (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid tokens' });
    }

    req.user = decodedToken;

    next();
  });
};

module.exports = _auth