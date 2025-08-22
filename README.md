# 🌲 숲체험 교육 관리 시스템

React + TypeScript로 구현된 체크리스트, 일정, 연락처 관리 시스템

![React](https://img.shields.io/badge/React-18.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-yellow) ![Tailwind](https://img.shields.io/badge/Tailwind-3.0-cyan)

## ✨ 주요 기능

### 📋 체크리스트 관리
- 5개 주요 섹션 (시설 정보 확인, 프로그램 운영 계획, 비용 및 견적, 식사 및 편의시설, 최종 확인)
- 28개 세부 체크 항목
- 우선순위 설정 (낮음/보통/높음/긴급)
- 메모 및 입력 값 저장
- 실시간 진행률 표시

### 🏢 지역별 관리
- 6개 지역 통합 관리 (창원, 거제도, 오도산, 산청, 거창, 하동)
- 지역별 시설 정보 및 담당자 관리
- 통합된 뷰로 모든 정보를 한 눈에 확인

### 💰 비용 관리
- 프로그램비, 식사비, 입장료, 주차비, 시설이용료, 기타비용
- 자동 총비용 계산
- 지역별 비용 비교

### 📅 일정 관리
- 달력 형태의 직관적인 UI
- 일정 추가/수정/삭제 기능
- 유형별 분류 (현장방문/회의/준비작업/기타)
- 다가오는 일정 미리보기

### 📞 연락처 관리
- 분류별 연락처 관리 (시설담당자/강사/업체담당자/응급연락처/기타)
- 검색 및 필터링 기능
- 클릭으로 즉시 전화/이메일 연결
- 응급연락처 빠른 접근

### 📁 문서 관리
- 파일 업로드 및 관리
- 지역별 문서 분류
- 파일 크기 및 업로드 날짜 표시

### 💾 데이터 관리
- 로컬 스토리지 기반 오프라인 작업
- JSON 형태 백업/복원 기능
- 실시간 자동 저장 (5초마다)

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 브라우저에서 확인
http://localhost:5174

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn/ui, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── auth/           # 인증 관련 컴포넌트
│   ├── contacts/       # 연락처 관리
│   ├── dashboard/      # 대시보드
│   ├── layout/         # 레이아웃 (헤더, 사이드바)
│   ├── region/         # 지역 관리
│   ├── schedule/       # 일정 관리
│   └── ui/            # 재사용 가능한 UI 컴포넌트
├── lib/               # 유틸리티 함수
├── store/             # Zustand 상태 관리
├── App-simple-local.tsx # 로컬 전용 앱 (현재 사용중)
└── main.tsx           # 앱 진입점
```

## 🎯 사용 방법

1. **대시보드**: 모든 지역의 진행률을 한눈에 확인
2. **지역 관리**: 각 지역 클릭하여 상세 정보 관리
3. **체크리스트**: 항목별 입력 및 우선순위 설정
4. **일정 관리**: 달력에서 일정 추가/수정/삭제
5. **연락처**: 담당자별 연락처 관리 및 검색
6. **백업**: 헤더의 백업 버튼으로 데이터 내보내기/가져오기

## 📝 특징

- ✅ **반응형 디자인**: 데스크톱과 모바일 모두 최적화
- ✅ **오프라인 지원**: 인터넷 연결 없이도 작업 가능
- ✅ **실시간 저장**: 입력하는 즉시 자동 저장
- ✅ **직관적 UI**: 사용하기 쉬운 현대적인 인터페이스
- ✅ **데이터 백업**: JSON 파일로 완전한 백업/복원
- ✅ **검색 기능**: 연락처 및 일정 빠른 검색
- ✅ **진행률 추적**: 시각적 진행률 표시

## 📋 체크리스트 항목

### 1. 시설 정보 확인
- 시설명 및 정확한 주소 확인
- 최대 수용 인원 확인
- 시설 사진 및 안내자료 수령
- 입장료/이용료 정확한 금액
- 주차비 유무 및 요금 확인

### 2. 프로그램 운영 계획
- 시간대별 세부 프로그램 확정
- 09:00-16:00 시간별 프로그램 계획
- 조별 운영 계획 수립 (A조/B조)
- 강사 정보 확인 (자격증, 경력)

### 3. 비용 및 견적
- 공식 견적서 수령
- 프로그램 비용 확정
- 식비 확정 (중식, 간식)
- 총 예산 계산 완료

### 4. 식사 및 편의시설
- 급식업체 정보 확인
- 식사 제공 시간 및 장소 확정
- 음식물쓰레기 처리 방법 안내
- 분리수거 방법 안내

### 5. 최종 확인
- 교육기관과 최종 일정 확인
- 당일 긴급 연락체계 구축
- 보험 가입 여부 확인
- 우천시 대체 프로그램 준비

## 🔧 개발

### 추가 스크립트
```bash
# 빌드
npm run build

# 미리보기
npm run preview

# 타입 체크
npm run type-check
```

### 환경 설정
```bash
# .env.example 파일을 .env로 복사
cp .env.example .env

# 필요시 환경변수 설정
```

## 🎨 UI 컴포넌트

### Shadcn/ui 컴포넌트
- Button, Card, Input, Textarea
- Checkbox, Select, Progress
- Tabs (사용 안함 - 통합된 뷰 사용)

### 커스텀 컴포넌트
- LocalDashboard: 지역별 진행률 대시보드
- LocalRegionDetail: 통합된 지역 관리 뷰
- ScheduleManager: 달력 기반 일정 관리
- ContactManager: 연락처 관리 시스템

## 🔒 데이터 보안

### 로컬 저장
- 모든 데이터는 브라우저 LocalStorage에 저장
- 자동 백업 기능으로 데이터 손실 방지
- JSON 형태로 완전한 백업/복원 지원

## 🌐 브라우저 지원

- ✅ Chrome (권장)
- ✅ Edge
- ✅ Safari
- ✅ Firefox

## 📄 라이센스

MIT License

---

## 📞 GitHub 레포지토리 생성 안내

이 프로젝트를 GitHub에 업로드하려면:

1. **GitHub.com에서 새 레포지토리 생성**
   - Repository name: `forest-education-system`
   - Description: `숲체험 교육 관리 시스템 - React + TypeScript로 구현된 체크리스트, 일정, 연락처 관리 시스템`
   - Public 설정

2. **터미널에서 푸시**
```bash
# 현재 디렉토리에서 실행
git remote add origin https://github.com/yourusername/forest-education-system.git
git branch -M main
git push -u origin main
```

모든 파일이 이미 커밋되어 있으니 레포지토리 생성 후 바로 푸시하시면 됩니다!

---

🤖 **Generated with [Claude Code](https://claude.ai/code)**

Co-Authored-By: Claude <noreply@anthropic.com>