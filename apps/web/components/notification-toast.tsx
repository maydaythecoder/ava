'use client';

import { useEffect, useState } from 'react';

interface NotificationToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function NotificationToast({ message, show, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Fade in
      setIsVisible(true);
      
      // Auto hide after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Wait for fade out animation before calling onClose
        setTimeout(onClose, 300);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-green-500/90 backdrop-blur-md text-white px-6 py-4 rounded-lg shadow-lg border border-green-400/30">
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

