const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();



// let horrorMovies = [
//     {'title': 'The Ring', 
//         'genre': {
//             'name': 'horror',
//             'description' : []
//         }
//     },
//     {Title: 'A Nightmare on Elm Street'},
//     {Title: 'Halloween'},
//     {Title: 'Saw'},
//     {Title: 'The Exorcist'},
//     {Title: 'The Grudge'},
//     {Title: 'Insidious'},
//     {Title: 'Jeepers Creepers'},
//     {Title: 'The Haunting in Connecticut'},
//     {Title: 'The Conjuring'}
// ]


let users = [
    {
        id: 123,
        name: 'user1 name',
        favoriteMovies:  ['movie1', 'movie2']
    },
    {
        id: 456,
        name: 'user1 name',
        favoriteMovies:  ['movie1', 'movie2']
    }
]

const horrorMovies = [
    {
    'Title': 'The Ring',
    'Description': 'My movie description',
    'Director': {
        'Name': 'Gore Verbinski',
        'Bio': '.......',
        'Birth': '3/16/1964'
    },
    'Genre': {
        'Name': 'Horror',
        'Description': ''
    },
    'ImageUrl': ''
},
{
    'Title': 'A Nightmare on Elm Street',
    'Description': 'My movie description',
    'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
    },
    'Genre': {
        'Name': '',
        'Description': ''
    },
    'ImageUrl': ''
},
{
    'Title': 'Halloween',
    'Description': 'My movie description',
    'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
    },
    'Genre': {
        'Name': '',
        'Description': ''
    },
    'ImageUrl': ''
},
{
    'Title': 'Saw',
    'Description': 'My movie description',
    'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
    },
    'Genre': {
        'Name': '',
        'Description': ''
    },
    'ImageUrl': ''
},
{
    'Title': 'The Exorcist',
    'Description': 'My movie description',
    'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
    },
    'Genre': {
        'Name': '',
        'Description': ''
    },
    'ImageUrl': ''
},
{
    'Title': 'The Grudge',
    'Description': 'My movie description',
    'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
    },
    'Genre': {
        'Name': '',
        'Description': ''
    },
    'ImageUrl': ''
},
{
    'Title': 'Insidious',
    'Description': 'My movie description',
    'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
    },
    'Genre': {
        'Name': '',
        'Description': ''
    },
    'ImageUrl': ''
},
{
    'Title': 'Jeepers Creepers',
    'Description': 'My movie description',
    'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
    },
    'Genre': {
        'Name': '',
        'Description': ''
    },
    'ImageUrl': ''
},
{
    'Title': 'The Haunting in Connecticut',
    'Description': 'My movie description',
    'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
    },
    'Genre': {
        'Name': '',
        'Description': ''
    },
    'ImageUrl': ''
},
{
    'Title': 'The Conjuring',
    'Description': 'My movie description',
    'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
    },
    'Genre': {
        'Name': '',
        'Description': ''
    },
    'ImageUrl': ''
}
]


// Shows 'documentation.html' file inside 'public' folder
app.use(express.static('public'));


// Logs date/time/method/path/status-code
app.use(morgan('common'));


app.use(bodyParser.json());



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
    const movie = horrorMovies.find( movie => movie.Title === title);

    if(movie){
        res.status(200).json(movie);
    } else {
        res.status(400).send('No such movie');
    }
})
// Get genre by movie name
app.get('/movies/movie/:movieName', (req, res) => {
    const { movieName } = req.params;
    const genre = horrorMovies.find( movie => movie.Title === movieName ).Genre;

    if(genre){
        res.status(200).json(genre);
    } else {
        res.status(400).send('No such genre');
    }
})




// Get name of director
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = horrorMovies.find( movie => movie.Director.Name === directorName ).Director;

    if(director){
        res.status(200).json(director);
    } else {
        res.status(400).send('No such director');
    }

})


// Create new users
app.post("/users", (req, res) => {
    const newUsers = req.body;

    if(newUsers.name){
        newUsers.id = uuid.v4();
        users.push(newUsers);
        res.status(201).json(newUsers);
    } else {
        res.status(400).send('user need names');
    }

})

// Update users info
app.put("/users/:username", (req, res) => {
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




// Get movie name by its genre
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const name = horrorMovies.find( movie => movie.Genre.Name === genreName).Title;

    if(name){
        res.status(200).json(name);
    } else {
        res.status(400).send('No such name');
    }
})












app.use((err, req, res, next) => {
    console.log(err.stack);
    res(500).send('Not Working');
})


app.listen(8080, () => {
    console.log('movieApp running on Port 8080')
})