import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/ToastContainer';

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Layout({ title, subtitle, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Header
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={navigate}
        />
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
