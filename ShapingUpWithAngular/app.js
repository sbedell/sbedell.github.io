(function() {
    // array is all the depdencies
    var app = angular.module('store', ['product-directives']);

    app.controller('StoreController', [ '$http', function($http) {
        this.products = gems;
        // var store = this;
        // store.products = [];

        // $http.get('store-products.json', {"Content-Type": "application/json"}).then(function(gems) {
        //     store.products = gems;
        // });
        // $http({method: "GET", url: "store-products.json", data: "", headers: {"Content-Type": "application/json"}})
        // .then(function(gems) {
        //     store.products = gems;
        // })
    }]);

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
})();
