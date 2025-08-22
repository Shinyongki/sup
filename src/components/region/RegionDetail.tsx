import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDataStore } from '@/store/dataStore'
import { ChecklistSection } from './ChecklistSection'
import { DocumentManager } from './DocumentManager'
import { Save, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Progress } from '@/components/ui/progress'

export function RegionDetail() {
  const { regionName } = useParams<{ regionName: string }>()
  const { 
    regions, 
    checklistItems, 
    fetchAllData, 
    updateRegionInfo, 
    getRegionProgress 
  } = useDataStore()
  
  const [formData, setFormData] = useState({
    facilityName: '',
    address: '',
    phone: '',
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    maxCapacity: 0,
    parkingCapacity: 0
  })
  
  const [saving, setSaving] = useState(false)

  const region = regions.find(r => r.name === regionName)
  const progress = region ? getRegionProgress(region.id) : { completed: 0, total: 0, percentage: 0 }

  useEffect(() => {
    if (regions.length === 0) {
      fetchAllData()
    }
  }, [regions.length, fetchAllData])

  useEffect(() => {
    if (region) {
      setFormData({
        facilityName: region.facility_name || '',
        address: region.address || '',
        phone: region.phone || '',
        managerName: region.manager_name || '',
        managerEmail: region.manager_email || '',
        managerPhone: region.manager_phone || '',
        maxCapacity: region.max_capacity || 0,
        parkingCapacity: region.parking_capacity || 0
      })
    }
  }, [region])

  const handleSave = async () => {
    if (!region) return

    setSaving(true)
    try {
      await updateRegionInfo(region.id, {
        facility_name: formData.facilityName,
        address: formData.address,
        phone: formData.phone,
        manager_name: formData.managerName,
        manager_email: formData.managerEmail,
        manager_phone: formData.managerPhone,
        max_capacity: formData.maxCapacity,
        parking_capacity: formData.parkingCapacity
      })
      alert('저장되었습니다.')
    } catch (error) {
      alert('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (!region) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">지역을 찾을 수 없습니다</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              대시보드로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                돌아가기
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{regionName} 상세 관리</h1>
          </div>
          <p className="text-gray-600 mt-2">{region.facility_name || '시설명 미정'}</p>
        </div>
        
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? '저장 중...' : '저장'}
        </Button>
      </div>

      {/* 진행률 표시 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">전체 진행률</span>
            <span className="text-sm font-bold text-green-600">
              {progress.percentage}% ({progress.completed}/{progress.total})
            </span>
          </div>
          <Progress value={progress.percentage} className="h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">기본 정보</TabsTrigger>
          <TabsTrigger value="checklist">체크리스트</TabsTrigger>
          <TabsTrigger value="documents">문서</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">시설명</label>
                  <Input
                    value={formData.facilityName}
                    onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                    placeholder="시설명을 입력하세요"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">주소</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="주소를 입력하세요"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">연락처</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="전화번호를 입력하세요"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">담당자명</label>
                  <Input
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    placeholder="담당자명을 입력하세요"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">담당자 이메일</label>
                  <Input
                    type="email"
                    value={formData.managerEmail}
                    onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">담당자 휴대폰</label>
                  <Input
                    value={formData.managerPhone}
                    onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                    placeholder="휴대폰 번호를 입력하세요"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">최대 수용인원</label>
                  <Input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
                    placeholder="최대 수용인원"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">주차 가능대수</label>
                  <Input
                    type="number"
                    value={formData.parkingCapacity}
                    onChange={(e) => setFormData({ ...formData, parkingCapacity: parseInt(e.target.value) || 0 })}
                    placeholder="주차 가능대수"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist">
          <ChecklistSection regionId={region.id} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentManager regionId={region.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}