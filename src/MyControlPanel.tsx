import { MyLiveButton } from "./MyLiveButton";
import { MyMicButton } from "./MyMicButton";

export const MyControlsPanel = () => {
    return (
      <div className='controls-panel'>
        <MyMicButton /> 
        <MyLiveButton /> 
      </div>
    );
  };
