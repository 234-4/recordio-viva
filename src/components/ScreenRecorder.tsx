import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { 
  Video, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Settings, 
  MonitorStop 
} from "lucide-react";
import { cn } from "@/lib/utils";
import RecorderControls from "./RecorderControls";
import Timer from "./Timer";

const ScreenRecorder = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [preparing, setPreparing] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerInterval = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hrs > 0) parts.push(hrs.toString().padStart(2, '0'));
    parts.push(mins.toString().padStart(2, '0'));
    parts.push(secs.toString().padStart(2, '0'));
    
    return parts.join(':');
  };

  const startTimer = () => {
    if (timerInterval.current) return;
    
    timerInterval.current = window.setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const resetRecording = () => {
    setRecordedChunks([]);
    setElapsed(0);
    setVideoURL(null);
    setRecording(false);
    setPaused(false);
    stopTimer();
  };

  const startRecording = async () => {
    resetRecording();
    setPreparing(true);
    
    try {
      // Fix: Remove the cursor and displaySurface properties that aren't part of the standard type
      const displayMediaOptions = {
        video: true,
        audio: audioEnabled,
      };
      
      // Request screen sharing
      const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      
      // If audio is enabled, get audio stream and combine with screen stream
      let combinedStream = screenStream;
      
      if (audioEnabled) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTrack = audioStream.getAudioTracks()[0];
          
          if (audioTrack) {
            combinedStream = new MediaStream([
              ...screenStream.getVideoTracks(),
              audioTrack
            ]);
          }
        } catch (audioError) {
          console.error("Could not get audio:", audioError);
          toast.warning("Could not access microphone. Recording without audio.");
          setAudioEnabled(false);
        }
      }
      
      setStream(combinedStream);
      
      const options = { mimeType: "video/webm;codecs=vp9,opus" };
      const mediaRecorder = new MediaRecorder(combinedStream, options);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        stopTimer();
        
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        
        if (recordedChunks.length > 0) {
          const url = URL.createObjectURL(blob);
          setVideoURL(url);
        }
        
        // Clean up streams
        combinedStream.getTracks().forEach((track) => track.stop());
        setStream(null);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setRecording(true);
      startTimer();
      
      // Set up track ended event listeners
      combinedStream.getTracks().forEach((track) => {
        track.onended = () => {
          stopRecording();
        };
      });
      
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording. Please try again.");
      resetRecording();
    } finally {
      setPreparing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setPaused(false);
      toast.success("Recording stopped");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recording && !paused) {
      mediaRecorderRef.current.pause();
      setPaused(true);
      stopTimer();
      toast.info("Recording paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recording && paused) {
      mediaRecorderRef.current.resume();
      setPaused(false);
      startTimer();
      toast.info("Recording resumed");
    }
  };

  const downloadRecording = () => {
    if (videoURL) {
      const a = document.createElement("a");
      a.href = videoURL;
      a.download = `screen-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Recording downloaded");
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
      stopTimer();
    };
  }, [stream, videoURL]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center">
      <div className={cn(
        "w-full relative rounded-2xl overflow-hidden transition-all duration-500 bg-gradient-to-b from-white/5 to-black/5 backdrop-blur-sm border border-white/10",
        "shadow-[0_10px_40px_rgba(0,0,0,0.15)]",
        videoURL ? "h-auto aspect-video" : "h-[50vh]",
        recording ? "ring-2 ring-red-500 animate-pulse-recording" : ""
      )}>
        {videoURL ? (
          <video 
            ref={videoRef}
            src={videoURL} 
            controls 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {recording ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse-recording"></div>
                </div>
                <Timer seconds={elapsed} />
                <p className="text-sm text-white/70">Recording in progress...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
                <MonitorStop 
                  className="w-20 h-20 text-white/20" 
                  strokeWidth={1.5} 
                />
                <h2 className="text-lg font-medium text-white/70">
                  {preparing 
                    ? "Preparing recording..." 
                    : videoURL 
                      ? "Recording complete" 
                      : "Start recording to capture your screen"
                  }
                </h2>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 w-full animate-slide-up">
        <RecorderControls
          recording={recording}
          paused={paused}
          videoURL={videoURL}
          audioEnabled={audioEnabled}
          preparing={preparing}
          onStart={startRecording}
          onStop={stopRecording}
          onPause={pauseRecording}
          onResume={resumeRecording}
          onDownload={downloadRecording}
          onToggleAudio={toggleAudio}
        />
      </div>

      {recording && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full animate-fade-in backdrop-blur-md shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-medium">{formatTime(elapsed)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
