import { config } from '../config/env';

export default function imageLoader({ src, width, quality }) {
  if (config.imageHost && src.includes(config.imageHost)) {
    return src;
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
