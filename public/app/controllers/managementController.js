(function() {
    'use strict';

    angular.module('managementController', [

    ]);
})();

(function() {
    'use strict';

    angular
        .module('managementController')
        .controller('ManagementController', ManagementController);

    ManagementController.$inject = [
        'User',
    ];

    function ManagementController(
        User
    ) {
        var vm = this;

        vm.loading = true;
        vm.accessDenied = true;
        vm.errorMsg = false;
        vm.editAccess = false;
        vm.deleteAccess = false;
        vm.limit = 5;

        function getUsers() {

            User.getUsers().then(function(response) {
                if (response.data.success) {

                    if (response.data.permission === "admin" || response.data.permission === "moderator") {
                        vm.users = response.data.users;
                        vm.loading = false;
                        vm.accessDenied = false;
                        if (response.data.permission === "admin") {
                            vm.editAccess = true;
                            vm.deleteAccess = true;
                        } else if (response.data.permission === "moderator")
                            vm.editAccess = true;

                    } else {
                        vm.errorMsg = "Insufficient Permissions";
                        vm.loading = false;
                    }

                } else {
                    vm.errorMsg = response.data.message;
                    vm.loading = false;

                }

            })
        }

        getUsers();


        vm.showMore = function(_number) {

            vm.ShowMoreError = false;

            if (_number > 0) {

                vm.limit = _number;

            } else {

                vm.ShowMoreError = "Please enter a valid number";
            }

        };


        vm.showAll = function() {
            vm.limit = undefined;
            vm.ShowMoreError = false;
        };

        vm.deleteUser = function(_username) {
            User.deleteUser(_username).then(function(response) {

                if (response.data.success) {
                    getUsers();

                } else {
                    vm.ShowMoreError = response.data.message;
                }

            })

        }

    }
})();