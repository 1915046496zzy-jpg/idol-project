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

            let lastWeatherUpdate = 0;
            let weatherCache = null;

            function updateWeather() {
                const cityEl = container.querySelector('#wg-w-city');
                const modeEl = container.querySelector('#wg-w-mode');
                const tempEl = container.querySelector('#wg-w-temp');
                const descEl = container.querySelector('#wg-w-desc');
                const iconEl = container.querySelector('#wg-w-icon');
                const bgEl = container.querySelector('#wg-w-bg');

                let mode = 'local';
                try { if (window.getQingziSettings) mode = window.getQingziSettings().weatherMode || 'local'; } catch(e){}

                if (mode === 'virtual') {
                    modeEl.innerText = "剧情";
                    cityEl.innerText = "秋叶原";
                    tempEl.innerText = "24°";
                    descEl.innerText = "微风晴朗";
                    iconEl.className = "bi bi-sun-fill wg-w-icon";
                    bgEl.style.background = "linear-gradient(to bottom, #f59e0b, #fbbf24)";
                } else {
                    // 10分钟更新一次天气，避免频繁请求
                    if (Date.now() - lastWeatherUpdate < 600000 && weatherCache) {
                        applyWeatherData(weatherCache);
                        return;
                    }

                    modeEl.innerText = "现实";
                    cityEl.innerText = "定位中...";

                    // 👇 接入真实API
                    fetch('https://ip-api.com/json/?lang=zh-CN')
                        .then(res => res.json())
                        .then(data => {
                            const city = data.city || '未知地点';
                            return fetch(`https://wttr.in/${city}?format=j1`);
                        })
                        .then(res => res.json())
                        .then(data => {
                            weatherCache = data;
                            lastWeatherUpdate = Date.now();
                            applyWeatherData(data);
                        })
                        .catch(err => {
                            cityEl.innerText = "获取失败";
                            console.error("天气API请求失败:", err);
                        });
                }

                function applyWeatherData(data) {
                    const current = data.current_condition[0];
                    const lang = current.lang_zh[0].value;
                    const weatherDesc = lang.split(',')[0];

                    cityEl.innerText = data.nearest_area[0].areaName[0].value;
                    tempEl.innerText = `${current.temp_C}°`;
                    descEl.innerText = weatherDesc;

                    // 根据天气代码简单映射图标和背景
                    const code = parseInt(current.weatherCode);
                    if ([113].includes(code)) { // 晴
                        iconEl.className = "bi bi-sun-fill wg-w-icon";
                        bgEl.style.background = "linear-gradient(to bottom, #3b82f6, #60a5fa)";
                    } else if ([116, 119, 122].includes(code)) { // 多云
                        iconEl.className = "bi bi-cloud-fill wg-w-icon";
                        bgEl.style.background = "linear-gradient(to bottom, #64748b, #94a3b8)";
                    } else if (code >= 263) { // 雨
                        iconEl.className = "bi bi-cloud-drizzle-fill wg-w-icon";
                        bgEl.style.background = "linear-gradient(to bottom, #4b5563, #6b7280)";
                    } else { // 默认
                        iconEl.className = "bi bi-cloud-sun-fill wg-w-icon";
                        bgEl.style.background = "linear-gradient(to bottom, #3b82f6, #60a5fa)";
                    }
                }
            }

            updateWeather();
            setInterval(updateWeather, 60000); // 每分钟检查一次是否需要更新
        }
    };
})();
