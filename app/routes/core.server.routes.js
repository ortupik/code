'use strict';


module.exports = function(app) {
	// Root routing	
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
	app.get('/email-settings', function (req, res) {
	  res.render('email-settings.html.ejs');
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
 
};