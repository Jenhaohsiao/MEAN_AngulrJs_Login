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

        return userFactory;
    }
})();

// $http.post('/api/users', _regData)
// .then(function(respose) {