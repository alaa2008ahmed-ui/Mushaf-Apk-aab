package com.mushaf.ahmedandlayla;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.widget.RemoteViews;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.Date;

public class PrayerCardWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (intent == null) return;
        String action = intent.getAction();
        if (action == null) return;

        if (AppWidgetManager.ACTION_APPWIDGET_UPDATE.equals(action) ||
            "com.mushaf.ahmedandlayla.ACTION_REFRESH_WIDGET".equals(action) ||
            Intent.ACTION_BOOT_COMPLETED.equals(action) ||
            Intent.ACTION_TIME_CHANGED.equals(action) ||
            Intent.ACTION_TIMEZONE_CHANGED.equals(action) ||
            Intent.ACTION_DATE_CHANGED.equals(action)) {
            updateAllWidgets(context);
        }
    }

    public static void updateAllWidgets(Context context) {
        if (context == null) return;
        try {
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            ComponentName componentName = new ComponentName(context, PrayerCardWidgetProvider.class);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(componentName);
            if (appWidgetIds != null && appWidgetIds.length > 0) {
                for (int appWidgetId : appWidgetIds) {
                    updateAppWidget(context, appWidgetManager, appWidgetId);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String prayerJson = prefs.getString("widget_prayer_data", null);

        String appLang = prefs.getString("app_language", null);
        if (appLang == null && prayerJson != null) {
            try {
                JSONObject d = new JSONObject(prayerJson);
                appLang = d.optString("app_language", null);
            } catch (Exception ignored) {}
        }
        if (appLang == null || appLang.trim().isEmpty()) {
            appLang = java.util.Locale.getDefault().getLanguage();
        }
        boolean isArabic = !"en".equalsIgnoreCase(appLang);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.prayer_card_widget);

        // Deep linking: Tap card opens Prayer Times
        Intent prayerIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("com.mushaf.ahmedandlayla://prayer-times"));
        prayerIntent.setClass(context, MainActivity.class);
        prayerIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent rootPending = PendingIntent.getActivity(
                context, 901, prayerIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_card_root, rootPending);

        if (prayerJson != null && !prayerJson.trim().isEmpty()) {
            try {
                JSONObject data = new JSONObject(prayerJson);
                String city = data.optString("city", "");
                views.setTextViewText(R.id.widget_card_city, PrayerWidgetProvider.formatNumerals(city, isArabic));

                long now = System.currentTimeMillis();
                long targetTimeMillis = 0;
                String nextPrayerId = data.optString("next_prayer_id", "");
                String nextPrayerName = data.optString("next_prayer_name", "");
                String nextPrayerTimeStr = "";

                // Autonomous date advancement check
                long baseDateMillis = data.optLong("base_date_millis", 0);
                Calendar nowCal = Calendar.getInstance();
                Calendar baseCal = Calendar.getInstance();
                if (baseDateMillis > 0) baseCal.setTimeInMillis(baseDateMillis);

                boolean dateElapsed = baseDateMillis > 0 &&
                        (nowCal.get(Calendar.DAY_OF_YEAR) != baseCal.get(Calendar.DAY_OF_YEAR) ||
                         nowCal.get(Calendar.YEAR) != baseCal.get(Calendar.YEAR));

                if (dateElapsed && data.has("coordinates")) {
                    JSONObject coords = data.getJSONObject("coordinates");
                    double lat = coords.optDouble("lat", 0.0);
                    double lng = coords.optDouble("lng", 0.0);
                    int methodId = data.optInt("method_id", 3);

                    int[] offsets = new int[6];
                    if (data.has("prayer_offsets")) {
                        JSONObject offObj = data.getJSONObject("prayer_offsets");
                        offsets[0] = offObj.optInt("Fajr", 0);
                        offsets[1] = offObj.optInt("Sunrise", 0);
                        offsets[2] = offObj.optInt("Dhuhr", 0);
                        offsets[3] = offObj.optInt("Asr", 0);
                        offsets[4] = offObj.optInt("Maghrib", 0);
                        offsets[5] = offObj.optInt("Isha", 0);
                    }

                    PrayerCalculationEngine.PrayerResult autoRes = PrayerCalculationEngine.calculate(
                            new Date(), lat, lng, methodId, false, offsets, isArabic,
                            baseDateMillis, data.optString("hijri", ""), data.optString("gregorian", "")
                    );

                    views.setTextViewText(R.id.card_time_fajr, PrayerWidgetProvider.formatNumerals(autoRes.fajr, isArabic));
                    views.setTextViewText(R.id.card_time_sunrise, PrayerWidgetProvider.formatNumerals(autoRes.sunrise, isArabic));
                    views.setTextViewText(R.id.card_time_dhuhr, PrayerWidgetProvider.formatNumerals(autoRes.dhuhr, isArabic));
                    views.setTextViewText(R.id.card_time_asr, PrayerWidgetProvider.formatNumerals(autoRes.asr, isArabic));
                    views.setTextViewText(R.id.card_time_maghrib, PrayerWidgetProvider.formatNumerals(autoRes.maghrib, isArabic));
                    views.setTextViewText(R.id.card_time_isha, PrayerWidgetProvider.formatNumerals(autoRes.isha, isArabic));

                    views.setTextViewText(R.id.widget_card_date, PrayerWidgetProvider.formatNumerals(autoRes.hijriDate, isArabic));

                    long[] autoTimes = {autoRes.fajrMillis, autoRes.sunriseMillis, autoRes.dhuhrMillis, autoRes.asrMillis, autoRes.maghribMillis, autoRes.ishaMillis};
                    String[] autoIds = {"fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"};
                    String[] autoNamesAr = {"الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"};
                    String[] autoNamesEn = {"Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"};
                    String[] autoNames = isArabic ? autoNamesAr : autoNamesEn;
                    String[] autoStrings = {autoRes.fajr, autoRes.sunrise, autoRes.dhuhr, autoRes.asr, autoRes.maghrib, autoRes.isha};

                    for (int i = 0; i < autoTimes.length; i++) {
                        if (autoTimes[i] > now) {
                            targetTimeMillis = autoTimes[i];
                            nextPrayerId = autoIds[i];
                            nextPrayerName = autoNames[i];
                            nextPrayerTimeStr = autoStrings[i];
                            break;
                        }
                    }

                    if (targetTimeMillis == 0) {
                        Calendar tomCal = Calendar.getInstance();
                        tomCal.add(Calendar.DAY_OF_YEAR, 1);
                        PrayerCalculationEngine.PrayerResult tomRes = PrayerCalculationEngine.calculate(
                                tomCal.getTime(), lat, lng, methodId, false, offsets, isArabic,
                                baseDateMillis, data.optString("hijri", ""), data.optString("gregorian", "")
                        );
                        targetTimeMillis = tomRes.fajrMillis;
                        nextPrayerId = "fajr";
                        nextPrayerName = isArabic ? "الفجر" : "Fajr";
                        nextPrayerTimeStr = tomRes.fajr;
                    }

                } else {
                    // Cached data flow
                    views.setTextViewText(R.id.widget_card_date, PrayerWidgetProvider.formatNumerals(PrayerWidgetProvider.translate(data.optString("hijri", ""), isArabic), isArabic));

                    JSONObject times = data.optJSONObject("times");
                    if (times != null) {
                        views.setTextViewText(R.id.card_time_fajr, PrayerWidgetProvider.formatNumerals(times.optString("fajr", ""), isArabic));
                        views.setTextViewText(R.id.card_time_sunrise, PrayerWidgetProvider.formatNumerals(times.optString("sunrise", ""), isArabic));
                        views.setTextViewText(R.id.card_time_dhuhr, PrayerWidgetProvider.formatNumerals(times.optString("dhuhr", ""), isArabic));
                        views.setTextViewText(R.id.card_time_asr, PrayerWidgetProvider.formatNumerals(times.optString("asr", ""), isArabic));
                        views.setTextViewText(R.id.card_time_maghrib, PrayerWidgetProvider.formatNumerals(times.optString("maghrib", ""), isArabic));
                        views.setTextViewText(R.id.card_time_isha, PrayerWidgetProvider.formatNumerals(times.optString("isha", ""), isArabic));
                    }

                    if (data.has("timestamps") && !data.isNull("timestamps")) {
                        JSONObject timestamps = data.getJSONObject("timestamps");
                        String[] pIds = {"fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "nextFajr", "nextSunrise", "nextDhuhr", "nextAsr", "nextMaghrib", "nextIsha"};
                        String[] namesAr = {"الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء", "الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"};
                        String[] namesEn = {"Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"};
                        String[] names = isArabic ? namesAr : namesEn;

                        for (int i = 0; i < pIds.length; i++) {
                            if (timestamps.has(pIds[i])) {
                                long pTime = timestamps.getLong(pIds[i]);
                                if (pTime > now) {
                                    targetTimeMillis = pTime;
                                    String id = pIds[i].startsWith("next") ? pIds[i].substring(4).toLowerCase() : pIds[i];
                                    nextPrayerId = id;
                                    nextPrayerName = names[i];
                                    if (times != null && times.has(id)) {
                                        nextPrayerTimeStr = times.getString(id);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }

                // Header Labels
                views.setTextViewText(R.id.card_name_fajr, isArabic ? "فجر" : "Fajr");
                views.setTextViewText(R.id.card_name_sunrise, isArabic ? "شروق" : "Sun");
                views.setTextViewText(R.id.card_name_dhuhr, isArabic ? "ظهر" : "Dhuhr");
                views.setTextViewText(R.id.card_name_asr, isArabic ? "عصر" : "Asr");
                views.setTextViewText(R.id.card_name_maghrib, isArabic ? "مغرب" : "Maghrib");
                views.setTextViewText(R.id.card_name_isha, isArabic ? "عشاء" : "Isha");

                String heroLabel = isArabic ? ("صلاة " + nextPrayerName + " بعد") : (nextPrayerName + " in");
                views.setTextViewText(R.id.widget_card_prayer_name, heroLabel);

                if (!nextPrayerTimeStr.isEmpty()) {
                    String timeLabel = isArabic ? ("الأذان : " + nextPrayerTimeStr) : ("Adhan : " + nextPrayerTimeStr);
                    views.setTextViewText(R.id.widget_card_prayer_time, PrayerWidgetProvider.formatNumerals(timeLabel, isArabic));
                }

                // Countdown Chronometer
                if (targetTimeMillis > 0) {
                    long remainingMillis = targetTimeMillis - now;
                    if (remainingMillis <= 0) {
                        views.setChronometer(R.id.widget_card_countdown, android.os.SystemClock.elapsedRealtime(), "00:00:00", false);
                    } else {
                        long base = android.os.SystemClock.elapsedRealtime() + remainingMillis;
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                            views.setBoolean(R.id.widget_card_countdown, "setCountDown", true);
                        }
                        views.setChronometer(R.id.widget_card_countdown, base, "%s", true);

                        Intent updateIntent = new Intent(context, PrayerCardWidgetProvider.class);
                        updateIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
                        updateIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, new int[]{appWidgetId});
                        PendingIntent pendingUpdate = PendingIntent.getBroadcast(
                                context, appWidgetId + 3000, updateIntent,
                                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                        );
                        scheduleSafeAlarm(context, targetTimeMillis + 1000, pendingUpdate);
                    }
                }

                // Theme styling
                boolean isDark = false;
                int primaryColor = Color.parseColor("#10B981");
                int secondaryColor = Color.parseColor("#0F172A");
                int textColor = Color.parseColor("#0F172A");

                if (data.has("theme") && !data.isNull("theme")) {
                    JSONObject themeObj = data.getJSONObject("theme");
                    isDark = themeObj.optBoolean("isDark", false);

                    if (themeObj.has("primaryColor")) {
                        try {
                            primaryColor = Color.parseColor(themeObj.getString("primaryColor"));
                        } catch (Exception ignored) {}
                    }
                    if (themeObj.has("secondaryColor")) {
                        try {
                            secondaryColor = Color.parseColor(themeObj.getString("secondaryColor"));
                        } catch (Exception ignored) {}
                    }
                    if (themeObj.has("textColor")) {
                        try {
                            textColor = Color.parseColor(themeObj.getString("textColor"));
                        } catch (Exception ignored) {}
                    }
                    if (themeObj.has("cardBg")) {
                        try {
                            int customCardBg = Color.parseColor(themeObj.getString("cardBg"));
                            if (customCardBg != Color.WHITE) {
                                views.setInt(R.id.widget_card_root, "setBackgroundColor", customCardBg);
                            }
                        } catch (Exception ignored) {}
                    }
                }

                if (isDark) {
                    views.setTextColor(R.id.widget_card_city, Color.parseColor("#E2E8F0"));
                    views.setTextColor(R.id.widget_card_date, Color.parseColor("#94A3B8"));
                    views.setInt(R.id.widget_card_hero, "setBackgroundColor", Color.parseColor("#0F172A"));
                    if (textColor == Color.parseColor("#0F172A")) {
                        textColor = Color.WHITE;
                    }
                } else {
                    views.setTextColor(R.id.widget_card_city, Color.parseColor("#334155"));
                    views.setTextColor(R.id.widget_card_date, Color.parseColor("#64748B"));
                    views.setInt(R.id.widget_card_hero, "setBackgroundColor", secondaryColor);
                }

                views.setTextColor(R.id.widget_card_prayer_name, primaryColor);

                // Prayer strip text colors
                views.setTextColor(R.id.card_name_fajr, textColor);
                views.setTextColor(R.id.card_time_fajr, textColor);
                views.setTextColor(R.id.card_name_sunrise, textColor);
                views.setTextColor(R.id.card_time_sunrise, textColor);
                views.setTextColor(R.id.card_name_dhuhr, textColor);
                views.setTextColor(R.id.card_time_dhuhr, textColor);
                views.setTextColor(R.id.card_name_asr, textColor);
                views.setTextColor(R.id.card_time_asr, textColor);
                views.setTextColor(R.id.card_name_maghrib, textColor);
                views.setTextColor(R.id.card_time_maghrib, textColor);
                views.setTextColor(R.id.card_name_isha, textColor);
                views.setTextColor(R.id.card_time_isha, textColor);

                // Highlight next prayer in strip
                if ("fajr".equalsIgnoreCase(nextPrayerId)) {
                    views.setTextColor(R.id.card_name_fajr, primaryColor);
                    views.setTextColor(R.id.card_time_fajr, primaryColor);
                } else if ("sunrise".equalsIgnoreCase(nextPrayerId)) {
                    views.setTextColor(R.id.card_name_sunrise, primaryColor);
                    views.setTextColor(R.id.card_time_sunrise, primaryColor);
                } else if ("dhuhr".equalsIgnoreCase(nextPrayerId)) {
                    views.setTextColor(R.id.card_name_dhuhr, primaryColor);
                    views.setTextColor(R.id.card_time_dhuhr, primaryColor);
                } else if ("asr".equalsIgnoreCase(nextPrayerId)) {
                    views.setTextColor(R.id.card_name_asr, primaryColor);
                    views.setTextColor(R.id.card_time_asr, primaryColor);
                } else if ("maghrib".equalsIgnoreCase(nextPrayerId)) {
                    views.setTextColor(R.id.card_name_maghrib, primaryColor);
                    views.setTextColor(R.id.card_time_maghrib, primaryColor);
                } else if ("isha".equalsIgnoreCase(nextPrayerId)) {
                    views.setTextColor(R.id.card_name_isha, primaryColor);
                    views.setTextColor(R.id.card_time_isha, primaryColor);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private static void scheduleSafeAlarm(Context context, long triggerMillis, PendingIntent pendingIntent) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC, triggerMillis, pendingIntent);
                } else {
                    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC, triggerMillis, pendingIntent);
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC, triggerMillis, pendingIntent);
            } else {
                alarmManager.set(AlarmManager.RTC, triggerMillis, pendingIntent);
            }
        } catch (Exception ignored) {}
    }
}
