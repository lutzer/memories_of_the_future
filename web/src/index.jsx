import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainComponent } from "./components/MainComponent"
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render((
<Router>
    <MainComponent />, 
</Router>),
    document.getElementById("container") 
);
