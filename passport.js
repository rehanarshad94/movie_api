const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy, 
Models = require('./model'),
passportJWT = require('passport-jwt');

let Users = Models.User,
JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;


/// Defines HTTP authentication for login requests w/ username&password
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password', 
}, (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findOne({ Username: username },  (error, user) => {
        if(error) {
            console.log(error);
            return callback(error);
        }
        if(!user){
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username and password'});
        } 
        // if (!user.validatePassword(password)) {     // Additional callback code to validate any password a user enters
        //     console.log('incorrect password');
        //     return callback(null, false, {message: 'Incorrect password.'});
        // }
        console.log({user:user});

        console.log('finished')
        return callback(null, user);
    });
 }));



 //authenticate users based on the JWT w/ their request -- JWTStrategy
 passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
 }, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    }).catch((error) => {
        return callback(error);
    });
 }));


