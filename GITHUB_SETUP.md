# GitHub 레포지토리 설정 가이드

## 레포지토리가 준비되었습니다! 🎉

모든 파일이 Git에 커밋되었습니다. 이제 GitHub에 업로드하려면:

## 1단계: GitHub.com에서 레포지토리 생성

1. https://github.com/new 접속
2. Repository name: `forest-education-system`
3. Description: `숲체험 교육 관리 시스템 - React + TypeScript로 구현된 체크리스트, 일정, 연락처 관리 시스템`
4. **Public** 선택
5. **⚠️ 중요: README, .gitignore, license를 추가하지 마세요** (이미 프로젝트에 있음)
6. "Create repository" 클릭

## 2단계: 터미널에서 푸시 실행

GitHub에서 레포지토리 생성 후, 다음 명령어들을 실행하세요:

```bash
cd "C:\Users\user\working\sup"

# GitHub에서 제공한 URL로 변경 (예시)
git remote add origin https://github.com/yourusername/forest-education-system.git

# 푸시 실행
git branch -M main
git push -u origin main
```

## 커밋된 내용 요약

**총 52개 파일 커밋됨:**

### 🎯 주요 기능
- ✅ 6개 지역 관리 (창원, 거제도, 오도산, 산청, 거창, 하동)  
- ✅ 체크리스트 시스템 (5개 섹션, 28개 항목)
- ✅ 비용 관리 (프로그램비, 식사비, 입장료, 주차비, 시설이용료, 기타)
- ✅ 일정 관리 (달력 형태, 수정/삭제 기능)
- ✅ 연락처 관리 (분류별, 검색 기능)
- ✅ 문서 업로드/관리
- ✅ 로컬 스토리지 기반 데이터 저장
- ✅ 백업/복원 기능

### 🛠️ 기술 스택
- React 18 + TypeScript + Vite
- Tailwind CSS + Shadcn/ui
- Zustand (상태관리)
- React Router (라우팅)
- 로컬 스토리지 (데이터 저장)

### 📁 파일 구조
```
src/
├── components/
│   ├── auth/         # 인증 컴포넌트
│   ├── contacts/     # 연락처 관리
│   ├── dashboard/    # 대시보드
│   ├── layout/       # 레이아웃
│   ├── region/       # 지역 관리
│   ├── schedule/     # 일정 관리
│   └── ui/          # UI 컴포넌트
├── lib/             # 유틸리티
└── store/           # 상태 관리
```

## 실행 방법

```bash
npm install
npm run dev
```

애플리케이션이 http://localhost:5174 에서 실행됩니다.