import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Copy, 
  Share2, 
  Check 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Capacitor } from '@capacitor/core';
import { Share as CapacitorShare } from '@capacitor/share';

interface WebAppCardProps {
  setToastMessage: (msg: string) => void;
}

const WEB_APP_URL = 'https://mushaf-ahmed-laila.vercel.app/';

export const WebAppCard: React.FC<WebAppCardProps> = ({ setToastMessage }) => {
  const { language, dir, t } = useLanguage();
  const { theme, themeKey } = useTheme();
  const [copied, setCopied] = useState(false);

  const isBlackTheme = themeKey === 'deep_black' || theme.bgColor === '#000000' || theme.name === 'اسود' || theme.name === 'black';
  const primaryColor = isBlackTheme ? '#10b981' : (theme.palette?.[0] || '#059669');

  const handleOpenLink = () => {
    window.open(WEB_APP_URL, '_blank');
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(WEB_APP_URL);
      setCopied(true);
      setToastMessage(t('webapp.copied', 'تم نسخ الرابط'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToastMessage(t('common.failed_copy', 'فشل في النسخ'));
    }
  };

  const handleShareLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: language === 'en' ? 'Mushaf Ahmed & Laila Web App' : 'تطبيق مصحف أحمد و ليلى',
      text: language === 'en'
        ? `To open the app on your browser or iPhone, tap the link:\n${WEB_APP_URL}`
        : `لمشاهدة التطبيق على المتصفح أو الآيفون اضغط على الرابط التالي:\n${WEB_APP_URL}`,
      url: WEB_APP_URL
    };

    if (Capacitor.isNativePlatform()) {
      try {
        await CapacitorShare.share(shareData);
      } catch {
        try {
          await navigator.clipboard.writeText(shareData.text);
          setToastMessage(t('webapp.copied', 'تم نسخ الرابط'));
        } catch {}
      }
    } else if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(shareData.text);
            setToastMessage(t('webapp.copied', 'تم نسخ الرابط'));
          } catch {}
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        setToastMessage(t('webapp.copied', 'تم نسخ الرابط'));
      } catch {}
    }
  };

  return (
    <div
      id="web-app-card"
      dir={dir}
      className={`w-full rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden select-none flex flex-col gap-3.5 ${
        isBlackTheme ? 'bg-[#18181b] border border-white/10 text-white' : 'bg-white text-slate-800'
      }`}
      style={{
        borderRadius: '16px',
        boxShadow: isBlackTheme
          ? '0 8px 30px -4px rgba(0, 0, 0, 0.7)'
          : '0 8px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* 1. الترويسة مع أيقونة الكرة الأرضية */}
      <div className="flex items-center gap-2.5 w-full">
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
          style={{
            backgroundColor: isBlackTheme ? 'rgba(16, 185, 129, 0.18)' : `${primaryColor}14`,
            color: primaryColor,
          }}
        >
          <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.2} />
        </div>
        <span className={`text-xs sm:text-sm font-bold tracking-tight font-kufi ${isBlackTheme ? 'text-white' : 'text-slate-800'}`}>
          {t('webapp.title', 'تصفح التطبيق')}
        </span>
      </div>

      {/* 2. النص التوضيحي مع مسافة بادئة مريحة للعين */}
      <p className={`text-[13.5px] sm:text-[14.5px] font-normal leading-relaxed ${isBlackTheme ? 'text-zinc-300' : 'text-slate-600'}`}>
        {t('webapp.desc', 'لمشاهدة التطبيق على المتصفح أو الآيفون، اضغط على الرابط للاستخدام المباشر دون تثبيت.')}
      </p>

      {/* 3. توحيد نمط الأزرار: زر فتح الرابط ممتلئ بلون التطبيق وبجانبه أزرار مسطحة للنسخ والمشاركة */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* زر فتح الرابط الممتلئ (Filled Button) */}
        <button
          type="button"
          onClick={handleOpenLink}
          className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
          style={{
            backgroundColor: isBlackTheme ? '#000000' : primaryColor,
            border: isBlackTheme ? '1px solid rgba(255, 255, 255, 0.25)' : 'none',
            color: '#FFFFFF'
          }}
          title={t('webapp.open', 'فتح الرابط')}
        >
          <span>{t('webapp.open', 'فتح الرابط')}</span>
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* أزرار مسطحة (Flat Icons) داخل دوائر بخلفية رمادية ناعمة */}
        <div className="flex items-center gap-2 shrink-0">
          {/* زر نسخ الرابط */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 ${
              isBlackTheme
                ? 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 border border-white/5'
                : 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800'
            }`}
            title={t('webapp.copy', 'نسخ الرابط')}
            aria-label={t('webapp.copy', 'نسخ الرابط')}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.4} />
            ) : (
              <Copy className="w-4 h-4" strokeWidth={2.2} />
            )}
          </button>

          {/* زر مشاركة الرابط */}
          <button
            type="button"
            onClick={handleShareLink}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 ${
              isBlackTheme
                ? 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 border border-white/5'
                : 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800'
            }`}
            title={t('webapp.share', 'مشاركة الرابط')}
            aria-label={t('webapp.share', 'مشاركة الرابط')}
          >
            <Share2 className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebAppCard;
