'use strict';

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/todo');

let Todo = mongoose.model('Todo', {title: String});

let express = require('express');
let app     = express();

app.use(require('body-parser').json());

app.get('/', function (req, res) {
  res.render('index.html.ejs');
});
app.get('/401', function (req, res) {
  res.render('401.html.ejs');
});
app.get('/404', function (req, res) {
  res.render('404.html.ejs');
});
app.get('/account-settings', function (req, res) {
  res.render('account-settings.html.ejs');
});
app.get('/create-an-account', function (req, res) {
  res.render('create-an-account.html.ejs');
});
app.get('/dashboard', function (req, res) {
  res.render('dashboard.html.ejs');
});
app.get('/profile', function (req, res) {
  res.render('profile.html.ejs');
});
app.get('/projects', function (req, res) {
  res.render('projects.html.ejs');
});
app.get('/test', function (req, res) {
  res.render('test.html.ejs');
});

app.get('/api/todos', function (req, res, next) {
  Todo.find()
  .exec(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
});

app.post('/api/todos', function (req, res, next) {
  let todo = new Todo({title: req.body.title});
  todo.save(function (err) {
    if (err) return next(err);
    res.sendStatus(201);
    console.log(`added ${todo.title}`);
  });
});

app.delete('/api/todos/:id', function (req, res, next) {
  Todo.find(req.params.id, function (err, todo) {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

app.use(express.static('public'));

// listen on $PORT or 3000
// this makes the app work on heroku
app.listen(process.env.PORT || 3000);
