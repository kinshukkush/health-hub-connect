import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  FileText,
  Home,
  LogOut,
  Search,
  Settings,
  Users,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const patientLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/doctors', label: 'Find Doctors', icon: Search },
    { href: '/appointments', label: 'Appointments', icon: Calendar },
    { href: '/records', label: 'Records', icon: FileText },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/patients', label: 'Patients', icon: Users },
  ];

  const links = user?.role === 'admin' ? adminLinks : patientLinks;

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0F1A]/95 backdrop-blur-md border-b border-[#1E293B]">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/'} 
          className="flex items-center gap-1"
          aria-label="HealthHub Connect Home"
        >
          <span className="font-['DM_Serif_Display'] text-xl text-[#F0F4FF]">HealthHub</span>
          <span className="text-[#4A5568] mx-1">•</span>
          <span className="text-[#00C8FF] font-light text-xl">Connect</span>
        </Link>

        {/* Desktop Navigation - Center */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {links.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm tracking-[0.15em] uppercase transition-all duration-200 pb-1",
                    isActive
                      ? "text-[#F0F4FF] border-b border-[#00C8FF]"
                      : "text-[#8A9BB5] hover:text-[#F0F4FF] hover:border-b hover:border-[#00C8FF]"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-3 focus:outline-none focus:ring-1 focus:ring-[#00C8FF] rounded-sm p-1"
                    aria-label="User menu"
                  >
                    {/* Role Badge */}
                    <span className="hidden sm:inline-block text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5 bg-[#1A2235] text-[#8A9BB5] border border-[#1E293B]">
                      {user?.role}
                    </span>
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-[#00C8FF18] border border-[#00C8FF33] text-[#00C8FF] text-xs font-medium flex items-center justify-center">
                      {getInitials(user?.name)}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#111827] border-[#1E293B]">
                  <div className="flex items-center gap-2 p-3 border-b border-[#1E293B]">
                    <div className="w-10 h-10 rounded-full bg-[#00C8FF18] border border-[#00C8FF33] text-[#00C8FF] text-sm font-medium flex items-center justify-center">
                      {getInitials(user?.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#F0F4FF]">{user?.name}</span>
                      <span className="text-[10px] tracking-[0.15em] uppercase text-[#8A9BB5]">{user?.role}</span>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/settings" 
                      className="flex items-center cursor-pointer text-[#8A9BB5] hover:text-[#F0F4FF] hover:bg-[#1A2235]"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#1E293B]" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-[#FF4D6D] hover:text-[#FF4D6D] hover:bg-[#FF4D6D10] cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-[#8A9BB5] hover:text-[#F0F4FF] transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/auth" 
                className="text-sm tracking-[0.1em] uppercase text-[#8A9BB5] hover:text-[#F0F4FF] transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/auth?mode=register" 
                className="bg-[#00C8FF] text-[#0B0F1A] font-semibold text-sm tracking-wider uppercase px-4 py-2 hover:bg-[#33D4FF] transition-all active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation - Slide Down Drawer */}
      <div 
        className={cn(
          "md:hidden bg-[#0B0F1A] overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-screen border-t border-[#1E293B]" : "max-h-0"
        )}
      >
        {isAuthenticated && (
          <nav className="p-4" aria-label="Mobile navigation">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 py-3 border-b border-[#1E293B] text-sm tracking-[0.1em] uppercase transition-colors",
                    isActive
                      ? "text-[#00C8FF]"
                      : "text-[#8A9BB5] hover:text-[#F0F4FF]"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-3 border-b border-[#1E293B] text-sm tracking-[0.1em] uppercase text-[#8A9BB5] hover:text-[#F0F4FF] transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
