// 클라우드 데이터 저장소 (Supabase) 함수들

// 지역 데이터 관련 함수들
class CloudDataManager {
    constructor() {
        this.isOnline = false;
        this.syncQueue = [];
    }

    // 온라인 상태 확인
    async checkConnection() {
        try {
            if (!supabase) {
                this.isOnline = false;
                return false;
            }
            
            const session = await checkAuthState();
            this.isOnline = !!session;
            return this.isOnline;
        } catch (error) {
            console.error('연결 확인 실패:', error);
            this.isOnline = false;
            return false;
        }
    }

    // 모든 지역 데이터 가져오기
    async getAllRegions() {
        try {
            if (!await this.checkConnection()) {
                throw new Error('오프라인 상태입니다.');
            }

            const { data, error } = await supabase
                .from('regions')
                .select(`
                    *,
                    region_costs(*),
                    checklist_items(*),
                    documents(*),
                    schedules(*)
                `)
                .order('name');

            if (error) throw error;

            return this.transformRegionData(data);
        } catch (error) {
            console.error('지역 데이터 로드 실패:', error);
            return null;
        }
    }

    // 지역 데이터 변환 (기존 형식에 맞게)
    transformRegionData(supabaseData) {
        const regions = {};

        supabaseData.forEach(region => {
            const regionName = region.name;
            
            regions[regionName] = {
                id: region.id,
                info: {
                    facilityName: region.facility_name || '',
                    address: region.address || '',
                    phone: region.phone || '',
                    managerName: region.manager_name || '',
                    managerEmail: region.manager_email || '',
                    managerPhone: region.manager_phone || '',
                    maxCapacity: region.max_capacity || 0,
                    parkingCapacity: region.parking_capacity || 0
                },
                checklist: this.transformChecklistData(region.checklist_items || []),
                documents: region.documents || [],
                costs: this.transformCostData(region.region_costs?.[0] || {}),
                schedules: region.schedules || []
            };
        });

        return regions;
    }

    // 체크리스트 데이터 변환
    transformChecklistData(checklistItems) {
        const checklist = {};
        
        checklistItems.forEach(item => {
            if (!checklist[item.section_name]) {
                checklist[item.section_name] = {};
            }
            
            checklist[item.section_name][item.item_name] = {
                completed: item.is_completed,
                notes: item.notes || '',
                inputValue: item.input_value || '',
                dueDate: item.due_date,
                priority: item.priority || 'normal',
                id: item.id
            };
        });

        return checklist;
    }

    // 비용 데이터 변환
    transformCostData(costData) {
        return {
            programFee: costData.program_fee || 0,
            mealFee: costData.meal_fee || 0,
            facilityFee: costData.facility_fee || 0,
            other: costData.other_fee || 0,
            notes: costData.notes || ''
        };
    }

    // 지역 정보 저장
    async saveRegionInfo(regionName, regionData) {
        try {
            if (!await this.checkConnection()) {
                this.addToSyncQueue('saveRegionInfo', { regionName, regionData });
                return false;
            }

            const { data, error } = await supabase
                .from('regions')
                .update({
                    facility_name: regionData.info.facilityName,
                    address: regionData.info.address,
                    phone: regionData.info.phone,
                    manager_name: regionData.info.managerName,
                    manager_email: regionData.info.managerEmail,
                    manager_phone: regionData.info.managerPhone,
                    max_capacity: regionData.info.maxCapacity,
                    parking_capacity: regionData.info.parkingCapacity,
                    updated_at: new Date().toISOString()
                })
                .eq('name', regionName)
                .eq('user_id', (await getCurrentUser()).id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('지역 정보 저장 실패:', error);
            return false;
        }
    }

    // 체크리스트 항목 저장/업데이트
    async saveChecklistItem(regionName, sectionName, itemName, itemData) {
        try {
            if (!await this.checkConnection()) {
                this.addToSyncQueue('saveChecklistItem', { regionName, sectionName, itemName, itemData });
                return false;
            }

            const user = await getCurrentUser();
            if (!user) throw new Error('사용자 인증이 필요합니다.');

            // 지역 ID 가져오기
            const { data: regionData, error: regionError } = await supabase
                .from('regions')
                .select('id')
                .eq('name', regionName)
                .eq('user_id', user.id)
                .single();

            if (regionError) throw regionError;

            // 기존 항목 확인
            const { data: existingItem } = await supabase
                .from('checklist_items')
                .select('id')
                .eq('region_id', regionData.id)
                .eq('section_name', sectionName)
                .eq('item_name', itemName)
                .single();

            const itemPayload = {
                region_id: regionData.id,
                section_name: sectionName,
                item_name: itemName,
                is_completed: itemData.completed || false,
                notes: itemData.notes || '',
                input_value: itemData.inputValue || '',
                due_date: itemData.dueDate || null,
                priority: itemData.priority || 'normal',
                user_id: user.id,
                updated_at: new Date().toISOString()
            };

            let result;
            if (existingItem) {
                // 업데이트
                result = await supabase
                    .from('checklist_items')
                    .update(itemPayload)
                    .eq('id', existingItem.id);
            } else {
                // 새로 생성
                result = await supabase
                    .from('checklist_items')
                    .insert(itemPayload);
            }

            if (result.error) throw result.error;
            return true;
        } catch (error) {
            console.error('체크리스트 저장 실패:', error);
            return false;
        }
    }

    // 비용 정보 저장
    async saveCostData(regionName, costData) {
        try {
            if (!await this.checkConnection()) {
                this.addToSyncQueue('saveCostData', { regionName, costData });
                return false;
            }

            const user = await getCurrentUser();
            const { data: regionData } = await supabase
                .from('regions')
                .select('id')
                .eq('name', regionName)
                .eq('user_id', user.id)
                .single();

            const { error } = await supabase
                .from('region_costs')
                .upsert({
                    region_id: regionData.id,
                    program_fee: costData.programFee || 0,
                    meal_fee: costData.mealFee || 0,
                    facility_fee: costData.facilityFee || 0,
                    other_fee: costData.other || 0,
                    notes: costData.notes || '',
                    user_id: user.id
                });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('비용 정보 저장 실패:', error);
            return false;
        }
    }

    // 파일 업로드
    async uploadFile(regionName, file) {
        try {
            if (!await this.checkConnection()) {
                throw new Error('오프라인 상태에서는 파일 업로드가 불가능합니다.');
            }

            const user = await getCurrentUser();
            const fileName = `${user.id}/${regionName}/${Date.now()}_${file.name}`;

            // Supabase Storage에 파일 업로드
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(SUPABASE_CONFIG.storageBucket)
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 파일 정보를 데이터베이스에 저장
            const { data: regionData } = await supabase
                .from('regions')
                .select('id')
                .eq('name', regionName)
                .eq('user_id', user.id)
                .single();

            const { data: docData, error: docError } = await supabase
                .from('documents')
                .insert({
                    region_id: regionData.id,
                    name: file.name,
                    file_path: uploadData.path,
                    file_size: file.size,
                    file_type: file.type,
                    user_id: user.id
                })
                .select()
                .single();

            if (docError) throw docError;

            return {
                success: true,
                document: docData
            };
        } catch (error) {
            console.error('파일 업로드 실패:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 파일 다운로드 URL 생성
    async getFileDownloadUrl(filePath) {
        try {
            if (!await this.checkConnection()) return null;

            const { data } = await supabase.storage
                .from(SUPABASE_CONFIG.storageBucket)
                .createSignedUrl(filePath, 3600); // 1시간 유효

            return data?.signedUrl || null;
        } catch (error) {
            console.error('파일 URL 생성 실패:', error);
            return null;
        }
    }

    // 파일 삭제
    async deleteFile(regionName, documentId, filePath) {
        try {
            if (!await this.checkConnection()) return false;

            // Storage에서 파일 삭제
            const { error: storageError } = await supabase.storage
                .from(SUPABASE_CONFIG.storageBucket)
                .remove([filePath]);

            if (storageError) console.warn('Storage 파일 삭제 실패:', storageError);

            // 데이터베이스에서 문서 정보 삭제
            const { error: dbError } = await supabase
                .from('documents')
                .delete()
                .eq('id', documentId);

            if (dbError) throw dbError;
            return true;
        } catch (error) {
            console.error('파일 삭제 실패:', error);
            return false;
        }
    }

    // 동기화 대기열에 추가 (오프라인 시)
    addToSyncQueue(operation, data) {
        this.syncQueue.push({
            operation,
            data,
            timestamp: Date.now()
        });
        
        // 로컬 스토리지에 임시 저장
        localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    }

    // 온라인 복구 시 동기화 실행
    async processSyncQueue() {
        if (!await this.checkConnection()) return;

        const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
        const processedItems = [];

        for (const item of queue) {
            try {
                switch (item.operation) {
                    case 'saveRegionInfo':
                        await this.saveRegionInfo(item.data.regionName, item.data.regionData);
                        break;
                    case 'saveChecklistItem':
                        await this.saveChecklistItem(
                            item.data.regionName,
                            item.data.sectionName,
                            item.data.itemName,
                            item.data.itemData
                        );
                        break;
                    case 'saveCostData':
                        await this.saveCostData(item.data.regionName, item.data.costData);
                        break;
                }
                processedItems.push(item);
            } catch (error) {
                console.error('동기화 항목 처리 실패:', error);
            }
        }

        // 처리된 항목들을 큐에서 제거
        this.syncQueue = queue.filter(item => !processedItems.includes(item));
        localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));

        console.log(`${processedItems.length}개 항목이 동기화되었습니다.`);
    }

    // 실시간 동기화 설정
    setupRealtimeSync() {
        if (!supabase) return;

        // 지역 정보 변경 감지
        supabase
            .channel('regions-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'regions' }, 
                (payload) => {
                    console.log('지역 정보 변경 감지:', payload);
                    this.handleRealtimeUpdate('regions', payload);
                })
            .subscribe();

        // 체크리스트 변경 감지
        supabase
            .channel('checklist-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist_items' }, 
                (payload) => {
                    console.log('체크리스트 변경 감지:', payload);
                    this.handleRealtimeUpdate('checklist', payload);
                })
            .subscribe();
    }

    // 실시간 업데이트 처리
    handleRealtimeUpdate(type, payload) {
        // UI 업데이트 이벤트 발생
        window.dispatchEvent(new CustomEvent('dataUpdated', {
            detail: { type, payload }
        }));
    }
}

// 전역 인스턴스 생성
const cloudDataManager = new CloudDataManager();