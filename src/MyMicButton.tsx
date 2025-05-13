import { useCallStateHooks } from '@stream-io/video-react-sdk';

export const MyMicButton = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();
  return (
    <button
      className='mic-button'
      onClick={async () => {
        if (isMute) {
          await microphone.enable();
        } else {
          await microphone.disable();
        }
      }}
    >
      {isMute ? 'Unmute' : 'Mute'}
    </button>
  );
};
