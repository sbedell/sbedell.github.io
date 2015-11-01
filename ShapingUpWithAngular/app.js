var app = angular.module('store', []);

app.controller('StoreController', function() {
    this.products = gems;
});

app.controller("PanelController", function() {
    this.tab = 1;

    this.selectTab = function(setTab) {
        this.tab = setTab;
    };

    this.isSelected = function(checkTab) {
        return this.tab === checkTab;
    };
});

var gems = [
    {
        name: "Dodecahedron",
        price: 2.95,
        description: "12 sides I think?",
        canPurchase: false,
        soldOut: false,
        image: '../img/skytree1.png',
        images: [
            {
                full: '../img/skytree1.png'
            },
            {
                full: '../img/skytree2.jpg'
            }
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
        description: "5 sided gem",
        canPurchase: true,
        soldOut: false,
        image: '../img/skytree2.jpg'
    },
];
