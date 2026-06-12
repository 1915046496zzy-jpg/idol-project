// ui_cultivate.js - 培养模块独立渲染逻辑

// 智能道具查找函数（完美兼容数组和对象格式，绝不报错）
function findItemInfo(itemName) {
    if (typeof itemPool === 'undefined') return null;

    // 如果哥哥用的是数组格式
    if (Array.isArray(itemPool)) {
        return itemPool.find(i => itemName.includes(i.name));
    }
    // 如果哥哥用的是对象格式（之前青子教错的地方，现在修复了）
    else {
        for (let key in itemPool) {
            if (itemName.includes(key)) {
                let item = itemPool[key];
                return {
                    name: key,
                    type: item.type || 'unknown',
                    isEmoji: item.icon ? true : (item.isEmoji || false),
                    // 【图标修改 1】将默认的 📦 替换为了矢量包裹图标
                    img: item.icon || item.img || '<i class="bi bi-box-seam"></i>',
                    desc: item.desc || '暂无详细描述'
                };
            }
        }
    }
    return null;
}

function renderCultivatePage(parsedSysData) {
    let html = '';

    if(!window.currentIdolNameForCultivate) window.currentIdolNameForCultivate = (parsedSysData.status && parsedSysData.status['当前偶像']) || '';
    if(!window.currentIdolNameForCultivate && typeof idolDatabase !== 'undefined' && idolDatabase.length > 0) window.currentIdolNameForCultivate = idolDatabase[0].name;

    html += '<div id="page-cultivate" class="page">';

    // 1. 顶部头像栏
    html += '<div class="idol-list-container">';
    if(typeof idolDatabase !== 'undefined' && idolDatabase.length > 0) {
        idolDatabase.forEach(idol => {
            let activeClass = (idol.name === window.currentIdolNameForCultivate) ? 'active' : '';
            let lockedClass = (typeof checkIsUnlocked === 'function' && !checkIsUnlocked(idol.name)) ? 'locked' : '';
            let avatarUrl = typeof getAssetUrl === 'function' ? getAssetUrl(idol.name + "_头像", "avatar") : '';
            html += `<div class="idol-mini-wrap ${activeClass} ${lockedClass}" onclick="switchCultivateIdol('${idol.name}')" title="${idol.name}">
                        <img src="${avatarUrl}" class="idol-mini-avatar">
                        <div class="idol-mini-name">${idol.name}</div>
                     </div>`;
        });
    }
    html += '</div>';

    let currentCultivateUnlocked = (typeof checkIsUnlocked === 'function') ? checkIsUnlocked(window.currentIdolNameForCultivate) : true;

    // 2. 培养主视窗 (立绘与气泡)
    html += '<div class="cultivate-layout">';
    let currentIdolImgCultivate = typeof getAssetUrl === 'function' ? getAssetUrl(window.currentIdolNameForCultivate + "_立绘") : '';
    html += '<div class="cultivate-view">';
    if(currentIdolImgCultivate) html += `<img src="${currentIdolImgCultivate}" class="cultivate-avatar ${currentCultivateUnlocked ? '' : 'locked'}">`;
    else html += '<div style="text-align:center; padding-top:40%; color:#94a3b8;">暂无立绘数据</div>';

    if(!currentCultivateUnlocked) {
        html += '<div class="bubble-dialog show" id="cultivate-bubble" style="opacity:1; transform:translateY(-50%) scale(1);">该偶像尚未签订契约...</div>';
    } else {
        html += '<div class="bubble-dialog" id="cultivate-bubble">这里是对话内容...</div>';
    }
    html += '</div>';

    // 3. 互动按钮组
    html += `<div class="interact-btns" ${currentCultivateUnlocked ? '' : 'style="display:none;"'}>`;
    // 【图标修改 2】日常互动的 👋 替换为矢量挥手图标
    html += `<div class="interact-btn" onclick="toggleSubmenu(event, this)"><i class="bi bi-hand-wave-fill" style="font-size: 26px;"></i><span>日常</span>
                <div class="interact-submenu">
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('挠痒')">挠痒</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('送礼')">送礼</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('摸头')">摸头</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('交流')">交流</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('戳戳')">戳戳</div>
                </div>
             </div>`;
    // 【图标修改 3】R18互动的 🔞 替换为代表热度与成人的矢量火焰图标 (bi-fire)
    html += `<div class="interact-btn r18" onclick="toggleSubmenu(event, this)"><i class="bi bi-fire" style="font-size: 26px;"></i><span>R18</span>
                <div class="interact-submenu">
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('自慰')">自慰</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('揉胸')">揉胸</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('口交')">口交</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('亲吻')">亲吻</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('打屁股')">打屁股</div>
                </div>
             </div>`;
    html += '</div>';

    // 4. 背包展开按钮
    // 【图标修改 4】展开按钮的 🎒 替换为了矢量背包图标
    html += `<div class="btn-open-inv" onclick="toggleCultivateInv()" ${currentCultivateUnlocked ? '' : 'style="display:none;"'}><i class="bi bi-bag-fill"></i></div>`;

    // 提取背包数据
    let stardustCount = "0";
    let realItems = [];
    if(parsedSysData.inventory && Array.isArray(parsedSysData.inventory)) {
        parsedSysData.inventory.forEach(itemName => {
            if(itemName.includes("星尘")) stardustCount = itemName.replace(/[^0-9]/ig,"");
            else realItems.push(itemName);
        });
    }

    // 5. 弹出式背包面板
    html += `<div class="inventory-popup" id="cultivate-inv-popup">
                <div class="inv-header">
                    <!-- 【图标修改 5】标题处的 🎒 替换为了矢量背包图标 -->
                    <span style="font-size: 16px; font-weight: bold; color: #475569;"><i class="bi bi-bag-fill"></i> 培养背包</span>
                    <div class="stardust-display"><img src="https://i.postimg.cc/JhBnDD5Y/xing-chen-png-xiao.png">${stardustCount}</div>
                </div>
                <div class="inv-tabs">
                    <div class="inv-tab active" onclick="filterInv('all', this)">全部</div>
                    <div class="inv-tab" onclick="filterInv('business', this)">业务</div>
                    <div class="inv-tab" onclick="filterInv('psychology', this)">心理</div>
                    <div class="inv-tab" onclick="filterInv('easter_egg', this)">彩蛋</div>
                </div>
                <div class="inventory-grid" id="inv-grid-content">`;

    if(realItems.length > 0) {
        realItems.forEach(itemName => {
            let countMatch = itemName.match(/\*\s*(\d+)/); let count = countMatch ? countMatch[1] : 1; let cleanName = itemName.split('*')[0].trim();
            if(cleanName.includes('偶像印记')) {
                let idolN = cleanName.split('·')[0]; let bgImg = typeof getAssetUrl === 'function' ? getAssetUrl(idolN + "_头像", "avatar") : ''; let desc = `用于解锁 ${idolN} 潜力上限与强化专属特质。`;
                html += `<div class="inv-item mark-item" style="--mark-bg: url('${bgImg}')" data-type="business" onclick="openItemModal('${cleanName}', 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png', false, '${desc}')">
                            <img src="https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png"><div class="inv-count">${count}</div>
                         </div>`;
            } else {
                let matchedItem = findItemInfo(cleanName); // 使用全新的智能查找函数
                if (matchedItem) {
                    let imgHtml = matchedItem.isEmoji ? `<div class="inv-item-emoji">${matchedItem.img}</div>` : `<img src="${matchedItem.img}">`;
                    let safeDesc = matchedItem.desc.replace(/'/g, "\\'");
                    html += `<div class="inv-item" data-type="${matchedItem.type}" onclick="openItemModal('${matchedItem.name}', '${matchedItem.img}', ${matchedItem.isEmoji}, '${safeDesc}')">${imgHtml}<div class="inv-count">${count}</div></div>`;
                } else {
                    // 【图标修改 6】当物品没匹配到详细数据时的默认 📦 替换为矢量图标
                    html += `<div class="inv-item" data-type="unknown" onclick="openItemModal('${cleanName}', '<i class=\\\'bi bi-box-seam\\\'></i>', true, '暂无详细描述')"><div class="inv-item-emoji"><i class="bi bi-box-seam"></i></div><div class="inv-count">${count}</div></div>`;
                }
            }
        });
    } else {
        html += '<div style="grid-column:1/-1; text-align:center; font-size:14px; color:#94a3b8; padding:20px;">背包空空如也...</div>';
    }
    html += '</div></div></div></div>';

    return html;
}
