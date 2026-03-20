import React from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      <Header />
      <main className="container py-6 md:py-8">
        {children}
      </main>
    </div>
  );
};
