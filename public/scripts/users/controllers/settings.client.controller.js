'use strict';

var app = angular.module("app", ['ngFileUpload']); 
	
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
									location.href = '/';
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

app.controller('SettingsController', ['$scope', '$http', '$location', 'Authentication','Upload',
	function($scope, $http, $location, Authentication,Upload) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) location.href = '/';

		// Update a user profile
		$scope.updateUserPersonalProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = $scope.user;

				$http.put('/users', $scope.user).success(function(response) {
				// If successful show success message and clear form
					$scope.success = true;
					$scope.user = response;
					localStorage.setItem('user', JSON.stringify(response));
					$(".personal-fail").hide();
					$(".personal-success").show();
				}).error(function(response) {
					$scope.password_error = response.message;
					$(".personal-fail").show();
					$(".personal-success").hide();
				});

			} else {
				$scope.submitted = true;
			}
		};


		// Update a user profile
		$scope.updateUserSocialProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = $scope.user;

				$http.put('/users', $scope.user).success(function(response) {
				// If successful show success message and clear form
					$scope.success = true;
					$scope.user = Authentication.user = response;
					localStorage.setItem('user', JSON.stringify(response));
					$(".social-fail").hide();
					$(".social-success").show();
				}).error(function(response) {
					$scope.password_error = response.message;
					$(".social-fail").show();
					$(".social-success").hide();
				});

			} else {
				$scope.submitted = true;
			}
		};

		// Update a email preferences
		$scope.changeEmailPreferences = function() {
				$scope.success = $scope.error = null;

				$http.put('/users', $scope.user).success(function(response) {
				// If successful show success message and clear form
					$scope.success = true;
					$scope.user = Authentication.user = response;
					localStorage.setItem('user', JSON.stringify(response));
					$(".email_set-fail").hide();
					$(".email_set-success").show();
				}).error(function(response) {
					$scope.password_error = response.message;
					$(".email_set-fail").show();
					$(".email_set-success").hide();
				});
			
		};

		// Update email
		$scope.changeEmail = function() {
				$scope.success = $scope.error = null;
				var change = $scope.change;

				if(change.email != change.verify_email){
                   $scope.email_error = "Emails do not Match !";
				}else{
					$scope.user.email = change.email;
					$http.put('/users', $scope.user).success(function(response) {
				// If successful show success message and clear form
						$scope.success = true;
						$scope.user = Authentication.user = response;
						localStorage.setItem('user', JSON.stringify(response));
						$(".email-fail").hide();
						$(".email-success").show();
				}).error(function(response) {
					$scope.email_error = response.message;
					$(".email-fail").show();
					$(".email-success").hide();
				});

				}
		};
        


		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null; 

		    console.log($scope.passwordDetails);

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
				$(".password-fail").hide();
				$(".password-success").show();
			}).error(function(response) {
				$scope.password_error = response.message;
				$(".password-fail").show();
				$(".password-success").hide();
			});
		};
         
        var vm = this; 

	 	$scope.uploadForm = function(){
	       if($scope.up.file){
	       	 vm.upload($scope.up.file)
	       }
		}
		 vm.upload = function (file) {

	        Upload.upload({
	            url: '/upload', //webAPI exposed to upload the file
	            data:{file:file} //pass file as data, should be user ng-model
	        }).then(function (resp) { //upload function returns a promise
	            if(resp.data.error_code === 0){ //validate success
	               vm.updateUser();
	               $(".image-fail").hide();
				   $(".image-success").show();
	            } else {
				   $(".image-success").hide();
				   $(".image-fail").show();
	            }
	        }, function (resp) { //catch error
	          $(".image-success").hide();
			  $(".image-fail").show();
	        }, function (evt) { 
	            console.log(evt);
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	            $scope.up.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
	        });
	    };

	    vm.updateUser = function(){
	    	$http.get('/users/me').success(function(response) {
			   $scope.user = response;
			   localStorage.setItem('user', JSON.stringify(response));
			}).error(function(response) {
				$scope.credentials = null;
				$scope.error = response.message;
			});
	    }
	}
]);