export default function imageLoader({ src, width, quality }) {
  // Если это внешнее изображение с image host, используем его напрямую
  if (src.includes(process.env.NEXT_PUBLIC_IMAGE_HOST)) {
    return src;
  }
  
  // Для локальных изображений используем стандартную оптимизацию Next.js
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
