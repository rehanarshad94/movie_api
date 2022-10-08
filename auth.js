const jwtSecret = 'your_jwt_secret'; //Same key used in passport.js - JWTStrategy
const jwt = require('jsonwebtoken'),
passport = require('passport');

require('./passport'); // Import 'passport' folder

let generateJWTToken = (user) => {
    return jwt.sign( user, jwtSecret, {
        subject: user.Username, // Username being encoded in JWT
        expiresIn: '7d', // Specifies token will expire in 7 days
        algorithm: 'HS256' // Algorithm used to 'sign' or encode the values of JWT
    });
};

// POST LOGIN
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', {session: false},
        (error, user, info) => {

            // console.log(user);
            // console.log(req);

            if(error || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user: user
            });
          }
          req.login(user, {session: false}, (error) => {
            if(error) {
                res.send(error);
            }
            let token = generateJWTToken(user.toJSON());
            return res.json({user, token});
          });
        })(req, res);
    });
}


