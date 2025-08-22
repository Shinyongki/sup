import { create } from 'zustand'

// 체크리스트 템플릿 정의
export const checklistTemplate = {
  '시설 정보 확인': [
    { 
      name: '시설명 및 정확한 주소 확인',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '정확한 주소를 입력하세요'
    },
    { 
      name: '최대 수용 인원 확인',
      hasInput: true,
      inputType: 'number' as const,
      placeholder: '최대 수용 인원 (명)'
    },
    { 
      name: '시설 사진 및 안내자료 수령',
      hasInput: true,
      inputType: 'textarea' as const,
      placeholder: '수령한 자료 목록을 입력하세요'
    },
    { 
      name: '입장료/이용료 정확한 금액',
      hasInput: true,
      inputType: 'number' as const,
      placeholder: '금액 (원)'
    },
    { 
      name: '주차비 유무 및 요금 확인',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '주차비 정보 (예: 무료, 2000원/대)'
    }
  ],
  '프로그램 운영 계획': [
    { 
      name: '시간대별 세부 프로그램 확정',
      hasInput: false
    },
    { 
      name: '09:00-10:00 프로그램 계획',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '프로그램 내용을 입력하세요'
    },
    { 
      name: '10:00-11:00 프로그램 계획',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '프로그램 내용을 입력하세요'
    },
    { 
      name: '11:00-12:00 프로그램 계획',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '프로그램 내용을 입력하세요'
    },
    { 
      name: '13:00-14:00 프로그램 계획',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '프로그램 내용을 입력하세요'
    },
    { 
      name: '14:00-15:00 프로그램 계획',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '프로그램 내용을 입력하세요'
    },
    { 
      name: '15:00-16:00 프로그램 계획',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '프로그램 내용을 입력하세요'
    },
    { 
      name: '조별 운영 계획 수립 (A조/B조)',
      hasInput: true,
      inputType: 'textarea' as const,
      placeholder: 'A조, B조 운영 계획을 입력하세요'
    },
    { 
      name: '강사 정보 확인 (자격증, 경력)',
      hasInput: true,
      inputType: 'textarea' as const,
      placeholder: '강사명, 자격증, 경력 등을 입력하세요'
    }
  ],
  '비용 및 견적': [
    { 
      name: '공식 견적서 수령',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '견적서 수령일 또는 담당자'
    },
    { 
      name: '프로그램 비용 확정',
      hasInput: true,
      inputType: 'number' as const,
      placeholder: '1인당 프로그램 비용 (원)'
    },
    { 
      name: '식비 확정 (중식, 간식)',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '중식: 8000원, 간식: 2000원'
    },
    { 
      name: '총 예산 계산 완료',
      hasInput: true,
      inputType: 'number' as const,
      placeholder: '총 예산 (원)'
    }
  ],
  '식사 및 편의시설': [
    { 
      name: '급식업체 정보 확인',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '업체명 및 연락처'
    },
    { 
      name: '식사 제공 시간 및 장소 확정',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '시간: 12:00-13:00, 장소: 식당동'
    },
    { 
      name: '음식물쓰레기 처리 방법 안내',
      hasInput: true,
      inputType: 'textarea' as const,
      placeholder: '처리 방법 및 주의사항'
    },
    { 
      name: '분리수거 방법 안내',
      hasInput: true,
      inputType: 'textarea' as const,
      placeholder: '분리수거 방법 및 위치'
    }
  ],
  '최종 확인': [
    { 
      name: '교육기관과 최종 일정 확인',
      hasInput: true,
      inputType: 'date' as const,
      placeholder: '확정 날짜'
    },
    { 
      name: '당일 긴급 연락체계 구축',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '긴급연락처 및 담당자'
    },
    { 
      name: '보험 가입 여부 확인',
      hasInput: true,
      inputType: 'text' as const,
      placeholder: '보험사, 보험금액 등'
    },
    { 
      name: '우천시 대체 프로그램 준비',
      hasInput: true,
      inputType: 'textarea' as const,
      placeholder: '대체 프로그램 계획'
    }
  ]
}

// 로컬 데이터 타입
interface LocalRegion {
  id: string
  name: string
  facilityName: string
  address: string
  phone: string
  managerName: string
  managerEmail: string
  managerPhone: string
  maxCapacity: number
  parkingCapacity: number
}

interface ChecklistData {
  [sectionName: string]: {
    [itemName: string]: {
      completed: boolean
      inputValue: string
      notes: string
      priority: 'low' | 'normal' | 'high' | 'urgent'
    }
  }
}

interface DocumentData {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
}

interface RegionData {
  info: LocalRegion
  checklist: ChecklistData
  documents: DocumentData[]
  costs: {
    programFee: number
    mealFee: number
    facilityFee: number
    entranceFee: number
    parkingFee: number
    other: number
  }
}

interface LocalDataStore {
  regions: { [regionName: string]: RegionData }
  loading: boolean
  error: string | null
  
  // Actions
  initializeData: () => void
  updateRegionInfo: (regionName: string, data: Partial<LocalRegion>) => void
  updateChecklistItem: (regionName: string, sectionName: string, itemName: string, data: Partial<ChecklistData[string][string]>) => void
  addDocument: (regionName: string, file: File) => void
  removeDocument: (regionName: string, documentId: string) => void
  getRegionProgress: (regionName: string) => { completed: number; total: number; percentage: number }
  exportData: () => void
  importData: (data: any) => void
}

const STORAGE_KEY = 'forest-education-data'

export const useLocalDataStore = create<LocalDataStore>((set, get) => ({
  regions: {},
  loading: false,
  error: null,

  initializeData: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      let data = stored ? JSON.parse(stored) : null

      if (!data) {
        // 초기 데이터 생성
        const defaultRegions = ['창원', '거제도', '오도산', '산청', '거창', '하동']
        const defaultFacilities = ['편백의 숲', '치유의 숲', '치유의 숲', '산청치유의 숲', '항노화힐링랜드', '하동편백자연휴양림']
        const defaultPhones = ['225-4243', '637-6560', '933-3739', '970-7575', '940-7941', '010-4510-8946']
        
        data = {}
        defaultRegions.forEach((regionName, index) => {
          data[regionName] = {
            info: {
              id: `region-${index}`,
              name: regionName,
              facilityName: defaultFacilities[index],
              address: '',
              phone: defaultPhones[index],
              managerName: '',
              managerEmail: '',
              managerPhone: '',
              maxCapacity: 0,
              parkingCapacity: 0
            },
            checklist: {},
            documents: [],
            costs: {
              programFee: 0,
              mealFee: 0,
              facilityFee: 0,
              entranceFee: 0,
              parkingFee: 0,
              other: 0
            }
          }
        })
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      }

      set({ regions: data, loading: false })
    } catch (error) {
      set({ error: '데이터 로드 실패', loading: false })
    }
  },

  updateRegionInfo: (regionName: string, data: Partial<LocalRegion>) => {
    const { regions } = get()
    const updatedRegions = {
      ...regions,
      [regionName]: {
        ...regions[regionName],
        info: {
          ...regions[regionName].info,
          ...data
        }
      }
    }
    
    set({ regions: updatedRegions })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegions))
  },

  updateChecklistItem: (regionName: string, sectionName: string, itemName: string, data: Partial<ChecklistData[string][string]>) => {
    const { regions } = get()
    const region = regions[regionName]
    
    if (!region.checklist[sectionName]) {
      region.checklist[sectionName] = {}
    }
    
    if (!region.checklist[sectionName][itemName]) {
      region.checklist[sectionName][itemName] = {
        completed: false,
        inputValue: '',
        notes: '',
        priority: 'normal'
      }
    }

    const updatedRegions = {
      ...regions,
      [regionName]: {
        ...region,
        checklist: {
          ...region.checklist,
          [sectionName]: {
            ...region.checklist[sectionName],
            [itemName]: {
              ...region.checklist[sectionName][itemName],
              ...data
            }
          }
        }
      }
    }
    
    set({ regions: updatedRegions })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegions))
  },

  addDocument: (regionName: string, file: File) => {
    const { regions } = get()
    const newDoc: DocumentData = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString()
    }

    const updatedRegions = {
      ...regions,
      [regionName]: {
        ...regions[regionName],
        documents: [...regions[regionName].documents, newDoc]
      }
    }
    
    set({ regions: updatedRegions })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegions))
  },

  removeDocument: (regionName: string, documentId: string) => {
    const { regions } = get()
    const updatedRegions = {
      ...regions,
      [regionName]: {
        ...regions[regionName],
        documents: regions[regionName].documents.filter(doc => doc.id !== documentId)
      }
    }
    
    set({ regions: updatedRegions })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegions))
  },

  getRegionProgress: (regionName: string) => {
    const { regions } = get()
    const region = regions[regionName]
    
    if (!region) return { completed: 0, total: 0, percentage: 0 }

    let total = 0
    let completed = 0

    Object.values(region.checklist).forEach(section => {
      Object.values(section).forEach(item => {
        total++
        if (item.completed) completed++
      })
    })

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  },

  exportData: () => {
    const { regions } = get()
    const dataStr = JSON.stringify(regions, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `forest-education-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    
    URL.revokeObjectURL(url)
  },

  importData: (data: any) => {
    try {
      set({ regions: data })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      set({ error: '데이터 가져오기 실패' })
    }
  }
}))

// 자동 저장 (5초마다)
setInterval(() => {
  const data = useLocalDataStore.getState().regions
  if (Object.keys(data).length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}, 5000)