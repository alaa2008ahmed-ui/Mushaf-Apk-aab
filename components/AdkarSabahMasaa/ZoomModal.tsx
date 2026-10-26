import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getAdhkarTranslation } from '../../data/adkarTranslationsEn';
import { shareAsImage } from '../../utils/shareAsImage';

interface ZoomModalProps {
    zoomedDhikr: {
        text: string;
        textEn?: string;
        source?: string;
        sourceEn?: string;
        category?: string;
        categoryEn?: string;
        count?: number;
    } | null;
    onClose: () => void;
    setToastMessage?: (msg: string) => void;
}

const toArabicNumerals = (num: number) => String(num).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);

const ZoomModal: React.FC<ZoomModalProps> = ({ zoomedDhikr, onClose, setToastMessage }) => {
    const { theme, themeKey } = useTheme();
    const { language } = useLanguage();
    const isEn = language === 'en';

    if (!zoomedDhikr) return null;

    const isBlackTheme = theme.bgColor === '#000000' || themeKey === 'deep_black' || theme.name === 'اسود' || theme.name === 'أبيض وأسود';
    const primaryColor = isBlackTheme ? '#FFFFFF' : (theme.palette?.[0] || theme.accent || '#2E7D5E');
    const btnTextColor = isBlackTheme ? '#000000' : (theme.btnText || '#FFFFFF');

    const translation = getAdhkarTranslation(zoomedDhikr.text);
    const displayText = isEn ? (translation?.text || zoomedDhikr.textEn || zoomedDhikr.text) : zoomedDhikr.text;
    const displaySource = isEn ? (translation?.source || zoomedDhikr.sourceEn || zoomedDhikr.source) : zoomedDhikr.source;
    
    let displayCategory = zoomedDhikr.category || 'أذكار';
    if (isEn) {
        if (zoomedDhikr.category === 'أذكار الصباح') displayCategory = 'Morning Remembrances';
        else if (zoomedDhikr.category === 'أذكار المساء') displayCategory = 'Evening Remembrances';
        else displayCategory = zoomedDhikr.categoryEn || 'Daily Remembrances';
    }

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await shareAsImage({
            text: displayText,
            source: displaySource,
            category: displayCategory,
            theme,
            isEn,
            language: isEn ? 'en' : 'ar',
            setToastMessage
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4 backdrop-blur-md" 
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 p-6 sm:p-8 rounded-3xl w-full max-w-2xl text-center relative scale-in shadow-2xl border-0 flex flex-col max-h-[90vh]" 
                style={{ fontFamily: isEn ? 'sans-serif' : theme.font }} 
                dir={isEn ? 'ltr' : 'rtl'}
                onClick={e => e.stopPropagation()}
            >
                <div className="overflow-y-auto hide-scrollbar flex-1 py-4">
                    {/* Dhikr Text: pure English when isEn, pure Arabic when Arabic */}
                    {isEn ? (
                        <div 
                            className="text-xl md:text-2xl leading-relaxed font-sans font-medium text-center my-4 select-none text-balance"
                            dir="ltr"
                        >
                            {displayText}
                        </div>
                    ) : (
                        <div 
                            className="text-2xl md:text-3xl lg:text-4xl leading-[2.3] font-amiri text-center select-none"
                            dir="rtl"
                        >
                            {displayText}
                        </div>
                    )}

                    {displaySource && (
                        <p className="text-base sm:text-lg mt-6 font-bold" style={{ color: primaryColor }} dir={isEn ? 'ltr' : 'rtl'}>
                            {displaySource}
                        </p>
                    )}

                    {zoomedDhikr.count && zoomedDhikr.count > 1 && (
                        <p className="text-sm mt-3 font-semibold opacity-75">
                            {isEn 
                                ? `Required repetitions: ${zoomedDhikr.count} times` 
                                : `التكرار المطلوب: ${toArabicNumerals(zoomedDhikr.count)} مرات`}
                        </p>
                    )}
                </div>

                <div className="mt-6 shrink-0 flex items-center gap-3">
                    <button 
                        onClick={handleShare} 
                        className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-sm cursor-pointer"
                        style={{ backgroundColor: primaryColor, color: btnTextColor }}
                        title={isEn ? "Share Image" : "مشاركة كصورة"}
                    >
                        <i className="fa-solid fa-share-nodes"></i>
                        <span>{isEn ? 'Share Image' : 'مشاركة كصورة'}</span>
                    </button>
                    <button 
                        onClick={onClose} 
                        className="flex-1 py-3 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer"
                    >
                        {isEn ? 'Close' : 'إغلاق'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ZoomModal;
