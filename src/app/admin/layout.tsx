'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Boxes,
  Settings,
  ArrowLeft,
  Menu,
  X,
  Bell,
  Sparkles,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders & Customization', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Product Catalogue', href: '/admin/products', icon: Package },
    { label: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
    { label: 'Customer Directory', href: '/admin/customers', icon: Users },
    { label: 'Website Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050914] text-gray-200 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#070D1F] border-r border-navy-800/80 p-5 space-y-8 flex-shrink-0">
        <div className="space-y-2">
          <Logo size="sm" variant="gold" showTagline={false} />
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] px-1">
            Studio Admin Portal
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? 'btn-luxury-gold text-navy-950 font-bold shadow-md shadow-[#D4AF37]/20'
                    : 'text-gray-400 hover:text-white hover:bg-navy-900/80 hover:translate-x-1'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions in Sidebar */}
        <div className="pt-4 border-t border-navy-800 space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] hover:translate-x-1 transition-all py-1 px-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
          <div className="text-[10px] text-gray-600 px-1">
            RYNOCHI Admin v2.4 • Prod Mode
          </div>
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'btn-luxury-gold text-navy-950 font-bold'
                        : 'text-gray-300 hover:text-white hover:bg-navy-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-[#D4AF37] flex items-center gap-2 pt-4 border-t border-navy-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>
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
            <span className="text-xs font-semibold text-gray-300">Live Production Engine</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-[#D4AF37] hover:underline hidden sm:inline"
            >
              View Live Store ↗
            </Link>
            <div className="flex items-center gap-2 bg-navy-900 border border-navy-700 px-3 py-1.5 rounded-xl">
              <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#AA8417] text-navy-950 font-bold flex items-center justify-center text-[10px]">
                A
              </span>
              <span className="text-gray-200 font-medium">Ayush (Admin)</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

