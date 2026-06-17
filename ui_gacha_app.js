// ==========================================
// 秋青子专属终端：100% 独立启动器 (旧文件零修改 + 基础环境补全版 + 抽签修复 + 星探寻访内建道具版)
// ==========================================
(function() {
    let topDoc;
    let topWin;
    try {
        topDoc = window.parent.document || document;
        topWin = window.parent || window;
    } catch (e) {
        topDoc = document;
        topWin = window;
    }

    // 桥接其他必要数据 (Idol, Map, Agency)
    try {
        if (typeof idolDatabase !== 'undefined') topWin.idolDatabase = idolDatabase;
        if (typeof mapDatabase !== 'undefined') topWin.mapDatabase = mapDatabase;
        if (typeof agencyData !== 'undefined') topWin.agencyData = agencyData;
    } catch(e) {}

    if (topDoc.getElementById('qingzi-global-system')) return;
    console.log("【秋青子】正在组装独立终端系统，补全基础环境中...");

    // ==========================================
    // 【核心修复】：补全原本写在 HTML 里的基础函数！
    // ==========================================

    topWin.getAssetUrl = function(key, fallbackType = 'image') {
        if (topWin.AssetsMap && topWin.AssetsMap[key]) return topWin.AssetsMap[key];
        if (fallbackType === 'avatar') {
            let liHuiKey = key.replace('_头像', '_立绘');
            if(topWin.AssetsMap && topWin.AssetsMap[liHuiKey]) return topWin.AssetsMap[liHuiKey];
            return 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png';
        }
        return '';
    };

    topWin.sendAction = function(text) {
        try {
            if(topDoc) {
                let stInput = topDoc.getElementById('send_textarea');
                if(stInput) {
                    stInput.value = text;
                    stInput.dispatchEvent(new Event('input', { bubbles: true }));
                    let toast = topDoc.createElement('div'); toast.innerText = "已填入输入框，请确认后发送";
                    toast.style.cssText = 'position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:10px 20px; border-radius:20px; z-index:99999; font-size:14px;';
                    topDoc.body.appendChild(toast); setTimeout(() => toast.remove(), 3000);
                    return;
                }
            }
        } catch(e) {}
        prompt("由于环境限制无法自动填入，请手动复制：", text);
    };

    if (!topDoc.querySelector('link[href*="bootstrap-icons"]')) {
        let link = topDoc.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
        topDoc.head.appendChild(link);
    }

    const style = topDoc.createElement('style');
    style.id = 'qingzi-global-style';
    style.innerHTML = `
        #qingzi-drag-ball {
            position: fixed; right: 20px; bottom: 120px; width: 56px; height: 56px;
            background: rgba(255, 255, 255, 0.9); border: 2px solid #db2777; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; font-size: 28px; color: #db2777;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15), inset 0 0 10px rgba(219,39,119,0.1);
            cursor: grab; z-index: 999999; user-select: none; touch-action: none;
            transition: transform 0.2s, box-shadow 0.2s, opacity 0.3s;
        }
        #qingzi-drag-ball:active { cursor: grabbing; transform: scale(0.95); }
        #qingzi-drag-ball.snap-anim { transition: left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.2s; }
        #qingzi-drag-ball.destroying { transform: scale(0) !important; opacity: 0 !important; }

        #qingzi-pad-wrapper {
            position: fixed; top: 10%; left: 50%; transform: translateX(-50%) scale(0.95);
            width: 90%; max-width: 950px; height: 85vh; min-height: 600px;
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            border-radius: 30px; border: 10px solid #1e293b;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.2);
            overflow: hidden; display: none; flex-direction: column;
            z-index: 999998; opacity: 0; transition: opacity 0.3s, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: grab;
        }
        #qingzi-pad-wrapper:active { cursor: grabbing; }
        #qingzi-pad-wrapper.active { display: flex; opacity: 1; transform: translateX(-50%) scale(1); }
        #qingzi-pad-wrapper.dragged { transform: scale(1) !important; transition: none !important; margin: 0 !important; }

        .pad-wallpaper { position: absolute; top:0; left:0; width:100%; height:100%; background: url('https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg') center/cover; opacity: 1; filter: none; z-index: 0; pointer-events: none;}
        .pad-status-bar { height: 25px; display: flex; justify-content: space-between; align-items: center; padding: 0 25px; font-size: 12px; font-weight: bold; color: #334155; z-index: 10; position: relative; background: rgba(255,255,255,0.4); user-select: none; pointer-events: none;}

        .pad-home-screen { flex: 1; position: relative; z-index: 10; display: flex; align-content: flex-start; flex-wrap: wrap; gap: 30px; padding: 40px 35px; overflow-y: auto;}
        .pad-app-icon { width: 75px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; z-index: 15; position: relative;}
        .pad-app-icon:hover { transform: translateY(-5px) scale(1.05); }
        .pad-app-icon-img { width: 60px; height: 60px; background: rgba(255,255,255,0.9); border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 32px; box-shadow: 0 8px 15px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.5); pointer-events: none; color: #475569;}
        .pad-app-icon span { font-size: 13px; font-weight: bold; color: #1e293b; text-shadow: 0 1px 3px rgba(255,255,255,0.5); white-space: nowrap; pointer-events: none;}

        .app-line .pad-app-icon-img { background: #10b981; color: #fff; border: none; }
        .app-twitter .pad-app-icon-img { background: #3b82f6; color: #fff; border: none; font-size: 28px;}
        .app-darkweb .pad-app-icon-img { background: #0f172a; color: #ef4444; border: 1px solid #334155; }
        .app-gacha .pad-app-icon-img { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: #fff; border: none; }
        .app-settings .pad-app-icon-img { background: #64748b; color: #fff; border: none; }
        .app-inv .pad-app-icon-img { background: #8b5cf6; color: #fff; border: none; }
        .app-fortune .pad-app-icon-img { background: #dc2626; color: #fff; border: none; }

        .pad-app-window { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 20; display: none; flex-direction: column; transform: translateX(100%); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: default; }
        .pad-app-window.active { display: flex; transform: translateX(0); }
        .pad-app-header { height: 55px; background: rgba(248,250,252,0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; padding: 0 20px; gap: 15px; flex-shrink: 0; z-index: 50; }
        .btn-pad-back { border: none; background: #f1f5f9; width: 36px; height: 36px; border-radius: 50%; font-size: 14px; cursor: pointer; color: #db2777; font-weight: bold; transition: 0.2s; display: flex; align-items: center; justify-content: center;}
        .btn-pad-back:hover { background: #e2e8f0; }
        .pad-app-title { font-size: 17px; font-weight: 900; color: #1e293b; }
        .pad-app-content-area { flex: 1; overflow: auto; position: relative; display: flex; flex-direction: column; background: #fff;}

        .pad-home-bar-wrap { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); width: 140px; height: 6px; background: #cbd5e1; border-radius: 6px; z-index: 30; cursor: pointer; transition: 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .pad-home-bar-wrap:hover { background: #94a3b8; height: 8px; }
        .dev-placeholder { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #94a3b8; gap: 15px;}
        .dev-placeholder i { font-size: 48px; font-style: normal;}
        .dev-placeholder span { font-weight: bold; font-size: 16px; letter-spacing: 1px;}

        .map-layout { position: relative; width: 100%; height: 100%; background: #f4eedc;}
        .map-main { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 1;}
        .map-inner-wrapper { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .map-bg { width: 100%; height: 100%; object-fit: contain; position: absolute; top:0; left:0;}
        .map-pin { position: absolute; width: 32px; height: 32px; background: #ef4444; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 4px 10px rgba(239,68,68,0.5); cursor: pointer; transform: translate(-50%, -50%); transition: 0.3s; display: flex; align-items: center; justify-content: center; font-size: 16px; z-index: 5;}
        .map-pin::after { content: ''; position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px solid #ef4444; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .map-pin:hover { transform: translate(-50%, -50%) scale(1.2); z-index: 10;}
        .map-sidebar { position: absolute; top: 0; left: 0; width: 35%; height: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); box-shadow: 5px 0 20px rgba(0,0,0,0.1); z-index: 15; transform: translateX(0); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column;}
        .map-sidebar.collapsed { transform: translateX(calc(-100%)); }
        .map-sidebar-toggle { position: absolute; right: -30px; top: 30px; width: 30px; height: 40px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 0 8px 8px 0; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 5px 0 10px rgba(0,0,0,0.05); color: #db2777; font-weight: bold; font-size: 14px; border: 1px solid rgba(0,0,0,0.05); border-left: none; transition: 0.2s;}
        .map-sidebar-toggle:hover { background: #fff; width: 35px; right: -35px;}
        .map-sidebar-content { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px;}
        .map-sidebar-content::-webkit-scrollbar { width: 4px; }
        .map-sidebar-content::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
        .map-list-item { background: #f1f5f9; padding: 12px; border-radius: 12px; cursor: pointer; border: 1px solid rgba(0,0,0,0.05); transition: 0.2s; display: flex; align-items: center; gap: 10px;}
        .map-list-item:hover { background: #fff; border-color: #db2777; transform: translateX(3px);}
        .map-list-emoji { font-size: 22px; }
        .map-list-name { font-size: 14px; font-weight: bold; color: #334155; }
        .map-detail-panel { position: absolute; top: 0; right: -100%; width: 50%; height: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); box-shadow: -5px 0 20px rgba(0,0,0,0.1); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; z-index: 20; border-left: 1px solid rgba(0,0,0,0.05);}
        .map-detail-panel.open { right: 0; }
        .map-close-btn { position: absolute; top: 15px; left: 15px; width: 36px; height: 36px; border-radius: 18px; background: #f1f5f9; border: none; font-weight: bold; cursor: pointer; color: #64748b; z-index: 21; font-size: 16px;}
        .map-detail-content { flex: 1; overflow-y: auto; padding: 25px; padding-top: 60px; display: flex; flex-direction: column;}
        .map-loc-img { width: 100%; height: 160px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; background: #e2e8f0; border: 1px solid rgba(0,0,0,0.05);}
        .map-loc-title { font-size: 22px; font-weight: 900; color: #1e293b; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;}
        .map-loc-desc { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 25px;}
        .map-scene-list-title { font-size: 15px; font-weight: bold; color: #db2777; margin-bottom: 12px; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 6px;}
        .map-scene-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;}
        .map-scene-item { background: #f8fafc; padding: 15px; border-radius: 12px; cursor: pointer; border: 1px solid rgba(0,0,0,0.05); transition: 0.2s; display: flex; align-items: center; gap: 12px;}
        .map-scene-item:hover { background: #fff; border-color: #db2777; transform: translateX(5px); box-shadow: 0 4px 10px rgba(0,0,0,0.02);}
        .map-go-btn { width: 100%; padding: 16px; background: #db2777; color: #fff; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(219,39,119,0.3); transition: 0.2s; font-size: 16px; margin-top: auto;}
        .map-go-btn:hover { transform: translateY(-3px); filter: brightness(1.1); }
        .map-back-loc-btn { width: 100%; padding: 12px; background: #f1f5f9; color: #475569; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; font-size: 14px; margin-top: 12px;}
        .map-back-loc-btn:hover { background: #e2e8f0; }
    `;
    topDoc.head.appendChild(style);

    const container = topDoc.createElement('div');
    container.id = 'qingzi-global-system';

    const ballHtml = `<div id="qingzi-drag-ball" title="点击开关平板 | 长按销毁"><i class="bi bi-tablet-fill"></i></div>`;

    const padHtml = `
        <div id="qingzi-pad-wrapper">
            <div class="pad-wallpaper"></div>
            <div class="pad-status-bar">
                <span>iPad OS</span>
                <span id="pad-time">14:30 <i class="bi bi-battery-full"></i> 98%</span>
            </div>
            <div class="pad-home-screen" id="pad-home-screen">
                <div class="pad-app-icon" data-app-id="map"><div class="pad-app-icon-img"><i class="bi bi-map-fill"></i></div><span>地图探索</span></div>
                <div class="pad-app-icon app-line" data-app-id="contact"><div class="pad-app-icon-img"><i class="bi bi-chat-dots-fill"></i></div><span>LINE</span></div>
                <div class="pad-app-icon" data-app-id="gallery"><div class="pad-app-icon-img"><i class="bi bi-images"></i></div><span>秘密相册</span></div>
                <div class="pad-app-icon app-twitter" data-app-id="twitter"><div class="pad-app-icon-img"><i class="bi bi-twitter"></i></div><span>IdolX</span></div>
                <div class="pad-app-icon" data-app-id="schedule"><div class="pad-app-icon-img"><i class="bi bi-calendar3"></i></div><span>日程安排</span></div>
                <div class="pad-app-icon" data-app-id="task"><div class="pad-app-icon-img"><i class="bi bi-clipboard-data-fill"></i></div><span>任务看板</span></div>
                <div class="pad-app-icon" data-app-id="wiki"><div class="pad-app-icon-img"><i class="bi bi-book-half"></i></div><span>情报Wiki</span></div>
                <div class="pad-app-icon app-gacha" data-app-id="gacha"><div class="pad-app-icon-img"><i class="bi bi-controller"></i></div><span>星探寻访</span></div>
                <div class="pad-app-icon" data-app-id="music"><div class="pad-app-icon-img" style="color: #ec4899;"><i class="bi bi-music-note-beamed"></i></div><span>音乐</span></div>
                <div class="pad-app-icon app-settings" data-app-id="settings"><div class="pad-app-icon-img"><i class="bi bi-gear-fill"></i></div><span>设置</span></div>
                <div class="pad-app-icon app-inv" data-app-id="inventory"><div class="pad-app-icon-img"><i class="bi bi-bag-fill"></i></div><span>背包仓储</span></div>
                <div class="pad-app-icon" data-app-id="wallpaper"><div class="pad-app-icon-img" style="color: #14b8a6;"><i class="bi bi-palette-fill"></i></div><span>主题壁纸</span></div>
                <div class="pad-app-icon app-darkweb" data-app-id="darkweb"><div class="pad-app-icon-img"><i class="bi bi-incognito"></i></div><span style="color:#ef4444;">DarkWeb</span></div>
                <div class="pad-app-icon app-fortune" data-app-id="fortune"><div class="pad-app-icon-img"><i class="bi bi-box2-heart-fill"></i></div><span>今日运势</span></div>
            </div>

            <div class="pad-app-window" id="pad-app-map">
                <div class="pad-app-header"><button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button><div class="pad-app-title">地图探索</div></div>
                <div class="pad-app-content-area" id="pad-content-map">
                    <div class="dev-placeholder"><i class="bi bi-hourglass-split"></i><span>地图加载中...</span></div>
                </div>
            </div>
            <div class="pad-app-window" id="pad-app-contact">
                <div class="pad-app-header"><button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button><div class="pad-app-title">LINE 通讯录</div></div>
                <div class="pad-app-content-area pad-contact-wrap" id="pad-content-contact"></div>
            </div>
            <div class="pad-app-window" id="pad-app-gallery">
                <div class="pad-app-header">
                    <button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button>
                    <div class="pad-app-title">秘密相册</div>
                </div>
                <div class="pad-app-content-area" id="pad-content-gallery"></div>
            </div>
            <div class="pad-app-window" id="pad-app-twitter"><div class="pad-app-header"><button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button><div class="pad-app-title">IdolX</div></div><div class="pad-app-content-area dev-placeholder"><i class="bi bi-twitter"></i><span>开发中...</span></div></div>
            <div class="pad-app-window" id="pad-app-schedule"><div class="pad-app-header"><button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button><div class="pad-app-title">日程安排</div></div><div class="pad-app-content-area dev-placeholder"><i class="bi bi-calendar3"></i><span>开发中...</span></div></div>
            <div class="pad-app-window" id="pad-app-task"><div class="pad-app-header"><button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button><div class="pad-app-title">任务看板</div></div><div class="pad-app-content-area dev-placeholder"><i class="bi bi-clipboard-data-fill"></i><span>开发中...</span></div></div>
            <div class="pad-app-window" id="pad-app-wiki"><div class="pad-app-header"><button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button><div class="pad-app-title">情报 Wiki</div></div><div class="pad-app-content-area dev-placeholder"><i class="bi bi-book-half"></i><span>开发中...</span></div></div>
            <div class="pad-app-window" id="pad-app-gacha">
                <div class="pad-app-header"><button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button><div class="pad-app-title">星探寻访</div></div>
                <div class="pad-app-content-area" id="pad-content-gacha" style="padding: 0; background: #f8fafc;">
                    <div class="dev-placeholder"><i class="bi bi-controller"></i><span>开发中...</span></div>
                </div>
            </div>
            <div class="pad-app-window" id="pad-app-music">
                <div class="pad-app-header">
                    <button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button>
                    <div class="pad-app-title">音乐</div>
                </div>
                <div class="pad-app-content-area" id="pad-content-music" style="padding: 0;"></div>
            </div>
            <div class="pad-app-window" id="pad-app-fortune">
                <div class="pad-app-header">
                    <button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button>
                    <div class="pad-app-title">神社御神籤</div>
                </div>
                <div class="pad-app-content-area" id="pad-content-fortune" style="padding: 0;"></div>
            </div>
            <div class="pad-app-window" id="pad-app-settings"><div class="pad-app-header"><button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button><div class="pad-app-title">系统设置</div></div><div class="pad-app-content-area dev-placeholder"><i class="bi bi-gear-fill"></i><span>开发中...</span></div></div>
            <div class="pad-app-window" id="pad-app-inventory"><div class="pad-app-header"><button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button><div class="pad-app-title">背包仓储</div></div><div class="pad-app-content-area dev-placeholder"><i class="bi bi-bag-fill"></i><span>开发中...</span></div></div>
            <div class="pad-app-window" id="pad-app-wallpaper">
                <div class="pad-app-header">
                    <button class="btn-pad-back"><i class="bi bi-chevron-left"></i></button>
                    <div class="pad-app-title">主题壁纸</div>
                </div>
                <div class="pad-app-content-area" id="pad-content-wallpaper">
                    <div class="dev-placeholder"><i class="bi bi-hourglass-split"></i><span>壁纸加载中...</span></div>
                </div>
            </div>
            <div class="pad-app-window" id="pad-app-darkweb" style="background:#0f172a; color:#fff;"><div class="pad-app-header" style="background:#1e293b; border-bottom:1px solid #334155;"><button class="btn-pad-back" style="background:#334155; color:#fff;"><i class="bi bi-chevron-left"></i></button><div class="pad-app-title" style="color:#ef4444;">Dark Web</div></div><div class="pad-app-content-area dev-placeholder" style="background:#0f172a;"><i class="bi bi-incognito" style="color:#ef4444;"></i><span style="color:#ef4444;">验证权限...</span></div></div>

            <div class="pad-home-bar-wrap"></div>
        </div>
    `;

    container.innerHTML = ballHtml + padHtml;
    topDoc.body.appendChild(container);

    const ball = topDoc.getElementById('qingzi-drag-ball');
    const padWrapper = topDoc.getElementById('qingzi-pad-wrapper');

    topWin.qingziPad = {
        isOpen: false,
        togglePad: function() {
            if (this.isOpen) {
                padWrapper.classList.remove('active');
                setTimeout(() => { if(!this.isOpen) padWrapper.style.display = 'none'; }, 300);
                this.isOpen = false;
            } else {
                padWrapper.style.display = 'flex';
                void padWrapper.offsetWidth;
                padWrapper.classList.add('active');
                this.isOpen = true;
            }
        },
        openApp: function(appId) {
            const app = topDoc.getElementById('pad-app-' + appId);
            if (app) app.classList.add('active');
        },
        closeApp: function() {
            const apps = topDoc.querySelectorAll('.pad-app-window');
            apps.forEach(app => app.classList.remove('active'));
        }
    };

    padWrapper.addEventListener('click', function(e) {
        const icon = e.target.closest('.pad-app-icon');
        if (icon) { const appId = icon.getAttribute('data-app-id'); if (appId) topWin.qingziPad.openApp(appId); return; }
        const backBtn = e.target.closest('.btn-pad-back');
        if (backBtn) { topWin.qingziPad.closeApp(); return; }
        const homeBar = e.target.closest('.pad-home-bar-wrap');
        if (homeBar) { topWin.qingziPad.togglePad(); return; }
    });

    let isDraggingBall = false, hasMovedBall = false, startXBall, startYBall, initLeftBall, initTopBall;
    let pressTimer = null;
    function getEventPos(e) { return e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }; }

    ball.addEventListener('mousedown', function(e) {
        isDraggingBall = true; hasMovedBall = false; ball.classList.remove('snap-anim');
        const pos = getEventPos(e); startXBall = pos.x; startYBall = pos.y;
        const rect = ball.getBoundingClientRect(); initLeftBall = rect.left; initTopBall = rect.top;
        ball.style.right = 'auto'; ball.style.bottom = 'auto';
        ball.style.left = initLeftBall + 'px'; ball.style.top = initTopBall + 'px';
        pressTimer = setTimeout(() => {
            if (!hasMovedBall) { isDraggingBall = false; ball.classList.add('destroying'); setTimeout(() => container.remove(), 300); }
        }, 1500);
    });

    topDoc.addEventListener('mousemove', function(e) {
        if (!isDraggingBall) return;
        const pos = getEventPos(e), dx = pos.x - startXBall, dy = pos.y - startYBall;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) { hasMovedBall = true; clearTimeout(pressTimer); }
        let winW = topDoc.documentElement.clientWidth, winH = topDoc.documentElement.clientHeight;
        ball.style.left = Math.max(0, Math.min(initLeftBall + dx, winW - ball.offsetWidth)) + 'px';
        ball.style.top = Math.max(0, Math.min(initTopBall + dy, winH - ball.offsetHeight)) + 'px';
    });

    topDoc.addEventListener('mouseup', function() {
        if (!isDraggingBall) return;
        isDraggingBall = false; clearTimeout(pressTimer);
        if (hasMovedBall) {
            ball.classList.add('snap-anim');
            const rect = ball.getBoundingClientRect(), winW = topDoc.documentElement.clientWidth;
            ball.style.left = (rect.left + rect.width / 2) < winW / 2 ? '10px' : (winW - rect.width - 10) + 'px';
        }
    });

    ball.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!hasMovedBall) topWin.qingziPad.togglePad();
    });

    let isDraggingPad = false, padStartX, padStartY, padInitLeft, padInitTop;

    padWrapper.addEventListener('mousedown', function(e) {
        const noDragTags = ['BUTTON', 'INPUT', 'TEXTAREA'];
        if (noDragTags.includes(e.target.tagName)) return;
        if (e.target.closest('.pad-app-icon') || e.target.closest('.pad-home-bar-wrap') || e.target.closest('.btn-pad-back')) return;
        if (e.target.closest('.pad-app-content-area')) return;

        isDraggingPad = true; padWrapper.classList.add('dragged');
        const rect = padWrapper.getBoundingClientRect();
        padInitLeft = rect.left; padInitTop = rect.top;
        padWrapper.style.left = padInitLeft + 'px'; padWrapper.style.top = padInitTop + 'px';
        const pos = getEventPos(e); padStartX = pos.x; padStartY = pos.y;
    });

    topDoc.addEventListener('mousemove', function(e) {
        if (!isDraggingPad) return;
        const pos = getEventPos(e);
        let winW = topDoc.documentElement.clientWidth, winH = topDoc.documentElement.clientHeight;
        let newL = padInitLeft + (pos.x - padStartX);
        let newT = padInitTop + (pos.y - padStartY);
        padWrapper.style.left = Math.max(0, Math.min(newL, winW - padWrapper.offsetWidth)) + 'px';
        padWrapper.style.top = Math.max(0, Math.min(newT, winH - padWrapper.offsetHeight)) + 'px';
    });
    topDoc.addEventListener('mouseup', function() { isDraggingPad = false; });

    function fixOldFileOnclicks(containerEl) {
        if (!containerEl) return;
        const elements = containerEl.querySelectorAll('[onclick]');
        elements.forEach(el => {
            const attr = el.getAttribute('onclick');
            el.removeAttribute('onclick');
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                try {
                    const func = new topWin.Function(attr);
                    func.call(topWin);
                } catch(err) {
                    console.error("【秋青子魔法引擎】执行旧事件失败:", err);
                }
            });
        });
    }

    const mapObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.hasAttribute('onclick')) fixOldFileOnclicks(node.parentElement);
                    fixOldFileOnclicks(node);
                }
            });
        });
    });

    // ==========================================
    // 【内建道具数据】：直接将道具硬编码在此，脱离外部依赖
    // ==========================================
    const builtinItemPool = [
        // ================= 【心理状态干预】 =================
        // Stress类
        { type: 'psychology', name: "薄荷糖", img: "https://i.postimg.cc/d3kyKtLB/bao-he-tang-(1).png", weight: 100, desc: "微量缓解压力 (Stress -5%)" },
        { type: 'psychology', name: "热牛奶", img: "https://i.postimg.cc/VvxbsQCM/re-niu-nai-(1).png", weight: 30, desc: "少量缓解压力 (Stress -15%)" },
        { type: 'psychology', name: "安眠香薰", img: "https://i.postimg.cc/vTgVdHcv/an-mian-xiang-xun-(1).png", weight: 20, desc: "中度舒缓精神 (Stress -30%)" },
        { type: 'psychology', name: "度假机票", img: "https://i.postimg.cc/fyG0Wn9m/du-jia-ji-piao-(1).png", weight: 2, desc: "彻底清空压力 (Stress -80%)" },

        // Obedience/Lust类
        { type: 'psychology', name: "镇静药片", img: "https://i.postimg.cc/pL7chsD5/zhen-jing-yao-pian-(1).png", weight: 60, desc: "微量提升堕落度 (Lust +10)" },
        { type: 'psychology', name: "VIP房卡", img: "https://i.postimg.cc/W1KYF5MJ/vip-fang-ka-(1).png", weight: 40, desc: "开启密会 (Lust +20)" },
        { type: 'psychology', name: "高额合同", img: "https://i.postimg.cc/P5cVpSmZ/gao-e-he-tong-(1).png", weight: 20, desc: "中度提升堕落度 (Lust +40)" },
        { type: 'psychology', name: "皮带项圈", img: "https://i.postimg.cc/zGM2bxng/pi-dai-xiang-quan-(1).png", weight: 5, desc: "大幅提升堕落度 (Lust +60)" },
        { type: 'psychology', name: "行程表", img: "https://i.postimg.cc/J47JkgCK/xing-cheng-biao.png", weight: 30, desc: "规划时间 (Obedience +5)" },
        { type: 'psychology', name: "制作人指令卡", img: "https://i.postimg.cc/c41YnjGh/zhi-zuo-ren-zhi-ling-ka.png", weight: 15, desc: "强制服从 (Obedience +10)" },
        { type: 'psychology', name: "制作人徽章", img: "https://i.postimg.cc/025mw31C/zhi-zuo-ren-hui-zhang.png", weight: 8, desc: "权威象征 (Obedience +15)" },
        { type: 'psychology', name: "金色企划书", img: "https://i.postimg.cc/ZKY3dgzx/jin-se-qi-hua-shu.png", weight: 2, desc: "绝对服从 (Obedience +20)" },

        // Affection类
        { type: 'psychology', name: "粉丝来信", img: "https://i.postimg.cc/y8VfWnLJ/fen-si-lai-xin.png", weight: 40, desc: "增加偶像羁绊 (Affection +2)" },
        { type: 'psychology', name: "手写便签", img: "https://i.postimg.cc/cLsD6TF8/shou-xie-bian-qian.png", weight: 30, desc: "传递关怀 (Affection +4)" },
        { type: 'psychology', name: "纪念相册", img: "https://i.postimg.cc/qvkmgQ16/ji-nian-xiang-ce.png", weight: 20, desc: "回忆杀 (Affection +7)" },
        { type: 'psychology', name: "情书", img: "https://i.postimg.cc/BnqhtNmj/qing-shu.png", weight: 10, desc: "直球告白 (Affection +10)" },

        // ================= 【业务能力提升】 =================
        // Vocal/Dance/Visual
        { type: 'business', name: "练习话筒", img: "https://i.postimg.cc/gkvzGc7d/lian-xi-hua-tong.png", weight: 20, desc: "Vocal能力微量提升 (+2)" },
        { type: 'business', name: "专业麦克风", img: "https://i.postimg.cc/TYrdT2sY/zhuan-ye-mai-ke-feng.png", weight: 12, desc: "Vocal能力少量提升 (+5)" },
        { type: 'business', name: "水晶麦克风", img: "https://i.postimg.cc/MKy6zZLW/shui-jing-mai-ke-feng.png", weight: 6, desc: "Vocal能力中量提升 (+8)" },
        { type: 'business', name: "金唱片", img: "https://i.postimg.cc/MKy6zZL6/jin-chang-pian.png", weight: 2, desc: "Vocal能力大幅提升 (+10)" },

        { type: 'business', name: "练习舞鞋", img: "https://i.postimg.cc/cHcpPPzf/lian-xi-wu-xie-(1).png", weight: 20, desc: "Dance能力微量提升 (+2)" },
        { type: 'business', name: "演出舞鞋", img: "https://i.postimg.cc/qRGPWWFL/yan-chu-wu-xie-1.png", weight: 12, desc: "Dance能力少量提升 (+5)" },
        { type: 'business', name: "水晶舞鞋", img: "https://i.postimg.cc/PxMg007M/shui-jing-wu-xie-(1).png", weight: 6, desc: "Dance能力中量提升 (+8)" },
        { type: 'business', name: "闪耀舞鞋", img: "https://i.postimg.cc/26xsggtG/shan-yao-wu-xie-(1).png", weight: 2, desc: "Dance能力大幅提升 (+10)" },

        { type: 'business', name: "拍立得", img: "https://i.postimg.cc/5jckyV63/pai-li-de.png", weight: 20, desc: "Visual能力微量提升 (+2)" },
        { type: 'business', name: "摄影胶卷", img: "https://i.postimg.cc/SQXSnfJZ/she-ying-jiao-juan.png", weight: 12, desc: "Visual能力少量提升 (+5)" },
        { type: 'business', name: "时尚杂志", img: "https://i.postimg.cc/NGysKk5J/shi-shang-za-zhi.png", weight: 6, desc: "Visual能力中量提升 (+8)" },
        { type: 'business', name: "封面海报", img: "https://i.postimg.cc/t70mJjYz/feng-mian-hai-bao.png", weight: 2, desc: "Visual能力大幅提升 (+10)" },

        // ================= 【特殊彩蛋与剧情】 =================
        // 彩蛋类
        { type: 'easter_egg', name: "冰棒", img: "https://i.postimg.cc/85V97FNx/bing-bang.png", weight: 40, desc: "降温解暑 (Stress -10%, Affection +5)" },
        { type: 'easter_egg', name: "珍珠奶茶", img: "https://i.postimg.cc/6qWPhD7H/zhen-zhu-nai-cha.png", weight: 25, desc: "甜品治愈 (Stress -20%, Affection +3)" },
        { type: 'easter_egg', name: "麦片粥", img: "https://i.postimg.cc/26fM1qCq/mai-pian-zhou.png", weight: 15, desc: "温暖肠胃 (Stress -25%, Affection +1)" },
        { type: 'easter_egg', name: "巧克力蛋糕", img: "https://i.postimg.cc/d1mXrq01/qiao-ke-li-dan-gao.png", weight: 8, desc: "高热量治愈 (Stress -50%, Affection +3)" },

        { type: 'easter_egg', name: "小黄鸭", img: "https://i.postimg.cc/vmZWwN3D/xiao-huang-ya.png", weight: 5, desc: "触发共浴剧情。Stress -20, Affection +5" },
        { type: 'easter_egg', name: "草莓饭团", img: "https://i.postimg.cc/vBdk41bJ/cao-mei-fan-tuan.png", weight: 5, desc: "触发投喂剧情。Stress -10, Affection +1" },
        { type: 'easter_egg', name: "制作人玩偶", img: "https://i.postimg.cc/YSC1BsbG/zhi-zuo-ren-wan-ou.png", weight: 4, desc: "触发制作人玩偶剧情。Stress -40, Affection +20" },
        { type: 'easter_egg', name: "创可贴", img: "https://i.postimg.cc/NMwSKyBW/chuang-ke-tie.png", weight: 5, desc: "触发包扎剧情。Stress -15, Affection +5" },
        { type: 'easter_egg', name: "星星布丁", img: "https://i.postimg.cc/NFsnxWy8/xing-xing-bu-ding.png", weight: 5, desc: "触发甜点时间。Stress -30, Affection +5" },
        { type: 'easter_egg', name: "身体乳", img: "https://i.postimg.cc/fLjFmwbK/shen-ti-ru.png", weight: 4, desc: "触发涂抹剧情。Stress -10, Affection +3" },
        { type: 'easter_egg', name: "婚纱", img: "https://i.postimg.cc/ydztDJ7B/hun-sha.png", weight: 1, desc: "触发试穿婚纱绝密剧情。Affection +30" },
        { type: 'easter_egg', name: "对戒戒指盒", img: "https://i.postimg.cc/Y9wZv4tK/dui-jie-jie-zhi-he.png", weight: 2, desc: "触发赠礼剧情。Affection +20" },

        { type: 'easter_egg', name: "Cupless Bra", img: "https://i.postimg.cc/hGmN48RR/cupless-bra.png", weight: 3, desc: "触发更衣剧情。Stress+10, Aff+3, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "兔女郎装", img: "https://i.postimg.cc/fyzPv63m/tu-nu-lang-zhuang.png", weight: 3, desc: "触发Cosplay剧情。Stress+10, Aff+8, Ob+10, Lust+5" },
        { type: 'easter_egg', name: "奶牛比基尼", img: "https://i.postimg.cc/76Mc0xLx/nai-niu-bi-ji-ni.png", weight: 3, desc: "触发牧场摄影。Stress+10, Aff+8, Ob+15, Lust+5" },
        { type: 'easter_egg', name: "情趣内衣", img: "https://i.postimg.cc/Yq1txyrh/qing-qu-nei-yi.png", weight: 3, desc: "触发夜间招待。Stress-10, Aff+6, Ob+10" },
        { type: 'easter_egg', name: "幸运胖次", img: "https://i.postimg.cc/W41McHXh/xing-yun-pang-ci.png", weight: 3, desc: "触发搜查剧情。Stress-10, Aff+15, Ob+10" },
        { type: 'easter_egg', name: "猫耳发箍", img: "https://i.postimg.cc/KY8nhHJ8/mao-er-fa-gu.png", weight: 4, desc: "触发猫娘撒娇。Stress-10, Aff+3" },

        { type: 'easter_egg', name: "跳蛋", img: "https://i.postimg.cc/yN8FCbvd/tiao-dan.png", weight: 4, desc: "触发隐藏刺激事件。Stress-20, Aff+5, Ob+10, Lust+5" },
        { type: 'easter_egg', name: "震动棒", img: "https://i.postimg.cc/N0j1vzpH/zhen-dong-bang.png", weight: 4, desc: "触发休息室调教。Stress-20, Aff+5, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "G点按摩器", img: "https://i.postimg.cc/wvdZ1tg4/G-dian-an-mo-qi-(G-spot-massager).png", weight: 3, desc: "触发深层开发。Stress-20, Aff+3, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "前列腺按摩器", img: "https://i.postimg.cc/26FJhz55/qian-lie-xian-an-mo-qi-aneros.png", weight: 2, desc: "触发特殊体质开发。Stress-20, Aff+3, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "双头龙", img: "https://i.postimg.cc/JncgZ1hK/shuang-tou-long-double-dildo.png", weight: 2, desc: "触发双人互动。Stress-20, Aff+1, Ob+20, Lust+15" },

        { type: 'easter_egg', name: "乳夹", img: "https://i.postimg.cc/Y9fVYpSg/ru-jia.png", weight: 3, desc: "触发敏感度训练。Stress+15, Aff+1, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "乳环", img: "https://i.postimg.cc/rmCbx8pz/ru-huan.png", weight: 3, desc: "触发穿孔改造。Stress+15, Aff+1, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "乳钉", img: "https://i.postimg.cc/hjbwTSGv/ru-ding.png", weight: 3, desc: "触发穿孔改造。Stress+15, Aff+1, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "乳链", img: "https://i.postimg.cc/RFQ8KM0d/ru-lian.png", weight: 3, desc: "触发牵引调教。Stress+15, Aff+1, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "榨乳器", img: "https://i.postimg.cc/Y0rPxJ48/zha-ru-qi.png", weight: 2, desc: "触发催乳剧情。Stress+15, Aff+3, Ob+10, Lust+5" },
        { type: 'easter_egg', name: "金色乳头夹", img: "https://i.postimg.cc/63Ng87BW/jin-se-ru-tou-jia.png", weight: 2, desc: "触发高级调教。Stress-15, Aff+5, Ob+10" },

        { type: 'easter_egg', name: "宝石肛塞", img: "https://i.postimg.cc/Gh0cG1CY/bao-shi-gang-sai.png", weight: 3, desc: "触发常驻佩戴指令。Stress+10, Aff+3, Ob+5, Lust+5" },
        { type: 'easter_egg', name: "尾巴肛塞", img: "https://i.postimg.cc/Dyq7cYvP/wei-ba-gang-sai.png", weight: 3, desc: "触发宠物扮演。Stress+10, Aff+6, Ob+5, Lust+5" },
        { type: 'easter_egg', name: "拉珠", img: "https://i.postimg.cc/XJ0mrZnJ/la-zhu-anal-beads.png", weight: 3, desc: "触发登台挑战。Stress+15, Aff+1, Ob+20, Lust+15" },

        { type: 'easter_egg', name: "口球", img: "https://i.postimg.cc/pTt4m9PV/kou-qiu.png", weight: 3, desc: "触发禁言惩罚。Stress+10, Aff+1, Ob+20, Lust+5" },
        { type: 'easter_egg', name: "环形口塞", img: "https://i.postimg.cc/C1VXRZwV/huan-xing-kou-sai.png", weight: 3, desc: "触发深喉拓展。Stress+10, Aff+1, Ob+10, Lust+5" },
        { type: 'easter_egg', name: "金属项圈", img: "https://i.postimg.cc/TY8RgX6n/jin-shu-xiang-quan.png", weight: 3, desc: "触发主奴契约。Stress+10, Aff+3, Ob+10, Lust+5" },
        { type: 'easter_egg', name: "狗链", img: "https://i.postimg.cc/TwXFKyT8/gou-lian.png", weight: 2, desc: "触发遛狗剧情。Stress+15, Aff+1, Ob+50, Lust+10" },
        { type: 'easter_egg', name: "手铐", img: "https://i.postimg.cc/c4Qdc5xw/shou-kao.png", weight: 3, desc: "触发拘禁审问。Stress+5, Aff+3, Ob+10, Lust+1" },
        { type: 'easter_egg', name: "束缚带", img: "https://i.postimg.cc/ZKrJLDbd/shu-fu-dai.png", weight: 3, desc: "触发强制压制。Stress+10, Aff+3, Ob+10, Lust+1" },
        { type: 'easter_egg', name: "龟甲缚", img: "https://i.postimg.cc/TwXFKyTv/gui-jia-fu.png", weight: 2, desc: "触发绳艺展示。Stress+10, Aff+1, Ob+10, Lust+1" },
        { type: 'easter_egg', name: "鞭子", img: "https://i.postimg.cc/ZRh2W942/bian-zi.png", weight: 2, desc: "触发肉体惩戒。Stress+20, Aff+1, Ob+30, Lust+10" },
        { type: 'easter_egg', name: "蜡烛", img: "https://i.postimg.cc/hjq6XJKv/la-zhu.png", weight: 2, desc: "触发滴蜡体验。Stress-10, Aff+3" },
        { type: 'easter_egg', name: "鼻勾", img: "https://i.postimg.cc/Kzyw1KxV/bi-gou.png", weight: 2, desc: "触发屈辱姿态。Stress+10, Aff+1, Ob+5, Lust+1" },
        { type: 'easter_egg', name: "尿道棒", img: "https://i.postimg.cc/fLjFmwbT/niao-dao-bang.png", weight: 2, desc: "触发极限忍耐。Stress+20, Aff+1, Ob+20, Lust+20" },
        { type: 'easter_egg', name: "贞操带", img: "https://i.postimg.cc/tJqczL1k/zhen-cao-dai.png", weight: 2, desc: "触发欲望管理。Stress+15, Aff+1, Ob+20, Lust+10" },
        { type: 'easter_egg', name: "录像带", img: "https://i.postimg.cc/PrmdMFXC/lu-xiang-dai.png", weight: 2, desc: "触发绝密要挟剧情。Stress+5, Aff+3, Ob+10, Lust+1" },
        { type: 'easter_egg', name: "眼罩", img: "https://i.postimg.cc/WbMs7fN6/yan-zhao.png", weight: 4, desc: "触发视觉剥夺体验。Stress+10, Aff+1" }
    ];

    // ==========================================
    // 渲染 Gacha APP 核心逻辑
    // ==========================================
    topWin.renderGachaApp = function(container) {
        if (typeof topWin.playerCurrency === 'undefined') {
            topWin.playerCurrency = { stardust: 50000 };
        }

        const pools = {
            'standard': {
                id: 'standard',
                name: '常驻星探发掘',
                desc: '发掘隐藏在街头巷尾的原石，扩充事务所战力。这里有各种充满潜力的女孩等待你的发现。',
                bg: 'https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg',
                charImg: '',
                idolRate: 0.04,
                typeLabel: 'STANDARD'
            },
            'limited': {
                id: 'limited',
                name: '星光坠落之夜',
                desc: '【期间限定】特选偶像发掘概率大幅提升！抓住这不容错过的相遇。',
                bg: 'https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg',
                charImg: (topWin.idolDatabase && topWin.idolDatabase.length > 0) ? topWin.idolDatabase[0].image : '',
                idolRate: 0.08,
                typeLabel: 'LIMITED'
            }
        };

        let currentPoolId = 'standard';
        // 直接使用内建道具池，放弃读取外部数据
        let actualItemPool = builtinItemPool;

        if (!topDoc.getElementById('qingzi-gacha-master-style')) {
            const styleGacha = topDoc.createElement('style');
            styleGacha.id = 'qingzi-gacha-master-style';
            styleGacha.innerHTML = `
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');

                .imas-container { width: 100%; height: 100%; display: flex; flex-direction: column; background: #0f172a; font-family: 'Noto Sans SC', sans-serif; position: relative; overflow: hidden; color: #fff; }

                .imas-topbar { height: 50px; background: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0)); display: flex; justify-content: flex-end; align-items: center; padding: 0 30px; z-index: 20; position: absolute; top:0; right:0; width: 100%; pointer-events: none;}
                .imas-currency { display: flex; align-items: center; gap: 8px; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(10px); padding: 6px 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); pointer-events: auto; box-shadow: 0 4px 10px rgba(0,0,0,0.3);}
                .imas-currency i { color: #38bdf8; font-size: 18px; filter: drop-shadow(0 0 5px #38bdf8); }
                .imas-currency span { font-size: 16px; font-weight: 900; font-family: monospace; color: #fff; letter-spacing: 1px;}

                .imas-main { flex: 1; display: flex; position: relative; padding-top: 20px;}

                .imas-pool-list { width: 260px; padding: 40px 0 20px 20px; display: flex; flex-direction: column; gap: 12px; z-index: 10; }
                .imas-pool-tab { position: relative; padding: 15px 20px; background: rgba(255,255,255,0.05); border-radius: 12px 0 0 12px; cursor: pointer; transition: 0.3s; border: 1px solid rgba(255,255,255,0.05); border-right: none; overflow: hidden; }
                .imas-pool-tab:hover { background: rgba(255,255,255,0.1); }
                .imas-pool-tab.active { background: linear-gradient(90deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.05)); border-color: rgba(56, 189, 248, 0.5); }
                .imas-pool-tab.active::before { content: ''; position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: #38bdf8; box-shadow: 0 0 10px #38bdf8; }
                .imas-pool-name { font-size: 14px; font-weight: bold; color: #e2e8f0; position: relative; z-index: 2; text-shadow: 0 2px 4px rgba(0,0,0,0.5);}
                .imas-pool-tab.active .imas-pool-name { color: #fff; text-shadow: 0 0 8px rgba(56,189,248,0.8); }

                .imas-content { flex: 1; position: relative; margin: 0 20px 20px 0; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; }

                .imas-banner-bg { position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; opacity: 0.6; transition: opacity 0.5s; }
                .imas-banner-char { position: absolute; right: -5%; bottom: -5%; height: 115%; object-fit: contain; filter: drop-shadow(-20px 0 30px rgba(0,0,0,0.8)); transition: 0.5s; pointer-events: none; }
                .imas-gradient-mask { position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.4) 50%, transparent 100%); pointer-events: none;}

                .imas-banner-info { position: absolute; left: 40px; top: 40px; z-index: 5; max-width: 50%; }
                .imas-banner-type { display: inline-block; padding: 4px 15px; background: rgba(56, 189, 248, 0.2); border: 1px solid rgba(56, 189, 248, 0.5); color: #38bdf8; border-radius: 20px; font-size: 12px; font-weight: 900; letter-spacing: 2px; margin-bottom: 15px; box-shadow: 0 0 10px rgba(56, 189, 248, 0.2); }
                .imas-banner-title { font-size: 42px; font-weight: 900; line-height: 1.2; margin-bottom: 15px; text-shadow: 0 4px 15px rgba(0,0,0,0.8); }
                .imas-banner-desc { font-size: 14px; color: #cbd5e1; line-height: 1.6; text-shadow: 0 2px 5px rgba(0,0,0,0.8); background: rgba(0,0,0,0.4); padding: 15px; border-radius: 12px; backdrop-filter: blur(5px); border-left: 3px solid #38bdf8;}

                .imas-action-area { position: absolute; bottom: 0; left: 0; width: 100%; height: 120px; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px 30px; z-index: 10; }

                .imas-btn-detail { padding: 10px 20px; background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; cursor: pointer; transition: 0.2s; font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 8px; }
                .imas-btn-detail:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.4); }

                .imas-pull-group { display: flex; gap: 20px; }
                .imas-btn-pull { position: relative; width: 180px; height: 60px; border-radius: 30px; border: none; cursor: pointer; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,0,0,0.5); transition: 0.2s; }
                .imas-btn-pull:hover { transform: translateY(-3px) scale(1.02); }
                .imas-btn-pull:active { transform: translateY(1px) scale(0.98); }
                .imas-btn-pull.disabled { opacity: 0.5; pointer-events: none; filter: grayscale(1); }

                .imas-btn-pull::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); transform: skewX(-20deg); transition: 0s; }
                .imas-btn-pull:hover::before { animation: shine 0.8s; }
                @keyframes shine { 100% { left: 200%; } }

                .imas-btn-single { background: linear-gradient(135deg, #0ea5e9, #2563eb); border: 2px solid #7dd3fc; }
                .imas-btn-ten { background: linear-gradient(135deg, #d946ef, #9333ea); border: 2px solid #f9a8d4; box-shadow: 0 0 20px rgba(217, 70, 239, 0.4), 0 10px 20px rgba(0,0,0,0.5); }

                .imas-pull-text { font-size: 16px; font-weight: 900; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5); z-index: 2; }
                .imas-pull-cost { font-size: 12px; display: flex; align-items: center; gap: 4px; color: rgba(255,255,255,0.9); font-weight: bold; z-index: 2; margin-top: 2px; }
                .imas-pull-cost i { color: #38bdf8; }

                .imas-drawer { position: absolute; top: 0; right: -100%; width: 55%; max-width: 500px; height: 100%; background: rgba(15,23,42,0.95); backdrop-filter: blur(20px); box-shadow: -10px 0 30px rgba(0,0,0,0.5); z-index: 50; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; border-left: 1px solid rgba(255,255,255,0.1); }
                .imas-drawer.open { right: 0; }
                .imas-drawer-header { padding: 25px 30px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
                .imas-drawer-title { font-size: 18px; font-weight: 900; color: #fff; }
                .imas-btn-close { background: none; border: none; color: #94a3b8; font-size: 24px; cursor: pointer; transition: 0.2s; }
                .imas-btn-close:hover { color: #fff; transform: rotate(90deg); }

                .imas-drawer-content { flex: 1; overflow-y: auto; padding: 30px; }
                .imas-drawer-content::-webkit-scrollbar { width: 4px; }
                .imas-drawer-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }

                .imas-sec-title { font-size: 15px; font-weight: bold; color: #38bdf8; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px dashed rgba(56,189,248,0.3); }

                .imas-cate-title { font-size: 13px; font-weight: bold; color: #cbd5e1; margin: 15px 0 10px; padding: 5px 10px; background: rgba(255,255,255,0.05); border-radius: 6px; border-left: 3px solid #38bdf8;}

                .imas-item-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
                .imas-item-row { display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
                .imas-item-icon { width: 40px; height: 40px; border-radius: 6px; background: rgba(0,0,0,0.5); object-fit: contain; }
                .imas-item-info { flex: 1; }
                .imas-item-name { font-size: 13px; font-weight: bold; color: #fff; margin-bottom: 4px; }
                .imas-item-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; }

                .imas-idol-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 15px; margin-bottom: 30px; }
                .imas-idol-card { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 10px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
                .imas-idol-img { width: 60px; height: 60px; object-fit: cover; border-radius: 50%; margin-bottom: 8px; border: 2px solid #38bdf8; }
                .imas-idol-name { font-size: 11px; font-weight: bold; color: #e2e8f0; }

                .imas-anim-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: #000; z-index: 100; display: none; align-items: center; justify-content: center; overflow: hidden; }
                .imas-anim-overlay.active { display: flex; }

                .imas-star-center { width: 2px; height: 2px; background: #fff; border-radius: 50%; box-shadow: 0 0 50px 20px #38bdf8; position: relative; }
                .imas-star-center::before, .imas-star-center::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; }
                .imas-star-center::before { width: 200vw; height: 2px; box-shadow: 0 0 20px #38bdf8; animation: beamExpandX 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .imas-star-center::after { width: 2px; height: 200vh; box-shadow: 0 0 20px #38bdf8; animation: beamExpandY 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

                @keyframes beamExpandX { 0% { width: 0; opacity: 1; } 100% { width: 200vw; opacity: 0; } }
                @keyframes beamExpandY { 0% { height: 0; opacity: 1; } 100% { height: 200vh; opacity: 0; } }

                .imas-res-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(15,23,42,0.98); backdrop-filter: blur(10px); z-index: 110; display: none; flex-direction: column; opacity: 0; transition: 0.4s; }
                .imas-res-overlay.active { display: flex; opacity: 1; }

                .imas-res-header { text-align: center; padding: 40px 0 20px; flex-shrink: 0;}
                .imas-res-title { font-size: 24px; font-weight: 900; letter-spacing: 8px; color: #fff; text-shadow: 0 0 20px rgba(56,189,248,0.5); }

                .imas-res-grid { flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-content: flex-start; gap: 25px; padding: 20px 50px 50px; perspective: 1000px; overflow-y: auto;}

                .imas-res-card { width: 130px; height: 180px; background: linear-gradient(180deg, rgba(51,65,85,0.8), rgba(15,23,42,0.8)); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; align-items: center; padding: 15px 10px; position: relative; transform-style: preserve-3d; transform: rotateY(90deg); opacity: 0; }
                .imas-res-card.flip-in { animation: cardFlipIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes cardFlipIn { to { transform: rotateY(0deg); opacity: 1; } }

                .imas-res-card.is-idol { background: linear-gradient(180deg, rgba(251,191,36,0.2), rgba(180,83,9,0.8)); border-color: #fbbf24; box-shadow: 0 0 20px rgba(251,191,36,0.3); }
                .imas-res-card.is-dup { background: linear-gradient(180deg, rgba(56,189,248,0.2), rgba(30,58,138,0.8)); border-color: #38bdf8; box-shadow: 0 0 20px rgba(56,189,248,0.3); }

                .imas-res-tag { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; padding: 2px 10px; border-radius: 10px; color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5); white-space: nowrap; }
                .is-idol .imas-res-tag { background: linear-gradient(90deg, #f59e0b, #d97706); }
                .is-dup .imas-res-tag { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
                .imas-res-card:not(.is-idol):not(.is-dup) .imas-res-tag { background: #475569; }

                .imas-res-img-wrap { width: 70px; height: 70px; margin-top: 10px; margin-bottom: 15px; border-radius: 8px; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; position: relative; }
                .imas-res-img-wrap img { width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }
                .imas-res-img-wrap i { font-size: 30px; color: #38bdf8; }

                .imas-res-name { font-size: 12px; font-weight: bold; text-align: center; color: #fff; text-shadow: 0 1px 3px #000; width: 100%; }

                .imas-res-card.is-dup .mark-front, .imas-res-card.is-dup .mark-back { position: absolute; top:0; left:0; width:100%; height:100%; backface-visibility: hidden; transition: transform 0.6s; border-radius: 8px; }
                .imas-res-card.is-dup .mark-front { transform: rotateY(0deg); }
                .imas-res-card.is-dup .mark-back { transform: rotateY(180deg); background: rgba(255,255,255,0.9); padding: 5px; }
                .imas-res-card.do-transform .mark-front { transform: rotateY(-180deg) !important; }
                .imas-res-card.do-transform .mark-back { transform: rotateY(0deg) !important; }

                .imas-res-footer { padding: 30px; display: flex; justify-content: center; align-items: center; gap: 20px; flex-shrink: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); }
                .imas-btn-close-res { padding: 12px 30px; background: #334155; border: 1px solid #475569; border-radius: 30px; color: #f8fafc; font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.2s; min-width: 120px; }
                .imas-btn-close-res:hover { background: #475569; }
                .imas-btn-again { padding: 12px 30px; background: linear-gradient(90deg, #a855f7, #9333ea); border: none; border-radius: 30px; color: #fff; font-size: 14px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4); min-width: 180px; justify-content: center;}
                .imas-btn-again:hover { filter: brightness(1.1); box-shadow: 0 6px 20px rgba(168, 85, 247, 0.6); }
            `;
            topDoc.head.appendChild(styleGacha);
        }

        const html = `
            <div class="imas-container">
                <div class="imas-topbar">
                    <div class="imas-currency">
                        <i class="bi bi-stars"></i>
                        <span id="imas-stardust-val">${topWin.playerCurrency.stardust}</span>
                    </div>
                </div>

                <div class="imas-main">
                    <div class="imas-pool-list">
                        <div class="imas-pool-tab active" data-target="standard">
                            <div class="imas-pool-name">常驻星探发掘</div>
                        </div>
                        <div class="imas-pool-tab" data-target="limited">
                            <div class="imas-pool-name">【限定】星光坠落之夜</div>
                        </div>
                    </div>

                    <div class="imas-content">
                        <img src="${pools[currentPoolId].bg}" class="imas-banner-bg" id="imas-banner-bg">
                        <div class="imas-gradient-mask"></div>
                        <img src="${pools[currentPoolId].charImg}" class="imas-banner-char" id="imas-banner-char" style="display:${pools[currentPoolId].charImg?'block':'none'};">

                        <div class="imas-banner-info">
                            <div class="imas-banner-type" id="imas-banner-type">${pools[currentPoolId].typeLabel}</div>
                            <div class="imas-banner-title" id="imas-banner-title">${pools[currentPoolId].name}</div>
                            <div class="imas-banner-desc" id="imas-banner-desc">${pools[currentPoolId].desc}</div>
                        </div>

                        <div class="imas-action-area">
                            <button class="imas-btn-detail" id="btn-imas-detail"><i class="bi bi-info-circle"></i> 卡池详情</button>
                            <div class="imas-pull-group">
                                <button class="imas-btn-pull imas-btn-single" id="btn-imas-single">
                                    <span class="imas-pull-text">单次发掘</span>
                                    <div class="imas-pull-cost"><i class="bi bi-stars"></i> 1000</div>
                                </button>
                                <button class="imas-btn-pull imas-btn-ten" id="btn-imas-ten">
                                    <span class="imas-pull-text">十连发掘</span>
                                    <div class="imas-pull-cost"><i class="bi bi-stars"></i> 10000</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="imas-drawer" id="imas-drawer">
                    <div class="imas-drawer-header">
                        <div class="imas-drawer-title">卡池情报公示</div>
                        <button class="imas-btn-close" id="btn-imas-close-drawer"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="imas-drawer-content" id="imas-drawer-content"></div>
                </div>

                <div class="imas-anim-overlay" id="imas-anim-overlay">
                    <div class="imas-star-center"></div>
                </div>

                <div class="imas-res-overlay" id="imas-res-overlay">
                    <div class="imas-res-header"><div class="imas-res-title">SCOUT RESULT</div></div>
                    <div class="imas-res-grid" id="imas-res-grid"></div>
                    <div class="imas-res-footer">
                        <button class="imas-btn-close-res" id="btn-res-close">确认返回</button>
                        <button class="imas-btn-again" id="btn-res-again"><i class="bi bi-arrow-repeat"></i> 再次发掘 (10000 <i class="bi bi-stars" style="font-size:12px;"></i>)</button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        const uiStardust = container.querySelector('#imas-stardust-val');
        const uiBannerBg = container.querySelector('#imas-banner-bg');
        const uiBannerChar = container.querySelector('#imas-banner-char');
        const uiBannerType = container.querySelector('#imas-banner-type');
        const uiBannerTitle = container.querySelector('#imas-banner-title');
        const uiBannerDesc = container.querySelector('#imas-banner-desc');
        const btnSingle = container.querySelector('#btn-imas-single');
        const btnTen = container.querySelector('#btn-imas-ten');

        const drawer = container.querySelector('#imas-drawer');
        const drawerContent = container.querySelector('#imas-drawer-content');

        const animOverlay = container.querySelector('#imas-anim-overlay');
        const resultOverlay = container.querySelector('#imas-res-overlay');
        const resGrid = container.querySelector('#imas-res-grid');
        let currentPullCount = 10;

        function updateCurrencyUI() {
            uiStardust.innerText = topWin.playerCurrency.stardust;
            if (topWin.playerCurrency.stardust < 1000) btnSingle.classList.add('disabled'); else btnSingle.classList.remove('disabled');
            if (topWin.playerCurrency.stardust < 10000) btnTen.classList.add('disabled'); else btnTen.classList.remove('disabled');
        }

        container.querySelectorAll('.imas-pool-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.imas-pool-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentPoolId = tab.getAttribute('data-target');
                const p = pools[currentPoolId];

                uiBannerBg.style.opacity = 0;
                uiBannerChar.style.opacity = 0;
                setTimeout(() => {
                    uiBannerBg.src = p.bg;
                    if(p.charImg) { uiBannerChar.src = p.charImg; uiBannerChar.style.display = 'block'; }
                    else { uiBannerChar.style.display = 'none'; }
                    uiBannerType.innerText = p.typeLabel;
                    uiBannerTitle.innerText = p.name;
                    uiBannerDesc.innerText = p.desc;

                    uiBannerBg.style.opacity = 0.6;
                    uiBannerChar.style.opacity = 1;
                }, 200);
            });
        });

        function renderDetailDrawer() {
            const p = pools[currentPoolId];
            const iRate = p.idolRate * 100;
            const resRate = 1 - p.idolRate;
            const starRate = (resRate * 0.45) * 100;
            const itemRate = (resRate * 0.55) * 100;

            let dHtml = `
                <div class="imas-sec-title">综合概率公示</div>
                <div style="margin-bottom:30px; font-size:13px; color:#cbd5e1; line-height:1.8; background:rgba(255,255,255,0.05); padding:15px; border-radius:8px;">
                    <span style="color:#f59e0b; font-weight:bold;">✦ 偶像发掘率：${iRate.toFixed(1)}%</span><br>
                    📦 资源道具：${itemRate.toFixed(1)}%<br>
                    ✨ 星尘返还：${starRate.toFixed(1)}%
                </div>

                <div class="imas-sec-title">可发掘偶像列表</div>
                <div class="imas-idol-grid">
            `;

            if (topWin.idolDatabase && topWin.idolDatabase.length > 0) {
                topWin.idolDatabase.forEach(idol => {
                    dHtml += `<div class="imas-idol-card"><img src="${idol.image}" class="imas-idol-img"><div class="imas-idol-name">${idol.name}</div></div>`;
                });
            } else { dHtml += `<div style="grid-column:1/-1; color:#64748b;">暂无数据</div>`; }
            dHtml += `</div>`;

            dHtml += `<div class="imas-sec-title">包含资源与道具详情</div>`;

            dHtml += `
                <div class="imas-cate-title">💎 核心货币与信物</div>
                <div class="imas-item-list">
                    <div class="imas-item-row" style="border-color: rgba(56, 189, 248, 0.3);">
                        <img src="https://i.postimg.cc/JhBnDD5Y/xing-chen-png-xiao.png" class="imas-item-icon">
                        <div class="imas-item-info">
                            <div class="imas-item-name" style="color: #38bdf8;">星尘返还</div>
                            <div class="imas-item-desc">随机获得 100~5000 不等的星尘，可用于再次发掘。</div>
                        </div>
                    </div>
                    <div class="imas-item-row" style="border-color: rgba(219, 39, 119, 0.3);">
                        <img src="https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png" class="imas-item-icon">
                        <div class="imas-item-info">
                            <div class="imas-item-name" style="color: #f472b6;">偶像印记</div>
                            <div class="imas-item-desc">发掘到已拥有的偶像时自动转化。用于突破潜力上限。</div>
                        </div>
                    </div>
                </div>
            `;

            if (actualItemPool && actualItemPool.length > 0) {
                const businessItems = actualItemPool.filter(i => i.type === 'business');
                if(businessItems.length > 0) {
                    dHtml += `<div class="imas-cate-title">📊 业务能力提升</div><div class="imas-item-list">`;
                    businessItems.forEach(item => {
                        dHtml += `
                            <div class="imas-item-row">
                                <img src="${item.img}" class="imas-item-icon">
                                <div class="imas-item-info">
                                    <div class="imas-item-name">${item.name}</div>
                                    <div class="imas-item-desc">${item.desc}</div>
                                </div>
                            </div>`;
                    });
                    dHtml += `</div>`;
                }

                const psychItems = actualItemPool.filter(i => i.type === 'psychology');
                if(psychItems.length > 0) {
                    dHtml += `<div class="imas-cate-title">❤️ 心理与状态干预</div><div class="imas-item-list">`;
                    psychItems.forEach(item => {
                        dHtml += `
                            <div class="imas-item-row">
                                <img src="${item.img}" class="imas-item-icon">
                                <div class="imas-item-info">
                                    <div class="imas-item-name">${item.name}</div>
                                    <div class="imas-item-desc">${item.desc}</div>
                                </div>
                            </div>`;
                    });
                    dHtml += `</div>`;
                }

                const eggItems = actualItemPool.filter(i => i.type === 'easter_egg');
                if(eggItems.length > 0) {
                    dHtml += `<div class="imas-cate-title">🎁 特殊彩蛋与剧情</div><div class="imas-item-list">`;
                    eggItems.forEach(item => {
                        dHtml += `
                            <div class="imas-item-row">
                                <img src="${item.img}" class="imas-item-icon">
                                <div class="imas-item-info">
                                    <div class="imas-item-name">${item.name}</div>
                                    <div class="imas-item-desc">${item.desc}</div>
                                </div>
                            </div>`;
                    });
                    dHtml += `</div>`;
                }
            }

            drawerContent.innerHTML = dHtml;
        }

        container.querySelector('#btn-imas-detail').addEventListener('click', () => { renderDetailDrawer(); drawer.classList.add('open'); });
        container.querySelector('#btn-imas-close-drawer').addEventListener('click', () => { drawer.classList.remove('open'); });

        function executePull(times) {
            const cost = times * 1000;
            if (topWin.playerCurrency.stardust < cost) return;

            currentPullCount = times;
            topWin.playerCurrency.stardust -= cost;
            updateCurrencyUI();

            const p = pools[currentPoolId];
            const results = [];
            let seenIdols = new Set();
            const db = topWin.idolDatabase || [];
            const currentTotalItemWeight = actualItemPool.length > 0 ? actualItemPool.reduce((sum, item) => sum + item.weight, 0) : 1;

            for(let i=0; i<times; i++) {
                let roll = Math.random();
                if (roll <= p.idolRate && db.length > 0) {
                    let rIdol = db[Math.floor(Math.random() * db.length)];
                    let isDup = Math.random() < 0.3 || seenIdols.has(rIdol.name);
                    if (isDup) { results.push({ type: 'duplicate', name: rIdol.name, img: rIdol.image }); }
                    else { seenIdols.add(rIdol.name); results.push({ type: 'idol', name: rIdol.name, img: rIdol.image }); }
                } else {
                    let itemRoll = Math.random();
                    if (itemRoll <= 0.45 || actualItemPool.length === 0) {
                        let sRoll = Math.random() * 100;
                        let amt = 100;
                        if(sRoll<=1) amt=5000; else if(sRoll<=6) amt=1000; else if(sRoll<=20) amt=500; else if(sRoll<=50) amt=300;
                        results.push({ type: 'stardust', amount: amt });
                        topWin.playerCurrency.stardust += amt;
                    } else {
                        let weightRoll = Math.random() * currentTotalItemWeight;
                        let selectedItem = actualItemPool[0];
                        for(let item of actualItemPool) {
                            if(weightRoll < item.weight) { selectedItem = item; break; }
                            weightRoll -= item.weight;
                        }
                        results.push({ type: 'item', data: selectedItem });
                    }
                }
            }

            showPullAnimation(results);
        }

        function showPullAnimation(results) {
            resultOverlay.classList.remove('active');
            resGrid.innerHTML = '';
            animOverlay.classList.add('active');

            const star = animOverlay.querySelector('.imas-star-center');
            star.style.animation = 'none';
            void star.offsetWidth;
            star.style.animation = null;

            setTimeout(() => {
                animOverlay.classList.remove('active');
                renderResults(results);
            }, 1200);
        }

        function renderResults(results) {
            resGrid.innerHTML = '';
            results.forEach((res, idx) => {
                let delay = idx * 0.1;
                let cHtml = '';

                if (res.type === 'idol') {
                    cHtml = `
                        <div class="imas-res-card is-idol flip-in" style="animation-delay:${delay}s">
                            <div class="imas-res-tag">NEW IDOL</div>
                            <div class="imas-res-img-wrap" style="background:transparent;"><img src="${res.img}"></div>
                            <div class="imas-res-name">${res.name}</div>
                        </div>
                    `;
                } else if (res.type === 'duplicate') {
                    cHtml = `
                        <div class="imas-res-card is-dup flip-in" style="animation-delay:${delay}s">
                            <div class="imas-res-tag">印记转化</div>
                            <div class="imas-res-img-wrap">
                                <img src="${res.img}" class="mark-front">
                                <img src="https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png" class="mark-back">
                            </div>
                            <div class="imas-res-name dup-name" data-name="${res.name}">${res.name}</div>
                        </div>
                    `;
                } else if (res.type === 'stardust') {
                    cHtml = `
                        <div class="imas-res-card type-currency flip-in" style="animation-delay:${delay}s">
                            <div class="imas-res-tag">资源返还</div>
                            <div class="imas-res-img-wrap" style="background:transparent;"><img src="https://i.postimg.cc/JhBnDD5Y/xing-chen-png-xiao.png"></div>
                            <div class="imas-res-name">星尘 ×${res.amount}</div>
                        </div>
                    `;
                } else {
                    cHtml = `
                        <div class="imas-res-card type-item flip-in" style="animation-delay:${delay}s">
                            <div class="imas-res-tag">获得道具</div>
                            <div class="imas-res-img-wrap" style="background:transparent;"><img src="${res.data.img}"></div>
                            <div class="imas-res-name">${res.data.name}</div>
                        </div>
                    `;
                }
                resGrid.insertAdjacentHTML('beforeend', cHtml);
            });

            const btnAgain = container.querySelector('#btn-res-again');
            btnAgain.innerHTML = `<i class="bi bi-arrow-repeat"></i> 再次发掘 (${currentPullCount * 1000} <i class="bi bi-stars" style="font-size:12px;"></i>)`;

            updateCurrencyUI();
            resultOverlay.classList.add('active');

            setTimeout(() => {
                const dupCards = resGrid.querySelectorAll('.is-dup');
                dupCards.forEach(el => {
                    el.classList.add('do-transform');
                    const nameEl = el.querySelector('.dup-name');
                    nameEl.innerText = nameEl.getAttribute('data-name') + '·印记';
                    nameEl.style.color = '#fbcfe8';
                });
            }, 1000 + (results.length * 100));
        }

        btnSingle.addEventListener('click', () => executePull(1));
        btnTen.addEventListener('click', () => executePull(10));

        container.querySelector('#btn-res-close').addEventListener('click', () => {
            resultOverlay.classList.remove('active');
            setTimeout(() => { resGrid.innerHTML = ''; }, 400);
        });

        container.querySelector('#btn-res-again').addEventListener('click', () => {
            resultOverlay.classList.remove('active');
            setTimeout(() => executePull(currentPullCount), 400);
        });

        updateCurrencyUI();
    };
})();
