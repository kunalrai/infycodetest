
angular.module('searchCtrl', [])

	// inject the Todo service factory into our controller
	.controller('searchCtrl', ['$scope', '$http', 'Todos', function ($scope, $http, Todos) {
	

		$scope.getYoutubedata = function () {
			$("#result").html("");
			$scope.loading = true;
			var q = $('#search').val();
			Todos.getYoutubedata(q).success(
				function (data) {
					
					$scope.loading = false;
					$scope.searchresult = data;
				}
			);
			Todos.getGooglebookdata(q).success(
				function (data) {
					
					$scope.loading = false;
					$scope.bookresult = data;
				}
			);

		}
		$scope.reset = function(){
				$("#result").html("");
				 $('#search').val('');
		}

	}]);