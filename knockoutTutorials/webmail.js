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
            window.location.hash = folder;
        }

        this.goToMail = function(mail) {
            window.location.hash = mail.folder + '/' + mail.id;
        };

        // Client-side routes with SammyJS
        Sammy(function() {
            this.get('#:folder', function() {
                self.chosenFolderId(this.params.folder);
                self.chosenMailData(null);
                $.get("/mail", { folder: this.params.folder }, self.chosenFolderData);
            });

            this.get('#:folder/:mailId', function() {
                self.chosenFolderId(this.params.folder);
                self.chosenFolderData(null);
                $.get("/mail", { mailId: this.params.mailId }, self.chosenMailData);
            });

            // default to Inbox on a no-hash URL (hence blank)
            this.get('', function() { this.app.runRoute('get', '#Inbox') });
        }).run();
    }
};

ko.applyBindings(new WebmailViewModel());
