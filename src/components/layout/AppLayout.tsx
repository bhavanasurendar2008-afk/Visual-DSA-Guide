import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a14] flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
      <div className="flex flex-1 pt-16">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main
          className="flex-1 min-w-0 min-h-full transition-all duration-300 lg:ml-64"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
