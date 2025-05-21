import React from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

const MobileNavigation: React.FC = () => {
  const [location] = useLocation();
  const { t } = useTranslation();

  // Основные пункты навигации для мобильного меню (ограничено 5 пунктами)
  const mainNavItems = [
    { path: "/", icon: "fa-home", label: t("nav.home") },
    { path: "/documents", icon: "fa-file-lines", label: t("nav.documents") },
    { path: "/knowledge-graph", icon: "fa-diagram-project", label: t("nav.knowledgeGraph") },
    { path: "/verification", icon: "fa-check-double", label: t("nav.verification") },
    { path: "/settings", icon: "fa-gear", label: t("settings.title") }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-30 px-2 py-1">
      <nav className="flex justify-around">
        {mainNavItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a className={`flex flex-col items-center p-2 rounded-lg ${
              location === item.path
                ? "text-primary"
                : "text-neutral-500 hover:text-neutral-700"
            }`}>
              <i className={`fas ${item.icon} text-lg`}></i>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;