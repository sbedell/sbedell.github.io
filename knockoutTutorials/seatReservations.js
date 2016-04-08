// Class to represent a row in the seat reservations grid
function SeatReservation(name, initialMeal) {
    let self = this;
    self.name = name;
    self.meal = ko.observable(initialMeal);

    self.formattedPrice = ko.computed(function() {
        let price = self.meal().price;
        return price ? "$" + price.toFixed(2) : "None";
    });
}

// Overall viewmodel for this screen, along with initial state
function ReservationsViewModel() {
    var self = this;

    // Non-editable catalog data - would come from the server
    self.availableMeals = [
        { mealName: "Standard (sandwich)", price: 0 },
        { mealName: "Premium (lobster)", price: 34.95 },
        { mealName: "Ultimate (whole zebra)", price: 290 },
        { mealName: "Sushi", price: 42.0 },
    ];

    // Editable data
    self.seats = ko.observableArray([
        new SeatReservation("Steve", self.availableMeals[2]),
        new SeatReservation("Bert", self.availableMeals[1])
    ]);

    self.totalSurcharge = ko.computed(function() {
       var total = 0;
       for (let i = 0; i < self.seats().length; i++)
           total += self.seats()[i].meal().price;
       return total;
    });

    self.addSeat = function() {
        self.seats.push(new SeatReservation("", self.availableMeals[0]));
    }

    self.removeSeat = function(seat) {
        self.seats.remove(seat);
    }
}

ko.applyBindings(new ReservationsViewModel());
