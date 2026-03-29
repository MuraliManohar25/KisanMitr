import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
    { code: 'ur', label: 'اردو (Urdu)' }
];

export default function LanguageSelector() {
    const { i18n } = useTranslation();

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-semibold transition backdrop-blur-md border border-white/30">
                <Globe className="w-4 h-4" />
                <span className="uppercase">{i18n.language?.split('-')[0] || 'EN'}</span>
            </button>

            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition flex items-center justify-between ${i18n.language?.startsWith(lang.code) ? 'text-forest font-bold bg-green-50' : 'text-charcoal'
                            }`}
                    >
                        {lang.label}
                        {i18n.language?.startsWith(lang.code) && <span className="text-forest">✓</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}
