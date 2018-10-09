	
	var app = angular.module("app", []); 
	
	var user = JSON.parse(localStorage.getItem("user"));

	app.run(function($rootScope) {
		   $rootScope.user = user;
	});


	// Authentication service for user variables
	app.factory('Authentication', [
		function() {
			var _this = this;

			_this._data = {
				user: window.user
			};

			return _this._data;
		}
	]);

	// Config HTTP Error Handling
	app.config(['$httpProvider',
		function($httpProvider) {
			// Set the httpProvider "not authorized" interceptor
			$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
				function($q, $location, Authentication) {
					return {
						responseError: function(rejection) {
							switch (rejection.status) {
								case 401:
									// Deauthenticate the global user
									Authentication.user = null;

									// Redirect to signin page
								//	location.href = '/';
									break;
								case 403:
									// Add unauthorized behaviour 
									break;
							}

							return $q.reject(rejection);
						}
					};
				}
			]);
		}
	]);


	// Users service used for communicating with the users REST endpoint
	app.factory('App', ['$resource',
		function($resource) {
			return $resource('app', {}, {
				update: {
					method: 'PUT'
				}
			});
		}
	]);
