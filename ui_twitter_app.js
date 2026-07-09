// ==========================================
// ui_twitter_app.js (IdolX 深度重构版 - 分离视图 & 交互升级1)
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

        // 随机生成路人 Icon 头像的辅助函数
        function getRandomIconAvatar() {
            const icons = ['bi-person-fill', 'bi-emoji-smile-fill', 'bi-robot', 'bi-incognito', 'bi-heart-fill', 'bi-star-fill', 'bi-moon-stars-fill'];
            const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#2dd4bf', '#38bdf8', '#22d3ee', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185'];
            const icon = icons[Math.floor(Math.random() * icons.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return `<div style="width:48px; height:48px; border-radius:50%; background:${color}; color:#fff; display:flex; justify-content:center; align-items:center; font-size:24px; flex-shrink:0;"><i class="bi ${icon}"></i></div>`;
        }

        // 1. 构建多视图 UI 结构
        container.innerHTML = `
            <div class="idolx-container" style="display:flex; flex-direction:column; height:100%; background:#ffffff; color:#0f1419; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; position:relative; overflow:hidden;">

                <!-- 顶部栏 -->
                <div class="idolx-header" style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; justify-content:space-between; align-items:center; position:absolute; top:0; width:100%; background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); z-index:10;">
                    <img src="${mainAvatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; background:#e1e8ed; cursor:pointer; box-shadow:0 0 2px rgba(0,0,0,0.1);">
                    <i class="bi bi-twitter" style="font-size:24px; color:#1d9bf0;"></i>
                    <i class="bi bi-stars btn-unimplemented" style="font-size:20px; color:#0f1419; cursor:pointer;"></i>
                </div>

                <!-- 视图 1：主页 (Home) -->
                <div id="idolx-view-home" style="display:flex; flex-direction:column; width:100%; height:100%; padding-top:53px; padding-bottom:53px;">
                    <div style="display:flex; border-bottom:1px solid #eff3f4; font-weight:bold; font-size:15px; color:#536471; flex-shrink:0;">
                        <div style="flex:1; text-align:center; padding:15px 0; color:#0f1419; position:relative; cursor:pointer;">
                            为你推荐
                            <div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:56px; height:4px; background:#1d9bf0; border-radius:4px;"></div>
                        </div>
                        <div class="btn-unimplemented" style="flex:1; text-align:center; padding:15px 0; cursor:pointer;">正在关注</div>
                    </div>
                    <div style="flex:1; overflow-y:auto; position:relative;" id="home-scroll-area">
                        <div id="btn-refresh-home" style="text-align:center; padding:15px; color:#1d9bf0; cursor:pointer; font-size:14px; transition:background 0.2s;">
                            下拉或点击刷新时间线
                        </div>
                        <div id="home-tweets-container">
                            <div style="padding:40px 20px; text-align:center; color:#536471; font-size:15px;">时间线空空如也，请刷新获取动态。</div>
                        </div>
                    </div>
                </div>

                <!-- 视图 2：搜索/热搜 (Search) -->
                <div id="idolx-view-search" style="display:none; flex-direction:column; width:100%; height:100%; padding-top:53px; padding-bottom:53px;">
                    <div style="padding:10px 16px; border-bottom:1px solid #eff3f4; flex-shrink:0;">
                        <input type="text" placeholder="搜索 IdolX" style="width:100%; background:#eff3f4; border:none; padding:10px 16px; border-radius:20px; outline:none; font-size:15px;" readonly class="btn-unimplemented">
                    </div>
                    <div style="flex:1; overflow-y:auto;" id="search-scroll-area">
                        <div style="padding:15px 16px 5px 16px; font-weight:900; font-size:20px; color:#0f1419; display:flex; justify-content:space-between; align-items:center;">
                            日本趋势
                            <i class="bi bi-arrow-clockwise" id="btn-refresh-trends" style="color:#1d9bf0; cursor:pointer; font-size:18px;" title="刷新趋势"></i>
                        </div>
                        <div id="search-trends-container">
                            <div style="padding:40px 20px; text-align:center; color:#536471; font-size:15px;">点击右上角刷新图标获取最新趋势。</div>
                        </div>
                    </div>
                </div>

                <!-- 视图 3：帖子详情 (Detail) -->
                <div id="idolx-view-detail" style="display:none; flex-direction:column; width:100%; height:100%; background:#fff; position:absolute; top:0; left:0; z-index:15;">
                    <div style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; align-items:center; gap:20px; font-weight:bold; font-size:18px;">
                        <i class="bi bi-arrow-left" id="btn-back-home" style="font-size:20px; cursor:pointer;"></i>
                        帖子
                    </div>
                    <div style="flex:1; overflow-y:auto;" id="detail-content-area"></div>
                </div>

                <!-- 底部导航栏 -->
                <div class="idolx-bottom-nav" style="height:53px; border-top:1px solid #eff3f4; display:flex; justify-content:space-around; align-items:center; background:#ffffff; position:absolute; bottom:0; width:100%; z-index:20;">
                    <i class="bi bi-house-door-fill nav-btn" data-target="home" style="font-size:24px; color:#0f1419; cursor:pointer;"></i>
                    <i class="bi bi-search nav-btn" data-target="search" style="font-size:24px; color:#536471; cursor:pointer;"></i>
                    <i class="bi bi-bell btn-unimplemented" style="font-size:24px; color:#536471; cursor:pointer;"></i>
                    <i class="bi bi-envelope btn-unimplemented" style="font-size:24px; color:#536471; cursor:pointer;"></i>
                </div>

                <!-- 悬浮发推按钮 -->
                <div id="btn-compose-tweet" style="position:absolute; right:20px; bottom:70px; width:56px; height:56px; background:#1d9bf0; border-radius:50%; display:flex; justify-content:center; align-items:center; color:#fff; font-size:24px; box-shadow:0 8px 28px rgba(0,0,0,0.28); cursor:pointer; z-index:12; transition:transform 0.2s;">
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

                <!-- Toast 提示 -->
                <div id="idolx-toast" style="display:none; position:absolute; top:60px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:8px 16px; border-radius:20px; font-size:13px; z-index:99; white-space:nowrap;"></div>
            </div>
        `;

        // 2. DOM 元素获取
        const viewHome = container.querySelector('#idolx-view-home');
        const viewSearch = container.querySelector('#idolx-view-search');
        const viewDetail = container.querySelector('#idolx-view-detail');
        const navBtns = container.querySelectorAll('.nav-btn');
        const unimplBtns = container.querySelectorAll('.btn-unimplemented');

        const btnRefreshHome = container.querySelector('#btn-refresh-home');
        const homeTweetsContainer = container.querySelector('#home-tweets-container');
        const btnRefreshTrends = container.querySelector('#btn-refresh-trends');
        const searchTrendsContainer = container.querySelector('#search-trends-container');
        const btnBackHome = container.querySelector('#btn-back-home');
        const detailContentArea = container.querySelector('#detail-content-area');

        const btnCompose = container.querySelector('#btn-compose-tweet');
        const composeModal = container.querySelector('#idolx-compose-modal');
        const btnCloseCompose = container.querySelector('#btn-close-compose');
        const tweetActionBtns = container.querySelectorAll('.btn-tweet-action');
        const toastEl = container.querySelector('#idolx-toast');

        // 保存当前推文数据以便点击查看
        let currentTweetsData = [];

        // 3. 基础交互
        function showToast(msg) {
            toastEl.innerText = msg;
            toastEl.style.display = 'block';
            setTimeout(() => { toastEl.style.display = 'none'; }, 2000);
        }

        unimplBtns.forEach(btn => btn.addEventListener('click', () => showToast("该功能仍在开发中哦~")));
        btnCompose.addEventListener('click', () => composeModal.style.display = 'flex');
        btnCloseCompose.addEventListener('click', () => composeModal.style.display = 'none');

        // 底部导航切换
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.getAttribute('data-target');
                navBtns.forEach(b => { b.style.color = '#536471'; b.classList.replace('bi-house-door-fill', 'bi-house-door'); });
                e.target.style.color = '#0f1419';

                if (target === 'home') {
                    e.target.classList.replace('bi-house-door', 'bi-house-door-fill');
                    viewHome.style.display = 'flex';
                    viewSearch.style.display = 'none';
                    viewDetail.style.display = 'none';
                    btnCompose.style.display = 'flex';
                } else if (target === 'search') {
                    viewHome.style.display = 'none';
                    viewSearch.style.display = 'flex';
                    viewDetail.style.display = 'none';
                    btnCompose.style.display = 'none';
                }
            });
        });

        btnBackHome.addEventListener('click', () => {
            viewDetail.style.display = 'none';
        });

        // 4. 通用 API 调用函数
        async function callIdolXAPI(promptText) {
            let settings = { apiKey: '', apiHost: '', apiPath: '', apiModel: '' };
            if (typeof topWin.getQingziSettings === 'function') settings = topWin.getQingziSettings();
            else { try { let ls = localStorage.getItem('qingzi_system_settings'); if (ls) settings = JSON.parse(ls); } catch(e){} }

            if (!settings.apiKey || !settings.apiHost) throw new Error("未配置API");

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
            let contentStr = resData.choices ? resData.choices[0].message.content : (resData.response || JSON.stringify(resData));

            let cleanStr = contentStr.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
            try {
                return JSON.parse(cleanStr);
            } catch (e) {
                let jsonMatch = contentStr.match(/{[\s\S]*}/);
                if (!jsonMatch) throw new Error(<q>"JSON 匹配失败"</q>);
                return JSON.parse(jsonMatch[0]);
            }
        }

        // --- 分离：生成推文 ---
        async function fetchIdolXTweets(actionType = 'refresh') {
            let fame = typeof topWin.getFame === 'function' ? topWin.getFame() : 5000;
            let stress = typeof topWin.getStress === 'function' ? topWin.getStress() : 30;
            const prompt = `当前偶像状态: 粉丝数=${fame}, 压力值=${stress}。
操作: ${actionType === 'refresh' ? '刷新时间线' : '发' + actionType + '推文'}。
生成3条推文。第一条必须是偶像(Idol_Official)的推文，后两条是粉丝/路人反应。
严格返回JSON:
{"tweets": [{"name":"昵称","handle":"@ID","time":"时间","content":"内容","replies":10,"retweets":5,"likes":20,"views":100}]}`;

            let data = await callIdolXAPI(prompt);
            if (data && data.tweets) {
                data.tweets[0].avatarHTML = `<img src="${mainAvatar}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;">`;
                data.tweets[0].isVerified = true;
                for(let i=1; i<data.tweets.length; i++) {
                    data.tweets[i].avatarHTML = getRandomIconAvatar();
                    data.tweets[i].isVerified = false;
                }
                return data.tweets;
            }
            return [];
        }

        // --- 分离：生成热搜 ---
        async function fetchIdolXTrends() {
            let fame = typeof topWin.getFame === 'function' ? topWin.getFame() : 5000;
            const prompt = `当前偶像粉丝数=${fame}。生成5个日本推特趋势热搜。80%为日常社会娱乐词条，20%可能与偶像有关。
严格返回JSON:
{"trends": [{"keyword":"#词条","posts":"讨论量字符串"}]}`;

            let data = await callIdolXAPI(prompt);
            return data && data.trends ? data.trends : [];
        }

        // 5. 渲染函数与交互绑定

        // 点赞交互
        container.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.action-like');
            if (likeBtn) {
                const icon = likeBtn.querySelector('i');
                const countSpan = likeBtn.querySelector('.like-count');
                let count = parseInt(countSpan.innerText.replace(/,/g, '') || 0);
                if (icon.classList.contains('bi-heart')) {
                    icon.classList.replace('bi-heart', 'bi-heart-fill');
                    icon.style.color = '#f91880';
                    countSpan.style.color = '#f91880';
                    countSpan.innerText = count + 1;
                } else {
                    icon.classList.replace('bi-heart-fill', 'bi-heart');
                    icon.style.color = '';
                    countSpan.style.color = '';
                    countSpan.innerText = count > 0 ? count - 1 : 0;
                }
                e.stopPropagation();
            }

            // 点击推文进入详情
            const tweetBlock = e.target.closest('.tweet-block');
            if (tweetBlock && !likeBtn && !e.target.closest('.btn-unimplemented')) {
                const index = tweetBlock.getAttribute('data-index');
                openTweetDetail(currentTweetsData[index]);
            }

            // 点击趋势词条
            const trendBlock = e.target.closest('.trend-block');
            if (trendBlock) {
                const kw = trendBlock.getAttribute('data-keyword');
                showToast(`正在搜索词条: ${kw}`);
            }
        });

        function renderTweets(tweets) {
            currentTweetsData = tweets;
            homeTweetsContainer.innerHTML = '';
            if (!tweets || tweets.length === 0) return;
            tweets.forEach((tweet, index) => {
                homeTweetsContainer.innerHTML += `
                    <div class="tweet-block" data-index="${index}" style="padding:12px 16px; border-bottom:1px solid #eff3f4; display:flex; gap:12px; cursor:pointer; transition:background 0.2s;">
                        ${tweet.avatarHTML}
                        <div style="flex:1; min-width:0;">
                            <div style="display:flex; align-items:center; gap:4px; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                <span style="font-weight:bold; color:#0f1419; font-size:15px;">${tweet.name}</span>
                                ${tweet.isVerified ? '<i class="bi bi-patch-check-fill" style="color:#1d9bf0; font-size:14px;"></i>' : ''}
                                <span style="color:#536471; font-size:15px;">${tweet.handle} · ${tweet.time}</span>
                            </div>
                            <div style="font-size:15px; color:#0f1419; line-height:1.4; margin-bottom:12px; word-break:break-word;">
                                ${tweet.content}
                            </div>
                            <div style="display:flex; justify-content:space-between; color:#536471; font-size:13px; max-width:425px; margin-top:12px;">
                                <div style="display:flex; align-items:center; gap:8px;" class="btn-unimplemented"><i class="bi bi-chat"></i> ${tweet.replies}</div>
                                <div style="display:flex; align-items:center; gap:8px;" class="btn-unimplemented"><i class="bi bi-arrow-repeat"></i> ${tweet.retweets}</div>
                                <div style="display:flex; align-items:center; gap:8px;" class="action-like"><i class="bi bi-heart"></i> <span class="like-count">${tweet.likes}</span></div>
                                <div style="display:flex; align-items:center; gap:8px;"><i class="bi bi-bar-chart"></i> ${tweet.views}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        function openTweetDetail(tweet) {
            if(!tweet) return;
            detailContentArea.innerHTML = `
                <div style="padding:16px; border-bottom:1px solid #eff3f4;">
                    <div style="display:flex; gap:12px; margin-bottom:15px;">
                        ${tweet.avatarHTML}
                        <div style="display:flex; flex-direction:column; justify-content:center;">
                            <div style="display:flex; align-items:center; gap:4px;">
                                <span style="font-weight:bold; color:#0f1419; font-size:15px;">${tweet.name}</span>
                                ${tweet.isVerified ? '<i class="bi bi-patch-check-fill" style="color:#1d9bf0; font-size:14px;"></i>' : ''}
                            </div>
                            <span style="color:#536471; font-size:15px;">${tweet.handle}</span>
                        </div>
                    </div>
                    <div style="font-size:18px; color:#0f1419; line-height:1.5; margin-bottom:15px; word-break:break-word;">
                        ${tweet.content}
                    </div>
                    <div style="color:#536471; font-size:15px; margin-bottom:15px; border-bottom:1px solid #eff3f4; padding-bottom:15px;">
                        ${tweet.time} · <span style="font-weight:bold; color:#0f1419;">${tweet.views}</span> 查看
                    </div>
                    <div style="display:flex; justify-content:space-around; color:#536471; font-size:18px; padding:5px 0;">
                        <i class="bi bi-chat btn-unimplemented" style="cursor:pointer;"></i>
                        <i class="bi bi-arrow-repeat btn-unimplemented" style="cursor:pointer;"></i>
                        <div class="action-like" style="cursor:pointer; display:flex; align-items:center; gap:8px;"><i class="bi bi-heart"></i><span class="like-count" style="font-size:15px;">${tweet.likes}</span></div>
                        <i class="bi bi-upload btn-unimplemented" style="cursor:pointer;"></i>
                    </div>
                </div>
                <div style="padding:20px; text-align:center; color:#536471; font-size:14px; background:#f7f9f9; height:100%;">
                    评论区暂未开放API获取
                </div>
            `;
            viewDetail.style.display = 'flex';
        }

        function renderTrends(trends) {
            searchTrendsContainer.innerHTML = '';
            if (!trends || trends.length === 0) return;
            trends.forEach((trend, index) => {
                searchTrendsContainer.innerHTML += `
                    <div class="trend-block" data-keyword="${trend.keyword}" style="padding:12px 16px; cursor:pointer; hover:bg:#f7f9f9; transition:background 0.2s;">
                        <div style="color:#536471; font-size:13px; margin-bottom:2px; display:flex; justify-content:space-between;">
                            <span>${index + 1} · 流行趋势</span>
                            <i class="bi bi-three-dots"></i>
                        </div>
                        <div style="font-weight:bold; font-size:15px; color:#0f1419;">${trend.keyword}</div>
                        <div style="color:#536471; font-size:13px; margin-top:4px;">${trend.posts} 帖子</div>
                    </div>
                `;
            });
        }

        // --- 按钮点击绑定 ---

        // 主页刷新
        btnRefreshHome.addEventListener('click', async () => {
            btnRefreshHome.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status" style="width:1.2rem; height:1.2rem; border-width:0.15em;"></div> <span style="margin-left:8px;">正在生成时间线，请等待...</span>';
            try {
                const tweets = await fetchIdolXTweets('refresh');
                renderTweets(tweets);
            } catch(e) { showToast(<q>"生成失败，请检查API设置"</q>); }
            btnRefreshHome.innerHTML = '下拉或点击刷新时间线';
        });

        // 搜索页趋势刷新
        btnRefreshTrends.addEventListener('click', async () => {
            btnRefreshTrends.classList.replace('bi-arrow-clockwise', 'bi-hourglass-split');
            searchTrendsContainer.innerHTML = '<div style="padding:40px; text-align:center;"><div class="spinner-border text-primary" role="status"></div><div style="margin-top:10px; color:#536471;">正在生成热搜，请等待...</div></div>';
            try {
                const trends = await fetchIdolXTrends();
                renderTrends(trends);
            } catch(e) { showToast(<q>"生成趋势失败"</q>); }
            btnRefreshTrends.classList.replace('bi-hourglass-split', 'bi-arrow-clockwise');
        });

        // 发推按钮
        tweetActionBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const type = e.target.getAttribute('data-type');
                if (type === 'breakdown' && (typeof topWin.getStress === 'function' ? topWin.getStress() : 0) < 80) {
                    alert("压力值未满，无法崩溃发推哦~"); return;
                }
                let originalText = e.target.innerText;
                e.target.innerHTML = '<div class="spinner-border spinner-border-sm text-light" role="status"></div> 正在生成推文...';
                try {
                    const tweets = await fetchIdolXTweets(type);
                    renderTweets(tweets);
                    composeModal.style.display = 'none';
                    container.querySelector('#idolx-timeline-scroll').scrollTop = 0;
                } catch(err) { showToast(<q>"发布失败"</q>); }
                e.target.innerHTML = originalText;
            });
        });
    };
})();
