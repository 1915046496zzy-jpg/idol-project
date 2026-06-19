// ==========================================
// 秋青子专属终端：秘密相册 App (ui_gallery_app.js) - 内联样式强制修复版
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

    const DEFAULT_AVATAR = 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png';

    function buildGalleryData() {
        const db = topWin.idolDatabase;
        if (!db || !Array.isArray(db)) return [];
        return db.map(idol => {
            const sfwList = (idol.memories && idol.memories.sfw) ? idol.memories.sfw : [];
            const nsfwList = (idol.memories && idol.memories.nsfw) ? idol.memories.nsfw : [];
            return {
                id: idol.id,
                name: idol.name,
                tag: idol.tag || '',
                avatar: idol.image || DEFAULT_AVATAR,
                sfw: sfwList.map((p, i) => ({ id: idol.id + '_s' + i, url: p.url, title: p.title || '', isUnlocked: true })),
                nsfw: nsfwList.map((p, i) => ({ id: idol.id + '_n' + i, url: p.url, title: p.title || '', isUnlocked: true }))
            };
        });
    }

    function getTitle(unlocked, total) {
        if (total === 0) return "暂无档案";
        const r = unlocked / total;
        if (r === 0) return "路人星探";
        if (r < 0.3) return "见习制作人";
        if (r < 0.7) return "专属制作人";
        if (r < 1) return "王牌制作人";
        return "绝对支配者";
    }

    topWin.renderGalleryApp = function(container) {
        if (!container) return;
        const galleryData = buildGalleryData();
        if (galleryData.length === 0) {
            container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-weight:bold;">idol_data.js 尚未加载</div>';
            return;
        }

        // 用纯内联样式构建整个App，彻底避免CSS被覆盖的问题 (已修复滚动和挤压问题)
        container.innerHTML = `
            <div id="gal-root" style="width:100%;height:100%;position:relative;overflow:hidden;background:#f8fafc;display:flex;flex-direction:column;">
                <!-- 主页 -->
                <div id="gal-home" style="flex:1;min-height:0;overflow-y:auto;padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:16px;align-content:start;box-sizing:border-box;padding-bottom:40px;"></div>
                <!-- 详情页 -->
                <div id="gal-detail" style="position:absolute;top:0;left:0;width:100%;height:100%;background:#f8fafc;z-index:10;display:none;flex-direction:column;">
                    <div id="gal-d-header" style="display:flex;align-items:center;padding:12px 20px;background:rgba(255,255,255,0.95);border-bottom:1px solid rgba(0,0,0,0.08);gap:12px;flex-shrink:0;">
                        <button id="gal-btn-back" style="width:36px;height:36px;border-radius:50%;background:#f1f5f9;border:none;color:#db2777;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;">◀</button>
                        <img id="gal-d-avatar" src="${DEFAULT_AVATAR}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #e2e8f0;flex-shrink:0;">
                        <div style="flex:1;min-width:0;">
                            <div id="gal-d-name" style="font-size:15px;font-weight:bold;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
                            <div id="gal-d-title" style="font-size:11px;color:#db2777;font-weight:bold;"></div>
                        </div>
                    </div>
                    <div id="gal-tabs" style="display:flex;background:#fff;border-bottom:1px solid rgba(0,0,0,0.08);flex-shrink:0;">
                        <div class="gal-tab-btn" data-tab="sfw" style="flex:1;padding:10px;text-align:center;font-size:13px;font-weight:bold;cursor:pointer;color:#db2777;border-bottom:3px solid #db2777;">日常写真 <span id="gal-cnt-sfw" style="font-size:10px;background:rgba(219,39,119,0.15);color:#db2777;padding:1px 5px;border-radius:8px;">0</span></div>
                        <div class="gal-tab-btn" data-tab="nsfw" style="flex:1;padding:10px;text-align:center;font-size:13px;font-weight:bold;cursor:pointer;color:#94a3b8;border-bottom:3px solid transparent;">秘密档案 <span id="gal-cnt-nsfw" style="font-size:10px;background:#e2e8f0;color:#64748b;padding:1px 5px;border-radius:8px;">0</span></div>
                    </div>
                    <!-- 加上 min-height:0 彻底解决被挤压的问题 -->
                    <div id="gal-grid" style="flex:1;min-height:0;overflow-y:auto;padding:15px;display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:12px;align-content:start;box-sizing:border-box;padding-bottom:50px;"></div>
                </div>
                <!-- 大图查看器 -->
                <div id="gal-viewer" style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:100;display:none;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;">
                    <button id="gal-v-close" style="position:absolute;top:15px;right:15px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.15);color:#fff;font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;">✕</button>
                    <img id="gal-v-img" src="" style="max-width:90%;max-height:80%;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.6);object-fit:contain;">
                    <div id="gal-v-title" style="color:#fff;font-size:14px;margin-top:12px;font-weight:bold;"></div>
                </div>
            </div>
        `;

        const homeEl = container.querySelector('#gal-home');
        const detailEl = container.querySelector('#gal-detail');
        const gridEl = container.querySelector('#gal-grid');
        const viewerEl = container.querySelector('#gal-viewer');
        let curIdol = null;
        let curTab = 'sfw';

        // 渲染主页偶像列表
        function renderHome() {
            let h = '';
            galleryData.forEach(idol => {
                let unlocked = 0, total = idol.sfw.length + idol.nsfw.length;
                idol.sfw.forEach(p => { if (p.isUnlocked) unlocked++; });
                idol.nsfw.forEach(p => { if (p.isUnlocked) unlocked++; });
                let pct = total === 0 ? 0 : Math.round((unlocked / total) * 100);

                h += `<div data-idol-id="${idol.id}" style="background:#fff;border-radius:16px;padding:14px 10px;display:flex;flex-direction:column;align-items:center;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,0.05);border:1px solid rgba(0,0,0,0.05);transition:0.2s;">
                    <img src="${idol.avatar}" onerror="this.src='${DEFAULT_AVATAR}'" style="width:70px;height:70px;border-radius:50%;object-fit:cover;margin-bottom:8px;border:3px solid #e2e8f0;">
                    <div style="font-size:13px;font-weight:bold;color:#1e293b;margin-bottom:2px;">${idol.name}</div>
                    <div style="font-size:10px;color:#64748b;margin-bottom:5px;">${idol.tag}</div>
                    <div style="font-size:10px;font-weight:bold;color:#db2777;background:rgba(219,39,119,0.1);padding:2px 8px;border-radius:10px;margin-bottom:8px;">${getTitle(unlocked, total)}</div>
                    <div style="width:100%;height:5px;background:#e2e8f0;border-radius:3px;overflow:hidden;margin-bottom:4px;"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#db2777,#ec4899);border-radius:3px;"></div></div>
                    <div style="font-size:10px;color:#94a3b8;">${unlocked}/${total} (${pct}%)</div>
                </div>`;
            });
            homeEl.innerHTML = h;
        }

        // 渲染照片网格
        function renderGrid() {
            if (!curIdol) return;
            const photos = curTab === 'sfw' ? curIdol.sfw : curIdol.nsfw;
            container.querySelector('#gal-cnt-sfw').innerText = curIdol.sfw.length;
            container.querySelector('#gal-cnt-nsfw').innerText = curIdol.nsfw.length;

            if (photos.length === 0) {
                gridEl.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:60px 20px;font-weight:bold;">暂无${curTab === 'sfw' ? '日常写真' : '秘密档案'}</div>`;
                return;
            }

            let g = '';
            photos.forEach(p => {
                if (p.isUnlocked) {
                    g += `<div data-photo-url="${p.url}" data-photo-title="${p.title}" style="position:relative;border-radius:12px;overflow:hidden;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.08);aspect-ratio:3/4;background:#e2e8f0;">
                        <!-- 图片改为绝对定位，填满父级框，绝不把父级撑爆 -->
                        <img src="${p.url}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;">
                        <!-- 文字增加防折行和截断，防止长标题破坏高度 -->
                        <div style="position:absolute;bottom:0;left:0;width:100%;background:linear-gradient(transparent,rgba(0,0,0,0.7));color:#fff;font-size:10px;padding:18px 6px 5px;box-sizing:border-box;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div>
                    </div>`;
                } else {
                    g += `<div style="position:relative;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);aspect-ratio:3/4;background:#1e293b;">
                        <img src="${p.url}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.08) blur(10px);">
                        <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);">
                            <span style="font-size:26px;">🔒</span>
                            <span style="font-size:11px;font-weight:bold;margin-top:4px;">条件未达成</span>
                        </div>
                    </div>`;
                }
            });
            gridEl.innerHTML = g;
        }

        // Tab 样式切换
        function updateTabs() {
            const tabs = container.querySelectorAll('.gal-tab-btn');
            tabs.forEach(t => {
                if (t.getAttribute('data-tab') === curTab) {
                    t.style.color = '#db2777';
                    t.style.borderBottom = '3px solid #db2777';
                } else {
                    t.style.color = '#94a3b8';
                    t.style.borderBottom = '3px solid transparent';
                }
            });
        }

        renderHome();

        // 事件委托
        container.addEventListener('click', function(e) {
            // 点击偶像卡片
            const card = e.target.closest('[data-idol-id]');
            if (card && !detailEl.contains(card)) {
                const id = parseInt(card.getAttribute('data-idol-id'));
                curIdol = galleryData.find(i => i.id === id);
                if (curIdol) {
                    container.querySelector('#gal-d-name').innerText = curIdol.name;
                    container.querySelector('#gal-d-avatar').src = curIdol.avatar;
                    let unlocked = 0, total = curIdol.sfw.length + curIdol.nsfw.length;
                    curIdol.sfw.forEach(p => { if (p.isUnlocked) unlocked++; });
                    curIdol.nsfw.forEach(p => { if (p.isUnlocked) unlocked++; });
                    container.querySelector('#gal-d-title').innerText = getTitle(unlocked, total);
                    curTab = 'sfw';
                    updateTabs();
                    renderGrid();
                    detailEl.style.display = 'flex';
                }
                return;
            }

            // 返回按钮
            if (e.target.closest('#gal-btn-back')) {
                detailEl.style.display = 'none';
                renderHome();
                return;
            }

            // Tab 切换
            const tab = e.target.closest('.gal-tab-btn');
            if (tab) {
                curTab = tab.getAttribute('data-tab');
                updateTabs();
                renderGrid();
                return;
            }

            // 点击已解锁照片
            const photo = e.target.closest('[data-photo-url]');
            if (photo) {
                container.querySelector('#gal-v-img').src = photo.getAttribute('data-photo-url');
                container.querySelector('#gal-v-title').innerText = photo.getAttribute('data-photo-title') || '';
                viewerEl.style.display = 'flex';
                return;
            }

            // 关闭大图
            if (e.target.closest('#gal-v-close') || e.target === viewerEl) {
                viewerEl.style.display = 'none';
            }
        });
    };
})();
