import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { LocalDashboard } from '@/components/dashboard/LocalDashboard'
import { LocalRegionDetail } from '@/components/region/LocalRegionDetail'
import { ScheduleManager } from '@/components/schedule/ScheduleManager'
import { ContactManager } from '@/components/contacts/ContactManager'
import { useLocalDataStore } from '@/store/localDataStore'

function App() {
  const { initializeData } = useLocalDataStore()

  useEffect(() => {
    // 로컬 데이터 초기화
    initializeData()
  }, [initializeData])

  return (
    <div className="min-h-screen bg-gray-50">
      <LocalHeader />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<LocalDashboard />} />
            <Route path="/region/:regionName" element={<LocalRegionDetail />} />
            <Route path="/schedule" element={<ScheduleManager />} />
            <Route path="/contacts" element={<ContactManager />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

// 간단한 헤더 (인증 없음)
function LocalHeader() {
  const { exportData } = useLocalDataStore()

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            useLocalDataStore.getState().importData(data)
            window.location.reload()
          } catch (error) {
            alert('파일을 읽을 수 없습니다.')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <header className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8">🌲</div>
            <h1 className="text-xl font-bold">숲체험 교육 관리 시스템</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-sm">
              💾 <span>로컬 저장</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
              >
                📥 백업
              </button>
              
              <button
                onClick={handleImportData}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
              >
                📤 복원
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


export default App