#!/bin/bash

echo "숲체험 교육 관리 시스템을 시작합니다..."
echo ""

# Node.js 설치 확인
if ! command -v node &> /dev/null; then
    echo "[오류] Node.js가 설치되지 않았습니다."
    echo "https://nodejs.org/ 에서 LTS 버전을 다운로드하여 설치해주세요."
    exit 1
fi

# npm 설치 확인
if ! command -v npm &> /dev/null; then
    echo "[오류] npm이 설치되지 않았습니다."
    echo "Node.js를 재설치해주세요."
    exit 1
fi

echo "Node.js 버전: $(node --version)"
echo "npm 버전: $(npm --version)"
echo ""

# node_modules 폴더 확인
if [ ! -d "node_modules" ]; then
    echo "의존성 패키지를 설치합니다..."
    echo "잠시 기다려주세요 (5-10분 소요)..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[오류] 패키지 설치에 실패했습니다."
        exit 1
    fi
    echo ""
    echo "패키지 설치가 완료되었습니다!"
    echo ""
fi

echo "개발 서버를 시작합니다..."
echo "브라우저가 자동으로 열립니다."
echo "종료하려면 Ctrl+C를 누르세요."
echo ""
npm run dev