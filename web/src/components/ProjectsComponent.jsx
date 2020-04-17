import React from "react";
import { Component
} from 'react';
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
    
    //GET THE PROJECT FROM API
    getProject () {
        axios.get(`http://localhost:3000/api/projects/?name=this.state.name`)
        .then(responseFromApi => {
            this.setState({
                id : responseFromApi.data.id,
                name : responseFromApi.data.name,

            })
        })
    }

    componentDidMount() {
        this.getProject()
    }
    
    render() {
        return (
            <div key= {this.state._id}>
              <h3>{this.state.name}</h3>
            </div>
        )
    }
}

export {ProjectsComponent}