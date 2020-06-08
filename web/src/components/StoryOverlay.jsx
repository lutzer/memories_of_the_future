import React from "react";
import { Component } from "react";
import ReactMapGL from "react-map-gl";
import axios from "axios";

import './styles/story.scss'


class StoryOverlay extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // axios call um story daten zu holen: api/stories/:storyId
  }


  render() {
    return (
      <div className='story-overlay'>
        I am a story
      </div>
    );
  }
}

export { StoryOverlay };
