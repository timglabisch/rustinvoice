
import Reflux from "reflux";
import Action from './../action/Action';

export default Reflux.createStore({

    init: function () {
        this.fileInfos = [];
        this.concurrent_uploads = 0;
        this.listenTo(Action.require_file_upload, this.on_require_file_upload);
    },

    on_require_file_upload: function(fileEntry) {

        var id = Math.random();

        var fileInfo = {
            id: id,
            entry: fileEntry,
            state: 'PRE_READ_FILE'
        };

        this.fileInfos.push(fileInfo);

        this.handle_try_work_on_queue();
    },

    handle_try_work_on_queue : function() {
        if (this.concurrent_uploads >= 5) {
            return;
        }

        console.log(this.concurrent_uploads);

        for (var x of this.fileInfos) {

            if (x.state != "PRE_READ_FILE") {
                continue;
            }

            this.update(x.id, {
                state: 'PRE_UPLOAD_FILE'
            });

            this.concurrent_uploads++;
            x.entry.file(
                function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function () {

                        this.uploadFile(x, reader.result);

                        this.trigger();
                    }.bind(this);
                    reader.readAsDataURL(file);
                }.bind(this),
                function() {
                    this.update(x.id, {
                        state: 'PRE_READ_FILE'
                    });
                    this.concurrent_uploads--;
                }.bind(this)
            );

            if (this.concurrent_uploads >= 5) {
                console.log("WAIT....");
                return;
            }
        }
    },

    uploadFile: function(fileInfo, data) {

        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://127.0.0.1:6767/import/upload', true);
        xhr.onreadystatechange = function() {

            if (xhr.readyState != 4) {
                return;
            }

            this.concurrent_uploads--;
            this.update(fileInfo.id, {
                state: 'UPLOADED'
            });

            this.trigger();

            this.handle_try_work_on_queue();

        }.bind(this);
        xhr.send(data.split(',')[1]);
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
        return this.fileInfos.filter(function(v) {
            return v.state != "PRE_READ_FILE" && v.state != "UPLOADED";
        });
    },

    isLoading: function () {

    },

    getQuery: function() {
        return this.query;
    }


});
