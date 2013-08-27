(function (angular, enquire) {
    "use strict";
    angular.module('jander', ['ngAnimate', 'ngTouch', 'ngSanitize']).
    /*config(function ($routeProvider) { // provider-injector
        // This is an example of config block.
        // You can have as many of these as you want.
        // You can only inject Providers (not instances)
        // into the config blocks.
    }).*/
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
        NAV_STATES: {
            DOCKED: 'DOCKED',
            MENU: 'MENU'
        }
    });

    angular.module('jander').factory('navigation', ['$log', '$rootScope', 'CONSTANTS', function ($log, $rootScope, CONSTANTS) {
        var navService = {},
            state = CONSTANTS.NAV_STATES.DOCKED,
            menuOpen = false;

        function fireDockStateChanged() {
            $rootScope.$broadcast(CONSTANTS.EVENTS.NAV_DOCK_STATE_CHANGE, state);
        }

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
        navService.toggleNavMenu = function (force) {
            if (state === CONSTANTS.NAV_STATES.MENU || force) { menuOpen = !menuOpen; }
        };
        navService.navOpen = function () {
            return menuOpen;
        };
        navService.docked = function () {
            return state === CONSTANTS.NAV_STATES.DOCKED;
        };

        return navService;
    }]);

    angular.module('jander').controller('GitHubCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.feed = [];
        
        $http.jsonp('https://github.com/jamesandersen.json?callback=JSON_CALLBACK').success(function (data, status, headers, config) {
            function getRepositoryLink(item) {
                return '<a href="' + item.repository.url + '" target="_blank">' + item.repository.name + '</a>';
            }
            
            function getCommitLink(item) {
                return '<a href="' + item.url + '" target="_blank">' + item.payload.shas[0][2] + '</a>';
            }
            
            function getCommentLink(item) {
                return '<a href="' + item.url + '" target="_blank">comment</a>';
            }
            
            function getDescription(item) {
                switch (item.type) {
                case 'PushEvent': return 'commit to ' + getRepositoryLink(item) + ': ' + getCommitLink(item);
                case 'CreateEvent': 
                    if (item.payload.ref_type === 'repository')
                        return 'created ' + getRepositoryLink(item);
                    else
                        return 'created ' + item.payload.ref + ' ' + item.payload.ref_type + ' of ' + getRepositoryLink(item);
                case 'IssueCommentEvent': return getCommentLink(item) + ' on ' + getRepositoryLink(item);
                default: return 'Other';
                }
            }
            
            function getIcon(item) {
                switch(item.type) {
                    case 'PushEvent': return 'icon-arrow-up';
                    case 'CreateEvent': return item.payload.ref_type == 'repository' ? 'icon-plus-sign' : 'icon-code-fork';
                    case 'IssueCommentEvent': return 'icon-comment';
                    default: return 'icon-rss';
                }
            }
            
            angular.forEach(data, function(item) {
                var activity = {
                    date : new Date(item.created_at),
                    type : item.type,
                    description : getDescription(item),
                    icon: getIcon(item)
                };
                
                $scope.feed.push(activity);
            });
          });
    }]);
    
    angular.module('jander').controller('HeaderCtrl', ['$scope', 'navigation', function ($scope, navigation) {
            $scope.toggleNav = navigation.toggleNavMenu;
    }]);

    angular.module('jander').controller('SidebarCtrl', ['$scope', '$timeout', '$animate', 'CONSTANTS', 'navigation', function ($scope, $timeout, $animate, CONSTANTS, navigation) {
            //            $scope.navOpen = false, $scope.docked = true;
            //            $scope.docked = navigation.docked();

            // TODO: move to a directive of some kind... shouldn't touch the DOM here
            var sidebar = angular.element('#sidebar'),
                navOpen = false;
            var deregisterDockStateChangeHandler = $scope.$on(CONSTANTS.EVENTS.NAV_DOCK_STATE_CHANGE, function (eventName, eventArgs) {
                $scope.$apply(function () {
                    if (eventArgs === CONSTANTS.NAV_STATES.DOCKED && navigation.navOpen()) {
                        sidebar.removeClass('open');
                        navigation.toggleNavMenu(true);
                    }
                });
            });

            var unwatchNav = $scope.$watch(navigation.navOpen, function (newVal, oldVal) {
                $animate[newVal ? 'addClass' : 'removeClass'].call(undefined, sidebar, 'open');
            });
            }]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['jander']);
    });

    })(angular, enquire);