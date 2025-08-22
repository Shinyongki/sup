-- Supabase Database Schema for Forest Education Management System

-- 1. 지역 정보 테이블
CREATE TABLE regions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    facility_name VARCHAR(200),
    address TEXT,
    phone VARCHAR(20),
    manager_name VARCHAR(100),
    manager_email VARCHAR(100),
    manager_phone VARCHAR(20),
    max_capacity INTEGER DEFAULT 0,
    parking_capacity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- 2. 체크리스트 아이템 테이블
CREATE TABLE checklist_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    section_name VARCHAR(100) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    input_value TEXT,
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- 3. 비용 정보 테이블
CREATE TABLE region_costs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    program_fee INTEGER DEFAULT 0,
    meal_fee INTEGER DEFAULT 0,
    facility_fee INTEGER DEFAULT 0,
    other_fee INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- 4. 문서 정보 테이블
CREATE TABLE documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT,
    file_type VARCHAR(100),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    user_id UUID REFERENCES auth.users(id)
);

-- 5. 일정 정보 테이블
CREATE TABLE schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    status VARCHAR(20) DEFAULT 'planned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- 6. 사용자 설정 테이블
CREATE TABLE user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE region_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 사용자별 데이터 접근 정책
CREATE POLICY "Users can only access their own regions" ON regions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own checklist items" ON checklist_items
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own costs" ON region_costs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own documents" ON documents
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own schedules" ON schedules
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 설정
CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON regions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklist_items_updated_at BEFORE UPDATE ON checklist_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_region_costs_updated_at BEFORE UPDATE ON region_costs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 기본 지역 데이터 삽입을 위한 함수
CREATE OR REPLACE FUNCTION initialize_user_data(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    region_names TEXT[] := ARRAY['창원', '거제도', '오도산', '산청', '거창', '하동'];
    facility_names TEXT[] := ARRAY['편백의 숲', '치유의 숲', '치유의 숲', '(확인필요)', '항노화힐링랜드', '(확인필요)'];
    phone_numbers TEXT[] := ARRAY['225-4243', '637-6560', '933-3739', '970-7575', '940-7941', '(확인필요)'];
    region_uuid UUID;
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        INSERT INTO regions (name, facility_name, phone, user_id)
        VALUES (region_names[i], facility_names[i], phone_numbers[i], user_uuid)
        RETURNING id INTO region_uuid;
        
        -- 기본 비용 정보 삽입
        INSERT INTO region_costs (region_id, user_id)
        VALUES (region_uuid, user_uuid);
    END LOOP;
END;
$$ LANGUAGE plpgsql;