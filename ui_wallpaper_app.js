// ==========================================
// 秋青子专属终端：主题壁纸 App (ui_wallpaper_app.js) - 终极清晰修复版
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

    // 预设数据配置 (哥哥在这里填图床链接，并标注mode是'light'还是'dark')
    const WALLPAPERS = [
        { id: 'wp1', name: "星空", url: "https://i.postimg.cc/L880mFSr/xing-kong.png", mode: "dark" },
        { id: 'wp2', name: "踏切时光", url: "https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg", mode: "light" },
        { id: 'wp3', name: "深邃黑夜", url: "这里填入你的图床链接2", mode: "dark" },
        { id: 'wp4', name: "极简白昼", url: "这里填入你的图床链接3", mode: "light" },
        { id: 'wp5', name: "赛博霓虹", url: "这里填入你的图床链接4", mode: "dark" }
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

    // ==========================================
    // 强制撕除模糊白膜的魔法！
    // ==========================================
    const fixBgInterval = setInterval(() => {
        let padBg = topDoc.querySelector('.pad-wallpaper');
        if (padBg) {
            // 直接用行内样式强行覆盖原版的模糊和低透明度！
            padBg.style.opacity = '1';
            padBg.style.filter = 'none';
            clearInterval(fixBgInterval);
        }
    }, 100);

    // 注入应用内样式与自适应修复样式
    const styleId = 'qingzi-wallpaper-style';
    if (!topDoc.getElementById(styleId)) {
        const style = topDoc.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* App内部需要有个半透明或纯色底板，防止壁纸干扰阅读 */
            .pad-app-window { background: var(--pad-bg, #ffffff) !important; color: var(--pad-text, #1e293b); }
            .pad-app-header { background: rgba(var(--pad-header-bg-rgb, 248, 250, 252), 0.85) !important; backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.1); }
            .pad-app-title { color: var(--pad-text, #1e293b) !important; }
            .pad-app-content-area { background: transparent !important; }

            /* ===== UI 深色/浅色自适应模式 ===== */
            /* 浅色壁纸模式（默认） */
            .pad-status-bar { color: #334155; text-shadow: 0 0 5px rgba(255,255,255,0.8); }
            .pad-app-icon span { color: #1e293b; text-shadow: 0 1px 3px rgba(255,255,255,0.8), 0 0 5px rgba(255,255,255,0.5); }

            /* 深色壁纸模式 */
            #qingzi-pad-wrapper.wp-mode-dark .pad-status-bar { color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
            #qingzi-pad-wrapper.wp-mode-dark .pad-app-icon span { color: #ffffff; text-shadow: 0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6); }

            /* 壁纸App内部样式 */
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
            .ft-item { padding: 15px; background: rgba(0,0,0,0.03); border-radius: 12px; cursor: pointer; border: 1px solid rgba(0,0,0,0.05); transition: 0.2s; display: flex; justify-content: space-between; align-items: center; color: var(--pad-text, #1e293b);}
            .ft-item:hover { background: rgba(0,0,0,0.05); transform: translateX(5px); }
            .ft-item.active { background: rgba(var(--pad-primary-rgb, 219,39,119), 0.1); border-color: var(--pad-primary, #db2777); color: var(--pad-primary, #db2777); font-weight: bold; }
        `;
        topDoc.head.appendChild(style);
    }

    topWin.renderWallpaperApp = function(container) {
        if (!container) return;

        let html = `<div class="wp-app-container">`;

        // 1. 壁纸区
        html += `<div class="wp-section"><div class="wp-section-title">桌面壁纸</div><div class="wp-grid">`;
        WALLPAPERS.forEach(wp => {
            html += `<div class="wp-item" data-type="wallpaper" data-url="${wp.url}" data-mode="${wp.mode}">
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

        const appContainer = container.querySelector('.wp-app-container');
        appContainer.addEventListener('click', function(e) {
            // 点击壁纸
            const wpItem = e.target.closest('.wp-item');
            if (wpItem) {
                appContainer.querySelectorAll('.wp-item').forEach(el => el.classList.remove('active'));
                wpItem.classList.add('active');
                const url = wpItem.getAttribute('data-url');
                const mode = wpItem.getAttribute('data-mode');

                const padBg = topDoc.querySelector('.pad-wallpaper');
                const padWrapper = topDoc.getElementById('qingzi-pad-wrapper');

                if (padBg) {
                    padBg.style.backgroundImage = `url('${url}')`;
                    // 再次确保切换时样式是干净的！
                    padBg.style.opacity = '1';
                    padBg.style.filter = 'none';
                }

                if (padWrapper) {
                    if (mode === 'dark') {
                        padWrapper.classList.add('wp-mode-dark');
                    } else {
                        padWrapper.classList.remove('wp-mode-dark');
                    }
                }
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
                        padWrapper.style.setProperty('--pad-primary', theme.primary);
                        padWrapper.style.setProperty('--pad-text', theme.text);
                        padWrapper.style.setProperty('--pad-bg', theme.id === 'th_dark' ? '#0f172a' : '#ffffff');

                        const hexToRgb = (hex) => {
                            let r = parseInt(hex.slice(1, 3), 16);
                            let g = parseInt(hex.slice(3, 5), 16);
                            let b = parseInt(hex.slice(5, 7), 16);
                            return `${r}, ${g}, ${b}`;
                        };
                        padWrapper.style.setProperty('--pad-primary-rgb', hexToRgb(theme.primary));
                        padWrapper.style.setProperty('--pad-header-bg-rgb', theme.id === 'th_dark' ? '30, 41, 59' : '248, 250, 252');

                        const backBtns = topDoc.querySelectorAll('.btn-pad-back');
                        backBtns.forEach(btn => {
                            btn.style.color = theme.primary;
                            btn.style.background = theme.id === 'th_dark' ? '#334155' : '#f1f5f9';
                        });

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
