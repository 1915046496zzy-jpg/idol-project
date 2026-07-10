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
                            <!-- 第一排：外衣并排 -->
                            <div class="gear-item"><div class="gear-label"><i class="bi bi-layers-half"></i> 上衣</div><div class="gear-text">${isCurrentStatus ? (sData['上衣']||'-') : '-'}</div></div>
                            <div class="gear-item"><div class="gear-label"><i class="bi bi-layers"></i> 下衣</div><div class="gear-text">${isCurrentStatus ? (sData['下衣']||'-') : '-'}</div></div>
                            
                            <!-- 第二排：内衣裤并排 (内裤使用自定义SVG) -->
                            <div class="gear-item"><div class="gear-label"><i class="bi bi-suit-heart-fill"></i> 内衣</div><div class="gear-text">${isCurrentStatus ? (sData['内衣']||'-') : '-'}</div></div>
                            <div class="gear-item">
                                <div class="gear-label">
                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                         viewBox="0 0 512 512" xml:space="preserve" 
                                         width="1.1em" height="1.1em" style="vertical-align: -0.15em; margin-right: 4px;">
                                        <path style="fill:#FF8B9B;" d="M0,304.543l198.815,99.407c8.58,4.29,18.041,6.524,27.635,6.524h59.102c9.593,0,19.054-2.233,27.635-6.524L512,304.543H0z"/>
                                        <path style="fill:#FFAAB9;" d="M495.262,162.27c-0.523-4.446-4.29-7.796-8.767-7.796H25.505c-4.477,0-8.244,3.35-8.767,7.796L0,304.543c0,0,135.732-7.985,202.177,89.946c6.679,9.844,17.591,15.985,29.487,15.985h48.67c11.896,0,22.808-6.141,29.487-15.985C376.268,296.559,512,304.543,512,304.543L495.262,162.27z"/>
                                        <path style="fill:#FF9BA9;" d="M25.505,154.474c-4.477,0-8.244,3.35-8.767,7.796l-3.238,27.514h484.997l-3.237-27.514c-0.523-4.446-4.29-7.796-8.767-7.796H25.505z"/>
                                        <path style="fill:#FFAAB9;" d="M317.569,110.56c-12.052-12.052-31.638-12.039-43.69-0.004c-5.56,5.56-12.418,21.184-17.879,35.37c-5.461-14.185-12.32-29.809-17.879-35.366c-12.052-12.052-31.638-12.039-43.69-0.004c-5.836,5.836-9.052,13.594-9.052,21.849s3.215,16.013,9.052,21.845c9.37,9.37,47.362,22.465,58.784,26.259c0.914,0.301,1.854,0.448,2.784,0.448c0.93,0,1.87-0.147,2.784-0.448c11.423-3.794,49.414-16.888,58.784-26.254c5.836-5.836,9.052-13.594,9.052-21.849S323.405,116.392,317.569,110.56z M206.914,141.764c-2.5-2.496-3.88-5.823-3.88-9.357c0-3.534,1.379-6.862,3.88-9.362c2.5-2.499,5.827-3.88,9.362-3.88s6.862,1.379,9.362,3.884c3.258,3.254,9.818,18.306,15.905,34.625C225.224,151.591,210.182,145.031,206.914,141.764z M305.086,141.768c-3.259,3.258-18.311,9.818-34.63,15.905c6.087-16.319,12.638-31.367,15.905-34.63c2.5-2.5,5.827-3.88,9.362-3.88c3.534,0,6.862,1.379,9.362,3.884c2.5,2.496,3.88,5.823,3.88,9.357C308.964,135.94,307.586,139.268,305.086,141.768z"/>
                                        <path style="fill:#FF8B9B;" d="M282.483,242.75c-4.879,0-8.828-3.953-8.828-8.828c0-25.117-10.845-41.565-17.664-49.427c-6.836,7.85-17.646,24.246-17.646,49.427c0,4.875-3.948,8.828-8.828,8.828s-8.828-3.953-8.828-8.828c0-44.995,28.672-67.81,29.888-68.762c3.19-2.474,7.656-2.474,10.845,0c1.216,0.952,29.888,23.767,29.888,68.762C291.31,238.798,287.362,242.75,282.483,242.75z"/>
                                    </svg>
                                    内裤
                                </div>
                                <div class="gear-text">${isCurrentStatus ? (sData['内裤']||'-') : '-'}</div>
                            </div>
                            
                            <!-- 第三排：鞋袜占满整行 -->
                            <div class="gear-item" style="grid-column:1/-1;"><div class="gear-label"><i class="bi bi-cursor-fill"></i> 鞋袜</div><div class="gear-text">${isCurrentStatus ? (sData['鞋袜']||'-') : '-'}</div></div>
                            
                            <!-- 第四排：饰品配件占满整行 -->
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
                        
                        <!-- 新增：综合性经验总计 -->
                        <div style="text-align: center; margin-bottom: 20px; padding: 20px; background: white; border-radius: 16px; border: 1px solid var(--s-glass-border); box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                            <div style="font-size: 14px; color: var(--s-text-light); font-weight: bold; margin-bottom: 5px;">综合性经验 (Total)</div>
                            <div style="font-size: 36px; font-weight: 900; color: var(--s-accent); display: flex; justify-content: center; align-items: center;">
                                <i class="bi bi-infinity" style="margin-right: 10px; color: var(--s-primary);"></i>
                                ${isCurrentStatus ? (sData['性爱次数']||'0') : '0'} <span style="font-size: 16px; margin-left: 5px; color: var(--s-text-light);">次</span>
                            </div>
                        </div>

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
