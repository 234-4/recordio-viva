
import React from "react";
import { 
  Play, 
  Pause, 
  Square, 
  Download, 
  Mic, 
  MicOff 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecorderControlsProps {
  recording: boolean;
  paused: boolean;
  videoURL: string | null;
  audioEnabled: boolean;
  preparing: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onDownload: () => void;
  onToggleAudio: () => void;
}

const RecorderControls: React.FC<RecorderControlsProps> = ({
  recording,
  paused,
  videoURL,
  audioEnabled,
  preparing,
  onStart,
  onStop,
  onPause,
  onResume,
  onDownload,
  onToggleAudio,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {!recording && !videoURL && (
        <Button
          onClick={onStart}
          disabled={preparing}
          className={cn(
            "recorder-btn flex items-center gap-2 px-6 py-6 bg-primary hover:bg-primary/90 text-white rounded-full",
            preparing && "opacity-70 cursor-not-allowed"
          )}
        >
          <Play className="w-6 h-6" />
          <span className="text-base font-medium">Start Recording</span>
        </Button>
      )}

      {recording && (
        <>
          <Button
            onClick={onStop}
            className="recorder-btn bg-red-500 hover:bg-red-600 text-white rounded-full p-4"
            aria-label="Stop recording"
          >
            <Square className="w-5 h-5" />
          </Button>

          {paused ? (
            <Button
              onClick={onResume}
              className="recorder-btn bg-green-500 hover:bg-green-600 text-white rounded-full p-4"
              aria-label="Resume recording"
            >
              <Play className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={onPause}
              className="recorder-btn bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4"
              aria-label="Pause recording"
            >
              <Pause className="w-5 h-5" />
            </Button>
          )}
        </>
      )}

      {videoURL && !recording && (
        <Button
          onClick={onStart}
          className="recorder-btn bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-6"
        >
          <Play className="w-6 h-6 mr-2" />
          <span>Record Again</span>
        </Button>
      )}

      {videoURL && (
        <Button
          onClick={onDownload}
          className="recorder-btn bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 py-6"
        >
          <Download className="w-6 h-6 mr-2" />
          <span>Download</span>
        </Button>
      )}

      <Button
        onClick={onToggleAudio}
        variant="outline"
        className={cn(
          "recorder-btn rounded-full p-4 border-2",
          audioEnabled 
            ? "border-green-500 text-green-500 hover:bg-green-500/10" 
            : "border-red-500 text-red-500 hover:bg-red-500/10"
        )}
        aria-label={audioEnabled ? "Disable audio" : "Enable audio"}
      >
        {audioEnabled ? (
          <Mic className="w-5 h-5" />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
};

export default RecorderControls;
