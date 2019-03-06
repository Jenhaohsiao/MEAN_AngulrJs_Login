 (function() {
     'use strict';

     angular.module('authServices', []);
 })();


 (function() {
     'use strict';

     angular
         .module('authServices')
         .factory('Auth', authFactory);

     authFactory.$inject = ['$http'];

     function authFactory($http) {
         console.log("authFactory")

         var authFactory = {}

         authFactory.login = function(_loginData) {
             return $http.post('/api/authenticate', _loginData)
         }

         return authFactory;
     }
 })();