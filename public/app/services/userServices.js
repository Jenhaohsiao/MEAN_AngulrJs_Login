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
            var getRenew = $http.get('/api/renewToken/' + _username);;
            console.log("getRenew:", getRenew);

            return getRenew
        }

        return userFactory;
    }
})();