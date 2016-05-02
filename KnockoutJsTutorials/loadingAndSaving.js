class Task {
    constructor(data) {
        this.title = ko.observable(data.title);
        this.isDone = ko.observable(data.isDone);
    }
}

class TaskListViewModel {
    constructor() {
        let self = this;
        this.tasks = ko.observableArray([]);
        this.newTaskText = ko.observable();
        this.incompleteTasks = ko.computed(function() {
            return ko.utils.arrayFilter(self.tasks(), task => !task.isDone() && !task._destroy);
        });

        // Methods:
        this.removeTask = function(task) {
            self.tasks.destroy(task)
        };
    }

    // Class method:
    addTask() {
        this.tasks.push(new Task({ title: this.newTaskText() }));
        this.newTaskText("");
    }
}

ko.applyBindings(new TaskListViewModel());

/**
 * Loading and Saving data from server, using jQuery
 *
this.save = function() {
    $.ajax("/tasks", {
        data: ko.toJSON({ tasks: self.tasks }),
        type: "POST", contentType: "application/json",
        success: function(result) {
            alert(result);
        }
    });
};

Load initial state from server, convert it to Task instances, then populate self.tasks
$.getJSON("/tasks", allData => {
    let mappedTasks = $.map(allData, item => new Task(item));
    self.tasks(mappedTasks);
});

*/
