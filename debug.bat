@echo off
echo ========================================
echo 디버그 정보
echo ========================================
echo.

echo [Node.js 버전]
node --version
echo.

echo [npm 버전]
npm --version
echo.

echo [현재 디렉토리]
cd
echo.

echo [폴더 내용]
dir /b
echo.

echo [node_modules 존재 여부]
if exist node_modules (
    echo node_modules 폴더가 존재합니다.
) else (
    echo node_modules 폴더가 없습니다. npm install을 실행하세요.
)
echo.

echo [package.json 존재 여부]
if exist package.json (
    echo package.json 파일이 존재합니다.
) else (
    echo package.json 파일이 없습니다.
)
echo.

echo ========================================
echo npm run dev 실행 시도
echo ========================================
npm run dev

pause