'use client';
import React from 'react';
import { Shield, Heart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-soft text-text-main font-sans selection:bg-secondary selection:text-primary-dark">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-surface/80 backdrop-blur-md border-b border-secondary/30 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-dark font-bold text-2xl tracking-tight">
            <div className="bg-primary/10 p-2 rounded-xl">
              <MessageCircle size={24} className="text-primary" />
            </div>
            <span>Safe House</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/auth" className="hidden md:block text-text-muted hover:text-primary font-medium transition-colors">
              Log In
            </Link>
            <Link href="/auth" className="bg-accent hover:bg-red-400 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 transform hover:-translate-y-0.5">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 text-primary-dark text-sm font-semibold">
              <Sparkles size={16} />
              <span>Your safe space is here</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-primary-dark leading-[1.1] tracking-tight">
              Healing happens <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">together.</span>
            </h1>
            
            <p className="text-xl text-text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect anonymously with peers who understand. Supported by AI, guarded by kindness. You never have to carry the weight alone.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Link href="/auth" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group">
                Start Your Journey 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-text-muted hover:bg-white hover:text-primary-dark transition-all border border-transparent hover:border-secondary">
                How it works
              </button>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-text-muted/60">
              <div className="flex items-center gap-2">
                <Shield size={20} />
                <span className="text-sm font-medium">100% Anonymous</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={20} />
                <span className="text-sm font-medium">Kindness First</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            
            <div className="bg-surface p-8 rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-secondary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
              
              <div className="space-y-6">
                {/* Chat Bubble 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary-dark font-bold text-xs">A</div>
                  <div className="bg-bg-soft p-4 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-text-muted">
                    I've been feeling really overwhelmed lately and just needed someone to listen.
                  </div>
                </div>

                {/* Chat Bubble 2 (Right) */}
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">B</div>
                  <div className="bg-primary/10 p-4 rounded-2xl rounded-tr-none max-w-[80%] text-sm text-primary-dark">
                    I hear you. It takes a lot of courage to share that. You're safe here.
                  </div>
                </div>

                 {/* Chat Bubble 3 */}
                 <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">AI</div>
                  <div className="bg-bg-soft p-4 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-text-muted flex items-center gap-2">
                    <Sparkles size={14} className="text-accent" />
                    <span>Gentle reminder: You are doing your best, and that is enough.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Complete Anonymity",
                desc: "Share your thoughts without fear. Your identity is protected, allowing you to be your authentic self."
              },
              {
                icon: <Heart className="w-8 h-8 text-accent" />,
                title: "Peer Support",
                desc: "Connect with others who have walked similar paths. Find strength in shared experiences."
              },
              {
                icon: <Sparkles className="w-8 h-8 text-primary-dark" />,
                title: "AI Guardrails",
                desc: "Our intelligent system ensures every interaction remains respectful, supportive, and safe."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-bg-soft hover:bg-secondary/20 transition-colors group cursor-default">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-dark mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
