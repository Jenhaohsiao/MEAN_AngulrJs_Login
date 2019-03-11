(function() {
    'use strict';

    angular.module('userApp', [
        'appRoutes',
        'userControllers',
        'userServices',
        'ngAnimate',
        'mainController',
        'authServices',
        'managementController',
        'editController'
    ])

    .config(function($httpProvider) {

        $httpProvider.interceptors.push('AuthInterceptors')

    })


})();