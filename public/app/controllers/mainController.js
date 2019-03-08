(function() {
    'use strict';

    angular.module('mainController', [
        'authServices',
        'userServices',
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
        '$interval',
        '$window',
        '$route',
        'User',
        'AuthToken',
    ];

    function MainController(
        Auth,
        $timeout,
        $location,
        $rootScope,
        $interval,
        $window,
        $route,
        User,
        AuthToken,
    ) {

        var vm = this;
        vm.loadme = false;
        var leftTime = 25;
        var isTimerStop = false;


        vm.checkSession = function() {

            if (Auth.isLoggedIn()) {

                vm.isCheckingSession = true;
                var interval = $interval(function() {
                        // console.log("loggin, run $interval")
                        if (isTimerStop) {
                            $interval.cancel(interval);
                            isTimerStop = false;
                        }

                        var token = $window.localStorage.getItem('token');

                        if (token === null) {
                            $interval.cancel(interval)
                        } else {
                            // Angulr taking a JSON web token and converting the token time
                            // to timestamp time. So that we can compare it to local time or current time.
                            function parseJwt(token) {
                                var base64Url = token.split('.')[1];
                                var base64 = base64Url.replace('-', '+').replace('_', '/');
                                return JSON.parse($window.atob(base64));
                            }

                            var expireTime = parseJwt(token);
                            // Convert the date object in JavaScript to time stamp
                            var timeStamp = Math.floor(Date.now() / 1000);


                            // console.log("expireTime:", expireTime.exp)
                            // console.log("timeStamp:", timeStamp)
                            var timeCheck = expireTime.exp - timeStamp
                                // console.log("timeCheck:", timeCheck)

                            if (timeCheck <= 25 && timeCheck >= 0) {
                                showModal(1);
                                leftTime = leftTime - 1;

                            } else if (timeCheck <= 0) {
                                $interval.cancel(interval)
                                showModal(2);

                            } else {
                                // console.log('Token not yet expired')

                            }
                        }

                    },
                    1000)
            }
        };

        vm.checkSession();

        function showModal(_option) {
            vm.choiceMade = false;
            vm.modalHeader = '';
            vm.modalBody = '';
            vm.hideButton = false;


            if (_option === 1) {

                vm.modalHeader = "Timeout Warning";
                vm.modalBody = " Your session will expired in " + leftTime + "seconds. Would you like to renew your session?";

                // For bootstarp modal
                $("#myModal").modal({
                    backdrop: "static"
                });
                // For bootstarp modal end


            } else if (_option === 2) {
                vm.hideButton = true;
                vm.modalHeader = 'Logging Out';

                // For bootstarp modal
                $("#myModal").modal({
                    backdrop: "static"
                });
                // For bootstarp modal end

                $timeout(function() {
                    Auth.logout();
                    $location.path('/');
                    hideModal();
                    $route.reload();
                }, 2000);
            }

            // wait for renew
            $timeout(function() {
                if (!vm.choiceMade) {
                    hideModal();
                }
            }, 25000)
        }

        vm.renewSession = function() {
            console.log("renewSession")
            vm.choiceMade = true;
            isTimerStop = true; // For stop the prevous one interval

            User.renewSession(vm.username)
                .then(function(response) {
                    if (response.data.success) {
                        AuthToken.setToken(response.data.token);
                        vm.checkSession();
                    } else {
                        vm.modalBody = response.data.message;
                    }
                });
            hideModal();
        };
        vm.endSession = function() {
            vm.choiceMade = true;
            hideModal();
            $timeout(function() {
                showModal(2);
            }, 1000)


        };

        function hideModal() {

            $("#myModal").modal("hide");

        }


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
                    vm.useremail = response.data.email;
                    User.getPermission().then(function(response) {

                        if (response.data.permission === 'admin' || response.data.permission === 'moderator') {
                            vm.authorized = true;
                        }
                    });
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

                        }, 1000)


                        // redirect to home page
                    } else {
                        // create an error message
                        vm.errorMsg = response.data.message;
                        vm.loading = false;
                    }
                })
        };

        vm.logout = function() {

            // Auth.logout();

            // $location.path('/logout');
            // $timeout(function() {
            //     $location.path('/');
            // }, 1000);
            showModal(2);
        }
    }
})();