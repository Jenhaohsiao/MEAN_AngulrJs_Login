(function() {
    'use strict';

    angular.module('userControllers', [
        'userServices'
    ]);
})();


(function() {
    'use strict';

    angular
        .module('userControllers')
        .controller('registerController', registerController);

    registerController.$inject = [
        '$http',
        '$timeout',
        '$state',
        'User'
    ];

    function registerController(
        $http,
        $timeout,
        $state,
        User) {

        var vm = this;
        vm.loading = false;

        function registerInit() {

            vm.regData = {
                permission: 'user' // temporary
            }

        }
        registerInit();

        this.regUser = function(_regData) {

            vm.loading = true;
            vm.successMsg = null;
            vm.errorMsg = null;

            User.create(_regData)
                .then(function(respose) {
                    console.log("After save, data:", respose);

                    if (respose.data.success) {
                        // create success message
                        vm.successMsg = respose.data.message;
                        vm.loading = false;

                        $timeout(function() {

                            $state.go('home');

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