export default function imageLoader({ src, width, quality }) {
  // Если это внешнее изображение с img.booka.kg, используем его напрямую
  if (src.includes('img.booka.kg')) {
    return src;
  }
  
  // Для локальных изображений используем стандартную оптимизацию Next.js
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
