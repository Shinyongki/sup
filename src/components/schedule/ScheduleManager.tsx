import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocalDataStore } from '@/store/localDataStore'

interface ScheduleEvent {
  id: string
  date: string
  time: string
  title: string
  description: string
  region: string
  type: 'visit' | 'meeting' | 'preparation' | 'other'
}

export function ScheduleManager() {
  const { regions } = useLocalDataStore()
  const regionNames = Object.keys(regions)
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: '1',
      date: '2024-12-25',
      time: '10:00',
      title: '창원 시설 견학',
      description: '편백의 숲 현장 방문 및 시설 확인',
      region: '창원',
      type: 'visit'
    },
    {
      id: '2',
      date: '2024-12-26',
      time: '14:00',
      title: '거제도 프로그램 회의',
      description: '프로그램 계획 수립 및 담당자 미팅',
      region: '거제도',
      type: 'meeting'
    }
  ])
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [newEvent, setNewEvent] = useState({
    date: '',
    time: '',
    title: '',
    description: '',
    region: '',
    type: 'visit' as const
  })

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
    return events.filter(event => event.date === dateStr)
  }

  const handleDateClick = (day: number) => {
    if (!day) return
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
    setNewEvent({ ...newEvent, date: dateStr })
    setEditingEvent(null)
    setShowAddForm(true)
    setShowEventDetail(false)
  }

  const handleEventClick = (event: ScheduleEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setShowEventDetail(true)
    setShowAddForm(false)
  }

  const handleEditEvent = (event: ScheduleEvent) => {
    setEditingEvent(event)
    setNewEvent({
      date: event.date,
      time: event.time,
      title: event.title,
      description: event.description,
      region: event.region,
      type: event.type
    })
    setShowAddForm(true)
    setShowEventDetail(false)
  }

  const resetForm = () => {
    setNewEvent({ date: '', time: '', title: '', description: '', region: '', type: 'visit' })
    setEditingEvent(null)
    setShowAddForm(false)
    setShowEventDetail(false)
    setSelectedEvent(null)
  }

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return
    
    if (editingEvent) {
      // 수정 모드
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...newEvent, id: editingEvent.id }
          : event
      ))
    } else {
      // 새로 추가
      const event: ScheduleEvent = {
        id: Date.now().toString(),
        ...newEvent
      }
      setEvents([...events, event])
    }
    
    resetForm()
  }

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visit': return 'bg-blue-100 text-blue-800'
      case 'meeting': return 'bg-green-100 text-green-800'
      case 'preparation': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'visit': return '현장방문'
      case 'meeting': return '회의'
      case 'preparation': return '준비작업'
      default: return '기타'
    }
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
                <CardTitle>
                  {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    ←
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const dayEvents = getDayEvents(day || 0)
                  const isToday = day && 
                    currentDate.getFullYear() === new Date().getFullYear() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    day === new Date().getDate()
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        isToday ? 'bg-blue-50 border-blue-300' : ''
                      } ${!day ? 'bg-gray-50' : ''}`}
                      onClick={() => day && handleDateClick(day)}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${getTypeColor(event.type)}`}
                                title={event.title}
                                onClick={(e) => handleEventClick(event, e)}
                              >
                                {event.time} {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-500">+{dayEvents.length - 2}개 더</div>
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

        {/* 일정 목록 및 추가 폼 */}
        <div className="space-y-4">
          {/* 일정 상세보기 */}
          {showEventDetail && selectedEvent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>일정 상세</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowEventDetail(false)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">제목</div>
                  <div className="text-lg font-semibold">{selectedEvent.title}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">날짜</div>
                    <div>{selectedEvent.date}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">시간</div>
                    <div>{selectedEvent.time}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">지역</div>
                    <div>{selectedEvent.region}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">유형</div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs ${getTypeColor(selectedEvent.type)}`}>
                      {getTypeLabel(selectedEvent.type)}
                    </div>
                  </div>
                </div>
                
                {selectedEvent.description && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">설명</div>
                    <div className="bg-gray-50 p-3 rounded text-sm">{selectedEvent.description}</div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-3">
                  <Button onClick={() => handleEditEvent(selectedEvent)} className="flex-1">
                    수정
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      deleteEvent(selectedEvent.id)
                      setShowEventDetail(false)
                    }}
                    className="flex-1 text-red-600 hover:text-red-800"
                  >
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 일정 추가 폼 */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingEvent ? '일정 수정' : '일정 추가'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">날짜</label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">시간</label>
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">제목</label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="일정 제목"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">지역</label>
                  <Select
                    value={newEvent.region}
                    onValueChange={(value) => setNewEvent({ ...newEvent, region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionNames.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">유형</label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visit">현장방문</SelectItem>
                      <SelectItem value="meeting">회의</SelectItem>
                      <SelectItem value="preparation">준비작업</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">설명</label>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="일정 설명"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={addEvent} className="flex-1">
                    {editingEvent ? '수정' : '추가'}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>취소</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 다가오는 일정 */}
          <Card>
            <CardHeader>
              <CardTitle>다가오는 일정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                  .slice(0, 5)
                  .map(event => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{event.title}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {event.date} {event.time} • {event.region}
                          </div>
                          <div className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${getTypeColor(event.type)}`}>
                            {getTypeLabel(event.type)}
                          </div>
                          {event.description && (
                            <div className="text-xs text-gray-600 mt-2">{event.description}</div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            수정
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {events.length === 0 && (
                  <div className="text-center text-gray-500 py-4">등록된 일정이 없습니다.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}