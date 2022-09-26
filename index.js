const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./model.js');

const Movie = Models.Movie;
const User = Models.User;



mongoose.connect('mongodb://localhost:27017/movies',
{ useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));

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
app.get('/movies', (req, res) => {
    Movie.find()
    .then((movie) =>{
        res.status(201).json(movie);
    }).catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    })
})



// Get data of a movie by its title 
app.get('/movies/:Title', (req, res) => {
    Movie.findOne({ Title: req.params.Title })
    .then((movie) =>{
        res.status(201).json(movie);
    }).catch((error) =>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});



// Get genre description by genre name
app.get('/movies/genres/:Name', (req, res) => {
    Movie.findOne({ 'Genre.Name' : req.params.Name })
    .then((genre) => {
        res.json(genre.Description);
    }).catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    })
})



// Get data of director by name
app.get('/movies/directors/:Name', (req, res) => {
    Movie.findOne({ 'Director.Name' : req.params.Name })
    .then((movie) => {
        res.json(movie);
    }).catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    })
})



 //Get list of all user
app.get('/users', (req, res) =>{
    User.find()
    .then((users)=>{
        res.status(201).json(users);
    }).catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});


//Get user by username
app.get('/users/:Username', (req, res) => {
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
app.post('/users', (req, res) => {
    User.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
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
app.put('/users/:Username', (req, res) => {
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
app.post('/users/:Username/movies/:MovieID', (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
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
app.delete('/users/:Username', (req, res) => {
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


app.listen(8080, () => {
    console.log('movieApp running on Port 8080')
})