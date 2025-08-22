import { create } from 'zustand'
import { supabase, isSupabaseConfigured, Region, ChecklistItem, RegionCost, Document } from '@/lib/supabase'

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

interface DataStore {
  regions: Region[]
  checklistItems: ChecklistItem[]
  costs: RegionCost[]
  documents: Document[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchAllData: () => Promise<void>
  updateChecklistItem: (regionId: string, sectionName: string, itemName: string, data: Partial<ChecklistItem>) => Promise<void>
  updateRegionInfo: (regionId: string, data: Partial<Region>) => Promise<void>
  uploadDocument: (regionId: string, file: File) => Promise<void>
  getRegionProgress: (regionId: string) => { completed: number; total: number; percentage: number }
}

export const useDataStore = create<DataStore>((set, get) => ({
  regions: [],
  checklistItems: [],
  costs: [],
  documents: [],
  loading: false,
  error: null,

  fetchAllData: async () => {
    set({ loading: true, error: null })
    
    try {
      // 병렬로 모든 데이터 가져오기
      const [regionsRes, checklistRes, costsRes, documentsRes] = await Promise.all([
        supabase.from('regions').select('*').order('name'),
        supabase.from('checklist_items').select('*'),
        supabase.from('region_costs').select('*'),
        supabase.from('documents').select('*')
      ])

      if (regionsRes.error) throw regionsRes.error
      if (checklistRes.error) throw checklistRes.error
      if (costsRes.error) throw costsRes.error
      if (documentsRes.error) throw documentsRes.error

      set({
        regions: regionsRes.data || [],
        checklistItems: checklistRes.data || [],
        costs: costsRes.data || [],
        documents: documentsRes.data || [],
        loading: false
      })

      // 기본 지역이 없으면 생성
      if (regionsRes.data?.length === 0) {
        await get().initializeDefaultRegions()
      }

    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  initializeDefaultRegions: async () => {
    const defaultRegions = [
      { name: '창원', facility_name: '편백의 숲', phone: '225-4243' },
      { name: '거제도', facility_name: '치유의 숲', phone: '637-6560' },
      { name: '오도산', facility_name: '치유의 숲', phone: '933-3739' },
      { name: '산청', facility_name: '(확인필요)', phone: '970-7575' },
      { name: '거창', facility_name: '항노화힐링랜드', phone: '940-7941' },
      { name: '하동', facility_name: '(확인필요)', phone: '(확인필요)' }
    ]

    try {
      const { data: newRegions, error } = await supabase
        .from('regions')
        .insert(defaultRegions.map(region => ({
          ...region,
          max_capacity: 0,
          parking_capacity: 0
        })))
        .select()

      if (error) throw error

      // 각 지역에 대한 기본 비용 정보 생성
      if (newRegions) {
        const costsData = newRegions.map(region => ({
          region_id: region.id,
          program_fee: 0,
          meal_fee: 0,
          facility_fee: 0,
          other_fee: 0
        }))

        await supabase.from('region_costs').insert(costsData)
      }

      // 데이터 새로고침
      await get().fetchAllData()
    } catch (error) {
      console.error('기본 지역 생성 실패:', error)
    }
  },

  updateChecklistItem: async (regionId: string, sectionName: string, itemName: string, data: Partial<ChecklistItem>) => {
    try {
      const existingItem = get().checklistItems.find(
        item => item.region_id === regionId && 
                item.section_name === sectionName && 
                item.item_name === itemName
      )

      if (existingItem) {
        // 업데이트
        const { error } = await supabase
          .from('checklist_items')
          .update(data)
          .eq('id', existingItem.id)

        if (error) throw error

        // 로컬 상태 업데이트
        set(state => ({
          checklistItems: state.checklistItems.map(item =>
            item.id === existingItem.id ? { ...item, ...data } : item
          )
        }))
      } else {
        // 새로 생성
        const { data: newItem, error } = await supabase
          .from('checklist_items')
          .insert({
            region_id: regionId,
            section_name: sectionName,
            item_name: itemName,
            is_completed: false,
            priority: 'normal' as const,
            ...data
          })
          .select()
          .single()

        if (error) throw error

        // 로컬 상태 업데이트
        set(state => ({
          checklistItems: [...state.checklistItems, newItem]
        }))
      }
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateRegionInfo: async (regionId: string, data: Partial<Region>) => {
    try {
      const { error } = await supabase
        .from('regions')
        .update(data)
        .eq('id', regionId)

      if (error) throw error

      // 로컬 상태 업데이트
      set(state => ({
        regions: state.regions.map(region =>
          region.id === regionId ? { ...region, ...data } : region
        )
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  uploadDocument: async (regionId: string, file: File) => {
    try {
      const fileName = `${Date.now()}_${file.name}`
      const filePath = `${regionId}/${fileName}`

      // 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from('forest-education-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 문서 정보 저장
      const { data: newDoc, error: dbError } = await supabase
        .from('documents')
        .insert({
          region_id: regionId,
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type
        })
        .select()
        .single()

      if (dbError) throw dbError

      // 로컬 상태 업데이트
      set(state => ({
        documents: [...state.documents, newDoc]
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  getRegionProgress: (regionId: string) => {
    const items = get().checklistItems.filter(item => item.region_id === regionId)
    const completed = items.filter(item => item.is_completed).length
    const total = items.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
  }
}))