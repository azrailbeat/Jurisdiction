import React from "react";
import { Link, useLocation } from "wouter";

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: "fa-home", label: "Dashboard" },
    { path: "/documents", icon: "fa-file-lines", label: "Documents" },
    { path: "/versions", icon: "fa-code-branch", label: "Versions" },
    { path: "/knowledge-graph", icon: "fa-diagram-project", label: "Knowledge Graph" },
    { path: "/verification", icon: "fa-check-double", label: "Verification" },
    { path: "/terminology", icon: "fa-book", label: "Terminology" },
    { path: "/analytics", icon: "fa-chart-line", label: "Analytics" },
  ];

  return (
    <aside className="bg-neutral-500 text-white w-16 md:w-64 flex-shrink-0 flex flex-col">
      <div className="p-4 flex items-center justify-center md:justify-start h-16 border-b border-neutral-400">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center bg-primary rounded">
            <i className="fas fa-scale-balanced text-white"></i>
          </div>
          <h1 className="text-xl font-semibold hidden md:block">LegalTrack</h1>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a
                  className={`flex items-center px-4 py-3 text-white ${
                    location === item.path
                      ? "bg-primary-dark hover:bg-primary-light"
                      : "hover:bg-neutral-400"
                  }`}
                >
                  <i className={`fas ${item.icon} w-6`}></i>
                  <span className="ml-3 hidden md:block">{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-neutral-400">
        <Link href="/settings">
          <a className="flex items-center text-white hover:bg-neutral-400 px-4 py-2 rounded">
            <i className="fas fa-gear w-6"></i>
            <span className="ml-3 hidden md:block">Settings</span>
          </a>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
