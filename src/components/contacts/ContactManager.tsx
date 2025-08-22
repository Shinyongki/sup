import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocalDataStore } from '@/store/localDataStore'

interface Contact {
  id: string
  name: string
  position: string
  organization: string
  phone: string
  email: string
  region: string
  category: 'manager' | 'instructor' | 'vendor' | 'emergency' | 'other'
  notes: string
}

export function ContactManager() {
  const { regions } = useLocalDataStore()
  const regionNames = Object.keys(regions)
  
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: '김철수',
      position: '시설장',
      organization: '편백의 숲',
      phone: '055-225-4243',
      email: 'kim@forest.kr',
      region: '창원',
      category: 'manager',
      notes: '시설 담당자, 오전 시간대 연락 선호'
    },
    {
      id: '2',
      name: '박영희',
      position: '프로그램 강사',
      organization: '치유의 숲',
      phone: '055-637-6560',
      email: 'park@healing.kr',
      region: '거제도',
      category: 'instructor',
      notes: '숲치유 전문 강사, 주말 프로그램 가능'
    },
    {
      id: '3',
      name: '이민수',
      position: '급식업체 담당자',
      organization: '건강한 밥상',
      phone: '010-1234-5678',
      email: 'lee@food.kr',
      region: '전체',
      category: 'vendor',
      notes: '친환경 식재료 전문, 사전 주문 필요'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterRegion, setFilterRegion] = useState<string>('all')

  const [formData, setFormData] = useState<Omit<Contact, 'id'>>({
    name: '',
    position: '',
    organization: '',
    phone: '',
    email: '',
    region: '',
    category: 'other',
    notes: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      organization: '',
      phone: '',
      email: '',
      region: '',
      category: 'other',
      notes: ''
    })
    setEditingContact(null)
    setShowAddForm(false)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) return

    if (editingContact) {
      setContacts(contacts.map(contact => 
        contact.id === editingContact.id 
          ? { ...formData, id: editingContact.id }
          : contact
      ))
    } else {
      const newContact: Contact = {
        ...formData,
        id: Date.now().toString()
      }
      setContacts([...contacts, newContact])
    }
    
    resetForm()
  }

  const handleEdit = (contact: Contact) => {
    setFormData({ ...contact })
    setEditingContact(contact)
    setShowAddForm(true)
  }

  const handleDelete = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId))
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'manager': return '시설담당자'
      case 'instructor': return '강사'
      case 'vendor': return '업체담당자'
      case 'emergency': return '응급연락처'
      default: return '기타'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'instructor': return 'bg-green-100 text-green-800'
      case 'vendor': return 'bg-orange-100 text-orange-800'
      case 'emergency': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm)
    
    const matchesCategory = filterCategory === 'all' || contact.category === filterCategory
    const matchesRegion = filterRegion === 'all' || contact.region === filterRegion || contact.region === '전체'
    
    return matchesSearch && matchesCategory && matchesRegion
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">연락처 관리</h1>
        <Button onClick={() => setShowAddForm(true)}>+ 연락처 추가</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 연락처 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 검색 및 필터 */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="이름, 기관, 전화번호 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="분류 필터" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 분류</SelectItem>
                      <SelectItem value="manager">시설담당자</SelectItem>
                      <SelectItem value="instructor">강사</SelectItem>
                      <SelectItem value="vendor">업체담당자</SelectItem>
                      <SelectItem value="emergency">응급연락처</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select value={filterRegion} onValueChange={setFilterRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="지역 필터" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 지역</SelectItem>
                      {regionNames.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                      <SelectItem value="전체">전체 지역 공통</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-gray-500 flex items-center">
                  총 {filteredContacts.length}명
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 연락처 카드들 */}
          <div className="space-y-3">
            {filteredContacts.map(contact => (
              <Card key={contact.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(contact.category)}`}>
                          {getCategoryLabel(contact.category)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {contact.region}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div><span className="font-medium">직책:</span> {contact.position}</div>
                        <div><span className="font-medium">소속:</span> {contact.organization}</div>
                        <div><span className="font-medium">전화:</span> 
                          <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline ml-1">
                            {contact.phone}
                          </a>
                        </div>
                        <div><span className="font-medium">이메일:</span> 
                          {contact.email && (
                            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline ml-1">
                              {contact.email}
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {contact.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <span className="font-medium">메모:</span> {contact.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(contact)}>
                        수정
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(contact.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredContacts.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500 py-8">
                    검색 조건에 맞는 연락처가 없습니다.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 연락처 추가/수정 폼 */}
        <div className="space-y-4">
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingContact ? '연락처 수정' : '연락처 추가'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">이름 *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="이름"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">직책</label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="직책"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">소속 기관</label>
                  <Input
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="소속 기관"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">전화번호 *</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010-0000-0000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">이메일</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">지역</label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => setFormData({ ...formData, region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionNames.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                      <SelectItem value="전체">전체 지역 공통</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">분류</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">시설담당자</SelectItem>
                      <SelectItem value="instructor">강사</SelectItem>
                      <SelectItem value="vendor">업체담당자</SelectItem>
                      <SelectItem value="emergency">응급연락처</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">메모</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="추가 정보나 특이사항"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSubmit} className="flex-1">
                    {editingContact ? '수정' : '추가'}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 빠른 연락처 */}
          <Card>
            <CardHeader>
              <CardTitle>응급 연락처</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {contacts
                  .filter(contact => contact.category === 'emergency')
                  .map(contact => (
                    <div key={contact.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{contact.name}</div>
                        <div className="text-xs text-gray-500">{contact.organization}</div>
                      </div>
                      <a href={`tel:${contact.phone}`} className="text-red-600 font-medium text-sm">
                        {contact.phone}
                      </a>
                    </div>
                  ))}
                
                {contacts.filter(contact => contact.category === 'emergency').length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-4">
                    등록된 응급 연락처가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}