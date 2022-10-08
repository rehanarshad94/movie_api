const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./model.js');

const Movie = Models.Movie;
const User = Models.User;

const { check, validationResult } = require('express-validator');



// Local
// mongoose.connect('mongodb://localhost:27017/movies',
// { useNewUrlParser: true, useUnifiedTopology: true });

// Online
mongoose.connect(process.env.connection, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.urlencoded({ extended: true }));



// Allows access for all domains
const cors = require('cors');
app.use(cors());

// Only allows selected domains to access the information 
// const cors = require('cors');
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));



// Importing 'auth.js' folder & 'app' ensures EXPRESS is in 'auth.js' folder as well
let auth = require('./auth')(app);

// Importing 'passport' folder & 'passport' MODULE 
const passport = require('passport');
require('./passport');


app.use(bodyParser.json());

// Shows 'documentation.html' file inside 'public' folder
app.use(express.static('public'));


// Logs date/time/method/path/status-code
app.use(morgan('common'));



// READ
app.get('/', (req, res) => {
    let responseText = '<h1> Welcome to my MovieApp!<h1>';
    responseText += '<p><h3> updating with movies selection soon <h3><p>'
    res.send(responseText);
})


// Get list of all movies in JSON format 
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movie.find()
    .then((movie) =>{
        res.status(201).json(movie);
    }).catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    })
})



// Get data of a movie by its title 
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movie.findOne({ Title: req.params.Title })
    .then((movie) =>{
        res.status(201).json(movie);
    }).catch((error) =>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});



// Get genre description by genre name
app.get('/movies/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movie.findOne({ 'Genre.Name' : req.params.Name })
    .then((genre) => {
        res.json(genre.Description);
    }).catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    })
})



// Get data of director by name
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movie.findOne({ 'Director.Name' : req.params.Name })
    .then((movie) => {
        res.json(movie);
    }).catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    })
})



 //Get list of all user
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) =>{
    User.find()
    .then((users)=>{
        res.status(201).json(users);
    }).catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});


//Get user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
        User.findOne({ Username: req.params.Username })
          .then((user) => {
            res.json(user);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          });
});


//Create new user
app.post('/users', 
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = User.hashPassword(req.body.Password);
    User.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {  //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          User
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
});



// Update users info
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});



// Create favorits list of movies for users
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});



// Remove movies from favorits list for users
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOneAndUpdate({ Username: req.params.Username }, {
       $pull: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});


// Delete exisiting user accounts 
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});



app.use((err, req, res, next) => {
    console.log(err.stack);
    res(500).send('Not Working');
})



// app.listen(8080, () => {
//   console.log('Server is running on Port 8080');
// })


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
 console.log('Listening on Port' + port);
});