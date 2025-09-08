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
    
    // 初始化異動追蹤
    initializeItemTracking();
    
    renderTable();
});

// ====== 通用 DOM 操作函數 ======

// 清空並獲取容器
function getAndClearContainer(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    return container;
}

// 升級 MDL 組件
function upgradeMDLComponents() {
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeAllRegistered();
    }
}

// 創建並添加元素到容器
function appendElementToContainer(container, element) {
    container.appendChild(element);
    return element;
}

// 渲染卡片
function renderTable() {
    const container = getAndClearContainer('itemsContainer');
    const filteredItems = getFilteredItems();
    
    // 根據類別篩選決定渲染方式
    if (currentCategoryFilter !== 'all') {
        renderCategorySection(container, currentCategoryFilter, filteredItems);
    } else {
        renderAllCategories(container, filteredItems);
    }

    upgradeMDLComponents();
}

// 渲染所有類別
function renderAllCategories(container, filteredItems) {
    const categorizedItems = groupItemsByCategory(filteredItems);
    categories.forEach(category => {
        const categoryItems = categorizedItems[category] || [];
        if (categoryItems.length > 0) {
            renderCategorySection(container, category, categoryItems);
        }
    });
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
    card.className = `mdl-card mdl-shadow--2dp item-card ${item.active ? '' : 'inactive'} ${item.todayShortage > 0 ? 'highlight' : ''} ${item.hasUnsavedChanges ? 'has-unsaved-changes' : ''}`;
    
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
    
    // 第四區塊：備註和儲存區
    if (item.active) {
        const saveSection = createSaveSection(item);
        cardContent.appendChild(saveSection);
    }
    
    card.appendChild(cardContent);
    return card;
}

// ====== HTML 模板創建函數 ======

// 創建庫存項目模板
function createStockItemTemplate(label, value, details, detailFormatter) {
    const tooltipContent = details.map(detailFormatter).join('<br>');
    return `
        <div class="stock-item">
            <span class="stock-label tooltip">
                ${label}
                <span class="tooltip-content">
                    ${tooltipContent}
                </span>
            </span>
            <span class="stock-value">${value}</span>
        </div>
    `;
}

// 創建基本資訊行模板
function createBasicInfoRowTemplate(item) {
    const inStockTemplate = createStockItemTemplate(
        '現有庫存', 
        item.inStock.amount, 
        item.inStock.details,
        d => `批號${d.batch}：${d.amount}（${d.date}）`
    );
    
    const inTransitTemplate = createStockItemTemplate(
        '在途庫存', 
        item.inTransit.amount, 
        item.inTransit.details,
        d => `供應商${d.supplier}：${d.amount}（${d.date}）`
    );
    
    const unsavedIndicator = item.hasUnsavedChanges ? 
        `<span class="unsaved-indicator" title="有未儲存的異動">
            <i class="material-icons">fiber_manual_record</i>
        </span>` : '';
    
    return `
        <div class="basic-info-row">
            <div class="item-title-section">
                <h2 class="mdl-card__title-text">${item.name}</h2>
                ${unsavedIndicator}
            </div>
            <div class="basic-info-stocks">
                ${inStockTemplate}
                ${inTransitTemplate}
            </div>
        </div>
    `;
}

// 創建基本資訊區
function createBasicInfoSection(item) {
    const section = document.createElement('div');
    section.className = 'basic-info-section';
    section.innerHTML = createBasicInfoRowTemplate(item);
    return section;
}

// ====== 通用區塊創建函數 ======

// 創建區塊標題行
function createSectionTitleRow(title, dataItems, buttons = '') {
    return `
        <div class="section-title-row">
            <h3 class="section-title">${title}</h3>
            <div class="section-data-items">
                ${dataItems}
            </div>
            ${buttons ? `<div class="button-section">${buttons}</div>` : ''}
        </div>
    `;
}

// 創建數據項目
function createDataItem(label, value, emphasize = false) {
    return `
        <div class="section-data-item">
            <span class="data-label">${label}</span>
            <span class="data-value ${emphasize ? 'emphasis' : ''}">${value}</span>
        </div>
    `;
}

// 創建區塊標題
function createSectionHeader(className, content) {
    const header = document.createElement('div');
    header.className = className;
    header.innerHTML = content;
    return header;
}

// 創建子項容器
function createSubItemsContainer(item, locationFilter = null) {
    if (!item.active) return null;
    
    const container = document.createElement('div');
    container.className = 'sub-items-container';
    
    // 添加拍買子項
    if ((item.mode === 'auction' || item.mode === 'dual')) {
        if (!locationFilter || item.auctionLocation === locationFilter) {
            container.appendChild(createAuctionRow(item));
        }
    }
    
    // 添加採買子項（僅今日）
    if ((item.mode === 'purchase' || item.mode === 'dual') && locationFilter === 'today') {
        container.appendChild(createPurchaseRow(item));
    }
    
    // 添加直供子項（僅未來）
    if (locationFilter === 'future' && item.directSuppliers && item.directSuppliers.length > 0) {
        item.directSuppliers.forEach(supplier => {
            container.appendChild(createDirectSupplierRow(item, supplier));
        });
    }
    
    return container.children.length > 0 ? container : null;
}

// 創建今日缺口區
function createTodayShortageSection(item) {
    const section = document.createElement('div');
    section.className = 'today-shortage-section';
    
    // 組裝數據項目
    const dataItems = [
        createDataItem('今日缺量', item.todayShortage, item.todayShortage > 0),
        createDataItem('今日需求', item.todayDemand)
    ].join('');
    
    // 創建標題行
    const titleRowContent = createSectionTitleRow('今日缺口', dataItems, renderButtons(item));
    const sectionHeader = createSectionHeader('section-header', titleRowContent);
    section.appendChild(sectionHeader);
    
    // 添加子項容器
    const subItemsContainer = createSubItemsContainer(item, 'today');
    if (subItemsContainer) {
        section.appendChild(subItemsContainer);
    }
    
    return section;
}

// 創建未來缺口區
function createFutureShortageSection(item) {
    const section = document.createElement('div');
    section.className = 'future-shortage-section';
    
    // 組裝數據項目
    const dataItems = createDataItem('三日缺量', item.threeDayShortage);
    
    // 創建標題行
    const titleRowContent = createSectionTitleRow('未來缺口', dataItems);
    const sectionHeader = createSectionHeader('section-header', titleRowContent);
    section.appendChild(sectionHeader);
    
    // 添加子項容器
    const subItemsContainer = createSubItemsContainer(item, 'future');
    if (subItemsContainer) {
        section.appendChild(subItemsContainer);
    }
    
    return section;
}

// 創建備註和儲存區
function createSaveSection(item) {
    const section = document.createElement('div');
    section.className = 'save-section';
    
    const noteInputHTML = createNoteInputHTML(item);
    const saveButtonHTML = createSaveButtonHTML(item);
    
    section.innerHTML = `
        <div class="section-header">
            <h3 class="section-title">備註與儲存</h3>
        </div>
        <div class="note-and-save-row">
            <div class="note-input-container">
                ${noteInputHTML}
            </div>
            <div class="save-button-container">
                ${saveButtonHTML}
            </div>
        </div>
    `;
    
    return section;
}

// 創建備註輸入HTML (真正整合式：同一框內既可選又可手打)
function createNoteInputHTML(item) {
    const noteValue = item.noteText || (item.noteCategory ? item.noteCategory : '');
    const datalistOptions = noteCategories.map(category => 
        `<option value="${category}"></option>`
    ).join('');
    
    return `
        <div class="integrated-note-input">
            <input type="text" 
                   class="note-input-with-suggestions" 
                   list="noteOptions_${item.id}"
                   placeholder="選擇異動原因或直接輸入說明..." 
                   value="${noteValue}"
                   oninput="updateItemNote(${item.id}, this.value)">
            <datalist id="noteOptions_${item.id}">
                ${datalistOptions}
            </datalist>
        </div>
    `;
}

// 創建儲存按鈕HTML
function createSaveButtonHTML(item) {
    if (!item.hasUnsavedChanges) {
        return '<span class="save-status-text">已儲存</span>';
    }
    
    return `
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored save-button" 
                onclick="saveItemChanges(${item.id})">
            <i class="material-icons">save</i>
            儲存
        </button>
    `;
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
// ====== 按鈕渲染相關函數 ======

// 創建按鈕 HTML
function createButton(text, onClick, cssClasses = 'mdl-button mdl-js-button mdl-button--raised') {
    return `<button class="${cssClasses}" onclick="${onClick}">${text}</button>`;
}

// 創建按鈕佔位符
function createButtonPlaceholder() {
    return '<div class="button-placeholder"></div>';
}

// 獲取模式轉換按鈕
function getModeButtons(item) {
    const buttons = {
        toAuction: '',
        toPurchase: '',
        toPartial: ''
    };
    
    switch (item.mode) {
        case 'auction':
            buttons.toPurchase = createButton('轉採買', `switchMode(${item.id}, 'purchase')`, 'mdl-button mdl-js-button mdl-button--raised mdl-button--primary purchase');
            buttons.toPartial = createButton('部分採買', `switchMode(${item.id}, 'dual')`, 'mdl-button mdl-js-button mdl-button--raised mdl-button--primary dual');
            break;
        case 'purchase':
            buttons.toAuction = createButton('轉拍買', `switchMode(${item.id}, 'auction')`, 'mdl-button mdl-js-button mdl-button--raised mdl-button--primary auction');
            break;
        case 'dual':
            buttons.toPurchase = createButton('轉採買', `switchMode(${item.id}, 'purchase')`, 'mdl-button mdl-js-button mdl-button--raised mdl-button--primary purchase');
            break;
    }
    
    return buttons;
}

// 獲取狀態切換按鈕
function getActiveToggleButton(item) {
    if (!item.active) {
        return createButton('Active', `setActive(${item.id})`, 'mdl-button mdl-js-button mdl-button--raised mdl-button--colored');
    } else {
        return createButton('Inactive', `setInactive(${item.id})`, 'mdl-button mdl-js-button mdl-button--raised');
    }
}

// 主按鈕渲染函數
function renderButtons(item) {
    if (!item.active) {
        return `
            ${createButtonPlaceholder()}
            ${createButtonPlaceholder()}
            ${createButtonPlaceholder()}
            ${getActiveToggleButton(item)}
        `;
    }
    
    const modeButtons = getModeButtons(item);
    const activeButton = getActiveToggleButton(item);
    
    return `
        ${modeButtons.toAuction || createButtonPlaceholder()}
        ${modeButtons.toPurchase || createButtonPlaceholder()}
        ${modeButtons.toPartial || createButtonPlaceholder()}
        ${activeButton}
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

    item.hasUnsavedChanges = true;
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
        auctionAmount: parseInt(value) || 0,
        hasUnsavedChanges: true
    };
    
    // 重新渲染以顯示未儲存狀態
    renderTable();
}

function updatePurchaseAmount(itemId, value) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        purchaseAmount: parseInt(value) || 0,
        hasUnsavedChanges: true
    };
    
    // 重新渲染以顯示未儲存狀態
    renderTable();
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

// ====== 篩選功能相關函數 ======

// 採購方式篩選器
function filterByMode(items, mode) {
    switch(mode) {
        case 'auction':
            return items.filter(item => 
                item.active && 
                (item.mode === 'auction' || item.mode === 'dual') && 
                item.auctionAmount > 0
            );
        case 'purchase':
            return items.filter(item => 
                item.active && 
                (item.mode === 'purchase' || item.mode === 'dual') && 
                item.purchaseAmount > 0
            );
        case 'direct':
            return items.filter(item => 
                item.active && 
                item.directSuppliers && 
                item.directSuppliers.some(supplier => supplier.purchaseAmount > 0)
            );
        default:
            return items;
    }
}

// 類別篩選器
function filterByCategory(items, category) {
    return category === 'all' ? items : items.filter(item => item.category === category);
}

// 缺口狀態篩選器
function filterByShortage(items, shortageType) {
    switch(shortageType) {
        case 'today':
            return items.filter(item => item.todayShortage > 0);
        case 'any':
            return items.filter(item => 
                item.todayShortage > 0 || item.threeDayShortage > 0
            );
        case 'none':
            return items.filter(item => 
                item.todayShortage === 0 && item.threeDayShortage === 0
            );
        default:
            return items;
    }
}

// 主篩選函數
function getFilteredItems() {
    let result = currentItems;
    
    // 應用三層篩選
    result = filterByMode(result, currentFilter);
    result = filterByCategory(result, currentCategoryFilter);
    result = filterByShortage(result, currentShortageFilter);
    
    return result;
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

// ====== 異動追蹤和儲存相關函數 ======

// 更新品項備註（整合類別和文字）
function updateItemNote(itemId, value) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    // 檢查是否為預設類別
    const isPresetCategory = noteCategories.includes(value);
    
    currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        noteCategory: isPresetCategory ? value : '',
        noteText: value // 不管是選擇還是手打，都存在noteText中
    };
}

// 檢查是否需要備註 (當前值與建議值不同)
function requiresNote(item) {
    const auctionDiff = Math.abs(item.auctionAmount - item.suggestedAmounts.auctionAmount);
    const purchaseDiff = Math.abs(item.purchaseAmount - item.suggestedAmounts.purchaseAmount);
    
    return auctionDiff > 0 || purchaseDiff > 0;
}

// 驗證備註是否完整
function validateNote(item) {
    if (!requiresNote(item)) {
        return { valid: true, message: '' };
    }
    
    const hasNote = item.noteText && item.noteText.trim() !== '';
    
    if (!hasNote) {
        return { 
            valid: false, 
            message: '當訂購量與建議值不同時，請填寫異動原因' 
        };
    }
    
    return { valid: true, message: '' };
}

// 儲存品項異動
function saveItemChanges(itemId) {
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    const item = currentItems[itemIndex];
    
    // 驗證備註
    const validation = validateNote(item);
    if (!validation.valid) {
        alert(validation.message);
        return;
    }
    
    // 建立異動記錄
    const changeRecord = {
        timestamp: new Date().toISOString(),
        auctionAmount: {
            suggested: item.suggestedAmounts.auctionAmount,
            actual: item.auctionAmount
        },
        purchaseAmount: {
            suggested: item.suggestedAmounts.purchaseAmount,
            actual: item.purchaseAmount
        },
        noteCategory: item.noteCategory,
        noteText: item.noteText,
        user: 'current_user'
    };
    
    // 儲存到localStorage (可以擴展為其他儲存方式)
    const savedChanges = JSON.parse(localStorage.getItem('demandSystemChanges') || '{}');
    if (!savedChanges[itemId]) {
        savedChanges[itemId] = [];
    }
    savedChanges[itemId].push(changeRecord);
    localStorage.setItem('demandSystemChanges', JSON.stringify(savedChanges));
    
    // 更新品項狀態
    currentItems[itemIndex] = {
        ...item,
        hasUnsavedChanges: false,
        // 更新建議值為當前實際值，避免重複提醒
        suggestedAmounts: {
            auctionAmount: item.auctionAmount,
            purchaseAmount: item.purchaseAmount
        },
        // 清空備註欄位
        noteCategory: '',
        noteText: ''
    };
    
    // 重新渲染
    renderTable();
    
    // 顯示成功訊息
    showSaveSuccessMessage(item.name);
}

// 顯示儲存成功訊息
function showSaveSuccessMessage(itemName) {
    // 可以用更優雅的通知方式，這裡先用簡單的alert
    // 未來可以實作toast notification
    console.log(`${itemName} 已成功儲存`);
}

