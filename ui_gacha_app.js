// ==========================================
// 星探寻访 (Gacha) APP 独立模块 - 偶像大师幻光重制版 v2.2
// 修复：彻底移除硬编码，完美调用外部 item_data.js
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

    // 核心修复：纯净的外部变量抓取逻辑，绝不硬编码！
    const getGlobalItemPool = () => {
        // 尝试从各个可能的作用域抓取哥哥写好的 itemPool
        if (topWin.itemPool && topWin.itemPool.length > 0) return topWin.itemPool;
        if (typeof itemPool !== 'undefined' && itemPool.length > 0) return itemPool;
        if (topWin.parent && topWin.parent.itemPool && topWin.parent.itemPool.length > 0) return topWin.parent.itemPool;
        return []; // 如果没读到就返回空，由界面给出错误提示，绝不擅自写死数据
    };

    if (!topDoc.getElementById('qingzi-gacha-master-style')) {
        const style = topDoc.createElement('style');
        style.id = 'qingzi-gacha-master-style';
        style.innerHTML = `
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

            .imas-item-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
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

            .imas-res-header { text-align: center; padding: 40px 0 20px; }
            .imas-res-title { font-size: 24px; font-weight: 900; letter-spacing: 8px; color: #fff; text-shadow: 0 0 20px rgba(56,189,248,0.5); }

            .imas-res-grid { flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: 25px; padding: 20px 50px; perspective: 1000px; overflow-y: auto;}

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

            /* 对照截图完全重构的结果页底部按钮样式 */
            .imas-res-footer { padding: 30px; display: flex; justify-content: center; align-items: center; gap: 20px; }
            .imas-btn-close-res { padding: 12px 30px; background: #334155; border: 1px solid #475569; border-radius: 30px; color: #f8fafc; font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.2s; min-width: 120px; }
            .imas-btn-close-res:hover { background: #475569; }
            .imas-btn-again { padding: 12px 30px; background: linear-gradient(90deg, #a855f7, #9333ea); border: none; border-radius: 30px; color: #fff; font-size: 14px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4); min-width: 180px; justify-content: center;}
            .imas-btn-again:hover { filter: brightness(1.1); box-shadow: 0 6px 20px rgba(168, 85, 247, 0.6); }

        `;
        topDoc.head.appendChild(style);
    }

    topWin.renderGachaApp = function(container) {
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
        let actualItemPool = getGlobalItemPool(); // 直接抓取哥哥文件里的数据

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
                        <!-- 确认返回与再次发掘按钮 -->
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
            actualItemPool = getGlobalItemPool();
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

            dHtml += `<div class="imas-sec-title">包含资源道具预览</div><div class="imas-item-list">`;

            // 星尘和印记展示
            dHtml += `
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
            `;

            if (actualItemPool && actualItemPool.length > 0) {
                actualItemPool.forEach(item => {
                    dHtml += `
                        <div class="imas-item-row">
                            <img src="${item.img}" class="imas-item-icon">
                            <div class="imas-item-info">
                                <div class="imas-item-name">${item.name}</div>
                                <div class="imas-item-desc">${item.desc}</div>
                            </div>
                        </div>`;
                });
            } else {
                dHtml += `<div style="color:#ef4444; font-size:12px;">未读取到外部道具数据 (请确保 item_data.js 正常加载)</div>`;
            }
            dHtml += `</div>`;

            drawerContent.innerHTML = dHtml;
        }

        container.querySelector('#btn-imas-detail').addEventListener('click', () => { renderDetailDrawer(); drawer.classList.add('open'); });
        container.querySelector('#btn-imas-close-drawer').addEventListener('click', () => { drawer.classList.remove('open'); });

        function executePull(times) {
            actualItemPool = getGlobalItemPool();
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
