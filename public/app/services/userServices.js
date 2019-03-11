(function() {
    'use strict';
    angular.module('userServices', [])
})();


(function() {
    'use strict';

    angular
        .module('userServices')
        .factory('User', UserFactory);

    UserFactory.$inject = ['$http'];

    function UserFactory($http) {

        var userFactory = {}

        userFactory.create = function(_regData) {
            return $http.post('/api/users', _regData)
        }

        // User.renewSession(username);
        userFactory.renewSession = function(_username) {
            return $http.get('/api/renewToken/' + _username);
        }

        userFactory.getPermission = function() {
            return $http.get('/api/permission/')
        }


        // Get all the users from database
        userFactory.getUsers = function() {
            return $http.get('/api/management/');
        };

        // Get user to then edit
        userFactory.getUser = function(id) {
            return $http.get('/api/edit/' + id);
        };

        // Delete a user
        userFactory.deleteUser = function(username) {
            return $http.delete('/api/management/' + username);
        };

        // Edit a user
        userFactory.editUser = function(id) {
            return $http.put('/api/edit', id);
        };

        return userFactory;
    }
})();