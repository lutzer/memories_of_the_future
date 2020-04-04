import React from "react";
import { Hello } from "./Hello";
import { MapComponent } from "./MapComponent";

const MainComponent = () => {
  return (
    <div>
      <Hello compiler="Typescript" framework="React"/>
      <MapComponent/>
    </div>
  )
}

export { MainComponent }
