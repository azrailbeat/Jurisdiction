import React, { useState } from "react";
import { useLocation } from "wouter";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "@/types";

const TopNavigation: React.FC = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Map routes to titles
  const routeTitles: Record<string, string> = {
    "/": "Legislative Document Management",
    "/documents": "Document Repository",
    "/versions": "Version Control",
    "/knowledge-graph": "Knowledge Graph",
    "/verification": "Verification & Compliance",
    "/terminology": "Legal Terminology",
    "/analytics": "Analytics Dashboard",
    "/settings": "System Settings"
  };

  const { data: searchResults } = useQuery<SearchResult[]>({
    queryKey: ['/api/search', searchQuery],
    enabled: searchQuery.length > 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <div className="font-semibold text-lg hidden md:block">
          {routeTitles[location] || "Legislative Document Management"}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-40 md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-2.5 text-neutral-300"></i>
        </form>

        <div className="relative">
          <button className="relative p-2 text-neutral-400 hover:text-neutral-500">
            <i className="fas fa-bell"></i>
            <span className="absolute top-1 right-1 bg-status-error text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" alt="User avatar" />
              <AvatarFallback>NI</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">Nikolay Ivanov</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavigation;
