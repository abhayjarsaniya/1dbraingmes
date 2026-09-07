import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#0A051A] text-white pt-24">
      <h1 className="text-8xl md:text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD600] to-[#FF3D00] mb-4">404</h1>
      <h2 className="text-3xl md:text-5xl font-bold mb-6">Page Not Found</h2>
      <p className="text-lg text-white/50 mb-10 max-w-md">
        The puzzle you are looking for doesn't exist. Let's get you back to the games.
      </p>
      <Link 
        to="/" 
        className="px-8 py-4 bg-[#FFD600] text-black rounded-2xl font-bold hover:bg-white transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
