'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	Project = mongoose.model('Project');

/**
 * Get User Projects
 */
exports.getUserProjects = function(req, res) {
	if(req.user){

       // Init Variables
		var user_id = req.user._id;

		var message = null;

	  Project.aggregate([
		    { $lookup:
		       {
		         from: 'users',
		         localField: 'user_id',
		         foreignField: '_id',
		         as: 'user'
		       }
		     }
		    ],function(err, projects) {
			    if (err){
			    	return res.status(400).send({
						message:err 
				   });
			    } 
			    console.log(JSON.stringify(projects));
			    res.json(projects); 
		  });

	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}

};

/**
 * Create Project
 */
exports.createProject = function(req, res) {
	if(req.user){
       // Init Variables
		var project = new Project(req.body);
		project.user_id = req.user._id;

		var message = null;

		// Then save the user 
		project.save(function(err) {
			if (err) {
				return res.status(400).send({
					message:err
				});
			} else {
				res.json(project);
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}

};

