
	angular.module('userCtrl', [])

	// inject the Todo service factory into our controller
	.controller('userCtrl', ['$scope','$http','admin', function($scope, $http, admin) {
		$scope.formData = {fname:'',lname:'',name:'',email:''};
		
		$scope.loading = true;
        
			admin.get()
			.success(function(data) {
				$scope.users = data;
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createUser = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.email != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				admin.create($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.users = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteUser = function(id) {
			$scope.loading = true;

			admin.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.users = data; // assign our new list of todos
				});
		};
	}]);