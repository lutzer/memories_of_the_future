import React from "react";
import { RecorderComponent } from "./RecorderComponent";
import { StoryComponent } from "./StoryComponent";

const MainComponent = () => {
  return (
    <div>
      <h1>Memories of the Future</h1>
      <RecorderComponent/>
      <StoryComponent/>
    </div> 
  )
}

export { MainComponent }
