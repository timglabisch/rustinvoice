import React from 'react'
import Action from './action/Action'
import ImportStore from './store/ImportStore'

export default React.createClass({

    getInitialState() {
        return {
            fileInfos: ImportStore.getFileInfos()
        };
    },

    onStatusChange() {
        this.setState({
            fileInfos: ImportStore.getFileInfos()
        });
    },

    componentDidMount: function () {
        this.unsubscribe = ImportStore.listen(this.onStatusChange);
    },

    componentWillUnmount: function () {
        this.unsubscribe();
    },

    onDragOver: function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        return false;
    },

    readEntries: function(reader) {
        reader.readEntries(function(results) {
            for (let entry of results) {

                if (entry.isDirectory) {
                    this.readEntries(entry.createReader());
                    return;
                }

                Action.require_file_upload(entry);
            }
        }.bind(this));
    },

    onDrop: function(e) {
        e.preventDefault();

        var length = e.dataTransfer.items.length;
        for (var i = 0; i < length; i++) {
            var entry = e.dataTransfer.items[i].webkitGetAsEntry();
            if (entry.isFile) {
                Action.require_file_upload(entry);
            } else if (entry.isDirectory) {
                this.readEntries(entry.createReader());
            }
        }
    },

    render() {
        return <div>
            <div
                style={{ display: 'block', border: '1px solid black', minHeight: '500px', background: 'lime' }}
                onDrop={this.onDrop}
                onDragEnter={this.onDragOver}
                onDragOver={this.onDragOver}>
            </div>

            <div className="panel panel-default" style={{marginTop: "20px"}}>
                <div className="panel-heading">Uploads (<strong>{this.state.fileInfos.length}</strong>)</div>
                <table className="table">
                    <tbody>
                        { this.state.fileInfos.map(function (v) {
                            return <tr key={v.id}>
                                <td>{v.entry.name}</td>
                                <td>{v.state}</td>
                            </tr>
                        }.bind(this))}
                    </tbody>
                </table>
            </div>
        </div>
    }
})
