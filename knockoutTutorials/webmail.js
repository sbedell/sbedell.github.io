class WebmailViewModel {
    constructor() {
        let self = this;

        // Data
        this.folders = ['Inbox', 'Archive', 'Sent', 'Spam'];
        this.chosenFolderId = ko.observable();
        this.chosenFolderData = ko.observable();
        this.chosenMailData = ko.observable();

        // Functions
        // $.get is jQuery
        this.goToFolder = function(folder) {
            self.chosenFolderId(folder);
            self.chosenMailData(null); // Stop showing an email
            $.get('/mail', { folder: folder }, self.chosenFolderData);
        }

        this.goToMail = function(mail) {
            self.chosenFolderId(mail.folder);
            self.chosenFolderData(null); // Stop showing a folder
            $.get("/mail", { mailId: mail.id }, self.chosenMailData);
        };

        // Show inbox by default
        this.goToFolder('Inbox');
    }
};

ko.applyBindings(new WebmailViewModel());
