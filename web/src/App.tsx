import React from "react";
import { MainComponent } from "./components/MainComponent";
import { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";
import axios from "axios";
import { MapComponent } from "./components/MapComponent";

type AppProps = {
    project?: {}
}
type AppState = {
    id:string,
    name: string,
    description: string,
    password: string,
    visible: Boolean,
    createdAt: String,
}


class App extends Component<AppProps, AppState> {

  state : AppState = {
      id: "",
      name: "",
      description: "",
      password: "",
      visible: true,
      createdAt: "",
    }
   
  getProjectData = () => {
      const id = this.state.id;
    
  axios
  .get("/projects/${id}")
  .then(response => {
      this.setState(
          {
              name: response.data.projects.name,
              description: response.data.projects.description
          }
      )
  }).catch(err => {
      console.log(err);
  })
  }

  render() {
    return (
    <div className="App">
     <Route
     exact
     path="/"
     render = {props => (
        <MainComponent/>
     )}
     
     />
    </div>
    );
  }
}


export { App };

