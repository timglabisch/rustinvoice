
import Reflux from "reflux";
import Action from './../action/Action';

export default Reflux.createStore({

    init: function () {
        this.fileInfos = [];

        this.listenTo(Action.require_file_upload, this.on_require_file_upload);
    },

    on_require_file_upload: function(fileEntry) {

        var id = Math.random();

        var fileInfo = {
            id: id,
            entry: fileEntry,
            content: null,
            state: 'PRE_READ_FILE'
        };

        this.fileInfos.push(fileInfo);

        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function () {

                this.update(id, {
                    content: reader.result,
                    state: 'PRE_UPLOAD_FILE'
                });

                this.uploadFile(fileInfo);

                this.trigger();
            }.bind(this);
            reader.readAsDataURL(file);
        }.bind(this));
    },

    uploadFile: function(fileInfo) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/import/upload', true);
        xhr.setRequestHeader("X_FILENAME", fileInfo.entry.name);
        xhr.onreadystatechange = function() {

            this.update(fileInfo.id, {
                state: 'UPLOADED_WITH_' + xhr.readyState + '_' + xhr.status
            });

            this.trigger();

        }.bind(this);
        xhr.send(fileInfo.content);
    },

    update: function(id, data) {
        for (var x of this.fileInfos) {
            if (x.id == id) {
                for (var attrname in data) {
                    x[attrname] = data[attrname];
                }
                return;
            }
        }
    },

    getFileInfos: function() {
        return this.fileInfos;
    },

    isLoading: function () {

    },

    getQuery: function() {
        return this.query;
    }


});
