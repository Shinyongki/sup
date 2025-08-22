import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { RegionDetail } from '@/components/region/RegionDetail'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'

function App() {
  const { initialize } = useAuthStore()
  const { fetchAllData } = useDataStore()

  useEffect(() => {
    // 인증 상태 초기화
    initialize()
    
    // 초기 데이터 로드
    fetchAllData()
  }, [initialize, fetchAllData])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/region/:regionName" element={<RegionDetail />} />
            <Route path="/checklist" element={<GlobalChecklist />} />
            <Route path="/documents" element={<GlobalDocuments />} />
            <Route path="/costs" element={<CostComparison />} />
            <Route path="/schedule" element={<ScheduleManager />} />
            <Route path="/contacts" element={<ContactManager />} />
            <Route path="/reports" element={<ReportGenerator />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

// 임시 컴포넌트들 (추후 구현)
function GlobalChecklist() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">전체 체크리스트</h1>
      <p>전체 지역의 체크리스트를 한눈에 볼 수 있는 페이지입니다.</p>
    </div>
  )
}

function GlobalDocuments() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">문서 관리</h1>
      <p>모든 지역의 문서를 통합 관리하는 페이지입니다.</p>
    </div>
  )
}

function CostComparison() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">비용 비교</h1>
      <p>지역별 비용을 비교하고 분석하는 페이지입니다.</p>
    </div>
  )
}

function ScheduleManager() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">일정 관리</h1>
      <p>교육 일정을 관리하는 페이지입니다.</p>
    </div>
  )
}

function ContactManager() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">연락처 관리</h1>
      <p>각 지역 담당자 연락처를 관리하는 페이지입니다.</p>
    </div>
  )
}

function ReportGenerator() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">보고서 생성</h1>
      <p>각종 보고서를 생성하는 페이지입니다.</p>
    </div>
  )
}

export default App