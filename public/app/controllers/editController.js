(function() {
    'use strict';

    angular.module('editController', [

    ]);
})();


(function() {
    'use strict';

    angular
        .module('editController')
        .controller('EditController', EditController);

    EditController.$inject = [
        '$scope',
        '$routeParams',
        'User',
    ];

    function EditController(
        $scope,
        $routeParams,
        User,
    ) {
        var vm = this;

        $scope.nameTab = 'active';
        vm.phase1 = true;

        User.getUser($routeParams.id).then(function(response) {

            if (response.data.success) {
                vm.newName = response.data.user.name;
            } else {
                vm.errorMsg = response.data.message;
            }
        })


        vm.namePhase = function() {
            $scope.nameTab = 'active';
            $scope.usernameTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
            vm.phase1 = true;
            vm.phase2 = false;
            vm.phase3 = false;
            vm.phase4 = false;

        };

        vm.usernamePhase = function() {
            $scope.nameTab = 'default';
            $scope.usernameTab = 'active';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'default';
            vm.phase1 = false;
            vm.phase2 = true;
            vm.phase3 = false;
            vm.phase4 = false;
        };

        vm.emailPhase = function() {
            $scope.nameTab = 'default';
            $scope.usernameTab = 'default';
            $scope.emailTab = 'active';
            $scope.permissionsTab = 'default';
            vm.phase1 = false;
            vm.phase2 = false;
            vm.phase3 = true;
            vm.phase4 = false;

        };

        vm.permissionPhase = function() {
            $scope.nameTab = 'default';
            $scope.usernameTab = 'default';
            $scope.emailTab = 'default';
            $scope.permissionsTab = 'active';
            vm.phase1 = false;
            vm.phase2 = false;
            vm.phase3 = false;
            vm.phase4 = true;

        };

        vm.updateName = function(newName, valid) {
            vm.errorMsg = false;
            vm.disabled = true;


            if (valid) {


            } else {
                vm.errorMsg = "Please ensure form is filled out properly";
            }

        }
    }
})();