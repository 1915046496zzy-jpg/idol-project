// ==========================================
// ui_twitter_app.js (IdolX 应用模块 - 高兼容API版)
// ==========================================
(function() {
    let topWin = window.parent || window;

    topWin.renderTwitterApp = function(container) {
        if (!container) return;

        // 优化头像获取逻辑
        let mainAvatar = 'https://i.postimg.cc/QxX9b7k0/default-avatar.png';
        if (typeof topWin.getAssetUrl === 'function') {
            let tryAvatar = topWin.getAssetUrl('idol_avatar', 'avatar');
            if (tryAvatar && tryAvatar !== '') {
                mainAvatar = tryAvatar;
            }
        }

        // 1. 构建 UI
        container.innerHTML = `
            <div class="idolx-container" style="display:flex; flex-direction:column; height:100%; background:#ffffff; color:#0f1419; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; position:relative;">

                <div class="idolx-header" style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); z-index:10;">
                    <img src="\${mainAvatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; background:#e1e8ed; cursor:pointer; box-shadow:0 0 2px rgba(0,0,0,0.1);">
                    <i class="bi bi-twitter" style="font-size:24px; color:#1d9bf0;"></i>
                    <i class="bi bi-stars btn-unimplemented" style="font-size:20px; color:#0f1419; cursor:pointer;"></i>
                </div>

                <div style="display:flex; border-bottom:1px solid #eff3f4; font-weight:bold; font-size:15px; color:#536471;">
                    <div style="flex:1; text-align:center; padding:15px 0; color:#0f1419; position:relative; cursor:pointer;">
                        为你推荐
                        <div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:56px; height:4px; background:#1d9bf0; border-radius:4px;"></div>
                    </div>
                    <div class="btn-unimplemented" style="flex:1; text-align:center; padding:15px 0; cursor:pointer;">
                        正在关注
                    </div>
                </div>

                <div class="idolx-body" style="display:flex; flex:1; overflow:hidden;">
                    <div class="idolx-timeline" id="idolx-timeline-scroll" style="flex:1; overflow-y:auto; position:relative; padding-bottom:60px;">
                        <div id="idolx-refresh-btn" style="text-align:center; padding:12px; color:#1d9bf0; cursor:pointer; font-size:14px; transition:background 0.2s;">
                            下拉或点击刷新
                        </div>
                        <div id="idolx-tweets-container">
                            <div style="padding:40px 20px; text-align:center; color:#536471; font-size:15px;">
                                欢迎来到 IdolX<br>点击右上角或刷新获取最新动态吧！
                            </div>
                        </div>
                    </div>
                </div>

                <div class="idolx-bottom-nav" style="height:53px; border-top:1px solid #eff3f4; display:flex; justify-content:space-around; align-items:center; background:#ffffff; position:absolute; bottom:0; width:100%; z-index:10;">
                    <i class="bi bi-house-door-fill" style="font-size:24px; color:#0f1419; cursor:pointer;"></i>
                    <i class="bi bi-search" style="font-size:24px; color:#536471; cursor:pointer;" id="btn-show-trends"></i>
                    <i class="bi bi-bell btn-unimplemented" style="font-size:24px; color:#536471; cursor:pointer;"></i>
                    <i class="bi bi-envelope btn-unimplemented" style="font-size:24px; color:#536471; cursor:pointer;"></i>
                </div>

                <div id="btn-compose-tweet" style="position:absolute; right:20px; bottom:70px; width:56px; height:56px; background:#1d9bf0; border-radius:50%; display:flex; justify-content:center; align-items:center; color:#fff; font-size:24px; box-shadow:0 8px 28px rgba(0,0,0,0.28); cursor:pointer; z-index:20; transition:transform 0.2s;">
                    <i class="bi bi-feather"></i>
                </div>

                <div id="idolx-compose-modal" style="display:none; position:absolute; bottom:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); z-index:30; flex-direction:column; justify-content:flex-end;">
                    <div style="background:#fff; border-radius:20px 20px 0 0; padding:20px; box-shadow:0 -5px 20px rgba(0,0,0,0.1);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                            <span style="font-weight:bold; font-size:18px;">发布新动态</span>
                            <i class="bi bi-x-lg" id="btn-close-compose" style="font-size:20px; cursor:pointer; color:#536471;"></i>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <button class="btn-tweet-action" data-type="normal" style="background:#1d9bf0; color:#fff; border:none; padding:15px; border-radius:30px; font-weight:bold; font-size:16px; cursor:pointer;">常规营业</button>
                            <button class="btn-tweet-action" data-type="promo" style="background:#1d9bf0; color:#fff; border:none; padding:15px; border-radius:30px; font-weight:bold; font-size:16px; cursor:pointer;">宣传造势</button>
                            <button class="btn-tweet-action" data-type="breakdown" style="background:#ef4444; color:#fff; border:none; padding:15px; border-radius:30px; font-weight:bold; font-size:16px; cursor:pointer;">发泄情绪 (需高压)</button>
                        </div>
                    </div>
                </div>

                <div id="idolx-trends-panel" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:#fff; z-index:25; flex-direction:column;">
                    <div style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; align-items:center; gap:20px;">
                        <i class="bi bi-arrow-left" id="btn-close-trends" style="font-size:20px; cursor:pointer;"></i>
                        <input type="text" placeholder="搜索 IdolX" style="flex:1; background:#eff3f4; border:none; padding:8px 16px; border-radius:20px; outline:none; font-size:15px;" readonly>
                    </div>
                    <div style="padding:15px; font-weight:900; font-size:20px;">日本趋势</div>
                    <div id="idolx-trends-container" style="flex:1; overflow-y:auto; padding:0 15px;">
                        <div style="color:#536471; font-size:14px; text-align:center; margin-top:20px;">请先刷新获取趋势数据</div>
                    </div>
                </div>

                <div id="idolx-toast" style="display:none; position:absolute; top:60px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:8px 16px; border-radius:20px; font-size:13px; z-index:99; white-space:nowrap;"></div>
            </div>
        `;

        // 2. DOM 获取
        const refreshBtn = container.querySelector('#idolx-refresh-btn');
        const tweetsContainer = container.querySelector('#idolx-tweets-container');
        const trendsContainer = container.querySelector('#idolx-trends-container');
        const btnCompose = container.querySelector('#btn-compose-tweet');
        const composeModal = container.querySelector('#idolx-compose-modal');
        const btnCloseCompose = container.querySelector('#btn-close-compose');
        const tweetButtons = container.querySelectorAll('.btn-tweet-action');
        const btnShowTrends = container.querySelector('#btn-show-trends');
        const trendsPanel = container.querySelector('#idolx-trends-panel');
        const btnCloseTrends = container.querySelector('#btn-close-trends');
        const toastEl = container.querySelector('#idolx-toast');
        const unimplBtns = container.querySelectorAll('.btn-unimplemented');

        // 3. UI 交互事件
        function showToast(msg, duration = 3000) {
            toastEl.innerText = msg;
            toastEl.style.display = 'block';
            setTimeout(() => { toastEl.style.display = 'none'; }, duration);
        }

        unimplBtns.forEach(btn => {
            btn.addEventListener('click', () => showToast("该功能仍在开发中哦~"));
        });

        btnCompose.addEventListener('click', () => composeModal.style.display = 'flex');
        btnCloseCompose.addEventListener('click', () => composeModal.style.display = 'none');
        btnShowTrends.addEventListener('click', () => trendsPanel.style.display = 'flex');
        btnCloseTrends.addEventListener('click', () => trendsPanel.style.display = 'none');

        // 4. 真实 API 请求逻辑
        async function fetchIdolXData(actionType = 'refresh') {
            let currentStats = {
                fame: typeof topWin.getFame === 'function' ? topWin.getFame() : 5000,
                stress: typeof topWin.getStress === 'function' ? topWin.getStress() : 30,
                action: actionType
            };

            let settings = { apiKey: '', apiHost: '', apiPath: '', apiModel: '' };
            if (typeof topWin.getQingziSettings === 'function') {
                settings = topWin.getQingziSettings();
            } else {
                try {
                    let ls = localStorage.getItem('qingzi_system_settings');
                    if (ls) settings = JSON.parse(ls);
                } catch(e){}
            }

            if (!settings.apiKey || !settings.apiHost) {
                throw new Error("API未配置");
            }

            const promptText = `
你现在是偶像企划游戏里的社交媒体(IdolX)生成引擎。
当前偶像状态: 粉丝数(Fame)=${currentStats.fame}, 压力值(Stress)=${currentStats.stress}。
当前玩家操作: ${actionType === 'refresh' ? '刷新时间线' : '发送' + actionType + '类型的推文'}。
请根据状态生成3条推文(tweets)和4个热搜(trends)。
要求：必须且只能返回纯粹的JSON格式数据，不要加任何其他说明文字，不要加Markdown的\`\`\`json标记！
JSON格式如下:
{
  "tweets": [
    {
      "name": "用户昵称", "handle": "@用户ID", "time": "几分钟前", "isVerified": false,
      "content": "推文内容", "replies": "数字", "retweets": "数字", "likes": "数字", "views": "数字"
    }
  ],
  "trends": [
    { "keyword": "#词条", "posts": "讨论量" }
  ]
}
第一条推文必须是偶像本人的发推（名字用Idol_Official），如果是refresh则是近期推文；另外两条是粉丝/路人/黑粉的反应。
`;

            let fetchUrl = settings.apiHost;
            if (fetchUrl.endsWith('/')) fetchUrl = fetchUrl.slice(0, -1);
            let path = settings.apiPath || '/v1/chat/completions';
            if (!path.startsWith('/')) path = '/' + path;
            fetchUrl += path;

            // 移除了 response_format，提高兼容性
            const requestBody = {
                model: settings.apiModel || "gpt-3.5-turbo",
                messages: [{ role: "user", content: promptText }]
            };

            console.log("【秋青子】正在请求真实API...", fetchUrl);

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + settings.apiKey
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("【秋青子】API请求报错:", errText);
                throw new Error(`API HTTP ${response.status}`);
            }

            const resData = await response.json();
            let contentStr = resData.choices[0].message.content;
            console.log("【秋青子】API原始返回:", contentStr);

            // 清理可能存在的 Markdown 代码块标记
            contentStr = contentStr.trim();
            if (contentStr.startsWith('```json')) {
                contentStr = contentStr.substring(7);
            } else if (contentStr.startsWith('```')) {
                contentStr = contentStr.substring(3);
            }
            if (contentStr.endsWith('```')) {
                contentStr = contentStr.substring(0, contentStr.length - 3);
            }
            contentStr = contentStr.trim();

            let parsedData;
            try {
                parsedData = JSON.parse(contentStr);
            } catch (e) {
                console.error(<q>"【秋青子】JSON解析失败，清理后的字符串为:"</q>, contentStr);
                throw new Error(<q>"API返回的格式不是合法JSON"</q>);
            }

            if(parsedData.tweets && parsedData.tweets.length > 0) {
                parsedData.tweets[0].avatar = mainAvatar;
                parsedData.tweets[0].isVerified = true;
                for(let i=1; i<parsedData.tweets.length; i++) {
                    parsedData.tweets[i].avatar = 'https://i.postimg.cc/PqjZ6d8m/default-avatar-2.png';
                }
            }

            return parsedData;
        }

        function renderTweets(tweets) {
            tweetsContainer.innerHTML = '';
            tweets.forEach(tweet => {
                tweetsContainer.innerHTML += `
                    <div style="padding:12px 16px; border-bottom:1px solid #eff3f4; display:flex; gap:12px; cursor:pointer; hover:bg:#f7f9f9; transition:background 0.2s;">
                        <img src="\${tweet.avatar}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; background:#e1e8ed; flex-shrink:0;">
                        <div style="flex:1; min-width:0;">
                            <div style="display:flex; align-items:center; gap:4px; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                <span style="font-weight:bold; color:#0f1419; font-size:15px;">\${tweet.name}</span>
                                \${tweet.isVerified ? '<i class="bi bi-patch-check-fill" style="color:#1d9bf0; font-size:14px;"></i>' : ''}
                                <span style="color:#536471; font-size:15px; margin-left:2px;">\${tweet.handle}</span>
                                <span style="color:#536471; font-size:15px;">· \${tweet.time}</span>
                            </div>
                            <div style="font-size:15px; color:#0f1419; line-height:1.4; margin-bottom:12px; word-break:break-word;">
                                \${tweet.content}
                            </div>
                            <div style="display:flex; justify-content:space-between; color:#536471; font-size:13px; max-width:425px; margin-top:12px;">
                                <div style="display:flex; align-items:center; gap:8px;"><i class="bi bi-chat"></i> \${tweet.replies}</div>
                                <div style="display:flex; align-items:center; gap:8px;"><i class="bi bi-arrow-repeat"></i> \${tweet.retweets}</div>
                                <div style="display:flex; align-items:center; gap:8px;"><i class="bi bi-heart"></i> \${tweet.likes}</div>
                                <div style="display:flex; align-items:center; gap:8px;"><i class="bi bi-bar-chart"></i> \${tweet.views}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        function renderTrends(trends) {
            trendsContainer.innerHTML = '';
            trends.forEach((trend, index) => {
                trendsContainer.innerHTML += `
                    <div style="padding:12px 0; cursor:pointer;">
                        <div style="color:#536471; font-size:13px; margin-bottom:2px; display:flex; justify-content:space-between;">
                            <span>\${index + 1} · 流行趋势</span>
                            <i class="bi bi-three-dots"></i>
                        </div>
                        <div style="font-weight:bold; font-size:15px; color:#0f1419;">\${trend.keyword}</div>
                        <div style="color:#536471; font-size:13px; margin-top:4px;">\${trend.posts} 帖子</div>
                    </div>
                `;
            });
        }

        refreshBtn.addEventListener('click', async () => {
            refreshBtn.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status" style="width:1rem; height:1rem;"></div>';
            try {
                const data = await fetchIdolXData('refresh');
                renderTweets(data.tweets);
                renderTrends(data.trends);
            } catch(e) {
                if (e.message === <q>"API未配置"</q>) {
                    showToast(<q>"请先在设置App中配置API信息！"</q>, 4000);
                } else {
                    showToast(<q>"获取数据失败: "</q> + e.message + <q>"，请按F12查看控制台"</q>, 5000);
                }
                console.error(<q>"刷新失败详细信息:"</q>, e);
            }
            refreshBtn.innerHTML = '下拉或点击刷新';
        });

        tweetButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const type = e.target.getAttribute('data-type');
                let originalText = e.target.innerText;
                e.target.innerText = <q>"发布中..."</q>;
                try {
                    const data = await fetchIdolXData(type);
                    renderTweets(data.tweets);
                    renderTrends(data.trends);
                    composeModal.style.display = 'none';
                    container.querySelector('#idolx-timeline-scroll').scrollTop = 0;
                } catch(err) {
                    if (err.message === <q>"API未配置"</q>) {
                        showToast(<q>"请先在设置App中配置API信息！"</q>, 4000);
                    } else {
                        showToast(<q>"发布失败: "</q> + err.message + <q>"，请按F12查看控制台"</q>, 5000);
                    }
                    console.error(<q>"发推失败详细信息:"</q>, err);
                }
                e.target.innerText = originalText;
            });
        });
    };
})();
