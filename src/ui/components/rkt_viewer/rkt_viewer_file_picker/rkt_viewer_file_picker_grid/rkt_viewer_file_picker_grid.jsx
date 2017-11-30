import React, { Component } from 'react';

// components
import RktViewerFilePickerGridStats from './rkt_viewer_file_picker_grid_stats/rkt_viewer_file_picker_grid_stats';
import RktViewerFilePickerGridEmpty from './rkt_viewer_file_picker_grid_empty/rkt_viewer_file_picker_grid_empty';
import RktViewerFilePickerGridContent from './rkt_viewer_file_picker_grid_content/rkt_viewer_file_picker_grid_content';

//actions
import {computeStats} from "./rkt_viewer_file_picker_grid_actions";

export default class RktViewerFilePickerGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: {},
            manufacturerInfo: [],
            loadedDicoms: 0,
            totalDicoms: 0,
        }

        this.handleGridContentChange = this.handleGridContentChange.bind(this);
        this.handleFileSelection = this.handleFileSelection.bind(this);
    }

    handleFileSelection(fileList) {

        // we update "GridContent" and "Stats" data
        this.clearState();
        this.setState({
            fileList: fileList,
            totalFiles: fileList.length
        });

    }

    clearState() {
        this.setState({
            fileList: [],
            totalFiles: 0,
            manufacturerInfo: [],
            loadedFiles: 0
        });
    }

    renderStatsComponent() {
        var manufacturerInfo = this.state.manufacturerInfo;
        var loadedFiles = this.state.loadedFiles;
        var totalFiles = this.state.totalFiles;

        return (
            <RktViewerFilePickerGridStats
                title="Folder info"
                items={manufacturerInfo}
                loadedDicoms={loadedFiles}
                totalDicoms={totalFiles} />
        );
    }

    renderGridComponent() {
        var fileList = this.state.fileList;

        // if files have been dragged and drop, they are displayed in the grid (as thumbnails)
        if (fileList.length > 0) {

            return (
                <RktViewerFilePickerGridContent
                    fileList={fileList}
                    onchangegridcontent={this.handleGridContentChange}
                    handleimgselected={this.props.handleimgselected}
                    handleimgassigned={this.props.handleimgassigned}
                />
            );

        // if files have NOT been dragged and drop yet, dropzone widget
        } else {

            return (<RktViewerFilePickerGridEmpty onselectedfiles={this.handleFileSelection}/>);
            
        }
    }

    handleGridContentChange(instances) {
        var myComponent = this;

        computeStats(instances, function(manufacturerDict) {
            myComponent.setState({
                loadedFiles: instances.length,
                manufacturerInfo: manufacturerDict
            });
        })
    }

    render() {

        return (
            <div className="grid-block medium-5 vertical file-picker-grid">
                {this.renderStatsComponent()}
                {this.renderGridComponent()}
            </div>
        );
    }
}