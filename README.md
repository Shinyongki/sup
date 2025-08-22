# 숲체험 교육 체크리스트 관리 시스템

노인맞춤돌봄서비스 숲문화체험 교육 담당자를 위한 React + Shadcn/ui 기반 웹 애플리케이션입니다.

## 🌟 주요 기능

### ✅ 체크리스트 관리
- 6개 지역별 상세 체크리스트
- 각 항목에 입력란, 메모, 우선순위 설정
- 실시간 진행률 추적
- 시설정보, 프로그램계획, 비용견적, 편의시설, 최종확인 섹션

### 📊 대시보드
- 전체 진행률 및 통계
- 지역별 진행 상황 카드
- 긴급 확인 필요 항목 알림

### 💰 비용 관리
- 지역별 비용 비교표
- 프로그램비, 식비, 시설이용료, 기타 비용 추적

### 📁 문서 관리
- 지역별 문서 업로드 및 관리
- 클라우드 스토리지 지원

### 📞 연락처 관리
- 각 지역 시설 및 담당자 정보
- 빠른 전화/이메일 연결

### 📊 보고서 생성
- 교육계획서, 체크리스트 현황, 비용내역 자동 생성

## 🚀 설치 및 실행

### 개발 환경 설정
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 환경 설정
1. `.env.example` 파일을 `.env`로 복사
2. Supabase 설정 정보 입력

### 클라우드 모드 (Supabase)

#### 1. Supabase 프로젝트 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. Project Settings > API에서 URL과 anon key 확인
3. SQL Editor에서 `supabase-setup.sql` 실행

#### 2. 설정 파일 수정
`supabase-config.js` 파일을 열어 다음 정보 입력:
```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project.supabase.co',  // 여기에 프로젝트 URL
    anonKey: 'your-anon-key',                 // 여기에 anon key
    storageBucket: 'forest-education-files'
};
```

#### 3. 스토리지 버킷 생성
1. Supabase Dashboard > Storage
2. 새 버킷 생성: `forest-education-files`
3. 공개 설정 및 파일 업로드 권한 설정

#### 4. 앱 실행
1. `index.html` 파일을 브라우저에서 열기
2. 우상단 "클라우드 연동" 버튼 클릭
3. 회원가입 또는 로그인

## 📁 프로젝트 구조

```
📁 forest-education-system/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 auth/           # 인증 관련 컴포넌트
│   │   ├── 📁 dashboard/      # 대시보드 컴포넌트
│   │   ├── 📁 layout/         # 레이아웃 컴포넌트
│   │   ├── 📁 region/         # 지역 관리 컴포넌트
│   │   └── 📁 ui/             # Shadcn/ui 컴포넌트
│   ├── 📁 lib/                # 유틸리티 및 설정
│   ├── 📁 store/              # Zustand 스토어
│   ├── 📄 App.tsx             # 메인 앱 컴포넌트
│   ├── 📄 main.tsx            # 엔트리 포인트
│   └── 📄 index.css           # 글로벌 스타일
├── 📄 package.json            # 프로젝트 설정
├── 📄 vite.config.ts          # Vite 설정
├── 📄 tailwind.config.js      # Tailwind 설정
├── 📄 supabase-setup.sql      # 데이터베이스 스키마
├── 📄 .env.example            # 환경변수 예시
└── 📄 README.md               # 사용 설명서
```

## 💾 데이터 저장

### 로컬 모드
- 브라우저 LocalStorage 사용
- 30초마다 자동 저장
- 백업/복원 기능으로 JSON 파일 내보내기/가져오기

### 클라우드 모드
- Supabase PostgreSQL 데이터베이스
- 실시간 동기화
- 파일은 Supabase Storage에 저장
- 오프라인 시 로컬 큐에 저장 후 온라인 복구 시 동기화

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

## 🔧 고급 기능

### 우선순위 설정
각 체크리스트 항목에 우선순위 설정 가능:
- 낮음 (회색)
- 보통 (기본)
- 높음 (주황색)
- 긴급 (빨간색)

### 입력란 타입
- 텍스트 입력
- 숫자 입력
- 날짜 선택
- 긴 텍스트 (textarea)

### 실시간 동기화
- 클라우드 모드에서 여러 디바이스 간 실시간 동기화
- 변경사항 즉시 반영

## 🔒 보안

### 데이터 보호
- 사용자별 데이터 격리 (RLS 정책)
- 이메일 기반 인증
- HTTPS 통신

### 백업 권장사항
1. 정기적인 JSON 백업 파일 생성
2. 클라우드 스토리지에 백업 파일 보관
3. 중요한 문서는 별도 백업

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: Supabase Auth
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## 🌐 브라우저 지원

- Chrome (권장)
- Edge
- Safari
- Firefox

## 📞 지원

문제 발생 시:
1. 브라우저 개발자 도구 콘솔 확인
2. Supabase 설정 재확인
3. 로컬 모드로 전환하여 테스트

## 📝 라이선스

개인 실무용으로 제작된 도구입니다.