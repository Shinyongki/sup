import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AuthModal } from '@/components/auth/AuthModal'
import { Trees, Cloud, Wifi, Download, Upload, LogOut } from 'lucide-react'

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, signOut } = useAuthStore()
  const isConfigured = isSupabaseConfigured()

  const handleExportData = () => {
    // 로컬스토리지에서 데이터 내보내기
    const data = localStorage.getItem('forest-education-data')
    if (data) {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `forest-education-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

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
            const data = e.target?.result as string
            localStorage.setItem('forest-education-data', data)
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
    <>
      <header className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trees className="h-8 w-8" />
              <h1 className="text-xl font-bold">숲체험 교육 관리 시스템</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* 연결 상태 표시 */}
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-sm">
                {user ? (
                  <>
                    <Cloud className="h-4 w-4" />
                    <span>클라우드 동기화 활성</span>
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4" />
                    <span>로컬 모드</span>
                  </>
                )}
              </div>

              {/* 사용자 정보 */}
              {user && (
                <div className="flex items-center gap-3">
                  <span className="text-sm">{user.email}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    로그아웃
                  </Button>
                </div>
              )}

              {/* 액션 버튼들 */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-1" />
                  백업
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportData}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  복원
                </Button>

                {!user && isConfigured && (
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-white text-green-700 hover:bg-gray-100"
                  >
                    <Cloud className="h-4 w-4 mr-1" />
                    클라우드 연동
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}