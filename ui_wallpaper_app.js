// ==========================================
// 秋青子专属终端：主题壁纸 App (ui_wallpaper_app.js)
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

    // 预设数据配置
    const WALLPAPERS = [
        { id: 'wp1', name: "默认星空", url: "https://i.postimg.cc/L880mFSr/xing-kong.png" },
        { id: 'wp2', name: "纯净粉樱", url: "这里填入你的图床链接1" },
        { id: 'wp3', name: "深邃海洋", url: "这里填入你的图床链接2" },
        { id: 'wp4', name: "极简白昼", url: "这里填入你的图床链接3" },
        { id: 'wp5', name: "赛博霓虹", url: "这里填入你的图床链接4" }
    ];

    const THEMES = [
        { id: 'th_pink', name: "青子粉", primary: "#db2777", bg: "linear-gradient(135deg, #f1f5f9, #e2e8f0)", text: "#1e293b" },
        { id: 'th_dark', name: "暗夜黑", primary: "#3b82f6", bg: "linear-gradient(135deg, #0f172a, #1e293b)", text: "#f8fafc" },
        { id: 'th_mint', name: "薄荷绿", primary: "#10b981", bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)", text: "#064e3b" },
        { id: 'th_gold', name: "奢华金", primary: "#f59e0b", bg: "linear-gradient(135deg, #fef3c7, #fde68a)", text: "#78350f" }
    ];

    const FONTS = [
        { id: 'ft_default', name: "系统默认", value: "system-ui, -apple-system, sans-serif" },
        { id: 'ft_serif', name: "优雅明朝", value: "'Noto Serif SC', 'Songti SC', serif" },
        { id: 'ft_round', name: "可爱圆体", value: "'TsukuBRdGothic-Regular', 'Yuanti SC', sans-serif" }
    ];

    // 注入应用内样式
    const styleId = 'qingzi-wallpaper-style';
    if (!topDoc.getElementById(styleId)) {
        const style = topDoc.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .wp-app-container { padding: 20px; display: flex; flex-direction: column; gap: 30px; height: 100%; overflow-y: auto; background: transparent; }
            .wp-section-title { font-size: 16px; font-weight: bold; color: var(--pad-text, #1e293b); margin-bottom: 15px; border-left: 4px solid var(--pad-primary, #db2777); padding-left: 10px; }

            /* 壁纸网格 */
            .wp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px; }
            .wp-item { position: relative; border-radius: 12px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); height: 160px; }
            .wp-item:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(0,0,0,0.2); }
            .wp-item.active { border-color: var(--pad-primary, #db2777); transform: scale(1.02); }
            .wp-img { width: 100%; height: 100%; object-fit: cover; }
            .wp-name { position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.6); color: #fff; font-size: 12px; padding: 6px; text-align: center; backdrop-filter: blur(4px); }

            /* 主题颜色块 */
            .th-grid { display: flex; gap: 15px; flex-wrap: wrap; }
            .th-item { width: 60px; height: 60px; border-radius: 50%; cursor: pointer; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: 0.2s; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; }
            .th-item:hover { transform: scale(1.1); }
            .th-item.active { border-color: var(--pad-primary, #db2777); outline: 2px solid var(--pad-primary, #db2777); outline-offset: 2px; }

            /* 字体列表 */
            .ft-list { display: flex; flex-direction: column; gap: 10px; }
            .ft-item { padding: 15px; background: rgba(0,0,0,0.03); border-radius: 12px; cursor: pointer; border: 1px solid rgba(0,0,0,0.05); transition: 0.2s; display: flex; justify-content: space-between; align-items: center; }
            .ft-item:hover { background: rgba(0,0,0,0.05); transform: translateX(5px); }
            .ft-item.active { background: rgba(var(--pad-primary-rgb, 219,39,119), 0.1); border-color: var(--pad-primary, #db2777); color: var(--pad-primary, #db2777); font-weight: bold; }
        `;
        topDoc.head.appendChild(style);
    }

    topWin.renderWallpaperApp = function(container) {
        if (!container) return;

        // 生成HTML结构
        let html = `<div class="wp-app-container">`;

        // 1. 壁纸区
        html += `<div class="wp-section"><div class="wp-section-title">桌面壁纸</div><div class="wp-grid">`;
        WALLPAPERS.forEach(wp => {
            html += `<div class="wp-item" data-type="wallpaper" data-url="${wp.url}">
                        <img class="wp-img" src="${wp.url}" alt="${wp.name}">
                        <div class="wp-name">${wp.name}</div>
                     </div>`;
        });
        html += `</div></div>`;

        // 2. 主题区
        html += `<div class="wp-section"><div class="wp-section-title">UI 主题</div><div class="th-grid">`;
        THEMES.forEach(th => {
            html += `<div class="th-item" data-type="theme" data-id="${th.id}" style="background: ${th.primary};" title="${th.name}"></div>`;
        });
        html += `</div></div>`;

        // 3. 字体区
        html += `<div class="wp-section"><div class="wp-section-title">系统字体</div><div class="ft-list">`;
        FONTS.forEach(ft => {
            html += `<div class="ft-item" data-type="font" data-value="${ft.value}" style="font-family: ${ft.value};">
                        <span>${ft.name}</span>
                        <span style="font-size: 12px; opacity: 0.6;">Aあ</span>
                     </div>`;
        });
        html += `</div></div>`;

        html += `</div>`;
        container.innerHTML = html;

        // 绑定事件
        const appContainer = container.querySelector('.wp-app-container');
        appContainer.addEventListener('click', function(e) {
            // 点击壁纸
            const wpItem = e.target.closest('.wp-item');
            if (wpItem) {
                appContainer.querySelectorAll('.wp-item').forEach(el => el.classList.remove('active'));
                wpItem.classList.add('active');
                const url = wpItem.getAttribute('data-url');
                const padBg = topDoc.querySelector('.pad-wallpaper');
                if (padBg) padBg.style.backgroundImage = `url('${url}')`;
                return;
            }

            // 点击主题
            const thItem = e.target.closest('.th-item');
            if (thItem) {
                appContainer.querySelectorAll('.th-item').forEach(el => el.classList.remove('active'));
                thItem.classList.add('active');
                const id = thItem.getAttribute('data-id');
                const theme = THEMES.find(t => t.id === id);
                if (theme) {
                    const padWrapper = topDoc.getElementById('qingzi-pad-wrapper');
                    if (padWrapper) {
                        // 利用 CSS 变量改变全局颜色
                        padWrapper.style.setProperty('--pad-primary', theme.primary);
                        padWrapper.style.setProperty('--pad-text', theme.text);
                        padWrapper.style.background = theme.bg;

                        // 为了兼容你之前写的固定颜色按钮，强制覆盖一些关键元素的颜色
                        const backBtns = topDoc.querySelectorAll('.btn-pad-back');
                        backBtns.forEach(btn => btn.style.color = theme.primary);

                        const dragBall = topDoc.getElementById('qingzi-drag-ball');
                        if (dragBall) {
                            dragBall.style.borderColor = theme.primary;
                            dragBall.style.color = theme.primary;
                            dragBall.style.boxShadow = `0 4px 15px rgba(0,0,0,0.15), inset 0 0 10px ${theme.primary}20`;
                        }
                    }
                }
                return;
            }

            // 点击字体
            const ftItem = e.target.closest('.ft-item');
            if (ftItem) {
                appContainer.querySelectorAll('.ft-item').forEach(el => el.classList.remove('active'));
                ftItem.classList.add('active');
                const fontValue = ftItem.getAttribute('data-value');
                const padWrapper = topDoc.getElementById('qingzi-pad-wrapper');
                if (padWrapper) {
                    padWrapper.style.fontFamily = fontValue;
                }
                return;
            }
        });
    };
})();
