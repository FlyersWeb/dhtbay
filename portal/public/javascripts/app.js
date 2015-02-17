'use strict';

angular.module('dhtcrawler', ['ngRoute', 'dhtcrawler.index'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    otherwise({
      redirectTo: '/'
    });
    // $locationProvider.html5Mode(true);
}]);