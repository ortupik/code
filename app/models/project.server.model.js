'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');


/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: "Log in to add Project"
	},
	name: {
		type: String,
		required: 'Please fill in project name'
	},
	description: {
		type: String,
		required: 'Please fill in description'
	},
	subdomain: {
		type: String,
		required: 'Please fill in subdomain'
	},
	created: {
		type: Date,
		default: Date.now
	}
}); 


/**
 * Find possible not used name
 */
ProjectSchema.statics.findUniqueProjectName = function(name, suffix, callback) {
	var _this = this;
	var possibleName = name + (suffix || '');

	_this.findOne({
		name: possibleName
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleName);
			} else {
				return _this.findUniqueProjectName(name, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('Project', ProjectSchema);