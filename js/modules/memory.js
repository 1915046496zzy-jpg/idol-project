// js/modules/memory.js

let currentMemoryIndex = 0;

function renderMemoryCoverList() {
    const container = document.getElementById('memory-screen').querySelector('.glass-panel');
    let html = `<div class="panel-header"><h1>✦ 回忆相册 ✦</h1><p>MEMORY ALBUM</p></div><div class="scrollable-content"><div class="gallery-grid">`;

    if(typeof idolDatabase === 'undefined') {
        html += '<div class="loading" style="grid-column:1/-1;">❌ 未找到 idolDatabase 数据</div>';
    } else {
        idolDatabase.forEach((idol, index) => {
            let sfwCount = (idol.memories && idol.memories.sfw) ? idol.memories.sfw.length : 0;
            let nsfwCount = (idol.memories && idol.memories.nsfw) ? idol.memories.nsfw.length : 0;
            let totalCount = sfwCount + nsfwCount;
            html += `<div class="gallery-card" onclick="showMemoryDetail(${index}, 'sfw')"><div class="gallery-img-wrap"><img src="${idol.image}" alt="${idol.name}"></div><div class="gallery-info"><div class="gallery-name">${idol.name}</div><div class="gallery-tag">已解锁 ${totalCount} 张回忆</div></div></div>`;
        });
    }

    html += `</div></div>`;
    container.innerHTML = html;
}

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
