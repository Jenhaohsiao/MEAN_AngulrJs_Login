(function() {
    'use strict';

    angular.module('appRoutes', [
        'ngRoute'
    ])

    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })

        .when('/about', {
            templateUrl: 'app/views/pages/about.html'
        })

        .when('/register', {
            templateUrl: 'app/views/pages/users/register.html',
            controller: "registerController",
            controllerAs: 'register',
            authenticated: false,
        })

        .when('/login', {
            templateUrl: 'app/views/pages/users/login.html',
            authenticated: false,
        })

        .when('/logout', {
            templateUrl: 'app/views/pages/users/logout.html',
            authenticated: true,
        })

        .when('/profile', {
            templateUrl: 'app/views/pages/users/profile.html',
            authenticated: true,
        })

        .when('/management', {
            templateUrl: 'app/views/pages/management/management.html',
            controller: "ManagementController",
            controllerAs: 'management',
            authenticated: true,
            permission: ['admin', 'moderator']
        })



        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })


    .run(function(
        $rootScope,
        Auth,
        $location,
    ) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {

            if (next.$$route) {
                if (next.$$route.authenticated == true) {
                    console.log("Needs to be Aeuthenticated");
                    if (!Auth.isLoggedIn()) {
                        event.preventDefault();
                        $location.path('/');
                    }
                } else if (next.$$route.authenticated == false) {
                    if (Auth.isLoggedIn()) {
                        event.preventDefault();
                        $location.path('/profile');
                    }
                    console.log("NOT Needs to be Aeuthenticated");
                } else {
                    console.log("Aeuthenticated doesn't matter");
                }
            } else {
                console.log("Aeuthenticated doesn't matter");
            }


        })

    });

})();