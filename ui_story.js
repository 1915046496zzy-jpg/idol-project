/**
 * 剧情页面渲染模块 (ui_story.js)
 */
function renderStoryPage(parsedSysData) {
    let html = '';
    try {
        html += '<div id="page-story" class="page active">';

        // 1. 渲染环境标签
        if (parsedSysData.env && Object.keys(parsedSysData.env).length > 0) {
            html += '<div class="story-env">';
            if (parsedSysData.env['日期']) {
                html += '<span class="env-tag"><i class="bi bi-calendar3"></i> ' + parsedSysData.env['日期'] + '</span>';
                // 尝试同步更新顶部状态栏的日期（如果存在）
                let topDate = document.getElementById('header-time');
                if (topDate) topDate.innerHTML = '<i class="bi bi-calendar3"></i> ' + parsedSysData.env['日期'] + ' &nbsp;<i class="bi bi-clock"></i> ' + (parsedSysData.env['时段'] || '未知');
            }
            if (parsedSysData.env['时段']) {
                let timeStr = parsedSysData.env['时段'];
                if (parsedSysData.env['具体时间']) timeStr += ' ' + parsedSysData.env['具体时间'];
                html += '<span class="env-tag"><i class="bi bi-clock"></i> ' + timeStr + '</span>';
            }
            if (parsedSysData.env['地点']) html += '<span class="env-tag"><i class="bi bi-geo-alt-fill"></i> ' + parsedSysData.env['地点'] + '</span>';
            if (parsedSysData.env['天气']) html += '<span class="env-tag"><i class="bi bi-cloud-sun"></i> ' + parsedSysData.env['天气'] + '</span>';
            html += '</div>';
        }

        // 2. 渲染正文
        if (parsedSysData.text) {
            let pText = parsedSysData.text.replace(/\n/g, '<br>');
            html += '<div class="story-paragraph">' + pText + '</div>';
        }

        // 3. 渲染插图折叠
        if (parsedSysData.images && parsedSysData.images.length > 0) {
            // 这里依赖主环境提供的 getAssetUrl 函数
            let imgUrl = typeof getAssetUrl === 'function' ? getAssetUrl(parsedSysData.images[0]) : '';
            if (imgUrl) {
                html += `<div class="story-img-toggle" onclick="
                    let target = this.nextElementSibling;
                    target.classList.toggle('open');
                    this.innerHTML = target.classList.contains('open') ? '<i class=\\'bi bi-caret-up-fill\\'></i> 收起剧情插图' : '<i class=\\'bi bi-caret-down-fill\\'></i> 查看剧情插图';
                "><i class="bi bi-caret-down-fill"></i> 查看剧情插图</div>`;
                html += '<div class="story-img-collapse"><div class="story-img-wrap"><img src="' + imgUrl + '" loading="lazy"></div></div>';
            }
        }

        // 4. 渲染数值变化
        if (parsedSysData.changes && parsedSysData.changes !== "无") {
            html += '<div class="story-changes"><i class="bi bi-graph-up-arrow"></i> 状态更新：' + parsedSysData.changes + '</div>';
        }

        // 5. 渲染选项
        if (parsedSysData.options && Object.keys(parsedSysData.options).length > 0) {
            html += '<div class="options-grid">';
            let optLetters = ['A', 'B', 'C', 'D'];
            let optIndex = 0;
            for (var key in parsedSysData.options) {
                let label = key.length <= 2 ? key : (optLetters[optIndex] || '*');
                // 这里依赖主环境提供的 sendAction 函数
                html += '<div class="option-btn" onclick="sendAction(\'' + parsedSysData.options[key] + '\')"><div class="option-label">' + label + '</div>' + parsedSysData.options[key] + '</div>';
                optIndex++;
            }
            html += '</div>';
        }

        html += '</div>';
    } catch (err) {
        console.error("渲染剧情页时出错:", err);
        html += `<div id="page-story" class="page active"><div style="padding:50px;text-align:center;color:#ef4444;font-weight:bold;"><i class="bi bi-book"></i> 剧情数据报错了：<br>${err.message}</div></div>`;
    }
    return html;
}
