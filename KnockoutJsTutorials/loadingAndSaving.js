class Task {
    constructor(data) {
        this.title = ko.observable(data.title);
        this.isDone = ko.observable(data.isDone);
    }
}

function TaskListViewModel() {
    // Data
    let self = this;
    this.tasks = ko.observableArray([]);
    this.newTaskText = ko.observable();
    this.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), task => !task.isDone() && !task._destroy);
    });

    // Operations
    this.addTask = function() {
        self.tasks.push(new Task({ title: this.newTaskText() }));
        self.newTaskText("");
    };
    
    this.removeTask = function(task) {
        self.tasks.destroy(task)
    };
    
    // this.save = function() {
    //     $.ajax("/tasks", {
    //         data: ko.toJSON({ tasks: self.tasks }),
    //         type: "POST", contentType: "application/json",
    //         success: function(result) {
    //             alert(result);
    //         }
    //     });
    // };
    
    // Load initial state from server, convert it to Task instances, then populate self.tasks
    // $.getJSON("/tasks", allData => {
    //     let mappedTasks = $.map(allData, item => new Task(item));
    //     self.tasks(mappedTasks);
    // });  
}

ko.applyBindings(new TaskListViewModel());

// Can't seem to make this into a class, too much messiness with this and self...
// class TaskListViewModel {
//     constructor() {
//         let self = this;
//         this.tasks = ko.observableArray([]);
//         this.newTaskText = ko.observable();
//         this.incompleteTasks = ko.computed(() => {
//             return ko.utils.arrayFilter(this.tasks(), task => !task.isDone() && !task._destroy);
//         });
//     }

//     // Class methods:
//     addTask() {
//         this.tasks.push(new Task({ title: this.newTaskText() }));
//         this.newTaskText("");
//     }
    
//     removeTask(task) {
//         self.tasks.destroy(task);
//     }  
// }
