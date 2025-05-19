import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { 
      path: "/", 
      icon: "fa-home", 
      label: "Home", 
      description: "Dashboard overview and quick access" 
    },
    { 
      path: "/documents", 
      icon: "fa-file-lines", 
      label: "Documents", 
      description: "Manage legislative documents" 
    },
    { 
      path: "/versions", 
      icon: "fa-code-branch", 
      label: "Versions", 
      description: "Track document revisions" 
    },
    { 
      path: "/knowledge-graph", 
      icon: "fa-diagram-project", 
      label: "Knowledge Graph", 
      description: "Visualize document relationships" 
    },
    { 
      path: "/verification", 
      icon: "fa-check-double", 
      label: "Verification", 
      description: "Validate document compliance" 
    },
    { 
      path: "/terminology", 
      icon: "fa-book", 
      label: "Terminology", 
      description: "Manage legal terms glossary" 
    },
  ];

  return (
    <aside className={`bg-neutral-50 border-r border-neutral-200 h-full flex-shrink-0 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo and app name */}
      <div className="p-4 flex items-center justify-between h-16 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg">
            <i className="fas fa-scale-balanced text-white"></i>
          </div>
          {!collapsed && <h1 className="text-xl font-semibold text-neutral-800">LegalTrack</h1>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full text-neutral-500"
          onClick={() => setCollapsed(!collapsed)}
        >
          <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </Button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <TooltipProvider delayDuration={collapsed ? 300 : 999999}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.path}>
                      <a
                        className={`flex items-center rounded-lg px-3 py-2.5 ${
                          location === item.path
                            ? "bg-primary/10 text-primary"
                            : "text-neutral-700 hover:bg-neutral-100"
                        } transition-colors duration-150`}
                      >
                        <i className={`fas ${item.icon} ${collapsed ? 'text-lg' : 'w-5'}`}></i>
                        {!collapsed && (
                          <span className="ml-3 font-medium">
                            {item.label}
                          </span>
                        )}
                      </a>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile and settings */}
      <div className="p-3 border-t border-neutral-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={`w-full ${collapsed ? 'justify-center px-0' : 'justify-start'} hover:bg-neutral-100`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-neutral-700 truncate max-w-[120px]">
                    {user?.firstName || "User"}
                  </p>
                  <p className="text-xs text-neutral-500 truncate max-w-[120px]">
                    {user?.email || ""}
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem>
                <i className="fas fa-user mr-2 text-neutral-500"></i>
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/notifications">
              <DropdownMenuItem>
                <i className="fas fa-bell mr-2 text-neutral-500"></i>
                <span>Notifications</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem>
                <i className="fas fa-gear mr-2 text-neutral-500"></i>
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <i className="fas fa-sign-out-alt mr-2"></i>
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;
