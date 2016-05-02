/* This is a simple *ViewModel*
* JavaScript that defines the data and behavior of your UI
*/
class AppViewModel {
    constructor() {
        this.firstName = ko.observable("Steve");
        this.lastName = ko.observable("Stevington");

        this.fullName = ko.computed(function() {
            return `${this.firstName()} ${this.lastName()}`;
        }, this);
    }

    capitalizeLastName() {
        this.lastName(this.lastName().toUpperCase());
    }

    lowercaseLastName() {
        this.lastName(this.lastName().toLowerCase());
    }
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
