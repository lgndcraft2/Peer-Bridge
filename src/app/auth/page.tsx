'use client';
import React, { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/api/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard'); // Redirect to dashboard after login
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              alias,
            },
          },
        });
        if (error) throw error;
        router.push('/dashboard'); // Redirect to dashboard after sign up
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-soft text-text-main flex flex-col font-sans">
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-semibold">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center p-6">
        {/* Auth Card */}
        <div className="w-full max-w-md bg-surface p-8 rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-secondary/30">
          <div className="flex border-b-2 border-secondary/30 mb-8">
            <button 
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 pb-4 font-bold transition-all ${isLogin ? 'border-b-4 border-primary text-primary-dark' : 'text-text-muted hover:text-primary'}`}
            >
              Login
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 pb-4 font-bold transition-all ${!isLogin ? 'border-b-4 border-primary text-primary-dark' : 'text-text-muted hover:text-primary'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 rounded-xl border-2 border-secondary/50 focus:border-primary outline-none transition-all bg-bg-soft focus:bg-white"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-primary-dark mb-2">Anonymous Alias</label>
                <input 
                  type="text" 
                  required
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="e.g. KindSoul_24"
                  className="w-full p-3 rounded-xl border-2 border-secondary/50 focus:border-primary outline-none transition-all bg-bg-soft focus:bg-white"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border-2 border-secondary/50 focus:border-primary outline-none transition-all bg-bg-soft focus:bg-white"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-primary-dark mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 rounded-xl border-2 border-secondary/50 focus:border-primary outline-none transition-all bg-bg-soft focus:bg-white"
                />
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 mt-4 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Enter the Bridge' : 'Join the Community')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
