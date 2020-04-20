import React from "react";
import { Component } from "react";
import ReactMapGL from "react-map-gl";
import axios from "axios";
import { useParams } from "react-router-dom";

const projectDefaults = {
  id: "",
  name: "",
  description: "",
  visible: true,
  createdAt: 0,
};

class ProjectsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: projectDefaults,
      stories: [],
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
        console.log(response.data);
      });
  }

  componentDidMount() {
    this.getProject();
  }
  render() {
    return (
      <div>
        <div key={this.state._id}>
          <h3>{this.state.project.name}</h3>
          <h2>{this.state.project.id}</h2>
        </div>
        <div>
      {this.state.stories.map((story) => <h1>{story.author}</h1>)}
        </div>
      </div>
    );
  }
}

export { ProjectsComponent };
