import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { AutoSilentMode } from './silentMode';

export interface WidgetData {
  hijri: string;
  gregorian: string;
  day: string;
  city: string;
  next_prayer_name: string;
  next_prayer_id: string;
  remaining_time: string;
  target_time_millis?: number;
  base_date_millis?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  method_id?: number;
  prayer_offsets?: Record<string, number>;
  isSummerTime?: boolean;
  midnight: string;
  last_third: string;
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  times_24h?: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  timestamps?: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
    nextFajr: number;
    nextSunrise: number;
    nextDhuhr: number;
    nextAsr: number;
    nextMaghrib: number;
    nextIsha: number;
  };
  theme?: {
    isDark?: boolean;
    themeKey?: string;
    primaryColor?: string;
    secondaryColor?: string;
    bgColor?: string;
    textColor?: string;
  } | null;
  app_language?: string;
}

/**
 * Updates the Android App Widgets (Full & Compact) with the latest prayer times data.
 * This function stores the data in Capacitor's default SharedPreferences
 * and sends an immediate native broadcast/plugin call to update all widgets instantly.
 */
export const updateAndroidWidget = async (data: WidgetData, syncTheme: boolean = true) => {
  if (Capacitor.getPlatform() !== 'android') return;

  try {
    const appLang = data.app_language || (typeof window !== 'undefined' ? localStorage.getItem('app_language') : null) || 'ar';
    const isDark = (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) || false;

    const finalData = {
      ...data,
      base_date_millis: data.base_date_millis || Date.now(),
      app_language: appLang,
      theme: {
        isDark: data.theme?.isDark !== undefined ? data.theme.isDark : isDark,
        themeKey: data.theme?.themeKey || (isDark ? 'dark' : 'emerald'),
        primaryColor: data.theme?.primaryColor || '#10b981',
        secondaryColor: data.theme?.secondaryColor || '#7c3aed',
        bgColor: isDark ? '#0F172A' : '#FFFFFF',
        textColor: isDark ? '#FFFFFF' : '#0F172A'
      }
    };

    // Store in CapacitorStorage for native access
    await Preferences.set({
      key: 'widget_prayer_data',
      value: JSON.stringify(finalData)
    });

    // Also persist app_language directly
    await Preferences.set({
      key: 'app_language',
      value: appLang
    });

    // Immediate native update: triggers PrayerWidgetProvider, PrayerCompactWidgetProvider, & PersistentPrayerNotification
    try {
      if (AutoSilentMode && typeof AutoSilentMode.updateWidget === 'function') {
        await AutoSilentMode.updateWidget();
      }
    } catch (pluginErr) {
      console.warn('Native updateWidget call failed, fallback will handle it:', pluginErr);
    }

    // Also refresh native persistent notification
    try {
      const { updateNativePersistentNotification } = await import('./silentMode');
      await updateNativePersistentNotification();
    } catch (e) {
      console.warn('Could not update persistent notification:', e);
    }

    console.log('Android Widgets (Full & Compact) and Notification updated successfully');
  } catch (error) {
    console.error('Failed to update Android Widget data:', error);
  }
};

/**
 * Synchronizes the home screen theme colors directly to all Android home screen widgets in real time.
 */
export const syncWidgetThemeColors = async (themeKey: string, theme: any) => {
  if (Capacitor.getPlatform() !== 'android') return;

  try {
    const rawData = await Preferences.get({ key: 'widget_prayer_data' });
    if (!rawData.value) return;

    const parsed = JSON.parse(rawData.value);
    const isDark = theme.isDark ?? false;
    const primaryColor = theme.palette?.[0] || theme.accent || '#10b981';
    const secondaryColor = theme.palette?.[1] || theme.palette?.[0] || '#7c3aed';
    const bgColor = theme.bgColor || (isDark ? '#0F172A' : '#FFFFFF');
    const textColor = theme.textColor || (isDark ? '#FFFFFF' : '#0F172A');
    const cardBg = theme.cardBg || (isDark ? '#1E293B' : '#FFFFFF');
    const cardBorder = theme.cardBorder || (isDark ? '#334155' : '#E2E8F0');

    parsed.theme = {
      isDark,
      themeKey,
      primaryColor,
      secondaryColor,
      bgColor,
      textColor,
      cardBg,
      cardBorder
    };

    await Preferences.set({
      key: 'widget_prayer_data',
      value: JSON.stringify(parsed)
    });

    if (AutoSilentMode && typeof AutoSilentMode.updateWidget === 'function') {
      await AutoSilentMode.updateWidget();
    }
    console.log('Real-time widget theme sync completed:', themeKey);
  } catch (e) {
    console.warn('Failed to sync widget theme colors:', e);
  }
};
