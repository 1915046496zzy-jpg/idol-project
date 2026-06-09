// ====== ui_map_app.js ======

// 记录当前选中的大区域
var currentMapLocObj = null;

// 1. 渲染地图主界面 (供主引擎 renderAllPages 调用)
function renderMapApp(container) {
    if (!container) return;

    var mapHtml = '';
    mapHtml += '<div class="map-layout">';
    let mapBgUrl = getAssetUrl("场景_世界地图") || 'https://i.postimg.cc/02gmvkZy/da-de-tu.png';
    mapHtml += `<div class="map-main">
                <div class="map-inner-wrapper">
                    <img src="${mapBgUrl}" class="map-bg">`;

    if(typeof mapDatabase !== 'undefined' && mapDatabase["东京地区"]) {
        mapDatabase["东京地区"].forEach(loc => {
            if(loc.coord) {
                let locStr = encodeURIComponent(JSON.stringify(loc));
                mapHtml += `<div class="map-pin" style="top:${loc.coord.top}; left:${loc.coord.left};" onclick="openMapLocation('${locStr}')">${loc.emoji}</div>`;
            }
        });
    }
    mapHtml += `   </div>`;

    mapHtml += '<div class="map-sidebar collapsed" id="map-sidebar">';
    mapHtml += '<div class="map-sidebar-toggle" id="map-sidebar-toggle" onclick="toggleMapSidebar()">▶</div>';
    mapHtml += '<div class="map-sidebar-content">';
    mapHtml += '<div style="font-size:15px; font-weight:bold; color:var(--theme-text-main, #db2777); margin-bottom:10px;">🚄 其他探索区域</div>';

    if(typeof mapDatabase !== 'undefined' && mapDatabase["非东京地区"]) {
        mapDatabase["非东京地区"].forEach((loc, idx) => {
            let locStr = encodeURIComponent(JSON.stringify(loc));
            mapHtml += `<div class="map-list-item" onclick="openMapLocation('${locStr}')">
                        <div class="map-list-emoji">${loc.emoji}</div>
                        <div class="map-list-name">${loc.name}</div>
                     </div>`;
        });
    }
    mapHtml += '</div></div>';

    mapHtml += `<div class="map-detail-panel" id="map-side-panel">
                <button class="map-close-btn" onclick="closeMapSide()">✕</button>
                <div class="map-detail-content" id="map-side-content"></div>
             </div>`;
    mapHtml += `</div>`;

    container.innerHTML = mapHtml;
}

// 2. 地图交互：开关左侧边栏
function toggleMapSidebar() {
    let sidebar = document.getElementById('map-sidebar');
    let toggleBtn = document.getElementById('map-sidebar-toggle');
    if(sidebar) sidebar.classList.toggle('collapsed');
    if (sidebar && sidebar.classList.contains('collapsed')) {
        if(toggleBtn) toggleBtn.innerText = '▶';
    } else {
        if(toggleBtn) toggleBtn.innerText = '◀';
    }
}

// 3. 地图交互：打开某个区域详情
function openMapLocation(locStr) {
    let loc = JSON.parse(decodeURIComponent(locStr));
    currentMapLocObj = loc;
    let imgUrl = getAssetUrl("地名_" + loc.name) || 'https://i.postimg.cc/mZh4H5Xg/map-placeholder.jpg';

    let mHtml = `
        <img src="${imgUrl}" class="map-loc-img">
        <div class="map-loc-title">${loc.emoji} ${loc.name}</div>
        <div class="map-loc-desc">${loc.desc}</div>
    `;

    if(loc.scenes && loc.scenes.length > 0) {
        mHtml += `<div class="map-scene-list-title">📍 下属场景 / 设施</div>`;
        mHtml += `<div class="map-scene-list">`;
        loc.scenes.forEach(sc => {
            let scStr = encodeURIComponent(JSON.stringify(sc));
            mHtml += `
            <div class="map-scene-item" onclick="openMapScene('${scStr}', '${loc.name}')">
                <div style="font-size:24px;">${sc.emoji}</div>
                <div style="font-size:15px; font-weight:bold; color:#334155;">${sc.name}</div>
            </div>`;
        });
        mHtml += `</div>`;
    } else {
        mHtml += `<div style="text-align:center; color:#94a3b8; font-size:14px; margin-top:30px;">该区域暂无特定场景，可直接前往探索。</div>`;
        mHtml += `<button class="map-go-btn" onclick="sendAction('前往探索：${loc.name}')" style="margin-top:auto;">前往该区域探索 ▶</button>`;
    }

    let sideContent = document.getElementById('map-side-content');
    let sidePanel = document.getElementById('map-side-panel');
    if(sideContent) sideContent.innerHTML = mHtml;
    if(sidePanel) sidePanel.classList.add('open');
}

// 4. 地图交互：打开具体场景
function openMapScene(scStr, parentName) {
    let sc = JSON.parse(decodeURIComponent(scStr));
    let imgUrl = getAssetUrl("事务所_" + sc.name) || 'https://i.postimg.cc/mZh4H5Xg/map-placeholder.jpg';

    let mHtml = `
        <img src="${imgUrl}" class="map-loc-img">
        <div class="map-loc-title">${sc.emoji} ${sc.name}</div>
        <div style="font-size:13px; color:#db2777; font-weight:bold; margin-bottom:15px;">位于：${parentName}</div>
        <div class="map-loc-desc">${sc.desc}</div>
        <button class="map-go-btn" onclick="sendAction('前往场景：${sc.name}')">进入该场景 ▶</button>
        <button class="map-back-loc-btn" onclick="openMapLocation('${encodeURIComponent(JSON.stringify(currentMapLocObj))}')">◀ 返回区域概览</button>
    `;
    let sideContent = document.getElementById('map-side-content');
    if(sideContent) sideContent.innerHTML = mHtml;
}

// 5. 地图交互：关闭右侧详情面板
function closeMapSide() {
    let sidePanel = document.getElementById('map-side-panel');
    if(sidePanel) sidePanel.classList.remove('open');
}
