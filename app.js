// 全局變數
let currentItems = [...items];
let itemToInactive = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    currentItems.forEach(item => {
        // 主要品項行
        const tr = document.createElement('tr');
        tr.className = `${item.active ? '' : 'inactive'} ${item.todayShortage > 0 ? 'highlight' : ''}`;
        
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.todayShortage > 0 
                ? `<span class="emphasis">${item.todayShortage}</span>` 
                : item.todayShortage}</td>
            <td>${item.threeDayShortage}</td>
            <td>${item.todayDemand}</td>
            <td>${item.totalStock}</td>
            <td>
                <span class="tooltip">
                    ${item.inStock.amount}
                    <span class="tooltip-content">
                        ${item.inStock.details.map(d => 
                            `批號${d.batch}：${d.amount}（${d.date}）`
                        ).join('<br>')}
                    </span>
                </span>
            </td>
            <td>
                <span class="tooltip">
                    ${item.inTransit.amount}
                    <span class="tooltip-content">
                        ${item.inTransit.details.map(d => 
                            `供應商${d.supplier}：${d.amount}（${d.date}）`
                        ).join('<br>')}
                    </span>
                </span>
            </td>
            <td>${renderButtons(item)}</td>
        `;
        tbody.appendChild(tr);

        // 子項卡片（如果是活動狀態）
        if (item.active) {
            const subItemsRow = document.createElement('tr');
            const subItemsContainer = document.createElement('div');
            subItemsContainer.className = 'sub-items';
            
            if (item.mode === 'auction' || item.mode === 'dual') {
                subItemsContainer.appendChild(createAuctionRow(item));
            }
            if (item.mode === 'purchase' || item.mode === 'dual') {
                subItemsContainer.appendChild(createPurchaseRow(item));
            }

            const td = document.createElement('td');
            td.colSpan = 8;
            td.style.padding = '0';
            td.appendChild(subItemsContainer);
            subItemsRow.appendChild(td);
            tbody.appendChild(subItemsRow);
        }
    });

    // 確保新增的 MDL 元件被正確初始化
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeAllRegistered();
    }
}

// 渲染按鈕
function renderButtons(item) {
    if (!item.active) {
        return `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="setActive(${item.id})">Active</button>`;
    }

    let buttons = '';
    switch (item.mode) {
        case 'auction':
            buttons = `
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--primary purchase" onclick="switchMode(${item.id}, 'purchase')">轉採買</button>
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--primary dual" onclick="switchMode(${item.id}, 'dual')">部分採買</button>
            `;
            break;
        case 'purchase':
            buttons = `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--primary auction" onclick="switchMode(${item.id}, 'auction')">轉拍買</button>`;
            break;
        case 'dual':
            buttons = `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--primary purchase" onclick="switchMode(${item.id}, 'purchase')">轉採買</button>`;
            break;
    }
    return buttons + `<button class="mdl-button mdl-js-button mdl-button--raised" onclick="setInactive(${item.id})">Inactive</button>`;
}

// 創建拍買子項
function createAuctionRow(item) {
    const div = document.createElement('div');
    div.className = 'sub-item-card auction mdl-shadow--2dp';
    div.innerHTML = `
        <div class="card-row">
            <span class="card-label">拍賣代碼</span>
            <div class="card-content">
                <span class="mdl-chip">
                    <span class="mdl-chip__text">${item.auctionCode}</span>
                </span>
            </div>
        </div>
        <div class="card-row">
            <span class="card-label">拍買量</span>
            <div class="card-content">
                <div class="mdl-textfield mdl-js-textfield">
                    <input type="number" class="mdl-textfield__input" value="${item.auctionAmount}" 
                           onchange="updateAuctionAmount(${item.id}, this.value)">
                </div>
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
        <div class="card-row">
            <span class="card-label">攤商</span>
            <div class="card-content">
                <div class="mdl-selectfield">
                    <select class="mdl-selectfield__select" onchange="updateSupplier(${item.id}, this.value)">
                        ${suppliers.map(s => 
                            `<option value="${s}" ${item.supplier === s ? 'selected' : ''}>${s}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        </div>
        <div class="card-row">
            <span class="card-label">採買量</span>
            <div class="card-content">
                <div class="mdl-textfield mdl-js-textfield">
                    <input type="number" class="mdl-textfield__input" value="${item.purchaseAmount}" 
                           onchange="updatePurchaseAmount(${item.id}, this.value)">
                </div>
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
