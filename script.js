// 전역 변수
let currentRegion = '';
let appData = {
    regions: {
        '창원': {
            info: {
                facilityName: '편백의 숲',
                address: '',
                phone: '225-4243',
                managerName: '',
                managerEmail: '',
                maxCapacity: 50,
                parkingCapacity: 20
            },
            checklist: {},
            documents: [],
            costs: {
                programFee: 15000,
                mealFee: 8000,
                facilityFee: 5000,
                other: 0
            },
            schedule: null
        },
        '거제도': {
            info: {
                facilityName: '치유의 숲',
                address: '',
                phone: '637-6560',
                managerName: '',
                managerEmail: '',
                maxCapacity: 0,
                parkingCapacity: 0
            },
            checklist: {},
            documents: [],
            costs: {
                programFee: 20000,
                mealFee: 8000,
                facilityFee: 0,
                other: 2000
            },
            schedule: null
        },
        '오도산': {
            info: {
                facilityName: '치유의 숲',
                address: '',
                phone: '933-3739',
                managerName: '',
                managerEmail: '',
                maxCapacity: 0,
                parkingCapacity: 0
            },
            checklist: {},
            documents: [],
            costs: {
                programFee: 18000,
                mealFee: 7000,
                facilityFee: 3000,
                other: 0
            },
            schedule: null
        },
        '산청': {
            info: {
                facilityName: '(확인필요)',
                address: '',
                phone: '970-7575',
                managerName: '',
                managerEmail: '',
                maxCapacity: 0,
                parkingCapacity: 0
            },
            checklist: {},
            documents: [],
            costs: {
                programFee: 0,
                mealFee: 0,
                facilityFee: 0,
                other: 0
            },
            schedule: null
        },
        '거창': {
            info: {
                facilityName: '항노화힐링랜드',
                address: '',
                phone: '940-7941',
                managerName: '',
                managerEmail: '',
                maxCapacity: 0,
                parkingCapacity: 0
            },
            checklist: {},
            documents: [],
            costs: {
                programFee: 15000,
                mealFee: 8000,
                facilityFee: 0,
                other: 0
            },
            schedule: null
        },
        '하동': {
            info: {
                facilityName: '(확인필요)',
                address: '',
                phone: '(확인필요)',
                managerName: '',
                managerEmail: '',
                maxCapacity: 0,
                parkingCapacity: 0
            },
            checklist: {},
            documents: [],
            costs: {
                programFee: 0,
                mealFee: 0,
                facilityFee: 0,
                other: 0
            },
            schedule: null
        }
    },
    lastUpdated: new Date().toISOString(),
    version: '1.0'
};

// 체크리스트 템플릿 (입력란 포함)
const checklistTemplate = {
    '시설 정보 확인': [
        { 
            name: '시설명 및 정확한 주소 확인',
            hasInput: true,
            inputType: 'text',
            placeholder: '정확한 주소를 입력하세요'
        },
        { 
            name: '최대 수용 인원 확인',
            hasInput: true,
            inputType: 'number',
            placeholder: '최대 수용 인원 (명)'
        },
        { 
            name: '시설 사진 및 안내자료 수령',
            hasInput: true,
            inputType: 'textarea',
            placeholder: '수령한 자료 목록을 입력하세요'
        },
        { 
            name: '입장료/이용료 정확한 금액',
            hasInput: true,
            inputType: 'number',
            placeholder: '금액 (원)'
        },
        { 
            name: '주차비 유무 및 요금 확인',
            hasInput: true,
            inputType: 'text',
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
            inputType: 'text',
            placeholder: '프로그램 내용을 입력하세요'
        },
        { 
            name: '10:00-11:00 프로그램 계획',
            hasInput: true,
            inputType: 'text',
            placeholder: '프로그램 내용을 입력하세요'
        },
        { 
            name: '11:00-12:00 프로그램 계획',
            hasInput: true,
            inputType: 'text',
            placeholder: '프로그램 내용을 입력하세요'
        },
        { 
            name: '13:00-14:00 프로그램 계획',
            hasInput: true,
            inputType: 'text',
            placeholder: '프로그램 내용을 입력하세요'
        },
        { 
            name: '14:00-15:00 프로그램 계획',
            hasInput: true,
            inputType: 'text',
            placeholder: '프로그램 내용을 입력하세요'
        },
        { 
            name: '15:00-16:00 프로그램 계획',
            hasInput: true,
            inputType: 'text',
            placeholder: '프로그램 내용을 입력하세요'
        },
        { 
            name: '조별 운영 계획 수립 (A조/B조)',
            hasInput: true,
            inputType: 'textarea',
            placeholder: 'A조, B조 운영 계획을 입력하세요'
        },
        { 
            name: '강사 정보 확인 (자격증, 경력)',
            hasInput: true,
            inputType: 'textarea',
            placeholder: '강사명, 자격증, 경력 등을 입력하세요'
        }
    ],
    '비용 및 견적': [
        { 
            name: '공식 견적서 수령',
            hasInput: true,
            inputType: 'text',
            placeholder: '견적서 수령일 또는 담당자'
        },
        { 
            name: '프로그램 비용 확정',
            hasInput: true,
            inputType: 'number',
            placeholder: '1인당 프로그램 비용 (원)'
        },
        { 
            name: '식비 확정 (중식, 간식)',
            hasInput: true,
            inputType: 'text',
            placeholder: '중식: 8000원, 간식: 2000원'
        },
        { 
            name: '총 예산 계산 완료',
            hasInput: true,
            inputType: 'number',
            placeholder: '총 예산 (원)'
        }
    ],
    '식사 및 편의시설': [
        { 
            name: '급식업체 정보 확인',
            hasInput: true,
            inputType: 'text',
            placeholder: '업체명 및 연락처'
        },
        { 
            name: '식사 제공 시간 및 장소 확정',
            hasInput: true,
            inputType: 'text',
            placeholder: '시간: 12:00-13:00, 장소: 식당동'
        },
        { 
            name: '음식물쓰레기 처리 방법 안내',
            hasInput: true,
            inputType: 'textarea',
            placeholder: '처리 방법 및 주의사항'
        },
        { 
            name: '분리수거 방법 안내',
            hasInput: true,
            inputType: 'textarea',
            placeholder: '분리수거 방법 및 위치'
        }
    ],
    '최종 확인': [
        { 
            name: '교육기관과 최종 일정 확인',
            hasInput: true,
            inputType: 'date',
            placeholder: '확정 날짜'
        },
        { 
            name: '당일 긴급 연락체계 구축',
            hasInput: true,
            inputType: 'text',
            placeholder: '긴급연락처 및 담당자'
        },
        { 
            name: '보험 가입 여부 확인',
            hasInput: true,
            inputType: 'text',
            placeholder: '보험사, 보험금액 등'
        },
        { 
            name: '우천시 대체 프로그램 준비',
            hasInput: true,
            inputType: 'textarea',
            placeholder: '대체 프로그램 계획'
        }
    ]
};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeChecklistForAllRegions();
    showPage('dashboard');
    updateDashboard();
    setInterval(autoSave, 30000); // 30초마다 자동 저장
});

// 데이터 로드
function loadData() {
    const savedData = localStorage.getItem('forestEducationData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            appData = { ...appData, ...parsedData };
        } catch (e) {
            console.error('데이터 로드 실패:', e);
        }
    }
}

// 데이터 저장
function saveData() {
    try {
        appData.lastUpdated = new Date().toISOString();
        localStorage.setItem('forestEducationData', JSON.stringify(appData));
        return true;
    } catch (e) {
        console.error('데이터 저장 실패:', e);
        return false;
    }
}

// 자동 저장
function autoSave() {
    saveData();
}

// 모든 지역의 체크리스트 초기화
function initializeChecklistForAllRegions() {
    Object.keys(appData.regions).forEach(region => {
        if (Object.keys(appData.regions[region].checklist).length === 0) {
            appData.regions[region].checklist = {};
            Object.keys(checklistTemplate).forEach(section => {
                appData.regions[region].checklist[section] = {};
                checklistTemplate[section].forEach(item => {
                    const itemName = typeof item === 'string' ? item : item.name;
                    appData.regions[region].checklist[section][itemName] = {
                        completed: false,
                        inputValue: '',
                        notes: '',
                        dueDate: null,
                        priority: 'normal'
                    };
                });
            });
        }
    });
}

// 페이지 표시
function showPage(pageId) {
    // 모든 페이지 숨김
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 모든 네비게이션 링크 비활성화
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 선택된 페이지 표시
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 해당 네비게이션 링크 활성화
    const navLink = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    // 페이지별 특별 로직
    switch (pageId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'checklist':
            updateGlobalChecklist();
            break;
        case 'documents':
            updateGlobalDocuments();
            break;
        case 'costs':
            updateCostTable();
            break;
        case 'schedule':
            updateCalendar();
            break;
        case 'contacts':
            updateContactsTable();
            break;
    }
}

// 서브메뉴 토글
function toggleSubmenu(menuId) {
    const submenu = document.getElementById(`${menuId}-submenu`);
    const arrow = document.querySelector(`[onclick="toggleSubmenu('${menuId}')"] .submenu-arrow`);
    
    if (submenu.classList.contains('open')) {
        submenu.classList.remove('open');
        arrow.style.transform = 'rotate(0deg)';
    } else {
        // 다른 서브메뉴 닫기
        document.querySelectorAll('.submenu').forEach(sub => {
            sub.classList.remove('open');
        });
        document.querySelectorAll('.submenu-arrow').forEach(arr => {
            arr.style.transform = 'rotate(0deg)';
        });
        
        submenu.classList.add('open');
        arrow.style.transform = 'rotate(180deg)';
    }
}

// 대시보드 업데이트
function updateDashboard() {
    const regionsGrid = document.getElementById('regions-grid');
    const urgentList = document.getElementById('urgent-list');
    
    regionsGrid.innerHTML = '';
    urgentList.innerHTML = '';
    
    let totalProgress = 0;
    let totalItems = 0;
    let completedItems = 0;
    let urgentItems = [];
    
    Object.keys(appData.regions).forEach(regionName => {
        const region = appData.regions[regionName];
        const progress = calculateRegionProgress(regionName);
        
        totalProgress += progress.percentage;
        totalItems += progress.total;
        completedItems += progress.completed;
        
        // 긴급 항목 확인
        if (progress.percentage < 20) {
            urgentItems.push(`${regionName} - 진행률 매우 낮음 (${progress.percentage}%)`);
        }
        if (!region.info.facilityName || region.info.facilityName.includes('확인필요')) {
            urgentItems.push(`${regionName} - 시설명 확인 필요`);
        }
        if (!region.info.phone || region.info.phone.includes('확인필요')) {
            urgentItems.push(`${regionName} - 연락처 확인 필요`);
        }
        
        // 지역 카드 생성
        const card = createRegionCard(regionName, region, progress);
        regionsGrid.appendChild(card);
    });
    
    // 전체 통계 업데이트
    const overallProgress = Math.round(totalProgress / 6);
    document.getElementById('overall-progress').textContent = `${overallProgress}%`;
    document.getElementById('completed-items').textContent = `${completedItems}/${totalItems}`;
    document.getElementById('pending-regions').textContent = Object.keys(appData.regions).filter(r => calculateRegionProgress(r).percentage < 100).length;
    
    // 긴급 항목 표시
    if (urgentItems.length === 0) {
        urgentList.innerHTML = '<li>긴급 확인이 필요한 항목이 없습니다. ✅</li>';
    } else {
        urgentItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `• ${item}`;
            urgentList.appendChild(li);
        });
    }
}

// 지역 카드 생성
function createRegionCard(regionName, region, progress) {
    const card = document.createElement('div');
    card.className = 'region-card';
    card.onclick = () => showRegionDetail(regionName);
    
    const progressClass = progress.percentage >= 80 ? 'high' : 
                         progress.percentage >= 40 ? 'medium' : 'low';
    
    card.innerHTML = `
        <div class="region-card-header">
            <div class="region-name">${regionName}</div>
            <div class="facility-name">${region.info.facilityName || '시설명 미정'}</div>
        </div>
        <div class="region-card-body">
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill ${progressClass}" style="width: ${progress.percentage}%"></div>
                </div>
                <div class="progress-text">${progress.percentage}% (${progress.completed}/${progress.total})</div>
            </div>
            <div class="region-stats">
                <div class="stat-item">수용인원: ${region.info.maxCapacity || '미정'}명</div>
                <div class="stat-item">연락처: ${region.info.phone || '미정'}</div>
            </div>
            <div class="region-actions">
                <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); showRegionDetail('${regionName}')">
                    <i class="fas fa-edit"></i> 관리
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// 지역별 진행률 계산
function calculateRegionProgress(regionName) {
    const region = appData.regions[regionName];
    if (!region || !region.checklist) {
        return { percentage: 0, completed: 0, total: 0 };
    }
    
    let total = 0;
    let completed = 0;
    
    Object.keys(region.checklist).forEach(section => {
        Object.keys(region.checklist[section]).forEach(item => {
            total++;
            const itemData = region.checklist[section][item];
            if (typeof itemData === 'boolean' ? itemData : itemData.completed) {
                completed++;
            }
        });
    });
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { percentage, completed, total };
}

// 지역 상세 표시
function showRegionDetail(regionName) {
    currentRegion = regionName;
    document.getElementById('region-title').textContent = `${regionName} 상세 관리`;
    
    // 기본 정보 로드
    loadRegionInfo(regionName);
    
    // 체크리스트 로드
    loadRegionChecklist(regionName);
    
    // 문서 목록 로드
    loadRegionDocuments(regionName);
    
    showPage('region-detail');
    showTab('info');
}

// 지역 정보 로드
function loadRegionInfo(regionName) {
    const region = appData.regions[regionName];
    
    document.getElementById('facility-name').value = region.info.facilityName || '';
    document.getElementById('address').value = region.info.address || '';
    document.getElementById('phone').value = region.info.phone || '';
    document.getElementById('manager-name').value = region.info.managerName || '';
    document.getElementById('manager-email').value = region.info.managerEmail || '';
    document.getElementById('max-capacity').value = region.info.maxCapacity || '';
    document.getElementById('parking-capacity').value = region.info.parkingCapacity || '';
}

// 지역 체크리스트 로드
function loadRegionChecklist(regionName) {
    const container = document.getElementById('checklist-container');
    const region = appData.regions[regionName];
    
    container.innerHTML = '';
    
    Object.keys(checklistTemplate).forEach(sectionName => {
        const section = document.createElement('div');
        section.className = 'checklist-section';
        
        const sectionTitle = document.createElement('h4');
        sectionTitle.textContent = sectionName;
        section.appendChild(sectionTitle);
        
        checklistTemplate[sectionName].forEach(itemTemplate => {
            const itemName = typeof itemTemplate === 'string' ? itemTemplate : itemTemplate.name;
            const itemData = region.checklist[sectionName] && region.checklist[sectionName][itemName] ? 
                            region.checklist[sectionName][itemName] : 
                            { completed: false, inputValue: '', notes: '', dueDate: null, priority: 'normal' };
            
            const item = document.createElement('div');
            item.className = 'checklist-item';
            
            // 체크박스와 라벨 컨테이너
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'checkbox-container';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${sectionName}-${itemName}`;
            checkbox.checked = itemData.completed;
            checkbox.onchange = () => updateChecklistItem(regionName, sectionName, itemName, {
                ...itemData,
                completed: checkbox.checked
            });
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = itemName;
            
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            item.appendChild(checkboxContainer);
            
            // 입력란 추가 (템플릿에 정의된 경우)
            if (typeof itemTemplate === 'object' && itemTemplate.hasInput) {
                const inputContainer = document.createElement('div');
                inputContainer.className = 'input-container';
                
                let inputElement;
                
                switch (itemTemplate.inputType) {
                    case 'textarea':
                        inputElement = document.createElement('textarea');
                        inputElement.rows = 3;
                        break;
                    case 'date':
                        inputElement = document.createElement('input');
                        inputElement.type = 'date';
                        break;
                    case 'number':
                        inputElement = document.createElement('input');
                        inputElement.type = 'number';
                        break;
                    default:
                        inputElement = document.createElement('input');
                        inputElement.type = 'text';
                }
                
                inputElement.className = 'checklist-input';
                inputElement.placeholder = itemTemplate.placeholder || '';
                inputElement.value = itemData.inputValue || '';
                
                inputElement.addEventListener('input', () => {
                    updateChecklistItem(regionName, sectionName, itemName, {
                        ...itemData,
                        inputValue: inputElement.value
                    });
                });
                
                inputContainer.appendChild(inputElement);
                item.appendChild(inputContainer);
            }
            
            // 우선순위 선택기
            const priorityContainer = document.createElement('div');
            priorityContainer.className = 'priority-container';
            
            const prioritySelect = document.createElement('select');
            prioritySelect.className = 'priority-select';
            prioritySelect.innerHTML = `
                <option value="low">낮음</option>
                <option value="normal">보통</option>
                <option value="high">높음</option>
                <option value="urgent">긴급</option>
            `;
            prioritySelect.value = itemData.priority || 'normal';
            
            prioritySelect.addEventListener('change', () => {
                updateChecklistItem(regionName, sectionName, itemName, {
                    ...itemData,
                    priority: prioritySelect.value
                });
                updatePriorityVisual(item, prioritySelect.value);
            });
            
            priorityContainer.appendChild(prioritySelect);
            item.appendChild(priorityContainer);
            
            // 메모 입력란
            const notesContainer = document.createElement('div');
            notesContainer.className = 'notes-container';
            
            const notesTextarea = document.createElement('textarea');
            notesTextarea.className = 'notes-input';
            notesTextarea.placeholder = '메모나 추가 정보를 입력하세요...';
            notesTextarea.value = itemData.notes || '';
            notesTextarea.rows = 2;
            
            notesTextarea.addEventListener('input', () => {
                updateChecklistItem(regionName, sectionName, itemName, {
                    ...itemData,
                    notes: notesTextarea.value
                });
            });
            
            notesContainer.appendChild(notesTextarea);
            item.appendChild(notesContainer);
            
            // 완료 상태 스타일 적용
            if (itemData.completed) {
                item.classList.add('completed');
            }
            
            // 우선순위 스타일 적용
            updatePriorityVisual(item, itemData.priority);
            
            section.appendChild(item);
        });
        
        container.appendChild(section);
    });
    
    updateRegionProgress(regionName);
}

// 체크리스트 항목 업데이트
function updateChecklistItem(regionName, sectionName, itemName, itemData) {
    if (!appData.regions[regionName].checklist[sectionName]) {
        appData.regions[regionName].checklist[sectionName] = {};
    }
    
    appData.regions[regionName].checklist[sectionName][itemName] = itemData;
    
    // UI 업데이트
    const checkbox = document.getElementById(`${sectionName}-${itemName}`);
    if (checkbox) {
        const item = checkbox.closest('.checklist-item');
        
        if (itemData.completed) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
        
        updatePriorityVisual(item, itemData.priority);
    }
    
    updateRegionProgress(regionName);
    
    // 클라우드 동기화 (Supabase 연결된 경우)
    if (cloudDataManager && cloudDataManager.isOnline) {
        cloudDataManager.saveChecklistItem(regionName, sectionName, itemName, itemData);
    }
    
    saveData();
}

// 우선순위 시각적 표시 업데이트
function updatePriorityVisual(itemElement, priority) {
    // 기존 우선순위 클래스 제거
    itemElement.classList.remove('priority-low', 'priority-normal', 'priority-high', 'priority-urgent');
    
    // 새 우선순위 클래스 추가
    if (priority && priority !== 'normal') {
        itemElement.classList.add(`priority-${priority}`);
    }
}

// 지역별 진행률 업데이트
function updateRegionProgress(regionName) {
    const progress = calculateRegionProgress(regionName);
    const progressFill = document.getElementById('region-progress-fill');
    const progressText = document.getElementById('region-progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${progress.percentage}%`;
        progressFill.className = `progress-fill ${progress.percentage >= 80 ? 'high' : progress.percentage >= 40 ? 'medium' : 'low'}`;
        progressText.textContent = `${progress.percentage}% (${progress.completed}/${progress.total})`;
    }
}

// 탭 표시
function showTab(tabName) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 탭 내용 숨김
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택된 탭 활성화
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// 지역 데이터 저장
function saveRegionData() {
    if (!currentRegion) return;
    
    const region = appData.regions[currentRegion];
    
    // 기본 정보 저장
    region.info.facilityName = document.getElementById('facility-name').value;
    region.info.address = document.getElementById('address').value;
    region.info.phone = document.getElementById('phone').value;
    region.info.managerName = document.getElementById('manager-name').value;
    region.info.managerEmail = document.getElementById('manager-email').value;
    region.info.maxCapacity = parseInt(document.getElementById('max-capacity').value) || 0;
    region.info.parkingCapacity = parseInt(document.getElementById('parking-capacity').value) || 0;
    
    if (saveData()) {
        alert('저장되었습니다.');
        updateDashboard();
    } else {
        alert('저장에 실패했습니다.');
    }
}

// 파일 업로드 처리
function handleFileUpload(event) {
    const files = event.target.files;
    if (!currentRegion || !files.length) return;
    
    Array.from(files).forEach(file => {
        const document = {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString(),
            region: currentRegion
        };
        
        appData.regions[currentRegion].documents.push(document);
    });
    
    loadRegionDocuments(currentRegion);
    saveData();
}

// 지역 문서 로드
function loadRegionDocuments(regionName) {
    const container = document.getElementById('document-list');
    const region = appData.regions[regionName];
    
    container.innerHTML = '';
    
    if (region.documents.length === 0) {
        container.innerHTML = '<p>업로드된 문서가 없습니다.</p>';
        return;
    }
    
    region.documents.forEach((doc, index) => {
        const item = document.createElement('div');
        item.className = 'document-item';
        
        item.innerHTML = `
            <i class="fas fa-file"></i>
            <div class="document-info">
                <div class="document-name">${doc.name}</div>
                <div class="document-meta">
                    크기: ${formatFileSize(doc.size)} | 
                    업로드: ${new Date(doc.uploadDate).toLocaleDateString()}
                </div>
            </div>
            <div class="document-actions">
                <button class="btn btn-secondary btn-small" onclick="removeDocument('${regionName}', ${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// 문서 제거
function removeDocument(regionName, index) {
    if (confirm('이 문서를 삭제하시겠습니까?')) {
        appData.regions[regionName].documents.splice(index, 1);
        loadRegionDocuments(regionName);
        saveData();
    }
}

// 파일 크기 포맷팅
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 전체 체크리스트 업데이트
function updateGlobalChecklist() {
    const container = document.getElementById('global-checklist-container');
    container.innerHTML = '';
    
    Object.keys(appData.regions).forEach(regionName => {
        const regionDiv = document.createElement('div');
        regionDiv.className = 'region-checklist';
        regionDiv.style.marginBottom = '2rem';
        
        const progress = calculateRegionProgress(regionName);
        
        regionDiv.innerHTML = `
            <h3 style="color: #2e7d32; border-bottom: 2px solid #e8f5e8; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                ${regionName} - ${appData.regions[regionName].info.facilityName || '시설명 미정'}
                <span style="font-size: 1rem; color: #666; margin-left: 1rem;">${progress.percentage}% (${progress.completed}/${progress.total})</span>
            </h3>
        `;
        
        const checklistDiv = document.createElement('div');
        Object.keys(checklistTemplate).forEach(sectionName => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.marginBottom = '1rem';
            
            const sectionTitle = document.createElement('h4');
            sectionTitle.style.color = '#4caf50';
            sectionTitle.style.marginBottom = '0.5rem';
            sectionTitle.textContent = sectionName;
            sectionDiv.appendChild(sectionTitle);
            
            checklistTemplate[sectionName].forEach(itemName => {
                const itemDiv = document.createElement('div');
                itemDiv.style.marginLeft = '1rem';
                itemDiv.style.marginBottom = '0.25rem';
                
                const isChecked = appData.regions[regionName].checklist[sectionName] && 
                                 appData.regions[regionName].checklist[sectionName][itemName];
                
                itemDiv.innerHTML = `
                    <span style="color: ${isChecked ? '#4caf50' : '#f44336'}; margin-right: 0.5rem;">
                        ${isChecked ? '✓' : '✗'}
                    </span>
                    <span style="${isChecked ? 'text-decoration: line-through; color: #666;' : ''}">${itemName}</span>
                `;
                
                sectionDiv.appendChild(itemDiv);
            });
            
            checklistDiv.appendChild(sectionDiv);
        });
        
        regionDiv.appendChild(checklistDiv);
        container.appendChild(regionDiv);
    });
}

// 전체 문서 업데이트
function updateGlobalDocuments() {
    const container = document.getElementById('global-documents-container');
    container.innerHTML = '';
    
    Object.keys(appData.regions).forEach(regionName => {
        const region = appData.regions[regionName];
        if (region.documents.length > 0) {
            const regionDiv = document.createElement('div');
            regionDiv.style.marginBottom = '2rem';
            
            regionDiv.innerHTML = `
                <h3 style="color: #2e7d32; border-bottom: 2px solid #e8f5e8; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                    📁 ${regionName}
                </h3>
            `;
            
            region.documents.forEach(doc => {
                const docDiv = document.createElement('div');
                docDiv.className = 'document-item';
                docDiv.innerHTML = `
                    <i class="fas fa-file"></i>
                    <div class="document-info">
                        <div class="document-name">${doc.name}</div>
                        <div class="document-meta">
                            크기: ${formatFileSize(doc.size)} | 
                            업로드: ${new Date(doc.uploadDate).toLocaleDateString()}
                        </div>
                    </div>
                `;
                regionDiv.appendChild(docDiv);
            });
            
            container.appendChild(regionDiv);
        }
    });
    
    if (container.innerHTML === '') {
        container.innerHTML = '<p>업로드된 문서가 없습니다.</p>';
    }
}

// 비용 테이블 업데이트
function updateCostTable() {
    const tbody = document.getElementById('cost-table-body');
    tbody.innerHTML = '';
    
    let totalProgram = 0, totalMeal = 0, totalFacility = 0, totalOther = 0, grandTotal = 0;
    
    Object.keys(appData.regions).forEach(regionName => {
        const costs = appData.regions[regionName].costs;
        const total = costs.programFee + costs.mealFee + costs.facilityFee + costs.other;
        
        totalProgram += costs.programFee;
        totalMeal += costs.mealFee;
        totalFacility += costs.facilityFee;
        totalOther += costs.other;
        grandTotal += total;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${regionName}</strong></td>
            <td class="cost-value">${costs.programFee ? costs.programFee.toLocaleString() + '원' : '-'}</td>
            <td class="cost-value">${costs.mealFee ? costs.mealFee.toLocaleString() + '원' : '-'}</td>
            <td class="cost-value">${costs.facilityFee ? costs.facilityFee.toLocaleString() + '원' : '-'}</td>
            <td class="cost-value">${costs.other ? costs.other.toLocaleString() + '원' : '-'}</td>
            <td class="cost-value"><strong>${total ? total.toLocaleString() + '원' : '-'}</strong></td>
        `;
        tbody.appendChild(row);
    });
    
    // 총계 행 추가
    const totalRow = document.createElement('tr');
    totalRow.className = 'cost-total';
    totalRow.innerHTML = `
        <td><strong>총계</strong></td>
        <td class="cost-value"><strong>${totalProgram.toLocaleString()}원</strong></td>
        <td class="cost-value"><strong>${totalMeal.toLocaleString()}원</strong></td>
        <td class="cost-value"><strong>${totalFacility.toLocaleString()}원</strong></td>
        <td class="cost-value"><strong>${totalOther.toLocaleString()}원</strong></td>
        <td class="cost-value"><strong>${grandTotal.toLocaleString()}원</strong></td>
    `;
    tbody.appendChild(totalRow);
}

// 캘린더 업데이트
function updateCalendar() {
    const container = document.getElementById('calendar');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    container.innerHTML = `
        <div style="grid-column: 1 / -1; background: #2e7d32; color: white; padding: 1rem; text-align: center; font-size: 1.2rem; font-weight: bold;">
            ${currentYear}년 ${currentMonth + 1}월
        </div>
        <div class="calendar-header">일</div>
        <div class="calendar-header">월</div>
        <div class="calendar-header">화</div>
        <div class="calendar-header">수</div>
        <div class="calendar-header">목</div>
        <div class="calendar-header">금</div>
        <div class="calendar-header">토</div>
    `;
    
    // 캘린더 일자 생성
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        if (date.getMonth() !== currentMonth) {
            dayDiv.classList.add('other-month');
        }
        
        if (date.toDateString() === today.toDateString()) {
            dayDiv.classList.add('today');
        }
        
        dayDiv.innerHTML = `<div style="font-weight: bold;">${date.getDate()}</div>`;
        
        // 교육 일정 예시 추가 (실제로는 데이터에서 가져와야 함)
        if (date.getDate() === 15 && date.getMonth() === currentMonth) {
            const event = document.createElement('div');
            event.className = 'calendar-event';
            event.textContent = '창원 교육';
            dayDiv.appendChild(event);
        }
        
        container.appendChild(dayDiv);
    }
}

// 연락처 테이블 업데이트
function updateContactsTable() {
    const tbody = document.getElementById('contacts-table-body');
    tbody.innerHTML = '';
    
    Object.keys(appData.regions).forEach(regionName => {
        const region = appData.regions[regionName];
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><strong>${regionName}</strong></td>
            <td>${region.info.facilityName || '미정'}</td>
            <td>${region.info.phone || '미정'}</td>
            <td>${region.info.managerName || '미정'}</td>
            <td>${region.info.managerPhone || '미정'}</td>
            <td>${region.info.managerEmail || '미정'}</td>
            <td class="contact-actions">
                <button class="btn btn-primary btn-icon" onclick="callPhone('${region.info.phone}')" title="전화걸기">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="btn btn-secondary btn-icon" onclick="sendEmail('${region.info.managerEmail}')" title="이메일">
                    <i class="fas fa-envelope"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// 전화걸기
function callPhone(phone) {
    if (phone && phone !== '미정') {
        window.open(`tel:${phone}`);
    } else {
        alert('전화번호가 등록되지 않았습니다.');
    }
}

// 이메일 보내기
function sendEmail(email) {
    if (email && email !== '미정') {
        window.open(`mailto:${email}`);
    } else {
        alert('이메일이 등록되지 않았습니다.');
    }
}

// 보고서 생성
function generateReport(type) {
    let content = '';
    const date = new Date().toLocaleDateString();
    
    switch (type) {
        case 'plan':
            content = generatePlanReport();
            break;
        case 'checklist':
            content = generateChecklistReport();
            break;
        case 'cost':
            content = generateCostReport();
            break;
    }
    
    // 새 창에서 보고서 표시
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <html>
            <head>
                <title>${getReportTitle(type)} - ${date}</title>
                <style>
                    body { font-family: 'Malgun Gothic', sans-serif; margin: 2rem; line-height: 1.6; }
                    h1 { color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 0.5rem; }
                    h2 { color: #4caf50; margin-top: 2rem; }
                    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
                    th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
                    th { background-color: #f5f5f5; font-weight: bold; }
                    .completed { color: #4caf50; }
                    .pending { color: #f44336; }
                    @media print { body { margin: 1rem; } }
                </style>
            </head>
            <body>
                ${content}
                <script>window.print();</script>
            </body>
        </html>
    `);
}

function getReportTitle(type) {
    switch (type) {
        case 'plan': return '노인맞춤돌봄서비스 숲문화체험 교육 계획서';
        case 'checklist': return '체크리스트 현황 보고서';
        case 'cost': return '비용 내역서';
        default: return '보고서';
    }
}

function generatePlanReport() {
    const date = new Date().toLocaleDateString();
    let content = `
        <h1>노인맞춤돌봄서비스 숲문화체험 교육 계획서</h1>
        <p><strong>작성일:</strong> ${date}</p>
        <p><strong>담당자:</strong> 교육 담당 실무자</p>
        
        <h2>1. 교육 개요</h2>
        <p>노인맞춤돌봄서비스 대상자를 위한 숲문화체험 교육을 6개 지역에서 실시합니다.</p>
        
        <h2>2. 지역별 교육 계획</h2>
    `;
    
    Object.keys(appData.regions).forEach(regionName => {
        const region = appData.regions[regionName];
        const progress = calculateRegionProgress(regionName);
        
        content += `
            <h3>${regionName} - ${region.info.facilityName || '시설명 미정'}</h3>
            <table>
                <tr><th>항목</th><th>내용</th></tr>
                <tr><td>시설명</td><td>${region.info.facilityName || '미정'}</td></tr>
                <tr><td>주소</td><td>${region.info.address || '미정'}</td></tr>
                <tr><td>연락처</td><td>${region.info.phone || '미정'}</td></tr>
                <tr><td>최대 수용인원</td><td>${region.info.maxCapacity || '미정'}명</td></tr>
                <tr><td>준비 진행률</td><td>${progress.percentage}%</td></tr>
            </table>
        `;
    });
    
    return content;
}

function generateChecklistReport() {
    const date = new Date().toLocaleDateString();
    let content = `
        <h1>체크리스트 현황 보고서</h1>
        <p><strong>작성일:</strong> ${date}</p>
        
        <h2>전체 현황 요약</h2>
        <table>
            <tr><th>지역</th><th>진행률</th><th>완료항목</th><th>전체항목</th></tr>
    `;
    
    Object.keys(appData.regions).forEach(regionName => {
        const progress = calculateRegionProgress(regionName);
        content += `
            <tr>
                <td>${regionName}</td>
                <td class="${progress.percentage >= 80 ? 'completed' : 'pending'}">${progress.percentage}%</td>
                <td>${progress.completed}</td>
                <td>${progress.total}</td>
            </tr>
        `;
    });
    
    content += '</table><h2>미완료 항목</h2>';
    
    Object.keys(appData.regions).forEach(regionName => {
        const region = appData.regions[regionName];
        const pendingItems = [];
        
        Object.keys(region.checklist).forEach(section => {
            Object.keys(region.checklist[section]).forEach(item => {
                if (!region.checklist[section][item]) {
                    pendingItems.push(`${section} > ${item}`);
                }
            });
        });
        
        if (pendingItems.length > 0) {
            content += `<h3>${regionName}</h3><ul>`;
            pendingItems.forEach(item => {
                content += `<li class="pending">${item}</li>`;
            });
            content += '</ul>';
        }
    });
    
    return content;
}

function generateCostReport() {
    const date = new Date().toLocaleDateString();
    let content = `
        <h1>비용 내역서</h1>
        <p><strong>작성일:</strong> ${date}</p>
        
        <h2>지역별 비용 내역</h2>
        <table>
            <tr><th>지역</th><th>프로그램비</th><th>식비</th><th>시설이용료</th><th>기타</th><th>합계</th></tr>
    `;
    
    let totalProgram = 0, totalMeal = 0, totalFacility = 0, totalOther = 0, grandTotal = 0;
    
    Object.keys(appData.regions).forEach(regionName => {
        const costs = appData.regions[regionName].costs;
        const total = costs.programFee + costs.mealFee + costs.facilityFee + costs.other;
        
        totalProgram += costs.programFee;
        totalMeal += costs.mealFee;
        totalFacility += costs.facilityFee;
        totalOther += costs.other;
        grandTotal += total;
        
        content += `
            <tr>
                <td>${regionName}</td>
                <td>${costs.programFee ? costs.programFee.toLocaleString() + '원' : '-'}</td>
                <td>${costs.mealFee ? costs.mealFee.toLocaleString() + '원' : '-'}</td>
                <td>${costs.facilityFee ? costs.facilityFee.toLocaleString() + '원' : '-'}</td>
                <td>${costs.other ? costs.other.toLocaleString() + '원' : '-'}</td>
                <td><strong>${total ? total.toLocaleString() + '원' : '-'}</strong></td>
            </tr>
        `;
    });
    
    content += `
            <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td>총계</td>
                <td>${totalProgram.toLocaleString()}원</td>
                <td>${totalMeal.toLocaleString()}원</td>
                <td>${totalFacility.toLocaleString()}원</td>
                <td>${totalOther.toLocaleString()}원</td>
                <td>${grandTotal.toLocaleString()}원</td>
            </tr>
        </table>
    `;
    
    return content;
}

// 데이터 내보내기
function exportData() {
    const dataStr = JSON.stringify(appData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `forest_education_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// 데이터 가져오기
function importData() {
    document.getElementById('import-file').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (confirm('현재 데이터를 모두 대체하시겠습니까? (되돌릴 수 없습니다)')) {
                appData = importedData;
                saveData();
                location.reload();
            }
        } catch (error) {
            alert('파일을 읽을 수 없습니다. 올바른 백업 파일인지 확인해주세요.');
        }
    };
    reader.readAsText(file);
}

// 클라우드 인증 관련 함수들

// 앱 초기화 시 클라우드 연결 상태 확인
async function initializeCloudConnection() {
    const supabaseInitialized = initializeSupabase();
    
    if (supabaseInitialized && isSupabaseConnected()) {
        document.getElementById('cloud-sync-btn').style.display = 'inline-flex';
        
        // 기존 세션 확인
        const session = await checkAuthState();
        if (session) {
            await handleSuccessfulLogin(session.user);
        }
    } else {
        updateConnectionStatus('offline', '로컬 모드');
    }
}

// 연결 상태 업데이트
function updateConnectionStatus(status, message) {
    const statusElement = document.getElementById('connection-status');
    const iconElement = statusElement.querySelector('i');
    const textElement = statusElement.querySelector('span');
    
    statusElement.className = `connection-status ${status}`;
    textElement.textContent = message;
    
    if (status === 'online') {
        iconElement.className = 'fas fa-cloud';
    } else {
        iconElement.className = 'fas fa-wifi';
    }
}

// 클라우드 로그인 모달 표시
function showCloudLoginModal() {
    if (!isSupabaseConnected()) {
        alert('Supabase 설정이 완료되지 않았습니다. supabase-config.js 파일을 확인해주세요.');
        return;
    }
    
    document.getElementById('cloud-login-modal').style.display = 'flex';
    clearAuthMessage();
}

// 클라우드 로그인 모달 숨김
function hideCloudLoginModal() {
    document.getElementById('cloud-login-modal').style.display = 'none';
    clearAuthForms();
}

// 인증 탭 전환
function showAuthTab(tab) {
    // 탭 버튼 업데이트
    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="showAuthTab('${tab}')"]`).classList.add('active');
    
    // 폼 표시/숨김
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tab}-form`).classList.add('active');
    
    clearAuthMessage();
}

// 로그인 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    // 기존 초기화 코드 실행
    initializeCloudConnection();
    
    // 로그인 폼 이벤트
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        showAuthMessage('로그인 중...', 'info');
        
        const result = await signIn(email, password);
        
        if (result.success) {
            await handleSuccessfulLogin(result.data.user);
            hideCloudLoginModal();
        } else {
            showAuthMessage('로그인 실패: ' + result.error, 'error');
        }
    });
    
    // 회원가입 폼 이벤트
    document.getElementById('signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        if (password !== confirmPassword) {
            showAuthMessage('비밀번호가 일치하지 않습니다.', 'error');
            return;
        }
        
        showAuthMessage('회원가입 중...', 'info');
        
        const result = await signUp(email, password);
        
        if (result.success) {
            showAuthMessage('회원가입이 완료되었습니다. 이메일을 확인해주세요.', 'success');
            showAuthTab('login');
        } else {
            showAuthMessage('회원가입 실패: ' + result.error, 'error');
        }
    });
});

// 성공적인 로그인 처리
async function handleSuccessfulLogin(user) {
    // UI 업데이트
    updateConnectionStatus('online', '클라우드 동기화 활성');
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('cloud-sync-btn').style.display = 'none';
    
    // 클라우드 데이터 매니저 상태 업데이트
    if (cloudDataManager) {
        cloudDataManager.isOnline = true;
        
        // 실시간 동기화 설정
        cloudDataManager.setupRealtimeSync();
        
        // 동기화 대기열 처리
        await cloudDataManager.processSyncQueue();
        
        // 클라우드에서 데이터 로드
        const cloudData = await cloudDataManager.getAllRegions();
        if (cloudData) {
            // 로컬 데이터와 클라우드 데이터 병합
            if (confirm('클라우드에서 데이터를 불러오시겠습니까? (로컬 데이터는 백업 후 진행하는 것을 권장합니다)')) {
                appData.regions = cloudData;
                saveData();
                updateDashboard();
                showAuthMessage('클라우드 데이터를 성공적으로 로드했습니다.', 'success');
            }
        }
    }
}

// 로그아웃 처리
async function handleLogout() {
    if (confirm('로그아웃하시겠습니까?')) {
        const result = await signOut();
        
        if (result.success) {
            // UI 업데이트
            updateConnectionStatus('offline', '로컬 모드');
            document.getElementById('user-info').style.display = 'none';
            document.getElementById('cloud-sync-btn').style.display = 'inline-flex';
            
            // 클라우드 데이터 매니저 상태 업데이트
            if (cloudDataManager) {
                cloudDataManager.isOnline = false;
            }
            
            alert('로그아웃되었습니다.');
        } else {
            alert('로그아웃 실패: ' + result.error);
        }
    }
}

// 인증 메시지 표시
function showAuthMessage(message, type = 'info') {
    const messageElement = document.getElementById('auth-message');
    messageElement.textContent = message;
    messageElement.className = `auth-message ${type}`;
    messageElement.style.display = 'block';
}

// 인증 메시지 지우기
function clearAuthMessage() {
    const messageElement = document.getElementById('auth-message');
    messageElement.style.display = 'none';
    messageElement.textContent = '';
    messageElement.className = 'auth-message';
}

// 인증 폼 지우기
function clearAuthForms() {
    document.getElementById('login-form').reset();
    document.getElementById('signup-form').reset();
    clearAuthMessage();
}

// 파일 업로드 함수 업데이트 (클라우드 지원)
async function handleFileUpload(event) {
    const files = event.target.files;
    if (!currentRegion || !files.length) return;
    
    for (const file of files) {
        if (cloudDataManager && cloudDataManager.isOnline) {
            // 클라우드 업로드
            const result = await cloudDataManager.uploadFile(currentRegion, file);
            
            if (result.success) {
                // 로컬 데이터에도 추가
                appData.regions[currentRegion].documents.push(result.document);
                showAuthMessage(`${file.name} 파일이 클라우드에 업로드되었습니다.`, 'success');
            } else {
                showAuthMessage(`파일 업로드 실패: ${result.error}`, 'error');
            }
        } else {
            // 로컬 업로드 (기존 방식)
            const document = {
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                region: currentRegion
            };
            
            appData.regions[currentRegion].documents.push(document);
        }
    }
    
    loadRegionDocuments(currentRegion);
    saveData();
}

// 실시간 데이터 업데이트 이벤트 리스너
window.addEventListener('dataUpdated', function(event) {
    const { type, payload } = event.detail;
    
    // 필요에 따라 UI 업데이트
    switch (type) {
        case 'regions':
            updateDashboard();
            break;
        case 'checklist':
            if (currentRegion) {
                loadRegionChecklist(currentRegion);
            }
            break;
    }
});

// 지역 데이터 저장 함수 업데이트 (클라우드 지원)
async function saveRegionData() {
    if (!currentRegion) return;
    
    const region = appData.regions[currentRegion];
    
    // 기본 정보 수집
    region.info.facilityName = document.getElementById('facility-name').value;
    region.info.address = document.getElementById('address').value;
    region.info.phone = document.getElementById('phone').value;
    region.info.managerName = document.getElementById('manager-name').value;
    region.info.managerEmail = document.getElementById('manager-email').value;
    region.info.maxCapacity = parseInt(document.getElementById('max-capacity').value) || 0;
    region.info.parkingCapacity = parseInt(document.getElementById('parking-capacity').value) || 0;
    
    // 로컬 저장
    const localSaved = saveData();
    
    // 클라우드 저장
    if (cloudDataManager && cloudDataManager.isOnline) {
        const cloudSaved = await cloudDataManager.saveRegionInfo(currentRegion, region);
        
        if (localSaved && cloudSaved) {
            alert('로컬 및 클라우드에 저장되었습니다.');
        } else if (localSaved) {
            alert('로컬에 저장되었습니다. 클라우드 동기화는 나중에 처리됩니다.');
        } else {
            alert('저장에 실패했습니다.');
        }
    } else {
        if (localSaved) {
            alert('로컬에 저장되었습니다.');
        } else {
            alert('저장에 실패했습니다.');
        }
    }
    
    updateDashboard();
}