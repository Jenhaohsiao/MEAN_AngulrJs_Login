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

    ManagementController.$inject = [];

    function ManagementController() {
        var vm = this;

        console.log("ManagementController here")
    }
})();