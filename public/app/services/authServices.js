 (function() {
     'use strict';

     angular.module('authServices', []);
 })();


 (function() {
     'use strict';

     angular
         .module('authServices')
         .factory('Auth', authFactory);

     authFactory.$inject = ['$http', 'AuthToken'];

     function authFactory($http, AuthToken) {

         var authFactory = {}

         //  Auth.login(_loginData)
         authFactory.login = function(_loginData) {
             return $http.post('/api/authenticate', _loginData)
                 .then(function(response) {
                     AuthToken.setToken(response.data.token);
                     return response
                 })
         }

         //  Auth.isLoggedIn()
         authFactory.isLoggedIn = function() {

             if (AuthToken.getToken()) {
                 return true;
             } else {
                 return false;
             }
         }

         //  Auth.logout()
         authFactory.logout = function() {
             AuthToken.setToken();

         }


         return authFactory;
     }
 })();

 (function() {
     'use strict';

     angular
         .module('authServices')
         .factory('AuthToken', AuthTokenService);

     AuthTokenService.$inject = ['$window'];

     function AuthTokenService($window) {
         var authTokenFactory = {}

         // how to use :  AuthToken.setToken(toeken);
         authTokenFactory.setToken = function(token) {
             if (token) {
                 $window.localStorage.setItem('token', token);
             } else {
                 $window.localStorage.removeItem('token');
             }
         }

         // how to use :  AuthToken.getToken(toeken);
         authTokenFactory.getToken = function(token) {
             return $window.localStorage.getItem('token')
         }

         return authTokenFactory;

     }
 })();