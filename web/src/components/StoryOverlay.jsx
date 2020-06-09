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

  componentDidMount() {
    console.log(this.props.id);
    axios
      .get(`http://localhost:3000/api/stories/${this.props.id}`)
      .then((responseFromApi) => {
        console.log("hey I am Story", responseFromApi.data.story);
        this.setState({
          story: responseFromApi.data.story,
        });
      });
  }

  render() {
    return (
      <div className="story-overlay">
        {this.state.story && (
          <div
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

    {
      /*}  {this.state.story ? (
          <div >
            <h2>Hey I am story</h2>}
          </div>
        ) : null}
      */
    }

    /*<div>
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
      </div>
              */
  }
}

export { StoryOverlay };
