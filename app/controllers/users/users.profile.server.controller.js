'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 Get User Name
*/
exports.getName = function(req,res){
	User.findOne({
		_id: req.body.id
	}, function(err, user) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json({name:user.name});
		}
	});
};

/**
  Update Profile Pic
*/
exports.updateProfilePic = function(id,profile_url){

	var query = {'_id':id};

	var newData = {
		profile_image_url: profile_url
	}

	User.findOneAndUpdate(query,newData, {upsert:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    console.log(doc);
	});

};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};