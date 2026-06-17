// ==========================================
// 秋青子专属终端：系统设置 App (API与本地化)
// ==========================================
(function(global) {
    // 默认设置项
    const defaultSettings = {
        apiKey: '',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        apiModel: 'gpt-4',
        language: 'zh-CN',
        autoTimezone: true,
        customTimezone: 'Asia/Tokyo'
    };

    // 读取本地设置
    function loadSettings() {
        try {
            const saved = localStorage.getItem('qingzi_system_settings');
            if (saved) {
                return { ...defaultSettings, ...JSON.parse(saved) };
            }
        } catch(e) {
            console.warn("读取设置失败", e);
        }
        return defaultSettings;
    }

    // 保存设置
    function saveSettings(settings) {
        try {
            localStorage.setItem('qingzi_system_settings', JSON.stringify(settings));
            return true;
        } catch(e) {
            console.error("保存设置失败", e);
            return false;
        }
    }

    // 渲染 App 界面
    global.renderSettingsApp = function(container) {
        if (!container) return;

        const currentSettings = loadSettings();

        const html = `
            <style>
                .settings-wrap { padding: 25px; display: flex; flex-direction: column; gap: 30px; font-family: sans-serif; background: #f8fafc; min-height: 100%;}
                .settings-section { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05);}
                .section-title { font-size: 16px; font-weight: 900; color: #1e293b; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; padding-bottom: 10px; border-bottom: 1px dashed rgba(0,0,0,0.1);}
                .section-title i { color: #64748b; }
                .setting-item { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
                .setting-item label { font-size: 13px; font-weight: bold; color: #475569; }
                .setting-item input[type="text"], .setting-item input[type="password"], .setting-item select { padding: 12px 15px; border-radius: 10px; border: 1px solid #cbd5e1; background: #f1f5f9; color: #334155; font-size: 14px; outline: none; transition: 0.2s;}
                .setting-item input:focus, .setting-item select:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1);}

                .btn-save { background: #3b82f6; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer; transition: 0.2s; width: 100%; font-size: 15px;}
                .btn-save:hover { background: #2563eb; transform: translateY(-2px);}

                /* 开关样式 */
                .switch-wrap { display: flex; justify-content: space-between; align-items: center; }
                .switch { position: relative; display: inline-block; width: 50px; height: 26px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
                .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2);}
                input:checked + .slider { background-color: #10b981; }
                input:checked + .slider:before { transform: translateX(24px); }
            </style>

            <div class="settings-wrap">
                <!-- API 配置 -->
                <div class="settings-section">
                    <h3 class="section-title"><i class="bi bi-hdd-network-fill"></i> API 核心配置</h3>
                    <div class="setting-item">
                        <label>API Key</label>
                        <input type="password" id="set-api-key" placeholder="sk-..." value="${currentSettings.apiKey}" />
                    </div>
                    <div class="setting-item">
                        <label>Endpoint URL</label>
                        <input type="text" id="set-api-url" placeholder="https://api.openai.com/v1/chat/completions" value="${currentSettings.apiEndpoint}" />
                    </div>
                    <div class="setting-item">
                        <label>Model</label>
                        <input type="text" id="set-api-model" placeholder="gpt-4" value="${currentSettings.apiModel}" />
                    </div>
                    <button id="btn-save-api" class="btn-save"><i class="bi bi-cloud-check"></i> 保存 API 配置</button>
                </div>

                <!-- 本地化设置 -->
                <div class="settings-section">
                    <h3 class="section-title"><i class="bi bi-globe"></i> 本地化设置</h3>
                    <div class="setting-item">
                        <label>系统语言 (Language)</label>
                        <select id="set-language">
                            <option value="zh-CN" ${currentSettings.language === 'zh-CN' ? 'selected' : ''}>简体中文</option>
                            <option value="zh-TW" ${currentSettings.language === 'zh-TW' ? 'selected' : ''}>繁體中文</option>
                            <option value="en" ${currentSettings.language === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </div>

                    <div class="setting-item switch-wrap">
                        <label>跟随本地时区</label>
                        <label class="switch">
                            <input type="checkbox" id="set-auto-timezone" ${currentSettings.autoTimezone ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="setting-item" id="manual-timezone-wrap" style="${currentSettings.autoTimezone ? 'display:none;' : ''}">
                        <label>自定义时区</label>
                        <select id="set-timezone">
                            <option value="Asia/Shanghai" ${currentSettings.customTimezone === 'Asia/Shanghai' ? 'selected' : ''}>北京时间 (UTC+8)</option>
                            <option value="Asia/Tokyo" ${currentSettings.customTimezone === 'Asia/Tokyo' ? 'selected' : ''}>东京时间 (UTC+9)</option>
                            <option value="America/New_York" ${currentSettings.customTimezone === 'America/New_York' ? 'selected' : ''}>纽约时间 (UTC-5)</option>
                            <option value="Europe/London" ${currentSettings.customTimezone === 'Europe/London' ? 'selected' : ''}>伦敦时间 (UTC+0)</option>
                        </select>
                    </div>
                    <button id="btn-save-locale" class="btn-save" style="margin-top:10px; background:#64748b;"><i class="bi bi-save"></i> 保存本地化设置</button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // 绑定事件
        const autoTzSwitch = container.querySelector('#set-auto-timezone');
        const manualTzWrap = container.querySelector('#manual-timezone-wrap');

        // 时区开关切换
        autoTzSwitch.addEventListener('change', function() {
            if (this.checked) {
                manualTzWrap.style.display = 'none';
            } else {
                manualTzWrap.style.display = 'flex';
            }
        });

        // 保存 API 按钮
        container.querySelector('#btn-save-api').addEventListener('click', function() {
            const newSettings = loadSettings();
            newSettings.apiKey = container.querySelector('#set-api-key').value.trim();
            newSettings.apiEndpoint = container.querySelector('#set-api-url').value.trim();
            newSettings.apiModel = container.querySelector('#set-api-model').value.trim();

            if(saveSettings(newSettings)) {
                this.innerHTML = '<i class="bi bi-check-circle-fill"></i> 已保存';
                this.style.background = '#10b981';
                setTimeout(() => {
                    this.innerHTML = '<i class="bi bi-cloud-check"></i> 保存 API 配置';
                    this.style.background = '#3b82f6';
                }, 2000);
            }
        });

        // 保存本地化按钮
        container.querySelector('#btn-save-locale').addEventListener('click', function() {
            const newSettings = loadSettings();
            newSettings.language = container.querySelector('#set-language').value;
            newSettings.autoTimezone = container.querySelector('#set-auto-timezone').checked;
            newSettings.customTimezone = container.querySelector('#set-timezone').value;

            if(saveSettings(newSettings)) {
                this.innerHTML = '<i class="bi bi-check-circle-fill"></i> 已保存';
                this.style.background = '#10b981';
                // 触发全局时间更新事件 (如果在其他文件里有更新顶部状态栏时钟的逻辑)
                if(typeof updatePadClock === 'function') updatePadClock();

                setTimeout(() => {
                    this.innerHTML = '<i class="bi bi-save"></i> 保存本地化设置';
                    this.style.background = '#64748b';
                }, 2000);
            }
        });
    };

    // 暴露获取设置的全局方法，方便其他App调用（比如发起请求时读取API）
    global.getQingziSettings = loadSettings;

})(window.parent || window);
