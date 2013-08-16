
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
    
    // define constant values to be used across controller, services, etc.
    angular.module('jander').constant('CONSTANTS', {
        EVENTS: {
            NAV_DOCK_STATE_CHANGE: 'NAV_DOCK_STATE_CHANGE'
        },
        NAV_STATES: { DOCKED: 'DOCKED', MENU: 'MENU' }
    });
    
    angular.module('jander').factory('navigation', ['$log', '$rootScope', 'CONSTANTS', function($log, $rootScope, CONSTANTS) {
        var navService = {};
        var state = CONSTANTS.NAV_STATES.DOCKED, menuOpen = false;

        function fireDockStateChanged() { $rootScope.$broadcast(CONSTANTS.EVENTS.NAV_DOCK_STATE_CHANGE, state); }

        enquire.register("screen and (max-width: 700px)", {
            setup: function () {
                // Load in content via AJAX (just the once)
                $log.log('enquire loaded!');
            },
            match: function () {
                state = CONSTANTS.NAV_STATES.MENU;
                $log.log('700px or less');
                fireDockStateChanged();
            },
            unmatch: function () {
                state = CONSTANTS.NAV_STATES.DOCKED;
                $log.log('more than 700px');
                fireDockStateChanged();
            }
        });

        //navService.docked = function () { return state === navStates.DOCKED; };
        navService.toggleNavMenu = function () { if (state === CONSTANTS.NAV_STATES.MENU) menuOpen = !menuOpen; };
        navService.navOpen = function () { return menuOpen; };
        navService.docked = function () { return state === CONSTANTS.NAV_STATES.DOCKED; };

        return navService;
    }]);

    angular.module('jander').controller('HeaderCtrl', ['$scope', 'navigation', function ($scope, navigation) {
        $scope.toggleNav = navigation.toggleNavMenu;
    }]);

    angular.module('jander').controller('SidebarCtrl', ['$scope', '$timeout', 'CONSTANTS', 'navigation', function ($scope, $timeout, CONSTANTS, navigation) {
        $scope.navOpen = false, $scope.docked = true;
        $scope.docked = navigation.docked();
        var deregisterDockStateChangeHandler = $scope.$on(CONSTANTS.EVENTS.NAV_DOCK_STATE_CHANGE, function(eventName, eventArgs) {
            $scope.$apply(function() { $scope.docked = eventArgs === CONSTANTS.NAV_STATES.DOCKED; });
        });
        
        var unwatchNav = $scope.$watch(navigation.navOpen, function (newVal, oldVal) {
            $scope.navOpen = newVal;
            //$scope.$digest();
        });
        
        //var unwatchDocked = $scope.$watch(navigation.docked, function (newVal, oldVal) {
        //    $scope.docked = newVal;
        //    //$scope.$digest();
        //}, true);
    }]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['jander', 'ngMobile']);
    });
    
})(angular, enquire);
