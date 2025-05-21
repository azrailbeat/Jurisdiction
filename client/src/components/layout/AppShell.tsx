import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopNavigation from "./TopNavigation";
import MobileNavigation from "./MobileNavigation";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className={`hidden md:block`}>
        <Sidebar />
      </div>
      
      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden transition-transform duration-300 ease-in-out z-50`}
      >
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation 
          isMobile={isMobile} 
          onMenuToggle={toggleMobileMenu} 
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-neutral-100">
          {children}
        </main>
        
        {/* Mobile bottom navigation */}
        {isMobile && <MobileNavigation />}
      </div>
    </div>
  );
};

export default AppShell;
