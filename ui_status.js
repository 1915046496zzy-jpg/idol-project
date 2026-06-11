// ==========================================
// 状态面板渲染模块 (ui_status.js)
// ==========================================

function renderStatusPage(parsedSysData) {
    let html = '';
    try {
        // 全局变量保护
        if (!window.currentIdolNameForStatus) {
            window.currentIdolNameForStatus = (parsedSysData.status && parsedSysData.status['当前偶像']) || '';
        }
        if (!window.currentIdolNameForStatus && typeof idolDatabase !== 'undefined' && idolDatabase.length > 0) {
            window.currentIdolNameForStatus = idolDatabase[0].name;
        }

        html += '<div id="page-status" class="page">';

        // 1. 顶部头像选择列表
        html += '<div class="idol-list-container">';
        if (typeof idolDatabase !== 'undefined' && idolDatabase.length > 0) {
            idolDatabase.forEach(idol => {
                let activeClass = (idol.name === window.currentIdolNameForStatus) ? 'active' : '';
                let lockedClass = (typeof checkIsUnlocked === 'function' && !checkIsUnlocked(idol.name)) ? 'locked' : '';
                let avatarUrl = typeof getAssetUrl === 'function' ? getAssetUrl(idol.name + "_头像", "avatar") : '';
                html += `<div class="idol-mini-wrap ${activeClass} ${lockedClass}" onclick="switchStatusIdol('${idol.name}')" title="${idol.name}">
                            <img src="${avatarUrl}" class="idol-mini-avatar">
                            <div class="idol-mini-name">${idol.name}</div>
                         </div>`;
            });
        }
        html += '</div>';

        // 数据防呆
        var sData = parsedSysData.status || {};
        var isCurrentStatus = (sData['当前偶像'] === window.currentIdolNameForStatus);
        let currentStatusUnlocked = (typeof checkIsUnlocked === 'function') ? checkIsUnlocked(window.currentIdolNameForStatus) : true;

        let avatarImg = typeof getAssetUrl === 'function' ? getAssetUrl(window.currentIdolNameForStatus + "_立绘", "avatar") : '';
        if (!avatarImg) avatarImg = typeof getAssetUrl === 'function' ? getAssetUrl(window.currentIdolNameForStatus + "_头像", "avatar") : '';

        // 主控制台容器
        html += `<div class="dashboard">`;

        // 左侧：身份卡片
        html += `<div class="s-column identity-col">
                    <div class="char-name">${window.currentIdolNameForStatus || '未知偶像'}</div>
                    <div class="char-img-placeholder ${currentStatusUnlocked ? '' : 'locked'}">
                        <img src="${avatarImg}" onerror="this.style.display='none'">
                    </div>
                    <div class="status-tag">
                        <i class="bi bi-person-fill"></i>
                        <div><b>当前姿势：</b><br><span style="color: var(--s-text-dark);">${isCurrentStatus ? (sData['姿势']||'站立') : '-'}</span></div>
                    </div>
                    <div class="status-tag" style="background: var(--s-bg-color);">
                        <i class="bi bi-chat-dots-fill"></i>
                        <div><b>当前心理：</b><br><span style="color: var(--s-text-dark);">${isCurrentStatus ? ('“'+(sData['心声']||'...')+'”') : '等待数据同步...'}</span></div>
                    </div>
                 </div>`;

        // 右侧：交互控制台
        html += `<div class="s-column hub-col">
                    <!-- 生理状态卡片 -->
                    <div class="hub-card health-card">
                        <div class="hub-card-title"><i class="bi bi-heart-pulse-fill"></i> 核心生理状态</div>
                        <div class="health-grid">
                            <div class="health-item">
                                <i class="bi bi-droplet-fill"></i>
                                <div><span>生理期状态</span><span>${isCurrentStatus ? (sData['生理状态']||'-') : '-'}</span></div>
                            </div>
                            <div class="health-item">
                                <i class="bi bi-shield-check"></i>
                                <div><span>处女膜状态</span><span>${isCurrentStatus ? (sData['处女膜']||'-') : '-'}</span></div>
                            </div>
                        </div>
                    </div>

                    <!-- 着装查看入口 -->
                    <div class="hub-card">
                        <div class="hub-card-left">
                            <div class="hub-card-title"><i class="bi bi-bag-heart-fill"></i> 外观与着装</div>
                            <div class="hub-card-desc">查看当前上衣、下装、内衣及饰品状态</div>
                        </div>
                        <button class="hub-btn" onclick="openSubPanel('pad-status-gear')">查看详情 <i class="bi bi-chevron-right" style="margin:0 0 0 5px; color:#fff;"></i></button>
                    </div>

                    <!-- 身体监察入口 -->
                    <div class="hub-card">
                        <div class="hub-card-left">
                            <div class="hub-card-title"><i class="bi bi-activity"></i> 深度身体监察</div>
                            <div class="hub-card-desc">检查皮肤、口腔、胸部、下体等细微生理反应</div>
                        </div>
                        <button class="hub-btn" onclick="openSubPanel('pad-status-body')">执行监察 <i class="bi bi-chevron-right" style="margin:0 0 0 5px; color:#fff;"></i></button>
                    </div>

                    <!-- 经验统计入口 -->
                    <div class="hub-card">
                        <div class="hub-card-left">
                            <div class="hub-card-title"><i class="bi bi-journal-text"></i> 性爱经验档案</div>
                            <div class="hub-card-desc">查阅各部位开发进度与累计性经验</div>
                        </div>
                        <button class="hub-btn" onclick="openSubPanel('pad-status-exp')">调阅档案 <i class="bi bi-chevron-right" style="margin:0 0 0 5px; color:#fff;"></i></button>
                    </div>
                 </div>`;

        // ================= 隐藏的子面板 (覆盖层) =================

        // 1. 着装子面板
        html += `<div class="sub-panel" id="pad-status-gear">
                    <div class="sub-panel-header">
                        <button class="btn-sub-back" onclick="closeSubPanel('pad-status-gear')"><i class="bi bi-arrow-left" style="margin:0;"></i></button>
                        <div class="sub-panel-title"><i class="bi bi-bag-heart-fill"></i> 外观着装状态</div>
                    </div>
                    <div class="sub-panel-content">
                        <div class="gear-list">
                            <div class="gear-item"><div class="gear-label"><i class="bi bi-layers-half"></i> 上衣</div><div class="gear-text">${isCurrentStatus ? (sData['上衣']||'-') : '-'}</div></div>
                            <div class="gear-item"><div class="gear-label"><i class="bi bi-layers"></i> 下衣</div><div class="gear-text">${isCurrentStatus ? (sData['下衣']||'-') : '-'}</div></div>
                            <div class="gear-item"><div class="gear-label"><i class="bi bi-suit-heart-fill"></i> 内衣裤</div><div class="gear-text">${isCurrentStatus ? (sData['内衣内裤']||'-') : '-'}</div></div>
                            <div class="gear-item"><div class="gear-label"><i class="bi bi-cursor-fill"></i> 鞋袜</div><div class="gear-text">${isCurrentStatus ? (sData['鞋袜']||'-') : '-'}</div></div>
                            <div class="gear-item" style="grid-column:1/-1;"><div class="gear-label"><i class="bi bi-gem"></i> 饰品配件</div><div class="gear-text">${isCurrentStatus ? (sData['持有佩戴品']||'-') : '-'}</div></div>
                        </div>
                    </div>
                 </div>`;

        // 2. 身体监察子面板
        html += `<div class="sub-panel" id="pad-status-body">
                    <div class="sub-panel-header">
                        <button class="btn-sub-back" onclick="closeSubPanel('pad-status-body')"><i class="bi bi-arrow-left" style="margin:0;"></i></button>
                        <div class="sub-panel-title"><i class="bi bi-activity"></i> 深度身体监察报告</div>
                    </div>
                    <div class="sub-panel-content">
                        <div class="body-list">
                            <div class="body-node"><div class="node-title"><i class="bi bi-brightness-high"></i> 皮肤</div><div class="node-text">${isCurrentStatus ? (sData['皮肤']||'-') : '-'}</div></div>
                            <div class="body-node"><div class="node-title"><i class="bi bi-droplet-half"></i> 口腔</div><div class="node-text">${isCurrentStatus ? (sData['口腔']||'-') : '-'}</div></div>
                            <div class="body-node sensitive"><div class="node-title node-sensitive-title"><i class="bi bi-suit-heart-fill"></i> 胸部</div><div class="node-text">${isCurrentStatus ? (sData['胸部']||'-') : '-'}</div></div>
                            <div class="body-node sensitive"><div class="node-title node-sensitive-title"><i class="bi bi-record-circle"></i> 乳头</div><div class="node-text">${isCurrentStatus ? (sData['乳头']||'-') : '-'}</div></div>
                            <div class="body-node"><div class="node-title"><i class="bi bi-circle-half"></i> 臀部</div><div class="node-text">${isCurrentStatus ? (sData['臀部']||'-') : '-'}</div></div>
                            <div class="body-node sensitive"><div class="node-title node-sensitive-title"><i class="bi bi-flower1"></i> 小穴</div><div class="node-text">${isCurrentStatus ? (sData['小穴']||'-') : '-'}</div></div>
                            <div class="body-node"><div class="node-title"><i class="bi bi-bullseye"></i> 菊花</div><div class="node-text">${isCurrentStatus ? (sData['菊花']||'-') : '-'}</div></div>
                            <div class="body-node"><div class="node-title"><i class="bi bi-arrow-through-heart"></i> 子宫</div><div class="node-text">${isCurrentStatus ? (sData['子宫']||'-') : '-'}</div></div>
                        </div>
                    </div>
                 </div>`;

        // 3. 经验统计子面板
        html += `<div class="sub-panel" id="pad-status-exp">
                    <div class="sub-panel-header">
                        <button class="btn-sub-back" onclick="closeSubPanel('pad-status-exp')"><i class="bi bi-arrow-left" style="margin:0;"></i></button>
                        <div class="sub-panel-title"><i class="bi bi-journal-text"></i> 性爱经验档案</div>
                    </div>
                    <div class="sub-panel-content">
                        <div class="exp-grid">
                            <div class="exp-item"><div class="exp-icon"><i class="bi bi-emoji-kiss-fill"></i></div><div class="exp-label">口交次数</div><div class="exp-val">${isCurrentStatus ? (sData['口交次数']||'0') : '0'}</div></div>
                            <div class="exp-item"><div class="exp-icon"><i class="bi bi-suit-heart-fill"></i></div><div class="exp-label">乳交次数</div><div class="exp-val">${isCurrentStatus ? (sData['乳交次数']||'0') : '0'}</div></div>
                            <div class="exp-item"><div class="exp-icon"><i class="bi bi-hand-index-fill"></i></div><div class="exp-label">手交次数</div><div class="exp-val">${isCurrentStatus ? (sData['手交次数']||'0') : '0'}</div></div>
                            <div class="exp-item"><div class="exp-icon"><i class="bi bi-flower1"></i></div><div class="exp-label">阴道交次数</div><div class="exp-val">${isCurrentStatus ? (sData['阴道交次数']||'0') : '0'}</div></div>
                            <div class="exp-item"><div class="exp-icon"><i class="bi bi-bullseye"></i></div><div class="exp-label">肛交次数</div><div class="exp-val">${isCurrentStatus ? (sData['肛交次数']||'0') : '0'}</div></div>
                            <div class="exp-item"><div class="exp-icon"><i class="bi bi-droplet-fill"></i></div><div class="exp-label">体内中出</div><div class="exp-val">${isCurrentStatus ? (sData['中出次数']||'0') : '0'}</div></div>
                        </div>
                    </div>
                 </div>`;

        html += `</div>`; // .dashboard 结束
        html += '</div>'; // #page-status 结束

    } catch(err) {
        console.error("渲染状态页时出错:", err);
        html += `<div id="page-status" class="page"><div style="padding:50px;text-align:center;color:#ef4444;font-weight:bold;">📊 状态数据报错了：<br>${err.message}</div></div>`;
    }
    return html;
}
