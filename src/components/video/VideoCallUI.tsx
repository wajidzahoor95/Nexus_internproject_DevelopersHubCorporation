import React from "react";
import { VideoCallSession } from "../../types";
import { Video, VideoOff, Mic, MicOff } from "lucide-react";

interface VideoCallUIProps {
  isCallActive: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  callSession: VideoCallSession | null;
}

export const VideoCallUI: React.FC<VideoCallUIProps> = ({
  isCallActive,
  localVideoRef,
  remoteVideoRef,
  callSession,
}) => {
  if (!isCallActive) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Video size={32} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Ready to start a video call?
        </h2>
        <p className="text-gray-400">
          Click the start call button to begin your video conference.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-gray-900">
        {/* Remote video (main view) */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />

        {/* Local video (picture-in-picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        </div>

        {/* Call info overlay */}
        {callSession && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded">
            <p className="text-sm font-medium">Call in progress</p>
            <p className="text-xs text-gray-300">
              Started at {new Date(callSession.startTime).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      {/* Participant info */}
      <div className="p-4 bg-gray-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">Y</span>
            </div>
            <span className="text-white text-sm">You</span>
            <Video size={16} className="text-green-400" />
            <Mic size={16} className="text-green-400" />
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-white text-sm">Participant</span>
            <VideoOff size={16} className="text-red-400" />
            <MicOff size={16} className="text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
