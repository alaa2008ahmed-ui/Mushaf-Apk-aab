import React, { useState } from 'react';
import { 
  Moon, 
  Copy, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Check 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface IslamicEventItem {
  name: string;
  dateStr: string;
  gregorianDateStr: string;
  daysRemaining: number;
  isToday: boolean;
}

interface IslamicEventsCardProps {
  events: IslamicEventItem[];
  currentIndex: number;
  onPrevEvent: (e: React.MouseEvent) => void;
  onNextEvent: (e: React.MouseEvent) => void;
  onCopy: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onOpenModal: () => void;
}

export const IslamicEventsCard: React.FC<IslamicEventsCardProps> = ({
  events,
  currentIndex,
  onPrevEvent,
  onNextEvent,
  onCopy,
  onShare,
  onOpenModal,
}) => {
  const { language, isRTL, dir, t, translateEventName, formatNumber } = useLanguage();
  const { theme, themeKey } = useTheme();
  const [copied, setCopied] = useState(false);

  const isBlackTheme = themeKey === 'deep_black' || theme.bgColor === '#000000' || theme.name === 'اسود' || theme.name === 'black';
  const primaryColor = isBlackTheme ? '#10b981' : (theme.palette?.[0] || '#059669');

  const currentEvent = events[currentIndex];
  if (!currentEvent) return null;

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy(e);
  };

  // Remaining days text
  let badgeText = '';
  if (currentEvent.isToday) {
    badgeText = t('islamic_events.today', 'اليوم');
  } else if (currentEvent.daysRemaining > 0) {
    badgeText = language === 'en'
      ? `${formatNumber(currentEvent.daysRemaining)} days remaining`
      : `باقي ${formatNumber(currentEvent.daysRemaining)} يوم`;
  } else {
    badgeText = language === 'en'
      ? `Passed ${formatNumber(Math.abs(currentEvent.daysRemaining))} days ago`
      : `مر عليها ${formatNumber(Math.abs(currentEvent.daysRemaining))} يوم`;
  }

  return (
    <div
      id="islamic-events-card"
      dir={dir}
      onClick={onOpenModal}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenModal();
        }
      }}
      className={`w-full rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg active:scale-[0.99] cursor-pointer relative overflow-hidden select-none flex flex-col gap-3.5 ${
        isBlackTheme ? 'bg-[#18181b] border border-white/10 text-white' : 'bg-white text-slate-800'
      }`}
      style={{
        borderRadius: '16px',
        boxShadow: isBlackTheme
          ? '0 8px 30px -4px rgba(0, 0, 0, 0.7)'
          : '0 8px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
      }}
      title={language === 'en' ? 'Click to view all Islamic events' : 'انقر لعرض قائمة المناسبات الإسلامية كاملة'}
    >
      {/* 1. الترويسة والأدوات (Header & Flat Action Tools) */}
      <div className="flex items-center justify-between w-full">
        {/* عنوان المناسبات الإسلامية مع أيقونة الهلال */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
            style={{
              backgroundColor: isBlackTheme ? 'rgba(16, 185, 129, 0.18)' : `${primaryColor}14`,
              color: primaryColor,
            }}
          >
            <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.2} />
          </div>
          <span className={`text-xs sm:text-sm font-bold tracking-tight font-kufi ${isBlackTheme ? 'text-white' : 'text-slate-800'}`}>
            {t('islamic_events.title', 'المناسبات الإسلامية')}
          </span>
        </div>

        {/* أزرار التنقل والنسخ والمشاركة عالية التباين لسهولة الرؤية (High Contrast Action Icons) */}
        <div className="flex items-center gap-1">
          {/* زر السابق */}
          <button
            type="button"
            onClick={onPrevEvent}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              isBlackTheme
                ? 'text-zinc-200 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-white/5'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300'
            }`}
            title={t('islamic_events.prev', 'المناسبة السابقة')}
            aria-label={t('islamic_events.prev', 'المناسبة السابقة')}
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* زر التالي */}
          <button
            type="button"
            onClick={onNextEvent}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              isBlackTheme
                ? 'text-zinc-200 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-white/5'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300'
            }`}
            title={t('islamic_events.next', 'المناسبة التالية')}
            aria-label={t('islamic_events.next', 'المناسبة التالية')}
          >
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {/* زر النسخ */}
          <button
            type="button"
            onClick={handleCopyClick}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              isBlackTheme
                ? 'text-zinc-200 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-white/5'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300'
            }`}
            title={t('common.copy', 'نسخ')}
            aria-label={t('common.copy', 'نسخ')}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.4} />
            ) : (
              <Copy className="w-4 h-4" strokeWidth={2.2} />
            )}
          </button>

          {/* زر المشاركة */}
          <button
            type="button"
            onClick={onShare}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              isBlackTheme
                ? 'text-zinc-200 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-white/5'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300'
            }`}
            title={t('common.share', 'مشاركة')}
            aria-label={t('common.share', 'مشاركة')}
          >
            <Share2 className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* 2. عداد الأيام (Pill/Badge بحجم أنيق ولون خلفية خفيف لتمييزه) */}
      <div className="flex items-center justify-center w-full">
        <div 
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight transition-colors"
          style={{
            backgroundColor: isBlackTheme ? 'rgba(16, 185, 129, 0.2)' : `${primaryColor}12`,
            color: isBlackTheme ? '#34d399' : primaryColor,
            border: isBlackTheme ? '1px solid rgba(16, 185, 129, 0.3)' : undefined,
          }}
        >
          <span>{badgeText}</span>
        </div>
      </div>

      {/* 3. اسم المناسبة بارز وعريض، وأسفله التاريخ الهجري والميلادي */}
      <div className="flex flex-col items-center justify-center text-center gap-1.5">
        <h4 className={`text-base sm:text-lg font-bold leading-snug font-kufi ${isBlackTheme ? 'text-white' : 'text-slate-800'}`}>
          {translateEventName(currentEvent.name)}
        </h4>

        <div className={`flex items-center justify-center gap-2 text-xs font-medium ${isBlackTheme ? 'text-zinc-400' : 'text-slate-400'}`}>
          <span>{currentEvent.dateStr}</span>
          <span className="opacity-40">·</span>
          <span>{currentEvent.gregorianDateStr}</span>
        </div>
      </div>

      {/* مؤشر تفاعلي ناعم للتفاصيل */}
      <div className="w-full flex items-center justify-end text-[11px] font-semibold pt-0.5">
        <span 
          className="flex items-center gap-1 transition-colors"
          style={{ color: primaryColor }}
        >
          {language === 'en' ? 'View all occasions' : 'عرض كافة المناسبات'}
          {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </span>
      </div>
    </div>
  );
};

export default IslamicEventsCard;
