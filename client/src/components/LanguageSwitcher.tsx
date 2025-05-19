import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "icon" | "full" | "minimal";
  className?: string;
}

export default function LanguageSwitcher({ variant = "icon", className = "" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const { t } = useTranslation();

  const languages = [
    { code: "en", name: t('settings.language.languages.en') },
    { code: "ru", name: t('settings.language.languages.ru') },
    { code: "kk", name: t('settings.language.languages.kk') },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    // Save the language preference to localStorage for persistence
    localStorage.setItem("preferredLanguage", langCode);
  };

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Icon-only variant (for navbar)
  if (variant === "icon") {
    return (
      <div className={`relative ${className}`}>
        <Select value={i18n.language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-10 h-10 p-0 justify-center">
            <Globe className="h-5 w-5" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Minimal variant (for navbar with dropdown)
  if (variant === "minimal") {
    return (
      <div className={`relative ${className}`}>
        <Select value={i18n.language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-fit px-3">
            <Globe className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{
              languages.find(lang => lang.code === i18n.language)?.name || "Language"
            }</span>
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  
  // Full variant (for settings page)
  return (
    <div className={className}>
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}