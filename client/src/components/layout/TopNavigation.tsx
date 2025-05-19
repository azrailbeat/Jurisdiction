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
import { LoginButton } from "@/components/auth/LoginButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const TopNavigation: React.FC = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  
  // Map routes to translation keys
  const routeTitles: Record<string, string> = {
    "/": t("app.title"),
    "/documents": t("documents.title"),
    "/versions": t("versions.title"),
    "/knowledge-graph": t("knowledgeGraph.title"),
    "/verification": t("verification.title"),
    "/terminology": "Legal Terminology",
    "/analytics": t("analytics.title"),
    "/settings": t("settings.title")
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
            placeholder={t('app.search')}
            className="pl-10 pr-4 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-40 md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-2.5 text-neutral-300"></i>
        </form>

        <LanguageSwitcher variant="minimal" />

        <div className="relative">
          <button className="relative p-2 text-neutral-400 hover:text-neutral-500">
            <i className="fas fa-bell"></i>
            <span className="absolute top-1 right-1 bg-status-error text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button>
        </div>

        <LoginButton />
      </div>
    </header>
  );
};

export default TopNavigation;
