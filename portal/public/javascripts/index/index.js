'use strict';

angular.module('dhtcrawler.index', ['ngRoute', 'ui.bootstrap'])


.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: '/javascripts/index/partial.html',
    controller: 'IndexCtrl'
  });
}])

.controller('IndexCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.currentPage = 1;
  $scope.maxsize = 10;
  $scope.itemPerPage = 20;
  $http.get('/v1/api/count').
    success(function(data, status, headers, config){
      $scope.totalItems = data;
    });

  $scope.loadTorrents = function(limit, skip) {
    $http.get('/v1/api/list/'+limit+'/'+skip).
      success(function(data, status, headers, config){
        $scope.torrents = data;
      });
  };

  $scope.loadTorrents($scope.itemPerPage, ($scope.currentPage-1)*$scope.itemPerPage);

  $scope.pageChanged = function() {
    $scope.loadTorrents($scope.itemPerPage, ($scope.currentPage-1)*$scope.itemPerPage);

  };
}]);
