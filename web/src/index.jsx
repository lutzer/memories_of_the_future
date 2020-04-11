import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainComponent } from "./components/MainComponent";

// require('dotenv').config({
//     path: __dirname + "/../.env"
// })

console.log(process.env)

ReactDOM.render(
    <MainComponent/>, 
    document.getElementById("container") 
);