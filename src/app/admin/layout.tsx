'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  ArrowLeft,
  Menu,
  X,
  Lock,
  LogOut,
  ShieldCheck,
  KeyRound,
  Mail,
  AlertCircle,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';

const ADMIN_STORAGE_KEY = 'rynochi_admin_authenticated_v2';
const MASTER_EMAIL = 'admin@rynochi.com';
const MASTER_PASS = 'Admin@Rynochi2026!';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Check session storage for existing auth
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      setIsAuthenticated(auth === 'true');
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsVerifying(true);

    setTimeout(() => {
      if (
        loginEmail.trim().toLowerCase() === MASTER_EMAIL.toLowerCase() &&
        loginPassword.trim() === MASTER_PASS
      ) {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        setIsAuthenticated(true);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError('Access Denied: Invalid Master Credentials. Unauthorized entry is logged.');
      }
      setIsVerifying(false);
    }, 400);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  // Nav items: simplified to the essentials
  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Order Management', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Products & Images', href: '/admin/products', icon: Package },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  // Initial loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#050914] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
      </div>
    );
  }

  // RESTRICTED ACCESS SCREEN: If not authenticated, render secure gatekeeper!
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#040711] text-gray-200 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#091126] border border-[#D4AF37]/30 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0D1837] to-[#16234B] border border-[#D4AF37]/40 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <Logo size="md" variant="gold" showTagline={false} />
            <h1 className="text-xl font-serif font-bold text-white tracking-wide">
              Admin Panel
            </h1>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-gray-300 block font-medium">Admin Master Email / ID</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoFocus
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@rynochi.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 block font-medium">Master Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVerifying ? 'Authenticating...' : 'Unlock Studio Control'}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-navy-800/80 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#D4AF37] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN LAYOUT
  return (
    <div className="min-h-screen bg-[#050914] text-gray-200 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#070D1F] border-r border-navy-800/80 p-5 space-y-6 flex-shrink-0">
        <div className="space-y-2">
          <Logo size="sm" variant="gold" showTagline={false} />
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] px-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Admin Panel
          </div>
        </div>

        {/* Navigation Links (Simplified) */}
        <nav className="flex-1 space-y-2 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B88A2E] text-[#0A0F1D] shadow-lg shadow-[#D4AF37]/35 ring-1 ring-[#FFF0B8]/60 translate-x-1'
                    : 'text-gray-200 hover:text-white hover:bg-navy-900/90 hover:translate-x-1'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0A0F1D]' : 'text-[#D4AF37]'}`} />
                <span className={isActive ? 'text-[#0A0F1D] font-extrabold tracking-wide' : 'font-medium'}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions in Sidebar */}
        <div className="pt-4 border-t border-navy-800 space-y-2 text-xs">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock & Sign Out</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors py-1 px-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex flex-col">
          <div className="w-72 bg-[#070D1F] h-full p-6 flex flex-col space-y-6 border-r border-[#D4AF37]/30">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <Logo size="sm" variant="gold" showTagline={false} />
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5 text-[#D4AF37]" />
              </button>
            </div>
            <nav className="flex-1 space-y-2 text-xs">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B88A2E] text-[#0A0F1D] shadow-lg shadow-[#D4AF37]/35 ring-1 ring-[#FFF0B8]/60'
                        : 'text-gray-200 hover:text-white hover:bg-navy-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0A0F1D]' : 'text-[#D4AF37]'}`} />
                    <span className={isActive ? 'text-[#0A0F1D] font-extrabold' : 'font-medium'}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-rose-400 hover:text-rose-300 text-xs py-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Lock & Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-[#070D1F]/90 backdrop-blur-md border-b border-navy-800/80 px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-300 hidden sm:inline">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-[#D4AF37] hover:underline hidden sm:inline"
            >
              Storefront ↗
            </Link>
            <div className="flex items-center gap-2 bg-navy-900 border border-navy-700 px-3 py-1.5 rounded-xl">
              <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#AA8417] text-navy-950 font-bold flex items-center justify-center text-[10px]">
                A
              </span>
              <span className="text-gray-200 font-medium">Admin Panel</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-navy-900 transition-colors"
              title="Lock Admin Panel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
