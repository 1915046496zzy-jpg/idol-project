// ==========================================
// ui_twitter_app.js (IdolX 应用模块 - 纯净修复版)
// ==========================================
(function() {
    let topWin = window.parent || window;

    topWin.renderTwitterApp = function(container) {
        if (!container) return;

        // 获取主角头像
        let mainAvatar = 'https://i.postimg.cc/QxX9b7k0/default-avatar.png';
        if (typeof topWin.getAssetUrl === 'function') {
            let tryAvatar = topWin.getAssetUrl('idol_avatar', 'avatar');
            if (tryAvatar && tryAvatar !== '') mainAvatar = tryAvatar;
        }

        // 随机路人头像库
        const bgColors = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#38bdf8', '#22d3ee', '#818cf8', '#a78bfa', '#c084fc', '#f472b6', '#fb7185'];
        const iconList = ['bi-person', 'bi-emoji-smile', 'bi-emoji-sunglasses', 'bi-robot', 'bi-alien', 'bi-ghost', 'bi-moon', 'bi-snow', 'bi-lightning', 'bi-cup-hot', 'bi-controller'];

        function getRandomAvatarHtml() {
            const color = bgColors[Math.floor(Math.random() * bgColors.length)];
            const icon = iconList[Math.floor(Math.random() * iconList.length)];
            return `<div style="width:48px; height:48px; border-radius:50%; background:${color}; display:flex; justify-content:center; align-items:center; color:#fff; font-size:24px; flex-shrink:0;"><i class="bi ${icon}"></i></div>`;
        }

        // 1. 构建 UI 结构
        container.innerHTML = `
            <div class="idolx-container" style="display:flex; flex-direction:column; height:100%; background:#ffffff; color:#0f1419; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; position:relative; overflow:hidden;">

                <!-- 顶部栏 -->
                <div class="idolx-header" style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); z-index:10; flex-shrink:0;">
                    <img src="${mainAvatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; background:#e1e8ed; box-shadow:0 0 2px rgba(0,0,0,0.1);">
                    <i class="bi bi-twitter" style="font-size:24px; color:#1d9bf0;"></i>
                    <i class="bi bi-stars btn-unimplemented" style="font-size:20px; color:#0f1419; cursor:pointer;"></i>
                </div>

                <!-- 页面容器 (Tab切换) -->
                <div id="idolx-view-home" class="idolx-view" style="display:flex; flex-direction:column; flex:1; overflow:hidden;">
                    <div style="display:flex; border-bottom:1px solid #eff3f4; font-weight:bold; font-size:15px; color:#536471; flex-shrink:0;">
                        <div style="flex:1; text-align:center; padding:15px 0; color:#0f1419; position:relative; cursor:pointer;">
                            为你推荐
                            <div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:56px; height:4px; background:#1d9bf0; border-radius:4px;"></div>
                        </div>
                        <div class="btn-unimplemented" style="flex:1; text-align:center; padding:15px 0; cursor:pointer;">正在关注</div>
                    </div>
                    <div id="idolx-timeline-scroll" style="flex:1; overflow-y:auto; position:relative; padding-bottom:60px;">
                        <div id="idolx-refresh-btn-home" style="text-align:center; padding:15px; color:#1d9bf0; cursor:pointer; font-size:14px; transition:0.2s;">
                            <i class="bi bi-arrow-down-circle"></i> 下拉或点击刷新推文
                        </div>
                        <div id="idolx-tweets-container">
                            <div style="padding:40px 20px; text-align:center; color:#536471; font-size:15px;">主页空空如也，快点击刷新获取最新动态吧！</div>
                        </div>
                    </div>
                </div>

                <!-- 探索页 (独立视图) -->
                <div id="idolx-view-explore" class="idolx-view" style="display:none; flex-direction:column; flex:1; overflow:hidden;">
                    <div style="padding:10px 16px; border-bottom:1px solid #eff3f4; flex-shrink:0;">
                        <div style="background:#eff3f4; border-radius:20px; padding:8px 16px; display:flex; align-items:center; color:#536471;">
                            <i class="bi bi-search"></i>
                            <input type="text" placeholder="搜索 IdolX" style="flex:1; background:transparent; border:none; outline:none; margin-left:10px; font-size:15px;">
                        </div>
                    </div>
                    <div style="flex:1; overflow-y:auto; padding-bottom:60px;">
                        <div id="idolx-refresh-btn-explore" style="text-align:center; padding:15px; color:#1d9bf0; cursor:pointer; font-size:14px; transition:0.2s; border-bottom:1px solid #eff3f4;">
                            <i class="bi bi-arrow-down-circle"></i> 点击获取最新热搜
                        </div>
                        <div style="padding:15px 16px 5px; font-weight:900; font-size:20px; color:#0f1419;">日本趋势</div>
                        <div id="idolx-trends-container">
                            <div style="padding:30px; text-align:center; color:#536471; font-size:14px;">点击上方按钮获取趋势数据</div>
                        </div>
                    </div>
                </div>

                <!-- 底部导航栏 -->
                <div class="idolx-bottom-nav" style="height:53px; border-top:1px solid #eff3f4; display:flex; justify-content:space-around; align-items:center; background:#ffffff; position:absolute; bottom:0; width:100%; z-index:10;">
                    <i class="bi bi-house-door-fill nav-tab active" data-target="home" style="font-size:24px; color:#0f1419; cursor:pointer; transition:0.2s;"></i>
                    <i class="bi bi-search nav-tab" data-target="explore" style="font-size:24px; color:#536471; cursor:pointer; transition:0.2s;"></i>
                    <i class="bi bi-bell btn-unimplemented" style="font-size:24px; color:#536471; cursor:pointer;"></i>
                    <i class="bi bi-envelope btn-unimplemented" style="font-size:24px; color:#536471; cursor:pointer;"></i>
                </div>

                <!-- 悬浮发推按钮 -->
                <div id="btn-compose-tweet" style="position:absolute; right:20px; bottom:70px; width:56px; height:56px; background:#1d9bf0; border-radius:50%; display:flex; justify-content:center; align-items:center; color:#fff; font-size:24px; box-shadow:0 8px 28px rgba(0,0,0,0.28); cursor:pointer; z-index:20; transition:transform 0.2s;">
                    <i class="bi bi-feather"></i>
                </div>

                <!-- 发推操作弹窗 -->
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

                <!-- 推文详情面板 -->
                <div id="idolx-tweet-detail" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:#fff; z-index:40; flex-direction:column;">
                    <div style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; align-items:center; gap:20px; flex-shrink:0;">
                        <i class="bi bi-arrow-left" id="btn-close-detail" style="font-size:20px; cursor:pointer;"></i>
                        <span style="font-weight:bold; font-size:18px;">推文</span>
                    </div>
                    <div id="detail-content-area" style="flex:1; overflow-y:auto; padding-bottom:70px;">
                    </div>
                    <div style="position:absolute; bottom:0; width:100%; background:#fff; border-top:1px solid #eff3f4; padding:10px 16px; display:flex; gap:10px; align-items:center;">
                        <img src="${mainAvatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; background:#e1e8ed;">
                        <input type="text" id="input-reply" placeholder="发布你的回复" style="flex:1; background:#eff3f4; border:none; padding:10px 16px; border-radius:20px; outline:none; font-size:15px;">
                        <button id="btn-send-reply" style="background:#1d9bf0; color:#fff; border:none; padding:8px 16px; border-radius:20px; font-weight:bold; cursor:pointer;">回复</button>
                    </div>
                </div>

                <!-- Toast 提示 -->
                <div id="idolx-toast" style="display:none; position:absolute; top:60px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:8px 16px; border-radius:20px; font-size:13px; z-index:99; white-space:nowrap; box-shadow:0 4px 12px rgba(0,0,0,0.15);"></div>
            </div>
        `;

        // 2. DOM 元素获取
        const viewHome = container.querySelector('#idolx-view-home');
        const viewExplore = container.querySelector('#idolx-view-explore');
        const navTabs = container.querySelectorAll('.nav-tab');

        const refreshHomeBtn = container.querySelector('#idolx-refresh-btn-home');
        const tweetsContainer = container.querySelector('#idolx-tweets-container');

        const refreshExploreBtn = container.querySelector('#idolx-refresh-btn-explore');
        const trendsContainer = container.querySelector('#idolx-trends-container');

        const btnCompose = container.querySelector('#btn-compose-tweet');
        const composeModal = container.querySelector('#idolx-compose-modal');
        const btnCloseCompose = container.querySelector('#btn-close-compose');
        const tweetButtons = container.querySelectorAll('.btn-tweet-action');

        const tweetDetailPanel = container.querySelector('#idolx-tweet-detail');
        const btnCloseDetail = container.querySelector('#btn-close-detail');
        const detailContentArea = container.querySelector('#detail-content-area');
        const inputReply = container.querySelector('#input-reply');
        const btnSendReply = container.querySelector('#btn-send-reply');

        const toastEl = container.querySelector('#idolx-toast');
        const unimplBtns = container.querySelectorAll('.btn-unimplemented');

        // 3. UI 基础交互
        function showToast(msg) {
            toastEl.innerText = msg;
            toastEl.style.display = 'block';
            setTimeout(() => { toastEl.style.display = 'none'; }, 2000);
        }

        unimplBtns.forEach(btn => btn.addEventListener('click', () => showToast("该功能仍在开发中哦~")));
        btnCompose.addEventListener('click', () => composeModal.style.display = 'flex');
        btnCloseCompose.addEventListener('click', () => composeModal.style.display = 'none');
        btnCloseDetail.addEventListener('click', () => tweetDetailPanel.style.display = 'none');

        // 导航切换
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                navTabs.forEach(t => { t.style.color = '#536471'; t.classList.remove('active'); });
                e.target.style.color = '#0f1419';
                e.target.classList.add('active');

                if (e.target.getAttribute('data-target') === 'home') {
                    viewHome.style.display = 'flex';
                    viewExplore.style.display = 'none';
                    btnCompose.style.display = 'flex';
                } else {
                    viewHome.style.display = 'none';
                    viewExplore.style.display = 'flex';
                    btnCompose.style.display = 'none';
                }
            });
        });

        // 4. API 请求封装
        async function fetchIdolXData(targetType, action = 'refresh') {
            let currentStats = {
                fame: typeof topWin.getFame === 'function' ? topWin.getFame() : 5000,
                stress: typeof topWin.getStress === 'function' ? topWin.getStress() : 30
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
                showToast("请先在设置App中配置API信息！");
                throw new Error("API未配置");
            }

            let promptText = "";
            if (targetType === 'timeline') {
                promptText = `你现在是偶像企划游戏里的社交媒体引擎。
当前状态: 粉丝数=${currentStats.fame}, 压力值=${currentStats.stress}。
玩家操作: ${action === 'refresh' ? '刷新时间线' : '发送' + action + '推文'}。
请生成3-5条推文(tweets)。第一条必须是Idol_Official发推，其余是粉丝或路人。
严格返回JSON格式，不能有任何代码块标记：
{
  "tweets": [
    { "id": "t1", "name": "昵称", "handle": "@id", "time": "几分钟前", "isVerified": false, "content": "内容", "replies": "数", "retweets": "数", "likes": "数", "views": "数" }
  ]
}`;
            } else if (targetType === 'trends') {
                promptText = `你现在是社交媒体引擎。当前偶像状态: 粉丝数=${currentStats.fame}, 压力值=${currentStats.stress}。
请生成5个当前日本的热搜趋势(trends)，包含社会日常与偶像相关的词条。
严格返回JSON格式，不能有任何代码块标记：
{
  "trends": [
    { "keyword": "#词条名", "posts": "讨论量" }
  ]
}`;
            }

            let fetchUrl = settings.apiHost;
            if (fetchUrl.endsWith('/')) fetchUrl = fetchUrl.slice(0, -1);
            let path = settings.apiPath || '/v1/chat/completions';
            if (!path.startsWith('/')) path = '/' + path;
            fetchUrl += path;

            const requestBody = {
                model: settings.apiModel || "gpt-3.5-turbo",
                messages: [{ role: "user", content: promptText }]
            };

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + settings.apiKey.trim() },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const resData = await response.json();

            let contentStr = '';
            if (resData.choices && resData.choices.length > 0) contentStr = resData.choices[0].message.content;
            else if (resData.response) contentStr = resData.response;
            else contentStr = JSON.stringify(resData);

            let cleanStr = contentStr.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
            try {
                return JSON.parse(cleanStr);
            } catch(e) {
                let match = contentStr.match(/{[\s\S]*}/);
                if (match) return JSON.parse(match[0]);
                throw new Error(<q>"JSON提取失败"</q>);
            }
        }

        // 5. 渲染推文
        function renderTweets(tweets) {
            tweetsContainer.innerHTML = '';
            if (!tweets || tweets.length === 0) return;

            tweets.forEach((tweet, index) => {
                let isOfficial = tweet.name === 'Idol_Official' || tweet.handle.toLowerCase().includes('idol');
                let avatarHtml = isOfficial
                    ? `<img src="${mainAvatar}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; background:#e1e8ed; flex-shrink:0;">`
                    : getRandomAvatarHtml();

                tweet.id = tweet.id || 'tweet_' + index;

                let tweetEl = document.createElement('div');
                tweetEl.style.cssText = <q>"padding:12px 16px; border-bottom:1px solid #eff3f4; display:flex; gap:12px; cursor:pointer; transition:background 0.2s;"</q>;
                tweetEl.innerHTML = `
                    ${avatarHtml}
                    <div style="flex:1; min-width:0;">
                        <div style="display:flex; align-items:center; gap:4px; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            <span style="font-weight:bold; color:#0f1419; font-size:15px;">${tweet.name || '未知用户'}</span>
                            ${isOfficial || tweet.isVerified ? '<i class="bi bi-patch-check-fill" style="color:#1d9bf0; font-size:14px;"></i>' : ''}
                            <span style="color:#536471; font-size:15px; margin-left:2px;">${tweet.handle || '@unknown'}</span>
                            <span style="color:#536471; font-size:15px;">· ${tweet.time || '刚刚'}</span>
                        </div>
                        <div style="font-size:15px; color:#0f1419; line-height:1.4; margin-bottom:12px; word-break:break-word;">
                            ${tweet.content || ''}
                        </div>
                        <div style="display:flex; justify-content:space-between; color:#536471; font-size:13px; max-width:425px; margin-top:12px;">
                            <div class="action-reply" style="display:flex; align-items:center; gap:8px;"><i class="bi bi-chat"></i> ${tweet.replies || '0'}</div>
                            <div style="display:flex; align-items:center; gap:8px;"><i class="bi bi-arrow-repeat"></i> ${tweet.retweets || '0'}</div>
                            <div class="action-like" style="display:flex; align-items:center; gap:8px; transition:0.2s;" data-liked="false"><i class="bi bi-heart"></i> <span class="like-count">${tweet.likes || '0'}</span></div>
                            <div style="display:flex; align-items:center; gap:8px;"><i class="bi bi-bar-chart"></i> ${tweet.views || '0'}</div>
                        </div>
                    </div>
                `;

                tweetEl.addEventListener('click', (e) => {
                    if(e.target.closest('.action-like') || e.target.closest('.action-reply')) return;
                    openTweetDetail(tweet, avatarHtml, isOfficial);
                });

                let likeBtn = tweetEl.querySelector('.action-like');
                likeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let isLiked = likeBtn.getAttribute('data-liked') === 'true';
                    let icon = likeBtn.querySelector('i');
                    let countSpan = likeBtn.querySelector('.like-count');
                    let count = parseInt(countSpan.innerText.replace(/,/g, '').replace(/K/g, '000').replace(/W/g, '0000')) || 0;

                    if(!isLiked) {
                        icon.classList.remove('bi-heart'); icon.classList.add('bi-heart-fill');
                        likeBtn.style.color = '#f91880';
                        likeBtn.setAttribute('data-liked', 'true');
                        countSpan.innerText = count + 1;
                        showToast(<q>"已喜欢该推文"</q>);
                    } else {
                        icon.classList.remove('bi-heart-fill'); icon.classList.add('bi-heart');
                        likeBtn.style.color = '#536471';
                        likeBtn.setAttribute('data-liked', 'false');
                        countSpan.innerText = count - 1;
                    }
                });

                tweetsContainer.appendChild(tweetEl);
            });
        }

        // 渲染详情
        function openTweetDetail(tweet, avatarHtml, isOfficial) {
            detailContentArea.innerHTML = `
                <div style="padding:16px;">
                    <div style="display:flex; gap:12px; margin-bottom:15px;">
                        ${avatarHtml}
                        <div style="display:flex; flex-direction:column; justify-content:center;">
                            <div style="font-weight:bold; color:#0f1419; font-size:16px; display:flex; align-items:center; gap:4px;">
                                ${tweet.name} ${isOfficial || tweet.isVerified ? '<i class="bi bi-patch-check-fill" style="color:#1d9bf0;"></i>' : ''}
                            </div>
                            <div style="color:#536471; font-size:15px;">${tweet.handle}</div>
                        </div>
                    </div>
                    <div style="font-size:18px; color:#0f1419; line-height:1.5; margin-bottom:15px; word-break:break-word;">
                        ${tweet.content}
                    </div>
                    <div style="color:#536471; font-size:15px; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid #eff3f4;">
                        ${new Date().toLocaleTimeString()} · ${tweet.views || '0'} 次查看
                    </div>
                    <div style="display:flex; justify-content:space-around; color:#536471; font-size:20px; padding:10px 0; border-bottom:1px solid #eff3f4;">
                        <i class="bi bi-chat"></i>
                        <i class="bi bi-arrow-repeat"></i>
                        <i class="bi bi-heart"></i>
                        <i class="bi bi-share"></i>
                    </div>
                </div>
                <div id="detail-replies-area">
                    <div style="padding:20px; text-align:center; color:#536471; font-size:14px;">评论区加载中...</div>
                </div>
            `;
            tweetDetailPanel.style.display = 'flex';
            inputReply.value = '';

            setTimeout(() => {
                let repliesArea = detailContentArea.querySelector('#detail-replies-area');
                repliesArea.innerHTML = '';
                let replyAvatar = getRandomAvatarHtml();
                repliesArea.innerHTML += `
                    <div style="padding:12px 16px; border-bottom:1px solid #eff3f4; display:flex; gap:12px;">
                        ${replyAvatar}
                        <div>
                            <div style="display:flex; gap:5px;"><span style="font-weight:bold;">热心网友</span><span style="color:#536471;">@user_99</span></div>
                            <div style="margin-top:4px;">前排围观！支持！</div>
                        </div>
                    </div>
                `;
            }, 500);
        }

        // 发送假评论
        btnSendReply.addEventListener('click', () => {
            let text = inputReply.value.trim();
            if(!text) return;
            let repliesArea = detailContentArea.querySelector('#detail-replies-area');
            if(repliesArea) {
                repliesArea.innerHTML = `
                    <div style="padding:12px 16px; border-bottom:1px solid #eff3f4; display:flex; gap:12px; background:#f7f9f9;">
                        <img src="${mainAvatar}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; background:#e1e8ed; flex-shrink:0;">
                        <div>
                            <div style="display:flex; gap:5px;"><span style="font-weight:bold;">制作人</span><span style="color:#536471;">@producer</span></div>
                            <div style="margin-top:4px;">${text}</div>
                        </div>
                    </div>
                ` + repliesArea.innerHTML;
            }
            inputReply.value = '';
            showToast(<q>"回复已发送"</q>);
        });

        // 渲染热搜
        function renderTrends(trends) {
            trendsContainer.innerHTML = '';
            if (!trends || trends.length === 0) return;
            trends.forEach((trend, index) => {
                let trendEl = document.createElement('div');
                trendEl.style.cssText = <q>"padding:12px 16px; cursor:pointer; transition:background 0.2s;"</q>;
                trendEl.onmouseover = () => trendEl.style.background = '#f7f9f9';
                trendEl.onmouseout = () => trendEl.style.background = 'transparent';

                trendEl.innerHTML = `
                    <div style="color:#536471; font-size:13px; margin-bottom:2px; display:flex; justify-content:space-between;">
                        <span>${index + 1} · 流行趋势</span>
                        <i class="bi bi-three-dots"></i>
                    </div>
                    <div style="font-weight:bold; font-size:15px; color:#0f1419;">${trend.keyword || '未知趋势'}</div>
                    <div style="color:#536471; font-size:13px; margin-top:4px;">${trend.posts || '0'} 帖子</div>
                `;

                trendEl.addEventListener('click', () => {
                    showToast(`正在搜索关于 ${trend.keyword} 的内容...`);
                });

                trendsContainer.appendChild(trendEl);
            });
        }

        // 6. 刷新事件
        refreshHomeBtn.addEventListener('click', async () => {
            refreshHomeBtn.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status" style="width:1rem; height:1rem; margin-right:5px;"></div> 正在生成推文，请等待...';
            try {
                const data = await fetchIdolXData('timeline', 'refresh');
                renderTweets(data.tweets);
            } catch(e) {
                showToast(<q>"推文获取失败，请重试"</q>);
            }
            refreshHomeBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i> 下拉或点击刷新推文';
        });

        refreshExploreBtn.addEventListener('click', async () => {
            refreshExploreBtn.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status" style="width:1rem; height:1rem; margin-right:5px;"></div> 正在生成热搜，请等待...';
            try {
                const data = await fetchIdolXData('trends', 'refresh');
                renderTrends(data.trends);
            } catch(e) {
                showToast(<q>"热搜获取失败，请重试"</q>);
            }
            refreshExploreBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i> 点击获取最新热搜';
        });

        tweetButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const type = e.target.getAttribute('data-type');
                if (type === 'breakdown') {
                    let stress = typeof topWin.getStress === 'function' ? topWin.getStress() : 0;
                    if (stress < 80) { alert("压力值不够，无法触发崩溃发推"); return; }
                }

                let originalText = e.target.innerText;
                e.target.innerText = "正在发布...";
                try {
                    const data = await fetchIdolXData('timeline', type);
                    renderTweets(data.tweets);
                    composeModal.style.display = 'none';
                    container.querySelector('#idolx-timeline-scroll').scrollTop = 0;
                    navTabs[0].click();
                } catch(err) {
                    showToast("发布失败，请检查网络");
                }
                e.target.innerText = originalText;
            });
        });
    };
})();
