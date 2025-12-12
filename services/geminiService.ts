import { GoogleGenAI } from "@google/genai";
import { VideoConfig, VideoAspectRatio, VideoResolution } from "../types";

// Helper to construct the sophisticated prompt for the "Architect"
const constructArchitectPrompt = (config: VideoConfig): string => {
  const { topic, industry, style, hookText, includePresenter, useMotionTracking } = config;

  let prompt = `Create a high-end, professional marketing video for the ${industry} industry about ${topic}. `;
  
  prompt += `Visual Style: ${style}. `;
  
  if (includePresenter) {
    prompt += `Include a friendly, professional human presenter speaking directly to the camera (lip sync not required, just visual presence). `;
  }

  if (useMotionTracking) {
    prompt += `Use dynamic camera movements, swooping shots, and tracking shots to maintain high energy. `;
  }

  if (hookText) {
    prompt += `Feature prominent, 3D cinematic text overlay that says: "${hookText}". `;
  }

  prompt += `The lighting should be studio-quality. The final look should be polished, commercial-grade, and ready to publish.`;

  return prompt;
};

export const generateVideo = async (
  config: VideoConfig,
  apiKey: string,
  onProgress: (msg: string) => void
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  
  // Use the fast preview model for better responsiveness in this demo, 
  // though 'veo-3.1-generate-preview' offers higher quality.
  // The guidelines suggest fast-generate-preview for general video tasks.
  const modelName = 'veo-3.1-fast-generate-preview';
  
  const prompt = constructArchitectPrompt(config);
  onProgress("Architecting scene composition and lighting parameters...");

  try {
    const generationConfig: any = {
      numberOfVideos: 1,
      resolution: VideoResolution.HD, // 720p is standard for fast preview
      aspectRatio: config.aspectRatio,
    };

    // Prepare request
    let operation;
    
    if (config.referenceImage) {
      // If user uploaded a reference image (e.g., logo or style ref)
      // Note: Veo supports image input. We strip the data prefix for the API.
      const base64Data = config.referenceImage.split(',')[1];
      
      operation = await ai.models.generateVideos({
        model: modelName,
        prompt: prompt,
        image: {
          imageBytes: base64Data,
          mimeType: 'image/png', // Assuming PNG for simplicity from file input
        },
        config: generationConfig
      });
    } else {
      // Text only
      operation = await ai.models.generateVideos({
        model: modelName,
        prompt: prompt,
        config: generationConfig
      });
    }

    onProgress("Rendering initial frames...");
    
    // Polling loop
    while (!operation.done) {
      // Wait 5 seconds between polls
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Update status messages to keep user engaged
      const statusMessages = [
        "Synthesizing 3D assets...",
        "Applying motion tracking algorithms...",
        "Refining lighting and shadows...",
        "Color grading in progress...",
        "Finalizing render..."
      ];
      const randomMsg = statusMessages[Math.floor(Math.random() * statusMessages.length)];
      onProgress(randomMsg);

      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
      throw new Error(operation.error.message || "Video generation failed.");
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!videoUri) {
      throw new Error("No video URI returned from the API.");
    }

    // Append API key to allow the frontend to fetch the binary
    return `${videoUri}&key=${apiKey}`;

  } catch (error: any) {
    console.error("Video generation error:", error);
    throw error;
  }
};