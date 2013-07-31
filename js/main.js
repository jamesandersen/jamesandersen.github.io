
(function (angular) {
    
    angular.module('jander', []).
      config(function ($routeProvider) { // provider-injector
          // This is an example of config block.
          // You can have as many of these as you want.
          // You can only inject Providers (not instances)
          // into the config blocks.
      }).
      run(function () { // instance-injector
          // This is an example of a run block.
          // You can have as many of these as you want.
          // You can only inject instances (not Providers)
          // into the run blocks
      });

    angular.module('jander').controller('SidebarCtrl', function($scope) {
        $scope.setSidebar = function($event, sidebar) {
            
        };
    });

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['jander', 'ngMobile']);
    });
    
})(angular);
