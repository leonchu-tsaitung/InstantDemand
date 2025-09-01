// 全局變數
let currentItems = [...items];
let itemToInactive = null;
let currentFilter = 'all'; // 篩選狀態: 'all', 'auction', 'purchase'
let currentCategoryFilter = 'all'; // 類別篩選狀態: 'all', '葉菜類', '根莖類', '特殊菜類'

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

// 創建項目卡片 (將原本的卡片創建邏輯提取出來)
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = `mdl-card mdl-shadow--2dp item-card ${item.active ? '' : 'inactive'} ${item.todayShortage > 0 ? 'highlight' : ''}`;
    
    // 第一層：主要品項和數據
    const cardContent = document.createElement('div');
    cardContent.className = 'mdl-card__supporting-text';
    
    // 上半部：主要資訊
    const mainInfo = document.createElement('div');
    mainInfo.className = 'main-info';
    mainInfo.innerHTML = `
        <h2 class="mdl-card__title-text">${item.name}</h2>
        <div class="item-details">
            <div class="detail-item">
                <span class="detail-label">今日缺量</span>
                <span class="detail-value ${item.todayShortage > 0 ? 'emphasis' : ''}">${item.todayShortage}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">三日缺量</span>
                <span class="detail-value">${item.threeDayShortage}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">今日需求</span>
                <span class="detail-value">${item.todayDemand}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">總庫存</span>
                <span class="detail-value">${item.totalStock}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label tooltip">
                    現有庫存
                    <span class="tooltip-content">
                        ${item.inStock.details.map(d => 
                            `批號${d.batch}：${d.amount}（${d.date}）`
                        ).join('<br>')}
                    </span>
                </span>
                <span class="detail-value">${item.inStock.amount}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label tooltip">
                    在途庫存
                    <span class="tooltip-content">
                        ${item.inTransit.details.map(d => 
                            `供應商${d.supplier}：${d.amount}（${d.date}）`
                        ).join('<br>')}
                    </span>
                </span>
                <span class="detail-value">${item.inTransit.amount}</span>
            </div>
        </div>
    `;
    cardContent.appendChild(mainInfo);

    // 第二層：按鈕群
    const buttonSection = document.createElement('div');
    buttonSection.className = 'button-section';
    buttonSection.innerHTML = renderButtons(item);
    cardContent.appendChild(buttonSection);

    // 下半部：子項卡片
    if (item.active) {
        const subItemsContainer = document.createElement('div');
        subItemsContainer.className = 'sub-items-container';
        
        if (item.mode === 'auction' || item.mode === 'dual') {
            subItemsContainer.appendChild(createAuctionRow(item));
        }
        if (item.mode === 'purchase' || item.mode === 'dual') {
            subItemsContainer.appendChild(createPurchaseRow(item));
        }
        
        cardContent.appendChild(subItemsContainer);
    }

    card.appendChild(cardContent);
    return card;
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
        <div class="card-row-horizontal">
            <div class="card-field">
                <span class="field-label">拍買量</span>
                <div class="mdl-textfield mdl-js-textfield">
                    <input type="number" class="mdl-textfield__input" value="${item.auctionAmount}" 
                           onchange="updateAuctionAmount(${item.id}, this.value)">
                </div>
            </div>
            <div class="card-field">
                <span class="field-label">拍賣代碼</span>
                <span class="mdl-chip">
                    <span class="mdl-chip__text">${item.auctionCode}</span>
                </span>
            </div>
            <div class="card-field">
                <span class="field-label">單位</span>
                <span class="unit-text">${item.unit || '包'}</span>
            </div>
            <div class="card-field">
                <span class="field-label">價格</span>
                <span class="price-text">$${item.auctionPrice || 0}</span>
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
        <div class="card-row-horizontal">
            <div class="card-field">
                <span class="field-label">採買量</span>
                <div class="mdl-textfield mdl-js-textfield">
                    <input type="number" class="mdl-textfield__input" value="${item.purchaseAmount}" 
                           onchange="updatePurchaseAmount(${item.id}, this.value)">
                </div>
            </div>
            <div class="card-field">
                <span class="field-label">攤商</span>
                <div class="mdl-selectfield">
                    <select class="mdl-selectfield__select" onchange="updateSupplier(${item.id}, this.value)">
                        ${suppliers.map(s => 
                            `<option value="${s}" ${item.supplier === s ? 'selected' : ''}>${s}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <div class="card-field">
                <span class="field-label">單位</span>
                <span class="unit-text">${item.unit || '包'}</span>
            </div>
            <div class="card-field">
                <span class="field-label">價格</span>
                <span class="price-text">$${item.purchasePrice || 0}</span>
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
        default:
            // 'all' - 不篩選
            break;
    }
    
    // 第二層：按類別篩選
    if (currentCategoryFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === currentCategoryFilter);
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

