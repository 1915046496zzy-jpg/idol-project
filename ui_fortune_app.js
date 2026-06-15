// ==========================================
// 秋青子专属终端：抽签运势 APP (Fortune App)
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

    // 运势数据池
    const fortunes = [
        { level: "大吉", color: "#ef4444", text: "星光璀璨，万事如意！今天想做什么就大胆去做吧，制作人！" },
        { level: "中吉", color: "#f97316", text: "顺风顺水，偶有小惊喜。今天的通告一定会很顺利的！" },
        { level: "小吉", color: "#eab308", text: "平稳的一天。多喝热水，注意休息，好运会在不经意间降临哦。" },
        { level: "吉", color: "#84cc16", text: "踏实努力就会有回报。今天适合整理文件和规划行程。" },
        { level: "末吉", color: "#10b981", text: "虽然起步有些艰难，但只要坚持到最后，就会有好的结果。" },
        { level: "凶", color: "#64748b", text: "稍微有些倒霉呢...不过没关系，我会一直陪着哥哥的！" },
        { level: "大凶", color: "#1e293b", text: "呜...今天最好不要乱跑，乖乖待在办公室里，让我来照顾你吧！" }
    ];

    // 注入专属 CSS
    function injectStyles() {
        if (topDoc.getElementById('qingzi-fortune-style')) return;
        const style = topDoc.createElement('style');
        style.id = 'qingzi-fortune-style';
        style.innerHTML = `
            .fortune-container {
                width: 100%; height: 100%; display: flex; flex-direction: column;
                align-items: center; justify-content: center; position: relative;
                background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
                overflow: hidden; font-family: 'Noto Serif JP', serif;
            }
            /* 背景装饰 */
            .fortune-bg-deco {
                position: absolute; width: 200px; height: 200px; opacity: 0.05;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="red" stroke-width="5" fill="none"/></svg>') center/cover;
            }

            /* 抽签筒区域 */
            .fortune-box-area {
                position: relative; width: 200px; height: 300px;
                display: flex; flex-direction: column; align-items: center;
                cursor: pointer; z-index: 10;
            }

            /* 提示文字 */
            .fortune-hint {
                position: absolute; top: -40px; font-size: 18px; font-weight: bold;
                color: #db2777; background: rgba(255,255,255,0.8); padding: 5px 15px;
                border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                animation: float 2s infinite ease-in-out; pointer-events: none;
            }

            /* 签子 (隐藏在筒里) */
            .fortune-stick {
                position: absolute; bottom: 50px; width: 24px; height: 180px;
                background: linear-gradient(to right, #fde047, #fef08a);
                border: 2px solid #ca8a04; border-radius: 12px 12px 0 0;
                box-shadow: inset -2px 0 5px rgba(0,0,0,0.1);
                transform: translateY(150px); opacity: 0; z-index: 1; transition: 0.3s;
            }
            .fortune-stick::after {
                content: '御神籤'; position: absolute; top: 15px; left: 50%;
                transform: translateX(-50%); writing-mode: vertical-rl;
                font-size: 12px; font-weight: bold; color: #b45309; letter-spacing: 2px;
            }

            /* 抽签筒 */
            .fortune-cylinder {
                position: absolute; bottom: 0; width: 120px; height: 200px;
                background: linear-gradient(to right, #7f1d1d, #dc2626, #7f1d1d);
                border-radius: 10px 10px 30px 30px; box-shadow: 0 15px 25px rgba(0,0,0,0.3);
                z-index: 5; display: flex; justify-content: center; align-items: center;
                border-top: 15px solid #450a0a; border-bottom: 10px solid #450a0a;
            }
            .fortune-cylinder::before {
                content: '運'; color: #fef08a; font-size: 50px; font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5); opacity: 0.9;
            }

            /* 动画定义 */
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            @keyframes shake {
                0% { transform: rotate(0deg) translate(0, 0); }
                10% { transform: rotate(15deg) translate(10px, -10px); }
                20% { transform: rotate(-15deg) translate(-10px, -5px); }
                30% { transform: rotate(15deg) translate(10px, -10px); }
                40% { transform: rotate(-15deg) translate(-10px, -5px); }
                50% { transform: rotate(15deg) translate(10px, -10px); }
                60% { transform: rotate(-15deg) translate(-10px, -5px); }
                70% { transform: rotate(15deg) translate(10px, -10px); }
                80% { transform: rotate(-15deg) translate(-10px, -5px); }
                90% { transform: rotate(10deg) translate(5px, -5px); }
                100% { transform: rotate(0deg) translate(0, 0); }
            }

            .is-shaking .fortune-cylinder { animation: shake 1.5s cubic-bezier(.36,.07,.19,.97) both; }
            .is-drawn .fortune-stick { transform: translateY(-50px) rotate(15deg); opacity: 1; cursor: pointer; }
            .is-drawn .fortune-stick:hover { transform: translateY(-60px) rotate(15deg) scale(1.05); filter: brightness(1.1); box-shadow: 0 0 15px rgba(253,224,71,0.5); }
            .is-drawn .fortune-hint { display: none; }

            /* 结果弹窗 */
            .fortune-result-modal {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
                display: flex; justify-content: center; align-items: center;
                opacity: 0; pointer-events: none; transition: 0.4s; z-index: 50;
            }
            .fortune-result-modal.show { opacity: 1; pointer-events: auto; }

            .fortune-paper {
                width: 80%; max-width: 350px; background: #fffaf0;
                padding: 40px 30px; border-radius: 5px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                display: flex; flex-direction: column; align-items: center;
                transform: translateY(50px) scale(0.9); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative; overflow: hidden;
            }
            .fortune-result-modal.show .fortune-paper { transform: translateY(0) scale(1); }

            /* 纸张纹理 */
            .fortune-paper::before {
                content: ''; position: absolute; top:0; left:0; width:100%; height:100%;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="none"/><path d="M0 0L4 4ZM4 0L0 4Z" stroke="rgba(0,0,0,0.02)" stroke-width="1"/></svg>');
                pointer-events: none; z-index: 0;
            }

            .fortune-level {
                font-size: 64px; font-weight: 900; writing-mode: vertical-rl;
                letter-spacing: 10px; margin-bottom: 30px; text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
                z-index: 1;
            }

            .fortune-text {
                font-size: 16px; color: #334155; line-height: 1.8; text-align: center;
                border-top: 1px dashed #cbd5e1; padding-top: 20px; z-index: 1;
            }

            .fortune-close-btn {
                margin-top: 30px; padding: 10px 30px; background: #334155; color: #fff;
                border: none; border-radius: 25px; font-size: 14px; font-weight: bold;
                cursor: pointer; transition: 0.2s; z-index: 1;
            }
            .fortune-close-btn:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        `;
        topDoc.head.appendChild(style);
    }

    // 渲染主应用
    topWin.renderFortuneApp = function(container) {
        if (!container) return;
        injectStyles();

        container.innerHTML = `
            <div class="fortune-container">
                <div class="fortune-bg-deco" style="top:-50px; left:-50px;"></div>
                <div class="fortune-bg-deco" style="bottom:-50px; right:-50px; transform: rotate(45deg);"></div>

                <div class="fortune-box-area" id="fortune-trigger">
                    <div class="fortune-hint" id="fortune-hint">点击摇签</div>
                    <div class="fortune-stick" id="fortune-stick"></div>
                    <div class="fortune-cylinder"></div>
                </div>

                <div class="fortune-result-modal" id="fortune-modal">
                    <div class="fortune-paper">
                        <div class="fortune-level" id="fortune-level">大吉</div>
                        <div class="fortune-text" id="fortune-text">运势解说文本</div>
                        <button class="fortune-close-btn" id="fortune-close">收下运势</button>
                    </div>
                </div>
            </div>
        `;

        // 获取 DOM 元素
        const triggerArea = container.querySelector('#fortune-trigger');
        const stick = container.querySelector('#fortune-stick');
        const hint = container.querySelector('#fortune-hint');
        const modal = container.querySelector('#fortune-modal');
        const levelDom = container.querySelector('#fortune-level');
        const textDom = container.querySelector('#fortune-text');
        const closeBtn = container.querySelector('#fortune-close');

        let state = 'ready'; // ready -> shaking -> drawn -> result
        let currentFortune = null;

        // 点击摇签筒
        triggerArea.addEventListener('click', function(e) {
            if (state !== 'ready') return;
            state = 'shaking';
            hint.style.display = 'none'; // 隐藏初始提示
            triggerArea.classList.add('is-shaking');

            // 摇晃 1.5 秒后出签
            setTimeout(() => {
                triggerArea.classList.remove('is-shaking');
                triggerArea.classList.add('is-drawn');
                state = 'drawn';

                // 签子出来后，加一个小提示
                const clickHint = topDoc.createElement('div');
                clickHint.innerText = '点击签子查看';
                clickHint.style.cssText = 'position:absolute; top:-30px; font-size:14px; color:#b45309; font-weight:bold; animation: float 1.5s infinite;';
                triggerArea.appendChild(clickHint);

                // 抽取随机运势数据
                currentFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
            }, 1500);
        });

        // 点击签子查看结果
        stick.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止冒泡
            if (state !== 'drawn') return;
            state = 'result';

            // 填入数据
            levelDom.innerText = currentFortune.level;
            levelDom.style.color = currentFortune.color;
            textDom.innerText = currentFortune.text;

            // 弹窗显示
            modal.classList.add('show');
        });

        // 关闭弹窗并重置
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
            setTimeout(() => {
                // 重置状态，准备下一次抽签
                triggerArea.classList.remove('is-drawn');
                const tempHint = triggerArea.querySelector('div[style*="点击签子查看"]');
                if(tempHint) tempHint.remove();

                hint.style.display = 'block';
                hint.innerText = '再次摇签';
                state = 'ready';
            }, 400); // 等待弹窗消失动画
        });
    };

})();
