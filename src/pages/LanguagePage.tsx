import { Globe, Check } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { useLanguage } from '@/hooks/useLanguage';
import type { Language } from '@/types';
import { useToast } from '@/hooks/useToast';

const languages: { value: Language; label: string; nativeLabel: string; description: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English', description: 'Default language' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', description: 'हिन्दी भाषा' },
  { value: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', description: 'ಕನ್ನಡ ಭಾಷೆ' },
];

export function LanguagePage() {
  const { lang, setLang, t } = useLanguage();
  const { showToast } = useToast();

  const handleChange = (language: Language) => {
    setLang(language);
    const selected = languages.find((l) => l.value === language);
    showToast(`Language changed to ${selected?.label}`);
  };

  return (
    <Layout title={t('language')} subtitle="Choose your preferred language">
      <PageHeader
        title="Language Settings"
        description="Select your preferred language for the platform interface"
      />

      <div className="mx-auto max-w-2xl space-y-3">
        {languages.map((language) => (
          <button
            key={language.value}
            onClick={() => handleChange(language.value)}
            className={`flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
              lang === language.value
                ? 'border-burgundy-300 bg-burgundy-50'
                : 'border-burgundy-50 bg-white hover:border-burgundy-200 hover:bg-burgundy-50/30'
            }`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              lang === language.value ? 'bg-burgundy-600 text-white' : 'bg-burgundy-50 text-burgundy-600'
            }`}>
              <Globe className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-burgundy-900">{language.nativeLabel}</p>
              <p className="text-sm text-charcoal/50">{language.label} · {language.description}</p>
            </div>
            {lang === language.value && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-burgundy-600 text-white">
                <Check className="h-4 w-4" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Language preview */}
      <div className="mx-auto mt-8 max-w-2xl card p-5">
        <h3 className="mb-3 text-base font-semibold text-burgundy-900">Interface Preview</h3>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {['dashboard', 'weddingJourney', 'bride', 'groom', 'guests', 'tasks', 'budget', 'notifications', 'support'].map((key) => (
            <div key={key} className="rounded-lg bg-burgundy-50/50 px-3 py-2">
              <p className="text-xs text-charcoal/40">{key}</p>
              <p className="font-medium text-burgundy-700">{t(key)}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
