import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainComponent } from "./components/MainComponent";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import axios from "axios";


axios.get("/api/projects").then((response) => {
  const project = response.data.projects
  console.log(project);

  ReactDOM.render(
    <BrowserRouter>
      <App project = {project}/>
    </BrowserRouter>,
    document.getElementById("container")
  );
});
