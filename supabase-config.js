// Supabase 설정 파일
// 실제 사용시 이 값들을 본인의 Supabase 프로젝트 정보로 변경하세요

const SUPABASE_CONFIG = {
    // Supabase 프로젝트 URL (예: https://your-project.supabase.co)
    url: 'YOUR_SUPABASE_URL',
    
    // Supabase anon key
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
    
    // Storage bucket name for file uploads
    storageBucket: 'forest-education-files'
};

// Supabase 클라이언트 초기화
let supabase = null;

// Supabase 초기화 함수
function initializeSupabase() {
    if (typeof window !== 'undefined' && window.supabase) {
        try {
            supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('Supabase 클라이언트가 초기화되었습니다.');
            return true;
        } catch (error) {
            console.error('Supabase 초기화 실패:', error);
            return false;
        }
    } else {
        console.warn('Supabase 라이브러리가 로드되지 않았습니다.');
        return false;
    }
}

// 인증 상태 확인
async function checkAuthState() {
    if (!supabase) return null;
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        return null;
    }
}

// 사용자 로그인
async function signIn(email, password) {
    if (!supabase) return { success: false, error: 'Supabase가 초기화되지 않았습니다.' };
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        // 로그인 성공 후 사용자 데이터 초기화
        await initializeUserDataIfNeeded();
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// 사용자 회원가입
async function signUp(email, password) {
    if (!supabase) return { success: false, error: 'Supabase가 초기화되지 않았습니다.' };
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// 로그아웃
async function signOut() {
    if (!supabase) return { success: false, error: 'Supabase가 초기화되지 않았습니다.' };
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// 사용자 데이터 초기화 (신규 사용자인 경우)
async function initializeUserDataIfNeeded() {
    if (!supabase) return;
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // 기존 지역 데이터 확인
        const { data: existingRegions } = await supabase
            .from('regions')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);
        
        // 기존 데이터가 없으면 초기화
        if (!existingRegions || existingRegions.length === 0) {
            const { error } = await supabase
                .rpc('initialize_user_data', { user_uuid: user.id });
            
            if (error) {
                console.error('사용자 데이터 초기화 실패:', error);
            } else {
                console.log('사용자 데이터가 초기화되었습니다.');
            }
        }
    } catch (error) {
        console.error('사용자 데이터 초기화 오류:', error);
    }
}

// 현재 사용자 정보 가져오기
async function getCurrentUser() {
    if (!supabase) return null;
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        return null;
    }
}

// 연결 상태 확인
function isSupabaseConnected() {
    return supabase !== null && SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL';
}