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
  $scope.term = '';

  $scope.loadTorrents = function(limit, skip) {
    $http.get('/v1/api/count').
      success(function(data, status, headers, config){
        $scope.totalItems = data;
      });
    $http.get('/v1/api/list/'+limit+'/'+skip).
      success(function(data, status, headers, config){
        $scope.torrents = data;
      });
  };

  $scope.searchTorrents = function(term, limit, skip) {
    $http.get('/v1/api/search/count/'+term).
      success(function(data,status,headers,config){
        $scope.totalItems = data;
      });
    $http.get('/v1/api/search/'+term+'/'+limit+'/'+skip).
      success(function(data, status, headers, config){
        $scope.torrents = data;
      }); 
  };

  $scope.loadTorrents($scope.itemPerPage, ($scope.currentPage-1)*$scope.itemPerPage);

  $scope.pageChanged = function() {
    if($scope.term.length>=3){
      $scope.searchTorrents($scope.term, $scope.itemPerPage, ($scope.currentPage-1)*$scope.itemPerPage);
    } else {
      $scope.loadTorrents($scope.itemPerPage, ($scope.currentPage-1)*$scope.itemPerPage);
    }
  };

  $scope.$watch('term', function(tmpTerm) {
    if(tmpTerm.length>=2){
      $scope.searchTorrents(tmpTerm, $scope.itemPerPage, ($scope.currentPage-1)*$scope.itemPerPage);
    } else {
      $scope.loadTorrents($scope.itemPerPage, ($scope.currentPage-1)*$scope.itemPerPage);
    }
  });

}]);
