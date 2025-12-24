'use client';
import React from 'react';
import { MessageCircle, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/api/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-bg-soft text-text-main font-sans">
      {/* Dashboard Navigation */}
      <nav className="bg-surface border-b border-secondary/30 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary-dark font-bold text-xl">
            <div className="bg-primary/10 p-2 rounded-xl">
              <MessageCircle size={24} className="text-primary" />
            </div>
            <span>Safe House</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/profile" className="p-2 text-text-muted hover:text-primary transition-colors">
              <User size={24} />
            </Link>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors font-medium text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
