import type { PermissionRequestEvent } from '@stream-io/video-react-sdk';
import { SfuModels, StreamVideoParticipant, useCallStateHooks } from '@stream-io/video-react-sdk';

const unsubscribe = call.on('call.permission_requested', async (request: PermissionRequestEvent) => {
  // get the permission request data
  const { user, permissions } = request;

  // reject it
  await call.revokePermissions(user.id, permissions);

  // grant it
  await call.grantPermissions(user.id, permissions);
});

// remember to unsubscribe when you're done
unsubscribe();



// grab a reference to the useParticipants hook
const { useParticipants } = useCallStateHooks();

// a list of participants, by default this is list is ordered by the ID of the user
const participants = useParticipants();

const hasAudio = (p: StreamVideoParticipant) =>
  p.publishedTracks.includes(SfuModels.TrackType.AUDIO);

// Speakers: participants that have an audio track
// (i.e., are allowed to speak and have a mic configured)
const speakers = participants.filter((p) => hasAudio(p));

// Listeners: participants that do not have an audio track
const listeners = participants.filter((p) => !hasAudio(p));
