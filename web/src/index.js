import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainComponent } from "./components/MainComponent";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

console.log(process.env);

ReactDOM.render(
  <BrowserRouter>
    <MainComponent />
  </BrowserRouter>,
  document.getElementById("container")
);
