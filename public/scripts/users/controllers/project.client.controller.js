'use strict';

app.filter('formatDate', function() {
    return function(t_date) {
    	var date = new Date(t_date);
    	var dd = date.getDate();
	    var mm = date.getMonth()+1; //January is 0!
	    var yyyy = date.getFullYear();

	    const monthNames = ["January", "February", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
		];
       return monthNames[mm]+" "+dd+" , "+yyyy;
    };
});

app.filter('getUserName', function() {
    return  function(id) {
       //var name = await getName(id);
      //  console.log("name"+name)
       return "User";
   };
});

 function getName(id){
 	/*return new Promise(resolve => {
		$.post("/users/getName",{id:id},function(response){
			if(response.name != undefined){
				 resolve(response.name);
			}else{
				resolve("User");
			}
	   })
  }); */
}

app.controller('ProjectController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.user = Authentication.user;
		$scope.authentication = Authentication;

		// If user is not signed in then redirect back home
		if (!$scope.user){
			$http.get('/users/me').success(function(response) {
				$scope.authentication.user = response;
				$scope.user = response;

				if(response.provider == "twitter" ){
					response.name = response.displayName;
					response.email = response.providerData.email;
					response.bio = response.providerData.description;
					response.profile_image_url = response.providerData.profile_image_url;
					console.log(response)
					localStorage.setItem('user', JSON.stringify(response));
				}else if(response.provider == "facebook"){
					response.name = response.displayName;
					response.email = response.providerData.email;
					response.bio = response.providerData.description;
					response.profile_image_url = response.providerData.picture.data.url;
					console.log(response)
					localStorage.setItem('user', JSON.stringify(response));
				}else{
					localStorage.setItem('user', JSON.stringify(response));
				}
				
			}).error(function(response) {
				console.log(response);
				location.href = "/";
			});	
		}

		$scope.createproject = function() {
			$http.post('/project/create', $scope.project).success(function(response) {
				$scope.projects.push(response);
				$(".project-cre-success").show();
			    $(".project-cre-fail").hide();
			    location.href = "/projects";
			}).error(function(response) {
				$scope.create_project_error = response.message;
				$(".project-cre-fail").show();
			    $(".project-cre-success").hide();
			});
		};


		$http.get('/project/user', $scope.project).success(function(response) {
			$scope.projects = response;
		}).error(function(response) {
			$scope.create_project_error = response.message;
		});

  }
]);