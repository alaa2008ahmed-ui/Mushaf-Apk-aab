import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { shareAsImage } from '../../utils/shareAsImage';
import { playTTS, stopTTS, subscribeTTS } from '../../utils/ttsEngine';
import { Volume2, VolumeX, Copy, Check, Share2, X } from 'lucide-react';
import { hexToRgba, getModernFlatTokens } from '../../utils/flatDesignTokens';

interface ZoomModalProps {
    zoomedItem: {
        title?: string;
        text: string;
        textEn?: string;
        source?: string;
        sourceEn?: string;
        category?: string;
        categoryAr?: string;
        categoryEn?: string;
        count?: number;
        isEn?: boolean;
    } | null;
    onClose: () => void;
    setToastMessage?: (msg: string) => void;
}

const toArabicNumerals = (num: number) => String(num).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);

const ZoomModal: React.FC<ZoomModalProps> = ({ zoomedItem, onClose, setToastMessage }) => {
    const { theme, themeKey } = useTheme();
    const { language, dir } = useLanguage();
    const tokens = getModernFlatTokens(theme, themeKey);
    const isEn = zoomedItem?.isEn ?? (language === 'en' || (zoomedItem?.text ? !/[\u0600-\u06FF]/.test(zoomedItem.text) : false));

    const [copied, setCopied] = useState(false);
    const [playingText, setPlayingText] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeTTS(setPlayingText);
        return () => {
            unsubscribe();
            stopTTS();
        };
    }, []);

    if (!zoomedItem) return null;

    const displayText = isEn ? (zoomedItem.textEn || zoomedItem.text) : zoomedItem.text;
    const displayCategory = isEn 
        ? (zoomedItem.categoryEn || zoomedItem.category || 'Fortress of the Muslim')
        : (zoomedItem.categoryAr || zoomedItem.category || 'حصن المسلم');

    const getDisplaySubtitle = () => {
        if (isEn) {
            const cat = zoomedItem.categoryEn || zoomedItem.category || 'Fortress of the Muslim';
            const src = zoomedItem.sourceEn || zoomedItem.source;
            return src ? `${cat} • ${src}` : cat;
        }

        let cat = zoomedItem.categoryAr || zoomedItem.category;
        const src = zoomedItem.source;
        let formattedCat = '';

        if (cat && cat !== 'حصن المسلم') {
            cat = cat.trim();
            if (cat.startsWith('من ')) {
                formattedCat = cat;
            } else if (cat.startsWith('أذكار ') || cat.startsWith('دعاء ') || cat.startsWith('الذكر ')) {
                formattedCat = `من ${cat}`;
            } else {
                formattedCat = `من أذكار ${cat}`;
            }
        } else if (zoomedItem.title) {
            formattedCat = zoomedItem.title;
        } else {
            formattedCat = 'من أذكار حصن المسلم المأثورة';
        }

        if (src && src.trim()) {
            return `${formattedCat} (${src.trim()})`;
        }
        return formattedCat;
    };

    const displaySubtitle = getDisplaySubtitle();
    const isPlaying = playingText === displayText || playingText === zoomedItem.text;

    const handlePlayAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPlaying) {
            stopTTS();
        } else {
            playTTS(displayText, {
                onToast: (msg) => {
                    if (setToastMessage) setToastMessage(msg);
                }
            });
        }
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(displayText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            if (setToastMessage) {
                setToastMessage(isEn ? 'Copied to clipboard' : 'تم النسخ إلى الحافظة');
            }
        });
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await shareAsImage({
            text: displayText,
            title: zoomedItem.title,
            source: zoomedItem.source,
            category: displayCategory,
            theme,
            isEn,
            language: isEn ? 'en' : 'ar',
            setToastMessage
        });
    };

    return (
        <AnimatePresence>
            <div 
                className="fixed inset-0 bg-black/60 z-[120] flex flex-col justify-end backdrop-blur-xs select-none" 
                onClick={onClose}
                dir={dir}
            >
                <motion.div 
                    initial={{ y: '100%', opacity: 0.6 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                    className="w-full max-w-xl mx-auto rounded-t-[28px] flex flex-col max-h-[88vh] overflow-hidden relative shadow-2xl"
                    style={{ 
                        backgroundColor: tokens.cardBgColor,
                        color: 'var(--text-color)',
                        fontFamily: isEn ? 'sans-serif' : theme.font,
                    }} 
                    onClick={e => e.stopPropagation()}
                >
                    {/* Top Drag Handle */}
                    <div className="pt-3 px-6 pb-2 shrink-0 flex flex-col items-center">
                        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700 mb-2" />
                        <div className="w-full flex items-center justify-between">
                            <span 
                                className="px-3 py-1 rounded-full text-xs font-bold"
                                style={{
                                    backgroundColor: hexToRgba(tokens.primaryColor, 0.1),
                                    color: tokens.primaryColor
                                }}
                            >
                                {displayCategory}
                            </span>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="overflow-y-auto hide-scrollbar flex-1 px-6 py-4">
                        {isEn ? (
                            <div 
                                className="text-xl md:text-2xl leading-relaxed font-sans font-medium text-center my-4 select-none text-balance"
                                dir="ltr"
                            >
                                {displayText}
                            </div>
                        ) : (
                            <div 
                                className="text-2xl md:text-3xl lg:text-4xl leading-[2.4] font-amiri text-center select-none py-2"
                                dir="rtl"
                            >
                                {displayText}
                            </div>
                        )}

                        {displaySubtitle && (
                            <p 
                                className="text-sm sm:text-base mt-4 font-bold font-cairo text-center" 
                                style={{ color: tokens.primaryColor }} 
                                dir={isEn ? 'ltr' : 'rtl'}
                            >
                                {displaySubtitle}
                            </p>
                        )}

                        {zoomedItem.count && zoomedItem.count > 1 && (
                            <div className="flex justify-center mt-3">
                                <span 
                                    className="px-3.5 py-1 rounded-full text-xs font-bold"
                                    style={{
                                        backgroundColor: hexToRgba(tokens.primaryColor, 0.08),
                                        color: tokens.primaryColor
                                    }}
                                >
                                    {isEn 
                                        ? `Required: ${zoomedItem.count} times` 
                                        : `التكرار المطلوب: ${toArabicNumerals(zoomedItem.count)} مرات`}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Bar (Audio, Copy, Share, Close) */}
                    <div className="p-4 sm:p-5 shrink-0 flex items-center gap-2.5 border-t border-slate-100 dark:border-white/5" style={{ backgroundColor: tokens.cardBgColor }}>
                        <button
                            type="button"
                            onClick={handlePlayAudio}
                            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0"
                            style={{
                                backgroundColor: isPlaying ? tokens.primaryColor : hexToRgba(tokens.primaryColor, 0.1),
                                color: isPlaying ? tokens.themeActiveTextColor : tokens.primaryColor
                            }}
                            title={isEn ? (isPlaying ? 'Stop audio' : 'Play audio') : (isPlaying ? 'إيقاف الصوت' : 'استماع')}
                        >
                            {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>

                        <button
                            type="button"
                            onClick={handleCopy}
                            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0"
                            style={{
                                backgroundColor: copied ? '#10B981' : hexToRgba(tokens.primaryColor, 0.1),
                                color: copied ? '#FFFFFF' : tokens.primaryColor
                            }}
                            title={isEn ? 'Copy text' : 'نسخ النص'}
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>

                        <button 
                            type="button"
                            onClick={handleShare} 
                            className="flex-1 h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all shadow-sm cursor-pointer text-sm sm:text-base"
                            style={{ backgroundColor: tokens.primaryColor, color: tokens.themeActiveTextColor }}
                            title={isEn ? "Share Image" : "مشاركة كصورة"}
                        >
                            <Share2 size={18} />
                            <span>{isEn ? 'Share Image' : 'مشاركة كصورة'}</span>
                        </button>

                        <button 
                            type="button"
                            onClick={onClose} 
                            className="px-5 h-12 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 active:scale-98 transition-all cursor-pointer text-sm"
                        >
                            {isEn ? 'Close' : 'إغلاق'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ZoomModal;
