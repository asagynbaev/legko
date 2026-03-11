export default function imageLoader({ src, width, quality }) {
  // Если это внешнее изображение с img.booka.life, используем его напрямую
  if (src.includes('img.booka.life')) {
    return src;
  }
  
  // Для локальных изображений используем стандартную оптимизацию Next.js
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
