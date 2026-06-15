// ==========================================
// 星探寻访 (Gacha) APP 独立模块 - 偶像大师闪耀版
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

    // 尝试获取全局道具池和偶像池
    const getGlobalItems = () => {
        if (typeof itemPool !== 'undefined') return itemPool;
        if (typeof topWin.itemPool !== 'undefined') return topWin.itemPool;
        return [];
    };

    const getGlobalIdols = () => {
        if (typeof idolDatabase !== 'undefined') return idolDatabase;
        if (typeof topWin.idolDatabase !== 'undefined') return topWin.idolDatabase;
        return [];
    };

    // --- 注入专属高阶 CSS (Idolmaster Style) ---
    if (!topDoc.getElementById('qingzi-gacha-style')) {
        const style = topDoc.createElement('style');
        style.id = 'qingzi-gacha-style';
        style.innerHTML = `
            /* 基础容器 - 明亮通透的偶像风格 */
            .gc-container { width: 100%; height: 100%; display: flex; flex-direction: column; background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); font-family: -apple-system, "Microsoft YaHei", sans-serif; position: relative; overflow: hidden; }

            /* 顶部资产栏 */
            .gc-top-bar { height: 60px; background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); display: flex; justify-content: space-between; align-items: center; padding: 0 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); z-index: 10; border-bottom: 1px solid rgba(255,255,255,0.5); }
            .gc-title-wrap { display: flex; align-items: baseline; gap: 10px; }
            .gc-main-title { font-size: 22px; font-weight: 900; color: #3b82f6; letter-spacing: 2px; text-shadow: 0 2px 5px rgba(59,130,246,0.1); }
            .gc-sub-title { font-size: 11px; color: #94a3b8; letter-spacing: 3px; font-weight: bold; }
            .gc-currency { display: flex; align-items: center; gap: 8px; background: #fff; padding: 6px 18px; border-radius: 30px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.02), 0 2px 5px rgba(0,0,0,0.02); border: 1px solid #f1f5f9; }
            .gc-currency i { color: #fbbf24; font-size: 18px; filter: drop-shadow(0 0 2px rgba(251,191,36,0.5)); }
            .gc-currency-val { font-size: 16px; font-weight: 900; font-family: monospace; color: #475569; }

            /* 主界面结构 */
            .gc-main-area { flex: 1; display: flex; overflow: hidden; position: relative; }

            /* 侧边 Tab 栏 */
            .gc-sidebar { width: 200px; background: rgba(255,255,255,0.6); backdrop-filter: blur(10px); border-right: 1px solid rgba(255,255,255,0.8); display: flex; flex-direction: column; padding: 20px 10px; z-index: 5; gap: 10px; }
            .gc-tab { padding: 15px 20px; border-radius: 16px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.3s; color: #64748b; font-weight: bold; font-size: 14px; position: relative; overflow: hidden; }
            .gc-tab:hover { background: rgba(255,255,255,0.9); transform: translateX(5px); }
            .gc-tab.active { background: #fff; color: #db2777; box-shadow: 0 4px 15px rgba(219,39,119,0.1); }
            .gc-tab.active::before { content: ''; position: absolute; left: 0; top: 15%; height: 70%; width: 4px; background: #db2777; border-radius: 0 4px 4px 0; }
            .gc-tab i { font-size: 18px; }
            .gc-tab-badge { margin-left: auto; font-size: 10px; background: linear-gradient(135deg, #f43f5e, #db2777); color: #fff; padding: 2px 6px; border-radius: 10px; box-shadow: 0 2px 5px rgba(219,39,119,0.3); }

            /* 右侧展示区 */
            .gc-content { flex: 1; position: relative; display: flex; flex-direction: column; }

            /* Banner 横幅区 */
            .gc-banner-wrap { flex: 1; position: relative; overflow: hidden; display: flex; align-items: center; }
            .gc-banner-bg { position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; opacity: 0.6; mix-blend-mode: multiply; transition: 0.5s; }

            /* 偶像大师风格的装饰点缀 */
            .gc-decor-circle-1 { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(219,39,119,0.1) 0%, transparent 70%); top: -100px; right: -50px; pointer-events: none; }
            .gc-decor-circle-2 { position: absolute; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%); bottom: -50px; left: 100px; pointer-events: none; }

            .gc-banner-char { position: absolute; right: 5%; bottom: -5%; height: 105%; object-fit: contain; filter: drop-shadow(-5px 10px 20px rgba(0,0,0,0.15)); transition: 0.5s; pointer-events: none; z-index: 2; }

            .gc-banner-info { position: relative; z-index: 3; padding-left: 50px; max-width: 60%; }
            .gc-banner-type { display: inline-block; padding: 6px 16px; background: linear-gradient(135deg, #3b82f6, #60a5fa); color: #fff; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 2px; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(59,130,246,0.3); border: 2px solid rgba(255,255,255,0.5); }
            .gc-banner-type.limited { background: linear-gradient(135deg, #db2777, #f472b6); box-shadow: 0 4px 10px rgba(219,39,119,0.3); }
            .gc-banner-name { font-size: 42px; font-weight: 900; color: #1e293b; margin-bottom: 10px; line-height: 1.2; text-shadow: 2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 5px 15px rgba(0,0,0,0.05); }
            .gc-banner-desc { font-size: 15px; color: #475569; line-height: 1.6; background: rgba(255,255,255,0.6); backdrop-filter: blur(5px); padding: 12px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.8); display: inline-block; }

            /* 底部操作区 */
            .gc-action-bar { height: 110px; background: rgba(255,255,255,0.9); backdrop-filter: blur(15px); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; box-shadow: 0 -5px 20px rgba(0,0,0,0.02); z-index: 10; border-top: 1px solid rgba(255,255,255,0.5); }

            .gc-btn-detail { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: #fff; border: 2px solid #e2e8f0; border-radius: 30px; color: #3b82f6; font-weight: 900; cursor: pointer; transition: 0.3s; font-size: 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
            .gc-btn-detail:hover { border-color: #3b82f6; background: #eff6ff; transform: translateY(-2px); }

            .gc-pull-group { display: flex; gap: 20px; }
            .gc-btn-pull { position: relative; width: 170px; height: 60px; border-radius: 30px; border: 2px solid rgba(255,255,255,0.5); cursor: pointer; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.1); transition: 0.3s; }
            .gc-btn-pull:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 25px rgba(0,0,0,0.15); }
            .gc-btn-pull:active { transform: translateY(1px) scale(0.98); }
            .gc-btn-pull.disabled { opacity: 0.5; pointer-events: none; filter: grayscale(1); }

            .gc-btn-single { background: linear-gradient(135deg, #60a5fa, #3b82f6); color: #fff; }
            .gc-btn-ten { background: linear-gradient(135deg, #fcd34d, #f59e0b); color: #fff; }

            .gc-pull-text { font-size: 16px; font-weight: 900; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 2; }
            .gc-pull-cost { font-size: 12px; display: flex; align-items: center; gap: 4px; opacity: 0.95; font-weight: bold; z-index: 2; margin-top: 2px; }

            .gc-btn-pull::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent); transform: skewX(-20deg); transition: 0.5s; z-index: 1; }
            .gc-btn-pull:hover::before { left: 200%; }

            /* ================= 卡池详情侧边抽屉 ================= */
            .gc-detail-drawer { position: absolute; top: 0; right: -100%; width: 60%; max-width: 600px; height: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); box-shadow: -10px 0 40px rgba(0,0,0,0.1); z-index: 50; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; border-left: 1px solid rgba(255,255,255,0.5); }
            .gc-detail-drawer.open { right: 0; }
            .gc-detail-header { padding: 20px 30px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fff; }
            .gc-detail-title { font-size: 18px; font-weight: 900; color: #1e293b; display: flex; align-items: center; gap: 10px; }
            .gc-btn-close-drawer { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; color: #64748b; cursor: pointer; transition: 0.2s; font-weight: bold; display: flex; align-items: center; justify-content: center;}
            .gc-btn-close-drawer:hover { background: #ef4444; color: #fff; transform: rotate(90deg); }

            .gc-detail-content { flex: 1; overflow-y: auto; padding: 30px; }
            .gc-detail-content::-webkit-scrollbar { width: 6px; }
            .gc-detail-content::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

            .gc-section-title { font-size: 15px; font-weight: 900; color: #db2777; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
            .gc-section-title::before { content: '✦'; color: #f472b6; }

            .gc-rate-box { background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
            .gc-rate-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
            .gc-rate-row:last-child { border-bottom: none; }
            .gc-rate-label { color: #475569; font-weight: bold; }
            .gc-rate-val { color: #1e293b; font-family: monospace; font-weight: 900; font-size: 15px; }
            .gc-val-high { color: #db2777; }

            .gc-idol-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px; margin-bottom: 30px;}
            .gc-idol-item { background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; padding: 12px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.02); transition: 0.2s; }
            .gc-idol-item:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(219,39,119,0.1); border-color: #fbcfe8; }
            .gc-idol-img { width: 65px; height: 65px; object-fit: cover; border-radius: 50%; border: 3px solid #fdf2f8; margin-bottom: 8px; }
            .gc-idol-name { font-size: 12px; font-weight: bold; color: #334155; }

            .gc-item-list { display: flex; flex-direction: column; gap: 12px; }
            .gc-item-row { display: flex; align-items: center; gap: 15px; background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; padding: 12px 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.01); }
            .gc-item-icon-wrap { width: 45px; height: 45px; background: #f8fafc; border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 24px; color: #64748b; flex-shrink: 0; }
            .gc-item-info { flex: 1; }
            .gc-item-name { font-size: 14px; font-weight: 900; color: #1e293b; margin-bottom: 4px; }
            .gc-item-desc { font-size: 12px; color: #64748b; line-height: 1.4; }

            /* ================= 抽卡闪耀动画层 ================= */
            .gc-anim-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: #fff; z-index: 100; display: none; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
            .gc-anim-overlay.active { display: flex; opacity: 1; }
            .gc-anim-bg { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle, #fff 0%, #fdf2f8 100%); animation: flashBg 1s infinite alternate; }
            @keyframes flashBg { from { filter: brightness(1); } to { filter: brightness(1.2); } }
            .gc-anim-text { position: relative; z-index: 2; color: #db2777; font-size: 28px; font-weight: 900; letter-spacing: 8px; text-shadow: 0 4px 15px rgba(219,39,119,0.3); animation: pulseText 1s infinite; }
            @keyframes pulseText { 0% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.8; } }
            .gc-star-particle { position: absolute; color: #fbbf24; font-size: 24px; animation: floatStar 1.5s ease-out forwards; }
            @keyframes floatStar { 0% { transform: translateY(0) scale(0); opacity: 1; } 100% { transform: translateY(-100px) scale(1.5) rotate(180deg); opacity: 0; } }

            /* ================= 结果展示层 ================= */
            .gc-result-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); z-index: 110; display: none; flex-direction: column; opacity: 0; transition: opacity 0.5s; }
            .gc-result-overlay.active { display: flex; opacity: 1; }
            .gc-res-header { text-align: center; padding: 40px 0 20px; position: relative; z-index: 2;}
            .gc-res-title { color: #db2777; font-size: 28px; font-weight: 900; letter-spacing: 6px; text-shadow: 0 4px 15px rgba(219,39,119,0.2); }

            .gc-res-grid { flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: 20px; padding: 20px 40px; overflow-y: auto; perspective: 1000px; z-index: 2;}

            .gc-res-card { width: 130px; height: 180px; background: #fff; border-radius: 16px; display: flex; flex-direction: column; align-items: center; padding: 15px 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); position: relative; transform-style: preserve-3d; transform: rotateY(90deg) translateY(20px); opacity: 0; border: 2px solid transparent; }
            .gc-res-card.flip-in { animation: cardFlipIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            @keyframes cardFlipIn { to { transform: rotateY(0deg) translateY(0); opacity: 1; } }

            /* 卡片品质分类 (偶像大师风) */
            .gc-res-card.type-idol { background: linear-gradient(180deg, #fffbeb, #fef3c7); border-color: #fcd34d; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.2); }
            .gc-res-card.type-dup { background: linear-gradient(180deg, #eff6ff, #dbeafe); border-color: #93c5fd; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2); }
            .gc-res-card.type-item { background: #fff; border-color: #e2e8f0; }
            .gc-res-card.type-currency { background: linear-gradient(180deg, #f8fafc, #f1f5f9); border-color: #cbd5e1; }

            .gc-res-tag { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 900; color: #fff; padding: 4px 12px; border-radius: 20px; z-index: 5; box-shadow: 0 4px 10px rgba(0,0,0,0.1); white-space: nowrap; border: 2px solid #fff; }
            .type-idol .gc-res-tag { background: linear-gradient(135deg, #f43f5e, #db2777); }
            .type-dup .gc-res-tag { background: linear-gradient(135deg, #3b82f6, #2563eb); }
            .type-item .gc-res-tag { background: #64748b; }
            .type-currency .gc-res-tag { background: #10b981; }

            .gc-res-img-wrap { width: 75px; height: 75px; margin-top: 15px; margin-bottom: 15px; position: relative; border-radius: 50%; overflow: hidden; background: #fff; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 2px 5px rgba(0,0,0,0.05), 0 4px 10px rgba(0,0,0,0.05); border: 3px solid #fff; }
            .type-idol .gc-res-img-wrap, .type-dup .gc-res-img-wrap { border-radius: 12px; } /* 偶像用方角 */
            .gc-res-img-wrap img { width: 100%; height: 100%; object-fit: contain; }
            .gc-res-img-wrap i { font-size: 36px; color: #94a3b8; }

            .gc-res-name { font-size: 13px; font-weight: 900; text-align: center; line-height: 1.3; width: 100%; color: #334155; }

            /* 重复印记翻转特效 */
            .gc-res-card.type-dup .gc-res-img-wrap img.mark-front, .gc-res-card.type-dup .gc-res-img-wrap img.mark-back { position: absolute; top:0; left:0; width:100%; height:100%; backface-visibility: hidden; transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .gc-res-card.type-dup .gc-res-img-wrap img.mark-front { transform: rotateY(0deg); }
            .gc-res-card.type-dup .gc-res-img-wrap img.mark-back { transform: rotateY(180deg); background: #fdf2f8; padding: 10px; }
            .gc-res-card.do-transform .mark-front { transform: rotateY(-180deg) !important; }
            .gc-res-card.do-transform .mark-back { transform: rotateY(0deg) !important; }

            .gc-res-footer { padding: 30px; display: flex; justify-content: center; gap: 20px; position: relative; z-index: 2; border-top: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.8); }
            .gc-btn-res { padding: 15px 40px; border-radius: 30px; font-size: 15px; font-weight: 900; cursor: pointer; border: none; transition: 0.3s; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .gc-btn-res-close { background: #fff; color: #475569; border: 2px solid #e2e8f0; }
            .gc-btn-res-close:hover { background: #f1f5f9; transform: translateY(-2px); }
            .gc-btn-res-again { background: linear-gradient(135deg, #fcd34d, #f59e0b); color: #fff; }
            .gc-btn-res-again:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3); }
        `;
        topDoc.head.appendChild(style);
    }

    topWin.renderGachaApp = function(container) {
        // 读取全局数据
        const itemsDb = getGlobalItems();
        const idolsDb = getGlobalIdols();

        // 模拟卡池配置
        const pools = {
            'standard': {
                id: 'standard',
                name: '常驻星探发掘',
                desc: '在街头巷尾发掘闪耀的原石，扩充事务所战力吧。',
                bg: 'https://i.postimg.cc/1zbqS7K3/bg-standard.jpg', // 默认浅色背景
                charImg: '',
                idolRate: 0.04,
                typeLabel: '常驻发掘',
                isLimited: false
            },
            'limited': {
                id: 'limited',
                name: '【限定】星光闪耀之夜',
                desc: '本期特选偶像发掘概率大幅提升！绝不容错过的相遇。',
                bg: 'https://i.postimg.cc/1zbqS7K3/bg-standard.jpg',
                charImg: idolsDb.length > 0 ? idolsDb[0].image : '',
                idolRate: 0.08,
                typeLabel: '限定发掘',
                isLimited: true
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
                            <div class="gc-decor-circle-1"></div>
                            <div class="gc-decor-circle-2"></div>
                            <img src="${pools[currentPoolId].charImg}" class="gc-banner-char" id="gc-banner-char" style="display:${pools[currentPoolId].charImg?'block':'none'};">

                            <div class="gc-banner-info">
                                <div class="gc-banner-type" id="gc-banner-type">${pools[currentPoolId].typeLabel}</div>
                                <div class="gc-banner-name" id="gc-banner-name">${pools[currentPoolId].name}</div>
                                <div class="gc-banner-desc" id="gc-banner-desc">${pools[currentPoolId].desc}</div>
                            </div>
                        </div>

                        <div class="gc-action-bar">
                            <button class="gc-btn-detail" id="btn-gc-detail">
                                <i class="bi bi-search"></i> 卡池情报
                            </button>

                            <div class="gc-pull-group">
                                <button class="gc-btn-pull gc-btn-single" id="btn-gc-single">
                                    <span class="gc-pull-text">发掘 1 次</span>
                                    <div class="gc-pull-cost"><i class="bi bi-stars" style="color:#fcd34d;"></i> 1000</div>
                                </button>
                                <button class="gc-btn-pull gc-btn-ten" id="btn-gc-ten">
                                    <span class="gc-pull-text">发掘 10 次</span>
                                    <div class="gc-pull-cost"><i class="bi bi-stars" style="color:#fef3c7;"></i> 10000</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 侧边详情抽屉 -->
                <div class="gc-detail-drawer" id="gc-detail-drawer">
                    <div class="gc-detail-header">
                        <div class="gc-detail-title">卡池情报公示</div>
                        <button class="gc-btn-close-drawer" id="btn-gc-close-drawer"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="gc-detail-content" id="gc-detail-content"></div>
                </div>

                <!-- 抽卡动画层 -->
                <div class="gc-anim-overlay" id="gc-anim-overlay">
                    <div class="gc-anim-bg"></div>
                    <div class="gc-anim-text">✨ 正在发掘闪耀的原石...</div>
                </div>

                <!-- 抽卡结果层 -->
                <div class="gc-result-overlay" id="gc-result-overlay">
                    <div class="gc-res-header">
                        <div class="gc-res-title">发掘结果报告</div>
                    </div>
                    <div class="gc-res-grid" id="gc-res-grid"></div>
                    <div class="gc-res-footer">
                        <button class="gc-btn-res gc-btn-res-close" id="btn-res-close">确认并返回</button>
                        <button class="gc-btn-res gc-btn-res-again" id="btn-res-again"><i class="bi bi-arrow-repeat"></i> 再次十连 (10000 <i class="bi bi-stars" style="color:#f59e0b;"></i>)</button>
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

        function updateCurrencyUI() {
            uiStardust.innerText = topWin.playerCurrency.stardust;
            if (topWin.playerCurrency.stardust < 1000) btnSingle.classList.add('disabled'); else btnSingle.classList.remove('disabled');
            if (topWin.playerCurrency.stardust < 10000) btnTen.classList.add('disabled'); else btnTen.classList.remove('disabled');
        }

        // Tab 切换逻辑
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
                if(p.isLimited) uiBannerType.classList.add('limited'); else uiBannerType.classList.remove('limited');
                uiBannerName.innerText = p.name;
                uiBannerDesc.innerText = p.desc;
            });
        });

        // 渲染卡池详情
        function renderDetailDrawer() {
            const p = pools[currentPoolId];
            const iRate = p.idolRate * 100;
            const resRate = 1 - p.idolRate;
            const starRate = (resRate * 0.45) * 100;
            const itemRate = (resRate * 0.55) * 100;

            let dHtml = `
                <div class="gc-section-title">综合获取概率</div>
                <div class="gc-rate-box">
                    <div class="gc-rate-row"><span class="gc-rate-label">✦ 偶像发掘率</span><span class="gc-rate-val gc-val-high">${iRate.toFixed(1)}%</span></div>
                    <div class="gc-rate-row"><span class="gc-rate-label">📦 资源道具发掘率</span><span class="gc-rate-val">${itemRate.toFixed(1)}%</span></div>
                    <div class="gc-rate-row"><span class="gc-rate-label">✨ 星尘返还率</span><span class="gc-rate-val">${starRate.toFixed(1)}%</span></div>
                </div>

                <div class="gc-section-title">可发掘偶像预览</div>
                <div class="gc-idol-grid">
            `;
            if (idolsDb.length > 0) {
                idolsDb.forEach(idol => {
                    dHtml += `<div class="gc-idol-item"><img src="${idol.image}" class="gc-idol-img"><div class="gc-idol-name">${idol.name}</div></div>`;
                });
            } else {
                dHtml += `<div style="grid-column:1/-1; color:#94a3b8; font-size:13px; text-align:center;">暂无偶像数据</div>`;
            }
            dHtml += `</div>`;

            dHtml += `
                <div class="gc-section-title">包含道具预览</div>
                <div class="gc-item-list">
            `;
            if (itemsDb.length > 0) {
                itemsDb.forEach(item => {
                    dHtml += `
                        <div class="gc-item-row">
                            <div class="gc-item-icon-wrap"><img src="${item.img}" style="width:28px; height:28px; object-fit:contain;"></div>
                            <div class="gc-item-info">
                                <div class="gc-item-name">${item.name}</div>
                                <div class="gc-item-desc">${item.desc}</div>
                            </div>
                        </div>
                    `;
                });
            } else {
                dHtml += `<div style="color:#94a3b8; font-size:13px; text-align:center; padding: 20px;">未读取到道具数据，请检查 item_data.js 是否加载</div>`;
            }
            dHtml += `</div>`;
            drawerContent.innerHTML = dHtml;
        }

        container.querySelector('#btn-gc-detail').addEventListener('click', () => { renderDetailDrawer(); drawer.classList.add('open'); });
        container.querySelector('#btn-gc-close-drawer').addEventListener('click', () => { drawer.classList.remove('open'); });

        // --- 抽卡执行与动画 ---
        function executePull(times) {
            const cost = times * 1000;
            if (topWin.playerCurrency.stardust < cost) return;

            topWin.playerCurrency.stardust -= cost;
            updateCurrencyUI();

            const p = pools[currentPoolId];
            const results = [];
            let seenIdols = new Set();
            const currentTotalItemWeight = itemsDb.length > 0 ? itemsDb.reduce((sum, item) => sum + item.weight, 0) : 1;
            const markIcon = 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png';
            const stardustIcon = 'https://i.postimg.cc/JhBnDD5Y/xing-chen-png-xiao.png';

            for(let i=0; i<times; i++) {
                let roll = Math.random();
                if (roll <= p.idolRate && idolsDb.length > 0) {
                    let rIdol = idolsDb[Math.floor(Math.random() * idolsDb.length)];
                    let isDup = Math.random() < 0.3 || seenIdols.has(rIdol.name);
                    if (isDup) {
                        results.push({ type: 'duplicate', name: rIdol.name, idolImg: rIdol.image, markImg: markIcon });
                    } else {
                        seenIdols.add(rIdol.name);
                        results.push({ type: 'idol', name: rIdol.name, img: rIdol.image });
                    }
                } else {
                    let itemRoll = Math.random();
                    if (itemRoll <= 0.45 || itemsDb.length === 0) {
                        let sRoll = Math.random() * 100;
                        let amt = sRoll<=1 ? 5000 : (sRoll<=6 ? 1000 : (sRoll<=20 ? 500 : (sRoll<=50 ? 300 : 100)));
                        results.push({ type: 'stardust', amount: amt, img: stardustIcon });
                        topWin.playerCurrency.stardust += amt;
                    } else {
                        let weightRoll = Math.random() * currentTotalItemWeight;
                        let selectedItem = itemsDb[0];
                        for(let item of itemsDb) {
                            if(weightRoll < item.weight) { selectedItem = item; break; }
                            weightRoll -= item.weight;
                        }
                        results.push({ type: 'item', data: selectedItem });
                    }
                }
            }

            // 播放动画
            animOverlay.classList.add('active');

            // 制造几个星星特效
            for(let i=0; i<5; i++) {
                let star = topDoc.createElement('div');
                star.className = 'gc-star-particle';
                star.innerHTML = '✨';
                star.style.left = (Math.random() * 80 + 10) + '%';
                star.style.top = (Math.random() * 50 + 50) + '%';
                star.style.animationDelay = (Math.random() * 0.5) + 's';
                animOverlay.appendChild(star);
                setTimeout(() => star.remove(), 1500);
            }

            setTimeout(() => {
                animOverlay.classList.remove('active');
                renderResults(results);
            }, 1800); // 动画持续1.8秒后出结果
        }

        // 渲染结果卡片
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
                                <img src="${res.idolImg}" class="mark-front">
                                <img src="${res.markImg}" class="mark-back">
                            </div>
                            <div class="gc-res-name dup-name" data-name="${res.name}">${res.name}</div>
                        </div>
                    `;
                } else if (res.type === 'stardust') {
                    cHtml = `
                        <div class="gc-res-card type-currency flip-in" style="animation-delay:${delay}s">
                            <div class="gc-res-tag">资源返还</div>
                            <div class="gc-res-img-wrap"><img src="${res.img}"></div>
                            <div class="gc-res-name">星尘 ×${res.amount}</div>
                        </div>
                    `;
                } else {
                    cHtml = `
                        <div class="gc-res-card type-item flip-in" style="animation-delay:${delay}s">
                            <div class="gc-res-tag">获得道具</div>
                            <div class="gc-res-img-wrap"><img src="${res.data.img}"></div>
                            <div class="gc-res-name">${res.data.name}</div>
                        </div>
                    `;
                }
                resGrid.insertAdjacentHTML('beforeend', cHtml);
            });

            updateCurrencyUI();
            resultOverlay.classList.add('active');

            // 触发重复印记翻转
            setTimeout(() => {
                const dupCards = resGrid.querySelectorAll('.type-dup');
                dupCards.forEach(el => {
                    el.classList.add('do-transform');
                    const nameEl = el.querySelector('.dup-name');
                    nameEl.innerText = nameEl.getAttribute('data-name') + '·印记';
                });
            }, 1000 + (results.length * 100));
        }

        // 按钮绑定
        btnSingle.addEventListener('click', () => executePull(1));
        btnTen.addEventListener('click', () => executePull(10));
        container.querySelector('#btn-res-close').addEventListener('click', () => resultOverlay.classList.remove('active'));
        container.querySelector('#btn-res-again').addEventListener('click', () => {
            resultOverlay.classList.remove('active');
            setTimeout(() => executePull(10), 400);
        });

        // 初始化
        updateCurrencyUI();
    };
})();
