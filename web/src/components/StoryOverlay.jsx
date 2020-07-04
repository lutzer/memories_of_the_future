import React from "react";
import { Component } from "react";
import ReactMapGL from "react-map-gl";
import axios from "axios";
import "./styles/story.scss";
import "./styles/map.scss";

class StoryOverlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      story: null,
    };
  }

  getStory() {
    axios
      .get(`http://localhost:3000/api/stories/${this.props.id}`)
      .then((responseFromApi) => {
        console.log("hey I am Story", responseFromApi.data.story);
        this.setState({
          story: responseFromApi.data.story,
        });
      });
  }

  componentDidMount() {
    this.getStory(this.props.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.id != prevProps.id) {
      this.getStory(this.props.id);
    }
  }

  render() {
    return (
      <div>
        {this.state.story && (
          <div
            className="story-overlay"
            key={this.state.story.id}
            latitude={this.state.story.location[0]}
            longitude={this.state.story.location[1]}
          >
            <div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ story: null });
                }}
              >
                XX
              </button>

              <h2>{this.state.story.author}</h2>
              <p>{this.state.story.title}</p>
              <img src={this.state.story.image} alt="story image" />
              <audio controls src={this.state.story.recording}>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export { StoryOverlay };
