import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDataStore, checklistTemplate } from '@/store/dataStore'
import { cn } from '@/lib/utils'

interface ChecklistSectionProps {
  regionId: string
}

export function ChecklistSection({ regionId }: ChecklistSectionProps) {
  const { checklistItems, updateChecklistItem, fetchAllData } = useDataStore()

  const regionItems = checklistItems.filter(item => item.region_id === regionId)

  useEffect(() => {
    if (checklistItems.length === 0) {
      fetchAllData()
    }
  }, [checklistItems.length, fetchAllData])

  const getItemData = (sectionName: string, itemName: string) => {
    return regionItems.find(
      item => item.section_name === sectionName && item.item_name === itemName
    ) || {
      is_completed: false,
      input_value: '',
      notes: '',
      priority: 'normal' as const
    }
  }

  const handleItemUpdate = async (
    sectionName: string, 
    itemName: string, 
    updates: Partial<{ is_completed: boolean; input_value: string; notes: string; priority: string }>
  ) => {
    const currentData = getItemData(sectionName, itemName)
    await updateChecklistItem(regionId, sectionName, itemName, {
      ...currentData,
      ...updates
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'low': return 'border-gray-300 bg-gray-50'
      default: return 'border-green-200 bg-green-50'
    }
  }

  return (
    <div className="space-y-6">
      {Object.entries(checklistTemplate).map(([sectionName, items]) => (
        <Card key={sectionName}>
          <CardHeader>
            <CardTitle className="text-lg text-green-700">{sectionName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => {
              const itemName = typeof item === 'string' ? item : item.name
              const itemData = getItemData(sectionName, itemName)
              const isCompleted = itemData.is_completed

              return (
                <div
                  key={itemName}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all',
                    isCompleted ? 'bg-green-50 border-green-200' : getPriorityColor(itemData.priority || 'normal')
                  )}
                >
                  {/* 체크박스와 제목 */}
                  <div className="flex items-start gap-3 mb-3">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={(checked) =>
                        handleItemUpdate(sectionName, itemName, { is_completed: !!checked })
                      }
                      className="mt-1"
                    />
                    <label
                      className={cn(
                        'flex-1 cursor-pointer font-medium',
                        isCompleted && 'line-through text-gray-600'
                      )}
                    >
                      {itemName}
                    </label>
                    
                    {/* 우선순위 선택 */}
                    <Select
                      value={itemData.priority || 'normal'}
                      onValueChange={(value) =>
                        handleItemUpdate(sectionName, itemName, { priority: value })
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">낮음</SelectItem>
                        <SelectItem value="normal">보통</SelectItem>
                        <SelectItem value="high">높음</SelectItem>
                        <SelectItem value="urgent">긴급</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 입력란 (템플릿에 정의된 경우) */}
                  {typeof item === 'object' && item.hasInput && (
                    <div className="mb-3">
                      {item.inputType === 'textarea' ? (
                        <Textarea
                          placeholder={item.placeholder}
                          value={itemData.input_value || ''}
                          onChange={(e) =>
                            handleItemUpdate(sectionName, itemName, { input_value: e.target.value })
                          }
                          className="min-h-[80px]"
                        />
                      ) : (
                        <Input
                          type={item.inputType}
                          placeholder={item.placeholder}
                          value={itemData.input_value || ''}
                          onChange={(e) =>
                            handleItemUpdate(sectionName, itemName, { input_value: e.target.value })
                          }
                        />
                      )}
                    </div>
                  )}

                  {/* 메모 입력란 */}
                  <div>
                    <Textarea
                      placeholder="메모나 추가 정보를 입력하세요..."
                      value={itemData.notes || ''}
                      onChange={(e) =>
                        handleItemUpdate(sectionName, itemName, { notes: e.target.value })
                      }
                      className="min-h-[60px] bg-white/50"
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}