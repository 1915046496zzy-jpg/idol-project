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



// 全局地图与场景数据库
var mapDatabase = {
    "东京地区": [
        {
            name: "东京都港区",
            coord: { top: "72%", left: "57%" },
            emoji: "🗼",
            desc: "繁华的核心地带，商业与娱乐的交汇处，也是众多大型企划的诞生地。",
            scenes: [
                { name: "一零三零制作", emoji: "🏢", desc: "业界最大综合事务所大楼，一切梦开始的地方。核心理念是“大家像家人一样共同进步”。" },
                { name: "微梦制作", emoji: "🎠", desc: "1030制作下属特设区域，U15低龄特化厂牌。主打纯粹的陪伴与治愈。" }
            ]
        },
        {
            name: "东京都涩谷区",
            coord: { top: "54%", left: "20%" },
            emoji: "🛍️",
            desc: "时尚与潮流的中心，随处可见星探与怀揣梦想的年轻人。",
            scenes: [
                { name: "白之光演艺", emoji: "✨", desc: "位于表参道高奢区。顶尖艺术与高雅路线，绝不迎合下沉市场。" }
            ]
        },
        {
            name: "东京都新宿区",
            coord: { top: "33%", left: "32%" },
            emoji: "🌃",
            desc: "光怪陆离的不夜城，表面的繁华下隐藏着无数灰色交易。",
            scenes: [
                { name: "铃兰制作", emoji: "🥀", desc: "位于西新宿外表光鲜的高级写字楼。公众形象纯洁无瑕，私下却极度黑暗。" }
            ]
        },
        {
            name: "东京都台东区",
            coord: { top: "18%", left: "68%" },
            emoji: "⛩️",
            desc: "充满昭和风情的老街区，保留着时代的眼泪与人情味。",
            scenes: [
                { name: "飞鸟旧社", emoji: "📻", desc: "破旧的昭和风老楼。曾经的老牌霸主，如今资金链濒临断裂，设施陈旧。" }
            ]
        },
        { name: "东京都千代田区", coord: { top: "42%", left: "54%" }, emoji: "🏯", desc: "政治与文化的中心区域，治安极佳。", scenes: [] },
        { name: "东京都中央区", coord: { top: "52%", left: "70%" }, emoji: "🏬", desc: "传统的高级商业区。", scenes: [] },
        { name: "东京都品川区", coord: { top: "72%", left: "41%" }, emoji: "🚄", desc: "重要的交通枢纽地带。", scenes: [] },
        { name: "东京都练马区", coord: { top: "22%", left: "15%" }, emoji: "🏡", desc: "安静的住宅区与动画产业聚集地。", scenes: [] },
        { name: "东京都丰岛区", coord: { top: "18%", left: "41%" }, emoji: "🦉", desc: "充满次文化气息的繁华地带。", scenes: [] },
        { name: "东京都世田谷区", coord: { top: "75%", left: "14%" }, emoji: "🐈", desc: "高级住宅区，生活节奏缓慢。", scenes: [] },
        { name: "东京都江东区", coord: { top: "68%", left: "84%" }, emoji: "🌊", desc: "临海副都心，常举办大型漫展与活动。", scenes: [] }
    ],
    "非东京地区": [
        {
            name: "埼玉县川越市",
            emoji: "🍢",
            desc: "保留着小江户风情的城市，充满市井的烟火气。",
            scenes: [
                { name: "野猫演艺", emoji: "🐾", desc: "商店街关东煮店二楼的单间。极度草根，偶像为了生计甚至需要打工。" }
            ]
        },
        { name: "北海道札幌市", emoji: "❄️", desc: "北国的中心，常年积雪的浪漫之都。", scenes: [] },
        { name: "京都府京都市", emoji: "🍵", desc: "千年古都，随处可见穿着和服的少女。", scenes: [] },
        { name: "大阪府大阪市", emoji: "🐙", desc: "热情似火的美食之都。", scenes: [] },
        { name: "冲绳县那霸市", emoji: "🌺", desc: "阳光、沙滩与海浪的南国度假胜地。", scenes: [] },
        { name: "神奈川县横滨市", emoji: "🎡", desc: "充满异国风情的港口城市。", scenes: [] },
        { name: "千叶县千叶市", emoji: "🎢", desc: "拥有大型主题乐园的欢乐之城。", scenes: [] },
        { name: "福冈县中洲", emoji: "🍜", desc: "九州的繁华夜街，屋台文化盛行。", scenes: [] }
    ]
};
