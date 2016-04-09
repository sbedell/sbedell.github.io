/* This is a simple *ViewModel*
* JavaScript that defines the data and behavior of your UI
*/
function AppViewModel() {
    this.firstName = ko.observable("Steve");
    this.lastName = ko.observable("Stevington");
    this.fullName = ko.computed(function() {
        return `${this.firstName()} ${this.lastName()}`;
    }, this);

    this.capitalizeLastName = function() {
        let currentVal = this.lastName();
        this.lastName(currentVal.toUpperCase());
    };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
