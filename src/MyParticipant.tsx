import { Avatar, type StreamVideoParticipant } from '@stream-io/video-react-sdk';

export const MyParticipant = ({ participant }: { participant: StreamVideoParticipant }) => {
  const { isSpeaking } = participant;
  return (
    <div className={`participant ${isSpeaking ? 'speaking' : ''}`}>
      <Avatar imageSrc={participant.image} />
      <div className='name'>{participant.name}</div>
    </div>
  );
};
