'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('auth', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center text-3xl mx-auto mb-4">
            🔗
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">LinkHub</h1>
          <p className="text-[var(--text-muted)]">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-[var(--error)]/20 border border-[var(--error)]/30 text-[var(--error)] text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input w-full py-3 px-4"
              placeholder="Username"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full py-3 px-4"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3">
            Sign In
          </button>
        </form>
        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          admin / admin123
        </p>
      </div>
    </div>
  );
}