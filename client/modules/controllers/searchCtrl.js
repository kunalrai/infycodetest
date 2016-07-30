
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
					$scope.searchresult = _.sortBy(data.items, 'snippet.title');;
				}
			);
			Todos.getGooglebookdata(q).success(
				function (data) {
					
					$scope.loading = false;
					$scope.bookresult = _.sortBy(data, 'title');;
				}
			);

		}
		$scope.reset = function(){
				$scope.bookresult={};
				$scope.searchresult = {};
				 $('#search').val('');
		}

	}]);