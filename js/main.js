
(function (angular, enquire) {
    
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
          
          enquire.register("screen and (max-width: 700px)", {
              setup: function () {
                  // Load in content via AJAX (just the once)
                  $log.log('enquire loaded!');
              },
              match: function () {
                  // Show sidebar
                  $log.log('700px or less');
              },
              unmatch: function () {
                  $log.log('more than 700px');
              }
          });
      });

    angular.module('jander').controller('SidebarCtrl', function($scope) {
        $scope.setSidebar = function($event, sidebar) {
            
        };
    });

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['jander', 'ngMobile']);
    });
    
})(angular, enquire);
