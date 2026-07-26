import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import type { CertificateDoc } from '../data/certificates';

interface CertificatesGalleryProps {
  images: CertificateDoc[];
  startIndex?: number;
  title?: string;
  onClose: () => void;
}

const isPdf = (src: string) => src.toLowerCase().endsWith('.pdf');

export default function CertificatesGallery({ images, startIndex = 0, title, onClose }: CertificatesGalleryProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(startIndex);

  const count = images.length;
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  if (count === 0) return null;
  const current = images[index];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div className="cert-gallery" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Документы специалиста">
      <div className="cert-gallery__panel">
        <div className="cert-gallery__topbar">
          <span className="cert-gallery__title">
            {title || 'Документы'} · {index + 1} / {count}
          </span>
          <button type="button" className="cert-gallery__close" onClick={onClose} aria-label="Закрыть">
            <X size={20} />
          </button>
        </div>

        <div className="cert-gallery__stage">
          {count > 1 && (
            <button type="button" className="cert-gallery__nav cert-gallery__nav--prev" onClick={() => go(-1)} aria-label="Предыдущий">
              <ChevronLeft size={26} />
            </button>
          )}

          <div className="cert-gallery__viewer">
            {isPdf(current.src) ? (
              <div className="cert-gallery__pdf-wrap">
                <iframe className="cert-gallery__pdf" src={current.src} title={current.title || `Документ ${index + 1}`} />
                <a className="cert-gallery__pdf-open" href={current.src} target="_blank" rel="noopener noreferrer">
                  Открыть PDF в новой вкладке ↗
                </a>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cert-gallery__img" src={current.src} alt={current.title || `Документ ${index + 1}`} decoding="async" />
            )}
          </div>

          {count > 1 && (
            <button type="button" className="cert-gallery__nav cert-gallery__nav--next" onClick={() => go(1)} aria-label="Следующий">
              <ChevronRight size={26} />
            </button>
          )}
        </div>

        {current.title && <div className="cert-gallery__caption">{current.title}</div>}

        {count > 1 && (
          <div className="cert-gallery__thumbs">
            {images.map((doc, i) => (
              <button
                key={doc.src}
                type="button"
                className={`cert-gallery__thumb ${i === index ? 'is-active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Документ ${i + 1}`}
              >
                {isPdf(doc.src) ? (
                  <span className="cert-gallery__thumb-pdf"><FileText size={20} /></span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={doc.thumb || doc.src} alt="" loading="lazy" decoding="async" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
