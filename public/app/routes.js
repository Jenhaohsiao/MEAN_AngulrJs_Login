(function() {
    'use strict';

    angular.module('appRoutes', [
        'ngRoute',
        'ui.router',
        'ui.router.state.events',
    ])

    .config(function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider) {

        // Ui-Router 
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: 'app/views/pages/home.html'
            })

        .state("about", {
            url: "/about",
            templateUrl: 'app/views/pages/about.html',


        })

        .state("register", {
            url: "/register",
            templateUrl: 'app/views/pages/users/register.html',
            controller: "registerController",
            controllerAs: 'register',
            authenticated: false,
        })

        .state("login", {
            url: "/login",
            templateUrl: 'app/views/pages/users/login.html',
            authenticated: false,
        })

        .state("logout", {
            url: "/logout",
            templateUrl: 'app/views/pages/users/logout.html',
            authenticated: true,
        })

        .state("profile", {
            url: "/profile",
            templateUrl: 'app/views/pages/users/profile.html',
            authenticated: true,
        })

        .state("management", {
            url: "/management",
            templateUrl: 'app/views/pages/management/management.html',
            controller: "ManagementController",
            controllerAs: 'management',
            authenticated: true,
            permission: ['admin', 'moderator']
        })

        .state("edit", {
            url: "/edit/:id",
            templateUrl: 'app/views/pages/management/edit.html',
            controller: 'EditController',
            controllerAs: 'edit',
            authenticated: true,

            permission: ['admin', 'moderator']
        })


        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })


    .run(function(
        $rootScope,
        Auth,
        User,
        $state,
        $trace,
    ) {


        // $trace.enable('TRANSITION');

        // Run a check on each route to see if user is togged in or not (depending on if it is specified in the individual route)
        // $rootScope.$on('$routeChangeStart', function(event, next, current) {
        $rootScope.$on('$stateChangeStart', function(event, transition) {

            console.log("transition:", transition);

            // Check each time route changes
            if (transition.authenticated) {

                // Only perform if user visited a route listed above
                if (transition.authenticated == true) {
                    console.log("This page needs to be Aeuthenticated");
                    if (!Auth.isLoggedIn()) {
                        event.preventDefault();
                        $state.go('/');
                    } else if (transition.permission) {

                        User.getPermission()
                            .then(function(response) {
                                console.log("getPermission:", response);
                            });

                    }


                } else if (transition.authenticated == false) {
                    if (Auth.isLoggedIn()) {
                        event.preventDefault();
                        $state.go('/profile');

                    }
                    console.log("This page  NOT Needs to be Aeuthenticated");
                } else {
                    console.log("This page  Aeuthenticated doesn't matter");
                }
            } else {
                console.log("This page  Aeuthenticated doesn't matter");
            }


        })

    });

})();