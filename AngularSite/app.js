(function() {
    angular.module("myWebsite", [])

    .controller("tabController", function() {
        this.tab = 1;
        this.isSet = function(checkTab) {
            return this.tab === checkTab;
        };

        this.setTab = function(newTab) {
            this.tab = newTab;
        };
    })

    .controller("securityController", function() {
        // rip code into here
    })

    .controller("storageController", function() {
        // rip code into here
    })

    .directive("mainSection", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/main-section.html',
            controller: 'tabController',
            controllerAs: 'tab'
        };
    })

    .directive("securityPage", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/security.html'
        }
    })

    .directive("storageDemo", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/storageDemo.html'
        };
    })

    .directive("resumePage", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/resume.html'
        };
    });
}());
