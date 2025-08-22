@echo off
echo =============================================
echo GitHub 레포지토리 푸시 스크립트
echo =============================================
echo.

echo 1단계: GitHub.com에서 레포지토리를 생성하세요
echo - URL: https://github.com/new
echo - Repository name: forest-education-system
echo - Description: 숲체험 교육 관리 시스템 - React + TypeScript로 구현된 체크리스트, 일정, 연락처 관리 시스템
echo - Public으로 설정
echo - README, .gitignore, license 추가하지 마세요 (이미 있음)
echo.

set /p github_username="GitHub 사용자명을 입력하세요: "

echo.
echo 2단계: 원격 저장소 설정 중...
git remote remove origin 2>nul
git remote add origin https://github.com/%github_username%/forest-education-system.git

echo.
echo 3단계: 브랜치를 main으로 변경...
git branch -M main

echo.
echo 4단계: GitHub에 푸시 중...
git push -u origin main

echo.
echo =============================================
echo 푸시 완료! 
echo GitHub URL: https://github.com/%github_username%/forest-education-system
echo =============================================

pause