import React, { useState, useRef } from 'react';
import { 
  Clapperboard, 
  Layers, 
  Smartphone, 
  Monitor, 
  Wand2, 
  Upload, 
  Video, 
  User, 
  Type, 
  Activity, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { VIDEO_TEMPLATES } from './components/Templates';
import { VideoPlayer } from './components/VideoPlayer';
import { generateVideo } from './services/geminiService';
import { VideoConfig, VideoAspectRatio, GenerationStatus } from './types';

export const VideoArchitect: React.FC = () => {
  // State
  const [config, setConfig] = useState<VideoConfig>({
    topic: '',
    industry: '',
    aspectRatio: VideoAspectRatio.Horizontal,
    style: VIDEO_TEMPLATES[0].promptModifier,
    hookText: '',
    includePresenter: false,
    useMotionTracking: true,
  });
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(VIDEO_TEMPLATES[0].id);
  const [status, setStatus] = useState<GenerationStatus>({ step: 'idle' });
  
  // Handlers
  const handleGenerate = async () => {
    if (!config.topic || !config.industry) return;

    setStatus({ step: 'generating', message: "Initializing AI Architect..." });

    try {
      const apiKey = process.env.API_KEY || ''; // Injected by window.aistudio logic implicitly or env if dev
      
      const videoUrl = await generateVideo(
        config,
        apiKey,
        (msg) => setStatus(prev => ({ ...prev, message: msg }))
      );

      setStatus({ step: 'complete', videoUrl });
    } catch (error: any) {
      // If error is "Requested entity was not found", it implies key issues.
      if (error.message?.includes("Requested entity was not found")) {
         // Reset app state is tricky without context, but we can alert user to re-select
         alert("API Key session expired or invalid. Please refresh to re-select your key.");
      }
      setStatus({ step: 'error', message: error.message || "Generation failed" });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, referenceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Render Helpers
  const renderStepIndicator = () => (
    <div className="flex items-center space-x-2 text-sm font-medium mb-8">
      <span className={`px-3 py-1 rounded-full ${status.step === 'idle' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>1. Configure</span>
      <div className="w-8 h-[1px] bg-gray-800"></div>
      <span className={`px-3 py-1 rounded-full ${status.step === 'generating' ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-800 text-gray-400'}`}>2. Architect</span>
      <div className="w-8 h-[1px] bg-gray-800"></div>
      <span className={`px-3 py-1 rounded-full ${status.step === 'complete' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'}`}>3. Publish</span>
    </div>
  );

  // Main Render Logic
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-[#050505]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">VideoArchitect<span className="text-blue-500">.ai</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
             <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Gemini Veo Powered</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Step 1: Configuration */}
        {status.step === 'idle' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                Design your next viral video.
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Generate cinema-quality marketing assets in seconds using advanced AI motion synthesis.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Controls */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Section: Concept */}
                <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Layers className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold">Campaign Concept</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Industry / Niche</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Real Estate, SaaS, Coffee Shop" 
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-600"
                        value={config.industry}
                        onChange={(e) => setConfig(prev => ({...prev, industry: e.target.value}))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Topic / Product</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Luxury Downtown Apartment" 
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-600"
                        value={config.topic}
                        onChange={(e) => setConfig(prev => ({...prev, topic: e.target.value}))}
                      />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm text-gray-400 mb-2">Hook / Overlay Text</label>
                       <div className="relative">
                        <Type className="absolute left-3 top-3.5 w-4 h-4 text-gray-600" />
                        <input 
                          type="text" 
                          placeholder="e.g. 'Live the Dream' (appears as 3D text)" 
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-600"
                          value={config.hookText}
                          onChange={(e) => setConfig(prev => ({...prev, hookText: e.target.value}))}
                        />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Section: Templates */}
                <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Clapperboard className="w-5 h-5 text-purple-500" />
                    <h2 className="text-lg font-semibold">Visual Style</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {VIDEO_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplateId(template.id);
                          setConfig(prev => ({...prev, style: template.promptModifier}));
                        }}
                        className={`group relative p-4 rounded-xl border text-left transition-all duration-300 ${
                          selectedTemplateId === template.id 
                            ? 'bg-[#1a1a1a] border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                            : 'bg-[#0a0a0a] border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        <div className={`w-full h-24 mb-4 rounded-lg ${template.previewColor} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                        <h3 className={`font-semibold ${selectedTemplateId === template.id ? 'text-blue-400' : 'text-gray-300'}`}>
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section: Advanced Features */}
                <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
                   <div className="flex items-center gap-3 mb-6">
                    <Wand2 className="w-5 h-5 text-green-500" />
                    <h2 className="text-lg font-semibold">Pro Features</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Feature Toggles */}
                    <div className="space-y-4">
                       <label className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-gray-800 cursor-pointer hover:border-gray-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500/10 p-2 rounded-md"><User className="w-4 h-4 text-blue-500" /></div>
                            <span className="text-sm font-medium">AI Presenter</span>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={config.includePresenter}
                            onChange={(e) => setConfig(prev => ({...prev, includePresenter: e.target.checked}))}
                            className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500/50"
                          />
                       </label>
                       
                       <label className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-gray-800 cursor-pointer hover:border-gray-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-500/10 p-2 rounded-md"><Activity className="w-4 h-4 text-purple-500" /></div>
                            <span className="text-sm font-medium">Motion Tracking</span>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={config.useMotionTracking}
                            onChange={(e) => setConfig(prev => ({...prev, useMotionTracking: e.target.checked}))}
                            className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500/50"
                          />
                       </label>
                    </div>

                    {/* Logo/Image Upload */}
                    <div className="relative group">
                      <label className="flex flex-col items-center justify-center w-full h-full min-h-[120px] bg-[#0a0a0a] border-2 border-dashed border-gray-800 rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors">
                        {config.referenceImage ? (
                          <div className="relative w-full h-full flex items-center justify-center p-2">
                            <img src={config.referenceImage} alt="Reference" className="max-h-[100px] object-contain" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                              <p className="text-xs text-white font-medium">Change Image</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-6 h-6 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-400">Brand Logo / Ref Image</p>
                            <p className="text-xs text-gray-600 mt-1">PNG, JPG (Optional)</p>
                          </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Preview & Action */}
              <div className="lg:col-span-4 space-y-8">
                {/* Format Selection */}
                <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Output Format</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <button
                        onClick={() => setConfig(prev => ({...prev, aspectRatio: VideoAspectRatio.Vertical}))}
                        className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                          config.aspectRatio === VideoAspectRatio.Vertical
                           ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                           : 'bg-[#0a0a0a] border-gray-800 text-gray-500 hover:border-gray-700'
                        }`}
                     >
                        <Smartphone className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">Vertical</span>
                        <span className="text-xs opacity-60">9:16 • Reels/TikTok</span>
                     </button>
                     <button
                        onClick={() => setConfig(prev => ({...prev, aspectRatio: VideoAspectRatio.Horizontal}))}
                        className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                          config.aspectRatio === VideoAspectRatio.Horizontal
                           ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                           : 'bg-[#0a0a0a] border-gray-800 text-gray-500 hover:border-gray-700'
                        }`}
                     >
                        <Monitor className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">Landscape</span>
                        <span className="text-xs opacity-60">16:9 • YouTube/Web</span>
                     </button>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-semibold mb-4">Project Summary</h3>
                  <ul className="space-y-3 text-sm text-gray-300 mb-8">
                    <li className="flex justify-between">
                      <span>Concept:</span>
                      <span className="text-white font-medium">{config.industry || 'Pending...'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Style:</span>
                      <span className="text-white font-medium">{VIDEO_TEMPLATES.find(t => t.id === selectedTemplateId)?.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>AI Features:</span>
                      <span className="text-white font-medium">
                        {[
                          config.includePresenter && 'Presenter',
                          config.useMotionTracking && 'Motion Track',
                          config.hookText && '3D Text'
                        ].filter(Boolean).join(', ') || 'Standard'}
                      </span>
                    </li>
                  </ul>

                  <button
                    onClick={handleGenerate}
                    disabled={!config.industry || !config.topic}
                    className="w-full group bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
                  >
                    <span>Generate Video</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Step 2: Generating */}
        {status.step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
             <div className="relative w-32 h-32 mb-12">
               <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
               <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin animation-delay-200"></div>
               <div className="absolute inset-4 border-b-4 border-white rounded-full animate-spin animation-delay-500"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Video className="w-8 h-8 text-white animate-pulse" />
               </div>
             </div>
             
             <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Architecting Scene</h2>
             <p className="text-gray-400 text-lg mb-8 max-w-md text-center h-8">
               {status.message}
             </p>
             
             <div className="w-full max-w-md bg-gray-900 rounded-full h-1.5 overflow-hidden">
               <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-[shimmer_2s_infinite] w-[200%]"></div>
             </div>
             <p className="text-xs text-gray-600 mt-4">
               Estimated time: 1-2 minutes. Do not close this tab.
             </p>
          </div>
        )}

        {/* Step 3: Complete / Error */}
        {status.step === 'complete' && status.videoUrl && (
          <VideoPlayer 
            videoUrl={status.videoUrl} 
            onReset={() => setStatus({ step: 'idle' })} 
          />
        )}

        {status.step === 'error' && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Generation Failed</h2>
            <p className="text-red-400 mb-8">{status.message}</p>
            <button
              onClick={() => setStatus({ step: 'idle' })}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

      </main>
    </div>
  );
};