// ==========================================
// 秋青子专属终端：系统设置 App (专业 API 控制台、时区、天气与Dock栏设置)
// ==========================================
(function(global) {
    // 默认设置项
    const defaultSettings = {
        apiMode: 'openai',
        apiKey: '',
        apiHost: 'https://api.openai.com',
        apiPath: '/v1/chat/completions',
        apiModel: 'gpt-3.5-turbo',
        autoTimezone: true,
        customTimezone: 'Asia/Tokyo',
        // 👇 新增：天气数据源设置
        weatherMode: 'local', // 'local' 为本地现实天气, 'virtual' 为剧情虚拟天气
        // 👇 新增：Dock栏APP设置 (存储APP的ID)
        dockApps: ['map', 'contact', 'twitter', 'music']
    };

    // 所有可用的 APP 列表 (用于生成Dock栏选择界面)
    const availableApps = [
        { id: 'map', name: '地图探索', icon: 'bi-map-fill', color: '#334155' },
        { id: 'contact', name: 'LINE', icon: 'bi-chat-dots-fill', color: '#10b981' },
        { id: 'gallery', name: '秘密相册', icon: 'bi-images', color: '#334155' },
        { id: 'twitter', name: 'IdolX', icon: 'bi-twitter', color: '#3b82f6' },
        { id: 'schedule', name: '日程安排', icon: 'bi-calendar3', color: '#334155' },
        { id: 'task', name: '任务看板', icon: 'bi-clipboard-data-fill', color: '#334155' },
        { id: 'wiki', name: '情报Wiki', icon: 'bi-book-half', color: '#334155' },
        { id: 'gacha', name: '星探寻访', icon: 'bi-controller', color: '#f59e0b' },
        { id: 'music', name: '音乐', icon: 'bi-music-note-beamed', color: '#ec4899' },
        { id: 'settings', name: '设置', icon: 'bi-gear-fill', color: '#64748b' },
        { id: 'inventory', name: '背包仓储', icon: 'bi-bag-fill', color: '#8b5cf6' },
        { id: 'wallpaper', name: '主题壁纸', icon: 'bi-palette-fill', color: '#14b8a6' },
        { id: 'darkweb', name: 'DarkWeb', icon: 'bi-incognito', color: '#ef4444' },
        { id: 'fortune', name: '今日运势', icon: 'bi-box2-heart-fill', color: '#dc2626' }
    ];

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

    // 智能拼接完整 URL
    function getFullUrl(host, path) {
        let h = host.trim();
        let p = path.trim();
        if (h.endsWith('/')) h = h.slice(0, -1);
        if (!p.startsWith('/') && p !== '') p = '/' + p;
        return h + p;
    }

    // 🌟 全局时钟更新逻辑 (保持不变)
    global.updatePadClock = function() {
        const timeEl = document.getElementById('pad-time');
        if (!timeEl) return;
        const settings = loadSettings();
        let timeString = '';
        try {
            const now = new Date();
            let options = { hour: '2-digit', minute: '2-digit', hour12: false };
            if (!settings.autoTimezone && settings.customTimezone) {
                options.timeZone = settings.customTimezone;
            }
            timeString = new Intl.DateTimeFormat('en-US', options).format(now);
        } catch(e) {
            timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        timeEl.innerHTML = `${timeString} <i class="bi bi-battery-full"></i> 98%`;
    };

    setInterval(global.updatePadClock, 1000);
    global.updatePadClock();

    // 渲染 App 界面
    global.renderSettingsApp = function(container) {
        if (!container) return;

        const currentSettings = loadSettings();

        // 生成 Dock 栏 APP 选择列表的 HTML
        let dockAppsHtml = '';
        availableApps.forEach(app => {
            const isChecked = currentSettings.dockApps.includes(app.id) ? 'checked' : '';
            dockAppsHtml += `
                <label class="dock-app-item">
                    <input type="checkbox" class="dock-app-checkbox" value="${app.id}" ${isChecked}>
                    <div class="dock-app-card">
                        <i class="bi ${app.icon}" style="color: ${app.color};"></i>
                        <span>${app.name}</span>
                    </div>
                </label>
            `;
        });

        const html = `
            <style>
                .settings-wrap { padding: 30px; display: flex; flex-direction: column; gap: 35px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; min-height: 100%; padding-bottom: 80px;}

                .settings-section { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05);}
                .section-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 25px; display: flex; align-items: center; justify-content: space-between; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;}
                .title-left { display: flex; align-items: center; gap: 10px; }
                .title-left i { color: #3b82f6; }

                .setting-group { margin-bottom: 20px; }
                .setting-label { font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 8px; display: block; }

                .input-row { display: flex; gap: 10px; align-items: center; }
                .input-col { flex: 1; display: flex; flex-direction: column; }

                .form-control { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; color: #1e293b; font-size: 14px; outline: none; transition: 0.2s; box-sizing: border-box;}
                .form-control:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15);}
                .form-control:disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }

                .btn { padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; border: none; display: flex; align-items: center; gap: 6px; justify-content: center;}
                .btn-primary { background: #3b82f6; color: #fff; }
                .btn-primary:hover { background: #2563eb; }
                .btn-secondary { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;}
                .btn-secondary:hover { background: #e2e8f0; color: #1e293b;}
                .btn-danger { background: #fee2e2; color: #ef4444; }
                .btn-danger:hover { background: #fecaca; }

                .url-preview { font-size: 12px; color: #64748b; margin-top: 6px; word-break: break-all; }

                /* 模型列表区 */
                .model-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; margin-top: 30px;}
                .model-list-title { font-size: 15px; font-weight: 700; color: #1e293b; }
                .model-actions { display: flex; gap: 8px; }

                .model-card-list { display: flex; flex-direction: column; gap: 10px; max-height: 250px; overflow-y: auto; padding-right: 5px;}
                .model-card-list::-webkit-scrollbar { width: 6px; }
                .model-card-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

                .model-card { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; transition: 0.2s; cursor: pointer;}
                .model-card:hover { border-color: #3b82f6; background: #fff;}
                .model-card.active { border-color: #3b82f6; background: #eff6ff; box-shadow: 0 0 0 1px #3b82f6 inset;}
                .model-name { font-size: 14px; font-weight: 600; color: #1e293b; }
                .model-status { display: flex; gap: 10px; color: #94a3b8; font-size: 14px;}

                /* 开关样式 */
                .switch-wrap { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;}
                .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
                .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2);}
                input:checked + .slider { background-color: #3b82f6; }
                input:checked + .slider:before { transform: translateX(20px); }

                /* 提示框 */
                #api-toast { font-size: 13px; margin-top: 10px; padding: 10px; border-radius: 6px; display: none;}
                .toast-success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;}
                .toast-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;}
                .toast-info { background: #e0e7ff; color: #1e40af; border: 1px solid #bfdbfe;}

                /* 👇 新增：Dock栏选择网格样式 */
                .dock-app-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; margin-bottom: 15px;}
                .dock-app-item { cursor: pointer; display: block;}
                .dock-app-checkbox { display: none; }
                .dock-app-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 15px 10px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; transition: 0.2s;}
                .dock-app-card i { font-size: 24px; }
                .dock-app-card span { font-size: 12px; font-weight: 600; color: #475569; text-align: center;}
                .dock-app-checkbox:checked + .dock-app-card { border-color: #3b82f6; background: #eff6ff; box-shadow: 0 4px 10px rgba(59,130,246,0.15);}
                .dock-app-checkbox:checked + .dock-app-card i, .dock-app-checkbox:checked + .dock-app-card span { color: #1e40af !important; }
            </style>

            <div class="settings-wrap">
                <!-- API 配置 (保持不变) -->
                <div class="settings-section">
                    <div class="section-title">
                        <div class="title-left"><i class="bi bi-hdd-network"></i> API 连接配置</div>
                        <button id="btn-save-api" class="btn btn-primary" style="padding: 6px 12px; font-size: 13px;">保存当前配置</button>
                    </div>

                    <div class="setting-group">
                        <label class="setting-label">API 模式</label>
                        <select class="form-control" id="set-api-mode">
                            <option value="openai" ${currentSettings.apiMode === 'openai' ? 'selected' : ''}>OpenAI API 兼容</option>
                            <option value="claude" ${currentSettings.apiMode === 'claude' ? 'selected' : ''}>Anthropic (Claude)</option>
                        </select>
                    </div>

                    <div class="setting-group">
                        <label class="setting-label">API 密钥 (API Key)</label>
                        <div class="input-row">
                            <input type="password" class="form-control" id="set-api-key" placeholder="sk-..." value="${currentSettings.apiKey}" />
                            <button class="btn btn-secondary" id="btn-toggle-eye" style="padding: 10px;"><i class="bi bi-eye"></i></button>
                            <button class="btn btn-primary" id="btn-test-api">检查</button>
                        </div>
                    </div>

                    <div class="input-row setting-group" style="align-items: flex-start;">
                        <div class="input-col">
                            <label class="setting-label">API 主机 (Host)</label>
                            <input type="text" class="form-control" id="set-api-host" placeholder="https://api.openai.com" value="${currentSettings.apiHost}" />
                        </div>
                        <div class="input-col">
                            <label class="setting-label">API 路径 (Path)</label>
                            <input type="text" class="form-control" id="set-api-path" placeholder="/v1/chat/completions" value="${currentSettings.apiPath}" />
                        </div>
                    </div>
                    <div class="url-preview" id="url-preview-text">请求地址: ${getFullUrl(currentSettings.apiHost, currentSettings.apiPath)}</div>

                    <div id="api-toast"></div>

                    <!-- 模型管理 -->
                    <div class="model-list-header">
                        <div class="model-list-title">当前模型: <span id="current-model-display" style="color:#3b82f6;">${currentSettings.apiModel || '未选择'}</span></div>
                        <div class="model-actions">
                            <button class="btn btn-secondary" id="btn-fetch-models"><i class="bi bi-arrow-repeat"></i> 获取网络模型</button>
                        </div>
                    </div>

                    <div class="model-card-list" id="model-list-container">
                        <!-- 默认显示一个当前模型 -->
                        <div class="model-card active" data-model="${currentSettings.apiModel}">
                            <div class="model-name">${currentSettings.apiModel}</div>
                            <div class="model-status"><i class="bi bi-check-circle-fill" style="color:#3b82f6;"></i></div>
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 10px;">* 点击列表中的模型即可切换使用。</div>
                </div>

                <!-- 时区设置 (保持不变) -->
                <div class="settings-section">
                    <div class="section-title">
                        <div class="title-left"><i class="bi bi-clock-history"></i> 本地化与时钟</div>
                    </div>
                    <div class="switch-wrap">
                        <label class="setting-label" style="margin:0;">跟随本地设备时区</label>
                        <label class="switch">
                            <input type="checkbox" id="set-auto-timezone" ${currentSettings.autoTimezone ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="setting-group" id="manual-timezone-wrap" style="${currentSettings.autoTimezone ? 'display:none;' : ''}">
                        <label class="setting-label">自定义时区</label>
                        <select class="form-control" id="set-timezone">
                            <option value="Asia/Shanghai" ${currentSettings.customTimezone === 'Asia/Shanghai' ? 'selected' : ''}>北京时间 (UTC+8)</option>
                            <option value="Asia/Tokyo" ${currentSettings.customTimezone === 'Asia/Tokyo' ? 'selected' : ''}>东京时间 (UTC+9)</option>
                            <option value="America/New_York" ${currentSettings.customTimezone === 'America/New_York' ? 'selected' : ''}>纽约时间 (UTC-5)</option>
                            <option value="Europe/London" ${currentSettings.customTimezone === 'Europe/London' ? 'selected' : ''}>伦敦时间 (UTC+0)</option>
                        </select>
                    </div>
                    <button id="btn-save-locale" class="btn btn-secondary" style="width: 100%;">保存时钟设置</button>
                </div>

                <!-- 👇 新增：个性化与桌面设置 -->
                <div class="settings-section">
                    <div class="section-title">
                        <div class="title-left"><i class="bi bi-palette-fill" style="color: #14b8a6;"></i> 个性化与桌面</div>
                    </div>

                    <div class="setting-group">
                        <label class="setting-label">天气数据源</label>
                        <select class="form-control" id="set-weather-mode">
                            <option value="local" ${currentSettings.weatherMode === 'local' ? 'selected' : ''}>跟随本地现实天气</option>
                            <option value="virtual" ${currentSettings.weatherMode === 'virtual' ? 'selected' : ''}>跟随剧情虚拟天气</option>
                        </select>
                    </div>

                    <div class="setting-group">
                        <label class="setting-label" style="display:flex; justify-content:space-between;">
                            <span>Dock 栏常驻应用 (最多建议 6 个)</span>
                            <span id="dock-count" style="color:#3b82f6;">已选: ${currentSettings.dockApps.length}</span>
                        </label>
                        <div class="dock-app-grid" id="dock-app-container">
                            ${dockAppsHtml}
                        </div>
                    </div>

                    <button id="btn-save-personal" class="btn btn-secondary" style="width: 100%;"><i class="bi bi-save"></i> 保存个性化设置</button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // ------------------ DOM 元素 ------------------
        const inputHost = container.querySelector('#set-api-host');
        const inputPath = container.querySelector('#set-api-path');
        const previewText = container.querySelector('#url-preview-text');
        const inputKey = container.querySelector('#set-api-key');
        const btnToggleEye = container.querySelector('#btn-toggle-eye');
        const btnTestApi = container.querySelector('#btn-test-api');
        const btnFetchModels = container.querySelector('#btn-fetch-models');
        const modelListContainer = container.querySelector('#model-list-container');
        const currentModelDisplay = container.querySelector('#current-model-display');
        const toast = container.querySelector('#api-toast');
        const btnSaveApi = container.querySelector('#btn-save-api');

        let selectedModel = currentSettings.apiModel;

        // ------------------ 逻辑交互 ------------------

        // 1. 实时预览 URL
        function updateUrlPreview() {
            previewText.innerText = '请求地址: ' + getFullUrl(inputHost.value, inputPath.value);
        }
        inputHost.addEventListener('input', updateUrlPreview);
        inputPath.addEventListener('input', updateUrlPreview);

        // 2. 密码显隐
        btnToggleEye.addEventListener('click', () => {
            if (inputKey.type === 'password') {
                inputKey.type = 'text';
                btnToggleEye.innerHTML = '<i class="bi bi-eye-slash"></i>';
            } else {
                inputKey.type = 'password';
                btnToggleEye.innerHTML = '<i class="bi bi-eye"></i>';
            }
        });

        // 3. 吐司提示工具
        function showToast(msg, type) {
            toast.className = 'toast-' + type;
            toast.innerHTML = msg;
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 4000);
        }

        // 4. 测试 API 连接
        btnTestApi.addEventListener('click', async () => {
            const host = inputHost.value.trim();
            const key = inputKey.value.trim();
            if(!host) { showToast('主机地址不能为空哦', 'error'); return; }

            btnTestApi.disabled = true;
            btnTestApi.innerHTML = '<i class="bi bi-hourglass-split"></i>';
            showToast('正在测试连接...', 'info');

            // 构造测试请求 (向 /v1/models 发请求最安全)
            let testUrl = host;
            if (testUrl.endsWith('/')) testUrl = testUrl.slice(0, -1);
            testUrl += '/v1/models';

            try {
                const res = await fetch(testUrl, {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + key }
                });
                if (res.ok) {
                    showToast('🎉 连接成功！API 节点正常响应。', 'success');
                } else {
                    showToast(`❌ 连接失败：HTTP ${res.status}`, 'error');
                }
            } catch(e) {
                showToast(`❌ 网络请求错误：${e.message}`, 'error');
            }
            btnTestApi.disabled = false;
            btnTestApi.innerHTML = '检查';
        });

        // 5. 获取并渲染模型列表
        btnFetchModels.addEventListener('click', async () => {
            const host = inputHost.value.trim();
            const key = inputKey.value.trim();

            btnFetchModels.disabled = true;
            btnFetchModels.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> 获取中...';

            let fetchUrl = host;
            if (fetchUrl.endsWith('/')) fetchUrl = fetchUrl.slice(0, -1);
            fetchUrl += '/v1/models';

            try {
                const res = await fetch(fetchUrl, {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + key }
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                let models = [];
                if (data && data.data && Array.isArray(data.data)) {
                    models = data.data.map(m => m.id).sort(); // OpenAI 格式
                } else if (Array.isArray(data)) {
                    models = data.map(m => m.id || m.name || m).sort(); // 兼容格式
                }

                if (models.length === 0) {
                    showToast('未能从该节点获取到有效模型列表', 'error');
                } else {
                    renderModelList(models);
                    showToast(`成功获取 ${models.length} 个模型！`, 'success');
                }
            } catch(e) {
                showToast(`获取模型失败：${e.message}`, 'error');
            }

            btnFetchModels.disabled = false;
            btnFetchModels.innerHTML = '<i class="bi bi-arrow-repeat"></i> 获取网络模型';
        });

        function renderModelList(models) {
            modelListContainer.innerHTML = '';
            models.forEach(modelId => {
                const isActive = (modelId === selectedModel);
                const card = document.createElement('div');
                card.className = `model-card ${isActive ? 'active' : ''}`;
                card.dataset.model = modelId;
                card.innerHTML = `
                    <div class="model-name">${modelId}</div>
                    <div class="model-status">${isActive ? '<i class="bi bi-check-circle-fill" style="color:#3b82f6;"></i>' : ''}</div>
                `;
                card.addEventListener('click', () => {
                    // 清除其他激活状态
                    container.querySelectorAll('.model-card').forEach(c => {
                        c.classList.remove('active');
                        c.querySelector('.model-status').innerHTML = '';
                    });
                    // 设置当前激活
                    card.classList.add('active');
                    card.querySelector('.model-status').innerHTML = '<i class="bi bi-check-circle-fill" style="color:#3b82f6;"></i>';
                    selectedModel = modelId;
                    currentModelDisplay.innerText = modelId;
                });
                modelListContainer.appendChild(card);
            });
        }

        // 6. 保存所有 API 配置
        btnSaveApi.addEventListener('click', () => {
            const newSettings = loadSettings();
            newSettings.apiMode = container.querySelector('#set-api-mode').value;
            newSettings.apiKey = inputKey.value.trim();
            newSettings.apiHost = inputHost.value.trim();
            newSettings.apiPath = inputPath.value.trim();
            newSettings.apiModel = selectedModel;

            if(saveSettings(newSettings)) {
                const oldText = btnSaveApi.innerHTML;
                btnSaveApi.innerHTML = '<i class="bi bi-check2"></i> 已保存';
                btnSaveApi.style.background = '#10b981';
                setTimeout(() => {
                    btnSaveApi.innerHTML = oldText;
                    btnSaveApi.style.background = '#3b82f6';
                }, 1500);
            }
        });

        // 7. 时区开关逻辑与保存
        const autoTzSwitch = container.querySelector('#set-auto-timezone');
        const manualTzWrap = container.querySelector('#manual-timezone-wrap');
        const btnSaveLocale = container.querySelector('#btn-save-locale');

        autoTzSwitch.addEventListener('change', function() {
            manualTzWrap.style.display = this.checked ? 'none' : 'flex';
        });

        btnSaveLocale.addEventListener('click', () => {
            const newSettings = loadSettings();
            newSettings.autoTimezone = autoTzSwitch.checked;
            newSettings.customTimezone = container.querySelector('#set-timezone').value;

            if(saveSettings(newSettings)) {
                btnSaveLocale.innerHTML = '<i class="bi bi-check2"></i> 已保存';
                if(typeof global.updatePadClock === 'function') global.updatePadClock();
                setTimeout(() => { btnSaveLocale.innerHTML = '保存时钟设置'; }, 1500);
            }
        });

        // 👇 8. 新增：个性化与桌面设置的交互与保存
        const dockCheckboxes = container.querySelectorAll('.dock-app-checkbox');
        const dockCountDisplay = container.querySelector('#dock-count');
        const btnSavePersonal = container.querySelector('#btn-save-personal');

        // 实时更新选中数量显示
        dockCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const selectedCount = container.querySelectorAll('.dock-app-checkbox:checked').length;
                dockCountDisplay.innerText = `已选: ${selectedCount}`;
                if (selectedCount > 6) {
                    dockCountDisplay.style.color = '#ef4444'; // 超过建议数量变红
                } else {
                    dockCountDisplay.style.color = '#3b82f6';
                }
            });
        });

        btnSavePersonal.addEventListener('click', () => {
            const newSettings = loadSettings();
            newSettings.weatherMode = container.querySelector('#set-weather-mode').value;

            // 收集选中的 Dock 栏 APP ID
            const selectedDockApps = [];
            container.querySelectorAll('.dock-app-checkbox:checked').forEach(cb => {
                selectedDockApps.push(cb.value);
            });
            newSettings.dockApps = selectedDockApps;

            if(saveSettings(newSettings)) {
                const oldText = btnSavePersonal.innerHTML;
                btnSavePersonal.innerHTML = '<i class="bi bi-check2"></i> 已保存，重启平板生效';
                btnSavePersonal.style.background = '#10b981';
                btnSavePersonal.style.color = '#fff';
                btnSavePersonal.style.border = 'none';
                setTimeout(() => {
                    btnSavePersonal.innerHTML = oldText;
                    btnSavePersonal.style.background = '#f1f5f9';
                    btnSavePersonal.style.color = '#475569';
                    btnSavePersonal.style.border = '1px solid #cbd5e1';
                }, 2000);
            }
        });
    };

    // 暴露获取设置的全局方法
    global.getQingziSettings = loadSettings;

})(window.parent || window);
