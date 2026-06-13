// ==========================================
// 秋青子专属终端：秘密相册 App (ui_gallery_app.js)
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

    // 哥哥可以在这里填入每位偶像的具体图片链接
    // isUnlocked: true 表示已解锁，false 表示未解锁（显示黑影和锁）
    const GALLERY_DATA = [
        {
            id: 'kaai', name: '浅宫加爱', avatar: 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png',
            sfw: [
                { id: 'k_s1', url: '这里填加爱SFW图1', isUnlocked: true },
                { id: 'k_s2', url: '这里填加爱SFW图2', isUnlocked: false }
            ],
            nsfw: [
                { id: 'k_n1', url: '这里填加爱NSFW图1', isUnlocked: false }
            ]
        },
        {
            id: 'nozomi', name: '芦田希未', avatar: 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png',
            sfw: [
                { id: 'n_s1', url: '这里填希未SFW图1', isUnlocked: true }
            ],
            nsfw: [
                { id: 'n_n1', url: '这里填希未NSFW图1', isUnlocked: false },
                { id: 'n_n2', url: '这里填希未NSFW图2', isUnlocked: false }
            ]
        },
        // 哥哥可以继续往下补充 志穂、春子、姬乃、虹花 的数据...
    ];

    // 计算称号的函数
    function getTitle(unlockedCount, totalCount) {
        if (totalCount === 0) return "暂无档案";
        const ratio = unlockedCount / totalCount;
        if (ratio === 0) return "路人星探";
        if (ratio < 0.5) return "见习制作人";
        if (ratio < 1) return "专属制作人";
        return "绝对支配者";
    }

    // 注入应用内样式
    const styleId = 'qingzi-gallery-style';
    if (!topDoc.getElementById(styleId)) {
        const style = topDoc.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .gal-app-container { width: 100%; height: 100%; display: flex; flex-direction: column; background: var(--pad-bg, #f8fafc); position: relative; overflow: hidden; }

            /* 主页：偶像列表 */
            .gal-home { flex: 1; padding: 25px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; align-content: start; }
            .gal-idol-card { background: #fff; border-radius: 16px; padding: 15px; display: flex; flex-direction: column; align-items: center; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: 0.2s; border: 1px solid rgba(0,0,0,0.05); }
            .gal-idol-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); border-color: var(--pad-primary, #db2777); }
            .gal-idol-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; border: 2px solid #e2e8f0; }
            .gal-idol-name { font-size: 15px; font-weight: bold; color: var(--pad-text, #1e293b); margin-bottom: 5px; }
            .gal-idol-title { font-size: 12px; font-weight: bold; color: var(--pad-primary, #db2777); background: rgba(var(--pad-primary-rgb, 219,39,119), 0.1); padding: 3px 8px; border-radius: 10px; margin-bottom: 10px; }
            .gal-progress-bar { width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin-bottom: 5px; }
            .gal-progress-fill { height: 100%; background: var(--pad-primary, #db2777); transition: width 0.3s; }
            .gal-progress-text { font-size: 11px; color: #64748b; }

            /* 详情页 */
            .gal-detail { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--pad-bg, #f8fafc); z-index: 10; display: flex; flex-direction: column; transform: translateX(100%); transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            .gal-detail.active { transform: translateX(0); }

            .gal-detail-header { display: flex; align-items: center; padding: 15px 20px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); gap: 15px; }
            .gal-back-btn { width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; border: none; color: var(--pad-primary, #db2777); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            .gal-detail-title { font-size: 18px; font-weight: bold; color: var(--pad-text, #1e293b); flex: 1; }

            .gal-tabs { display: flex; padding: 15px 20px 0; gap: 20px; border-bottom: 1px solid rgba(0,0,0,0.05); }
            .gal-tab { padding: 8px 15px; font-size: 14px; font-weight: bold; color: #64748b; cursor: pointer; border-bottom: 3px solid transparent; transition: 0.2s; }
            .gal-tab.active { color: var(--pad-primary, #db2777); border-bottom-color: var(--pad-primary, #db2777); }

            .gal-photo-grid { flex: 1; padding: 20px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; align-content: start; }
            .gal-photo-item { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: #e2e8f0; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .gal-photo-img { width: 100%; height: 100%; object-fit: cover; transition: 0.3s; }

            /* 未解锁状态 */
            .gal-photo-item.locked .gal-photo-img { filter: brightness(0) blur(4px); opacity: 0.3; }
            .gal-locked-mask { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(30, 41, 59, 0.4); color: #fff; opacity: 0; transition: 0.2s; }
            .gal-photo-item.locked .gal-locked-mask { opacity: 1; }
            .gal-locked-icon { font-size: 24px; margin-bottom: 5px; }
            .gal-locked-text { font-size: 12px; font-weight: bold; }

            /* 全屏大图查看器 */
            .gal-viewer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 100; display: none; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
            .gal-viewer.active { display: flex; opacity: 1; }
            .gal-viewer-img { max-width: 90%; max-height: 80%; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .gal-viewer-close { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.2); color: #fff; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; }

            #qingzi-pad-wrapper.wp-mode-dark .gal-idol-card { background: #1e293b; border-color: #334155; }
            #qingzi-pad-wrapper.wp-mode-dark .gal-detail-header { background: rgba(15,23,42,0.9); }
        `;
        topDoc.head.appendChild(style);
    }

    topWin.renderGalleryApp = function(container) {
        if (!container) return;

        let html = `
            <div class="gal-app-container">
                <!-- 主页：偶像列表 -->
                <div class="gal-home" id="gal-home-list"></div>

                <!-- 详情页 -->
                <div class="gal-detail" id="gal-detail-page">
                    <div class="gal-detail-header">
                        <button class="gal-back-btn" id="gal-btn-back"><i class="bi bi-arrow-left"></i></button>
                        <div class="gal-detail-title" id="gal-detail-name">偶像名字</div>
                    </div>
                    <div class="gal-tabs">
                        <div class="gal-tab active" data-tab="sfw">日常工作 (SFW)</div>
                        <div class="gal-tab" data-tab="nsfw">秘密档案 (NSFW)</div>
                    </div>
                    <div class="gal-photo-grid" id="gal-photo-grid"></div>
                </div>

                <!-- 大图查看器 -->
                <div class="gal-viewer" id="gal-viewer">
                    <button class="gal-viewer-close" id="gal-viewer-close"><i class="bi bi-x-lg"></i></button>
                    <img class="gal-viewer-img" id="gal-viewer-img" src="" alt="大图">
                </div>
            </div>
        `;
        container.innerHTML = html;

        const homeList = container.querySelector('#gal-home-list');
        const detailPage = container.querySelector('#gal-detail-page');
        const photoGrid = container.querySelector('#gal-photo-grid');
        let currentIdol = null;
        let currentTab = 'sfw';

        // 渲染主页列表
        function renderHome() {
            let listHtml = '';
            GALLERY_DATA.forEach(idol => {
                let unlocked = 0;
                let total = idol.sfw.length + idol.nsfw.length;
                idol.sfw.forEach(p => { if(p.isUnlocked) unlocked++; });
                idol.nsfw.forEach(p => { if(p.isUnlocked) unlocked++; });

                let percent = total === 0 ? 0 : Math.round((unlocked / total) * 100);
                let title = getTitle(unlocked, total);

                listHtml += `
                    <div class="gal-idol-card" data-id="${idol.id}">
                        <img class="gal-idol-avatar" src="${idol.avatar}">
                        <div class="gal-idol-name">${idol.name}</div>
                        <div class="gal-idol-title">${title}</div>
                        <div class="gal-progress-bar"><div class="gal-progress-fill" style="width: ${percent}%;"></div></div>
                        <div class="gal-progress-text">解锁进度: ${unlocked}/${total} (${percent}%)</div>
                    </div>
                `;
            });
            homeList.innerHTML = listHtml;
        }

        // 渲染相册网格
        function renderPhotos() {
            if (!currentIdol) return;
            const photos = currentTab === 'sfw' ? currentIdol.sfw : currentIdol.nsfw;
            let gridHtml = '';

            if (photos.length === 0) {
                photoGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:#94a3b8; padding:40px;">暂无照片数据</div>`;
                return;
            }

            photos.forEach(p => {
                if (p.isUnlocked) {
                    gridHtml += `
                        <div class="gal-photo-item" data-url="${p.url}">
                            <img class="gal-photo-img" src="${p.url}">
                        </div>`;
                } else {
                    gridHtml += `
                        <div class="gal-photo-item locked">
                            <img class="gal-photo-img" src="${p.url}">
                            <div class="gal-locked-mask">
                                <i class="bi bi-lock-fill gal-locked-icon"></i>
                                <span class="gal-locked-text">条件未达成</span>
                            </div>
                        </div>`;
                }
            });
            photoGrid.innerHTML = gridHtml;
        }

        renderHome();

        // 绑定事件
        const appContainer = container.querySelector('.gal-app-container');
        appContainer.addEventListener('click', function(e) {
            // 点击偶像卡片进入详情
            const card = e.target.closest('.gal-idol-card');
            if (card) {
                const id = card.getAttribute('data-id');
                currentIdol = GALLERY_DATA.find(i => i.id === id);
                if (currentIdol) {
                    container.querySelector('#gal-detail-name').innerText = currentIdol.name;
                    renderPhotos();
                    detailPage.classList.add('active');
                }
                return;
            }

            // 点击返回按钮
            if (e.target.closest('#gal-btn-back')) {
                detailPage.classList.remove('active');
                renderHome(); // 刷新主页进度
                return;
            }

            // 切换 Tab
            const tab = e.target.closest('.gal-tab');
            if (tab) {
                container.querySelectorAll('.gal-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentTab = tab.getAttribute('data-tab');
                renderPhotos();
                return;
            }

            // 点击已解锁照片放大查看
            const photo = e.target.closest('.gal-photo-item');
            if (photo && !photo.classList.contains('locked')) {
                const url = photo.getAttribute('data-url');
                const viewer = container.querySelector('#gal-viewer');
                container.querySelector('#gal-viewer-img').src = url;
                viewer.style.display = 'flex';
                // 延迟添加opacity类以触发过渡动画
                setTimeout(() => viewer.classList.add('active'), 10);
                return;
            }

            // 关闭大图
            if (e.target.closest('#gal-viewer-close') || e.target.id === 'gal-viewer') {
                const viewer = container.querySelector('#gal-viewer');
                viewer.classList.remove('active');
                setTimeout(() => viewer.style.display = 'none', 300);
            }
        });
    };
})();
