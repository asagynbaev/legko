import React from 'react';

interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
  policyText: React.ReactNode;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ open, onClose, policyText }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Закрыть"
          style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          ×
        </button>
        <h2>Политика конфиденциальности</h2>
        <div className="modal-content" style={{ maxHeight: '60vh', overflowY: 'auto', whiteSpace: 'pre-line', marginBottom: '1em' }}>
          {policyText}
        </div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: #fff;
          padding: 2em;
          border-radius: 8px;
          max-width: 600px;
          width: 90vw;
          box-shadow: 0 2px 16px rgba(0,0,0,0.2);
          position: relative;
        }
        .modal-content {
          margin-bottom: 1em;
          font-size: 0.95em;
        }
        .modal-close {
          position: absolute;
          top: 12px;
          right: 16px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicyModal;
