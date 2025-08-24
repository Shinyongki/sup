import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDataStore } from '@/store/dataStore'
import { isSupabaseConfigured } from '@/lib/supabase'

export function ScheduleManager() {
  const { regions, schedules, fetchAllData, addSchedule, updateSchedule, deleteSchedule } = useDataStore()
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [newEvent, setNewEvent] = useState({
    start_date: '',
    start_time: '',
    title: '',
    description: '',
    region_id: '',
    status: 'planned' as const
  })

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchAllData()
    }
  }, [])

  // 달력 생성 함수
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDate = firstDay.getDay() // 0 = 일요일
    
    const days = []
    
    // 이전 달의 빈 날짜들
    for (let i = 0; i < startDate; i++) {
      days.push(null)
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const getDayEvents = (day: number) => {
    if (!day) return []
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return schedules.filter(event => event.start_date === dateStr)
  }

  const handleDateClick = (day: number) => {
    if (!day) return
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
    setNewEvent({ ...newEvent, start_date: dateStr })
    setEditingEvent(null)
    setShowAddForm(true)
    setShowEventDetail(false)
  }

  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setShowEventDetail(true)
    setShowAddForm(false)
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setNewEvent({
      start_date: event.start_date,
      start_time: event.start_time || '',
      title: event.title,
      description: event.description || '',
      region_id: event.region_id || '',
      status: event.status
    })
    setShowAddForm(true)
    setShowEventDetail(false)
  }

  const resetForm = () => {
    setNewEvent({ start_date: '', start_time: '', title: '', description: '', region_id: '', status: 'planned' })
    setEditingEvent(null)
    setShowAddForm(false)
    setShowEventDetail(false)
    setSelectedEvent(null)
  }

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start_date) {
      alert('제목과 날짜는 필수입니다.')
      return
    }
    
    try {
      if (editingEvent) {
        // 수정 모드
        await updateSchedule(editingEvent.id, {
          title: newEvent.title,
          description: newEvent.description,
          start_date: newEvent.start_date,
          end_date: newEvent.start_date,
          start_time: newEvent.start_time || null,
          region_id: newEvent.region_id || null,
          status: newEvent.status,
          updated_at: new Date().toISOString()
        })
      } else {
        // 새로 추가
        await addSchedule({
          title: newEvent.title,
          description: newEvent.description || '',
          start_date: newEvent.start_date,
          end_date: newEvent.start_date,
          start_time: newEvent.start_time || null,
          region_id: newEvent.region_id || null,
          status: newEvent.status,
          user_id: null
        })
      }
      
      // 데이터 새로고침
      await fetchAllData()
      resetForm()
    } catch (error) {
      console.error('일정 추가/수정 실패:', error)
      alert('일정 저장에 실패했습니다. 콘솔을 확인해주세요.')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteSchedule(eventId)
      await fetchAllData() // 데이터 새로고침
      setShowEventDetail(false)
      setSelectedEvent(null)
    } catch (error) {
      console.error('일정 삭제 실패:', error)
      alert('일정 삭제에 실패했습니다.')
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const days = generateCalendar(currentDate)
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned': return '계획됨'
      case 'confirmed': return '확정'
      case 'completed': return '완료'
      case 'cancelled': return '취소'
      default: return status
    }
  }

  const getRegionName = (regionId: string) => {
    const region = regions.find(r => r.id === regionId)
    return region ? region.name : '미지정'
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500">Supabase 연결이 필요합니다. .env 파일을 설정해주세요.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">일정 관리</h1>
        <Button onClick={() => setShowAddForm(true)}>+ 일정 추가</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 달력 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigateMonth('prev')}>
                  ←
                </Button>
                <CardTitle>
                  {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                </CardTitle>
                <Button variant="ghost" onClick={() => navigateMonth('next')}>
                  →
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {/* 요일 헤더 */}
                {dayNames.map(day => (
                  <div key={day} className="text-center font-semibold p-2">
                    {day}
                  </div>
                ))}
                
                {/* 날짜들 */}
                {days.map((day, index) => {
                  const dayEvents = day ? getDayEvents(day) : []
                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                        day ? '' : 'bg-gray-50'
                      }`}
                      onClick={() => day && handleDateClick(day)}
                    >
                      {day && (
                        <>
                          <div className="font-semibold mb-1">{day}</div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event, idx) => (
                              <div
                                key={idx}
                                className={`text-xs p-1 rounded truncate ${getStatusColor(event.status)}`}
                                onClick={(e) => handleEventClick(event, e)}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-4">
          {/* 일정 추가/수정 폼 */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingEvent ? '일정 수정' : '새 일정 추가'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">날짜</label>
                  <Input
                    type="date"
                    value={newEvent.start_date}
                    onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">시간</label>
                  <Input
                    type="time"
                    value={newEvent.start_time || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">제목</label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="일정 제목"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">지역</label>
                  <Select
                    value={newEvent.region_id}
                    onValueChange={(value) => setNewEvent({ ...newEvent, region_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">상태</label>
                  <Select
                    value={newEvent.status}
                    onValueChange={(value: any) => setNewEvent({ ...newEvent, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">계획됨</SelectItem>
                      <SelectItem value="confirmed">확정</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                      <SelectItem value="cancelled">취소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">설명</label>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="일정 설명"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddEvent} className="flex-1">
                    {editingEvent ? '수정' : '추가'}
                  </Button>
                  <Button variant="outline" onClick={resetForm} className="flex-1">
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 일정 상세 */}
          {showEventDetail && selectedEvent && (
            <Card>
              <CardHeader>
                <CardTitle>일정 상세</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">제목</p>
                  <p className="font-medium">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">날짜</p>
                  <p>{selectedEvent.start_date}</p>
                </div>
                {selectedEvent.start_time && (
                  <div>
                    <p className="text-sm text-gray-500">시간</p>
                    <p>{selectedEvent.start_time}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">지역</p>
                  <p>{getRegionName(selectedEvent.region_id)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">상태</p>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedEvent.status)}`}>
                    {getStatusLabel(selectedEvent.status)}
                  </span>
                </div>
                {selectedEvent.description && (
                  <div>
                    <p className="text-sm text-gray-500">설명</p>
                    <p>{selectedEvent.description}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => handleEditEvent(selectedEvent)} className="flex-1">
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="flex-1"
                  >
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 이번 달 일정 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>이번 달 일정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {schedules
                  .filter(event => {
                    const eventDate = new Date(event.start_date)
                    return eventDate.getMonth() === currentDate.getMonth() &&
                           eventDate.getFullYear() === currentDate.getFullYear()
                  })
                  .sort((a, b) => a.start_date.localeCompare(b.start_date))
                  .map(event => (
                    <div
                      key={event.id}
                      className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => handleEventClick(event, { stopPropagation: () => {} } as any)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.start_date).getDate()}일 - {getRegionName(event.region_id)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                {schedules.filter(event => {
                  const eventDate = new Date(event.start_date)
                  return eventDate.getMonth() === currentDate.getMonth() &&
                         eventDate.getFullYear() === currentDate.getFullYear()
                }).length === 0 && (
                  <p className="text-gray-500 text-sm">일정이 없습니다</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}