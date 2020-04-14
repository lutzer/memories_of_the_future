import React from "react";
import { MapComponent } from "./MapComponent";
import { OverlayComponent } from "./OverlayComponent";
const MainComponent = () => {
  return (
    <div>
      <OverlayComponent />,
      <MapComponent />
    </div>
  );
};

export { MainComponent };
