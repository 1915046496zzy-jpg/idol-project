// ==========================================
// 星探寻访 (Gacha) APP 独立模块 (华丽重制版)
// 包含：常驻/限定卡池切换、详细内容公示、抽卡过场动画
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

    if (!topDoc.getElementById('qingzi-gacha-style-v2')) {
        const style = topDoc.createElement('style');
        style.id = 'qingzi-gacha-style-v2';
        style.innerHTML = `
            /* 基础容器 */
            .gacha-app-container { display: flex; flex-direction: column; height: 100%; background: #0f172a; color: #fff; font-family: 'Microsoft YaHei', sans-serif; position: relative; overflow: hidden; }

            /* 顶部 Tab */
            .gacha-tabs { display: flex; padding: 15px 20px 0; gap: 10px; background: #1e293b; border-bottom: 1px solid #334155; z-index: 10; }
            .gacha-tab { padding: 10px 20px; font-size: 14px; font-weight: bold; color: #94a3b8; cursor: pointer; border-radius: 12px 12px 0 0; transition: 0.3s; position: relative; }
            .gacha-tab.active { color: #fff; background: #334155; }
            .gacha-tab.active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60%; height: 3px; background: #ec4899; border-radius: 3px 3px 0 0; }

            /* 主展示区 (Banner) */
            .gacha-main-view { flex: 1; display: flex; flex-direction: column; overflow-y: auto; position: relative; }
            .gacha-banner-wrap { padding: 20px; }
            .gacha-banner { position: relative; height: 220px; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; justify-content: center; padding: 30px; border: 2px solid rgba(255,255,255,0.1); transition: 0.5s; }
            .gacha-banner::before { content: ''; position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.2) 100%); z-index: 1; }
            .gacha-banner-bg { position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; z-index: 0; opacity: 0.6; }

            .banner-standard .gacha-banner-bg { background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
            .banner-limited .gacha-banner-bg { background: linear-gradient(135deg, #f59e0b, #ef4444); }

            .gacha-banner-content { position: relative; z-index: 2; }
            .gacha-banner-tag { display: inline-block; padding: 4px 12px; background: rgba(236,72,153,0.8); border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 2px; margin-bottom: 10px; backdrop-filter: blur(5px); }
            .gacha-banner-title { font-size: 28px; font-weight: 900; letter-spacing: 2px; text-shadow: 0 2px 10px rgba(0,0,0,0.8); margin-bottom: 5px; }
            .gacha-banner-sub { font-size: 13px; color: #cbd5e1; }

            /* 详情入口 */
            .gacha-detail-btn-wrap { display: flex; justify-content: center; margin-top: 10px; }
            .btn-show-detail { background: rgba(51,65,85,0.8); border: 1px solid #475569; color: #cbd5e1; padding: 8px 20px; border-radius: 20px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; backdrop-filter: blur(5px); }
            .btn-show-detail:hover { background: #475569; color: #fff; }

            /* 底部操作栏 */
            .gacha-footer { background: #1e293b; padding: 20px; border-top: 1px solid #334155; display: flex; flex-direction: column; gap: 15px; z-index: 10; }
            .gacha-currency-info { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 10px 15px; border-radius: 12px; border: 1px solid #334155; }
            .gacha-currency-label { font-size: 13px; color: #94a3b8; display: flex; align-items: center; gap: 6px; }
            .gacha-currency-val { font-size: 18px; font-family: monospace; font-weight: bold; color: #fbbf24; }

            .gacha-actions { display: flex; gap: 15px; }
            .btn-do-gacha { flex: 1; padding: 15px; border-radius: 16px; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; transition: 0.2s; position: relative; overflow: hidden; }
            .btn-do-gacha::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent); transform: rotate(45deg); transition: 0.5s; opacity: 0; }
            .btn-do-gacha:hover::after { opacity: 1; left: 100%; }

            .btn-single { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 4px 15px rgba(59,130,246,0.3); color: #fff; }
            .btn-ten { background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 4px 15px rgba(245,158,11,0.3); color: #fff; }
            .btn-do-gacha span { font-size: 16px; font-weight: 900; letter-spacing: 2px; }
            .btn-cost { font-size: 12px; opacity: 0.9; display: flex; align-items: center; gap: 4px; font-weight: bold; }
            .btn-cost img { width: 14px; height: 14px; }

            /* 卡池详情弹窗 */
            .gacha-modal { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15,23,42,0.95); backdrop-filter: blur(10px); z-index: 100; display: flex; flex-direction: column; transform: translateY(100%); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            .gacha-modal.show { transform: translateY(0); }
            .gacha-modal-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; background: #1e293b; }
            .gacha-modal-title { font-size: 18px; font-weight: bold; color: #fff; display: flex; align-items: center; gap: 10px; }
            .btn-close-modal { background: none; border: none; color: #94a3b8; font-size: 24px; cursor: pointer; }
            .gacha-modal-content { flex: 1; overflow-y: auto; padding: 20px; }

            .pool-section { margin-bottom: 30px; }
            .pool-section-title { font-size: 15px; font-weight: bold; color: #ec4899; margin-bottom: 15px; border-bottom: 1px dashed #334155; padding-bottom: 8px; display: flex; justify-content: space-between; }
            .pool-grid-idol { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 15px; }
            .pool-item-idol { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 10px; text-align: center; }
            .pool-item-idol img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; margin-bottom: 5px; background: #0f172a; }
            .pool-item-idol span { display: block; font-size: 12px; font-weight: bold; color: #cbd5e1; }

            .pool-list-item { display: flex; align-items: center; gap: 15px; background: #1e293b; padding: 12px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 10px; }
            .pool-list-icon { width: 40px; height: 40px; border-radius: 8px; background: #0f172a; object-fit: contain; padding: 5px; }
            .pool-list-info { flex: 1; }
            .pool-list-name { font-size: 14px; font-weight: bold; color: #f8fafc; margin-bottom: 4px; }
            .pool-list-desc { font-size: 12px; color: #94a3b8; line-height: 1.4; }
            .pool-list-rate { font-size: 13px; font-family: monospace; color: #fbbf24; font-weight: bold; background: rgba(245,158,11,0.1); padding: 4px 8px; border-radius: 6px; }

            /* 抽卡过场动画 */
            .gacha-animation-layer { position: absolute; top:0; left:0; width:100%; height:100%; background: #000; z-index: 200; display: none; flex-direction: column; align-items: center; justify-content: center; }
            .gacha-animation-layer.active { display: flex; }
            .star-burst { width: 100px; height: 100px; position: relative; animation: pulseGlow 1.5s infinite; }
            .star-burst i { font-size: 80px; color: #fbbf24; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-shadow: 0 0 30px #fbbf24; }
            .anim-text { margin-top: 30px; font-size: 18px; font-weight: bold; color: #fff; letter-spacing: 4px; animation: fadeInOut 1.5s infinite; }

            @keyframes pulseGlow { 0% { transform: scale(0.8); opacity: 0.5; filter: drop-shadow(0 0 10px #fbbf24); } 50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 50px #f59e0b); } 100% { transform: scale(0.8); opacity: 0.5; filter: drop-shadow(0 0 10px #fbbf24); } }
            @keyframes fadeInOut { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

            /* 抽卡结果界面 */
            .gacha-result-view { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg') center/cover; z-index: 300; display: none; flex-direction: column; }
            .gacha-result-view::before { content: ''; position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(15,23,42,0.85); backdrop-filter: blur(10px); z-index: 0; }
            .gacha-result-view.active { display: flex; }

            .result-header { position: relative; z-index: 1; text-align: center; padding: 40px 20px 20px; }
            .result-title { font-size: 24px; font-weight: 900; color: #fff; letter-spacing: 4px; text-shadow: 0 0 20px rgba(255,255,255,0.5); }

            .result-grid { position: relative; z-index: 1; flex: 1; display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 15px; padding: 20px; overflow-y: auto; align-content: center; justify-items: center; }

            .result-card { background: linear-gradient(180deg, #1e293b, #0f172a); border-radius: 16px; padding: 15px; text-align: center; width: 100%; max-width: 140px; border: 1px solid #334155; box-shadow: 0 10px 20px rgba(0,0,0,0.5); transform: translateY(50px) scale(0.8); opacity: 0; animation: cardPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; display: flex; flex-direction: column; align-items: center; gap: 10px; position: relative; }
            @keyframes cardPop { to { transform: translateY(0) scale(1); opacity: 1; } }

            .result-card.card-idol { border: 2px solid #fbbf24; background: linear-gradient(180deg, rgba(245,158,11,0.2), #0f172a); box-shadow: 0 0 30px rgba(245,158,11,0.2); }
            .result-card.card-idol::before { content: 'SSR'; position: absolute; top: -10px; right: -10px; background: linear-gradient(135deg, #f59e0b, #fbbf24); color: #fff; font-size: 10px; font-weight: 900; padding: 4px 8px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); z-index: 5; }

            .result-card.card-dup { border: 2px solid #3b82f6; background: linear-gradient(180deg, rgba(59,130,246,0.2), #0f172a); }
            .result-card.card-dup::before { content: '印记'; position: absolute; top: -10px; right: -10px; background: #3b82f6; color: #fff; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 8px; z-index: 5; }

            .result-img-wrap { width: 80px; height: 80px; border-radius: 12px; overflow: hidden; background: #1e293b; border: 1px solid #334155; display: flex; justify-content: center; align-items: center; }
            .result-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
            .result-img-wrap i { font-size: 40px; color: #94a3b8; }

            .result-name { font-size: 13px; font-weight: bold; color: #f8fafc; }
            .result-type-tag { font-size: 10px; padding: 2px 8px; border-radius: 10px; background: #334155; color: #cbd5e1; }
            .card-idol .result-type-tag { background: rgba(245,158,11,0.2); color: #fbbf24; }
            .card-dup .result-type-tag { background: rgba(59,130,246,0.2); color: #60a5fa; }

            .result-footer { position: relative; z-index: 1; padding: 20px; display: flex; gap: 15px; justify-content: center; background: linear-gradient(0deg, #0f172a, transparent); }
            .btn-result-action { padding: 15px 30px; border-radius: 12px; font-weight: bold; font-size: 15px; cursor: pointer; border: none; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
            .btn-result-back { background: #334155; color: #fff; }
            .btn-result-back:hover { background: #475569; }
            .btn-result-again { background: #f59e0b; color: #fff; box-shadow: 0 4px 15px rgba(245,158,11,0.3); }
            .btn-result-again:hover { background: #d97706; }
        `;
        topDoc.head.appendChild(style);
    }

    topWin.renderGachaApp = function(container) {
        const idolRate = 0.04;
        const stardustIcon = 'https://i.postimg.cc/JhBnDD5Y/xing-chen-png-xiao.png';
        const markIcon = 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png';
        let currentPool = 'standard'; // standard | limited

        const html = `
            <div class="gacha-app-container">
                <!-- 顶部 Tabs -->
                <div class="gacha-tabs">
                    <div class="gacha-tab active" data-pool="standard">常驻星探发掘</div>
                    <div class="gacha-tab" data-pool="limited"><i class="bi bi-stars"></i> 限定企划 (UP)</div>
                </div>

                <!-- 主展示区 -->
                <div class="gacha-main-view">
                    <div class="gacha-banner-wrap">
                        <div class="gacha-banner banner-standard" id="banner-display">
                            <div class="gacha-banner-bg"></div>
                            <div class="gacha-banner-content">
                                <span class="gacha-banner-tag" id="banner-tag">STANDARD SCOUTING</span>
                                <div class="gacha-banner-title" id="banner-title">星光原石发掘</div>
                                <div class="gacha-banner-sub" id="banner-sub">寻找散落在城市角落的闪耀光芒</div>
                            </div>
                        </div>
                        <div class="gacha-detail-btn-wrap">
                            <button class="btn-show-detail" id="btn-show-pool-detail"><i class="bi bi-search"></i> 查看卡池详情与概率</button>
                        </div>
                    </div>
                </div>

                <!-- 底部操作区 -->
                <div class="gacha-footer">
                    <div class="gacha-currency-info">
                        <div class="gacha-currency-label"><img src="${stardustIcon}" style="width:16px;"> 星尘余额</div>
                        <div class="gacha-currency-val" id="gacha-stardust-display">${topWin.playerCurrency.stardust}</div>
                    </div>
                    <div class="gacha-actions">
                        <button class="btn-do-gacha btn-single" id="btn-gacha-1">
                            <span>单次发掘</span>
                            <div class="btn-cost"><img src="${stardustIcon}"> 1000</div>
                        </button>
                        <button class="btn-do-gacha btn-ten" id="btn-gacha-10">
                            <span>十连发掘</span>
                            <div class="btn-cost"><img src="${stardustIcon}"> 10000</div>
                        </button>
                    </div>
                </div>

                <!-- 卡池详情弹窗 -->
                <div class="gacha-modal" id="pool-detail-modal">
                    <div class="gacha-modal-header">
                        <div class="gacha-modal-title"><i class="bi bi-info-square-fill"></i> 卡池详细信息</div>
                        <button class="btn-close-modal" id="btn-close-modal"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="gacha-modal-content" id="pool-detail-content">
                        <!-- 动态渲染详情 -->
                    </div>
                </div>

                <!-- 抽卡过场动画 -->
                <div class="gacha-animation-layer" id="gacha-anim-layer">
                    <div class="star-burst"><i class="bi bi-star-fill"></i></div>
                    <div class="anim-text">正在搜寻星光...</div>
                </div>

                <!-- 抽卡结果界面 -->
                <div class="gacha-result-view" id="gacha-result-view">
                    <div class="result-header">
                        <div class="result-title">发掘结果</div>
                    </div>
                    <div class="result-grid" id="result-grid"></div>
                    <div class="result-footer">
                        <button class="btn-result-action btn-result-back" id="btn-result-back"><i class="bi bi-arrow-left"></i> 返回卡池</button>
                        <button class="btn-result-action btn-result-again" id="btn-result-again"><i class="bi bi-controller"></i> 再次十连</button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // --- 元素获取 ---
        const tabs = container.querySelectorAll('.gacha-tab');
        const banner = container.querySelector('#banner-display');
        const bannerTag = container.querySelector('#banner-tag');
        const bannerTitle = container.querySelector('#banner-title');
        const bannerSub = container.querySelector('#banner-sub');
        const displayStardust = container.querySelector('#gacha-stardust-display');

        const modal = container.querySelector('#pool-detail-modal');
        const modalContent = container.querySelector('#pool-detail-content');
        const btnShowDetail = container.querySelector('#btn-show-pool-detail');
        const btnCloseModal = container.querySelector('#btn-close-modal');

        const animLayer = container.querySelector('#gacha-anim-layer');
        const resultView = container.querySelector('#gacha-result-view');
        const resultGrid = container.querySelector('#result-grid');

        // --- UI 更新逻辑 ---
        function updateCurrency() {
            displayStardust.innerText = topWin.playerCurrency.stardust;
        }

        function switchPool(poolType) {
            currentPool = poolType;
            tabs.forEach(t => t.classList.remove('active'));
            container.querySelector(`.gacha-tab[data-pool="${poolType}"]`).classList.add('active');

            if (poolType === 'limited') {
                banner.className = 'gacha-banner banner-limited';
                bannerTag.innerText = 'LIMITED EVENT';
                bannerTag.style.background = 'rgba(245,158,11,0.8)';
                bannerTitle.innerText = '闪耀之夜限定';
                bannerSub.innerText = '特定偶像获取概率大幅提升！';
            } else {
                banner.className = 'gacha-banner banner-standard';
                bannerTag.innerText = 'STANDARD SCOUTING';
                bannerTag.style.background = 'rgba(236,72,153,0.8)';
                bannerTitle.innerText = '星光原石发掘';
                bannerSub.innerText = '寻找散落在城市角落的闪耀光芒';
            }
        }

        tabs.forEach(t => t.addEventListener('click', () => switchPool(t.getAttribute('data-pool'))));

        // --- 渲染详情内容 ---
        function renderPoolDetail() {
            const stardustProb = 0.432;
            const itemProb = 0.528;
            const db = topWin.idolDatabase || [];
            const items = topWin.itemPool || [];

            let h = `
                <div style="background:#0f172a; padding:15px; border-radius:12px; border:1px solid #334155; margin-bottom:20px;">
                    <div style="font-weight:bold; color:#cbd5e1; margin-bottom:10px;">大盘概率公示：</div>
                    <div style="display:flex; gap:10px; font-size:13px;">
                        <span style="color:#ec4899;">偶像：4%</span> |
                        <span style="color:#fbbf24;">资源道具：52.8%</span> |
                        <span style="color:#94a3b8;">星尘返还：43.2%</span>
                    </div>
                    <div style="font-size:12px; color:#64748b; margin-top:8px;">* 重复获取偶像将自动转化为【偶像印记】。</div>
                </div>
            `;

            // 偶像列表
            h += `<div class="pool-section"><div class="pool-section-title"><span><i class="bi bi-person-heart"></i> 可发掘偶像列表</span><span>概率: 4%</span></div><div class="pool-grid-idol">`;
            db.forEach(idol => {
                h += `<div class="pool-item-idol"><img src="${idol.image}"><span>${idol.name}</span></div>`;
            });
            h += `</div></div>`;

            // 道具列表
            h += `<div class="pool-section"><div class="pool-section-title"><span><i class="bi bi-box-seam-fill"></i> 资源道具及效果</span><span>概率: 52.8%</span></div>`;
            items.forEach(item => {
                h += `
                    <div class="pool-list-item">
                        <img src="${item.img}" class="pool-list-icon">
                        <div class="pool-list-info">
                            <div class="pool-list-name">${item.name}</div>
                            <div class="pool-list-desc">${item.desc}</div>
                        </div>
                    </div>
                `;
            });
            h += `</div>`;

            modalContent.innerHTML = h;
            modal.classList.add('show');
        }

        btnShowDetail.addEventListener('click', renderPoolDetail);
        btnCloseModal.addEventListener('click', () => modal.classList.remove('show'));

        // --- 抽卡核心逻辑 ---
        function executeGacha(times) {
            const cost = times * 1000;
            if (topWin.playerCurrency.stardust < cost) {
                alert("星尘余额不足！请先获取更多星尘。");
                return;
            }

            // 1. 扣费
            topWin.playerCurrency.stardust -= cost;
            updateCurrency();

            // 2. 播放过场动画
            animLayer.classList.add('active');

            // 3. 计算结果
            const results = [];
            let seenIdols = new Set();
            const currentTotalItemWeight = (typeof topWin.itemPool !== 'undefined') ? topWin.itemPool.reduce((sum, item) => sum + item.weight, 0) : 1;
            const db = topWin.idolDatabase || [];

            for(let i=0; i<times; i++) {
                let roll = Math.random();
                // 如果是限定池，可以稍微调高偶像概率（演示逻辑）
                let currentRate = currentPool === 'limited' ? 0.06 : idolRate;

                if (roll <= currentRate && db.length > 0) {
                    let rIdol = db[Math.floor(Math.random() * db.length)];
                    let isDup = Math.random() < 0.3 || seenIdols.has(rIdol.name);
                    if (isDup) {
                        results.push({ type: 'duplicate', name: rIdol.name, idolImg: rIdol.image, markImg: markIcon });
                    } else {
                        seenIdols.add(rIdol.name);
                        results.push({ type: 'idol', name: rIdol.name, img: rIdol.image });
                    }
                } else {
                    let itemRoll = Math.random();
                    if (itemRoll <= 0.45 || typeof topWin.itemPool === 'undefined') {
                        let sRoll = Math.random() * 100;
                        let amt = 100;
                        if (sRoll <= 1) amt = 5000;
                        else if (sRoll <= 6) amt = 1000;
                        else if (sRoll <= 20) amt = 500;
                        else if (sRoll <= 50) amt = 300;
                        else amt = 100;
                        results.push({ type: 'stardust', amount: amt, img: stardustIcon });
                        topWin.playerCurrency.stardust += amt; // 抽到星尘加回余额
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

            // 4. 延迟显示结果
            setTimeout(() => {
                animLayer.classList.remove('active');
                showResultView(results);
            }, 2000);
        }

        // --- 结果展示逻辑 ---
        function showResultView(results) {
            resultGrid.innerHTML = '';
            updateCurrency(); // 更新可能抽到的星尘

            results.forEach((res, idx) => {
                let delay = idx * 0.15;
                let rHtml = '';

                if (res.type === 'idol') {
                    rHtml = `
                    <div class="result-card card-idol" style="animation-delay:${delay}s">
                        <div class="result-img-wrap"><img src="${res.img}"></div>
                        <div class="result-name">${res.name}</div>
                        <div class="result-type-tag">IDOL</div>
                    </div>`;
                } else if (res.type === 'duplicate') {
                    rHtml = `
                    <div class="result-card card-dup" style="animation-delay:${delay}s">
                        <div class="mark-transform-wrap">
                            <img src="${res.idolImg}" class="mark-img-front">
                            <img src="${res.markImg}" class="mark-img-back">
                        </div>
                        <div class="result-name duplicate-name" data-name="${res.name}">${res.name}</div>
                        <div class="result-type-tag">印记转化</div>
                    </div>`;
                } else if (res.type === 'stardust') {
                    rHtml = `
                    <div class="result-card" style="animation-delay:${delay}s">
                        <div class="result-img-wrap" style="background:transparent; border:none;"><img src="${res.img}" style="object-fit:contain;"></div>
                        <div class="result-name" style="color:#fbbf24;">星尘 ×${res.amount}</div>
                        <div class="result-type-tag">资源</div>
                    </div>`;
                } else {
                    rHtml = `
                    <div class="result-card" style="animation-delay:${delay}s">
                        <div class="result-img-wrap" style="background:transparent; border:none;"><img src="${res.data.img}" style="object-fit:contain;"></div>
                        <div class="result-name">${res.data.name}</div>
                        <div class="result-type-tag">道具</div>
                    </div>`;
                }
                resultGrid.insertAdjacentHTML('beforeend', rHtml);
            });

            resultView.classList.add('active');

            // 处理印记翻转
            setTimeout(() => {
                resultGrid.querySelectorAll('.card-dup').forEach(el => {
                    el.classList.add('do-transform');
                    setTimeout(() => {
                        const nameEl = el.querySelector('.duplicate-name');
                        nameEl.innerText = nameEl.getAttribute('data-name') + '·印记';
                        nameEl.style.color = '#60a5fa';
                    }, 400);
                });
            }, 1000 + results.length * 150);
        }

        // 绑定按钮
        container.querySelector('#btn-gacha-1').addEventListener('click', () => executeGacha(1));
        container.querySelector('#btn-gacha-10').addEventListener('click', () => executeGacha(10));

        container.querySelector('#btn-result-back').addEventListener('click', () => {
            resultView.classList.remove('active');
        });
        container.querySelector('#btn-result-again').addEventListener('click', () => {
            resultView.classList.remove('active');
            setTimeout(() => executeGacha(10), 300);
        });

        // 初始化
        switchPool('standard');
        updateCurrency();
    };
})();
