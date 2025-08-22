import { create } from 'zustand'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface AuthStore {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: 'Supabase가 설정되지 않았습니다.' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      set({ user: data.user, session: data.session })
      return {}
    } catch (error) {
      return { error: '로그인 중 오류가 발생했습니다.' }
    }
  },

  signUp: async (email: string, password: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: 'Supabase가 설정되지 않았습니다.' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: '회원가입 중 오류가 발생했습니다.' }
    }
  },

  signOut: async () => {
    if (!isSupabaseConfigured() || !supabase) return

    try {
      await supabase.auth.signOut()
      set({ user: null, session: null })
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  },

  initialize: async () => {
    try {
      if (!isSupabaseConfigured() || !supabase) {
        set({ loading: false })
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      
      set({ 
        user: session?.user ?? null, 
        session,
        loading: false 
      })

      // 인증 상태 변경 감지
      supabase.auth.onAuthStateChange((event, session) => {
        set({
          user: session?.user ?? null,
          session,
          loading: false
        })
      })
    } catch (error) {
      console.error('인증 초기화 오류:', error)
      set({ loading: false })
    }
  },
}))