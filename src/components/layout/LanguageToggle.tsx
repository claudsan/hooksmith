import { useState, useRef, useEffect, type ComponentType } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, type SupportedLanguage } from '@/i18n';
import { FlagBR, FlagES, FlagUS } from '@/components/ui/Flags';
import { cn } from '@/lib/cn';

interface LanguageOption {
  code: SupportedLanguage;
  shortLabel: string;
  fullLabel: string;
  Flag: ComponentType<{ className?: string }>;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'pt-BR', shortLabel: 'PT-BR', fullLabel: 'Português', Flag: FlagBR },
  { code: 'en-US', shortLabel: 'EN-US', fullLabel: 'English', Flag: FlagUS },
  { code: 'es-ES', shortLabel: 'ES-ES', fullLabel: 'Español', Flag: FlagES },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCode = (
    i18n.language === 'es-ES' ? 'es-ES' : i18n.language === 'en-US' ? 'en-US' : 'pt-BR'
  ) as SupportedLanguage;

  const current = LANGUAGES.find((l) => l.code === currentCode) ?? LANGUAGES[0];
  const CurrentFlag = current.Flag;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectLanguage = (code: SupportedLanguage) => {
    void changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Alterar idioma / Switch language / Cambiar idioma"
        className={cn(
          'group flex h-[30px] items-center gap-2 rounded-lg border border-line bg-panel px-2.5 text-[12px] font-semibold transition-colors hover:border-line-focus hover:bg-elevated',
          isOpen && 'border-line-focus bg-elevated',
          className
        )}
      >
        <CurrentFlag className="h-3 w-[18px]" />
        <span className="font-mono text-fg tracking-wide">{current.shortLabel}</span>
        <ChevronDown className={cn('h-3 w-3 text-fg-subtle transition-transform', isOpen && 'rotate-180 text-brand')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-48 rounded-xl border border-line bg-[#161A23] p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentCode;
            const LangFlag = lang.Flag;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => selectLanguage(lang.code)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[12.5px] transition-colors',
                  isSelected
                    ? 'bg-brand/15 text-brand font-semibold'
                    : 'text-fg-muted hover:bg-hover hover:text-fg'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <LangFlag className="h-3.5 w-5" />
                  <span>{lang.fullLabel}</span>
                </div>
                <span className="font-mono text-[10.5px] text-fg-subtle">{lang.shortLabel}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
