
import React from "react";
import { useEffect } from "react";
import ScreenRecorder from "@/components/ScreenRecorder";

const Index = () => {
  // Add page fade-in effect
  useEffect(() => {
    document.body.classList.add("bg-gradient-to-br", "from-slate-900", "to-black");
    
    return () => {
      document.body.classList.remove("bg-gradient-to-br", "from-slate-900", "to-black");
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto text-center space-y-2 mb-8 animate-fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
            Simple and Elegant
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Screen Recorder
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mt-4">
            Capture your screen with a beautifully designed, minimalist interface.
            Simple, powerful, and intuitive.
          </p>
        </div>
        
        <div className="w-full animate-slide-in">
          <ScreenRecorder />
        </div>
        
        <footer className="mt-16 text-center text-white/40 text-sm animate-fade-in">
          <p>Designed with simplicity and elegance in mind.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
