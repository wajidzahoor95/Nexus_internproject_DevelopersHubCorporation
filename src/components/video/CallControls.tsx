import React from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
} from "lucide-react";

interface CallControlsProps {
  isCallActive: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onToggleScreenShare: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isCallActive,
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
  onStartCall,
  onEndCall,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Call Controls
      </h2>

      {!isCallActive ? (
        <div className="text-center">
          <button
            onClick={onStartCall}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors mb-4"
          >
            <Phone size={24} />
          </button>
          <p className="text-sm text-gray-600">Start Video Call</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Call Controls */}
          <div className="flex justify-center space-x-4">
            {/* Video Toggle */}
            <button
              onClick={onToggleVideo}
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                isVideoEnabled
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                isAudioEnabled
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {/* End Call */}
            <button
              onClick={onEndCall}
              className="inline-flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <PhoneOff size={20} />
            </button>
          </div>

          {/* Screen Share */}
          <div className="text-center">
            <button
              onClick={onToggleScreenShare}
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors mb-2 ${
                isScreenSharing
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Monitor size={20} />
            </button>
            <p className="text-xs text-gray-600">
              {isScreenSharing ? "Stop Sharing" : "Share Screen"}
            </p>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div
                className={`inline-block w-3 h-3 rounded-full mb-1 ${
                  isVideoEnabled ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <p className="text-gray-600">Video</p>
            </div>
            <div className="text-center">
              <div
                className={`inline-block w-3 h-3 rounded-full mb-1 ${
                  isAudioEnabled ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <p className="text-gray-600">Audio</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 text-center">
        {!isCallActive ? (
          <p>Click the call button to start your video conference</p>
        ) : (
          <p>Use the controls above to manage your call</p>
        )}
      </div>
    </div>
  );
};
