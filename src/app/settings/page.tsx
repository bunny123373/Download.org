'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Toast, { ToastType } from '@/components/Toast';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoDetect, setAutoDetect] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleExport = () => {
    setToast({ message: 'Export feature coming soon!', type: 'info' });
  };

  const handleImport = () => {
    setToast({ message: 'Import feature coming soon!', type: 'info' });
  };

  return (
    <div className="min-h-screen">
      <Navbar showSearch={false} showFilter={false} />
      
      <div className="p-4 md:p-6 lg:p-8 max-w-lg md:max-w-xl lg:max-w-2xl">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 md:mb-2">⚙️ Settings</h1>
          <p className="text-sm md:text-base text-[var(--text-muted)]">Customize your experience</p>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="glass-card p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-[var(--text-primary)] mb-3 md:mb-4">Appearance</h2>
            
            <div className="flex items-center justify-between py-3 border-b border-[var(--glass-border)]">
              <div className="min-w-0 flex-1">
                <p className="text-sm md:text-base text-[var(--text-primary)]">Dark Mode</p>
                <p className="text-xs md:text-sm text-[var(--text-muted)]">Use dark theme</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-10 h-5 md:w-12 md:h-6 rounded-full transition-all flex-shrink-0 ${
                  darkMode ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'
                }`}
              >
                <div 
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-5 md:translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="glass-card p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-[var(--text-primary)] mb-3 md:mb-4">Preferences</h2>
            
            <div className="flex items-center justify-between py-3 border-b border-[var(--glass-border)]">
              <div className="min-w-0 flex-1">
                <p className="text-sm md:text-base text-[var(--text-primary)]">Notifications</p>
                <p className="text-xs md:text-sm text-[var(--text-muted)]">Get notified</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-10 h-5 md:w-12 md:h-6 rounded-full transition-all flex-shrink-0 ${
                  notifications ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'
                }`}
              >
                <div 
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-5 md:translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm md:text-base text-[var(--text-primary)]">Auto-detect</p>
                <p className="text-xs md:text-sm text-[var(--text-muted)]">Detect type from URL</p>
              </div>
              <button
                onClick={() => setAutoDetect(!autoDetect)}
                className={`w-10 h-5 md:w-12 md:h-6 rounded-full transition-all flex-shrink-0 ${
                  autoDetect ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'
                }`}
              >
                <div 
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full bg-white transition-transform ${
                    autoDetect ? 'translate-x-5 md:translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="glass-card p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-[var(--text-primary)] mb-3 md:mb-4">Data</h2>
            
            <div className="space-y-2 md:space-y-3">
              <button
                onClick={handleExport}
                className="btn-secondary w-full justify-start gap-2 md:gap-3 text-sm"
              >
                📤 Export Data
              </button>
              <button
                onClick={handleImport}
                className="btn-secondary w-full justify-start gap-2 md:gap-3 text-sm"
              >
                📥 Import Data
              </button>
            </div>
          </div>

          <div className="glass-card p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-[var(--text-primary)] mb-3 md:mb-4">About</h2>
            <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-[var(--text-muted)]">
              <p>Version: 1.0.0</p>
              <p>Next.js 16 + MongoDB</p>
              <p>LinkHub - Smart Link Organizer</p>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
