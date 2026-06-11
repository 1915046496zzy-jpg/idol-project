// ====== ui_map_app.js (全局仓库版) ======
(function() {
    // 1. 寻找或创建顶级仓库
    let topWin;
    try { topWin = window.parent || window; } catch(e) { topWin = window; }
    if (!topWin.IdolProjectData) topWin.IdolProjectData = {};

    // 记录当前选中的大区域 (存入仓库以防丢失)
    topWin.IdolProjectData.currentMapLocObj = null;

    // 2. 存入六大阵营机密情报数据
    topWin.IdolProjectData.agencyData = [
        {
            "代号": "选择A",
            "名称": "Lumière Blanc (白之光演艺)",
            "特点": "顶尖艺术与高雅路线。包装极高门槛的完美偶像，绝不迎合下沉市场。",
            "优势": "掌握国际高端时尚杂志、古典乐及奢侈品代言资源。",
            "劣势": "前期粉丝积累极慢，对业务能力要求苛刻。",
            "详细介绍": "所在地: 东京都涩谷区神宫前 (表参道高奢区)。禁止任何丑闻，一旦被爆出负面新闻直接解约封杀。"
        },
        {
            "代号": "选择B",
            "名称": "1030 Production (一零三零制作)",
            "特点": "业界最大综合事务所。起源于草根团体，如今已发展为业界巨头。",
            "优势": "垄断级国民通告、巨蛋演唱会资源与打歌节目通道。",
            "劣势": "旗下组合众多，存在激烈的良性竞争。",
            "详细介绍": "所在地: 东京都港区赤坂 (大型综合办公大楼)。核心理念是“大家像家人一样共同进步”。资源极其丰厚，氛围积极向上，是无数新人向往的王道偶像殿堂。"
        },
        {
            "代号": "选择C",
            "名称": "Petit Rêve (微梦制作)",
            "特点": "U15低龄特化厂牌。主打纯粹的陪伴、养成与治愈。",
            "优势": "拥有专属课业辅导团队、童装代言及低龄垂直市场渠道。",
            "劣势": "受劳动法夜间通告严格限制。",
            "详细介绍": "所在地: 1030制作下属特设区域。制作人不仅是上司，更是“保姆”与“长辈”，需兼顾偶像的学业与演艺活动。"
        },
        {
            "代号": "选择D",
            "名称": "Sunset Asuka (飞鸟旧社)",
            "特点": "时代眼泪与老牌没落。充满人情味。",
            "优势": "保留极少数传统电视节目的午夜档固定名额。",
            "劣势": "资金链濒临断裂，设施陈旧。",
            "详细介绍": "所在地: 东京都台东区浅草 (破旧的昭和风老楼)。连空调都经常坏。留下的都是不愿放弃梦想的“原石”或被大厂淘汰的弃子。制作人与偶像常常需要一起吃苦，互相扶持度过难关。"
        },
        {
            "代号": "选择E",
            "名称": "Stray Cats (野猫演艺)",
            "特点": "极度草根与市井偶像。极具烟火气与生命力。",
            "优势": "零规矩限制，主要靠商店街大叔大妈的赞助。",
            "劣势": "常年赤字，公司连正经法人资格都存疑。",
            "详细介绍": "所在地: 埼玉县川越市商店街 (关东煮店二楼的单间)。偶像为了维持生计，白天需要在楼下关东煮店、便利店兼职打工，晚上在街头路演。像野猫一样顽强生存。"
        },
        {
            "代号": "选择F",
            "名称": "Suzuran Production (铃兰制作)",
            "特点": "中型事务所。公众形象纯洁无瑕，私下却极度黑暗。",
            "优势": "表面有常规通告，暗地掌握灰色资金及政商高层招待渠道。",
            "劣势": "内部实行残酷的“字母评级与债务制”。",
            "详细介绍": "所在地: 东京都新宿区西新宿 (外表光鲜的高级写字楼)。低级成员要参与夜间陪同来偿还天价债务，高级成员需签订“专属契约”提供特殊服务。制作人既可同流合污，也可试图在泥潭中保护她们。"
        }
    ];

    // 3. 存入全局地图与场景数据库
    topWin.IdolProjectData.mapDatabase = {
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
            {
                name: "北海道札幌市",
                emoji: "❄️",
                desc: "北国的中心，常年积雪的浪漫之都。",
                scenes: [
                    { name: "温泉旅馆", emoji: "♨️", desc: "温泉旅馆。" }
                ]
            },
            { name: "京都府京都市", emoji: "🍵", desc: "千年古都，随处可见穿着和服的少女。", scenes: [] },
            { name: "大阪府大阪市", emoji: "🐙", desc: "热情似火的美食之都。", scenes: [] },
            { name: "冲绳县那霸市", emoji: "🌺", desc: "阳光、沙滩与海浪的南国度假胜地。", scenes: [] },
            { name: "神奈川县横滨市", emoji: "🎡", desc: "充满异国风情的港口城市。", scenes: [] },
            { name: "千叶县千叶市", emoji: "🎢", desc: "拥有大型主题乐园的欢乐之城。", scenes: [] },
            { name: "福冈县中洲", emoji: "🍜", desc: "九州的繁华夜街，屋台文化盛行。", scenes: [] }
        ]
    };

    // 4. 获取图片链接的兼容函数
    function getImgUrl(key) {
        if (topWin.getAssetUrl && typeof topWin.getAssetUrl === 'function') {
            return topWin.getAssetUrl(key);
        } else if (typeof window.getAssetUrl === 'function') {
            return window.getAssetUrl(key);
        }
        return '';
    }

    // 5. 将渲染函数挂载到全局
    topWin.renderMapApp = function(container) {
        if (!container) return;

        let db = topWin.IdolProjectData.mapDatabase;

        var mapHtml = '<div class="map-layout">';
        let mapBgUrl = getImgUrl("场景_世界地图") || 'https://i.postimg.cc/02gmvkZy/da-de-tu.png';
        mapHtml += `<div class="map-main">
                    <div class="map-inner-wrapper">
                        <img src="${mapBgUrl}" class="map-bg">`;

        if(db && db["东京地区"]) {
            db["东京地区"].forEach(loc => {
                if(loc.coord) {
                    let locStr = encodeURIComponent(JSON.stringify(loc));
                    // 注意：onclick 调用时加上 topWin 作用域
                    mapHtml += `<div class="map-pin" style="top:${loc.coord.top}; left:${loc.coord.left};" onclick="let tw = window.parent || window; tw.openMapLocation('${locStr}')">${loc.emoji}</div>`;
                }
            });
        }
        mapHtml += `   </div>`;

        mapHtml += '<div class="map-sidebar collapsed" id="map-sidebar">';
        // 侧边栏开关
        mapHtml += `<div class="map-sidebar-toggle" id="map-sidebar-toggle" onclick="let tw = window.parent || window; tw.toggleMapSidebar()">▶</div>`;
        mapHtml += '<div class="map-sidebar-content">';
        mapHtml += '<div style="font-size:15px; font-weight:bold; color:var(--theme-text-main, #db2777); margin-bottom:10px;">🚄 其他探索区域</div>';

        if(db && db["非东京地区"]) {
            db["非东京地区"].forEach((loc, idx) => {
                let locStr = encodeURIComponent(JSON.stringify(loc));
                mapHtml += `<div class="map-list-item" onclick="let tw = window.parent || window; tw.openMapLocation('${locStr}')">
                            <div class="map-list-emoji">${loc.emoji}</div>
                            <div class="map-list-name">${loc.name}</div>
                         </div>`;
            });
        }
        mapHtml += '</div></div>';

        mapHtml += `<div class="map-detail-panel" id="map-side-panel">
                    <button class="map-close-btn" onclick="let tw = window.parent || window; tw.closeMapSide()">✕</button>
                    <div class="map-detail-content" id="map-side-content"></div>
                 </div>`;
        mapHtml += `</div>`;

        container.innerHTML = mapHtml;
    };

    // 6. 将所有交互函数挂载到全局
    topWin.toggleMapSidebar = function() {
        // 去顶层找元素，兼容悬浮球和HTML
        let sidebar = topWin.document.getElementById('map-sidebar') || document.getElementById('map-sidebar');
        let toggleBtn = topWin.document.getElementById('map-sidebar-toggle') || document.getElementById('map-sidebar-toggle');
        if(sidebar) sidebar.classList.toggle('collapsed');
        if (sidebar && sidebar.classList.contains('collapsed')) {
            if(toggleBtn) toggleBtn.innerText = '▶';
        } else {
            if(toggleBtn) toggleBtn.innerText = '◀';
        }
    };

    topWin.openMapLocation = function(locStr) {
        let loc = JSON.parse(decodeURIComponent(locStr));
        topWin.IdolProjectData.currentMapLocObj = loc;
        let imgUrl = getImgUrl("地名_" + loc.name) || 'https://i.postimg.cc/mZh4H5Xg/map-placeholder.jpg';

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
                <div class="map-scene-item" onclick="let tw = window.parent || window; tw.openMapScene('${scStr}', '${loc.name}')">
                    <div style="font-size:24px;">${sc.emoji}</div>
                    <div style="font-size:15px; font-weight:bold; color:#334155;">${sc.name}</div>
                </div>`;
            });
            mHtml += `</div>`;
        } else {
            mHtml += `<div style="text-align:center; color:#94a3b8; font-size:14px; margin-top:30px;">该区域暂无特定场景，可直接前往探索。</div>`;
            // sendAction 稍后会在主 HTML 或启动器中挂载
            mHtml += `<button class="map-go-btn" onclick="let tw = window.parent || window; if(tw.sendAction) tw.sendAction('前往探索：${loc.name}')" style="margin-top:auto;">前往该区域探索 ▶</button>`;
        }

        let sideContent = topWin.document.getElementById('map-side-content') || document.getElementById('map-side-content');
        let sidePanel = topWin.document.getElementById('map-side-panel') || document.getElementById('map-side-panel');
        if(sideContent) sideContent.innerHTML = mHtml;
        if(sidePanel) sidePanel.classList.add('open');
    };

    topWin.openMapScene = function(scStr, parentName) {
        let sc = JSON.parse(decodeURIComponent(scStr));
        let imgUrl = getImgUrl("事务所_" + sc.name) || 'https://i.postimg.cc/mZh4H5Xg/map-placeholder.jpg';

        let mHtml = `
            <img src="${imgUrl}" class="map-loc-img">
            <div class="map-loc-title">${sc.emoji} ${sc.name}</div>
            <div style="font-size:13px; color:#db2777; font-weight:bold; margin-bottom:15px;">位于：${parentName}</div>
            <div class="map-loc-desc">${sc.desc}</div>
            <button class="map-go-btn" onclick="let tw = window.parent || window; if(tw.sendAction) tw.sendAction('前往场景：${sc.name}')">进入该场景 ▶</button>
            <button class="map-back-loc-btn" onclick="let tw = window.parent || window; tw.openMapLocation('${encodeURIComponent(JSON.stringify(topWin.IdolProjectData.currentMapLocObj))}')">◀ 返回区域概览</button>
        `;
        let sideContent = topWin.document.getElementById('map-side-content') || document.getElementById('map-side-content');
        if(sideContent) sideContent.innerHTML = mHtml;
    };

    topWin.closeMapSide = function() {
        let sidePanel = topWin.document.getElementById('map-side-panel') || document.getElementById('map-side-panel');
        if(sidePanel) sidePanel.classList.remove('open');
    };

    // 如果原来在全局也声明了，为了向下兼容 HTML，也把它们同步给当前 window
    window.renderMapApp = topWin.renderMapApp;
    window.toggleMapSidebar = topWin.toggleMapSidebar;
    window.openMapLocation = topWin.openMapLocation;
    window.openMapScene = topWin.openMapScene;
    window.closeMapSide = topWin.closeMapSide;

})();
