var app = angular.module('store', []);

app.controller('StoreController', function() {
    this.products = gems;
});

app.controller("PanelController", function() {
    this.tab = 1;

    this.selectTab = function(newValue) {
        this.tab = newValue;
    };

    this.isSelected = function(checkTab) {
        return this.tab === checkTab;
    };
});

app.controller('GalleryController', function() {
    this.current = 0;

    this.setCurrent = function(imageNumber) {
        this.current = imageNumber || 0;
    };
});

app.controller("ReviewController", function() {
    this.review = {};

    this.addReview = function(product){
        this.review.createdOn = Date.now();
        product.reviews.push(this.review);
        this.review = {};
    };
});

app.directive("productDescription", function() {
    return {
        restrict: 'E',
        templateUrl: 'product-description.html'
    };
});

app.directive("productReviews", function() {
    return {
        restrict: 'E',
        templateUrl: "product-reviews.html"
    };
});

app.directive("productSpecs", function() {
    return {
        restrict: 'E',
        templateUrl: "product-specs.html"
    };
});

app.directive("productTabs", function() {
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

var gems = [
    {
        name: "Dodecahedron",
        price: 2.95,
        shine: 4,
        rarity: 7,
        faces: 14,
        color: "#CCC",
        description: "12 sides I think?",
        canPurchase: false,
        soldOut: false,
        image: '../img/skytree1.png',
        images: [
            '../img/skytree1.png',
            '../img/skytree2.jpg'
        ],
        reviews: [
            {
                stars: 5,
                body: "I love this gem!",
                author: "john@cena.com"
            },
            {
                stars: 1,
                body: "This rock suxxx!",
                author: "tim@haterade.com"
            }
        ]
    },
    {
        name: "Pentagonal Gem",
        price: 5.95,
        shine: 5,
        rarity: 6,
        faces: 5,
        color: "#EEE",
        description: "5 sided gem",
        canPurchase: true,
        soldOut: false,
        image: '../img/skytree2.jpg'
    },
];
