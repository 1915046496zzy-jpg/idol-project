// ==========================================
// 星探寻访 (Gacha) APP 独立模块 - 华丽重制版
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

    if (typeof topWin.playerCurrency === 'undefined') {
        topWin.playerCurrency = { stardust: 50000 };
    }

    // --- 注入专属高阶 CSS ---
    if (!topDoc.getElementById('qingzi-gacha-style')) {
        const style = topDoc.createElement('style');
        style.id = 'qingzi-gacha-style';
        style.innerHTML = `
            /* 基础容器 */
            .gc-container { width: 100%; height: 100%; display: flex; flex-direction: column; background: #f4f4f5; font-family: -apple-system, "Microsoft YaHei", sans-serif; position: relative; overflow: hidden; }

            /* 顶部资产栏 */
            .gc-top-bar { height: 60px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); display: flex; justify-content: space-between; align-items: center; padding: 0 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10; flex-shrink: 0; }
            .gc-title-wrap { display: flex; align-items: baseline; gap: 10px; }
            .gc-main-title { font-size: 22px; font-weight: 900; color: #1e293b; letter-spacing: 2px; }
            .gc-sub-title { font-size: 12px; color: #94a3b8; letter-spacing: 3px; text-transform: uppercase; font-weight: bold; }
            .gc-currency { display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 6px 15px; border-radius: 20px; border: 1px solid #e2e8f0; }
            .gc-currency i { color: #f59e0b; font-size: 18px; }
            .gc-currency-val { font-size: 18px; font-weight: 900; font-family: monospace; color: #334155; }

            /* 主界面结构 (左侧标签 + 右侧横幅) */
            .gc-main-area { flex: 1; display: flex; overflow: hidden; }

            /* 左侧卡池切换 Tab */
            .gc-sidebar { width: 220px; background: #fff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; padding: 20px 0; z-index: 5; }
            .gc-tab { padding: 15px 25px; display: flex; align-items: center; gap: 12px; cursor: pointer; border-left: 4px solid transparent; transition: 0.3s; color: #64748b; font-weight: bold; font-size: 15px; }
            .gc-tab:hover { background: #f8fafc; color: #334155; }
            .gc-tab.active { background: #eff6ff; color: #2563eb; border-left-color: #3b82f6; }
            .gc-tab i { font-size: 20px; }
            .gc-tab-badge { margin-left: auto; font-size: 10px; background: #ef4444; color: #fff; padding: 2px 6px; border-radius: 10px; }

            /* 右侧卡池展示区 */
            .gc-content { flex: 1; position: relative; display: flex; flex-direction: column; background: #e2e8f0; }

            /* Banner 区域 */
            .gc-banner-wrap { flex: 1; position: relative; overflow: hidden; background: linear-gradient(135deg, #1e293b, #0f172a); }
            .gc-banner-bg { position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; opacity: 0.4; filter: blur(2px); transition: 0.5s; }
            .gc-banner-char { position: absolute; right: 5%; bottom: -5%; height: 110%; object-fit: contain; filter: drop-shadow(-10px 0 20px rgba(0,0,0,0.5)); transition: 0.5s; pointer-events: none; }

            .gc-banner-info { position: absolute; left: 50px; top: 50%; transform: translateY(-50%); color: #fff; z-index: 2; max-width: 50%; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
            .gc-banner-type { display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); border-radius: 4px; font-size: 13px; font-weight: bold; letter-spacing: 2px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.3); }
            .gc-banner-name { font-size: 48px; font-weight: 900; margin-bottom: 10px; line-height: 1.1; font-family: 'Noto Serif SC', serif; }
            .gc-banner-desc { font-size: 16px; opacity: 0.8; line-height: 1.6; }

            /* 底部操作区 */
            .gc-action-bar { height: 120px; background: rgba(255,255,255,0.98); border-top: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; box-shadow: 0 -5px 20px rgba(0,0,0,0.05); z-index: 10; }

            .gc-btn-detail { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; color: #475569; font-weight: bold; cursor: pointer; transition: 0.2s; font-size: 15px; }
            .gc-btn-detail:hover { background: #e2e8f0; color: #1e293b; }

            .gc-pull-group { display: flex; gap: 20px; }
            .gc-btn-pull { position: relative; width: 180px; height: 65px; border-radius: 12px; border: none; cursor: pointer; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.15); transition: 0.2s; }
            .gc-btn-pull:hover { transform: translateY(-3px); box-shadow: 0 12px 25px rgba(0,0,0,0.2); filter: brightness(1.1); }
            .gc-btn-pull:active { transform: translateY(1px); }
            .gc-btn-pull.disabled { opacity: 0.5; pointer-events: none; filter: grayscale(1); }

            .gc-btn-single { background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff; }
            .gc-btn-ten { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; }

            .gc-pull-text { font-size: 18px; font-weight: 900; letter-spacing: 2px; text-shadow: 0 1px 3px rgba(0,0,0,0.3); z-index: 2; }
            .gc-pull-cost { font-size: 13px; display: flex; align-items: center; gap: 5px; opacity: 0.9; font-weight: bold; z-index: 2; margin-top: 2px; }
            .gc-pull-cost i { font-size: 14px; }

            .gc-btn-pull::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%); transform: rotate(45deg) translateY(-100%); transition: 0.5s; }
            .gc-btn-pull:hover::before { transform: rotate(45deg) translateY(100%); }

            /* ================= 卡池详情侧边抽屉 ================= */
            .gc-detail-drawer { position: absolute; top: 0; right: -100%; width: 60%; max-width: 600px; height: 100%; background: #fff; box-shadow: -10px 0 30px rgba(0,0,0,0.1); z-index: 50; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; }
            .gc-detail-drawer.open { right: 0; }
            .gc-detail-header { padding: 20px 30px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
            .gc-detail-title { font-size: 20px; font-weight: 900; color: #1e293b; display: flex; align-items: center; gap: 10px; }
            .gc-btn-close-drawer { background: none; border: none; font-size: 24px; color: #94a3b8; cursor: pointer; transition: 0.2s; }
            .gc-btn-close-drawer:hover { color: #ef4444; transform: rotate(90deg); }

            .gc-detail-content { flex: 1; overflow-y: auto; padding: 30px; }
            .gc-detail-content::-webkit-scrollbar { width: 6px; }
            .gc-detail-content::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

            .gc-info-section { margin-bottom: 30px; }
            .gc-section-title { font-size: 16px; font-weight: bold; color: #3b82f6; border-bottom: 2px solid #eff6ff; padding-bottom: 8px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }

            .gc-rate-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 20px; }
            .gc-rate-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; font-size: 14px; }
            .gc-rate-row:last-child { border-bottom: none; }
            .gc-rate-label { color: #475569; font-weight: bold; }
            .gc-rate-val { color: #1e293b; font-family: monospace; font-weight: 900; font-size: 15px; }
            .gc-val-high { color: #db2777; }

            .gc-idol-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px; }
            .gc-idol-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
            .gc-idol-img { width: 60px; height: 60px; object-fit: cover; border-radius: 50%; border: 2px solid #f1f5f9; margin-bottom: 8px; }
            .gc-idol-name { font-size: 12px; font-weight: bold; color: #334155; }

            .gc-item-list { display: flex; flex-direction: column; gap: 10px; }
            .gc-item-row { display: flex; align-items: center; gap: 15px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 15px; }
            .gc-item-icon-wrap { width: 40px; height: 40px; background: #f1f5f9; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 20px; color: #64748b; flex-shrink: 0; }
            .gc-item-info { flex: 1; }
            .gc-item-name { font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 2px; }
            .gc-item-desc { font-size: 12px; color: #64748b; }

            /* ================= 抽卡动画层 ================= */
            .gc-anim-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: #000; z-index: 100; display: none; flex-direction: column; align-items: center; justify-content: center; }
            .gc-anim-overlay.active { display: flex; }
            .gc-anim-video { width: 100%; height: 100%; object-fit: cover; position: absolute; top:0; left:0; opacity: 0.5; }
            .gc-anim-text { position: relative; z-index: 2; color: #fff; font-size: 24px; font-weight: 900; letter-spacing: 10px; text-shadow: 0 0 20px rgba(255,255,255,0.5); animation: pulseText 1.5s infinite; }
            @keyframes pulseText { 0% { opacity: 0.5; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1.02); } 100% { opacity: 0.5; transform: scale(0.98); } }

            /* ================= 结果展示层 ================= */
            .gc-result-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); z-index: 110; display: none; flex-direction: column; opacity: 0; transition: opacity 0.5s; }
            .gc-result-overlay.active { display: flex; opacity: 1; }
            .gc-res-header { text-align: center; padding: 40px 0 20px; }
            .gc-res-title { color: #fff; font-size: 28px; font-weight: 900; letter-spacing: 4px; text-shadow: 0 0 20px rgba(255,255,255,0.3); }

            .gc-res-grid { flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: 20px; padding: 20px 40px; overflow-y: auto; perspective: 1000px; }

            .gc-res-card { width: 140px; height: 190px; background: linear-gradient(180deg, #334155, #1e293b); border-radius: 12px; border: 1px solid #475569; display: flex; flex-direction: column; align-items: center; padding: 15px 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; transform-style: preserve-3d; transform: rotateY(90deg); opacity: 0; }
            .gc-res-card.flip-in { animation: cardFlipIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            @keyframes cardFlipIn { to { transform: rotateY(0deg); opacity: 1; } }

            /* 卡片品质分类 */
            .gc-res-card.type-idol { background: linear-gradient(180deg, #fef3c7, #f59e0b); border: 2px solid #fbbf24; box-shadow: 0 0 30px rgba(245, 158, 11, 0.3); }
            .gc-res-card.type-dup { background: linear-gradient(180deg, #e0f2fe, #3b82f6); border: 2px solid #60a5fa; box-shadow: 0 0 30px rgba(59, 130, 246, 0.3); }
            .gc-res-card.type-item { background: linear-gradient(180deg, #f8fafc, #cbd5e1); border: 1px solid #94a3b8; }
            .gc-res-card.type-currency { background: linear-gradient(180deg, #1e293b, #0f172a); border: 1px solid #334155; }

            .gc-res-tag { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: bold; color: #fff; padding: 2px 10px; border-radius: 10px; z-index: 5; box-shadow: 0 2px 5px rgba(0,0,0,0.2); white-space: nowrap; }
            .type-idol .gc-res-tag { background: #db2777; }
            .type-dup .gc-res-tag { background: #2563eb; }
            .type-item .gc-res-tag { background: #64748b; }
            .type-currency .gc-res-tag { background: #10b981; }

            .gc-res-img-wrap { width: 80px; height: 80px; margin-top: 10px; margin-bottom: 15px; position: relative; border-radius: 8px; overflow: hidden; background: rgba(255,255,255,0.8); display: flex; justify-content: center; align-items: center; box-shadow: inset 0 0 10px rgba(0,0,0,0.1); }
            .gc-res-img-wrap img { width: 100%; height: 100%; object-fit: contain; }
            .gc-res-img-wrap i { font-size: 40px; color: #64748b; }

            .gc-res-name { font-size: 13px; font-weight: 900; text-align: center; line-height: 1.2; width: 100%; }
            .type-idol .gc-res-name { color: #78350f; }
            .type-dup .gc-res-name { color: #1e3a8a; }
            .type-item .gc-res-name { color: #334155; }
            .type-currency .gc-res-name { color: #f8fafc; }

            /* 重复印记翻转特效 */
            .gc-res-card.type-dup .gc-res-img-wrap img.mark-front, .gc-res-card.type-dup .gc-res-img-wrap i.mark-back { position: absolute; top:0; left:0; width:100%; height:100%; backface-visibility: hidden; transition: transform 0.6s; }
            .gc-res-card.type-dup .gc-res-img-wrap img.mark-front { transform: rotateY(0deg); }
            .gc-res-card.type-dup .gc-res-img-wrap i.mark-back { transform: rotateY(180deg); background: #fdf2f8; color: #db2777; display: flex; align-items: center; justify-content: center; font-size: 40px; }
            .gc-res-card.do-transform .mark-front { transform: rotateY(-180deg) !important; }
            .gc-res-card.do-transform .mark-back { transform: rotateY(0deg) !important; }

            .gc-res-footer { padding: 30px; display: flex; justify-content: center; gap: 20px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); }
            .gc-btn-res { padding: 15px 40px; border-radius: 30px; font-size: 16px; font-weight: bold; cursor: pointer; border: none; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
            .gc-btn-res-close { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
            .gc-btn-res-close:hover { background: rgba(255,255,255,0.2); }
            .gc-btn-res-again { background: #f59e0b; color: #fff; box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
            .gc-btn-res-again:hover { background: #fbbf24; transform: translateY(-2px); box-shadow: 0 0 30px rgba(245, 158, 11, 0.6); }

        `;
        topDoc.head.appendChild(style);
    }

    topWin.renderGachaApp = function(container) {
        // --- 模拟卡池配置 ---
        const pools = {
            'standard': {
                id: 'standard',
                name: '常驻星探发掘',
                desc: '发掘隐藏在街头巷尾的原石，扩充事务所战力。',
                bg: 'https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg', // 随便找个背景，如果哥哥有好看的可以换
                charImg: '', // 常驻不特定展示某人
                idolRate: 0.04,
                typeLabel: '常驻发掘'
            },
            'limited': {
                id: 'limited',
                name: '【限定】星光坠落之夜',
                desc: '本期特选偶像发掘概率大幅提升！不容错过的相遇。',
                bg: 'https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg',
                charImg: (topWin.idolDatabase && topWin.idolDatabase.length > 0) ? topWin.idolDatabase[0].image : '', // 拿第一个偶像当看板娘
                idolRate: 0.08, // 限定池出率翻倍
                typeLabel: '限定发掘'
            }
        };

        let currentPoolId = 'standard';

        const html = `
            <div class="gc-container">
                <!-- 顶部 -->
                <div class="gc-top-bar">
                    <div class="gc-title-wrap">
                        <span class="gc-main-title">星探寻访</span>
                        <span class="gc-sub-title">Scouting</span>
                    </div>
                    <div class="gc-currency">
                        <i class="bi bi-stars"></i>
                        <span class="gc-currency-val" id="gc-stardust-val">${topWin.playerCurrency.stardust}</span>
                    </div>
                </div>

                <!-- 主体 -->
                <div class="gc-main-area">
                    <!-- 左侧 Tab -->
                    <div class="gc-sidebar">
                        <div class="gc-tab active" data-target="standard">
                            <i class="bi bi-person-lines-fill"></i> 常驻发掘
                        </div>
                        <div class="gc-tab" data-target="limited">
                            <i class="bi bi-stars"></i> 限定发掘
                            <span class="gc-tab-badge">UP!</span>
                        </div>
                    </div>

                    <!-- 右侧内容 -->
                    <div class="gc-content">
                        <div class="gc-banner-wrap">
                            <img src="${pools[currentPoolId].bg}" class="gc-banner-bg" id="gc-banner-bg">
                            <img src="${pools[currentPoolId].charImg}" class="gc-banner-char" id="gc-banner-char" style="display:${pools[currentPoolId].charImg?'block':'none'};">

                            <div class="gc-banner-info">
                                <div class="gc-banner-type" id="gc-banner-type">${pools[currentPoolId].typeLabel}</div>
                                <div class="gc-banner-name" id="gc-banner-name">${pools[currentPoolId].name}</div>
                                <div class="gc-banner-desc" id="gc-banner-desc">${pools[currentPoolId].desc}</div>
                            </div>
                        </div>

                        <div class="gc-action-bar">
                            <button class="gc-btn-detail" id="btn-gc-detail">
                                <i class="bi bi-search"></i> 卡池详情
                            </button>

                            <div class="gc-pull-group">
                                <button class="gc-btn-pull gc-btn-single" id="btn-gc-single">
                                    <span class="gc-pull-text">发掘 1 次</span>
                                    <div class="gc-pull-cost"><i class="bi bi-stars"></i> 1000</div>
                                </button>
                                <button class="gc-btn-pull gc-btn-ten" id="btn-gc-ten">
                                    <span class="gc-pull-text">发掘 10 次</span>
                                    <div class="gc-pull-cost"><i class="bi bi-stars"></i> 10000</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 侧边详情抽屉 -->
                <div class="gc-detail-drawer" id="gc-detail-drawer">
                    <div class="gc-detail-header">
                        <div class="gc-detail-title"><i class="bi bi-info-circle-fill" style="color:#3b82f6;"></i> 卡池情报公示</div>
                        <button class="gc-btn-close-drawer" id="btn-gc-close-drawer"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="gc-detail-content" id="gc-detail-content">
                        <!-- 动态渲染 -->
                    </div>
                </div>

                <!-- 抽卡过程动画层 -->
                <div class="gc-anim-overlay" id="gc-anim-overlay">
                    <div class="gc-anim-text"><i class="bi bi-fingerprint"></i> 正在解密星探档案...</div>
                </div>

                <!-- 抽卡结果层 -->
                <div class="gc-result-overlay" id="gc-result-overlay">
                    <div class="gc-res-header">
                        <div class="gc-res-title">发掘结果报告</div>
                    </div>
                    <div class="gc-res-grid" id="gc-res-grid"></div>
                    <div class="gc-res-footer">
                        <button class="gc-btn-res gc-btn-res-close" id="btn-res-close">确认并返回</button>
                        <button class="gc-btn-res gc-btn-res-again" id="btn-res-again"><i class="bi bi-arrow-repeat"></i> 再次十连 (10000 <i class="bi bi-stars" style="font-size:14px;"></i>)</button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // --- 逻辑绑定 ---
        const uiStardust = container.querySelector('#gc-stardust-val');
        const uiBannerBg = container.querySelector('#gc-banner-bg');
        const uiBannerChar = container.querySelector('#gc-banner-char');
        const uiBannerType = container.querySelector('#gc-banner-type');
        const uiBannerName = container.querySelector('#gc-banner-name');
        const uiBannerDesc = container.querySelector('#gc-banner-desc');
        const btnSingle = container.querySelector('#btn-gc-single');
        const btnTen = container.querySelector('#btn-gc-ten');

        const drawer = container.querySelector('#gc-detail-drawer');
        const drawerContent = container.querySelector('#gc-detail-content');

        const animOverlay = container.querySelector('#gc-anim-overlay');
        const resultOverlay = container.querySelector('#gc-result-overlay');
        const resGrid = container.querySelector('#gc-res-grid');

        // 更新余额显示
        function updateCurrencyUI() {
            uiStardust.innerText = topWin.playerCurrency.stardust;
            if (topWin.playerCurrency.stardust < 1000) btnSingle.classList.add('disabled'); else btnSingle.classList.remove('disabled');
            if (topWin.playerCurrency.stardust < 10000) btnTen.classList.add('disabled'); else btnTen.classList.remove('disabled');
        }

        // 切换卡池 Tab
        container.querySelectorAll('.gc-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.gc-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentPoolId = tab.getAttribute('data-target');
                const p = pools[currentPoolId];

                uiBannerBg.src = p.bg;
                if(p.charImg) { uiBannerChar.src = p.charImg; uiBannerChar.style.display = 'block'; }
                else { uiBannerChar.style.display = 'none'; }

                uiBannerType.innerText = p.typeLabel;
                uiBannerName.innerText = p.name;
                uiBannerDesc.innerText = p.desc;
            });
        });

        // 渲染详情抽屉
        function renderDetailDrawer() {
            const p = pools[currentPoolId];
            const iRate = p.idolRate * 100;
            const resRate = 1 - p.idolRate;
            const starRate = (resRate * 0.45) * 100;
            const itemRate = (resRate * 0.55) * 100;

            let dHtml = `
                <div class="gc-info-section">
                    <div class="gc-section-title"><i class="bi bi-pie-chart-fill"></i> 综合获取概率</div>
                    <div class="gc-rate-box">
                        <div class="gc-rate-row"><span class="gc-rate-label">✦ 偶像发掘率</span><span class="gc-rate-val gc-val-high">${iRate.toFixed(1)}%</span></div>
                        <div class="gc-rate-row"><span class="gc-rate-label">📦 资源道具发掘率</span><span class="gc-rate-val">${itemRate.toFixed(1)}%</span></div>
                        <div class="gc-rate-row"><span class="gc-rate-label">✨ 星尘返还率</span><span class="gc-rate-val">${starRate.toFixed(1)}%</span></div>
                    </div>
                </div>

                <div class="gc-info-section">
                    <div class="gc-section-title"><i class="bi bi-people-fill"></i> 可发掘偶像预览</div>
                    <div class="gc-idol-grid">
            `;

            if (topWin.idolDatabase && topWin.idolDatabase.length > 0) {
                topWin.idolDatabase.forEach(idol => {
                    dHtml += `
                        <div class="gc-idol-item">
                            <img src="${idol.image}" class="gc-idol-img">
                            <div class="gc-idol-name">${idol.name}</div>
                        </div>
                    `;
                });
            } else {
                dHtml += `<div style="grid-column:1/-1; color:#94a3b8; font-size:13px;">暂无偶像数据</div>`;
            }
            dHtml += `</div></div>`;

            dHtml += `
                <div class="gc-info-section">
                    <div class="gc-section-title"><i class="bi bi-box-seam-fill"></i> 包含道具预览</div>
                    <div class="gc-item-list">
            `;
            if (topWin.itemPool && topWin.itemPool.length > 0) {
                topWin.itemPool.forEach(item => {
                    dHtml += `
                        <div class="gc-item-row">
                            <div class="gc-item-icon-wrap"><img src="${item.img}" style="width:24px; height:24px; object-fit:contain;"></div>
                            <div class="gc-item-info">
                                <div class="gc-item-name">${item.name}</div>
                                <div class="gc-item-desc">${item.desc}</div>
                            </div>
                        </div>
                    `;
                });
            } else {
                dHtml += `<div style="color:#94a3b8; font-size:13px;">暂无道具数据</div>`;
            }
            dHtml += `</div></div>`;

            drawerContent.innerHTML = dHtml;
        }

        container.querySelector('#btn-gc-detail').addEventListener('click', () => {
            renderDetailDrawer();
            drawer.classList.add('open');
        });
        container.querySelector('#btn-gc-close-drawer').addEventListener('click', () => {
            drawer.classList.remove('open');
        });

        // --- 抽卡执行核心 ---
        function executePull(times) {
            const cost = times * 1000;
            if (topWin.playerCurrency.stardust < cost) return;

            topWin.playerCurrency.stardust -= cost;
            updateCurrencyUI();

            const p = pools[currentPoolId];
            const results = [];
            let seenIdols = new Set();
            const db = topWin.idolDatabase || [];
            const currentTotalItemWeight = (typeof topWin.itemPool !== 'undefined') ? topWin.itemPool.reduce((sum, item) => sum + item.weight, 0) : 1;

            for(let i=0; i<times; i++) {
                let roll = Math.random();
                if (roll <= p.idolRate && db.length > 0) {
                    let rIdol = db[Math.floor(Math.random() * db.length)];
                    let isDup = Math.random() < 0.3 || seenIdols.has(rIdol.name);
                    if (isDup) {
                        results.push({ type: 'duplicate', name: rIdol.name, img: rIdol.image });
                    } else {
                        seenIdols.add(rIdol.name);
                        results.push({ type: 'idol', name: rIdol.name, img: rIdol.image });
                    }
                } else {
                    let itemRoll = Math.random();
                    if (itemRoll <= 0.45 || typeof topWin.itemPool === 'undefined') {
                        let sRoll = Math.random() * 100;
                        let amt = 100;
                        if(sRoll<=1) amt=5000; else if(sRoll<=6) amt=1000; else if(sRoll<=20) amt=500; else if(sRoll<=50) amt=300;
                        results.push({ type: 'stardust', amount: amt });
                        topWin.playerCurrency.stardust += amt; // 返还星尘
                    } else {
                        let weightRoll = Math.random() * currentTotalItemWeight;
                        let selectedItem = topWin.itemPool[0];
                        for(let item of topWin.itemPool) {
                            if(weightRoll < item.weight) { selectedItem = item; break; }
                            weightRoll -= item.weight;
                        }
                        results.push({ type: 'item', data: selectedItem });
                    }
                }
            }

            showPullAnimation(results);
        }

        // 动画演出
        function showPullAnimation(results) {
            animOverlay.classList.add('active');
            // 模拟加载动画 1.5秒
            setTimeout(() => {
                animOverlay.classList.remove('active');
                renderResults(results);
            }, 1500);
        }

        // 渲染结果
        function renderResults(results) {
            resGrid.innerHTML = '';
            results.forEach((res, idx) => {
                let delay = idx * 0.1;
                let cHtml = '';

                if (res.type === 'idol') {
                    cHtml = `
                        <div class="gc-res-card type-idol flip-in" style="animation-delay:${delay}s">
                            <div class="gc-res-tag">NEW IDOL</div>
                            <div class="gc-res-img-wrap"><img src="${res.img}"></div>
                            <div class="gc-res-name">${res.name}</div>
                        </div>
                    `;
                } else if (res.type === 'duplicate') {
                    cHtml = `
                        <div class="gc-res-card type-dup flip-in" style="animation-delay:${delay}s">
                            <div class="gc-res-tag">印记转化</div>
                            <div class="gc-res-img-wrap">
                                <img src="${res.img}" class="mark-front">
                                <i class="bi bi-record-circle mark-back"></i>
                            </div>
                            <div class="gc-res-name dup-name" data-name="${res.name}">${res.name}</div>
                        </div>
                    `;
                } else if (res.type === 'stardust') {
                    cHtml = `
                        <div class="gc-res-card type-currency flip-in" style="animation-delay:${delay}s">
                            <div class="gc-res-tag">资源返还</div>
                            <div class="gc-res-img-wrap" style="background:transparent;"><i class="bi bi-stars" style="color:#f59e0b;"></i></div>
                            <div class="gc-res-name">星尘 ×${res.amount}</div>
                        </div>
                    `;
                } else {
                    cHtml = `
                        <div class="gc-res-card type-item flip-in" style="animation-delay:${delay}s">
                            <div class="gc-res-tag">获得道具</div>
                            <div class="gc-res-img-wrap" style="background:transparent;"><img src="${res.data.img}"></div>
                            <div class="gc-res-name">${res.data.name}</div>
                        </div>
                    `;
                }
                resGrid.insertAdjacentHTML('beforeend', cHtml);
            });

            updateCurrencyUI();
            resultOverlay.classList.add('active');

            // 触发重复卡翻转动画
            setTimeout(() => {
                const dupCards = resGrid.querySelectorAll('.type-dup');
                dupCards.forEach(el => {
                    el.classList.add('do-transform');
                    const nameEl = el.querySelector('.dup-name');
                    nameEl.innerText = nameEl.getAttribute('data-name') + '·印记';
                });
            }, 1000 + (results.length * 100)); // 等所有卡片翻转入场后再变印记
        }

        // 按钮绑定
        btnSingle.addEventListener('click', () => executePull(1));
        btnTen.addEventListener('click', () => executePull(10));

        container.querySelector('#btn-res-close').addEventListener('click', () => {
            resultOverlay.classList.remove('active');
        });
        container.querySelector('#btn-res-again').addEventListener('click', () => {
            resultOverlay.classList.remove('active');
            setTimeout(() => executePull(10), 300);
        });

        // 初始化
        updateCurrencyUI();
    };
})();
