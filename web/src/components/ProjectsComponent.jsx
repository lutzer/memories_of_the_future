import React, { useState } from "react";
import { Component } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "./styles/map.scss";
import { useParams } from "react-router-dom";
import { config } from "../config";
import axios from "axios";

//++++++++Project Details
const projectDefaults = {
  id: "",
  name: "",
  description: "",
  visible: true,
  createdAt: 0,
};

//+++++++++Map Details
const mapViewport = {
  width: "100vw",
  height: "100vh",
  latitude: 52.51763153076172,
  longitude: 13.40965747833252,
  zoom: 10,
};

class ProjectsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: projectDefaults,
      stories: [],
      viewport: mapViewport,
      selectedStory: null,
    };
  }

  //GET THE PROJECT FROM API
  getProject() {
    const { projectName } = this.props.match.params;
    axios
      .get(`http://localhost:3000/api/projects/?name=${projectName}`)
      .then((responseFromApi) => {
        this.setState({
          project: Object.assign(
            {},
            projectDefaults,
            responseFromApi.data.project
          ),
        });
        return axios.get(
          `http://localhost:3000/api/stories/?project=${this.state.project.id}`
        );
      })
      .then((response) => {
        this.setState({
          stories: response.data.stories,
        });
      });
  }



 componentDidMount() {
    this.getProject();
  }

 

  render() {
    return (
      <div>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapboxApiAccessToken={config.mapboxToken}
          mapStyle="mapbox://styles/ninoglonti/ck99qscv60l0g1imgpdteyqfw"
        >

          {this.state.stories.map((story) => (
            <Marker
              key={story.id}
              latitude={story.location[0]}
              longitude={story.location[1]}
            >
              <button
                className="marker-btn"
                onClick= {e => 
                  {
                    e.preventDefault(); 
                    this.setState({ selectedStory : story })}
                  }
              >
               Click
              </button>
            </Marker>
          ))}

         
         {this.state.selectedStory ? (
           <Popup 
           key={this.state.selectedStory.id}
           latitude={this.state.selectedStory.location[0]}
           longitude={this.state.selectedStory.location[1]}
           onClose={()  => 
            {this.setState({selectedStory: null})
          }}
           >
             <div>
         <h2>{this.state.selectedStory.author}</h2>
         <p>{this.state.selectedStory.title}</p>
             </div>
           </Popup>
         ) : null}


        </ReactMapGL>
      </div>
    );
  }
}

export { ProjectsComponent };


/*   
  {this.state.stories.map((story) => (
            <Popup
              key={story.id}
              latitude={story.location[0]}
              longitude={story.location[1]}
              onClose={() => {
                this.state.stories(null);
              }}
            >
              <div>
                <h2>{story.author}</h2>
                <p>{story.title}</p>
              </div>
            </Popup>
          ))}             
 */

/*handleClick = (event) => {
  event.preventDefault();
  this.setState({
    selectedStory: this.state.stories.map((story) => {
      console.log("heeeeeey", selectedStory);
         story
    }) 
  })
}
*/

  /*
   {this.state.selecedStory ? (
            <Popup
              key={story.id}
              latitude={story.location[0]}
              longitude={story.location[1]}
            >
              <div></div>
            </Popup>
          ) : null}

  */ 

  /**/