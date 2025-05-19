import React from "react";
import Sidebar from "./Sidebar";
import TopNavigation from "./TopNavigation";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
