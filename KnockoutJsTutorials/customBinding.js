class Answer {
    constructor(text) {
        this.answerText = text;
        this.points = ko.observable(1);
    }
}

class SurveyViewModel {
    constructor(question, pointsBudget, answers) {
        this.question = question;
        this.pointsBudget = pointsBudget;

        this.answers = $.map(answers, text => new Answer(text));

        this.pointsUsed = ko.computed(function() {
            let total = 0;
            for (let i = 0; i < this.answers.length; i++) {
                total += this.answers[i].points();
            }
            return total;
        }, this);
    }

    // Class method:
    save() {
        alert("to do");
    }
}

ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Start visible/invisible according to initial value
        let shouldDisplay = valueAccessor();
        $(element).toggle(shouldDisplay);
    },
    update: function(element, valueAccessor) {
        // On update, fade in/out
        let shouldDisplay = valueAccessor();
        shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
    }
};

ko.applyBindings(new SurveyViewModel("Which factors affect your technology choices?", 10, [
   "Functionality, compatibility, pricing - all that boring stuff",
   "How often it is mentioned on Hacker News",
   "Number of gradients/dropshadows on project homepage",
   "Totally believable testimonials on project homepage"
]));
