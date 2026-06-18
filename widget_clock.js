// ==========================================
// 秋青子专属小组件：动态指针时钟
// 文件名：widget_clock.js
// ==========================================
(function() {
    window.QingziWidgets = window.QingziWidgets || {};

    window.QingziWidgets['clock'] = {
        size: '2x2', // 占用 2x2 格子 (对应约 160x160 像素)
        render: function(container) {
            container.innerHTML = `
                <style>
                    .widget-clock-wrap {
                        width: 100%; height: 100%;
                        background: linear-gradient(135deg, #ffffff, #f1f5f9);
                        border-radius: 24px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.5);
                        display: flex; align-items: center; justify-content: center;
                        position: relative;
                    }
                    .clock-face {
                        width: 85%; height: 85%;
                        border-radius: 50%;
                        background: #fff;
                        box-shadow: inset 0 5px 15px rgba(0,0,0,0.1), 0 2px 5px rgba(0,0,0,0.05);
                        position: relative;
                    }
                    /* 刻度 */
                    .clock-mark { position: absolute; width: 4px; height: 10px; background: #cbd5e1; top: 5px; left: 50%; transform: translateX(-50%); border-radius: 2px;}
                    .clock-mark.m12 { top: 6px; background: #db2777; height: 12px; }
                    .clock-mark.m3 { top: 50%; left: auto; right: 6px; width: 10px; height: 4px; transform: translateY(-50%); }
                    .clock-mark.m6 { top: auto; bottom: 6px; }
                    .clock-mark.m9 { top: 50%; left: 6px; width: 10px; height: 4px; transform: translateY(-50%); }

                    /* 指针 */
                    .clock-hand { position: absolute; bottom: 50%; left: 50%; transform-origin: bottom center; border-radius: 4px; z-index: 5;}
                    .hand-hour { width: 6px; height: 28%; background: #1e293b; margin-left: -3px; }
                    .hand-minute { width: 4px; height: 38%; background: #475569; margin-left: -2px; }
                    .hand-second { width: 2px; height: 42%; background: #ef4444; margin-left: -1px; z-index: 6;}
                    .clock-center { position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; background: #1e293b; border: 3px solid #ef4444; border-radius: 50%; transform: translate(-50%, -50%); z-index: 10;}
                </style>
                <div class="widget-clock-wrap">
                    <div class="clock-face">
                        <div class="clock-mark m12"></div>
                        <div class="clock-mark m3"></div>
                        <div class="clock-mark m6"></div>
                        <div class="clock-mark m9"></div>
                        <div class="clock-hand hand-hour" id="wg-hour"></div>
                        <div class="clock-hand hand-minute" id="wg-min"></div>
                        <div class="clock-hand hand-second" id="wg-sec"></div>
                        <div class="clock-center"></div>
                    </div>
                </div>
            `;

            const hourHand = container.querySelector('#wg-hour');
            const minHand = container.querySelector('#wg-min');
            const secHand = container.querySelector('#wg-sec');

            function updateClock() {
                // 读取系统设置的时间
                let now = new Date();
                try {
                    if (window.getQingziSettings) {
                        const s = window.getQingziSettings();
                        if (!s.autoTimezone && s.customTimezone) {
                            const tzStr = new Date().toLocaleString("en-US", {timeZone: s.customTimezone});
                            now = new Date(tzStr);
                        }
                    }
                } catch(e){}

                const s = now.getSeconds();
                const m = now.getMinutes();
                const h = now.getHours();

                secHand.style.transform = `rotate(${s * 6}deg)`;
                minHand.style.transform = `rotate(${m * 6 + s * 0.1}deg)`;
                hourHand.style.transform = `rotate(${(h % 12) * 30 + m * 0.5}deg)`;
            }

            setInterval(updateClock, 1000);
            updateClock();
        }
    };
})();
