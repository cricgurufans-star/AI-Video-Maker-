import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  onReset: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onReset }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the protected video URL to create a local blob URL for playback
  useEffect(() => {
    let isMounted = true;
    const fetchVideo = async () => {
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        if (isMounted) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to load video blob", e);
        setLoading(false);
      }
    };
    fetchVideo();
    return () => {
      isMounted = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
      <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#151515]">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold text-white">Generation Complete</h2>
          </div>
          <button 
            onClick={onReset}
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Create New
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center">
          {loading ? (
            <div className="text-blue-400 animate-pulse">Loading video stream...</div>
          ) : blobUrl ? (
            <video 
              src={blobUrl} 
              controls 
              autoPlay 
              loop 
              className="w-full h-full object-contain" 
            />
          ) : (
            <div className="text-red-500">Failed to load video</div>
          )}
        </div>

        <div className="p-6 bg-[#111] flex justify-between items-center">
          <div>
            <h3 className="text-white font-semibold">Your Masterpiece</h3>
            <p className="text-gray-500 text-sm mt-1">Ready for social media distribution</p>
          </div>
          {blobUrl && (
            <a 
              href={blobUrl} 
              download="generated-video.mp4"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
            >
              <Download className="w-5 h-5" />
              Download MP4
            </a>
          )}
        </div>
      </div>
    </div>
  );
};