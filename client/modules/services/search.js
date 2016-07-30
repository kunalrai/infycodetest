angular.module('searchService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', ['$http', function ($http) {
		return {
			getYoutubedata: function (q) {
					return $http.get('/api/search/' + q)
			},
			getGooglebookdata:function(q){
					return $http.get('/google/search/' + q)
			}
		}
	}]);