import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SIGNAL_SERVER_URL = "http://localhost:3001";
const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];
const ROOM_ID = "default-room";

type SignalData = {
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

export default function App() {
  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isInitiatorRef = useRef(false);
  const room = ROOM_ID;

  useEffect(() => {
    socketRef.current = io(SIGNAL_SERVER_URL);
    socketRef.current.emit("join", room);

    socketRef.current.on("ready", () => {
      isInitiatorRef.current = true;
      // Do NOT call start() here. Both users should click the button to start.
    });

    socketRef.current.on("signal", async (data: SignalData) => {
      if (!pcRef.current) return;
      if (data.sdp) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(data.sdp)
        );
        if (data.sdp.type === "offer") {
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          socketRef.current?.emit("signal", { room, sdp: answer });
        }
      } else if (data.candidate) {
        try {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } catch {
          // ignore
        }
      }
    });

    return () => {
      socketRef.current?.disconnect();
      if (pcRef.current) pcRef.current.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line
  }, [room]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit("signal", { room, candidate: event.candidate });
        }
      };

      // Only initiator creates the offer
      if (isInitiatorRef.current && !connected) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit("signal", { room, sdp: offer });
        setConnected(true);
      }
      setMicOn(true);
    } catch (err) {
      setError("Microphone access denied or error: " + (err as Error).message);
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h2>Simple WebRTC Audio Room</h2>
      <div>
        <button onClick={start} disabled={micOn}>
          {micOn ? "Mic On" : "Start Mic & Connect"}
        </button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div style={{ marginTop: 24 }}>
        <div>
          <b>Your Audio:</b>
          <audio ref={localAudioRef} autoPlay controls muted />
        </div>
        <div>
          <b>Remote Audio:</b>
          <audio ref={remoteAudioRef} autoPlay controls />
        </div>
      </div>
      <div style={{ marginTop: 24, color: "#888" }}>
        Open this page in two browsers/devices. Click "Start Mic & Connect" in both. You will hear each other.
      </div>
    </div>
  );
}
