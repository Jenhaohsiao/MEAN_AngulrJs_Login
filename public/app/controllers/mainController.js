(function() {
    'use strict';

    angular.module('mainController', ['authServices'

    ]);
})();

(function() {
    'use strict';

    angular
        .module('mainController')
        .controller('MainController', MainController);

    MainController.$inject = ['Auth', '$timeout', '$location'];

    function MainController(Auth, $timeout, $location) {

        var vm = this;

        if (Auth.isLoggedIn()) {
            console.log("Success: User is logged In.");
            Auth.getUser().then(function(data) {
                console.log("getUser,data:", data);
            });
        } else {
            console.log("Filure: User in NOT logged In");
        }
        this.dologin = function(loginData) {

            vm.loading = true;
            vm.successMsg = null;
            vm.errorMsg = null;

            Auth.login(vm.loginData)
                .then(function(respose) {

                    if (respose.data.success) {
                        // create success message
                        vm.successMsg = respose.data.message;
                        vm.loading = false;
                        vm.errorMsg = false;

                        vm.loginData = null;
                        vm.loading = false;

                        $timeout(function() {

                            $location.path('/home');
                        }, 2000)


                        // redirect to home page
                    } else {
                        // create an error message
                        vm.errorMsg = respose.data.message;
                        vm.loading = false;
                    }
                })
        };

        this.logout = function() {
            Auth.logout();
            $location.path('/logout');
            $timeout(function() {
                $location.path('/');
            }, 2000);
        }
    }
})();
// User.create(_regData)
//                 .then(function(respose) {
//                     console.log("After save, data:", respose);

//                     if (respose.data.success) {
//                         // create success message
//                         vm.successMsg = respose.data.message;
//                         vm.loading = false;

//                         $timeout(function() {
//                             $location.path('/home');
//                         }, 2000)


//                         // redirect to home page
//                     } else {
//                         // create an error message
//                         vm.errorMsg = respose.data.message;
//                         vm.loading = false;
//                     }
//                 })
//         };