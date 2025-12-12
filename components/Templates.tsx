import { Template } from "../types";

export const VIDEO_TEMPLATES: Template[] = [
  {
    id: 'cyberpunk',
    name: 'Neon Cyberpunk',
    description: 'High contrast, neon lights, futuristic cityscapes, fast paced.',
    previewColor: 'bg-purple-600',
    promptModifier: 'Cyberpunk aesthetic, neon blue and pink lighting, futuristic city environment, glowing effects, digital glitches, high tech.'
  },
  {
    id: 'minimalist',
    name: 'Clean Minimalist',
    description: 'Bright, airy, plenty of negative space, soft shadows, Apple-style.',
    previewColor: 'bg-gray-200',
    promptModifier: 'Minimalist design, bright soft lighting, white background, clean lines, high key photography, sophisticated, elegant.'
  },
  {
    id: 'cinematic',
    name: 'Dark Cinematic',
    description: 'Dramatic lighting, moody atmosphere, film grain, emotional.',
    previewColor: 'bg-slate-800',
    promptModifier: 'Cinematic film look, dramatic chiaroscuro lighting, moody atmosphere, anamorphic lens flares, shallow depth of field, 35mm film grain.'
  },
  {
    id: 'corporate',
    name: 'Modern Corporate',
    description: 'Professional, blue tones, skyscrapers, diversity, upbeat.',
    previewColor: 'bg-blue-600',
    promptModifier: 'Modern corporate aesthetic, professional office setting, glass architecture, confident atmosphere, trusted brand look, blue and steel color palette.'
  },
  {
    id: 'lifestyle',
    name: 'Vibrant Lifestyle',
    description: 'Sunny, energetic, happy people, natural light, handheld feel.',
    previewColor: 'bg-orange-400',
    promptModifier: 'Vibrant lifestyle photography, natural sunlight, golden hour, happy emotions, energetic camera movement, authentic feel.'
  },
  {
    id: 'luxury',
    name: 'Luxury & Gold',
    description: 'Black and gold, particles, silk textures, premium feel.',
    previewColor: 'bg-yellow-600',
    promptModifier: 'Luxury brand aesthetic, black and gold color scheme, floating gold particles, silk textures, premium product lighting, expensive feel.'
  }
];