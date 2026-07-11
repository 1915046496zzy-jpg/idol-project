// ui_cultivate.js - 培养模块独立渲染逻辑 (MVU直读终极版)

// ==========================================
// 1. 自动注入专属 CSS (包含面板的弹窗动画与新按钮)
// ==========================================
(function() {
    if (document.getElementById('cultivate-monitor-style')) return;
    const style = document.createElement('style');
    style.id = 'cultivate-monitor-style';
    style.innerHTML = `
        .btn-open-monitor {
            position: absolute;
            top: 15px;
            left: 15px;
            width: 46px;
            height: 46px;
            background: rgba(255,255,255,0.9);
            border: 2px solid #cbd5e1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            z-index: 10;
            transition: 0.2s;
            color: #64748b;
        }
        .btn-open-monitor:hover {
            border-color: var(--theme-text-main, #db2777);
            color: var(--theme-text-main, #db2777);
            transform: scale(1.1);
        }

        .status-monitor-panel {
            position: absolute;
            left: 20px;
            top: 75px;
            width: 240px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            z-index: 50;
            display: flex;
            flex-direction: column;
            gap: 15px;
            transform-origin: top left;
            transform: scale(0);
            opacity: 0;
            pointer-events: none;
            transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .status-monitor-panel.open {
            transform: scale(1);
            opacity: 1;
            pointer-events: auto;
        }

        .monitor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--theme-text-main, #db2777);
            padding-bottom: 8px;
        }
        .monitor-title {
            font-size: 15px;
            font-weight: 900;
            color: #334155;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .monitor-close {
            cursor: pointer;
            font-size: 18px;
            color: #94a3b8;
            transition: 0.2s;
        }
        .monitor-close:hover { color: #ef4444; transform: rotate(90deg); }

        .monitor-section { display: flex; flex-direction: column; gap: 10px; }
        .monitor-subtitle { font-size: 12px; color: #94a3b8; font-weight: bold; margin-bottom: -2px; }

        .stat-row, .status-row { display: flex; flex-direction: column; gap: 5px; }
        .stat-label, .status-label { font-size: 12px; font-weight: bold; color: #475569; display: flex; justify-content: space-between;}
        .stat-val, .status-val { font-size: 12px; font-weight: 900; color: #64748b; text-align: right; margin-top: -18px;}

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

        @keyframes stressFlash { 0% { opacity: 1; } 50% { opacity: 0.5; filter: drop-shadow(0 0 5px #ef4444); } 100% { opacity: 1; } }
        .stress-warning .status-label { color: #ef4444; animation: stressFlash 1s infinite; }
    `;
    document.head.appendChild(style);
})();

window.toggleMonitorPanel = function() {
    let p = document.getElementById('cultivate-monitor-popup');
    if(p) p.classList.toggle('open');
};

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
// 3. 全新 MVU 解锁判定与状态直读
// ==========================================
window.checkIsUnlocked = function(idolName) {
    if (typeof TEST_MODE_ALL_UNLOCKED !== 'undefined' && TEST_MODE_ALL_UNLOCKED) return true;
    try {
        let allVars = typeof getAllVariables === 'function' ? getAllVariables() : {};
        let unlockedList = _.get(allVars, 'stat_data.世界.已获得偶像', []);
        // 如果系统里存的是字符串，转成数组
        if (typeof unlockedList === 'string') unlockedList = [unlockedList];
        return unlockedList.includes(idolName);
    } catch(e) {
        return false;
    }
};

function getCurrentIdolData(idolName) {
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

    try {
        let allVars = typeof getAllVariables === 'function' ? getAllVariables() : {};
        let idolData = _.get(allVars, `stat_data.登场艺人名单.${idolName}`, null);

        if (idolData) {
            // 读取业务能力与评级
            const getLvl = (v) => v >= 96 ? "S级" : v >= 81 ? "A级" : v >= 61 ? "B级" : v >= 41 ? "C级" : v >= 21 ? "D级" : "E级";

            if (idolData.业务能力) {
                stats.vocal.val = idolData.业务能力.Vocal_唱功 || 0;
                stats.vocal.desc = getLvl(stats.vocal.val);

                stats.dance.val = idolData.业务能力.Dance_舞蹈 || 0;
                stats.dance.desc = getLvl(stats.dance.val);

                stats.visual.val = idolData.业务能力.Visual_视觉 || 0;
                stats.visual.desc = getLvl(stats.visual.val);
            }
            // 读取心理状态
            if (idolData.心理与互动状态) {
                status.stress.val = idolData.心理与互动状态.Stress_压力值 || 0;
                status.affection.val = idolData.心理与互动状态.Affection_羁绊 || 0;
                status.obedience.val = idolData.心理与互动状态.Obedience_服从度 || 0;
                status.lust.val = idolData.心理与互动状态.Lust_堕落度 || 0;
            }
        }
    } catch(e) {
        console.error("MVU 数据读取失败，返回默认值", e);
    }

    return { stats, status };
}

// ==========================================
// 4. 渲染培养主页
// ==========================================
function renderCultivatePage(parsedSysData) {
    let html = '';

    // 默认展示的偶像（优先从 MVU 提取已解锁的第一个）
    try {
        let allVars = typeof getAllVariables === 'function' ? getAllVariables() : {};
        let unlockedList = _.get(allVars, 'stat_data.世界.已获得偶像', []);
        if (typeof unlockedList === 'string') unlockedList = [unlockedList];
        if (!window.currentIdolNameForCultivate && unlockedList.length > 0) {
            window.currentIdolNameForCultivate = unlockedList[0];
        }
    } catch(e) {}

    if(!window.currentIdolNameForCultivate && typeof idolDatabase !== 'undefined' && idolDatabase.length > 0) {
        window.currentIdolNameForCultivate = idolDatabase[0].name;
    }

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

    html += '<div class="cultivate-layout">';

    html += `<div class="btn-open-monitor" onclick="window.toggleMonitorPanel()" ${currentCultivateUnlocked ? '' : 'style="display:none;"'} title="查看状态面板"><i class="bi bi-radar"></i></div>`;

    // 调用 MVU 提取函数
    let currentData = getCurrentIdolData(window.currentIdolNameForCultivate);

    html += `<div class="status-monitor-panel" id="cultivate-monitor-popup" ${currentCultivateUnlocked ? '' : 'style="filter: grayscale(1); opacity: 0.5;"'}>
                <div class="monitor-header">
                    <div class="monitor-title"><i class="bi bi-cpu-fill"></i> 实时终端监视</div>
                    <i class="bi bi-x-lg monitor-close" onclick="window.toggleMonitorPanel()"></i>
                </div>

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

                <div class="monitor-section">
                    <div class="monitor-subtitle">心理状态 (Status)</div>`;
    Object.values(currentData.status).forEach(st => {
        let warningAnim = (st.name === 'Stress' && st.val >= 80) ? 'stress-warning' : '';
        let unit = st.name === 'Stress' ? '%' : '';
        html += `   <div class="status-row ${warningAnim}">
                        <div class="status-label"><i class="bi ${st.icon}" style="color:${st.color}"></i> ${st.name}</div>
                        <div class="status-bar-bg">
                            <div class="status-bar-fill" style="width: ${st.val}%; background: ${st.color};"></div>
                        </div>
                        <div class="status-val">${st.val}${unit}</div>
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

    // 全新 MVU 背包数据提取
    let stardustCount = "0";
    let realItems = [];
    try {
        let allVars = typeof getAllVariables === 'function' ? getAllVariables() : {};
        stardustCount = _.get(allVars, 'stat_data.世界.星尘', 0).toString();
        let mvuBag = _.get(allVars, 'stat_data.世界.背包', {});

        Object.keys(mvuBag).forEach(itemName => {
            let count = mvuBag[itemName].数量 || 1;
            realItems.push(`${itemName} * ${count}`);
        });
    } catch(e) {
        console.error("提取 MVU 背包数据失败", e);
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

// ==========================================
// 5. 挂载自动刷新监听 (只要MVU数值变化，UI立刻刷新)
// ==========================================
$(function() {
    if (typeof eventOn === 'function' && typeof Mvu !== 'undefined' && Mvu.events) {
        eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => {
            if (typeof renderAllPages === 'function') {
                renderAllPages();
            }
        });
    }
});
