import React from "react";
import { Component } from "react";
import ReactMapGL from "react-map-gl";
import axios from "axios";

const StoriesDefaults = {
  projectId: null,
  location: null, // [ long, lat ]

  author: "",
  title: "",
  image: null,
  recording: null,

  color: "#ffffff",
  visible: true,
  createdAt: 0,
};

class StoriesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    stories: StoriesDefaults
  }
}


  render() {
    return (
      <div>
       
      </div>
    );
  }
}

export { StoriesComponent };
