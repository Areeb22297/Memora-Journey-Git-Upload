
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Home, Calendar, Star, Settings, Camera, Grid2X2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const navItems: NavItem[] = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
    { name: 'Favorites', path: '/favorites', icon: <Star size={20} /> },
    { name: 'Highlights', path: '/memories', icon: <Camera size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    toast({
      description: `${newMode ? 'Dark' : 'Light'} mode activated`,
      duration: 1500,
    });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn("min-h-screen flex flex-col w-full")}>
      {/* Header */}
      <header className="border-b py-3 px-4 flex items-center justify-between bg-background sticky top-0 z-20 w-full">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-memora-purple flex items-center justify-center">
            <Camera size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">Memora</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* <button
            onClick={() => toast({ description: "Layout view changed to grid", duration: 1500 })}
            className="p-2 rounded-full hover:bg-secondary"
          >
            <Grid2X2 size={20} />
          </button> */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-secondary"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 w-full">
        {/* Sidebar Navigation - hidden on mobile */}
        {!isMobile && (
          <aside className="w-16 md:w-60 p-2 md:p-4 border-r bg-background shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "nav-link w-full text-left",
                    location.pathname === item.path && "active",
                    "flex md:flex-row flex-col items-center justify-center md:justify-start"
                  )}
                  title={item.name}
                >
                  {item.icon}
                  <span className="text-xs md:text-base md:ml-2">{!isMobile && item.name}</span>
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-2 sm:p-4 md:p-6 overflow-auto w-full",
          isMobile ? "pb-20" : "pb-6" // Add extra padding at bottom on mobile for nav bar
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Navigation - Fixed to bottom */}
      {isMobile && (
        <nav className="border-t p-2 flex justify-around bg-background fixed bottom-0 left-0 right-0 z-20">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "p-2 rounded-md flex flex-col items-center",
                location.pathname === item.path ? "text-primary" : "text-foreground/70"
              )}
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.name}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
