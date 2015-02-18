'use strict';

angular.module('dhtcrawler', ['ngRoute', 'ui.bootstrap', 'dhtcrawler.index'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    otherwise({
      redirectTo: '/'
    });
    // $locationProvider.html5Mode(true);
}]);
