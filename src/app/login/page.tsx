'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Logo from '@/components/brand/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // Normal customer authentication
      router.push('/account');
    }, 600);
  };

  const handleQuickDemo = () => {
    setEmail('customer@rynochi.com');
    setPassword('Customer123!');
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-[#070C1E] py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#091126] border border-[#D4AF37]/30 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <Logo size="md" variant="gold" showTagline={false} />
          <h1 className="text-xl font-serif font-bold text-white tracking-wide">
            Welcome to the RYNOCHI Circle
          </h1>
          <p className="text-xs text-gray-400 font-sans">
            Access your orders, saved addresses, and laser customization designs.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-gray-300 block font-medium">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-gray-300 font-medium">Password</label>
              <a href="#" className="text-[11px] text-[#D4AF37] hover:underline">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Customer Login for testing */}
        <div className="pt-2 border-t border-navy-800 space-y-2">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 px-3 rounded-xl bg-navy-900 hover:bg-[#D4AF37] text-gray-300 hover:text-navy-950 border border-navy-700 text-xs font-semibold transition-all text-center"
          >
            Demo Customer Sign-In (Saurabh)
          </button>
        </div>

        <div className="text-center text-xs text-gray-400">
          New patron?{' '}
          <Link href="/register" className="text-[#D4AF37] font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

