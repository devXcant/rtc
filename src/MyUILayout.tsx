import { MyControlsPanel } from "./MyControlPanel";
import { MyDescriptionPanel } from "./MyDescriptionpanel";
import { MyParticipantsPanel } from "./MyParticipantPanel";
import { MyPermissionRequestsPanel } from "./MyPermissionRequestsPanel";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

export const MyUILayout = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div className="ui-layout">
      <div style={{ padding: "10px", background: "#f0f0f0" }}>
        Debug Info: {participants.length} participants in room
      </div>
      <MyDescriptionPanel />
      <MyParticipantsPanel />
      <MyPermissionRequestsPanel />
      <MyControlsPanel />
    </div>
  );
};
