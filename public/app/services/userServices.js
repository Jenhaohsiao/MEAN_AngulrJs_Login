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

        userFactory.getUsers = function() {
            return $http.get('/api/management/')
        }


        return userFactory;
    }
})();