const express = require('express'),
morgan = require('morgan');

const app = express();

let horrorMovies = [
    {'title': 'The Ring', 
        'genre': {
            'name': 'horror',
            'description' : []
        }
    },
    {Title: 'A Nightmare on Elm Street'},
    {Title: 'Halloween'},
    {Title: 'Saw'},
    {Title: 'The Exorcist'},
    {Title: 'The Grudge'},
    {Title: 'Insidious'},
    {Title: 'Jeepers Creepers'},
    {Title: 'The Haunting in Connecticut'},
    {Title: 'The Conjuring'}
]


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
app.get('/movies',(req, res) => {
    res.status(200).json(horrorMovies);
})


// Get data of a movie by its title
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = horrorMovies.find( movie => movie.title === title).genre;

    if(movie){
        res.status(200).json(movie);
    } else {
        res.status(400).send('No such movie');
    }
})

// Get movie name by its genre
app.get('/movies/genre/:movieName', (req, res) => {
    const { movieName } = req.params;
    const name = horrorMovies.find( movie => movie.genre.name === movieName).title;

    if(name){
        res.status(200).json(name);
    } else {
        res.status(400).send('No such name');
    }
})


// Get name of director
app.get("/movies/directors/:directorName", (req, res) => {
    let responseText = 'Returns name of director';
    res.send(responseText);
})

// Create new users
app.post("/users", (req, res) => {
    let responseText = 'Allow users to register';
    res.send(responseText);
})

// Update users info
app.put("/users/:id", (req, res) => {
    let responseText = 'Allow user to update their info';
    res.send(responseText);
})

// Create favorits list of movies for users
app.post("/users/:id/:movieTitle", (req, res) => {
    let responseText = 'Allow user to add movies to their favorits collection';
    res.send(responseText);
})

// Remove movies from favorits list for users
app.delete("/users/:id/:movieTitle", (req, res) => {
    let responseText = 'Allow user to remove movies from their favorits collection';
    res.send(responseText);
})

// Delete exisiting user accounts
app.delete("/users/:id", (req, res) => {
    let responseText = 'Allow users to delete their account';
    res.send(responseText);
})



// Get genre by movie name
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = horrorMovies.find( movie => movie.title === genreName).genre;

    if(genre){
        res.status(200).json(genre);
    } else {
        res.status(400).send('No such genre.');
    }
})





app.use((err, req, res, next) => {
    console.log(err.stack);
    res(500).send('Not Working');
})


app.listen(8080, () => {
    console.log('movieApp running on Port 8080')
})