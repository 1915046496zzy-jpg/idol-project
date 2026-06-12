// ui_cultivate.js - 培养模块独立渲染逻辑 (终极数值修复 & UI弹窗升级版)

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
// 3. 终极队列分配提取算法 (解决同行数值覆盖Bug)
// ==========================================
function getCurrentIdolData(idolName, parsedSysData) {
    let dbData = typeof idolDatabase !== 'undefined' ? idolDatabase.find(i => i.name === idolName) : null;

    let stats = {
        vocal: { val: 0, desc: <q>"E级"</q>, color: <q>"#ec4899"</q>, icon: <q>"bi-mic-fill"</q> },
        dance: { val: 0, desc: <q>"E级"</q>, color: <q>"#8b5cf6"</q>, icon: <q>"bi-music-player-fill"</q> },
        visual: { val: 0, desc: <q>"E级"</q>, color: <q>"#eab308"</q>, icon: <q>"bi-camera-fill"</q> }
    };

    let status = {
        stress: { val: 0, color: <q>"#ef4444"</q>, icon: <q>"bi-exclamation-triangle-fill"</q>, name: <q>"Stress"</q> },
        affection: { val: 0, color: <q>"#f43f5e"</q>, icon: <q>"bi-heart-fill"</q>, name: <q>"Affection"</q> },
        obedience: { val: 0, color: <q>"#64748b"</q>, icon: <q>"bi-link"</q>, name: <q>"Obedience"</q> },
        lust: { val: 0, color: <q>"#a855f7"</q>, icon: <q>"bi-droplet-fill"</q>, name: <q>"Lust"</q> }
    };

    // 填入数据库初始值作为打底
    if (dbData) {
        if (dbData.stats) {
            if (dbData.stats[<q>"🎤 Vocal (唱功)"</q>]) { stats.vocal.val = dbData.stats[<q>"🎤 Vocal (唱功)"</q>].value; stats.vocal.desc = dbData.stats[<q>"🎤 Vocal (唱功)"</q>].desc.split('-')[0].trim(); }
            if (dbData.stats[<q>"💃 Dance (舞蹈)"</q>]) { stats.dance.val = dbData.stats[<q>"💃 Dance (舞蹈)"</q>].value; stats.dance.desc = dbData.stats[<q>"💃 Dance (舞蹈)"</q>].desc.split('-')[0].trim(); }
            if (dbData.stats[<q>"🌟 Visual (视觉)"</q>]) { stats.visual.val = dbData.stats[<q>"🌟 Visual (视觉)"</q>].value; stats.visual.desc = dbData.stats[<q>"🌟 Visual (视觉)"</q>].desc.split('-')[0].trim(); }
        }
        if (dbData.status) {
            if (dbData.status[<q>"💢 Stress (压力值)"</q>]) status.stress.val = dbData.status[<q>"💢 Stress (压力值)"</q>].value;
            if (dbData.status[<q>"❤️ Affection (羁绊)"</q>]) status.affection.val = dbData.status[<q>"❤️ Affection (羁绊)"</q>].value;
            if (dbData.status[<q>"⛓️ Obedience (服从度)"</q>]) status.obedience.val = dbData.status[<q>"⛓️ Obedience (服从度)"</q>].value;
            if (dbData.status[<q>"💰 Lust (堕落度)"</q>]) status.lust.val = dbData.status[<q>"💰 Lust (堕落度)"</q>].value;
        }
    }

    // 核心修复逻辑：从 AI 最新回复中精准排队分配数据
    if (parsedSysData && parsedSysData.status) {
        // 定义我们需要寻找的所有关键词和对应的目标对象
        let keywordsMap = [
            { keys: ['vocal', '唱功'], target: stats.vocal },
            { keys: ['dance', '舞蹈'], target: stats.dance },
            { keys: ['visual', '视觉'], target: stats.visual },
            { keys: ['stress', '压力'], target: status.stress },
            { keys: ['affection', '羁绊'], target: status.affection },
            { keys: ['obedience', '服从'], target: status.obedience },
            { keys: ['lust', '堕落'], target: status.lust }
        ];

        for (let key in parsedSysData.status) {
            // 将键和值拼接在一起，例如 <q>"Stress/Affection: 5% / 40%"</q>
            let combinedStr = (key + <q>":"</q> + parsedSysData.status[key]).toLowerCase();

            // 1. 找出这句话里出现的所有关键词，并记录它们出现的位置索引
            let foundTargets = [];
            keywordsMap.forEach(kwObj => {
                // 只要该组关键词里有一个匹配到了，就记录位置（避免中英文混用导致重复提取）
                let firstFoundIdx = -1;
                for (let i = 0; i < kwObj.keys.length; i++) {
                    let idx = combinedStr.indexOf(kwObj.keys[i]);
                    if (idx !== -1) {
                        firstFoundIdx = idx;
                        break;
                    }
                }
                if (firstFoundIdx !== -1) {
                    foundTargets.push({ idx: firstFoundIdx, target: kwObj.target });
                }
            });

            // 按照关键词出现的先后顺序排序
            foundTargets.sort((a, b) => a.idx - b.idx);

            // 2. 找出这句话里所有的数字顺序
            let numMatches = [...combinedStr.matchAll(/(\d+)/g)];

            // 3. 一对一分配座位！排在第几个的词，就拿第几个数字
            for (let i = 0; i < Math.min(foundTargets.length, numMatches.length); i++) {
                foundTargets[i].target.val = parseInt(numMatches[i][1]);
            }
        }
    }

    return { stats, status };
}

// ==========================================
// 4. 渲染培养主页
// ==========================================
function renderCultivatePage(parsedSysData) {
    let html = '';

    if(!window.currentIdolNameForCultivate) window.currentIdolNameForCultivate = (parsedSysData.status && parsedSysData.status['当前偶像']) || '';
    if(!window.currentIdolNameForCultivate && typeof idolDatabase !== 'undefined' && idolDatabase.length > 0) window.currentIdolNameForCultivate = idolDatabase[0].name;

    html += '<div id="page-cultivate" class="page">';

    html += '<div class="idol-list-container">';
    if(typeof idolDatabase !== 'undefined' && idolDatabase.length > 0) {
        idolDatabase.forEach(idol => {
            let activeClass = (idol.name === window.currentIdolNameForCultivate) ? 'active' : '';
            let lockedClass = (typeof checkIsUnlocked === 'function' && !checkIsUnlocked(idol.name)) ? 'locked' : '';
            let avatarUrl = typeof getAssetUrl === 'function' ? getAssetUrl(idol.name + <q>"_头像"</q>, <q>"avatar"</q>) : '';
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

    let currentData = getCurrentIdolData(window.currentIdolNameForCultivate, parsedSysData);

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

    let currentIdolImgCultivate = typeof getAssetUrl === 'function' ? getAssetUrl(window.currentIdolNameForCultivate + <q>"_立绘"</q>) : '';
    html += '<div class="cultivate-view">';
    if(currentIdolImgCultivate) html += `<img src="${currentIdolImgCultivate}" class="cultivate-avatar ${currentCultivateUnlocked ? '' : 'locked'}">`;
    else html += '<div style="text-align:center; padding-top:40%; color:#94a3b8;">暂无立绘数据</div>';

    if(!currentCultivateUnlocked) {
        html += '<div class="bubble-dialog show" id="cultivate-bubble" style="opacity:1; transform:translateY(-50%) scale(1);">该偶像尚未签订契约...</div>';
    } else {
        html += '<div class="bubble-dialog" id="cultivate-bubble">这里是对话内容...</div>';
    }
    html += '</div>';

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

    html += `<div class="btn-open-inv" onclick="toggleCultivateInv()" ${currentCultivateUnlocked ? '' : 'style="display:none;"'}><i class="bi bi-bag-fill"></i></div>`;

    let stardustCount = <q>"0"</q>;
    let realItems = [];
    if(parsedSysData.inventory && Array.isArray(parsedSysData.inventory)) {
        parsedSysData.inventory.forEach(itemName => {
            if(itemName.includes(<q>"星尘"</q>)) stardustCount = itemName.replace(/[^0-9]/ig,<q>""</q>);
            else realItems.push(itemName);
        });
    }

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
                let idolN = cleanName.split('·')[0]; let bgImg = typeof getAssetUrl === 'function' ? getAssetUrl(idolN + <q>"_头像"</q>, <q>"avatar"</q>) : ''; let desc = `用于解锁 ${idolN} 潜力上限与强化专属特质。`;
                html += `<div class="inv-item mark-item" style="--mark-bg: url('${bgImg}')" data-type="business" onclick="openItemModal('${cleanName}', 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png', false, '${desc}')">
                            <img src="https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png"><div class="inv-count">${count}</div>
                         </div>`;
            } else {
                let matchedItem = findItemInfo(cleanName);
                if (matchedItem) {
                    let imgHtml = matchedItem.isEmoji ? `<div class="inv-item-emoji">${matchedItem.img}</div>` : `<img src="${matchedItem.img}">`;
                    let safeDesc = matchedItem.desc.replace(/'/g, <q>"\\'"</q>);
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
