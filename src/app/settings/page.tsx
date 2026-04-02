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
      
      <div className="p-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">⚙️ Settings</h1>
          <p className="text-[var(--text-muted)]">Customize your experience</p>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Appearance</h2>
            
            <div className="flex items-center justify-between py-3 border-b border-[var(--glass-border)]">
              <div>
                <p className="text-[var(--text-primary)]">Dark Mode</p>
                <p className="text-sm text-[var(--text-muted)]">Use dark theme throughout the app</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-all ${
                  darkMode ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'
                }`}
              >
                <div 
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Preferences</h2>
            
            <div className="flex items-center justify-between py-3 border-b border-[var(--glass-border)]">
              <div>
                <p className="text-[var(--text-primary)]">Notifications</p>
                <p className="text-sm text-[var(--text-muted)]">Get notified about important updates</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-all ${
                  notifications ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'
                }`}
              >
                <div 
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-[var(--text-primary)]">Auto-detect Link Type</p>
                <p className="text-sm text-[var(--text-muted)]">Automatically detect link type from URL</p>
              </div>
              <button
                onClick={() => setAutoDetect(!autoDetect)}
                className={`w-12 h-6 rounded-full transition-all ${
                  autoDetect ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'
                }`}
              >
                <div 
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    autoDetect ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Data</h2>
            
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="btn-secondary w-full justify-start gap-3"
              >
                📤 Export Data
              </button>
              <button
                onClick={handleImport}
                className="btn-secondary w-full justify-start gap-3"
              >
                📥 Import Data
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">About</h2>
            <div className="space-y-2 text-[var(--text-muted)]">
              <p>Version: 1.0.0</p>
              <p>Built with Next.js 16 + MongoDB</p>
              <p className="text-sm">LinkHub - Smart Link Organizer</p>
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
