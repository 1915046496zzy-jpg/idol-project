// ui_cultivate.js - 培养模块独立渲染逻辑 (含状态监视面板升级版)

// ==========================================
// 1. 自动注入专属 CSS (哥哥不需要手动去加样式啦)
// ==========================================
(function() {
    if (document.getElementById('cultivate-monitor-style')) return;
    const style = document.createElement('style');
    style.id = 'cultivate-monitor-style';
    style.innerHTML = `
        .status-monitor-panel {
            position: absolute;
            left: 15px;
            top: 15px;
            width: 220px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.6);
            border-radius: 16px;
            padding: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            z-index: 5;
            display: flex;
            flex-direction: column;
            gap: 15px;
            pointer-events: none; /* 让它不影响底层立绘的拖拽或点击 */
            transition: 0.3s;
        }
        .monitor-title {
            font-size: 14px;
            font-weight: 900;
            color: #334155;
            border-bottom: 2px solid var(--theme-text-main, #db2777);
            padding-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .monitor-section { display: flex; flex-direction: column; gap: 8px; }
        .monitor-subtitle { font-size: 12px; color: #94a3b8; font-weight: bold; margin-bottom: 2px; }

        .stat-row, .status-row { display: flex; flex-direction: column; gap: 4px; }
        .stat-label, .status-label { font-size: 12px; font-weight: bold; color: #475569; display: flex; justify-content: space-between;}
        .stat-val, .status-val { font-size: 11px; font-weight: 900; color: #64748b; text-align: right; margin-top: -16px;}

        .stat-bar-bg, .status-bar-bg {
            width: 100%;
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            overflow: hidden;
        }
        .stat-bar-fill, .status-bar-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 压力值过高时的闪烁警告 */
        @keyframes stressFlash { 0% { opacity: 1; } 50% { opacity: 0.5; filter: drop-shadow(0 0 5px #ef4444); } 100% { opacity: 1; } }
        .stress-warning .status-label { color: #ef4444; animation: stressFlash 1s infinite; }
    `;
    document.head.appendChild(style);
})();

// ==========================================
// 2. 智能道具查找函数
// ==========================================
function findItemInfo(itemName) {
    if (typeof itemPool === 'undefined') return null;
    if (Array.isArray(itemPool)) {
        return itemPool.find(i => itemName.includes(i.name));
    } else {
        for (let key in itemPool) {
            if (itemName.includes(key)) {
                let item = itemPool[key];
                return {
                    name: key,
                    type: item.type || 'unknown',
                    isEmoji: item.icon ? true : (item.isEmoji || false),
                    img: item.icon || item.img || '<i class="bi bi-box-seam"></i>',
                    desc: item.desc || '暂无详细描述'
                };
            }
        }
    }
    return null;
}

// ==========================================
// 3. 智能获取当前偶像状态数据的函数 (新增)
// ==========================================
function getCurrentIdolData(idolName, parsedSysData) {
    // 先从数据库找到该偶像的基础数据
    let dbData = typeof idolDatabase !== 'undefined' ? idolDatabase.find(i => i.name === idolName) : null;

    let stats = {
        vocal: { val: 0, desc: "E级", color: "#ec4899", icon: "bi-mic-fill" },
        dance: { val: 0, desc: "E级", color: "#8b5cf6", icon: "bi-music-player-fill" },
        visual: { val: 0, desc: "E级", color: "#eab308", icon: "bi-camera-fill" }
    };

    let status = {
        stress: { val: 0, color: "#ef4444", icon: "bi-exclamation-triangle-fill", name: "Stress" },
        affection: { val: 0, color: "#f43f5e", icon: "bi-heart-fill", name: "Affection" },
        obedience: { val: 0, color: "#64748b", icon: "bi-link", name: "Obedience" },
        lust: { val: 0, color: "#a855f7", icon: "bi-droplet-fill", name: "Lust" }
    };

    // 填入数据库初始值
    if (dbData) {
        if (dbData.stats) {
            if (dbData.stats["🎤 Vocal (唱功)"]) { stats.vocal.val = dbData.stats["🎤 Vocal (唱功)"].value; stats.vocal.desc = dbData.stats["🎤 Vocal (唱功)"].desc.split('-')[0].trim(); }
            if (dbData.stats["💃 Dance (舞蹈)"]) { stats.dance.val = dbData.stats["💃 Dance (舞蹈)"].value; stats.dance.desc = dbData.stats["💃 Dance (舞蹈)"].desc.split('-')[0].trim(); }
            if (dbData.stats["🌟 Visual (视觉)"]) { stats.visual.val = dbData.stats["🌟 Visual (视觉)"].value; stats.visual.desc = dbData.stats["🌟 Visual (视觉)"].desc.split('-')[0].trim(); }
        }
        if (dbData.status) {
            if (dbData.status["💢 Stress (压力值)"]) status.stress.val = dbData.status["💢 Stress (压力值)"].value;
            if (dbData.status["❤️ Affection (羁绊)"]) status.affection.val = dbData.status["❤️ Affection (羁绊)"].value;
            if (dbData.status["⛓️ Obedience (服从度)"]) status.obedience.val = dbData.status["⛓️ Obedience (服从度)"].value;
            if (dbData.status["💰 Lust (堕落度)"]) status.lust.val = dbData.status["💰 Lust (堕落度)"].value;
        }
    }

    // 提取当前 AI 回复里更新的动态数据并覆盖
    if (parsedSysData && parsedSysData.status) {
        let sys = parsedSysData.status;
        let vKey = Object.keys(sys).find(k => k.includes('唱功') || k.includes('Vocal'));
        if (vKey) { let m = sys[vKey].match(/(\d+)/); if(m) stats.vocal.val = parseInt(m[1]); }
        let dKey = Object.keys(sys).find(k => k.includes('舞蹈') || k.includes('Dance'));
        if (dKey) { let m = sys[dKey].match(/(\d+)/); if(m) stats.dance.val = parseInt(m[1]); }
        let visKey = Object.keys(sys).find(k => k.includes('视觉') || k.includes('Visual'));
        if (visKey) { let m = sys[visKey].match(/(\d+)/); if(m) stats.visual.val = parseInt(m[1]); }

        let strKey = Object.keys(sys).find(k => k.includes('压力') || k.includes('Stress'));
        if (strKey) { let m = sys[strKey].match(/(\d+)/); if(m) status.stress.val = parseInt(m[1]); }
        let affKey = Object.keys(sys).find(k => k.includes('羁绊') || k.includes('Affection'));
        if (affKey) { let m = sys[affKey].match(/(\d+)/); if(m) status.affection.val = parseInt(m[1]); }
        let obeKey = Object.keys(sys).find(k => k.includes('服从') || k.includes('Obedience'));
        if (obeKey) { let m = sys[obeKey].match(/(\d+)/); if(m) status.obedience.val = parseInt(m[1]); }
        let lusKey = Object.keys(sys).find(k => k.includes('堕落') || k.includes('Lust'));
        if (lusKey) { let m = sys[lusKey].match(/(\d+)/); if(m) status.lust.val = parseInt(m[1]); }
    }

    return { stats, status };
}

// ==========================================
// 4. 渲染培养主页 (整合了状态监视面板)
// ==========================================
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

    // 2. 培养主视窗布局开始
    html += '<div class="cultivate-layout">';

    // 【新增核心功能】获取并渲染左侧状态监视面板
    let currentData = getCurrentIdolData(window.currentIdolNameForCultivate, parsedSysData);

    html += `<div class="status-monitor-panel" ${currentCultivateUnlocked ? '' : 'style="filter: grayscale(1); opacity: 0.5;"'}>
                <div class="monitor-title"><i class="bi bi-cpu-fill"></i> 实时监视</div>

                <!-- 业务能力区 -->
                <div class="monitor-section">
                    <div class="monitor-subtitle">业务评级 (Stats)</div>`;
    Object.values(currentData.stats).forEach(stat => {
        html += `   <div class="stat-row">
                        <div class="stat-label"><i class="bi ${stat.icon}" style="color:${stat.color}"></i> ${stat.desc}</div>
                        <div class="stat-bar-bg">
                            <div class="stat-bar-fill" style="width: ${stat.val}%; background: ${stat.color};"></div>
                        </div>
                        <div class="stat-val">${stat.val}</div>
                    </div>`;
    });
    html += `   </div>

                <!-- 心理状态区 -->
                <div class="monitor-section">
                    <div class="monitor-subtitle">心理状态 (Status)</div>`;
    Object.values(currentData.status).forEach(st => {
        let warningAnim = (st.name === 'Stress' && st.val >= 80) ? 'stress-warning' : '';
        html += `   <div class="status-row ${warningAnim}">
                        <div class="status-label"><i class="bi ${st.icon}" style="color:${st.color}"></i> ${st.name}</div>
                        <div class="status-bar-bg">
                            <div class="status-bar-fill" style="width: ${st.val}%; background: ${st.color};"></div>
                        </div>
                        <div class="status-val">${st.val}%</div>
                    </div>`;
    });
    html += `   </div>
             </div>`;

    // 3. 立绘与气泡
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

    // 4. 互动按钮组
    html += `<div class="interact-btns" ${currentCultivateUnlocked ? '' : 'style="display:none;"'}>`;
    html += `<div class="interact-btn" onclick="toggleSubmenu(event, this)"><i class="bi bi-cup-hot-fill" style="font-size: 24px; margin-bottom: -2px;"></i><span>日常</span>
                <div class="interact-submenu">
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('挠痒')">挠痒</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('送礼')">送礼</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('摸头')">摸头</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('交流')">交流</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('戳戳')">戳戳</div>
                </div>
             </div>`;
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

    // 5. 背包展开按钮
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

    // 6. 弹出式背包面板
    html += `<div class="inventory-popup" id="cultivate-inv-popup">
                <div class="inv-header">
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
                let matchedItem = findItemInfo(cleanName);
                if (matchedItem) {
                    let imgHtml = matchedItem.isEmoji ? `<div class="inv-item-emoji">${matchedItem.img}</div>` : `<img src="${matchedItem.img}">`;
                    let safeDesc = matchedItem.desc.replace(/'/g, "\\'");
                    html += `<div class="inv-item" data-type="${matchedItem.type}" onclick="openItemModal('${matchedItem.name}', '${matchedItem.img}', ${matchedItem.isEmoji}, '${safeDesc}')">${imgHtml}<div class="inv-count">${count}</div></div>`;
                } else {
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
