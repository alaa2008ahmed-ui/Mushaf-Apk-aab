@echo off
chcp 65001 >nul
title Mushaf Ultimate Fix & Push
echo ==========================================
echo    جاري تنظيف المستودع واعتماد التغييرات
echo ==========================================

:: 1. تهيئة المستودع لو مش موجود
if not exist ".git" (
    git init
    git remote add origin https://github.com/alaa2008ahmed-ui/mushaf-al.git
)

:: 2. سؤال عن اسم التحديث
set /p DEPLOY_NAME="اكتب وصف التحديث (Enter): "

:: 3. المزامنة (اختياري لو بتغير ملفات أندرويد)
echo [1/4] Syncing Capacitor...
call npx cap sync android

:: 4. السطر السحري لاعتماد كل التغييرات (حذف، تعديل، إضافة)
echo [2/4] Staging ALL changes (including deletions)...
git add -A

:: 5. التنفيذ (Commit)
echo [3/4] Committing...
git commit -m "%DEPLOY_NAME%"

:: 6. تصحيح الفرع والرفع الإجباري
echo [4/4] Pushing to GitHub...
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/alaa2008ahmed-ui/mushaf-al.git
git push -u origin main --force

echo ==========================================
echo    تم الرفع بنجاح! جيت هاب بدأ "التصنيع" الآن
echo ==========================================
timeout /t 5
exit