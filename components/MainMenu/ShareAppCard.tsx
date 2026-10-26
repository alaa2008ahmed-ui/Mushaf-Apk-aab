import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  HeartHandshake 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Capacitor } from '@capacitor/core';
import { Share as CapacitorShare } from '@capacitor/share';

interface ShareAppCardProps {
  shareTextAr: string;
  shareTextEn: string;
  setToastMessage: (msg: string) => void;
}

export const ShareAppCard: React.FC<ShareAppCardProps> = ({
  shareTextAr,
  shareTextEn,
  setToastMessage,
}) => {
  const { language, dir, t } = useLanguage();
  const { theme, themeKey } = useTheme();
  const [copied, setCopied] = useState(false);

  const isBlackTheme = themeKey === 'deep_black' || theme.bgColor === '#000000' || theme.name === 'اسود' || theme.name === 'black';
  const primaryColor = isBlackTheme ? '#10b981' : (theme.palette?.[0] || '#059669');

  const textToShare = language === 'en' ? shareTextEn : shareTextAr;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setToastMessage(t('app_share.copied', 'تم نسخ نص المشاركة بنجاح'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToastMessage(t('common.failed_copy', 'فشل في النسخ'));
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: t('app.name', 'مصحف أحمد و ليلى'),
      text: textToShare,
    };

    if (Capacitor.isNativePlatform()) {
      try {
        await CapacitorShare.share(shareData);
      } catch {
        try {
          await navigator.clipboard.writeText(textToShare);
          setToastMessage(t('app_share.copied', 'تم نسخ نص المشاركة'));
        } catch {}
      }
    } else if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(textToShare);
            setToastMessage(t('app_share.copied', 'تم نسخ نص المشاركة'));
          } catch {}
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(textToShare);
        setToastMessage(t('app_share.copied', 'تم نسخ نص المشاركة'));
      } catch {}
    }
  };

  return (
    <div
      id="share-app-card"
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
      {/* 1. الترويسة مع أيقونة المشاركة/العطاء */}
      <div className="flex items-center gap-2.5 w-full">
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
          style={{
            backgroundColor: isBlackTheme ? 'rgba(16, 185, 129, 0.18)' : `${primaryColor}14`,
            color: primaryColor,
          }}
        >
          <HeartHandshake className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.2} />
        </div>
        <span className={`text-xs sm:text-sm font-bold tracking-tight font-kufi ${isBlackTheme ? 'text-white' : 'text-slate-800'}`}>
          {t('app_share.title', 'شارك التطبيق')}
        </span>
      </div>

      {/* 2. النص التشجيعي في المنتصف وبخط مريح ومسافات متوازنة */}
      <p className={`text-[13.5px] sm:text-[14.5px] font-normal leading-relaxed text-center px-1 sm:px-3 ${isBlackTheme ? 'text-zinc-300' : 'text-slate-600'}`}>
        {t(
          'app_share.desc',
          'إذا أعجبك التطبيق، شاركه مع عائلتك وأحبابك ليكون لك الأجر ولمن تحب بإذن الله؛ فالدال على الخير كفاعله 🤲'
        )}
      </p>

      {/* 3. أزرار المشاركة والنسخ السفلية مكبرة قليلاً ومتوسطة لتشجيع التفاعل السريع */}
      <div className="flex items-center justify-center gap-3 pt-1 w-full max-w-xs mx-auto">
        {/* زر المشاركة الرئيسي */}
        <button
          type="button"
          onClick={handleShareApp}
          className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
          style={{
            backgroundColor: isBlackTheme ? '#000000' : primaryColor,
            border: isBlackTheme ? '1px solid rgba(255, 255, 255, 0.25)' : 'none',
            color: '#FFFFFF'
          }}
          title={t('common.share', 'مشاركة')}
        >
          <Share2 className="w-4 h-4" />
          <span>{t('common.share', 'مشاركة')}</span>
        </button>

        {/* زر نسخ النص */}
        <button
          type="button"
          onClick={handleCopyText}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer ${
            isBlackTheme
              ? 'text-zinc-200 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-white/5'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300'
          }`}
          title={t('common.copy', 'نسخ النص')}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.4} />
              <span className={`font-bold ${isBlackTheme ? 'text-emerald-400' : 'text-emerald-700'}`}>{language === 'en' ? 'Copied' : 'تم النسخ'}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" strokeWidth={2.2} />
              <span>{t('common.copy', 'نسخ')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareAppCard;
