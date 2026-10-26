import React, { useState } from 'react';
import {
  ScrollText,
  CalendarDays,
  RotateCw,
  Copy,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { HistoricalEventLocalized, formatCalendarNumber } from '../../utils/calendarTranslations';

interface IslamicHistoryMemoryCardProps {
  event: HistoricalEventLocalized;
  onNextEvent: (e: React.MouseEvent) => void;
  onCopy: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onOpenModal: () => void;
}

export const IslamicHistoryMemoryCard: React.FC<IslamicHistoryMemoryCardProps> = ({
  event,
  onNextEvent,
  onCopy,
  onShare,
  onOpenModal,
}) => {
  const { language, isRTL, dir, t } = useLanguage();
  const { theme, themeKey } = useTheme();
  const [isRotating, setIsRotating] = useState(false);
  const [copied, setCopied] = useState(false);

  const isBlackTheme =
    themeKey === 'deep_black' ||
    theme.bgColor === '#000000' ||
    theme.name === 'اسود' ||
    theme.name === 'black';
  const primaryColor = isBlackTheme ? '#10b981' : (theme.palette?.[0] || '#059669');

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
    onNextEvent(e);
  };

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy(e);
  };

  const eventTitle = language === 'en' ? event.titleEn : event.titleAr;
  const eventDescription = language === 'en' ? event.descriptionEn : event.descriptionAr;
  const hijriYear = language === 'en'
    ? event.hijriYearEn
    : formatCalendarNumber(event.hijriYearAr, 'ar');
  const gregorianYear = language === 'en'
    ? event.gregorianYearEn
    : formatCalendarNumber(event.gregorianYearAr, 'ar');

  return (
    <div
      id="islamic-history-memory-card"
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
      title={language === 'en' ? 'Click to view full historical event' : 'انقر لعرض تفاصيل الحدث التاريخي كاملة'}
    >
      {/* 1. الترويسة والأزرار الثلاثة (تحديث - نسخ - مشاركة) */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
            style={{
              backgroundColor: isBlackTheme ? 'rgba(16, 185, 129, 0.18)' : `${primaryColor}14`,
              color: primaryColor,
            }}
          >
            <ScrollText className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.2} />
          </div>
          <span
            className={`text-xs sm:text-sm font-bold tracking-tight font-kufi truncate ${
              isBlackTheme ? 'text-white' : 'text-slate-800'
            }`}
          >
            {language === 'en' ? 'Islamic History Memory' : 'ذاكرة التاريخ الإسلامي'}
          </span>
        </div>

        {/* الأزرار الثلاثة مطابقة للصورة المرفقة */}
        <div className="flex items-center gap-1 shrink-0">
          {/* زر حدث آخر / تحديث */}
          <button
            type="button"
            onClick={handleNextClick}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              isBlackTheme
                ? 'text-zinc-200 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-white/5'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300'
            }`}
            title={language === 'en' ? 'Another Event' : 'حدث آخر'}
            aria-label={language === 'en' ? 'Another Event' : 'حدث آخر'}
          >
            <RotateCw
              className={`w-4 h-4 transition-transform duration-500 ${isRotating ? 'rotate-180' : ''}`}
              strokeWidth={2.2}
            />
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

      {/* 2. عنوان الحدث التاريخي وشريط التاريخ الهجري والميلادي */}
      <div className="flex flex-col gap-2 w-full">
        <h4
          className="text-base sm:text-lg font-black leading-snug font-kufi"
          style={{ color: primaryColor }}
        >
          {eventTitle}
        </h4>

        <div
          className={`w-full py-2 px-3.5 rounded-xl flex items-center justify-between ${
            isBlackTheme
              ? 'bg-zinc-800/80 border border-zinc-700/60 text-zinc-300'
              : 'bg-slate-50 border border-slate-100/80 text-slate-600'
          }`}
        >
          <span className="flex items-center gap-1.5 text-xs font-bold">
            <CalendarDays className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
            <span className={isBlackTheme ? 'text-white' : 'text-slate-800'}>{hijriYear}</span>
          </span>

          <span className="flex items-center gap-1.5 text-xs font-bold">
            <CalendarDays className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
            <span className={isBlackTheme ? 'text-zinc-200' : 'text-slate-700'}>{gregorianYear}</span>
          </span>
        </div>
      </div>

      {/* 3. وصف الحدث التاريخي كما في تبويب محول التاريخ */}
      <div className="w-full">
        <p
          className={`text-[14px] sm:text-[15px] font-normal text-justify leading-[1.85] sm:leading-[1.9] tracking-normal break-words ${
            language === 'ar' ? 'border-r-2 pr-3.5' : 'border-l-2 pl-3.5'
          } ${isBlackTheme ? 'text-zinc-200' : 'text-slate-700'}`}
          style={{
            borderColor: primaryColor,
            wordBreak: 'break-word',
          }}
        >
          {eventDescription}
        </p>
      </div>

      {/* 4. مؤشر عرض التفاصيل */}
      <div className="w-full flex items-center justify-end text-[11px] font-semibold pt-0.5 group">
        <span
          className="flex items-center gap-1 transition-colors"
          style={{ color: primaryColor }}
        >
          {language === 'en' ? 'Read full details' : 'عرض التفاصيل'}
          {isRTL ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </span>
      </div>
    </div>
  );
};

export default IslamicHistoryMemoryCard;
