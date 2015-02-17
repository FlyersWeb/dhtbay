'use strict';

angular.module('dhtcrawler.index', ['ngRoute'])


.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: '/javascripts/index/partial.html',
    controller: 'IndexCtrl'
  });
}])

.controller('IndexCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('/v1/api/list').
    success(function(data, status, headers, config){
      $scope.torrents = data;
    });
}]);