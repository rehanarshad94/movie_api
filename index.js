const express = require('express'),
morgan = require('morgan');

const app = express();

let horrorMovies = [
    {Name: 'movie name'},
    {Name: 'movie name'},
    {Name: 'movie name'},
    {Name: 'movie name'},
    {Name: 'movie name'},
    {Name: 'movie name'},
    {Name: 'movie name'},
    {Name: 'movie name'},
    {Name: 'movie name'},
    {Name: 'movie name'}
]

app.use(morgan('common'));


app.get('/movies',(req, res) => {
    res.json(horrorMovies);
})

app.get('/', (req, res) => {
    let responseText = '<h1> Welcome to my MovieApp!<h1>';
    responseText += '<p><h3> updating with movies selection soon <h3><p>'
    res.send(responseText);
})

app.use(express.static('public'));


app.use((err, req, res, next) => {
    console.log(err.stack);
    res(500).send('Not Working');
})


app.listen(8080, () => {
    console.log('movieApp running on Port 8080')
})