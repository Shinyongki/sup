import { createClient } from '@supabase/supabase-js'

// Supabase 설정 - 실제 사용시 환경변수로 관리하세요
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'example-anon-key'

// 유틸리티 함수를 먼저 정의
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'YOUR_SUPABASE_URL' && 
         supabaseUrl !== 'https://example.supabase.co' &&
         supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
         supabaseAnonKey !== 'example-anon-key' &&
         supabaseUrl.includes('supabase.co')
}

// Supabase 클라이언트 생성 (유효한 URL인 경우에만)
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

// 데이터베이스 타입 정의
export interface Region {
  id: string
  name: string
  facility_name?: string
  address?: string
  phone?: string
  manager_name?: string
  manager_email?: string
  manager_phone?: string
  max_capacity: number
  parking_capacity: number
  created_at: string
  updated_at: string
  user_id: string
}

export interface ChecklistItem {
  id: string
  region_id: string
  section_name: string
  item_name: string
  is_completed: boolean
  notes?: string
  input_value?: string
  due_date?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  created_at: string
  updated_at: string
  user_id: string
}

export interface RegionCost {
  id: string
  region_id: string
  program_fee: number
  meal_fee: number
  facility_fee: number
  other_fee: number
  notes?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface Document {
  id: string
  region_id: string
  name: string
  file_path?: string
  file_size: number
  file_type: string
  upload_date: string
  description?: string
  user_id: string
}

export interface Schedule {
  id: string
  region_id: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  start_time?: string
  end_time?: string
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  user_id: string
}

