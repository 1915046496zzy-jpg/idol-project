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
                            <div class="gear-item"><div class="gear-label"><i class="bi bi-suit-heart-fill"></i> 内衣</div><div class="gear-text">${isCurrentStatus ? (sData['内衣']||'-') : '-'}</div></div>
                            <div class="gear-item">
                                <div class="gear-label">
                                    <svg viewBox="0 0 512 512" width="1.2em" height="1.2em" style="vertical-align:-0.15em; margin-right:4px;">
                                        <path fill="currentColor" d="M513 269.5C503.2 280 491.9 288.2 481.3 297.2C468.4 308.2 455.3 318.9 442.3 329.7C427.3 342.3 412.2 354.8 397.2 367.3C384.3 378 371.5 388.7 358.6 399.5C343.4 412.1 327.9 424.3 313.3 437.5C306 444.1 298.5 445.6 289.3 445.5C265.3 445.1 241.3 445.2 217.3 445.4C212 445.5 208.1 443.5 204.3 440.3C186.9 425.7 169.3 411.3 151.9 396.8C137.2 384.6 122.7 372.3 108 360.1C94.7 348.9 81.2 337.9 67.8 326.8C57.5 318.2 47.2 309.5 36.9 300.9C27.1 292.8 17.3 284.6 7.5 276.4C5.4 274.6 3.5 272.4 1.2 270.2C1 260.3 1 250.6 1.2 240.1C2.1 229.8 2 220.3 2.4 210.9C3.2 195.7 4.1 180.4 4.4 165.1C4.9 144.7 6.5 124.3 6.6 103.9C6.6 98.8 7.1 93.9 8.8 89.2C12.9 77.4 21.7 67.7 36.5 68.6C46.9 69.2 54.5 74.1 60.2 82.8C65.1 90.4 67.1 90.9 75.3 87.3C82.9 84 90.6 83.4 98.5 85.6C106 87.7 110.9 93.1 115.2 99.2C122 109 124.5 109.7 134.8 104.5C149.4 97.2 162.9 99.5 174.4 111.2C180.2 117 181.9 117.4 189.2 113.8C202.8 107.3 214 109.1 224.9 119.8C230.9 125.6 234.4 126 241.2 121.6C251.7 115 262.3 115.3 272.7 121.6C279.8 125.9 283.4 126 288.9 119.7C296.9 110.5 312.5 107 324.8 113.8C332 117.7 333.5 117.2 339.5 111.2C347 103.9 355.4 99.4 366.3 100.6C372.1 101.2 377.1 103.7 382.2 106.1C388.2 108.9 391.5 108.2 395.8 103.2C397 101.9 398.1 100.4 399.1 98.9C408.6 84.5 423.2 80.5 439.5 87.7C446.4 90.8 449.9 89.6 453.9 83.1C456.4 79.1 459.2 75.5 463.2 73C475.4 65.3 491.3 67.7 499.1 78.2C504.2 85 506 92.8 506.3 101.1C506.7 112.5 506.3 124.1 507.6 135.4C508.5 142.9 507.9 150.2 508.4 157.6C509.4 173.5 510.5 189.3 511.3 205.2C511.9 216.7 512 228.1 512.4 239.6C512.4 240.7 512.8 241.9 513 243C513 251.7 513 260.4 513 269.5z"/><path fill="currentColor" d="M305.3 343.8C312.1 328.3 321.1 314 332.7 301.8C375.7 256.8 427.7 240 488.9 252.2C494.1 253.2 494.8 252.9 494.6 247.6C494.1 234.7 493.3 222 492.7 209.1C492 192.5 491.3 175.9 490.6 159.3C490.5 157.1 490.2 155 488.2 153.5C481.2 148.1 473.9 149.3 469.1 156.7C460.3 170.5 447 174.5 431.9 167.8C423.6 164.1 420.5 164.9 414.8 172.1C413.7 173.6 412.6 175.1 411.5 176.5C401.8 189.6 388.3 192.8 373.6 185.6C370.6 184.2 367.7 182.4 364.4 181.8C359.3 180.8 356.4 183.2 356.5 188.4C356.8 198.2 353.5 206.7 346.9 213.8C335.7 226 318.4 228.9 302.4 221.5C297.7 219.3 293.2 216.3 288 215C287.9 215.7 287.7 216 287.8 216.3C288 217.1 288.3 217.9 288.6 218.6C294.9 232.7 298.5 247.4 299.7 262.9C300.8 277.3 300.1 274.1 289 274.3C282 274.5 281.9 274.3 281.8 267.6C281.6 253.2 278.3 239.5 272.4 226.5C268.4 218 263.7 209.8 256.9 202.5C242 220.3 234.1 240.2 232.4 262.6C231.4 276 234.4 274.2 219.1 274.4C214.9 274.5 213.4 272.9 213.8 268.8C214.9 256.4 215.8 243.9 220.3 232.1C222.3 226.6 224.4 221 226.6 214.8C221.1 216.1 216.9 218.9 212.5 221.1C203.7 225.5 194.4 227 184.9 224.4C168 219.9 157.2 205.5 157.5 187.8C157.5 183.6 155.5 182.5 152.4 181.8C148.1 180.9 144.7 183.5 141.2 185.3C125.5 192.9 112.9 190 102.5 176.3C94.5 165.7 92.5 162.9 78.6 169C66.2 174.5 52.9 169.3 45.6 157.9C44.5 156 43.2 154.2 41.7 152.7C38.4 149.6 34.4 149.3 30.6 151.2C27.5 152.7 23.4 152.9 23.2 158C22 187.8 20.6 217.6 19.4 247.3C19.3 249.1 18.8 251 20.1 252.9C21.3 252.7 22.6 252.7 23.9 252.4C39.1 249.1 54.3 247.6 69.9 248.5C100.4 250.3 128 259.7 152.9 277C185.9 299.9 207.6 331 217.8 370C219 374.2 220.6 375.9 225.2 375.9C246.4 375.6 267.6 375.6 288.7 375.8C293.3 375.9 295.2 374.3 296.2 370C298.1 361.2 301.1 352.7 305.3 343.8z"/><path fill="currentColor" d="M458.8 140.3C467.1 132.1 477.1 130.1 488.7 133.4C488.9 120.1 488.1 107.5 486.8 95C486.7 94 486.3 93.1 485.9 92.2C483.3 86.7 477.1 85.4 472.6 89.4C471.2 90.7 470 92.4 469 94C460.4 107.3 446.9 111.5 432.6 105.2C423.1 101.1 420.5 101.8 414.1 110.2C413.3 111.3 412.5 112.3 411.7 113.4C401.6 126.8 388.5 129.9 373.4 122.5C362.3 117.1 360.9 117.3 352 125.7C342.1 135 330.5 137.2 319.4 131.9C309 126.9 308.3 127 299.8 135.1C290.2 144.1 277.3 146 266.2 139.1C260 135.2 254.8 134.9 248.3 138.9C236.1 146.3 233.9 144.4 213.6 134.6C205.8 127.2 204.8 127.2 195.2 131.6C184.7 136.4 173.6 136.6 165.4 128.1C156.3 118.6 148.3 117.9 136.9 123.9C125.4 130.1 112.7 126 104.2 115.8C102.1 113.3 100.2 110.5 98.1 107.9C93.6 102.4 90.2 101.5 83.8 104.3C66 111.8 55 108.5 44 92.5C43.5 91.8 43 91.1 42.5 90.5C37.9 85.6 31.9 86.1 28.2 91.6C26.2 94.6 25.4 98 25.3 101.6C25.2 107.9 25.1 114.2 24.5 120.5C24.1 124.7 23.6 129 25.1 133.3C26.5 133.1 27.7 132.9 28.8 132.7C41.2 130.1 52.1 134.6 58.9 145.1C64.5 153.7 67.5 154.5 77.2 150.3C87.1 145.9 96.6 146.7 105.6 152.8C109.7 155.6 112.4 159.7 115.3 163.5C122.1 172.7 124.7 173.4 135 168.2C143.5 163.8 152.1 161.8 161.3 165.9C163.4 166.8 164.8 166.1 166.1 164.6C177.6 151.3 195.9 147.3 214.3 157.1C227 163.7 239.9 169.9 252.6 176.5C255.8 178.1 258.2 178 261.4 176.4C274.7 169.5 288.1 162.7 301.6 156.2C318.8 147.8 334.5 150.7 347.5 164.3C348.9 165.9 350.2 167 352.6 166C362 161.7 370.7 164 379.4 168.4C389.2 173.4 392.1 172.6 398.7 163.7C401.5 159.8 404.2 155.8 408.3 153C417.9 146.2 428 146 438.5 150.9C445.9 154.4 449.8 153.1 454.2 146.5C455.5 144.6 457 142.7 458.8 140.3z"/><path fill="currentColor" d="M179.7 395.8C187.9 402.2 195.3 409.5 204.2 415.6C208.5 384.4 193.3 328.2 146.1 294C112.9 269.9 48.7 256.7 30.4 271.1C80 312.6 129.6 353.9 179.7 395.8z"/><path fill="currentColor" d="M310.4 388.8C309.2 397.4 308.4 406.1 309.4 416.4C368.2 367.3 426 319.1 484 270.8C481.5 268.8 479.7 268.6 477.9 268.3C460.4 265.1 442.8 265.2 425.4 268.7C392.5 275.4 364.9 291.6 343.1 317.2C325.6 337.7 314.9 361.4 310.4 388.8z"/><path fill="currentColor" d="M290.9 419.2C290.7 412.5 290.2 405.8 291.4 399.2C292.1 395.4 290.7 394.2 286.9 394.2C266.9 394.3 246.9 394.3 226.9 394.2C223 394.2 222 395.6 222.6 399.3C223.8 406.2 223.5 413.3 223 420.2C222.6 426.9 222.4 427 229.3 427C247.8 427 266.3 427 284.8 426.9C291.9 426.9 291.9 426.9 290.9 419.2z"/><path fill="currentColor" d="M315.5 207C323.6 208.7 331.6 205.4 335.7 198.6C339.9 191.7 339.4 182.9 334.4 176.6C329.8 171 320.9 168.1 313.5 171.1C301.7 176 290.3 181.8 279.3 188.3C279.1 188.4 279.1 188.9 278.9 189.7C291.1 194.8 302.2 202.2 315.5 207z"/><path fill="currentColor" d="M225.4 183.2C217.4 179.2 209.5 174.8 201.2 171.5C192.2 167.9 183.4 171.1 178.4 178.7C174 185.5 174.6 194.8 179.9 201C185.6 207.6 194.6 209.4 203.1 205.4C209.1 202.6 215 199.5 221 196.5C225.7 194.2 230.4 191.8 235.2 189.4C234.6 188.4 234.4 187.9 234 187.7C231.4 186.2 228.8 184.9 225.4 183.2z"/><path fill="currentColor" d="M217.5 303.6C222.2 299.2 227.2 297.9 232.8 300.7C237.5 303 240.1 306.8 240.3 312.1C240.5 317.6 237.8 321.6 233 324.2C227.9 327 221.1 325.6 217.3 321C212.7 315.6 212.6 310.4 217.5 303.6z"/><path fill="currentColor" d="M273.7 312.9C274.3 305.1 279 300 285.6 299.3C291.8 298.7 297.5 302.7 299.6 309.1C301.4 314.7 298.5 321.1 292.8 324.2C284.7 328.5 275.5 323.4 273.7 312.9z"/><path fill="currentColor" d="M180.5 253C179.5 261 173.7 266.5 167 266.1C160.2 265.7 153.9 259.1 154.1 252.5C154.4 245.8 159.9 240 166.4 239.7C174.3 239.3 179.6 244.1 180.5 253z"/><path fill="currentColor" d="M359.4 256.1C354.3 267 343.2 269.4 336.7 261.3C332.7 256.4 332.5 249.6 336.2 244.7C339.6 240.2 346.2 238.3 351.3 240.4C357.5 243 360.5 248.6 359.4 256.1z"/><path fill="currentColor" d="M60.6 214.9C62 223 58.1 229.5 51 231.4C44.6 233.1 38.3 229.7 35.7 223.3C33.1 216.9 35.7 210.1 42.2 206.8C49.2 203.2 56.3 206.2 60.6 214.9z"/><path fill="currentColor" d="M453.1 215.7C456.6 207.7 461.5 204.6 468.7 205.8C473.8 206.6 478.7 211.9 479.3 217.1C479.8 222.7 477.3 226.8 472.9 229.8C468.6 232.5 464.1 232.8 459.7 230C454.6 226.8 452 222.3 453.1 215.7z"/><path fill="currentColor" d="M404.5 293.2C404.7 292.5 404.8 292.2 405 291.9C407.3 289.4 409.9 289.4 412.4 291.4C413.9 292.6 413.5 294.3 412 295C409.3 296.2 406.3 297.4 404.5 293.2z"/></svg>
                                    内裤
                                </div>
                                <div class="gear-text">${isCurrentStatus ? (sData['内裤']||'-') : '-'}</div>
                            </div>
                            <div class="gear-item" style="grid-column:1/-1;"><div class="gear-label"><i class="bi bi-cursor-fill"></i> 鞋袜</div><div class="gear-text">${isCurrentStatus ? (sData['鞋袜']||'-') : '-'}</div></div>
                            <div class="gear-item" style="grid-column:1/-1;"><div class="gear-label"><i class="bi bi-gem"></i> 饰品配件</div><div class="gear-text">${isCurrentStatus ? (sData['持有佩戴品']||'-') : '-'}</div></div>
                        </div>
                    </div>
                 </div>`;


        // 2. 身体监察子面板 (应用胸部、小穴、菊花SVG)
        html += `<div class="sub-panel" id="pad-status-body">
                    <div class="sub-panel-header">
                        <button class="btn-sub-back" onclick="closeSubPanel('pad-status-body')"><i class="bi bi-arrow-left" style="margin:0;"></i></button>
                        <div class="sub-panel-title"><i class="bi bi-activity"></i> 深度身体监察报告</div>
                    </div>
                    <div class="sub-panel-content">
                        <div class="body-list">
                            <div class="body-node"><div class="node-title"><i class="bi bi-brightness-high"></i> 皮肤</div><div class="node-text">${isCurrentStatus ? (sData['皮肤']||'-') : '-'}</div></div>
                            <div class="body-node"><div class="node-title"><i class="bi bi-droplet-half"></i> 口腔</div><div class="node-text">${isCurrentStatus ? (sData['口腔']||'-') : '-'}</div></div>
                            <div class="body-node sensitive"><div class="node-title node-sensitive-title"><span class="s-svg-icon">${SVGS.xiongbu}</span> 胸部</div><div class="node-text">${isCurrentStatus ? (sData['胸部']||'-') : '-'}</div></div>
                            <div class="body-node sensitive"><div class="node-title node-sensitive-title"><i class="bi bi-record-circle"></i> 乳头</div><div class="node-text">${isCurrentStatus ? (sData['乳头']||'-') : '-'}</div></div>
                            <div class="body-node"><div class="node-title"><i class="bi bi-circle-half"></i> 臀部</div><div class="node-text">${isCurrentStatus ? (sData['臀部']||'-') : '-'}</div></div>
                            <div class="body-node sensitive"><div class="node-title node-sensitive-title"><span class="s-svg-icon">${SVGS.yindaojiao}</span> 小穴</div><div class="node-text">${isCurrentStatus ? (sData['小穴']||'-') : '-'}</div></div>
                            <div class="body-node"><div class="node-title"><span class="s-svg-icon">${SVGS.gangjiao}</span> 菊花</div><div class="node-text">${isCurrentStatus ? (sData['菊花']||'-') : '-'}</div></div>
                            <div class="body-node"><div class="node-title"><i class="bi bi-arrow-through-heart"></i> 子宫</div><div class="node-text">${isCurrentStatus ? (sData['子宫']||'-') : '-'}</div></div>
                        </div>
                    </div>
                 </div>`;

        // 3. 经验统计子面板 (应用全面替换的SVG)
        html += `<div class="sub-panel" id="pad-status-exp">
                    <div class="sub-panel-header">
                        <button class="btn-sub-back" onclick="closeSubPanel('pad-status-exp')"><i class="bi bi-arrow-left" style="margin:0;"></i></button>
                        <div class="sub-panel-title"><i class="bi bi-journal-text"></i> 性爱经验档案</div>
                    </div>
                    <div class="sub-panel-content">
                        <!-- 综合性经验总计 -->
                        <div style="text-align: center; margin-bottom: 20px; padding: 20px; background: white; border-radius: 16px; border: 1px solid var(--s-glass-border); box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                            <div style="font-size: 14px; color: var(--s-text-light); font-weight: bold; margin-bottom: 5px;">综合性经验 (Total)</div>
                            <div style="font-size: 36px; font-weight: 900; color: var(--s-accent); display: flex; justify-content: center; align-items: center;">
                                <i class="bi bi-infinity" style="margin-right: 10px; color: var(--s-primary);"></i>
                                ${isCurrentStatus ? (sData['性爱次数']||'0') : '0'} <span style="font-size: 16px; margin-left: 5px; color: var(--s-text-light);">次</span>
                            </div>
                        </div>

                        <div class="exp-grid">
                            <div class="exp-item"><div class="exp-icon"><span class="s-svg-icon">${SVGS.koujiao}</span></div><div class="exp-label">口交次数</div><div class="exp-val">${isCurrentStatus ? (sData['口交次数']||'0') : '0'}</div></div>
                            <div class="exp-item"><div class="exp-icon"><span class="s-svg-icon">${SVGS.rujiao}</span></div><div class="exp-label">乳交次数</div><div class="exp-val">${isCurrentStatus ? (sData['乳交次数']||'0') : '0'}</div></div>
                            <div class="exp-item"><div class="exp-icon"><span class="s-svg-icon">${SVGS.shoujiao}</span></div><div class="exp-label">手交次数</div><div class="exp-val">${isCurrentStatus ? (sData['手交次数']||'0') : '0'}</div></div>
                            <div class="exp-item"><div class="exp-icon"><span class="s-svg-icon">${SVGS.yindaojiao}</span></div><div class="exp-label">阴道交次数</div><div class="exp-val">${isCurrentStatus ? (sData['阴道交次数']||'0') : '0'}</div></div>
                            <div class="exp-item"><div class="exp-icon"><span class="s-svg-icon">${SVGS.gangjiao}</span></div><div class="exp-label">肛交次数</div><div class="exp-val">${isCurrentStatus ? (sData['肛交次数']||'0') : '0'}</div></div>
                            <div class="exp-item"><div class="exp-icon"><span class="s-svg-icon">${SVGS.zhongchu}</span></div><div class="exp-label">体内中出</div><div class="exp-val">${isCurrentStatus ? (sData['中出次数']||'0') : '0'}</div></div>
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
