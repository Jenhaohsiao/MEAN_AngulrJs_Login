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
        this.dologin = function(loginData) {
            vm.loading = true;
            vm.successMsg = false;

            Auth.login(vm.loginData)
                .then(function(respose) {

                    if (respose.data.success) {
                        // create success message
                        vm.successMsg = respose.data.message;
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