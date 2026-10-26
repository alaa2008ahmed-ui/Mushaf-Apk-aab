import React from 'react';
import { motion } from 'framer-motion';
import { 
    BookOpen,
    Headphones,
    BookmarkCheck,
    Brain,
    Clock,
    Compass,
    Sparkles,
    Sun,
    HeartHandshake,
    CircleDot,
    ScrollText,
    Award,
    BookMarked,
    Star,
    CalendarDays,
    Tent,
    ShieldCheck,
    CheckSquare,
    Globe,
    Calculator,
    Mic
} from 'lucide-react';
import NavButton from './NavButton';
import WhatsAppButton from '../WhatsAppButton';
import VoiceControlToggle from '../VoiceControlToggle';
import { useVoiceControl } from '../../context/VoiceControlContext';
import { useShowNewBadge, useSeenPages, markPageAsSeen } from '../../utils/badgeManager';
import { useLanguage } from '../../context/LanguageContext';

interface GridSectionProps {
    menuItems: any[];
    setMenuItems: React.Dispatch<React.SetStateAction<any[]>>;
    visibleItems: string[];
    isEditMode: boolean;
    onNavigate: (id: string) => void;
    theme: any;
    themeKey: string;
    DEFAULT_MENU_ITEMS: any[];
}

// Categorical color constants for the 4 sections (Soft & Muted Colors)
const SECTION_1_PURPLE = '#6A588C';
const SECTION_1_GRADIENT = 'linear-gradient(145deg, #6A588C, #78659D)';

const SECTION_2_GREEN = '#2E7D5E';
const SECTION_2_GRADIENT = 'linear-gradient(145deg, #2E7D5E, #368B69)';

const SECTION_3_TEAL = '#3B7A82';
const SECTION_3_GRADIENT = 'linear-gradient(145deg, #3B7A82, #458A93)';

const SECTION_4_TERRACOTTA = '#A26743';
const SECTION_4_GRADIENT = 'linear-gradient(145deg, #A26743, #B3744D)';

// Distinctive, dignified calm slate-violet gradient for Holy Quran hero card
const QURAN_HERO_VIOLET = '#544670'; // Dignified spiritual slate-violet
const QURAN_HERO_GRADIENT = 'linear-gradient(135deg, #5B4E7A 0%, #463A64 100%)';

const GridSection: React.FC<GridSectionProps> = ({
    menuItems,
    setMenuItems,
    visibleItems,
    isEditMode,
    onNavigate,
    theme,
    themeKey,
    DEFAULT_MENU_ITEMS
}) => {
    const { showVoiceIcon } = useVoiceControl();
    const showNewBadges = useShowNewBadge();
    const { isPageSeen } = useSeenPages();
    const { t, translateMenuItem, dir, language } = useLanguage();
    const isEn = language === "en";

    const getButtonIcon = (id: string) => {
        const iconClass = "w-3 h-3 min-[380px]:w-3.5 min-[380px]:h-3.5";
        switch (id) {
            case 'quran':
                return <BookOpen className={iconClass} />;
            case 'listen':
                return <Headphones className={iconClass} />;
            case 'daily-wird':
                return <BookmarkCheck className={iconClass} />;
            case 'memorization':
                return <Brain className={iconClass} />;
            case 'prayer-times':
                return <Clock className={iconClass} />;
            case 'qibla':
                return <Compass className={iconClass} />;
            case 'salah-adhkar':
                return <Sparkles className={iconClass} />;
            case 'sabah-masaa':
                return <Sun className={iconClass} />;
            case 'adia':
                return <HeartHandshake className={iconClass} />;
            case 'tasbeeh':
                return <CircleDot className={iconClass} />;
            case 'hisn-muslim':
                return <BookOpen className={iconClass} />;
            case 'prophetic-seerah':
                return <ScrollText className={iconClass} />;
            case 'ten-promised':
                return <Award className={iconClass} />;
            case 'nawawi':
                return <BookMarked className={iconClass} />;
            case 'asmaul-husna':
                return <Star className={iconClass} />;
            case 'calendar':
                return <CalendarDays className={iconClass} />;
            case 'hajj-umrah':
                return <Tent className={iconClass} />;
            case 'others':
                return <ShieldCheck className={iconClass} />;
            case 'habit-tracker':
                return <CheckSquare className={iconClass} />;
            case 'islamic-sites':
                return <Globe className={iconClass} />;
            case 'calculators':
                return <Calculator className={iconClass} />;
            case 'voice-control':
                return <Mic className={iconClass} />;
            default:
                return null;
        }
    };

    const handleResize = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuItems(prev => prev.map(item => {
            if (item.id === id) {
                let newClass = item.className;
                if (item.className.includes('col-span-6')) {
                    newClass = item.className.replace('col-span-6', 'col-span-2').trim();
                } else if (item.className.includes('col-span-3')) {
                    newClass = item.className.replace('col-span-3', 'col-span-6').trim();
                } else if (item.className.includes('col-span-2')) {
                    newClass = item.className.replace('col-span-2', 'col-span-3').trim();
                }
                return { ...item, className: newClass };
            }
            return item;
        }));
    };

    const handleDragStart = () => {
        if (navigator.vibrate) navigator.vibrate(20);
    };

    const handleDragEnd = (event: any, info: any, draggedId: string) => {
        const point = info.point;
        const items = document.querySelectorAll('[data-item-id]');
        let targetId: string | null = null;

        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            const id = el.getAttribute('data-item-id');
            if (id === draggedId) continue;

            const rect = el.getBoundingClientRect();
            if (
                point.x >= rect.left &&
                point.x <= rect.right &&
                point.y >= rect.top &&
                point.y <= rect.bottom
            ) {
                targetId = id;
                break;
            }
        }

        if (targetId) {
            const fromIndex = menuItems.findIndex(i => i.id === draggedId);
            const toIndex = menuItems.findIndex(i => i.id === targetId);
            
            if (fromIndex !== -1 && toIndex !== -1) {
                const newItems = [...menuItems];
                const [movedItem] = newItems.splice(fromIndex, 1);
                newItems.splice(toIndex, 0, movedItem);
                setMenuItems(newItems);
                if (navigator.vibrate) navigator.vibrate(20);
            }
        }
    };

    const isBlackTheme = theme.bgColor === '#000000' || themeKey === 'deep_black' || theme.name === 'اسود' || theme.name === 'black';
    const buttonBorder = isBlackTheme 
        ? '1px solid rgba(255, 255, 255, 0.25)' 
        : (theme.btnBorder && !theme.btnBorder.includes('#000000') && !theme.btnBorder.includes('black') ? theme.btnBorder : 'none');

    const stripIcons = (str: string) => {
        if (!str) return '';
        return str.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '').replace(/^[\s✨📖🎧⏱️🧭🕌🤲🛡️☀️📅🕋📿💬🏆🧠🎯🌐🧮📚📜🎙️🔍📥]+/gu, '').trim();
    };

    // Items that display the "جديد" (New) badge
    const NEW_BADGE_ITEMS = ['others', 'islamic-sites', 'prophetic-seerah', 'ten-promised'];

    const getItem = (id: string) => {
        return menuItems.find(i => i.id === id) || DEFAULT_MENU_ITEMS.find(i => i.id === id) || { id, label: id, className: 'col-span-2 h-11' };
    };

    const getCategoryColor = (id: string) => {
        if (isBlackTheme) return { color: '#000000', gradient: undefined };
        
        if (['listen', 'daily-wird', 'memorization'].includes(id)) {
            return { 
                color: themeKey === 'default' ? SECTION_1_PURPLE : (theme.palette[1] || theme.palette[0] || SECTION_1_PURPLE),
                gradient: themeKey === 'default' ? SECTION_1_GRADIENT : undefined
            };
        }
        if (['prayer-times', 'salah-adhkar', 'qibla', 'sabah-masaa', 'adia', 'tasbeeh', 'others'].includes(id)) {
            return { 
                color: themeKey === 'default' ? SECTION_2_GREEN : (theme.palette[0] || SECTION_2_GREEN),
                gradient: themeKey === 'default' ? SECTION_2_GRADIENT : undefined
            };
        }
        if (['hisn-muslim', 'prophetic-seerah', 'ten-promised', 'hajj-umrah', 'asmaul-husna'].includes(id)) {
            return { 
                color: themeKey === 'default' ? SECTION_3_TEAL : (theme.palette[2] || theme.palette[0] || SECTION_3_TEAL),
                gradient: themeKey === 'default' ? SECTION_3_GRADIENT : undefined
            };
        }
        if (['calendar', 'nawawi', 'calculators', 'habit-tracker', 'islamic-sites'].includes(id)) {
            return { 
                color: themeKey === 'default' ? SECTION_4_TERRACOTTA : (theme.palette[3] || theme.palette[0] || SECTION_4_TERRACOTTA),
                gradient: themeKey === 'default' ? SECTION_4_GRADIENT : undefined
            };
        }
        return { 
            color: themeKey === 'default' ? SECTION_2_GREEN : (theme.palette[0] || SECTION_2_GREEN),
            gradient: themeKey === 'default' ? SECTION_2_GRADIENT : undefined
        };
    };

    const renderNavButtonItem = (id: string, customClassName?: string) => {
        const item = getItem(id);
        const isVisible = visibleItems.includes(item.id);
        if (!isVisible && !isEditMode) return null;

        const { color: buttonColor, gradient: buttonGradient } = getCategoryColor(item.id);
        const textColor = '#FFFFFF';

        const isForcedNew = item.id === 'others' || item.id === 'islamic-sites';
        const showBadge = (isForcedNew || showNewBadges) && NEW_BADGE_ITEMS.includes(item.id) && !isPageSeen(item.id);

        return (
            <motion.div
                key={item.id}
                id={`menu-item-${item.id}`}
                data-item-id={item.id}
                className={`${customClassName || 'h-11'} relative ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                style={{ visibility: isVisible ? 'visible' : 'hidden' }}
                drag={isEditMode}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing', opacity: 0.8 }}
                onDragStart={handleDragStart}
                onDragEnd={(e, info) => handleDragEnd(e, info, item.id)}
            >
                <NavButton 
                    label={stripIcons(translateMenuItem(item.id, item.label))} 
                    icon={item.id === 'quran' ? getButtonIcon(item.id) : undefined}
                    onClick={() => {
                        if (!isEditMode) {
                            markPageAsSeen(item.id);
                            onNavigate(item.id);
                        }
                    }} 
                    className="w-full h-full"
                    color={buttonColor} 
                    gradient={buttonGradient}
                    border={buttonBorder} 
                    isEditMode={isEditMode}
                    onResize={(e) => handleResize(item.id, e)}
                    isGlass={theme.isGlass}
                    btnText={textColor}
                    showNewBadge={showBadge}
                    badgeText={t('common.new', 'جديد')}
                    onBadgeClick={() => {
                        markPageAsSeen(item.id);
                    }}
                />
            </motion.div>
        );
    };

    // Prominent Hero Card for Quran (Distinctive dignified visual hierarchy)
    const renderQuranHeroCard = () => {
        const item = getItem('quran');
        const isVisible = visibleItems.includes('quran');
        if (!isVisible && !isEditMode) return null;

        // Distinguished dignified slate-violet gradient for Quran hero card
        const buttonColor = isBlackTheme
            ? '#000000'
            : (themeKey === 'default'
                ? QURAN_HERO_VIOLET
                : (theme.palette[1] || theme.palette[0] || QURAN_HERO_VIOLET));

        const buttonGradient = isBlackTheme
            ? undefined
            : (themeKey === 'default'
                ? QURAN_HERO_GRADIENT
                : undefined);

        return (
            <motion.div
                key="quran-hero"
                id="menu-item-quran"
                data-item-id="quran"
                className="w-full relative"
                drag={isEditMode}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                whileDrag={{ scale: 1.02, zIndex: 50, cursor: 'grabbing', opacity: 0.8 }}
                onDragStart={handleDragStart}
                onDragEnd={(e, info) => handleDragEnd(e, info, 'quran')}
            >
                <motion.div
                    whileHover={!isEditMode ? { scale: 1.015, y: -2 } : {}}
                    whileTap={!isEditMode ? { scale: 0.985, y: 1 } : {}}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={() => {
                        if (!isEditMode) {
                            markPageAsSeen('quran');
                            onNavigate('quran');
                        }
                    }}
                    className={`w-full rounded-2xl p-3 sm:p-3.5 relative flex items-center justify-between cursor-pointer select-none group transition-all ${isEditMode ? 'cursor-move animate-pulse opacity-80' : ''}`}
                    style={{
                        background: theme.isGlass ? (buttonColor ? `${buttonColor}60` : 'rgba(255, 255, 255, 0.25)') : (buttonGradient || buttonColor),
                        border: buttonBorder,
                        color: '#FFFFFF',
                        backdropFilter: theme.isGlass ? 'blur(12px)' : 'none',
                        WebkitBackdropFilter: theme.isGlass ? 'blur(12px)' : 'none',
                        boxShadow: isBlackTheme
                            ? '0 5px 0 #2a2a2a, 0 8px 16px rgba(0,0,0,0.5)'
                            : (theme.isGlass
                                ? `0 6px 0 ${buttonColor}40, 0 8px 24px rgba(0,0,0,0.1)`
                                : '0 4.5px 0 rgba(0, 0, 0, 0.2), 0 10px 24px -2px rgba(70, 58, 100, 0.28)'),
                    }}
                >
                    {/* Inner highlight for subtle 3D/elevation look */}
                    {!theme.isGlass && (
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/25 rounded-t-2xl"></div>
                    )}

                    <div className="flex items-center gap-2.5 min-w-0 flex-1 px-1 relative z-10">
                        {/* أيقونة المصحف الشريف المسطحة */}
                        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 text-white">
                            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm" strokeWidth={2.3} />
                        </div>

                        <div className="flex flex-col min-w-0 text-start">
                            <span className={`${isEn ? 'font-sans tracking-tight' : 'font-kufi'} font-black text-base sm:text-lg text-white leading-tight truncate drop-shadow-sm`}>
                                {isEn ? "The Noble Qur'an" : "القرآن الكريم"}
                            </span>
                            <span className="text-[11px] sm:text-xs text-white/90 font-medium leading-normal truncate">
                                {isEn ? 'Recitation, Exegesis & Reflection' : 'قراءة وتدبر المصحف الشريف'}
                            </span>
                        </div>
                    </div>

                    {/* Landscape Rotate Button */}
                    {!isEditMode && (
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('quran-landscape');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation();
                                    onNavigate('quran-landscape');
                                }
                            }}
                            className="rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-sm text-white relative z-20 flex-shrink-0 ms-2"
                            style={{ 
                                backgroundColor: isBlackTheme ? '#1F2937' : 'rgba(0, 0, 0, 0.25)',
                                border: '1px solid rgba(255, 255, 255, 0.35)',
                                color: '#FFFFFF'
                            }}
                            title={t('common.landscape_mode', 'وضع العرض')}
                            aria-label={t('common.landscape_mode', 'وضع العرض')}
                        >
                            <i className="fa-solid fa-arrows-rotate text-xs text-white pointer-events-none"></i>
                            <span className={`text-[11px] font-bold ${isEn ? 'font-sans' : 'font-kufi'} text-white inline`}>
                                {isEn ? 'Landscape' : 'عرضي'}
                            </span>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        );
    };

    // Modern flat container cards: pure white #FFFFFF, no solid borders, soft drop shadow
    const sectionCardStyle: React.CSSProperties = {
        backgroundColor: isBlackTheme ? '#141414' : '#FFFFFF',
        borderColor: isBlackTheme ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
        borderWidth: isBlackTheme ? '1px' : '0px',
        borderStyle: isBlackTheme ? 'solid' : 'none',
        borderRadius: '16px',
        boxShadow: isBlackTheme 
            ? '0 4px 20px rgba(0,0,0,0.5)' 
            : '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        backdropFilter: theme.isGlass ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: theme.isGlass ? 'blur(12px)' : 'none',
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto flex-grow content-center relative mt-0 pb-3" dir={dir}>
            
            {/* القسم الأول: القرآن الكريم (التركيز الرئيسي للتطبيق) */}
            <div className="w-full rounded-2xl p-2.5 sm:p-3 relative overflow-hidden flex flex-col gap-2.5 transition-all" style={sectionCardStyle}>
                {/* القرآن الكريم: بطاقة كبيرة ومميزة تتصدر الشاشة */}
                {renderQuranHeroCard()}

                {/* بقية أزرار القرآن: الاستماع للقرآن، التحفيظ، الورد اليومي */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full">
                    {renderNavButtonItem('listen')}
                    {renderNavButtonItem('memorization')}
                    {renderNavButtonItem('daily-wird')}
                </div>
            </div>

            {/* القسم الثاني: العبادات اليومية */}
            <div className="w-full rounded-2xl p-2.5 sm:p-3 relative overflow-hidden flex flex-col gap-2 sm:gap-2.5 transition-all" style={sectionCardStyle}>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full">
                    {renderNavButtonItem('prayer-times')}
                    {renderNavButtonItem('salah-adhkar')}
                    {renderNavButtonItem('qibla')}
                </div>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 w-full">
                    {renderNavButtonItem('sabah-masaa')}
                    {renderNavButtonItem('adia')}
                    {renderNavButtonItem('tasbeeh')}
                    {renderNavButtonItem('others')}
                </div>
            </div>

            {/* القسم الثالث: المكتبة الإسلامية */}
            <div className="w-full rounded-2xl p-2.5 sm:p-3 relative overflow-hidden flex flex-col gap-2.5 transition-all" style={sectionCardStyle}>
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5 w-full">
                    {renderNavButtonItem('prophetic-seerah', 'col-span-3 h-11')}
                    {renderNavButtonItem('ten-promised', 'col-span-3 h-11')}
                    {renderNavButtonItem('hisn-muslim', 'col-span-2 h-11')}
                    {renderNavButtonItem('hajj-umrah', 'col-span-2 h-11')}
                    {renderNavButtonItem('asmaul-husna', 'col-span-2 h-11')}
                </div>
            </div>

            {/* القسم الرابع: خدمات إضافية */}
            <div className="w-full rounded-2xl p-2.5 sm:p-3 relative overflow-hidden flex flex-col gap-2.5 transition-all" style={sectionCardStyle}>
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5 w-full">
                    {renderNavButtonItem('habit-tracker', 'col-span-3 h-11')}
                    {renderNavButtonItem('calculators', 'col-span-3 h-11')}
                    {renderNavButtonItem('nawawi', 'col-span-2 h-11')}
                    {renderNavButtonItem('calendar', 'col-span-2 h-11')}
                    {renderNavButtonItem('islamic-sites', 'col-span-2 h-11')}
                </div>
            </div>

            {/* الصف السفلي: أيقونة الواتساب - زر التحكم الصوتي - أيقونة التفعيل */}
            <div key="bottom-voice-bar" className="w-full h-10 relative mt-1 flex justify-center">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full h-full px-1">
                    <WhatsAppButton />
                    <div className="flex-1 min-w-[130px] max-w-[210px] h-full">
                        <NavButton 
                            label={stripIcons(translateMenuItem('voice-control', 'التحكم الصوتي')) || "التحكم الصوتي"} 
                            icon={<Mic className="w-3.5 h-3.5" />}
                            onClick={() => {
                                if (!isEditMode) {
                                    markPageAsSeen('voice-control');
                                    onNavigate('voice-control');
                                }
                            }} 
                            className="w-full h-full shadow-lg"
                            color={isBlackTheme ? '#000000' : (themeKey === 'default' ? SECTION_2_GREEN : (theme.palette[0] || SECTION_2_GREEN))} 
                            gradient={!isBlackTheme && themeKey === 'default' ? SECTION_2_GRADIENT : undefined}
                            border={buttonBorder} 
                            isEditMode={isEditMode}
                            isGlass={theme.isGlass}
                            btnText="#FFFFFF"
                        />
                    </div>
                    <VoiceControlToggle />
                </div>
            </div>
        </div>
    );
};

export default GridSection;
