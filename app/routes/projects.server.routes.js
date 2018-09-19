'use strict';

module.exports = function(app) {

	var projects = require('../../app/controllers/projects.server.controller'); 

	app.route('/project/create').post(projects.createProject);
	app.route('/project/user').get(projects.getUserProjects);
	
};