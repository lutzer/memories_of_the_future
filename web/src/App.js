/*import React from "react";
import { MainComponent } from "./components/MainComponent";
import { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";
import { MapComponent } from "./components/MapComponent";



class App extends Component {

  state  = {
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

*/