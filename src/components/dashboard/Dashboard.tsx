import React, { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useDataStore } from '@/store/dataStore'
import { Link } from 'react-router-dom'
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  MapPin,
  Phone,
  Edit
} from 'lucide-react'

export function Dashboard() {
  const { 
    regions, 
    checklistItems, 
    loading, 
    error, 
    fetchAllData, 
    getRegionProgress 
  } = useDataStore()

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchAllData()}>다시 시도</Button>
        </div>
      </div>
    )
  }

  // 전체 통계 계산
  const totalRegions = regions.length
  const progressData = regions.map(region => getRegionProgress(region.id))
  const totalItems = progressData.reduce((sum, p) => sum + p.total, 0)
  const completedItems = progressData.reduce((sum, p) => sum + p.completed, 0)
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
  const pendingRegions = progressData.filter(p => p.percentage < 100).length

  // 긴급 확인 필요 항목
  const urgentItems = regions.filter(region => {
    const progress = getRegionProgress(region.id)
    return (
      progress.percentage < 20 ||
      !region.facility_name ||
      region.facility_name.includes('확인필요') ||
      !region.phone ||
      region.phone.includes('확인필요')
    )
  }).map(region => ({
    region: region.name,
    issues: [
      ...(getRegionProgress(region.id).percentage < 20 ? [`진행률 매우 낮음 (${getRegionProgress(region.id).percentage}%)`] : []),
      ...(!region.facility_name || region.facility_name.includes('확인필요') ? ['시설명 확인 필요'] : []),
      ...(!region.phone || region.phone.includes('확인필요') ? ['연락처 확인 필요'] : [])
    ]
  }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">전체 현황 대시보드</h1>
        <p className="text-gray-600 mt-2">6개 지역 교육 준비 현황을 한눈에 확인하세요</p>
      </div>

      {/* 전체 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 진행률</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 항목</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedItems}/{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">
              전체 체크리스트 항목
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">준비 중인 지역</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRegions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalRegions}개 지역 중
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 지역별 현황 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">지역별 진행 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => {
            const progress = getRegionProgress(region.id)
            const progressColor = progress.percentage >= 80 ? 'text-green-600' : 
                                 progress.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
            
            return (
              <Card key={region.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{region.name}</CardTitle>
                    <Link to={`/region/${region.name}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        관리
                      </Button>
                    </Link>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {region.facility_name || '시설명 미정'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">진행률</span>
                      <span className={`text-sm font-bold ${progressColor}`}>
                        {progress.percentage}% ({progress.completed}/{progress.total})
                      </span>
                    </div>
                    <Progress 
                      value={progress.percentage} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">수용인원:</span>
                      <div className="font-medium">
                        {region.max_capacity ? `${region.max_capacity}명` : '미정'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">연락처:</span>
                      <div className="font-medium flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {region.phone || '미정'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 긴급 확인 필요 */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            긴급 확인 필요
          </CardTitle>
        </CardHeader>
        <CardContent>
          {urgentItems.length === 0 ? (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span>긴급 확인이 필요한 항목이 없습니다.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {urgentItems.map((item) => (
                <div key={item.region} className="border-l-4 border-red-400 pl-4">
                  <div className="font-medium text-red-800">{item.region}</div>
                  <ul className="text-sm text-red-600 mt-1 space-y-1">
                    {item.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}