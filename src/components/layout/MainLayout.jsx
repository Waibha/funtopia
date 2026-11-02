import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CosmicBackground from '../ui/CosmicBackground';

/**
 * Main Layout for Public and Player Game Portal
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070714] text-slate-100 relative selection:bg-pink-500 selection:text-white">
      <CosmicBackground />
      <Navbar />
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
