const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const validateToken = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
    }),
    audience: '---',
    issuer: 'https://accounts.google.com',
    algorithms: ['RS256']
});

module.exports = validateToken;
