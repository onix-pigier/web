"use client";

import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          MonApp
        </Link>
        
        <nav className="flex space-x-6">
          <Link href="/login" className="hover:text-blue-500">Connexion</Link>
          <Link href="/register" className="hover:text-blue-500">Inscription</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;