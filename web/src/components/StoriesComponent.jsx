import React from "react";
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import axios from "axios"

class StoriesComponent extends Component{
    constructor(params) {
        super(props);
        this.state = {
            projectId : null,
            location : null, // [ long, lat ]
        
            author : '',
            title : '',
            picture : null,
            recording : null,
        
            color : '#ffffff',
            visible: true,
            createdAt : 0
        }
    }
    render() {
        return(
            <div>
                
            </div>
        )
    }
}

export {StoriesComponent}