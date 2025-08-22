@echo off
title 숲체험 교육 관리 시스템 서버

echo ================================================
echo     숲체험 교육 관리 시스템 서버 시작
echo ================================================
echo.

cd /d "C:\Users\user\working\sup"

echo 현재 위치: %CD%
echo.

if not exist node_modules (
    echo [!] node_modules 폴더가 없습니다.
    echo.
    echo 패키지를 설치합니다... (5-10분 소요)
    call npm install
    echo.
)

echo 서버를 시작합니다...
echo.
echo [브라우저에서 http://localhost:5173 접속]
echo.
echo 종료하려면 Ctrl+C를 누르고 Y를 입력하세요.
echo ================================================
echo.

npm run dev

pause