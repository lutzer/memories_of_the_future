import React, { useState } from "react";
import { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "./styles/map.scss";
import { config } from "../config";
import axios from "axios";
import { StoriesDetailOverlay } from "./StoriesDetailOverlay";

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
      visible: false,
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
  handleClick() {
    console.log("hey I am clicked");
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
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ selectedStory: story });
                }}
              ></button>
            </Marker>
          ))}

          {this.state.selectedStory ? (
            <div
              className="popUp"
              key={this.state.selectedStory.id}
              latitude={this.state.selectedStory.location[0]}
              longitude={this.state.selectedStory.location[1]}
            >
              <div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ selectedStory: null });
                  }}
                >
                  XX
                </button>
                <h2>{this.state.selectedStory.author}</h2>
                <p>{this.state.selectedStory.title}</p>
                <img src={this.state.selectedStory.image} alt="story image" />
                <audio controls src={this.state.selectedStory.recording}>
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>

                {this.state.visible ? <StoriesDetailOverlay /> : null}
                <button
                  onClick={() => {
                    this.setState({ visible: true });
                  }}
                >
                  ++
                </button>
              </div>
            </div>
          ) : null}
        </ReactMapGL>
      </div>
    );
  }
}

export { ProjectsComponent };
