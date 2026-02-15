/**
 * Language Switcher Component
 * Dropdown menu for language selection
 */

import { useLanguage, getLanguageFlag, getLanguageName } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

type SupportedLanguage = 'en' | 'zh-TW' | 'es';

export function LanguageSwitcher() {
  const { language, setLanguage, supportedLanguages } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-3"
          title="Switch language"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-sm font-medium">
            {getLanguageFlag(language as SupportedLanguage)}
          </span>
          <span className="hidden md:inline text-sm">{getLanguageName(language as SupportedLanguage)}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as SupportedLanguage)}
            className={`cursor-pointer flex items-center gap-2 ${
              language === lang.code ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <span className="text-lg">{getLanguageFlag(lang.code as SupportedLanguage)}</span>
            <span className="flex-1">{lang.name}</span>
            {language === lang.code && <span className="text-blue-600 font-bold">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
