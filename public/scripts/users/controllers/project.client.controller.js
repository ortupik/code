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

		// If user is not signed in then redirect back home
		if (!$scope.user) location.href = '/';

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
			console.log(response)
		}).error(function(response) {
			$scope.create_project_error = response.message;
		});

  }
]);