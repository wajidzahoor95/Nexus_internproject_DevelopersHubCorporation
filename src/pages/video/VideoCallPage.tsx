import React, { useState, useRef, useEffect } from "react";
import { VideoCallUI } from "../../components/video/VideoCallUI";
import { CallControls } from "../../components/video/CallControls";
import { VideoCallSession } from "../../types";

const VideoCallPage: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callSession, setCallSession] = useState<VideoCallSession | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  const startCall = async () => {
    try {
      // Get user media (video and audio)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection (simplified - in real app, this would connect to signaling server)
      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Create call session
      const session: VideoCallSession = {
        id: Date.now().toString(),
        participants: ["user1", "user2"], // Mock participants
        startTime: new Date().toISOString(),
        isActive: true,
        roomId: "room-" + Date.now(),
      };

      setCallSession(session);
      setIsCallActive(true);
    } catch (error) {
      console.error("Error starting call:", error);
      alert(
        "Failed to start call. Please check your camera and microphone permissions."
      );
    }
  };

  const endCall = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Update state
    setIsCallActive(false);
    setIsScreenSharing(false);
    if (callSession) {
      setCallSession({
        ...callSession,
        isActive: false,
        endTime: new Date().toISOString(),
      });
    }
  };

  const toggleVideo = async () => {
    if (!localStreamRef.current) return;

    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  };

  const toggleScreenShare = async () => {
    if (!isCallActive) return;

    try {
      if (isScreenSharing) {
        // Stop screen sharing
        if (localStreamRef.current) {
          const screenTrack = localStreamRef.current
            .getVideoTracks()
            .find((track) => track.label.includes("screen"));
          if (screenTrack) {
            screenTrack.stop();
            // Switch back to camera
            const cameraStream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });
            const cameraTrack = cameraStream.getVideoTracks()[0];
            const sender = peerConnectionRef.current
              ?.getSenders()
              .find((s) => s.track?.kind === "video");
            if (sender) {
              sender.replaceTrack(cameraTrack);
            }
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = cameraStream;
            }
          }
        }
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        const sender = peerConnectionRef.current
          ?.getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        screenTrack.onended = () => {
          toggleScreenShare(); // Switch back when screen share ends
        };

        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Video Call</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Call UI */}
          <div className="lg:col-span-2">
            <VideoCallUI
              isCallActive={isCallActive}
              localVideoRef={localVideoRef}
              remoteVideoRef={remoteVideoRef}
              callSession={callSession}
            />
          </div>

          {/* Call Controls */}
          <div className="lg:col-span-1">
            <CallControls
              isCallActive={isCallActive}
              isVideoEnabled={isVideoEnabled}
              isAudioEnabled={isAudioEnabled}
              isScreenSharing={isScreenSharing}
              onStartCall={startCall}
              onEndCall={endCall}
              onToggleVideo={toggleVideo}
              onToggleAudio={toggleAudio}
              onToggleScreenShare={toggleScreenShare}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
