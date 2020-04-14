import React from "react";
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import axios from "axios"

class ProjectsComponent extends Component {
    constructor(params) {
        super(props);
        this.state = {
            id : "",
            name : "" ,
            description : '',
            visible : true,
            createdAt : 0
        }
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

export {ProjectsComponent}