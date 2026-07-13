/* ================= GALLERY (图鉴) 渲染逻辑 ================= */
function renderGalleryList() {
    document.getElementById('gallery-title').innerText = "✦ 偶像图鉴 ✦";
    let html = '<div class="gallery-grid">';

    if (typeof idolDatabase === 'undefined') {
        document.getElementById('gallery-content').innerHTML = '<div class="loading">❌ 未找到偶像图鉴数据</div>';
        return;
    }

    idolDatabase.forEach((idol, index) => {
        html += `
        <div class="gallery-card" onclick="showGalleryDetail(${index})">
            <div class="gallery-img-wrap"><img src="${idol.image}" alt="${idol.name}"></div>
            <div class="gallery-info">
                <div class="gallery-name">${idol.name}</div>
                <div class="gallery-tag">${idol.tag}</div>
            </div>
        </div>`;
    });
    html += '</div>';
    document.getElementById('gallery-content').innerHTML = html;
}

function renderStatBar(label, data) {
    let percentage = (data.value / data.max) * 100;
    let html = `
    <div class="detail-item" style="margin-bottom: 8px;">
        <div class="stat-header">
            <span class="item-label" style="color:${data.color};">${label}</span>
            <span class="stat-value-text" style="color:${data.color};">${data.value} / ${data.max}</span>
        </div>
        <div class="stat-bar-container">
            <div class="stat-bar-fill" style="width: 0%; background-color:${data.color};" data-width="${percentage}%"></div>
        </div>`;
    if (data.desc) { html += `<div class="stat-desc">${data.desc}</div>`; }
    html += `</div>`;
    return html;
}

function showGalleryDetail(index) {
    const idol = idolDatabase[index];
    document.getElementById('gallery-title').innerText = `偶像档案: ${idol.name}`;

    let html = `
    <div class="gallery-profile">
        <div class="profile-left">
            <img src="${idol.image}" class="profile-avatar">
            <button class="btn btn-back" style="width:100%" onclick="renderGalleryList()">◀ 返回图鉴列表</button>
        </div>
        <div class="profile-right">
    `;

    html += `<div class="detail-panel"><div class="panel-title">📋 基础档案</div>`;
    for (let [k, v] of Object.entries(idol.basic)) { html += `<div class="detail-item"><div class="item-label">${k}</div><div class="item-value">${v}</div></div>`; }
    html += `</div>`;

    html += `<div class="detail-panel"><div class="panel-title" style="color:#0ea5e9;">🧠 心理与性格</div>`;
    for (let [k, v] of Object.entries(idol.psychology)) {
        let bg = k.includes('MBTI') ? 'rgba(14,165,233,0.1)' : 'rgba(0,0,0,0.02)';
        let fw = k.includes('MBTI') ? 'bold' : '500';
        html += `<div class="detail-item"><div class="item-label" style="color:#0ea5e9;">${k}</div><div class="item-value" style="background:${bg}; font-weight:${fw};">${v}</div></div>`;
    }
    html += `</div>`;

    html += `<div class="detail-panel"><div class="panel-title" style="color:#e11d48;">🔞 深度隐私档案</div>`;
    for (let [k, v] of Object.entries(idol.privacy)) { html += `<div class="detail-item"><div class="item-label" style="color:#e11d48;">${k}</div><div class="item-value" style="background:rgba(225,29,72,0.05);">${v}</div></div>`; }
    html += `</div>`;

    html += `<div class="detail-panel"><div class="panel-title" style="color:#059669;">🎭 核心特质</div>`;
    for (let [k, v] of Object.entries(idol.traits)) { html += `<div class="detail-item"><div class="item-label" style="color:#059669;">${k}</div><div class="item-value" style="background:rgba(5,150,105,0.05);">${v}</div></div>`; }
    html += `</div>`;

    html += `<div class="detail-panel"><div class="panel-title" style="color:#8b5cf6;">📊 业务能力面板</div>`;
    for (let [k, data] of Object.entries(idol.stats)) { html += renderStatBar(k, data); }
    html += `</div>`;

    html += `<div class="detail-panel"><div class="panel-title" style="color:#f43f5e;">❤️ 心理状态监控</div>`;
    for (let [k, data] of Object.entries(idol.status)) { html += renderStatBar(k, data); }
    html += `</div>`;

    html += `</div></div>`;
    document.getElementById('gallery-content').innerHTML = html;

    // 延迟执行进度条动画
    setTimeout(() => { document.querySelectorAll('.stat-bar-fill').forEach(bar => { bar.style.width = bar.getAttribute('data-width'); }); }, 100);
}

/* ================= MEMORY (回忆相册) 渲染逻辑 ================= */
function renderMemoryCoverList() {
    const container = document.getElementById('memory-screen').querySelector('.glass-panel');
    let html = `<div class="panel-header"><h1>✦ 回忆相册 ✦</h1><p>MEMORY ALBUM</p></div><div class="scrollable-content"><div class="gallery-grid">`;

    if (typeof idolDatabase === 'undefined') {
        container.innerHTML = html + '<div class="loading" style="grid-column:1/-1;">❌ 未找到相册数据</div></div></div>';
        return;
    }

    idolDatabase.forEach((idol, index) => {
        let sfwCount = (idol.memories && idol.memories.sfw) ? idol.memories.sfw.length : 0;
        let nsfwCount = (idol.memories && idol.memories.nsfw) ? idol.memories.nsfw.length : 0;
        let totalCount = sfwCount + nsfwCount;
        html += `<div class="gallery-card" onclick="showMemoryDetail(${index}, 'sfw')"><div class="gallery-img-wrap"><img src="${idol.image}" alt="${idol.name}"></div><div class="gallery-info"><div class="gallery-name">${idol.name}</div><div class="gallery-tag">已解锁 ${totalCount} 张回忆</div></div></div>`;
    });
    html += `</div></div>`;
    container.innerHTML = html;
}

let currentMemoryIndex = 0;
function showMemoryDetail(index, type) {
    currentMemoryIndex = index;
    const idol = idolDatabase[index];
    const container = document.getElementById('memory-screen').querySelector('.glass-panel');
    let photoArray = [];
    if (idol.memories && idol.memories[type]) { photoArray = idol.memories[type]; }

    let html = `<div class="memory-header-bar"><button class="btn btn-back memory-btn-back" onclick="renderMemoryCoverList()">◀ 返回相册列表</button><h1 class="memory-title-center">✦ ${idol.name} 的回忆 ✦</h1></div>`;
    html += `<div class="memory-tabs"><button class="memory-tab-btn ${type === 'sfw' ? 'active sfw' : ''}" onclick="showMemoryDetail(${index}, 'sfw')">日常回忆 (SFW)</button><button class="memory-tab-btn ${type === 'nsfw' ? 'active nsfw' : ''}" onclick="showMemoryDetail(${index}, 'nsfw')">机密档案 (NSFW)</button></div>`;
    html += `<div class="scrollable-content"><div class="memory-photo-grid">`;

    if (photoArray.length > 0) {
        photoArray.forEach(photo => { html += `<div class="memory-photo-card"><img src="${photo.url}" class="memory-photo-img" loading="lazy"><div class="memory-photo-title">${photo.title}</div></div>`; });
    } else {
        html += `<div style="grid-column: 1/-1; text-align:center; padding: 60px; color:#94a3b8; font-size:16px; font-weight:bold;">当前分类暂未解锁任何回忆...</div>`;
    }
    html += `</div></div>`;
    container.innerHTML = html;
}
