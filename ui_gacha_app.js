// ==========================================
// 星探寻访 (Gacha) APP 独立模块 - 顶级企划视觉重制版 v3.0
// 优化：参考偶像大师风格的深邃配色、舞台光影布局与修长卡片设计
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

    // 强化获取外部数据的逻辑
    const getGlobalItemPool = () => {
        if (topWin.itemPool && topWin.itemPool.length > 0) return topWin.itemPool;
        if (typeof itemPool !== 'undefined' && itemPool.length > 0) return itemPool;
        if (topWin.parent && topWin.parent.itemPool && topWin.parent.itemPool.length > 0) return topWin.parent.itemPool;
        return [];
    };

    if (!topDoc.getElementById('qingzi-gacha-master-style')) {
        const style = topDoc.createElement('style');
        style.id = 'qingzi-gacha-master-style';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,700;0,900;1,900&family=Noto+Sans+SC:wght@400;700;900&display=swap');

            /* 基础色彩变量与通用设定 */
            :root {
                --gacha-bg-dark: #0a0f1d;
                --gacha-bg-card: #151b2b;
                --gacha-border-light: rgba(255,255,255,0.15);
                --gacha-accent-blue: #38bdf8;
                --gacha-accent-pink: #f472b6;
                --gacha-accent-gold: #fbbf24;
                --gacha-btn-purple: linear-gradient(135deg, #a855f7, #7e22ce);
            }

            .imas-container { width: 100%; height: 100%; display: flex; flex-direction: column; background: var(--gacha-bg-dark); font-family: 'Noto Sans SC', sans-serif; position: relative; overflow: hidden; color: #fff; }

            /* ================= 主界面顶部 ================= */
            .imas-topbar { height: 60px; background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%); display: flex; justify-content: flex-end; align-items: center; padding: 0 30px; z-index: 20; position: absolute; top:0; right:0; width: 100%; pointer-events: none;}
            .imas-currency { display: flex; align-items: center; gap: 8px; background: rgba(20, 25, 40, 0.8); backdrop-filter: blur(10px); padding: 8px 24px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); pointer-events: auto; box-shadow: 0 4px 15px rgba(0,0,0,0.5);}
            .imas-currency i { color: #c084fc; font-size: 18px; filter: drop-shadow(0 0 5px rgba(192, 132, 252, 0.5)); }
            .imas-currency span { font-size: 18px; font-weight: 900; font-family: 'Montserrat', sans-serif; color: #fff; letter-spacing: 1px;}

            /* ================= 主界面布局 ================= */
            .imas-main { flex: 1; display: flex; position: relative; padding-top: 20px;}

            /* 左侧卡池列表 */
            .imas-pool-list { width: 280px; padding: 60px 0 20px 20px; display: flex; flex-direction: column; gap: 15px; z-index: 10; }
            .imas-pool-tab { position: relative; padding: 18px 20px; background: rgba(255,255,255,0.03); border-radius: 12px 0 0 12px; cursor: pointer; transition: 0.3s; border: 1px solid transparent; border-right: none; overflow: hidden; }
            .imas-pool-tab:hover { background: rgba(255,255,255,0.08); }
            .imas-pool-tab.active { background: linear-gradient(90deg, rgba(56, 189, 248, 0.15), transparent); border-color: rgba(56, 189, 248, 0.3); }
            .imas-pool-tab.active::before { content: ''; position: absolute; left: 0; top: 0; width: 5px; height: 100%; background: #38bdf8; box-shadow: 0 0 15px #38bdf8; }
            .imas-pool-name { font-size: 15px; font-weight: bold; color: #94a3b8; position: relative; z-index: 2; transition: 0.3s;}
            .imas-pool-tab.active .imas-pool-name { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); }

            /* 右侧展示区 */
            .imas-content { flex: 1; position: relative; margin: 0 20px 20px 0; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8); border: 1px solid var(--gacha-border-light); display: flex; flex-direction: column; background: #000; }

            .imas-banner-bg { position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; opacity: 0.5; transition: opacity 0.5s; }
            .imas-banner-char { position: absolute; right: -5%; bottom: -5%; height: 120%; object-fit: contain; filter: drop-shadow(-20px 0 30px rgba(0,0,0,0.8)); transition: 0.5s; pointer-events: none; }
            .imas-gradient-mask { position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(90deg, rgba(10,15,29,0.9) 0%, rgba(10,15,29,0.2) 60%, transparent 100%); pointer-events: none;}

            .imas-banner-info { position: absolute; left: 50px; top: 50px; z-index: 5; max-width: 55%; }
            .imas-banner-type { display: inline-block; padding: 6px 20px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); color: #fff; border-radius: 30px; font-size: 13px; font-weight: 900; letter-spacing: 3px; margin-bottom: 20px; font-family: 'Montserrat', sans-serif; font-style: italic;}
            .imas-banner-title { font-size: 48px; font-weight: 900; line-height: 1.1; margin-bottom: 20px; text-shadow: 0 4px 20px rgba(0,0,0,0.8); letter-spacing: 2px;}
            .imas-banner-desc { font-size: 15px; color: #cbd5e1; line-height: 1.6; text-shadow: 0 2px 5px rgba(0,0,0,0.8); background: rgba(0,0,0,0.3); padding: 15px 20px; border-radius: 12px; backdrop-filter: blur(5px); border-left: 4px solid var(--gacha-accent-blue);}

            /* 底部操作区 */
            .imas-action-area { position: absolute; bottom: 0; left: 0; width: 100%; height: 130px; background: linear-gradient(to top, rgba(10,15,29,0.95) 0%, rgba(10,15,29,0.5) 70%, transparent 100%); display: flex; justify-content: space-between; align-items: flex-end; padding: 0 50px 30px; z-index: 10; }

            .imas-btn-detail { padding: 12px 25px; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: #fff; cursor: pointer; transition: 0.2s; font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 8px; }
            .imas-btn-detail:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.5); }

            .imas-pull-group { display: flex; gap: 20px; }
            .imas-btn-pull { position: relative; width: 190px; height: 65px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); transition: 0.2s; }
            .imas-btn-pull:hover { transform: translateY(-3px); filter: brightness(1.15); }
            .imas-btn-pull:active { transform: translateY(1px); }
            .imas-btn-pull.disabled { opacity: 0.4; pointer-events: none; filter: grayscale(1); }

            .imas-btn-single { background: linear-gradient(135deg, #1e3a8a, #3b82f6); border-top-color: #93c5fd;}
            .imas-btn-ten { background: var(--gacha-btn-purple); border-top-color: #d8b4fe; box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 10px 25px rgba(0,0,0,0.5); }

            .imas-pull-text { font-size: 16px; font-weight: 900; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5); z-index: 2; letter-spacing: 1px;}
            .imas-pull-cost { font-size: 14px; display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.9); font-weight: bold; font-family: 'Montserrat', sans-serif; z-index: 2; margin-top: 2px; }

            /* ================= 抽卡全屏动画层 ================= */
            .imas-anim-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: #000; z-index: 100; display: none; align-items: center; justify-content: center; overflow: hidden; }
            .imas-anim-overlay.active { display: flex; }
            .imas-star-center { width: 2px; height: 2px; background: #fff; border-radius: 50%; box-shadow: 0 0 50px 20px #c084fc; position: relative; }
            .imas-star-center::before, .imas-star-center::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; }
            .imas-star-center::before { width: 200vw; height: 2px; box-shadow: 0 0 20px #c084fc; animation: beamExpandX 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .imas-star-center::after { width: 2px; height: 200vh; box-shadow: 0 0 20px #c084fc; animation: beamExpandY 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            @keyframes beamExpandX { 0% { width: 0; opacity: 1; } 100% { width: 200vw; opacity: 0; } }
            @keyframes beamExpandY { 0% { height: 0; opacity: 1; } 100% { height: 200vh; opacity: 0; } }

            /* ================= 结果展示层 (完全参照截图美化) ================= */
            .imas-res-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: radial-gradient(circle at 50% 30%, #1a2235 0%, #0a0f1d 100%); z-index: 110; display: none; flex-direction: column; opacity: 0; transition: 0.4s; overflow: hidden;}
            .imas-res-overlay.active { display: flex; opacity: 1; }

            /* 舞台背景光效 */
            .stage-light-left { position: absolute; top: -20%; left: 10%; width: 200px; height: 150%; background: linear-gradient(to bottom, rgba(56,189,248,0.1) 0%, transparent 100%); transform: rotate(15deg); pointer-events: none;}
            .stage-light-right { position: absolute; top: -20%; right: 10%; width: 200px; height: 150%; background: linear-gradient(to bottom, rgba(244,114,182,0.1) 0%, transparent 100%); transform: rotate(-15deg); pointer-events: none;}

            .imas-res-header { text-align: center; padding: 40px 0 20px; flex-shrink: 0; position: relative; z-index: 2;}
            .imas-res-title { font-size: 28px; font-weight: 900; letter-spacing: 10px; color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.5); font-family: 'Montserrat', sans-serif;}

            /* 修复10连顶部遮挡：增加内边距，居中偏上排列 */
            .imas-res-grid { flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-content: flex-start; gap: 20px 25px; padding: 30px 40px 100px; perspective: 1200px; overflow-y: auto; z-index: 2; position: relative;}
            .imas-res-grid::-webkit-scrollbar { display: none; } /* 隐藏滚动条让视觉更干净 */

            /* 卡片尺寸调整：更加修长 */
            .imas-res-card { width: 140px; height: 210px; background: var(--gacha-bg-card); border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; align-items: center; padding: 25px 10px 15px; position: relative; transform-style: preserve-3d; transform: rotateY(90deg); opacity: 0; box-shadow: 0 15px 35px rgba(0,0,0,0.6); }
            .imas-res-card.flip-in { animation: cardFlipIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            @keyframes cardFlipIn { to { transform: rotateY(0deg); opacity: 1; } }

            /* 不同类型卡片的高级质感背景 */
            .imas-res-card.is-idol { background: linear-gradient(180deg, #2a2015 0%, #1a150b 100%); border-color: rgba(251,191,36,0.3); box-shadow: 0 0 30px rgba(251,191,36,0.15), inset 0 0 20px rgba(251,191,36,0.05); }
            .imas-res-card.is-dup { background: linear-gradient(180deg, #152033 0%, #0b1322 100%); border-color: rgba(56,189,248,0.3); box-shadow: 0 0 30px rgba(56,189,248,0.15); }
            .imas-res-card.type-item { background: linear-gradient(180deg, #1c2230 0%, #0d121c 100%); }
            .imas-res-card.type-currency { background: linear-gradient(180deg, #1e1b2e 0%, #110f1c 100%); }

            /* 顶部标签：嵌入卡片边缘 */
            .imas-res-tag { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 12px; color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.4); white-space: nowrap; z-index: 10;}
            .is-idol .imas-res-tag { background: linear-gradient(90deg, #f59e0b, #d97706); }
            .is-dup .imas-res-tag { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
            .type-item .imas-res-tag { background: linear-gradient(90deg, #475569, #334155); }
            .type-currency .imas-res-tag { background: linear-gradient(90deg, #6366f1, #4f46e5); }

            /* 物品图标容器 */
            .imas-res-img-wrap { width: 85px; height: 85px; margin-top: auto; margin-bottom: 25px; display: flex; justify-content: center; align-items: center; position: relative; }
            .imas-res-img-wrap img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5)); transition: transform 0.3s;}
            .imas-res-card:hover .imas-res-img-wrap img { transform: translateY(-5px) scale(1.05); }

            .imas-res-name { font-size: 13px; font-weight: bold; text-align: center; color: #e2e8f0; width: 100%; margin-top: auto;}

            /* 翻转动画所需 */
            .imas-res-card.is-dup .mark-front, .imas-res-card.is-dup .mark-back { position: absolute; top:0; left:0; width:100%; height:100%; backface-visibility: hidden; transition: transform 0.6s; }
            .imas-res-card.is-dup .mark-front { transform: rotateY(0deg); }
            .imas-res-card.is-dup .mark-back { transform: rotateY(180deg); padding: 10px; }
            .imas-res-card.do-transform .mark-front { transform: rotateY(-180deg) !important; }
            .imas-res-card.do-transform .mark-back { transform: rotateY(0deg) !important; }

            /* 底部操作区 (完美还原截图) */
            .imas-res-footer { position: absolute; bottom: 0; left: 0; width: 100%; padding: 30px; display: flex; justify-content: center; align-items: center; gap: 20px; background: linear-gradient(to top, rgba(10,15,29,1) 0%, rgba(10,15,29,0.8) 50%, transparent 100%); z-index: 10;}
            .imas-btn-close-res { padding: 14px 40px; background: #1e293b; border: 1px solid #475569; border-radius: 30px; color: #e2e8f0; font-size: 15px; font-weight: bold; cursor: pointer; transition: 0.2s; min-width: 140px; }
            .imas-btn-close-res:hover { background: #334155; color: #fff;}
            .imas-btn-again { padding: 14px 40px; background: var(--gacha-btn-purple); border: 1px solid rgba(255,255,255,0.2); border-radius: 30px; color: #fff; font-size: 15px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.2s; box-shadow: 0 8px 20px rgba(168, 85, 247, 0.4); min-width: 220px; justify-content: center;}
            .imas-btn-again:hover { filter: brightness(1.15); box-shadow: 0 10px 25px rgba(168, 85, 247, 0.6); transform: translateY(-2px);}
            .imas-btn-again i { font-size: 16px; }

            /* ================= 详情侧边栏 ================= */
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
            .imas-item-row { display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
            .imas-item-icon { width: 40px; height: 40px; border-radius: 6px; background: rgba(0,0,0,0.3); object-fit: contain; padding: 2px;}
            .imas-item-info { flex: 1; }
            .imas-item-name { font-size: 13px; font-weight: bold; color: #fff; margin-bottom: 4px; }
            .imas-item-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; }

            .imas-idol-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 15px; margin-bottom: 30px; }
            .imas-idol-card { background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
            .imas-idol-img { width: 60px; height: 60px; object-fit: cover; border-radius: 50%; margin-bottom: 8px; border: 2px solid #38bdf8; }
            .imas-idol-name { font-size: 11px; font-weight: bold; color: #e2e8f0; }

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
        let actualItemPool = getGlobalItemPool();

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
                    <div class="stage-light-left"></div>
                    <div class="stage-light-right"></div>
                    <div class="imas-res-header"><div class="imas-res-title">SCOUT RESULT</div></div>
                    <div class="imas-res-grid" id="imas-res-grid"></div>
                    <div class="imas-res-footer">
                        <button class="imas-btn-close-res" id="btn-res-close">确认返回</button>
                        <button class="imas-btn-again" id="btn-res-again"><i class="bi bi-arrow-repeat"></i> 再次发掘 (10000)</button>
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

                    uiBannerBg.style.opacity = 0.5;
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
                        dHtml += `<div class="imas-item-row"><img src="${item.img}" class="imas-item-icon"><div class="imas-item-info"><div class="imas-item-name">${item.name}</div><div class="imas-item-desc">${item.desc}</div></div></div>`;
                    });
                    dHtml += `</div>`;
                }

                const psychItems = actualItemPool.filter(i => i.type === 'psychology');
                if(psychItems.length > 0) {
                    dHtml += `<div class="imas-cate-title">❤️ 心理与状态干预</div><div class="imas-item-list">`;
                    psychItems.forEach(item => {
                        dHtml += `<div class="imas-item-row"><img src="${item.img}" class="imas-item-icon"><div class="imas-item-info"><div class="imas-item-name">${item.name}</div><div class="imas-item-desc">${item.desc}</div></div></div>`;
                    });
                    dHtml += `</div>`;
                }

                const eggItems = actualItemPool.filter(i => i.type === 'easter_egg');
                if(eggItems.length > 0) {
                    dHtml += `<div class="imas-cate-title">🎁 特殊彩蛋与剧情</div><div class="imas-item-list">`;
                    eggItems.forEach(item => {
                        dHtml += `<div class="imas-item-row"><img src="${item.img}" class="imas-item-icon"><div class="imas-item-info"><div class="imas-item-name">${item.name}</div><div class="imas-item-desc">${item.desc}</div></div></div>`;
                    });
                    dHtml += `</div>`;
                }
            } else {
                dHtml += `<div style="color:#ef4444; font-size:12px;">未读取到道具数据</div>`;
            }

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
                            <div class="imas-res-img-wrap"><img src="${res.img}"></div>
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
                            <div class="imas-res-img-wrap"><img src="https://i.postimg.cc/JhBnDD5Y/xing-chen-png-xiao.png"></div>
                            <div class="imas-res-name">星尘 ×${res.amount}</div>
                        </div>
                    `;
                } else {
                    cHtml = `
                        <div class="imas-res-card type-item flip-in" style="animation-delay:${delay}s">
                            <div class="imas-res-tag">获得道具</div>
                            <div class="imas-res-img-wrap"><img src="${res.data.img}"></div>
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
