// ==========================================
// 秋青子专属终端：秘密相册 App (ui_gallery_app.js) - 直接读取 idolDatabase 版
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

    // 默认头像
    const DEFAULT_AVATAR = 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png';

    // 从 idolDatabase 构建相册数据
    function buildGalleryData() {
        const db = topWin.idolDatabase;
        if (!db || !Array.isArray(db)) {
            console.error("【秋青子】找不到 idolDatabase，相册无法加载！");
            return [];
        }

        return db.map(idol => {
            const sfwList = (idol.memories && idol.memories.sfw) ? idol.memories.sfw : [];
            const nsfwList = (idol.memories && idol.memories.nsfw) ? idol.memories.nsfw : [];

            return {
                id: idol.id,
                name: idol.name,
                tag: idol.tag || '',
                avatar: idol.image || DEFAULT_AVATAR,
                sfw: sfwList.map((p, i) => ({
                    id: idol.id + '_sfw_' + i,
                    url: p.url,
                    title: p.title || '日常 ' + (i + 1),
                    isUnlocked: true   // SFW 默认全部解锁
                })),
                nsfw: nsfwList.map((p, i) => ({
                    id: idol.id + '_nsfw_' + i,
                    url: p.url,
                    title: p.title || '秘密 ' + (i + 1),
                    isUnlocked: false  // NSFW 默认全部上锁
                }))
            };
        });
    }

    // 计算称号
    function getTitle(unlockedCount, totalCount) {
        if (totalCount === 0) return "暂无档案";
        const ratio = unlockedCount / totalCount;
        if (ratio === 0) return "路人星探";
        if (ratio < 0.3) return "见习制作人";
        if (ratio < 0.7) return "专属制作人";
        if (ratio < 1) return "王牌制作人";
        return "绝对支配者";
    }

    // 注入样式
    const styleId = 'qingzi-gallery-style';
    if (!topDoc.getElementById(styleId)) {
        const style = topDoc.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .gal-app-container { width: 100%; height: 100%; display: flex; flex-direction: column; background: #f8fafc; position: relative; overflow: hidden; }

            .gal-home { flex: 1; padding: 20px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); gap: 15px; align-content: start; }
            .gal-idol-card { background: #fff; border-radius: 16px; padding: 14px 10px; display: flex; flex-direction: column; align-items: center; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: 0.2s; border: 1px solid rgba(0,0,0,0.05); }
            .gal-idol-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); border-color: #db2777; }
            .gal-idol-avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; margin-bottom: 8px; border: 3px solid #e2e8f0; background: #e2e8f0; }
            .gal-idol-name { font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 3px; }
            .gal-idol-tag { font-size: 11px; color: #64748b; margin-bottom: 6px; }
            .gal-idol-title { font-size: 11px; font-weight: bold; color: #db2777; background: rgba(219,39,119,0.1); padding: 2px 8px; border-radius: 10px; margin-bottom: 8px; white-space: nowrap; }
            .gal-progress-bar { width: 100%; height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
            .gal-progress-fill { height: 100%; background: linear-gradient(90deg, #db2777, #ec4899); transition: width 0.3s; border-radius: 3px; }
            .gal-progress-text { font-size: 10px; color: #94a3b8; }

            .gal-detail { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #f8fafc; z-index: 10; display: flex; flex-direction: column; transform: translateX(100%); transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            .gal-detail.active { transform: translateX(0); }

            .gal-detail-header { display: flex; align-items: center; padding: 12px 20px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); gap: 12px; flex-shrink: 0; }
            .gal-back-btn { width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; border: none; color: #db2777; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; flex-shrink: 0; }
            .gal-back-btn:hover { background: #e2e8f0; }
            .gal-detail-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; flex-shrink: 0; }
            .gal-detail-info { flex: 1; min-width: 0; }
            .gal-detail-name { font-size: 15px; font-weight: bold; color: #1e293b; }
            .gal-detail-subtitle { font-size: 11px; color: #db2777; font-weight: bold; }

            .gal-tabs { display: flex; padding: 0 20px; gap: 0; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.05); flex-shrink: 0; }
            .gal-tab { flex: 1; padding: 10px; font-size: 13px; font-weight: bold; color: #94a3b8; cursor: pointer; border-bottom: 3px solid transparent; transition: 0.2s; text-align: center; }
            .gal-tab:hover { color: #64748b; }
            .gal-tab.active { color: #db2777; border-bottom-color: #db2777; }
            .gal-tab-count { display: inline-block; background: #e2e8f0; color: #64748b; font-size: 10px; padding: 1px 5px; border-radius: 8px; margin-left: 4px; }
            .gal-tab.active .gal-tab-count { background: rgba(219,39,119,0.15); color: #db2777; }

            .gal-photo-grid { flex: 1; padding: 15px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; align-content: start; }
            .gal-photo-item { position: relative; aspect-ratio: 3/4; border-radius: 12px; overflow: hidden; background: #e2e8f0; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: 0.2s; }
            .gal-photo-item:hover { transform: scale(1.03); box-shadow: 0 4px 15px rgba(0,0,0,0.15); }
            .gal-photo-img { width: 100%; height: 100%; object-fit: cover; }
            .gal-photo-title { position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: #fff; font-size: 11px; padding: 20px 8px 6px; }

            .gal-photo-item.locked { cursor: default; }
            .gal-photo-item.locked:hover { transform: none; }
            .gal-photo-item.locked .gal-photo-img { filter: brightness(0.1) blur(10px); }
            .gal-photo-item.locked .gal-photo-title { display: none; }
            .gal-locked-mask { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(255,255,255,0.6); }
            .gal-locked-icon { font-size: 28px; margin-bottom: 5px; }
            .gal-locked-text { font-size: 11px; font-weight: bold; }

            .gal-empty { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: #94a3b8; gap: 10px; }
            .gal-empty i { font-size: 48px; }
            .gal-empty span { font-size: 14px; font-weight: bold; }

            .gal-viewer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.92); z-index: 100; display: none; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; }
            .gal-viewer.active { display: flex; }
            .gal-viewer-img { max-width: 92%; max-height: 82%; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); object-fit: contain; cursor: default; }
            .gal-viewer-close { position: absolute; top: 15px; right: 15px; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.15); color: #fff; font-size: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; transition: 0.2s; }
            .gal-viewer-close:hover { background: rgba(255,255,255,0.3); }
            .gal-viewer-title { color: #fff; font-size: 14px; margin-top: 12px; font-weight: bold; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
        `;
        topDoc.head.appendChild(style);
    }

    topWin.renderGalleryApp = function(container) {
        if (!container) return;

        const galleryData = buildGalleryData();

        if (galleryData.length === 0) {
            container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-weight:bold;">idol_data.js 尚未加载，请稍后重试</div>';
            return;
        }

        let html = `
            <div class="gal-app-container">
                <div class="gal-home" id="gal-home-list"></div>
                <div class="gal-detail" id="gal-detail-page">
                    <div class="gal-detail-header">
                        <button class="gal-back-btn" id="gal-btn-back"><i class="bi bi-arrow-left"></i></button>
                        <img class="gal-detail-avatar" id="gal-detail-avatar" src="${DEFAULT_AVATAR}">
                        <div class="gal-detail-info">
                            <div class="gal-detail-name" id="gal-detail-name"></div>
                            <div class="gal-detail-subtitle" id="gal-detail-subtitle"></div>
                        </div>
                    </div>
                    <div class="gal-tabs">
                        <div class="gal-tab active" data-tab="sfw">日常写真 <span class="gal-tab-count" id="gal-sfw-count">0</span></div>
                        <div class="gal-tab" data-tab="nsfw">秘密档案 <span class="gal-tab-count" id="gal-nsfw-count">0</span></div>
                    </div>
                    <div class="gal-photo-grid" id="gal-photo-grid"></div>
                </div>
                <div class="gal-viewer" id="gal-viewer">
                    <button class="gal-viewer-close" id="gal-viewer-close"><i class="bi bi-x-lg"></i></button>
                    <img class="gal-viewer-img" id="gal-viewer-img" src="">
                    <div class="gal-viewer-title" id="gal-viewer-title"></div>
                </div>
            </div>
        `;
        container.innerHTML = html;

        const homeList = container.querySelector('#gal-home-list');
        const detailPage = container.querySelector('#gal-detail-page');
        const photoGrid = container.querySelector('#gal-photo-grid');
        let currentIdol = null;
        let currentTab = 'sfw';

        function renderHome() {
            let listHtml = '';
            galleryData.forEach(idol => {
                let unlocked = 0;
                let total = idol.sfw.length + idol.nsfw.length;
                idol.sfw.forEach(p => { if (p.isUnlocked) unlocked++; });
                idol.nsfw.forEach(p => { if (p.isUnlocked) unlocked++; });
                let percent = total === 0 ? 0 : Math.round((unlocked / total) * 100);
                let title = getTitle(unlocked, total);

                listHtml += `
                    <div class="gal-idol-card" data-id="${idol.id}">
                        <img class="gal-idol-avatar" src="${idol.avatar}" onerror="this.src='${DEFAULT_AVATAR}'">
                        <div class="gal-idol-name">${idol.name}</div>
                        <div class="gal-idol-tag">${idol.tag}</div>
                        <div class="gal-idol-title">${title}</div>
                        <div class="gal-progress-bar"><div class="gal-progress-fill" style="width: ${percent}%;"></div></div>
                        <div class="gal-progress-text">${unlocked} / ${total} (${percent}%)</div>
                    </div>
                `;
            });
            homeList.innerHTML = listHtml;
        }

        function renderPhotos() {
            if (!currentIdol) return;
            const photos = currentTab === 'sfw' ? currentIdol.sfw : currentIdol.nsfw;

            container.querySelector('#gal-sfw-count').innerText = currentIdol.sfw.length;
            container.querySelector('#gal-nsfw-count').innerText = currentIdol.nsfw.length;

            if (photos.length === 0) {
                photoGrid.innerHTML = `
                    <div class="gal-empty">
                        <i class="bi bi-${currentTab === 'sfw' ? 'camera' : 'lock-fill'}"></i>
                        <span>暂无${currentTab === 'sfw' ? '日常写真' : '秘密档案'}</span>
                    </div>`;
                return;
            }

            let gridHtml = '';
            photos.forEach(p => {
                if (p.isUnlocked) {
                    gridHtml += `
                        <div class="gal-photo-item" data-url="${p.url}" data-title="${p.title}">
                            <img class="gal-photo-img" src="${p.url}">
                            <div class="gal-photo-title">${p.title}</div>
                        </div>`;
                } else {
                    gridHtml += `
                        <div class="gal-photo-item locked">
                            <img class="gal-photo-img" src="${p.url}">
                            <div class="gal-photo-title">${p.title}</div>
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

        const appContainer = container.querySelector('.gal-app-container');
        appContainer.addEventListener('click', function(e) {
            const card = e.target.closest('.gal-idol-card');
            if (card) {
                const id = parseInt(card.getAttribute('data-id'));
                currentIdol = galleryData.find(i => i.id === id);
                if (currentIdol) {
                    container.querySelector('#gal-detail-name').innerText = currentIdol.name;
                    container.querySelector('#gal-detail-avatar').src = currentIdol.avatar;

                    let unlocked = 0, total = currentIdol.sfw.length + currentIdol.nsfw.length;
                    currentIdol.sfw.forEach(p => { if (p.isUnlocked) unlocked++; });
                    currentIdol.nsfw.forEach(p => { if (p.isUnlocked) unlocked++; });
                    container.querySelector('#gal-detail-subtitle').innerText = getTitle(unlocked, total);

                    currentTab = 'sfw';
                    container.querySelectorAll('.gal-tab').forEach(t => t.classList.remove('active'));
                    container.querySelector('.gal-tab[data-tab="sfw"]').classList.add('active');

                    renderPhotos();
                    detailPage.classList.add('active');
                }
                return;
            }

            if (e.target.closest('#gal-btn-back')) {
                detailPage.classList.remove('active');
                renderHome();
                return;
            }

            const tab = e.target.closest('.gal-tab');
            if (tab) {
                container.querySelectorAll('.gal-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentTab = tab.getAttribute('data-tab');
                renderPhotos();
                return;
            }

            const photo = e.target.closest('.gal-photo-item');
            if (photo && !photo.classList.contains('locked')) {
                const url = photo.getAttribute('data-url');
                const title = photo.getAttribute('data-title');
                if (url) {
                    container.querySelector('#gal-viewer-img').src = url;
                    container.querySelector('#gal-viewer-title').innerText = title || '';
                    container.querySelector('#gal-viewer').classList.add('active');
                }
                return;
            }

            if (e.target.closest('#gal-viewer-close') || e.target.classList.contains('gal-viewer')) {
                container.querySelector('#gal-viewer').classList.remove('active');
            }
        });
    };
})();
