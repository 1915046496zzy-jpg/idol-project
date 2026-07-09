// ==========================================
// ui_twitter_app.js (IdolX 应用模块 - 多页面交互完整版)
// ==========================================
(function() {
    let topWin = window.parent || window;

    topWin.renderTwitterApp = function(container) {
        if (!container) return;

        // 获取主角头像
        let mainAvatar = 'https://i.postimg.cc/QxX9b7k0/default-avatar.png';
        if (typeof topWin.getAssetUrl === 'function') {
            let tryAvatar = topWin.getAssetUrl('idol_avatar', 'avatar');
            if (tryAvatar && tryAvatar !== '') {
                mainAvatar = tryAvatar;
            }
        }

        // 1. 构建复杂的手机端 UI 结构
        container.innerHTML = `
            <div class="idolx-container" style="display:flex; flex-direction:column; height:100%; background:#ffffff; color:#0f1419; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; position:relative; overflow:hidden;">

                <!-- ================= 主页面板 ================= -->
                <div id="idolx-home-panel" style="display:flex; flex-direction:column; flex:1; overflow:hidden; width:100%;">
                    <div class="idolx-header" style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); z-index:10; flex-shrink:0;">
                        <img src="${mainAvatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; background:#e1e8ed; box-shadow:0 0 2px rgba(0,0,0,0.1);">
                        <i class="bi bi-twitter" style="font-size:24px; color:#1d9bf0;"></i>
                        <i class="bi bi-stars btn-unimplemented" style="font-size:20px; color:#0f1419; cursor:pointer;"></i>
                    </div>
                    <div style="display:flex; border-bottom:1px solid #eff3f4; font-weight:bold; font-size:15px; color:#536471; flex-shrink:0;">
                        <div style="flex:1; text-align:center; padding:15px 0; color:#0f1419; position:relative; cursor:pointer;">
                            为你推荐
                            <div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:56px; height:4px; background:#1d9bf0; border-radius:4px;"></div>
                        </div>
                        <div class="btn-unimplemented" style="flex:1; text-align:center; padding:15px 0; cursor:pointer;">正在关注</div>
                    </div>

                    <div class="idolx-timeline" id="idolx-timeline-scroll" style="flex:1; overflow-y:auto; position:relative; padding-bottom:60px;">
                        <div id="btn-refresh-home" style="text-align:center; padding:15px; color:#1d9bf0; cursor:pointer; font-size:14px; transition:background 0.2s; border-bottom:1px solid #eff3f4;">
                            <i class="bi bi-arrow-down-circle"></i> 下拉或点击刷新时间线
                        </div>
                        <div id="idolx-tweets-container">
                            <div style="padding:40px 20px; text-align:center; color:#536471; font-size:15px;">
                                欢迎来到 IdolX<br>点击上方刷新获取最新动态吧！
                            </div>
                        </div>
                    </div>

                    <!-- 悬浮发推按钮 -->
                    <div id="btn-compose-tweet" style="position:absolute; right:20px; bottom:70px; width:56px; height:56px; background:#1d9bf0; border-radius:50%; display:flex; justify-content:center; align-items:center; color:#fff; font-size:24px; box-shadow:0 8px 28px rgba(0,0,0,0.28); cursor:pointer; z-index:20; transition:transform 0.2s;">
                        <i class="bi bi-feather"></i>
                    </div>
                </div>

                <!-- ================= 搜索/趋势面板 ================= -->
                <div id="idolx-trends-panel" style="display:none; flex-direction:column; flex:1; overflow:hidden; width:100%; background:#fff;">
                    <div style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; align-items:center; gap:20px; flex-shrink:0;">
                        <img src="${mainAvatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; background:#e1e8ed;">
                        <div style="flex:1; background:#eff3f4; border:none; padding:8px 16px; border-radius:20px; color:#536471; font-size:15px; display:flex; align-items:center; gap:10px;">
                            <i class="bi bi-search"></i> 搜索 IdolX
                        </div>
                    </div>
                    <div style="flex:1; overflow-y:auto; padding-bottom:60px;">
                        <div id="btn-refresh-trends" style="text-align:center; padding:15px; color:#1d9bf0; cursor:pointer; font-size:14px; transition:background 0.2s; border-bottom:1px solid #eff3f4;">
                            <i class="bi bi-arrow-down-circle"></i> 点击获取最新趋势
                        </div>
                        <div style="padding:15px 16px 5px; font-weight:900; font-size:20px;">日本趋势</div>
                        <div id="idolx-trends-container">
                            <div style="color:#536471; font-size:14px; text-align:center; margin-top:20px;">请先刷新获取趋势数据</div>
                        </div>
                    </div>
                </div>

                <!-- ================= 帖子详情面板 ================= -->
                <div id="idolx-detail-panel" style="display:none; flex-direction:column; flex:1; overflow:hidden; width:100%; background:#fff; z-index:15;">
                    <div style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; align-items:center; gap:30px; flex-shrink:0; background:rgba(255,255,255,0.85); backdrop-filter:blur(12px);">
                        <i class="bi bi-arrow-left" id="btn-back-home" style="font-size:20px; cursor:pointer; font-weight:bold;"></i>
                        <span style="font-weight:bold; font-size:18px;">帖子</span>
                    </div>
                    <div style="flex:1; overflow-y:auto; padding-bottom:60px;" id="detail-scroll-area">
                        <!-- 详情正文注入区 -->
                        <div id="detail-main-tweet"></div>

                        <div style="border-bottom:1px solid #eff3f4; border-top:1px solid #eff3f4; padding:12px 16px; color:#536471; font-size:14px;">评论区</div>
                        <!-- 评论列表 -->
                        <div id="detail-replies-container"></div>
                    </div>
                    <!-- 回复输入框 -->
                    <div style="height:60px; border-top:1px solid #eff3f4; background:#fff; display:flex; align-items:center; padding:0 16px; gap:10px; position:absolute; bottom:0; width:100%; box-sizing:border-box;">
                        <img src="${mainAvatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; flex-shrink:0;">
                        <input type="text" id="reply-input" placeholder="发布你的回复" style="flex:1; border:none; outline:none; font-size:15px; color:#0f1419;">
                        <button id="btn-send-reply" style="background:#1d9bf0; color:#fff; border:none; padding:6px 16px; border-radius:20px; font-weight:bold; cursor:pointer;">回复</button>
                    </div>
                </div>

                <!-- ================= 底部导航栏 ================= -->
                <div class="idolx-bottom-nav" style="height:53px; border-top:1px solid #eff3f4; display:flex; justify-content:space-around; align-items:center; background:#ffffff; position:absolute; bottom:0; width:100%; z-index:30;">
                    <i class="bi bi-house-door-fill" style="font-size:24px; color:#0f1419; cursor:pointer;" id="nav-home"></i>
                    <i class="bi bi-search" style="font-size:24px; color:#536471; cursor:pointer;" id="nav-trends"></i>
                    <i class="bi bi-bell btn-unimplemented" style="font-size:24px; color:#536471; cursor:pointer;"></i>
                    <i class="bi bi-envelope btn-unimplemented" style="font-size:24px; color:#536471; cursor:pointer;"></i>
                </div>

                <!-- 发推操作弹窗 -->
                <div id="idolx-compose-modal" style="display:none; position:absolute; bottom:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); z-index:40; flex-direction:column; justify-content:flex-end;">
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

                <!-- 简单的 Toast 提示 -->
                <div id="idolx-toast" style="display:none; position:absolute; top:60px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:8px 16px; border-radius:20px; font-size:13px; z-index:99; white-space:nowrap;"></div>
            </div>
        `;

        // 2. DOM 获取
        const homePanel = container.querySelector('#idolx-home-panel');
        const trendsPanel = container.querySelector('#idolx-trends-panel');
        const detailPanel = container.querySelector('#idolx-detail-panel');

        const navHome = container.querySelector('#nav-home');
        const navTrends = container.querySelector('#nav-trends');

        const refreshHomeBtn = container.querySelector('#btn-refresh-home');
        const refreshTrendsBtn = container.querySelector('#btn-refresh-trends');
        const tweetsContainer = container.querySelector('#idolx-tweets-container');
        const trendsContainer = container.querySelector('#idolx-trends-container');

        const btnCompose = container.querySelector('#btn-compose-tweet');
        const composeModal = container.querySelector('#idolx-compose-modal');
        const btnCloseCompose = container.querySelector('#btn-close-compose');
        const tweetButtons = container.querySelectorAll('.btn-tweet-action');
        const toastEl = container.querySelector('#idolx-toast');
        const unimplBtns = container.querySelectorAll('.btn-unimplemented');

        const btnBackHome = container.querySelector('#btn-back-home');
        const detailMainTweet = container.querySelector('#detail-main-tweet');
        const detailRepliesContainer = container.querySelector('#detail-replies-container');
        const replyInput = container.querySelector('#reply-input');
        const btnSendReply = container.querySelector('#btn-send-reply');

        // 3. UI 交互与面板切换
        function showToast(msg) {
            toastEl.innerText = msg;
            toastEl.style.display = 'block';
            setTimeout(() => { toastEl.style.display = 'none'; }, 2500);
        }

        unimplBtns.forEach(btn => {
            btn.addEventListener('click', () => showToast("该功能仍在开发中哦~"));
        });

        function switchTab(tab) {
            homePanel.style.display = 'none';
            trendsPanel.style.display = 'none';
            detailPanel.style.display = 'none';
            navHome.style.color = '#536471';
            navTrends.style.color = '#536471';

            if(tab === 'home') {
                homePanel.style.display = 'flex';
                navHome.style.color = '#0f1419';
            } else if(tab === 'trends') {
                trendsPanel.style.display = 'flex';
                navTrends.style.color = '#0f1419';
            } else if(tab === 'detail') {
                detailPanel.style.display = 'flex';
            }
        }

        navHome.addEventListener('click', () => switchTab('home'));
        navTrends.addEventListener('click', () => switchTab('trends'));
        btnBackHome.addEventListener('click', () => switchTab('home'));

        btnCompose.addEventListener('click', () => composeModal.style.display = 'flex');
        btnCloseCompose.addEventListener('click', () => composeModal.style.display = 'none');

        // 生成路人头像 HTML
        function getAvatarHtml(tweet) {
            if (tweet.name === 'Idol_Official' || tweet.isVerified) {
                return `<img src="${mainAvatar}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; background:#e1e8ed; flex-shrink:0;">`;
            } else {
                const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                return `<div style="width:48px; height:48px; border-radius:50%; background:${color}; display:flex; justify-content:center; align-items:center; color:#fff; font-size:26px; flex-shrink:0;"><i class="bi bi-person-fill"></i></div>`;
            }
        }

        // 4. 核心 API 请求逻辑
        async function fetchIdolXData(targetType = 'tweets', actionType = 'refresh') {
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
            if (targetType === 'tweets') {
                promptText = `
你现在是偶像企划游戏里的社交媒体引擎。
当前偶像状态: 粉丝数=${currentStats.fame}, 压力值=${currentStats.stress}。
玩家操作: ${actionType === 'refresh' ? '刷新时间线' : '发送' + actionType + '类型的推文'}。
请根据状态生成3条推文(tweets)。第一条必须是偶像本人的发推(name为Idol_Official)；另外两条是粉丝/路人反应。
必须且只能返回纯JSON，不要有任何Markdown包裹。
JSON结构如下:
{"tweets": [{"name": "用户昵称", "handle": "@用户ID", "time": "几分钟前", "isVerified": false, "content": "推文内容", "replies": 12, "retweets": 5, "likes": 120, "views": 500}]}
`;
            } else if (targetType === 'trends') {
                promptText = `
你现在是偶像企划游戏里的社交媒体引擎。
请根据日本网络生态，生成5个真实感的热搜趋势(trends)，其中可以穿插1个与偶像相关的词条。
必须且只能返回纯JSON，不要有任何Markdown包裹。
JSON结构如下:
{"trends": [{"keyword": "#词条", "posts": "讨论量(如 1.2万)"}]}
`;
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

            console.log(`【秋青子】正在请求API (${targetType})...`);

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + settings.apiKey.trim()
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API 请求失败: ${response.status}`);
            }

            const resData = await response.json();
            let contentStr = resData.choices ? resData.choices[0].message.content : (resData.response || JSON.stringify(resData));

            // 终极提取 JSON
            let parsedData = null;
            try {
                let cleanStr = contentStr.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
                parsedData = JSON.parse(cleanStr);
            } catch (e1) {
                let jsonMatch = contentStr.match(/{[\s\S]*}/);
                if (!jsonMatch) throw new Error(<q>"解析崩溃"</q>);
                parsedData = JSON.parse(jsonMatch[0]);
            }

            if(parsedData && parsedData.tweets && parsedData.tweets.length > 0) {
                parsedData.tweets[0].isVerified = true;
            }
            return parsedData;
        }

        // 5. 渲染函数
        function renderTweets(tweets) {
            tweetsContainer.innerHTML = '';
            if (!tweets || tweets.length === 0) return;
            tweets.forEach(tweet => {
                const avatarHtml = getAvatarHtml(tweet);
                // 把推文数据绑定到 DOM 上方便后续传给详情页
                const encodedTweet = encodeURIComponent(JSON.stringify(tweet));
                tweetsContainer.innerHTML += `
                    <div class="tweet-card" data-tweet="${encodedTweet}" style="padding:12px 16px; border-bottom:1px solid #eff3f4; display:flex; gap:12px; cursor:pointer; transition:background 0.2s;">
                        ${avatarHtml}
                        <div style="flex:1; min-width:0;">
                            <div style="display:flex; align-items:center; gap:4px; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                <span style="font-weight:bold; color:#0f1419; font-size:15px;">${tweet.name || '未知用户'}</span>
                                ${tweet.isVerified ? '<i class="bi bi-patch-check-fill" style="color:#1d9bf0; font-size:14px;"></i>' : ''}
                                <span style="color:#536471; font-size:15px; margin-left:2px;">${tweet.handle || '@unknown'}</span>
                                <span style="color:#536471; font-size:15px;">· ${tweet.time || '刚刚'}</span>
                            </div>
                            <div style="font-size:15px; color:#0f1419; line-height:1.4; margin-bottom:12px; word-break:break-word;">
                                ${tweet.content || ''}
                            </div>
                            <div style="display:flex; justify-content:space-between; color:#536471; font-size:13px; max-width:425px; margin-top:12px;">
                                <div class="action-icon" style="display:flex; align-items:center; gap:8px;"><i class="bi bi-chat"></i> ${tweet.replies || '0'}</div>
                                <div class="action-icon btn-retweet" style="display:flex; align-items:center; gap:8px;"><i class="bi bi-arrow-repeat"></i> <span class="num">${tweet.retweets || '0'}</span></div>
                                <div class="action-icon btn-like" style="display:flex; align-items:center; gap:8px;"><i class="bi bi-heart"></i> <span class="num">${tweet.likes || '0'}</span></div>
                                <div class="action-icon" style="display:flex; align-items:center; gap:8px;"><i class="bi bi-bar-chart"></i> ${tweet.views || '0'}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        function renderTrends(trends) {
            trendsContainer.innerHTML = '';
            if (!trends || trends.length === 0) return;
            trends.forEach((trend, index) => {
                trendsContainer.innerHTML += `
                    <div class="trend-item" style="padding:12px 16px; cursor:pointer; border-bottom:1px solid #eff3f4; transition:background 0.2s;">
                        <div style="color:#536471; font-size:13px; margin-bottom:2px; display:flex; justify-content:space-between;">
                            <span>${index + 1} · 流行趋势</span>
                            <i class="bi bi-three-dots"></i>
                        </div>
                        <div style="font-weight:bold; font-size:15px; color:#0f1419;">${trend.keyword || '未知趋势'}</div>
                        <div style="color:#536471; font-size:13px; margin-top:4px;">${trend.posts || '0'} 帖子</div>
                    </div>
                `;
            });
        }

        // 打开帖子详情
        function openTweetDetail(tweet) {
            const avatarHtml = getAvatarHtml(tweet);
            detailMainTweet.innerHTML = `
                <div style="padding:16px; display:flex; gap:12px;">
                    ${avatarHtml}
                    <div style="flex:1;">
                        <div style="font-weight:bold; color:#0f1419; font-size:15px; display:flex; align-items:center; gap:4px;">
                            ${tweet.name} ${tweet.isVerified ? '<i class="bi bi-patch-check-fill" style="color:#1d9bf0; font-size:14px;"></i>' : ''}
                        </div>
                        <div style="color:#536471; font-size:14px;">${tweet.handle}</div>
                    </div>
                </div>
                <div style="padding:0 16px 16px; font-size:18px; color:#0f1419; line-height:1.5; word-break:break-word;">
                    ${tweet.content}
                </div>
                <div style="padding:0 16px 16px; color:#536471; font-size:14px; border-bottom:1px solid #eff3f4;">
                    ${tweet.time} · ${tweet.views || '1.2K'} 查看
                </div>
                <div style="padding:12px 16px; display:flex; justify-content:space-around; color:#536471; font-size:18px; border-bottom:1px solid #eff3f4;">
                    <i class="bi bi-chat"></i>
                    <i class="bi bi-arrow-repeat btn-retweet"></i>
                    <i class="bi bi-heart btn-like"></i>
                    <i class="bi bi-upload"></i>
                </div>
            `;
            detailRepliesContainer.innerHTML = `<div style="padding:30px; text-align:center; color:#536471; font-size:14px;">暂无其他评论</div>`;
            switchTab('detail');
        }

        // 6. 绑定按钮与交互事件

        // 点赞与转推事件委托 (主页与详情页通用)
        container.addEventListener('click', (e) => {
            // 点赞
            const likeBtn = e.target.closest('.btn-like');
            if (likeBtn) {
                e.stopPropagation();
                let icon = likeBtn.querySelector('i');
                let numSpan = likeBtn.querySelector('.num');
                if (icon.classList.contains('bi-heart')) {
                    icon.classList.replace('bi-heart', 'bi-heart-fill');
                    icon.style.color = '#f91880';
                    likeBtn.style.color = '#f91880';
                    if(numSpan) numSpan.innerText = parseInt(numSpan.innerText) + 1 || 1;
                } else {
                    icon.classList.replace('bi-heart-fill', 'bi-heart');
                    icon.style.color = '';
                    likeBtn.style.color = '';
                    if(numSpan) numSpan.innerText = parseInt(numSpan.innerText) > 0 ? parseInt(numSpan.innerText) - 1 : 0;
                }
                return;
            }
            // 转推
            const rtBtn = e.target.closest('.btn-retweet');
            if (rtBtn) {
                e.stopPropagation();
                let icon = rtBtn.querySelector('i');
                if (icon.style.color === 'rgb(0, 186, 124)') {
                    icon.style.color = '';
                    rtBtn.style.color = '';
                } else {
                    icon.style.color = '#00ba7c';
                    rtBtn.style.color = '#00ba7c';
                }
                return;
            }
            // 进入帖子详情
            const tweetCard = e.target.closest('.tweet-card');
            if (tweetCard) {
                try {
                    let t = JSON.parse(decodeURIComponent(tweetCard.getAttribute('data-tweet')));
                    openTweetDetail(t);
                } catch(err){}
                return;
            }
            // 点击趋势
            const trendItem = e.target.closest('.trend-item');
            if (trendItem) {
                let kw = trendItem.querySelector('div:nth-child(2)').innerText;
                showToast(<q>"准备搜索: "</q> + kw);
                return;
            }
        });

        // 评论发送
        btnSendReply.addEventListener('click', () => {
            let val = replyInput.value.trim();
            if(!val) return;
            let myName = topWin.idolDatabase && topWin.idolDatabase['protagonist'] ? topWin.idolDatabase['protagonist'].name : <q>"Idol_Official"</q>;
            let newReply = `
                <div style="padding:12px 16px; border-bottom:1px solid #eff3f4; display:flex; gap:12px;">
                    <img src="${mainAvatar}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                    <div style="flex:1;">
                        <div style="font-weight:bold; color:#0f1419; font-size:14px;">${myName} <i class="bi bi-patch-check-fill" style="color:#1d9bf0;"></i></div>
                        <div style="font-size:14px; color:#0f1419; margin-top:4px;">${val}</div>
                    </div>
                </div>
            `;
            if (detailRepliesContainer.innerText === <q>"暂无其他评论"</q>) {
                detailRepliesContainer.innerHTML = '';
            }
            detailRepliesContainer.insertAdjacentHTML('afterbegin', newReply);
            replyInput.value = '';
            showToast(<q>"回复已发送"</q>);
        });

        // 刷新主页推文
        refreshHomeBtn.addEventListener('click', async () => {
            refreshHomeBtn.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status" style="width:1rem; height:1rem; border-width:0.15em;"></div> <span style="margin-left:8px;">正在生成，请等待...</span>';
            refreshHomeBtn.style.background = '#f7f9f9';
            try {
                const data = await fetchIdolXData('tweets', 'refresh');
                renderTweets(data.tweets);
            } catch(e) {
                showToast(<q>"获取推文失败，请检查API设置"</q>);
            }
            refreshHomeBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i> 下拉或点击刷新时间线';
            refreshHomeBtn.style.background = 'transparent';
        });

        // 刷新搜索页趋势
        refreshTrendsBtn.addEventListener('click', async () => {
            refreshTrendsBtn.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status" style="width:1rem; height:1rem; border-width:0.15em;"></div> <span style="margin-left:8px;">正在分析热点，请等待...</span>';
            refreshTrendsBtn.style.background = '#f7f9f9';
            try {
                const data = await fetchIdolXData('trends', 'refresh');
                renderTrends(data.trends);
            } catch(e) {
                showToast(<q>"获取趋势失败，请检查API设置"</q>);
            }
            refreshTrendsBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i> 点击获取最新趋势';
            refreshTrendsBtn.style.background = 'transparent';
        });

        // 发推按钮
        tweetButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const type = e.target.getAttribute('data-type');
                if (type === 'breakdown') {
                    let stress = typeof topWin.getStress === 'function' ? topWin.getStress() : 0;
                    if (stress < 80) {
                        alert("目前压力值不够，无法触发崩溃发推哦~");
                        return;
                    }
                }
                let originalText = e.target.innerText;
                e.target.innerText = "正在生成发布，请等待...";
                try {
                    const data = await fetchIdolXData('tweets', type);
                    renderTweets(data.tweets);
                    composeModal.style.display = 'none';
                    container.querySelector('#idolx-timeline-scroll').scrollTop = 0;
                    showToast("推文已发布");
                } catch(err) {
                    showToast("发布失败，请检查API设置");
                }
                e.target.innerText = originalText;
            });
        });
    };
})();
