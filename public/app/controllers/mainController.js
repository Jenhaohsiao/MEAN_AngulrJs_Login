(function() {
    'use strict';

    angular.module('mainController', [
        'authServices'
    ]);
})();

(function() {
    'use strict';

    angular
        .module('mainController')
        .controller('MainController', MainController);

    MainController.$inject = [
        'Auth',
        '$timeout',
        '$location',
        '$rootScope',
        '$interval'
    ];

    function MainController(
        Auth,
        $timeout,
        $location,
        $rootScope,
        $interval) {

        var vm = this;
        vm.loadme = false;

        vm.checkSession = function() {

            if (Auth.isLoggedIn()) {

                vm.isCheckingSession = true;
                var interval = $interval(function() {
                    console.log("After logged in, run $interval")

                }, 2000)
            }

        }

        vm.checkSession();

        $rootScope.$on('$routeChangeStart', function() {

            if (!vm.isCheckingSession) {
                vm.checkSession();
            }

            if (Auth.isLoggedIn()) {
                // console.log("Success: User is logged In.");
                vm.isLoggedIn = true;
                Auth.getUser().then(function(response) {
                    // console.log("getUser:", response.data.username);
                    vm.username = response.data.username
                    vm.useremail = response.data.email
                    vm.loadme = true;

                });
            } else {
                // console.log("Filure: User in NOT logged In");
                vm.isLoggedIn = false;
                vm.username = null;
                vm.loadme = true;
            }
        });


        this.dologin = function(loginData) {

            vm.loading = true;
            vm.successMsg = null;
            vm.errorMsg = null;

            Auth.login(vm.loginData)
                .then(function(response) {

                    if (response.data.success) {
                        // create success message
                        vm.successMsg = response.data.message + '...redirecting';
                        vm.loading = false;
                        vm.errorMsg = false;

                        vm.loading = false;

                        $timeout(function() {

                            $location.path('/about');
                            vm.loginData.username = null;
                            vm.loginData.password = null;
                            vm.successMsg = false;
                            vm.checkSession();

                        }, 2000)


                        // redirect to home page
                    } else {
                        // create an error message
                        vm.errorMsg = response.data.message;
                        vm.loading = false;
                    }
                })
        };

        this.logout = function() {

            Auth.logout();

            $location.path('/logout');
            $timeout(function() {
                $location.path('/');
            }, 1000);
        }
    }
})();