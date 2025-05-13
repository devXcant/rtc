import {
  ParticipantsAudio,
  SfuModels,
  type StreamVideoParticipant,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { MyParticipant } from "./MyParticipant";

export const MyParticipantsPanel = () => {
  const hasAudio = (p: StreamVideoParticipant) =>
    p.publishedTracks.includes(SfuModels.TrackType.AUDIO);

  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const speakers = participants.filter((p) => hasAudio(p));
  const listeners = participants.filter((p) => !hasAudio(p));

  return (
    <>
      <h4>Speakers</h4>
      <ParticipantsAudio participants={speakers} />
      <div className="participants-panel">
        {speakers.map((p) => (
          <MyParticipant participant={p} key={p.sessionId} />
        ))}
      </div>
      <h4>Listeners</h4>
      <div className="participants-panel">
        {listeners.map((p) => (
          <MyParticipant participant={p} key={p.sessionId} />
        ))}
      </div>
    </>
  );
};
