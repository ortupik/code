'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
var bodyParser = require('body-parser');
var multer = require('multer');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');  

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route("/users/getName").post(users.getName);
	app.route('/users').put(users.update); 
	app.route('/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	
	app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Finish by binding the user middleware
	app.param('userId', users.userByID);


	var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            var filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
            users.updateProfilePic(req.user._id,"uploads/"+filename);
            cb(null, filename);
        }
    });

    var upload = multer({ //multer settings
        storage: storage
    }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
            	 console.log(err)
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });


};