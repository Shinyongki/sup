import React from 'react'
import { useLocalDataStore } from '@/store/localDataStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function LocalDashboard() {
  const { regions, getRegionProgress } = useLocalDataStore()
  const navigate = useNavigate()

  const regionNames = Object.keys(regions)
  
  const getTotalProgress = () => {
    let totalCompleted = 0
    let totalItems = 0
    
    regionNames.forEach(regionName => {
      const progress = getRegionProgress(regionName)
      totalCompleted += progress.completed
      totalItems += progress.total
    })
    
    return {
      completed: totalCompleted,
      total: totalItems,
      percentage: totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0
    }
  }

  const totalProgress = getTotalProgress()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">숲체험 교육 관리 대시보드</h1>
        <div className="text-sm text-gray-500">
          총 {regionNames.length}개 지역 관리 중
        </div>
      </div>

      {/* 전체 진행률 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 전체 진행률
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>완료된 항목: {totalProgress.completed}/{totalProgress.total}</span>
              <span>{totalProgress.percentage}%</span>
            </div>
            <Progress value={totalProgress.percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* 지역별 진행률 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regionNames.map(regionName => {
          const region = regions[regionName]
          const progress = getRegionProgress(regionName)
          
          return (
            <Card key={regionName} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{region.info.name}</span>
                  <span className="text-sm text-gray-500">{progress.percentage}%</span>
                </CardTitle>
                <div className="text-sm text-gray-600">
                  {region.info.facilityName}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress.percentage} className="h-2" />
                
                <div className="text-sm text-gray-600">
                  <div>완료: {progress.completed}/{progress.total} 항목</div>
                  <div>연락처: {region.info.phone}</div>
                </div>
                
                <Button 
                  onClick={() => navigate(`/region/${regionName}`)}
                  className="w-full"
                  variant="outline"
                >
                  관리하기
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 빠른 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{regionNames.length}</div>
            <div className="text-sm text-gray-600">관리 지역</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalProgress.completed}</div>
            <div className="text-sm text-gray-600">완료 항목</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{totalProgress.total - totalProgress.completed}</div>
            <div className="text-sm text-gray-600">대기 항목</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalProgress.percentage}%</div>
            <div className="text-sm text-gray-600">전체 진행률</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}