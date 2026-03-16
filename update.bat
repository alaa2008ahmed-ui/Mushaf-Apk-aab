@echo off
chcp 65001 >nul
title Mushaf Ultimate Repair & Push
echo ==========================================
echo    جاري فحص المستودع والرفع لـ GitHub
echo ==========================================

:: 1. فحص هل المجلد متعرف كـ Git ولا لأ
if not exist ".git" (
    echo [!] المجلد مش متعرف كـ Git.. جاري الإصلاح الآن
    git init
    git remote add origin https://github.com/alaa2008ahmed-ui/mushaf-al.git
)

:: 2. سؤال عن اسم التحديث
set /p DEPLOY_NAME="اكتب وصف للتحديث (Enter): "

:: 3. تحديث البيانات (Sync)
echo [1/3] Syncing new files to Android...
call npx cap sync android

:: 4. الرفع لـ GitHub
echo [2/3] Adding changes...
git add .
git commit -m "%DEPLOY_NAME%"

echo [3/3] Pushing to GitHub...
:: التأكد من الرابط للمرة الأخيرة
git remote remove origin >nul 2>&1
git remote add origin https://github.com/alaa2008ahmed-ui/mushaf-al.git
git push -u origin main --force

echo ==========================================
echo    تم الرفع بنجاح! جيت هاب هيبدأ "التصنيع"
echo ==========================================
timeout /t 5
exit