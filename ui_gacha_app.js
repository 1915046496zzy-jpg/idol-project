// ==========================================
// 星探寻访 (Gacha) APP 独立模块
// 消耗：单抽 1000 星尘，十连 10000 星尘
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

    // 模拟全局玩家资产（如果已有则复用）
    if (typeof topWin.playerCurrency === 'undefined') {
        topWin.playerCurrency = {
            stardust: 50000 // 初始送5万星尘用于测试
        };
    }

    // 注入专属样式
    if (!topDoc.getElementById('qingzi-gacha-style')) {
        const style = topDoc.createElement('style');
        style.id = 'qingzi-gacha-style';
        style.innerHTML = `
            .gacha-app-container { display: flex; flex-direction: column; height: 100%; background: #f8fafc; font-family: 'Microsoft YaHei', sans-serif; }
            .gacha-header-banner { background: linear-gradient(135deg, #f59e0b, #fbbf24); padding: 30px 20px; text-align: center; color: #fff; position: relative; overflow: hidden; }
            .gacha-header-banner::after { content: '✦'; position: absolute; font-size: 100px; opacity: 0.1; right: -20px; bottom: -30px; transform: rotate(15deg); }
            .gacha-title { font-size: 24px; font-weight: 900; letter-spacing: 2px; text-shadow: 0 2px 5px rgba(0,0,0,0.2); margin-bottom: 5px; }
            .gacha-subtitle { font-size: 12px; opacity: 0.9; letter-spacing: 4px; }

            .gacha-currency-bar { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.05); }
            .gacha-currency-item { display: flex; align-items: center; gap: 8px; font-weight: bold; color: #334155; }
            .gacha-currency-icon { width: 24px; height: 24px; object-fit: contain; }
            .gacha-currency-val { font-size: 18px; font-family: monospace; color: #f59e0b; }

            .gacha-pool-info { padding: 20px; margin: 20px; background: #fff; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid rgba(245,158,11,0.2); }
            .gacha-pool-title { font-size: 16px; font-weight: bold; color: #d97706; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
            .gacha-pool-desc { font-size: 13px; color: #64748b; line-height: 1.6; }
            .gacha-rate-highlight { color: #db2777; font-weight: bold; }

            .gacha-action-area { padding: 20px; display: flex; gap: 15px; justify-content: center; margin-top: auto; margin-bottom: 20px; }
            .btn-gacha { flex: 1; max-width: 200px; padding: 15px; border-radius: 12px; border: none; font-size: 16px; font-weight: bold; color: #fff; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; align-items: center; gap: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .btn-gacha-single { background: #3b82f6; }
            .btn-gacha-single:hover { background: #2563eb; transform: translateY(-2px); }
            .btn-gacha-ten { background: #f59e0b; }
            .btn-gacha-ten:hover { background: #d97706; transform: translateY(-2px); }
            .btn-gacha-cost { font-size: 12px; opacity: 0.9; display: flex; align-items: center; gap: 4px; }
            .btn-gacha-cost img { width: 14px; height: 14px; }

            /* 抽卡结果页 */
            .gacha-result-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.98); z-index: 100; display: flex; flex-direction: column; opacity: 0; pointer-events: none; transition: 0.3s; }
            .gacha-result-overlay.show { opacity: 1; pointer-events: auto; }
            .gacha-result-header { text-align: center; padding: 30px 20px 10px; font-size: 20px; font-weight: 900; color: #1e293b; }

            .gacha-result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 15px; padding: 20px; overflow-y: auto; align-content: start; }
            .gacha-result-card { background: #fff; border-radius: 12px; padding: 12px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; gap: 10px; position: relative; overflow: hidden; transform: rotateY(90deg); animation: flipIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; border: 1px solid rgba(0,0,0,0.05); }
            @keyframes flipIn { to { transform: rotateY(0deg); } }

            .gacha-result-card.idol-card { border: 2px solid #fbbf24; background: linear-gradient(135deg, #fffbeb, #fef08a); box-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
            .gacha-result-card.idol-card::after { content: 'IDOL'; position: absolute; top: 0; right: 0; background: #fbbf24; color: #fff; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 0 0 0 10px; z-index: 5; line-height: 1;}

            .gacha-result-img { width: 70px; height: 70px; object-fit: contain; border-radius: 8px; background: #f8fafc; border: 1px solid rgba(0,0,0,0.05); }
            .gacha-result-name { font-size: 12px; font-weight: 900; color: #1e293b; }
            .gacha-result-type { font-size: 10px; color: #db2777; background: rgba(219,39,119,0.1); padding: 2px 6px; border-radius: 8px; }

            .mark-transform-wrap { position: relative; width: 70px; height: 70px; perspective: 1000px; }
            .mark-img-front, .mark-img-back { position: absolute; top:0; left:0; width:100%; height:100%; border-radius: 8px; backface-visibility: hidden; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); object-fit: contain; border: 1px solid rgba(0,0,0,0.05);}
            .mark-img-front { transform: rotateY(0deg); }
            .mark-img-back { transform: rotateY(180deg); background: #fdf2f8; padding: 5px;}
            .gacha-result-card.duplicate-card { border: 2px solid #3b82f6; background: linear-gradient(135deg, #eff6ff, #bfdbfe); box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
            .gacha-result-card.do-transform .mark-img-front { transform: rotateY(-180deg); }
            .gacha-result-card.do-transform .mark-img-back { transform: rotateY(0deg); }

            .gacha-result-actions { padding: 20px; display: flex; gap: 15px; justify-content: center; border-top: 1px solid rgba(0,0,0,0.05); background: #fff; margin-top: auto; }
            .btn-result-back { padding: 12px 25px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f1f5f9; color: #475569; font-weight: bold; cursor: pointer; }
        `;
        topDoc.head.appendChild(style);
    }

    topWin.renderGachaApp = function(container) {
        const idolRate = 0.04; // 偶像基础概率 4%
        const stardustIcon = 'https://i.postimg.cc/JhBnDD5Y/xing-chen-png-xiao.png';
        const markIcon = 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png';

        const html = `
            <div class="gacha-app-container">
                <div class="gacha-header-banner">
                    <div class="gacha-title">常驻星探发掘</div>
                    <div class="gacha-subtitle">STANDARD SCOUTING</div>
                </div>

                <div class="gacha-currency-bar">
                    <div class="gacha-currency-item">
                        <img src="${stardustIcon}" class="gacha-currency-icon">
                        <span>星尘余额</span>
                    </div>
                    <div class="gacha-currency-val" id="gacha-stardust-display">${topWin.playerCurrency.stardust}</div>
                </div>

                <div class="gacha-pool-info">
                    <div class="gacha-pool-title"><i class="bi bi-info-circle-fill"></i> 卡池概率公示</div>
                    <div class="gacha-pool-desc">
                        每次发掘可能获得：<br>
                        • <span class="gacha-rate-highlight">偶像 (4%)</span>：发掘新的原石。若抽到已拥有偶像，将自动转化为【偶像印记】。<br>
                        • <span style="color:#f59e0b; font-weight:bold;">资源道具 (52.8%)</span>：用于提升业务能力、缓解压力或触发特殊事件。<br>
                        • <span style="color:#64748b; font-weight:bold;">星尘返还 (43.2%)</span>：随机返还 100~5000 不等的星尘。
                    </div>
                </div>

                <div class="gacha-action-area">
                    <button class="btn-gacha btn-gacha-single" id="btn-gacha-1">
                        <span>单次发掘</span>
                        <div class="btn-gacha-cost"><img src="${stardustIcon}"> 1000</div>
                    </button>
                    <button class="btn-gacha btn-gacha-ten" id="btn-gacha-10">
                        <span>十连发掘</span>
                        <div class="btn-gacha-cost"><img src="${stardustIcon}"> 10000</div>
                    </button>
                </div>

                <!-- 结果遮罩层 -->
                <div class="gacha-result-overlay" id="gacha-result-overlay">
                    <div class="gacha-result-header">✦ 发掘结果 ✦</div>
                    <div class="gacha-result-grid" id="gacha-result-grid"></div>
                    <div class="gacha-result-actions">
                        <button class="btn-result-back" id="btn-gacha-back">返回卡池</button>
                        <button class="btn-gacha btn-gacha-ten" id="btn-gacha-again" style="flex:1; max-width:200px;">
                            <span>再次十连</span>
                            <div class="btn-gacha-cost"><img src="${stardustIcon}"> 10000</div>
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // 获取元素
        const displayStardust = container.querySelector('#gacha-stardust-display');
        const btnSingle = container.querySelector('#btn-gacha-1');
        const btnTen = container.querySelector('#btn-gacha-10');
        const overlay = container.querySelector('#gacha-result-overlay');
        const resultGrid = container.querySelector('#gacha-result-grid');
        const btnBack = container.querySelector('#btn-gacha-back');
        const btnAgain = container.querySelector('#btn-gacha-again');

        // 更新余额显示
        function updateCurrency() {
            displayStardust.innerText = topWin.playerCurrency.stardust;
            if(topWin.playerCurrency.stardust < 1000) btnSingle.style.opacity = '0.5';
            else btnSingle.style.opacity = '1';

            if(topWin.playerCurrency.stardust < 10000) btnTen.style.opacity = '0.5';
            else btnTen.style.opacity = '1';
        }

        // 核心抽卡逻辑
        function doGacha(times) {
            const cost = times * 1000;
            if (topWin.playerCurrency.stardust < cost) {
                alert("星尘余额不足！");
                return;
            }

            // 扣费
            topWin.playerCurrency.stardust -= cost;
            updateCurrency();

            // 模拟抽取
            const results = [];
            // 假设我们有一个本地记录，防止本次十连抽出相同的新卡（如果想完全随机可以去掉）
            let seenIdols = new Set();

            const currentTotalItemWeight = (typeof topWin.itemPool !== 'undefined') ? topWin.itemPool.reduce((sum, item) => sum + item.weight, 0) : 1;
            const db = topWin.idolDatabase || [];

            for(let i=0; i<times; i++) {
                let roll = Math.random();
                if (roll <= idolRate && db.length > 0) {
                    // 抽到偶像
                    let rIdol = db[Math.floor(Math.random() * db.length)];
                    // 为了简化，这里模拟 30% 的概率是重复的（如果有真实存档系统应检查真实存档）
                    let isDup = Math.random() < 0.3 || seenIdols.has(rIdol.name);

                    if (isDup) {
                        results.push({ type: 'duplicate', name: rIdol.name, idolImg: rIdol.image, markImg: markIcon });
                    } else {
                        seenIdols.add(rIdol.name);
                        results.push({ type: 'idol', name: rIdol.name, img: rIdol.image });
                    }
                } else {
                    // 道具池 (星尘45%，道具55%)
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
                    } else {
                        let weightRoll = Math.random() * currentTotalItemWeight;
                        let selectedItem = topWin.itemPool[0];
                        for(let item of topWin.itemPool) {
                            if(weightRoll < item.weight) {
                                selectedItem = item;
                                break;
                            }
                            weightRoll -= item.weight;
                        }
                        results.push({ type: 'item', data: selectedItem });
                    }
                }
            }

            renderResults(results);
        }

        // 渲染结果
        function renderResults(results) {
            resultGrid.innerHTML = '';
            results.forEach((res, idx) => {
                let delay = idx * 0.1;
                let rHtml = '';
                if (res.type === 'idol') {
                    rHtml = `<div class="gacha-result-card idol-card" style="animation-delay:${delay}s"><img src="${res.img}" class="gacha-result-img"><div class="gacha-result-name">${res.name}</div><div class="gacha-result-type">NEW IDOL</div></div>`;
                } else if (res.type === 'duplicate') {
                    rHtml = `
                    <div class="gacha-result-card duplicate-card" style="animation-delay:${delay}s">
                        <div class="mark-transform-wrap">
                            <img src="${res.idolImg}" class="mark-img-front">
                            <img src="${res.markImg}" class="mark-img-back">
                        </div>
                        <div class="gacha-result-name duplicate-name" data-name="${res.name}">${res.name}</div>
                        <div class="gacha-result-type" style="color:#3b82f6; background:rgba(59,130,246,0.1);">DUPLICATE</div>
                    </div>`;
                } else if (res.type === 'stardust') {
                    rHtml = `<div class="gacha-result-card" style="animation-delay:${delay}s"><img src="${res.img}" class="gacha-result-img" style="object-fit:contain;"><div class="gacha-result-name">星尘 ×${res.amount}</div><div class="gacha-result-type" style="color:#64748b; background:rgba(0,0,0,0.05);">CURRENCY</div></div>`;
                    // 将抽到的星尘加回余额
                    topWin.playerCurrency.stardust += res.amount;
                } else {
                    rHtml = `<div class="gacha-result-card" style="animation-delay:${delay}s"><img src="${res.data.img}" class="gacha-result-img" style="object-fit:contain;"><div class="gacha-result-name">${res.data.name}</div><div class="gacha-result-type" style="color:#64748b; background:rgba(0,0,0,0.05);">ITEM</div></div>`;
                }
                resultGrid.insertAdjacentHTML('beforeend', rHtml);
            });

            updateCurrency(); // 更新加回的星尘
            overlay.classList.add('show');

            // 触发重复印记翻转动画
            setTimeout(() => {
                const dupCards = resultGrid.querySelectorAll('.duplicate-card');
                dupCards.forEach(el => {
                    el.classList.add('do-transform');
                    setTimeout(() => {
                        const nameEl = el.querySelector('.duplicate-name');
                        const oldName = nameEl.getAttribute('data-name');
                        nameEl.innerText = oldName + '·印记';
                        nameEl.style.color = '#db2777';
                    }, 400);
                });
            }, 1500);
        }

        // 绑定事件
        btnSingle.addEventListener('click', () => doGacha(1));
        btnTen.addEventListener('click', () => doGacha(10));
        btnBack.addEventListener('click', () => overlay.classList.remove('show'));
        btnAgain.addEventListener('click', () => {
            overlay.classList.remove('show');
            setTimeout(() => doGacha(10), 300);
        });

        updateCurrency();
    };
})();
