import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

// List of available languages
const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
];

interface LanguageSwitcherProps {
  variant?: 'minimal' | 'full';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'full', 
  className = '' 
}) => {
  const { i18n, t } = useTranslation();
  
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  // Get current language details
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  return (
    <div className={className}>
      {variant === 'full' && (
        <label className="mr-2 text-sm text-muted-foreground">
          {t('app.language')}:
        </label>
      )}
      <Select
        value={i18n.language}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className={`${variant === 'minimal' ? 'w-auto p-1 h-8' : 'w-32'}`}>
          <SelectValue>
            <span className="flex items-center">
              <span className="mr-2">{currentLanguage.flag}</span>
              {variant === 'full' && (
                <span>{currentLanguage.name}</span>
              )}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center">
                <span className="mr-2">{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;