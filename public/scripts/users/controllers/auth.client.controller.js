'use strict';


	app.controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
		function($scope, $http, $location, Authentication) {
			$scope.authentication = Authentication;

			   console.log($scope.authentication.user)

			// If user is signed in then redirect back home
			if ($scope.authentication.user){
				//location.href = '/dashboard';
			} 

			$scope.signup = function() {

				if($("#Password").val() != $("#Password-2").val() ){
                   $(".pass_failure").show();
				}else{

					$http.post('/auth/signup', $scope.credentials).success(function(response) {
						// If successful we assign the response to the global user model
						$scope.authentication.user = response;
						localStorage.setItem('user', JSON.stringify(response));
						// And redirect to the index page
						location.href = '/dashboard';

					}).error(function(response) {
						$scope.error = response.message;
					});
			   }
			};

			$scope.signin = function() {
				$http.post('/auth/signin', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;
					$scope.user = response;
					localStorage.setItem('user', JSON.stringify(response));

					$(".w-form-done").show();
					$(".w-form-fail").hide();
					// And redirect to the index page
					location.href = '/dashboard';

				}).error(function(response) {
					$scope.error = response.message;
					$(".w-form-fail").show();
				});
			};
		}
	]);

//})
