import React, { useState, useEffect } from 'react';
import { VideoArchitect } from './VideoArchitect';
import { Sparkles, Lock, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  // Check for existing API key on mount
  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio && win.aistudio.hasSelectedApiKey) {
        const selected = await win.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
      setChecking(false);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio && win.aistudio.openSelectKey) {
      await win.aistudio.openSelectKey();
      // Assume success after dialog interaction to avoid race conditions
      setHasKey(true);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
         {/* Background Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="z-10 max-w-md w-full bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">AI Video Architect</h1>
          <p className="text-gray-400 mb-8">
            Access the studio to generate professional marketing videos. 
            This tool requires a paid API key for the Gemini Veo model.
          </p>

          <button
            onClick={handleSelectKey}
            className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 py-3 px-6 rounded-lg font-bold transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Connect Google AI Studio
          </button>

          <div className="mt-6 text-xs text-gray-500">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-1 hover:text-blue-400 transition-colors"
            >
              <span>View Billing Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <VideoArchitect />;
};

export default App;