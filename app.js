// 全局變數
let currentItems = [...items];
let itemToInactive = null;
let currentFilter = 'all'; // 篩選狀態: 'all', 'auction', 'purchase', 'direct'
let currentCategoryFilter = 'all'; // 類別篩選狀態: 'all', '葉菜類', '根莖類', '特殊菜類'
let currentShortageFilter = 'all'; // 缺口狀態篩選: 'all', 'today', 'any', 'none'

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 為沒有單位和價格的項目設置預設值
    currentItems.forEach(item => {
        if (!item.unit) {
            item.unit = '把(約300G/把)';
        }
        if (!item.auctionPrice) {
            item.auctionPrice = Math.floor(Math.random() * 20) + 15; // 15-35之間的隨機價格
        }
        if (!item.purchasePrice) {
            item.purchasePrice = item.auctionPrice + Math.floor(Math.random() * 5) + 2; // 比拍買價格高2-7元
        }
    });
    renderTable();
});

// 渲染卡片
function renderTable() {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';

    const filteredItems = getFilteredItems();
    
    // 如果選擇了特定類別，直接顯示該類別的項目
    if (currentCategoryFilter !== 'all') {
        renderCategorySection(container, currentCategoryFilter, filteredItems);
    } else {
        // 顯示所有類別，按分類分組
        const categorizedItems = groupItemsByCategory(filteredItems);
        categories.forEach(category => {
            const categoryItems = categorizedItems[category] || [];
            if (categoryItems.length > 0) {
                renderCategorySection(container, category, categoryItems);
            }
        });
    }

    // 確保新增的 MDL 元件被正確初始化
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeAllRegistered();
    }
}

// 將項目按類別分組
function groupItemsByCategory(items) {
    const grouped = {};
    items.forEach(item => {
        if (!grouped[item.category]) {
            grouped[item.category] = [];
        }
        grouped[item.category].push(item);
    });
    return grouped;
}

// 渲染類別區段
function renderCategorySection(container, category, items) {
    // 創建類別標題
    const categoryHeader = document.createElement('div');
    categoryHeader.className = `category-header ${getCategoryClass(category)}`;
    
    const shortageCount = items.filter(item => item.todayShortage > 0).length;
    const totalCount = items.length;
    
    categoryHeader.innerHTML = `
        <div class="category-title">
            <i class="material-icons category-icon">${getCategoryIcon(category)}</i>
            <h3 class="category-name">${category}</h3>
            <span class="category-stats">${totalCount} 項 ${shortageCount > 0 ? `(${shortageCount} 項有缺口)` : ''}</span>
        </div>
    `;
    container.appendChild(categoryHeader);
    
    // 創建類別內容容器
    const categoryContent = document.createElement('div');
    categoryContent.className = 'category-content';
    
    // 渲染該類別下的所有項目
    items.forEach(item => {
        const card = createItemCard(item);
        categoryContent.appendChild(card);
    });
    
    container.appendChild(categoryContent);
}

// 創建項目卡片 (重構為三區塊結構)
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = `mdl-card mdl-shadow--2dp item-card ${item.active ? '' : 'inactive'} ${item.todayShortage > 0 ? 'highlight' : ''}`;
    
    const cardContent = document.createElement('div');
    cardContent.className = 'mdl-card__supporting-text';
    
    // 第一區塊：基本資訊區
    const basicInfoSection = createBasicInfoSection(item);
    cardContent.appendChild(basicInfoSection);
    
    // 第二區塊：今日缺口區
    const todayShortageSection = createTodayShortageSection(item);
    cardContent.appendChild(todayShortageSection);
    
    // 第三區塊：未來缺口區
    const futureShortageSection = createFutureShortageSection(item);
    cardContent.appendChild(futureShortageSection);
    
    card.appendChild(cardContent);
    return card;
}

// 創建基本資訊區
function createBasicInfoSection(item) {
    const section = document.createElement('div');
    section.className = 'basic-info-section';
    section.innerHTML = `
        <div class="basic-info-row">
            <h2 class="mdl-card__title-text">${item.name}</h2>
            <div class="basic-info-stocks">
                <div class="stock-item">
                    <span class="stock-label tooltip">
                        現有庫存
                        <span class="tooltip-content">
                            ${item.inStock.details.map(d => 
                                `批號${d.batch}：${d.amount}（${d.date}）`
                            ).join('<br>')}
                        </span>
                    </span>
                    <span class="stock-value">${item.inStock.amount}</span>
                </div>
                <div class="stock-item">
                    <span class="stock-label tooltip">
                        在途庫存
                        <span class="tooltip-content">
                            ${item.inTransit.details.map(d => 
                                `供應商${d.supplier}：${d.amount}（${d.date}）`
                            ).join('<br>')}
                        </span>
                    </span>
                    <span class="stock-value">${item.inTransit.amount}</span>
                </div>
            </div>
        </div>
    `;
    
    return section;
}

// 創建今日缺口區
function createTodayShortageSection(item) {
    const section = document.createElement('div');
    section.className = 'today-shortage-section';
    
    // 標題和數據
    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'section-header';
    sectionHeader.innerHTML = `
        <div class="section-title-row">
            <h3 class="section-title">今日缺口</h3>
            <div class="section-data-items">
                <div class="section-data-item">
                    <span class="data-label">今日缺量</span>
                    <span class="data-value ${item.todayShortage > 0 ? 'emphasis' : ''}">${item.todayShortage}</span>
                </div>
                <div class="section-data-item">
                    <span class="data-label">今日需求</span>
                    <span class="data-value">${item.todayDemand}</span>
                </div>
            </div>
            <div class="button-section">
                ${renderButtons(item)}
            </div>
        </div>
    `;
    section.appendChild(sectionHeader);
    
    // 子項容器
    if (item.active) {
        const subItemsContainer = document.createElement('div');
        subItemsContainer.className = 'sub-items-container';
        
        // 顯示位置在今日的拍買子項
        if ((item.mode === 'auction' || item.mode === 'dual') && item.auctionLocation === 'today') {
            subItemsContainer.appendChild(createAuctionRow(item));
        }
        // 顯示採買子項
        if (item.mode === 'purchase' || item.mode === 'dual') {
            subItemsContainer.appendChild(createPurchaseRow(item));
        }
        
        section.appendChild(subItemsContainer);
    }
    
    return section;
}

// 創建未來缺口區
function createFutureShortageSection(item) {
    const section = document.createElement('div');
    section.className = 'future-shortage-section';
    
    // 標題和數據
    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'section-header';
    sectionHeader.innerHTML = `
        <div class="section-title-row">
            <h3 class="section-title">未來缺口</h3>
            <div class="section-data-items">
                <div class="section-data-item">
                    <span class="data-label">三日缺量</span>
                    <span class="data-value">${item.threeDayShortage}</span>
                </div>
            </div>
        </div>
    `;
    section.appendChild(sectionHeader);
    
    // 子項容器
    if (item.active) {
        const subItemsContainer = document.createElement('div');
        subItemsContainer.className = 'sub-items-container';
        
        // 顯示位置在未來的拍買子項
        if ((item.mode === 'auction' || item.mode === 'dual') && item.auctionLocation === 'future') {
            subItemsContainer.appendChild(createAuctionRow(item));
        }
        
        // 顯示所有直供子項
        if (item.directSuppliers && item.directSuppliers.length > 0) {
            item.directSuppliers.forEach(supplier => {
                subItemsContainer.appendChild(createDirectSupplierRow(item, supplier));
            });
        }
        
        section.appendChild(subItemsContainer);
    }
    
    return section;
}

// 獲取類別樣式類別
function getCategoryClass(category) {
    switch(category) {
        case '葉菜類': return 'leaf-category';
        case '根莖類': return 'root-category';
        case '特殊菜類': return 'special-category';
        default: return 'default-category';
    }
}

// 獲取類別圖標
function getCategoryIcon(category) {
    switch(category) {
        case '葉菜類': return 'eco';
        case '根莖類': return 'grass';
        case '特殊菜類': return 'star';
        default: return 'category';
    }
}


// 渲染固定位置按鈕
function renderButtons(item) {
    // 建立四個固定位置的按鈕位置
    let buttons = {
        toAuction: '',
        toPurchase: '',
        toPartial: '',
        activeToggle: ''
    };

    if (!item.active) {
        buttons.activeToggle = `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="setActive(${item.id})">Active</button>`;
    } else {
        // 根據模式設置適當的按鈕
        switch (item.mode) {
            case 'auction':
                buttons.toPurchase = `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--primary purchase" onclick="switchMode(${item.id}, 'purchase')">轉採買</button>`;
                buttons.toPartial = `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--primary dual" onclick="switchMode(${item.id}, 'dual')">部分採買</button>`;
                break;
            case 'purchase':
                buttons.toAuction = `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--primary auction" onclick="switchMode(${item.id}, 'auction')">轉拍買</button>`;
                break;
            case 'dual':
                buttons.toPurchase = `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--primary purchase" onclick="switchMode(${item.id}, 'purchase')">轉採買</button>`;
                break;
        }
        buttons.activeToggle = `<button class="mdl-button mdl-js-button mdl-button--raised" onclick="setInactive(${item.id})">Inactive</button>`;
    }

    // 返回所有按鈕，即使是空的位置也保留
    return `
        ${buttons.toAuction || '<div class="button-placeholder"></div>'}
        ${buttons.toPurchase || '<div class="button-placeholder"></div>'}
        ${buttons.toPartial || '<div class="button-placeholder"></div>'}
        ${buttons.activeToggle}
    `;
}

// 創建拍買子項
function createAuctionRow(item) {
    const div = document.createElement('div');
    div.className = 'sub-item-card auction mdl-shadow--2dp';
    div.innerHTML = `
        <div class="card-row-horizontal auction-single-row">
            <div class="card-field auction-amount-field">
                <span class="field-label">拍買量</span>
                <div class="mdl-textfield mdl-js-textfield">
                    <input type="number" class="mdl-textfield__input" value="${item.auctionAmount}" 
                           onchange="updateAuctionAmount(${item.id}, this.value)">
                </div>
            </div>
            <div class="card-field auction-code-field">
                <span class="field-label">拍賣代碼</span>
                <span class="mdl-chip">
                    <span class="mdl-chip__text">${item.auctionCode}</span>
                </span>
            </div>
            <div class="card-field auction-unit-field">
                <span class="field-label">單位</span>
                <span class="unit-text">${item.unit || '包'}</span>
            </div>
            <div class="card-field auction-price-field">
                <span class="field-label">價格</span>
                <span class="price-text">$${item.auctionPrice || 0}</span>
            </div>
            <div class="card-field auction-action-field">
                <span class="field-label">位置</span>
                <button class="mdl-button mdl-js-button mdl-button--primary auction-location-toggle" 
                        onclick="toggleAuctionLocation(${item.id})">
                    <i class="material-icons">swap_horiz</i>
                    ${item.auctionLocation === 'today' ? '移到未來' : '移到今日'}
                </button>
            </div>
        </div>
    `;
    return div;
}

// 創建採買子項
function createPurchaseRow(item) {
    const div = document.createElement('div');
    div.className = 'sub-item-card purchase mdl-shadow--2dp';
    div.innerHTML = `
        <div class="card-row-horizontal purchase-single-row">
            <div class="card-field purchase-amount-field">
                <span class="field-label">採買量</span>
                <div class="mdl-textfield mdl-js-textfield">
                    <input type="number" class="mdl-textfield__input" value="${item.purchaseAmount}" 
                           onchange="updatePurchaseAmount(${item.id}, this.value)">
                </div>
            </div>
            <div class="card-field purchase-supplier-field">
                <span class="field-label">攤商</span>
                <div class="mdl-selectfield">
                    <select class="mdl-selectfield__select" onchange="updateSupplier(${item.id}, this.value)">
                        ${suppliers.map(s => 
                            `<option value="${s}" ${item.supplier === s ? 'selected' : ''}>${s}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <div class="card-field purchase-unit-field">
                <span class="field-label">單位</span>
                <span class="unit-text">${item.unit || '包'}</span>
            </div>
            <div class="card-field purchase-price-field">
                <span class="field-label">價格</span>
                <span class="price-text">$${item.purchasePrice || 0}</span>
            </div>
        </div>
    `;
    return div;
}

// 創建直供子項
function createDirectSupplierRow(item, supplier) {
    const div = document.createElement('div');
    div.className = 'sub-item-card direct-supplier mdl-shadow--2dp';
    div.innerHTML = `
        <div class="card-row-horizontal direct-single-row">
            <div class="card-field direct-supplier-field">
                <span class="field-label">供應商</span>
                <span class="mdl-chip">
                    <span class="mdl-chip__text">${supplier.supplierName}</span>
                </span>
            </div>
            <div class="card-field direct-update-field">
                <span class="field-label">報價更新</span>
                <span class="update-time">${supplier.priceUpdateTime}</span>
            </div>
            <div class="card-field direct-unit-field">
                <span class="field-label">單位</span>
                <span class="unit-text">${supplier.unit}</span>
            </div>
            <div class="card-field direct-spoilage-field">
                <span class="field-label">腐損率</span>
                <span class="spoilage-rate">${supplier.spoilageRate}%</span>
            </div>
            <div class="card-field direct-amount-field">
                <span class="field-label">採購量</span>
                <div class="mdl-textfield mdl-js-textfield">
                    <input type="number" class="mdl-textfield__input" value="${supplier.purchaseAmount}" 
                           onchange="updateDirectPurchaseAmount(${item.id}, '${supplier.supplierName}', this.value)">
                </div>
            </div>
            <div class="card-field direct-cost-field">
                <span class="field-label">成本</span>
                <span class="cost-text">$${supplier.cost}</span>
            </div>
            <div class="card-field direct-spoilage-cost-field">
                <span class="field-label">含腐損成本</span>
                <span class="cost-with-spoilage-text">$${supplier.costWithSpoilage}</span>
            </div>
        </div>
    `;
    return div;
}

// 切換模式
function switchMode(itemId, newMode) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    const item = {...currentItems[itemIndex]};
    item.mode = newMode;

    // 根據模式設置預設值
    switch (newMode) {
        case 'auction':
            item.auctionAmount = item.threeDayShortage;
            item.purchaseAmount = 0;
            break;
        case 'purchase':
            item.purchaseAmount = item.todayShortage;
            item.auctionAmount = 0;
            break;
        case 'dual':
            // 保持拍買量不變，採買量設為0
            item.purchaseAmount = 0;
            break;
    }

    currentItems[itemIndex] = item;
    renderTable();
}

// 設置為 inactive
function setInactive(itemId) {
    const item = currentItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.todayShortage > 0) {
        itemToInactive = itemId;
        const dialog = document.getElementById('confirmModal');
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();
    } else {
        applyInactive(itemId);
    }
}

// 關閉確認視窗
function closeModal() {
    const dialog = document.getElementById('confirmModal');
    dialog.close();
    itemToInactive = null;
}

// 確認設置為 inactive
function confirmInactive() {
    if (itemToInactive !== null) {
        applyInactive(itemToInactive);
    }
    closeModal();
}

// 應用 inactive 狀態
function applyInactive(itemId) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        active: false,
        auctionAmount: 0,
        purchaseAmount: 0
    };
    renderTable();
}

// 設置為 active
function setActive(itemId) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    const item = currentItems[itemIndex];
    const mode = item.todayShortage > 0 ? 'auction' : 'purchase';
    
    currentItems[itemIndex] = {
        ...item,
        active: true,
        mode,
        auctionAmount: mode === 'auction' ? item.threeDayShortage : 0,
        purchaseAmount: mode === 'purchase' ? item.todayShortage : 0
    };
    renderTable();
}

// 更新數量和供應商
function updateAuctionAmount(itemId, value) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        auctionAmount: parseInt(value) || 0
    };
}

function updatePurchaseAmount(itemId, value) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        purchaseAmount: parseInt(value) || 0
    };
}

function updateSupplier(itemId, value) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        supplier: value
    };
}

// 切換拍買位置
function toggleAuctionLocation(itemId) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    const currentLocation = currentItems[itemIndex].auctionLocation;
    const newLocation = currentLocation === 'today' ? 'future' : 'today';
    
    currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        auctionLocation: newLocation
    };
    renderTable();
}

// 更新直供採購量
function updateDirectPurchaseAmount(itemId, supplierName, value) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    const item = {...currentItems[itemIndex]};
    const supplierIndex = item.directSuppliers.findIndex(s => s.supplierName === supplierName);
    if (supplierIndex === -1) return;

    item.directSuppliers[supplierIndex] = {
        ...item.directSuppliers[supplierIndex],
        purchaseAmount: parseInt(value) || 0
    };
    
    currentItems[itemIndex] = item;
}

// 複製資訊
function copyAuctionInfo() {
    const auctionInfo = currentItems
        .filter(item => item.active && (item.mode === 'auction' || item.mode === 'dual'))
        .map(item => `${item.name} - ${item.auctionCode}: ${item.auctionAmount}`)
        .join('\n');
    
    navigator.clipboard.writeText(auctionInfo)
        .then(() => alert('已複製拍買資訊到剪貼簿'))
        .catch(() => alert('複製失敗'));
}

function copyPurchaseInfo() {
    const purchaseInfo = currentItems
        .filter(item => item.active && (item.mode === 'purchase' || item.mode === 'dual'))
        .map(item => `${item.name} - ${item.supplier || '未選擇攤商'}: ${item.purchaseAmount}`)
        .join('\n');
    
    navigator.clipboard.writeText(purchaseInfo)
        .then(() => alert('已複製採買資訊到剪貼簿'))
        .catch(() => alert('複製失敗'));
}

// 篩選功能
function getFilteredItems() {
    let filteredItems = currentItems;
    
    // 第一層：按採購方式篩選
    switch(currentFilter) {
        case 'auction':
            filteredItems = filteredItems.filter(item => 
                item.active && 
                (item.mode === 'auction' || item.mode === 'dual') && 
                item.auctionAmount > 0
            );
            break;
        case 'purchase':
            filteredItems = filteredItems.filter(item => 
                item.active && 
                (item.mode === 'purchase' || item.mode === 'dual') && 
                item.purchaseAmount > 0
            );
            break;
        case 'direct':
            filteredItems = filteredItems.filter(item => 
                item.active && 
                item.directSuppliers && 
                item.directSuppliers.some(supplier => supplier.purchaseAmount > 0)
            );
            break;
        default:
            // 'all' - 不篩選
            break;
    }
    
    // 第二層：按類別篩選
    if (currentCategoryFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === currentCategoryFilter);
    }
    
    // 第三層：按缺口狀態篩選
    switch(currentShortageFilter) {
        case 'today':
            filteredItems = filteredItems.filter(item => item.todayShortage > 0);
            break;
        case 'any':
            filteredItems = filteredItems.filter(item => 
                item.todayShortage > 0 || item.threeDayShortage > 0
            );
            break;
        case 'none':
            filteredItems = filteredItems.filter(item => 
                item.todayShortage === 0 && item.threeDayShortage === 0
            );
            break;
        default:
            // 'all' - 不篩選
            break;
    }
    
    return filteredItems;
}

// 下拉選單事件處理函數
function onModeFilterChange(value) {
    currentFilter = value;
    renderTable();
}

function onCategoryFilterChange(value) {
    currentCategoryFilter = value;
    renderTable();
}

function onShortageFilterChange(value) {
    currentShortageFilter = value;
    renderTable();
}

