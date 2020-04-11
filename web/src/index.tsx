import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainComponent } from "./components/MainComponent";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import axios from "axios";


  ReactDOM.render(
    <MainComponent/>,
    document.getElementById("container")
  );
  

  /*axios.get("/api/projects").then((response) => {
  const project = response.data.projects;
  console.log(project);
*/
