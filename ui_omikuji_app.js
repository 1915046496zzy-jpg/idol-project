(function(global) {
    global.renderOmikujiApp = function(container) {
        if (!container) return;

        // 1. 注入专属CSS样式
        const styleId = 'qingzi-omikuji-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .omikuji-layout { position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; font-family: 'Noto Serif JP', serif;}
                .omikuji-bg { position: absolute; top:0; left:0; width:100%; height:100%; background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 20px 20px; opacity: 0.5; pointer-events: none;}

                /* 签筒区域 */
                .cylinder-container { position: relative; width: 120px; height: 200px; cursor: pointer; z-index: 10; transition: transform 0.3s; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;}
                .cylinder-container:hover { filter: brightness(1.05); }

                /* 签筒本体 (纯CSS绘制) */
                .cylinder-body { width: 100px; height: 160px; background: linear-gradient(90deg, #8b4513 0%, #d2691e 50%, #8b4513 100%); border-radius: 10px 10px 20px 20px; position: relative; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5), 0 10px 15px rgba(0,0,0,0.3); border: 2px solid #5c2e0b; border-top: none;}
                .cylinder-top { position: absolute; top: -15px; left: -2px; width: 104px; height: 30px; background: #3e1f08; border-radius: 50%; border: 2px solid #5c2e0b; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 5px 10px rgba(0,0,0,0.8);}
                .cylinder-hole { width: 80px; height: 20px; background: #1a0d03; border-radius: 50%;}
                .cylinder-label { width: 40px; height: 80px; background: #fef08a; border-radius: 4px; display: flex; align-items: center; justify-content: center; writing-mode: vertical-rl; font-size: 24px; font-weight: bold; color: #b91c1c; border: 1px solid #ca8a04; box-shadow: 2px 2px 5px rgba(0,0,0,0.2);}

                /* 提示文字 */
                .omikuji-hint { position: absolute; bottom: -40px; font-size: 16px; color: #475569; font-weight: bold; text-shadow: 0 1px 2px #fff; pointer-events: none; transition: opacity 0.3s;}

                /* 摇晃动画 */
                .shaking { animation: shakeCylinder 0.1s infinite alternate; pointer-events: none; }
                @keyframes shakeCylinder {
                    0% { transform: rotate(0deg) translate(0, 0); }
                    25% { transform: rotate(-5deg) translate(-2px, -2px); }
                    50% { transform: rotate(0deg) translate(0, 2px); }
                    75% { transform: rotate(5deg) translate(2px, -2px); }
                    100% { transform: rotate(0deg) translate(0, 0); }
                }

                /* 倾斜倒签状态 */
                .pouring { transform: rotate(-45deg); pointer-events: none; }

                /* 掉出来的签 */
                .stick-out { position: absolute; width: 8px; height: 100px; background: #fde047; border: 1px solid #ca8a04; border-radius: 4px; top: -10px; left: 50%; transform: translateX(-50%); z-index: 5; opacity: 0; pointer-events: none;}
                .stick-out.fly { animation: flyOut 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; cursor: pointer; pointer-events: auto;}
                .stick-out::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 15px; background: #ef4444; border-radius: 4px 4px 0 0; }

                @keyframes flyOut {
                    0% { top: -10px; opacity: 0; transform: translateX(-50%) rotate(0deg); }
                    30% { top: -120px; opacity: 1; transform: translateX(-80px) rotate(-30deg); }
                    100% { top: -10px; left: -100px; opacity: 1; transform: translateX(0) rotate(-70deg); }
                }

                .stick-out.fly:hover { filter: drop-shadow(0 0 5px #ef4444); transform: scale(1.1) rotate(-70deg) !important; }

                /* 结果卡片遮罩 */
                .result-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 50; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.4s;}
                .result-overlay.show { opacity: 1; pointer-events: auto; }

                /* 结果卡片 */
                .result-card { width: 80%; max-width: 320px; background: #fff; border-radius: 15px; padding: 30px 20px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3); transform: translateY(50px) scale(0.9); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; border: 4px solid #b91c1c;}
                .result-overlay.show .result-card { transform: translateY(0) scale(1); }

                .card-deco-top { position: absolute; top: -15px; width: 60px; height: 30px; background: #b91c1c; border-radius: 30px; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 20px;}

                .fortune-title { font-size: 48px; font-weight: 900; margin-bottom: 20px; color: #b91c1c; text-shadow: 2px 2px 0px #fca5a5; writing-mode: vertical-rl; letter-spacing: 10px;}

                .fortune-details { width: 100%; border-top: 2px dashed #fca5a5; padding-top: 15px; display: flex; flex-direction: column; gap: 10px;}
                .detail-row { display: flex; align-items: flex-start; gap: 10px; font-size: 14px;}
                .detail-label { background: #b91c1c; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold; white-space: nowrap;}
                .detail-text { color: #334155; line-height: 1.5; flex: 1;}

                .btn-retry { margin-top: 25px; padding: 10px 25px; background: #b91c1c; color: #fff; border: none; border-radius: 20px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(185,28,28,0.3);}
                .btn-retry:hover { transform: translateY(-2px); background: #991b1b; }
            `;
            document.head.appendChild(style);
        }

        // 2. 运势数据池
        const fortunes = [
            { level: '大吉', color: '#b91c1c', textShadow: '#fca5a5', love: '命运的红线已然相连，大胆表达心意吧。', work: '如有神助，一切阻碍都将迎刃而解。', wealth: '意想不到的收入即将到来。' },
            { level: '中吉', color: '#ea580c', textShadow: '#fdba74', love: '顺其自然，感情会在日常中逐渐升温。', work: '稳扎稳打，付出的努力会被人看到。', wealth: '收支平衡，适合进行小额投资。' },
            { level: '小吉', color: '#d97706', textShadow: '#fcd34d', love: '可能会有微小的误会，耐心解释即可。', work: '有些许波折，但最终能顺利完成。', wealth: '节流重于开源，避免冲动消费。' },
            { level: '吉', color: '#16a34a', textShadow: '#86efac', love: '平平淡淡才是真，陪伴是最长情的告白。', work: '按部就班，保持平常心即可。', wealth: '财运平稳，无意外之喜也无意外之忧。' },
            { level: '末吉', color: '#0284c7', textShadow: '#7dd3fc', love: '时机尚未成熟，暂时保持距离观察为妙。', work: '需要更多的耐心，不要急于求成。', wealth: '有破财风险，看好自己的钱包。' },
            { level: '凶', color: '#475569', textShadow: '#cbd5e1', love: '容易发生争吵，请务必控制自己的情绪。', work: '麻烦接踵而至，建议向可靠的前辈求助。', wealth: '不要借钱给他人，容易有去无回。' },
            { level: '大凶', color: '#0f172a', textShadow: '#64748b', love: '危机四伏，建议今日不要做出重要决定。', work: '诸事不宜，低调行事，少说多做。', wealth: '有大额意外支出的可能，请提高警惕。' }
        ];

        // 3. 构建HTML结构
        container.innerHTML = `
            <div class="omikuji-layout">
                <div class="omikuji-bg"></div>

                <div class="cylinder-container" id="omikuji-cylinder">
                    <div class="cylinder-top"><div class="cylinder-hole"></div></div>
                    <div class="cylinder-body">
                        <div class="cylinder-label">御神籤</div>
                    </div>
                    <div class="stick-out" id="omikuji-stick"></div>
                    <div class="omikuji-hint" id="omikuji-hint">点击摇晃签筒</div>
                </div>

                <div class="result-overlay" id="omikuji-result">
                    <div class="result-card">
                        <div class="card-deco-top"><i class="bi bi-flower1"></i></div>
                        <div class="fortune-title" id="fortune-title">大吉</div>
                        <div class="fortune-details">
                            <div class="detail-row"><div class="detail-label">恋爱</div><div class="detail-text" id="fortune-love">...</div></div>
                            <div class="detail-row"><div class="detail-label">工作</div><div class="detail-text" id="fortune-work">...</div></div>
                            <div class="detail-row"><div class="detail-label">财运</div><div class="detail-text" id="fortune-wealth">...</div></div>
                        </div>
                        <button class="btn-retry" id="btn-retry-omikuji">再抽一次</button>
                    </div>
                </div>
            </div>
        `;

        // 4. 获取DOM元素
        const cylinder = container.querySelector('#omikuji-cylinder');
        const stick = container.querySelector('#omikuji-stick');
        const hint = container.querySelector('#omikuji-hint');
        const resultOverlay = container.querySelector('#omikuji-result');
        const btnRetry = container.querySelector('#btn-retry-omikuji');

        const fTitle = container.querySelector('#fortune-title');
        const fLove = container.querySelector('#fortune-love');
        const fWork = container.querySelector('#fortune-work');
        const fWealth = container.querySelector('#fortune-wealth');

        let isAnimating = false;
        let currentFortune = null;

        // 5. 交互逻辑
        cylinder.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            hint.style.opacity = '0';

            // 开始摇晃
            cylinder.classList.add('shaking');

            // 1.5秒后停止摇晃，变为倾斜倒出状态
            setTimeout(() => {
                cylinder.classList.remove('shaking');
                cylinder.classList.add('pouring');

                // 签飞出来
                stick.classList.add('fly');

                // 决定运势 (这里设置了大吉的概率稍高一点点哦~)
                const rand = Math.random();
                let index = 0;
                if (rand < 0.2) index = 0; // 大吉 20%
                else if (rand < 0.4) index = 1; // 中吉 20%
                else if (rand < 0.6) index = 2; // 小吉 20%
                else if (rand < 0.75) index = 3; // 吉 15%
                else if (rand < 0.85) index = 4; // 末吉 10%
                else if (rand < 0.95) index = 5; // 凶 10%
                else index = 6; // 大凶 5%

                currentFortune = fortunes[index];

            }, 1500);
        });

        // 点击掉出来的签，显示结果
        stick.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!currentFortune) return;

            // 填充数据
            fTitle.textContent = currentFortune.level;
            fTitle.style.color = currentFortune.color;
            fTitle.style.textShadow = `2px 2px 0px ${currentFortune.textShadow}`;

            fLove.textContent = currentFortune.love;
            fWork.textContent = currentFortune.work;
            fWealth.textContent = currentFortune.wealth;

            // 改变标签颜色统一
            const labels = container.querySelectorAll('.detail-label');
            const deco = container.querySelector('.card-deco-top');
            const btn = container.querySelector('.btn-retry');
            const card = container.querySelector('.result-card');

            labels.forEach(l => l.style.background = currentFortune.color);
            deco.style.background = currentFortune.color;
            btn.style.background = currentFortune.color;
            card.style.borderColor = currentFortune.color;

            // 显示结果遮罩
            resultOverlay.classList.add('show');
        });

        // 再抽一次
        btnRetry.addEventListener('click', () => {
            resultOverlay.classList.remove('show');

            // 重置状态
            setTimeout(() => {
                cylinder.classList.remove('pouring');
                stick.classList.remove('fly');
                hint.style.opacity = '1';
                isAnimating = false;
                currentFortune = null;
            }, 400); // 等待遮罩消失动画
        });
    };
})(window);
