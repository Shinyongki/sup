import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLocalDataStore, checklistTemplate } from '@/store/localDataStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function LocalRegionDetail() {
  const { regionName } = useParams<{ regionName: string }>()
  const navigate = useNavigate()
  const { regions, updateRegionInfo, updateChecklistItem, getRegionProgress, addDocument, removeDocument } = useLocalDataStore()
  
  if (!regionName || !regions[regionName]) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">지역을 찾을 수 없습니다</h1>
          <Button onClick={() => navigate('/')}>대시보드로 돌아가기</Button>
        </div>
      </div>
    )
  }
  
  const region = regions[regionName]
  const progress = getRegionProgress(regionName)

  const handleInfoUpdate = (field: string, value: string | number) => {
    updateRegionInfo(regionName, { [field]: value })
  }

  const handleChecklistUpdate = (sectionName: string, itemName: string, field: string, value: any) => {
    updateChecklistItem(regionName, sectionName, itemName, { [field]: value })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      addDocument(regionName, file)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-2"
          >
            ← 대시보드로 돌아가기
          </Button>
          <h1 className="text-3xl font-bold">{region.info.name} 관리</h1>
          <p className="text-gray-600">{region.info.facilityName}</p>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            진행률: {progress.completed}/{progress.total} ({progress.percentage}%)
          </div>
          <Progress value={progress.percentage} className="w-32 h-2" />
        </div>
      </div>

      {/* 상단: 기본정보와 비용을 나란히 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏢 기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">지역명</label>
                <Input value={region.info.name} onChange={(e) => handleInfoUpdate('name', e.target.value)} className="h-8" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">시설명</label>
                <Input value={region.info.facilityName} onChange={(e) => handleInfoUpdate('facilityName', e.target.value)} className="h-8" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">주소</label>
                <Input value={region.info.address} onChange={(e) => handleInfoUpdate('address', e.target.value)} placeholder="정확한 주소" className="h-8" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">연락처</label>
                <Input value={region.info.phone} onChange={(e) => handleInfoUpdate('phone', e.target.value)} className="h-8" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">수용인원</label>
                <Input type="number" value={region.info.maxCapacity} onChange={(e) => handleInfoUpdate('maxCapacity', parseInt(e.target.value) || 0)} className="h-8" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">담당자</label>
                <Input value={region.info.managerName} onChange={(e) => handleInfoUpdate('managerName', e.target.value)} className="h-8" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">담당자 연락처</label>
                <Input value={region.info.managerPhone} onChange={(e) => handleInfoUpdate('managerPhone', e.target.value)} className="h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비용 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💰 비용 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">프로그램비</label>
                <Input type="number" value={region.costs.programFee} onChange={(e) => {
                  const newCosts = { ...region.costs, programFee: parseInt(e.target.value) || 0 }
                  updateRegionInfo(regionName, { costs: newCosts } as any)
                }} className="h-8" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">식사비</label>
                <Input type="number" value={region.costs.mealFee} onChange={(e) => {
                  const newCosts = { ...region.costs, mealFee: parseInt(e.target.value) || 0 }
                  updateRegionInfo(regionName, { costs: newCosts } as any)
                }} className="h-8" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">입장료</label>
                <Input type="number" value={region.costs.entranceFee} onChange={(e) => {
                  const newCosts = { ...region.costs, entranceFee: parseInt(e.target.value) || 0 }
                  updateRegionInfo(regionName, { costs: newCosts } as any)
                }} className="h-8" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">주차비</label>
                <Input type="number" value={region.costs.parkingFee} onChange={(e) => {
                  const newCosts = { ...region.costs, parkingFee: parseInt(e.target.value) || 0 }
                  updateRegionInfo(regionName, { costs: newCosts } as any)
                }} className="h-8" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">시설이용료</label>
                <Input type="number" value={region.costs.facilityFee} onChange={(e) => {
                  const newCosts = { ...region.costs, facilityFee: parseInt(e.target.value) || 0 }
                  updateRegionInfo(regionName, { costs: newCosts } as any)
                }} className="h-8" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">기타비용</label>
                <Input type="number" value={region.costs.other} onChange={(e) => {
                  const newCosts = { ...region.costs, other: parseInt(e.target.value) || 0 }
                  updateRegionInfo(regionName, { costs: newCosts } as any)
                }} className="h-8" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t">
              <div className="text-lg font-bold text-blue-600">
                총 비용: {(region.costs.programFee + region.costs.mealFee + region.costs.entranceFee + region.costs.parkingFee + region.costs.facilityFee + region.costs.other).toLocaleString()}원
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 체크리스트 섹션 - 컴팩트하게 */}
      <div className="space-y-4">
        {Object.entries(checklistTemplate).map(([sectionName, items]) => (
          <Card key={sectionName}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                📋 {sectionName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((templateItem) => {
                  const checklistItem = region.checklist[sectionName]?.[templateItem.name] || {
                    completed: false,
                    inputValue: '',
                    notes: '',
                    priority: 'normal' as const
                  }

                  return (
                    <div key={templateItem.name} className="border rounded p-3">
                      <div className="flex gap-3">
                        <Checkbox
                          checked={checklistItem.completed}
                          onCheckedChange={(checked) => 
                            handleChecklistUpdate(sectionName, templateItem.name, 'completed', checked)
                          }
                        />
                        <div className="flex-1 space-y-2">
                          <div className="font-medium text-sm">{templateItem.name}</div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                            {/* 입력 필드 */}
                            {templateItem.hasInput && (
                              <div className="lg:col-span-2">
                                {templateItem.inputType === 'textarea' ? (
                                  <Textarea
                                    value={checklistItem.inputValue}
                                    onChange={(e) => handleChecklistUpdate(sectionName, templateItem.name, 'inputValue', e.target.value)}
                                    placeholder={templateItem.placeholder}
                                    className="min-h-[60px] text-sm"
                                  />
                                ) : (
                                  <Input
                                    type={templateItem.inputType}
                                    value={checklistItem.inputValue}
                                    onChange={(e) => handleChecklistUpdate(sectionName, templateItem.name, 'inputValue', e.target.value)}
                                    placeholder={templateItem.placeholder}
                                    className="text-sm"
                                  />
                                )}
                              </div>
                            )}
                            
                            {/* 우선순위와 메모 */}
                            <div className="space-y-2">
                              <Select
                                value={checklistItem.priority}
                                onValueChange={(value) => handleChecklistUpdate(sectionName, templateItem.name, 'priority', value)}
                              >
                                <SelectTrigger className="text-xs h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">낮음</SelectItem>
                                  <SelectItem value="normal">보통</SelectItem>
                                  <SelectItem value="high">높음</SelectItem>
                                  <SelectItem value="urgent">긴급</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Textarea
                                value={checklistItem.notes}
                                onChange={(e) => handleChecklistUpdate(sectionName, templateItem.name, 'notes', e.target.value)}
                                placeholder="메모..."
                                className="min-h-[50px] text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 문서 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📁 문서 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 파일 업로드 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                multiple
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-2xl mb-2">📁</div>
                <div className="text-sm font-medium">파일 업로드</div>
                <div className="text-xs text-gray-500">클릭하여 파일 선택</div>
              </label>
            </div>

            {/* 업로드된 파일 목록 */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {region.documents.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-4">업로드된 문서가 없습니다.</div>
              ) : (
                region.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 border rounded text-sm">
                    <div className="flex items-center gap-2">
                      <span>📄</span>
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(doc.size)} • {new Date(doc.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDocument(regionName, doc.id)}
                      className="text-xs"
                    >
                      삭제
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}