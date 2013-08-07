
(function (angular, enquire) {
    "use strict";
    angular.module('jander', []).
      config(function ($routeProvider) { // provider-injector
          // This is an example of config block.
          // You can have as many of these as you want.
          // You can only inject Providers (not instances)
          // into the config blocks.
      }).
      run(function ($rootScope, $log) { // instance-injector
          // This is an example of a run block.
          // You can have as many of these as you want.
          // You can only inject instances (not Providers)
          // into the run blocks
          
          
      });

    angular.module('jander').factory('navigation', ['$log', function($log) {
        var navService = {};
        var navStates = { DOCKED: 'DOCKED', MENU: 'MENU' };
        var state = navStates.MENU, menuOpen = false;

        enquire.register("screen and (max-width: 700px)", {
            setup: function () {
                // Load in content via AJAX (just the once)
                $log.log('enquire loaded!');
            },
            match: function () {
                state = navStates.MENU;
                $log.log('700px or less');
            },
            unmatch: function () {
                state = navStates.DOCKED;
                $log.log('more than 700px');
            }
        });

        //navService.docked = function () { return state === navStates.DOCKED; };
        navService.toggleNavMenu = function () { if (state === navStates.MENU) menuOpen = !menuOpen; };
        navService.navOpen = function () { return menuOpen; };
        navService.docked = function () { return state === navStates.DOCKED; };

        return navService;
    }]);

    angular.module('jander').controller('HeaderCtrl', ['$scope', 'navigation', function ($scope, navigation) {
        $scope.toggleNav = navigation.toggleNavMenu;
    }]);

    angular.module('jander').controller('SidebarCtrl', ['$scope', 'navigation', function ($scope, navigation) {
        $scope.navOpen = false, $scope.docked = true;
        var unwatchNav = $scope.$watch(navigation.navOpen, function (newVal, oldVal) {
            $scope.navOpen = newVal;
            //$scope.$digest();
        });
        
        var unwatchDocked = $scope.$watch(navigation.docked, function (newVal, oldVal) {
            $scope.docked = newVal;
            //$scope.$digest();
        }, true);
    }]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['jander', 'ngMobile']);
    });
    
})(angular, enquire);
