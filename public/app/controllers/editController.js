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
        '$timeout',
    ];

    function EditController(
        $scope,
        $routeParams,
        User,
        $timeout,
    ) {
        var vm = this;

        $scope.nameTab = 'active';
        vm.phase1 = true;

        User.getUser($routeParams.id).then(function(response) {

            if (response.data.success) {
                vm.newName = response.data.user.name;
                vm.currentUser = response.data.user._id;

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
            vm.errorMsg = false; // Clear any error messages
            vm.disabled = true; // Disable form while processing
            // Check if the name being submitted is valid
            if (valid) {
                var userObject = {}; // Create a user object to pass to function
                userObject._id = vm.currentUser; // Get _id to search database
                userObject.name = vm.newName; // Set the new name to the user
                // Runs function to update the user's name
                User.editUser(userObject).then(function(data) {
                    // Check if able to edit the user's name
                    if (data.data.success) {
                        vm.successMsg = data.data.message; // Set success message
                        // Function: After two seconds, clear and re-enable
                        $timeout(function() {
                            vm.nameForm.name.$setPristine(); // Reset name form
                            vm.nameForm.name.$setUntouched(); // Reset name form
                            vm.successMsg = false; // Clear success message
                            vm.disabled = false; // Enable form for editing
                        }, 2000);
                    } else {
                        vm.errorMsg = data.data.message; // Clear any error messages
                        vm.disabled = false; // Enable form for editing
                    }
                });
            } else {
                vm.errorMsg = 'Please ensure form is filled out properly'; // Set error message
                vm.disabled = false; // Enable form for editing
            }

        }


        // Function: Update the user's e-mail
        vm.updateEmail = function(newEmail, valid) {
            vm.errorMsg = false; // Clear any error messages
            vm.disabled = true; // Lock form while processing
            // Check if submitted e-mail is valid
            if (valid) {
                var userObject = {}; // Create the user object to pass in function
                userObject._id = vm.currentUser; // Get the user's _id in order to edit
                userObject.email = vm.newEmail; // Pass the new e-mail to save to user in database
                // Run function to update the user's e-mail
                User.editUser(userObject).then(function(data) {
                    // Check if able to edit user
                    if (data.data.success) {
                        vm.successMsg = data.data.message; // Set success message
                        // Function: After two seconds, clear and re-enable
                        $timeout(function() {
                            vm.emailForm.email.$setPristine(); // Reset e-mail form
                            vm.emailForm.email.$setUntouched(); // Reset e-mail form
                            vm.successMsg = false; // Clear success message
                            vm.disabled = false; // Enable form for editing
                        }, 2000);
                    } else {
                        vm.errorMsg = data.data.message; // Set error message
                        vm.disabled = false; // Enable form for editing
                    }
                });
            } else {
                vm.errorMsg = 'Please ensure form is filled out properly'; // Set error message
                vm.disabled = false; // Enable form for editing
            }
        };

        // Function: Update the user's username
        vm.updateUsername = function(newUsername, valid) {
            vm.errorMsg = false; // Clear any error message
            vm.disabled = true; // Lock form while processing
            // Check if username submitted is valid
            if (valid) {
                var userObject = {}; // Create the user object to pass to function
                userObject._id = vm.currentUser; // Pass current user _id in order to edit
                userObject.username = vm.newUsername; // Set the new username provided
                // Runs function to update the user's username
                User.editUser(userObject).then(function(data) {
                    // Check if able to edit user
                    if (data.data.success) {
                        vm.successMsg = data.data.message; // Set success message
                        // Function: After two seconds, clear and re-enable
                        $timeout(function() {
                            vm.usernameForm.username.$setPristine(); // Reset username form
                            vm.usernameForm.username.$setUntouched(); // Reset username form
                            vm.successMsg = false; // Clear success message
                            vm.disabled = false; // Enable form for editing
                        }, 2000);
                    } else {
                        vm.errorMsg = data.data.message; // Set error message
                        vm.disabled = false; // Enable form for editing
                    }
                });
            } else {
                vm.errorMsg = 'Please ensure form is filled out properly'; // Set error message
                vm.disabled = false; // Enable form for editing
            }
        };

        // Function: Update the user's permission
        vm.updatePermissions = function(newPermission) {
            vm.errorMsg = false; // Clear any error messages
            vm.disableUser = true; // Disable button while processing
            vm.disableModerator = true; // Disable button while processing
            vm.disableAdmin = true; // Disable button while processing
            var userObject = {}; // Create the user object to pass to function
            userObject._id = vm.currentUser; // Get the user _id in order to edit
            userObject.permission = newPermission; // Set the new permission to the user
            // Runs function to udate the user's permission
            User.editUser(userObject).then(function(data) {
                // Check if was able to edit user
                if (data.data.success) {
                    vm.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        vm.successMsg = false; // Set success message
                        vm.newPermission = newPermission; // Set the current permission variable
                        // Check which permission was assigned to the user
                        if (newPermission === 'user') {
                            vm.disableUser = true; // Lock the 'user' button
                            vm.disableModerator = false; // Unlock the 'moderator' button
                            vm.disableAdmin = false; // Unlock the 'admin' button
                        } else if (newPermission === 'moderator') {
                            vm.disableModerator = true; // Lock the 'moderator' button
                            vm.disableUser = false; // Unlock the 'user' button
                            vm.disableAdmin = false; // Unlock the 'admin' button
                        } else if (newPermission === 'admin') {
                            vm.disableAdmin = true; // Lock the 'admin' buton
                            vm.disableModerator = false; // Unlock the 'moderator' button
                            vm.disableUser = false; // unlock the 'user' button
                        }
                    }, 2000);
                } else {
                    vm.errorMsg = data.data.message; // Set error message
                    vm.disabled = false; // Enable form for editing
                }
            });
        };
    }
})();