export enum VideoAspectRatio {
  Horizontal = '16:9',
  Vertical = '9:16',
}

export enum VideoResolution {
  HD = '720p',
  FHD = '1080p',
}

export interface VideoConfig {
  topic: string;
  industry: string;
  aspectRatio: VideoAspectRatio;
  style: string;
  hookText: string;
  includePresenter: boolean;
  useMotionTracking: boolean;
  referenceImage?: string; // base64
}

export interface GenerationStatus {
  step: 'idle' | 'generating' | 'complete' | 'error';
  message?: string;
  videoUrl?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  promptModifier: string;
}
