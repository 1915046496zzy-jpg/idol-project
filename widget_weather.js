// ==========================================
// 秋青子专属小组件：动态天气
// 文件名：widget_weather.js
// ==========================================
(function() {
    window.QingziWidgets = window.QingziWidgets || {};

    window.QingziWidgets['weather'] = {
        size: '2x2', // 占用 2x2 格子
        render: function(container) {
            container.innerHTML = `
                <style>
                    .widget-weather-wrap {
                        width: 100%; height: 100%;
                        background: linear-gradient(to bottom, #3b82f6, #60a5fa);
                        border-radius: 24px; color: #fff;
                        box-shadow: 0 10px 20px rgba(59,130,246,0.3);
                        display: flex; flex-direction: column; padding: 20px;
                        position: relative; overflow: hidden;
                    }
                    .wg-w-top { display: flex; justify-content: space-between; align-items: flex-start; z-index: 1;}
                    .wg-w-city { font-size: 16px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.2);}
                    .wg-w-mode { font-size: 10px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 8px;}
                    .wg-w-temp { font-size: 42px; font-weight: 200; margin-top: 5px; text-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 1;}
                    .wg-w-desc { font-size: 14px; font-weight: 600; margin-top: auto; z-index: 1;}
                    .wg-w-icon { position: absolute; right: -10px; bottom: -10px; font-size: 80px; color: rgba(255,255,255,0.4); z-index: 0; filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));}
                </style>
                <div class="widget-weather-wrap" id="wg-w-bg">
                    <div class="wg-w-top">
                        <div class="wg-w-city" id="wg-w-city">加载中...</div>
                        <div class="wg-w-mode" id="wg-w-mode">模式</div>
                    </div>
                    <div class="wg-w-temp" id="wg-w-temp">--°</div>
                    <div class="wg-w-desc" id="wg-w-desc">--</div>
                    <i class="bi bi-cloud-sun-fill wg-w-icon" id="wg-w-icon"></i>
                </div>
            `;

            function updateWeather() {
                const cityEl = container.querySelector('#wg-w-city');
                const modeEl = container.querySelector('#wg-w-mode');
                const tempEl = container.querySelector('#wg-w-temp');
                const descEl = container.querySelector('#wg-w-desc');
                const iconEl = container.querySelector('#wg-w-icon');
                const bgEl = container.querySelector('#wg-w-bg');

                let mode = 'local';
                try {
                    if (window.getQingziSettings) {
                        mode = window.getQingziSettings().weatherMode || 'local';
                    }
                } catch(e){}

                if (mode === 'virtual') {
                    // 虚拟剧情天气
                    modeEl.innerText = "剧情";
                    cityEl.innerText = "秋叶原";
                    tempEl.innerText = "24°";
                    descEl.innerText = "微风晴朗";
                    iconEl.className = "bi bi-sun-fill wg-w-icon";
                    bgEl.style.background = "linear-gradient(to bottom, #f59e0b, #fbbf24)";
                } else {
                    // 模拟现实天气 (如果哥哥需要真实API，青子以后可以接上哦)
                    modeEl.innerText = "现实";
                    cityEl.innerText = "东京市";
                    tempEl.innerText = "18°";
                    descEl.innerText = "多云转晴";
                    iconEl.className = "bi bi-cloud-sun-fill wg-w-icon";
                    bgEl.style.background = "linear-gradient(to bottom, #3b82f6, #60a5fa)";
                }
            }

            // 初始更新，并定时检查设置变化
            updateWeather();
            setInterval(updateWeather, 2000);
        }
    };
})();
