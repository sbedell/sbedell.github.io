(function() {
    angular.module('product-directives', [])

    .directive("productDescription", function() {
        return {
            restrict: 'E',
            templateUrl: 'product-description.html'
        };
    })

    .directive("productReviews", function() {
        return {
            restrict: 'E',
            templateUrl: "product-reviews.html"
        };
    })

    .directive("productSpecs", function() {
        return {
            restrict: 'E',
            templateUrl: "product-specs.html"
        };
    })

    .directive("productTabs", function() {
        return {
            restrict: 'E',
            templateUrl: 'product-tabs.html',
            controller: function() {
                this.tab = 1;
                this.isSet = function(checkTab) {
                    return this.tab === checkTab;
                };

                this.setTab = function(setTab) {
                    this.tab = setTab;
                };
            },
            controllerAs: "tab"
        };
    });
})();
