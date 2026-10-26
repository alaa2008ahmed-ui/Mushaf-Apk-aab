import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveBackground from './InteractiveBackground';
import { useLanguage, Language } from '../context/LanguageContext';

interface WelcomeSplashProps {
  onSelectLanguage: (lang: Language) => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onSelectLanguage }) => {
  const { language } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);

  const handleSelect = (lang: Language) => {
    try {
      localStorage.setItem('has_selected_initial_language', 'true');
    } catch (e) {}
    setIsExiting(true);
    setTimeout(() => {
      onSelectLanguage(lang);
    }, 350);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="welcome-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[#F8FAFC] flex flex-col justify-between items-center px-4 py-6 sm:py-8 select-none overflow-hidden"
          dir="rtl"
        >
          {/* Interactive Particle Background from Home Page */}
          <InteractiveBackground className="fixed inset-0 z-0 pointer-events-none opacity-70" />

          {/* Ambient Accent Bokeh Circles (Matching Home Page & image_97ed01c8.png) */}
          <div className="absolute top-12 left-10 w-3 h-3 rounded-full bg-[#1E293B]/70 blur-[0.5px] pointer-events-none" />
          <div className="absolute top-20 right-14 w-4 h-4 rounded-full bg-[#1E293B]/60 blur-[0.5px] pointer-events-none" />
          <div className="absolute top-36 left-8 w-3.5 h-3.5 rounded-full bg-[#A855F7]/80 blur-[0.5px] pointer-events-none" />
          <div className="absolute top-44 left-24 w-2 h-2 rounded-full bg-[#10B981]/70 blur-[0.5px] pointer-events-none" />
          <div className="absolute top-28 left-1/3 w-2.5 h-2.5 rounded-full bg-[#14B8A6]/70 blur-[0.5px] pointer-events-none" />
          <div className="absolute top-52 right-1/4 w-3 h-3 rounded-full bg-[#A855F7]/60 blur-[0.5px] pointer-events-none" />
          <div className="absolute top-64 right-10 w-2.5 h-2.5 rounded-full bg-[#10B981]/60 blur-[0.5px] pointer-events-none" />
          <div className="absolute bottom-40 left-6 w-3 h-3 rounded-full bg-[#A855F7]/80 blur-[0.5px] pointer-events-none" />
          <div className="absolute bottom-28 left-8 w-3.5 h-3.5 rounded-full bg-[#1E293B]/60 blur-[0.5px] pointer-events-none" />
          <div className="absolute bottom-32 right-10 w-3 h-3 rounded-full bg-[#10B981]/70 blur-[0.5px] pointer-events-none" />
          <div className="absolute bottom-24 right-20 w-2.5 h-2.5 rounded-full bg-[#14B8A6]/60 blur-[0.5px] pointer-events-none" />
          <div className="absolute bottom-10 left-1/3 w-2.5 h-2.5 rounded-full bg-[#A855F7]/70 blur-[0.5px] pointer-events-none" />

          {/* Top Basmalah */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative z-10 pt-2 text-center"
          >
            <h1
              className="text-[#1B7A53] font-bold text-xl sm:text-2xl tracking-wide"
              style={{ fontFamily: "'Cairo', 'Amiri', 'Amiri Quran', serif" }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h1>
          </motion.div>

          {/* Center Brand and Language Picker */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-sm px-2">
            {/* App Icon in Crisp White Card with Soft Shadow */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, type: 'spring' }}
              className="relative w-44 h-44 sm:w-52 sm:h-52 bg-white rounded-[2.25rem] sm:rounded-[2.75rem] p-3 shadow-xl shadow-slate-300/60 ring-1 ring-slate-100/80 flex items-center justify-center overflow-hidden"
            >
              {/* Subtle inner highlight border matching the theme */}
              <div className="absolute inset-1.5 rounded-[1.85rem] sm:rounded-[2.35rem] border border-emerald-500/20 pointer-events-none" />
              <img
                src="/app_icon.png"
                alt="مصحف أحمد و ليلى"
                className="w-full h-full object-contain rounded-2xl drop-shadow-sm select-none pointer-events-none"
              />
            </motion.div>

            {/* App Title & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-center mt-5"
            >
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-[#1B7A53] tracking-tight leading-snug"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                مصحف أحمد و ليلى
              </h2>
              <p
                className="text-base sm:text-lg font-bold text-slate-700 mt-0.5 tracking-tight"
                style={{ fontFamily: "'Cairo', 'Inter', sans-serif" }}
              >
                Mushaf Ahmed & Laila
              </p>
            </motion.div>

            {/* Decorative Divider with Central Diamond Accent */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="my-3 sm:my-4 w-44 sm:w-56 flex items-center justify-center gap-2"
            >
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-emerald-400" />
              <div className="w-2 h-2 rotate-45 bg-[#1B7A53] rounded-[1px] shadow-sm" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-emerald-300 to-emerald-400" />
            </motion.div>

            {/* Language Prompt Label */}
            {/* Language Prompt Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              dir="ltr"
              className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-800 text-center tracking-normal mb-3 select-none"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <span className="font-sans">Choose App Language</span>
              <span className="text-slate-400">/</span>
              <span>اختر لغة التطبيق</span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full flex flex-col gap-3"
            >
              {/* Arabic Button */}
              <button
                type="button"
                onClick={() => handleSelect('ar')}
                className="w-full h-14 bg-[#1B7A53] hover:bg-[#156543] active:scale-[0.98] text-white font-bold text-xl rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                العربية
              </button>

              {/* English Button */}
              <button
                type="button"
                onClick={() => handleSelect('en')}
                className="w-full h-14 bg-white hover:bg-emerald-50/50 active:scale-[0.98] text-[#1B7A53] border-2 border-[#1B7A53] font-bold text-xl rounded-2xl shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none"
                style={{ fontFamily: "'Cairo', 'Inter', sans-serif" }}
              >
                English
              </button>
            </motion.div>

            {/* Endowment & Credits directly below English button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-5 text-center flex flex-col items-center select-none w-full"
            >
              {/* النص باللغة العربية أولاً أسفل زر English تماماً */}
              <p
                className="text-sm sm:text-base font-bold text-slate-800 leading-snug"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                وقف خيري لوجه الله تعالى
              </p>
              {/* ثم النص باللغة الإنجليزية أسفله */}
              <p
                className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 leading-snug"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Charitable Endowment for the Sake of Allah
              </p>

              {/* حقوق التصميم والتطوير */}
              <div className="mt-3 flex flex-col items-center">
                <p
                  className="text-xs text-slate-500 font-medium"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  تصميم وتطوير: علاء أحمد
                </p>
                <p
                  className="text-[11px] text-slate-400 mt-0.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Designed & Developed by Alaa Ahmed
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeSplash;
