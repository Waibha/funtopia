import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Card from './Card';
import Button from './Button';

/**
 * Retro Arcade Modal
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  }[size] || 'max-w-xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-cosmic-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${sizeClasses} z-10 animate-in fade-in zoom-in-95 duration-200`}>
        <Card variant="hologram" brackets={true} scanlines={true} className="border-cyan-400/60 p-0 overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.3)]">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-cosmic-900/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="font-retro text-sm text-cyan-300 tracking-wider">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
}
