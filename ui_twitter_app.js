// ==========================================
// ui_twitter_app.js (IdolX 应用模块)
// ==========================================
(function() {
    let topWin = window.parent || window;

    topWin.renderTwitterApp = function(container) {
        if (!container) return;

        // 1. 构建基础 UI 结构
        container.innerHTML = `
            <div class="idolx-container" style="display:flex; flex-direction:column; height:100%; background:#000; color:#fff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

                <!-- 顶部导航 -->
                <div class="idolx-header" style="padding:15px; border-bottom:1px solid #333; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); z-index:10;">
                    <div style="font-weight:bold; font-size:18px;">主页</div>
                    <i class="bi bi-stars" style="font-size:20px;"></i>
                </div>

                <!-- 内容区 (左侧时间线，右侧热搜) -->
                <div class="idolx-body" style="display:flex; flex:1; overflow:hidden;">

                    <!-- 时间线 -->
                    <div class="idolx-timeline" style="flex:1; overflow-y:auto; border-right:1px solid #333; position:relative;">
                        <!-- 发推区 -->
                        <div style="padding:15px; border-bottom:1px solid #333; display:flex; gap:15px;">
                            <img src="\${topWin.getAssetUrl('idol_avatar')}" style="width:40px; height:40px; border-radius:50%; background:#333;">
                            <div style="flex:1;">
                                <div style="color:#666; font-size:16px; margin-bottom:10px;">有什么新鲜事？</div>
                                <div style="display:flex; gap:10px;">
                                    <button class="btn-tweet-action" data-type="normal" style="background:#1d9bf0; color:#fff; border:none; padding:6px 12px; border-radius:20px; font-weight:bold; cursor:pointer; font-size:13px;">常规营业</button>
                                    <button class="btn-tweet-action" data-type="promo" style="background:#1d9bf0; color:#fff; border:none; padding:6px 12px; border-radius:20px; font-weight:bold; cursor:pointer; font-size:13px;">宣传造势</button>
                                    <button class="btn-tweet-action" data-type="breakdown" style="background:#ef4444; color:#fff; border:none; padding:6px 12px; border-radius:20px; font-weight:bold; cursor:pointer; font-size:13px;">发泄情绪</button>
                                </div>
                            </div>
                        </div>

                        <!-- 刷新按钮 -->
                        <div id="idolx-refresh-btn" style="text-align:center; padding:15px; color:#1d9bf0; cursor:pointer; border-bottom:1px solid #333; transition:0.2s;">
                            <i class="bi bi-arrow-clockwise"></i> 点击拉取最新动态
                        </div>

                        <!-- 推文列表容器 -->
                        <div id="idolx-tweets-container">
                            <div style="padding:30px; text-align:center; color:#666;">暂无数据，请刷新获取。</div>
                        </div>
                    </div>

                    <!-- 趋势榜单 (热搜) -->
                    <div class="idolx-trends" style="width:250px; padding:15px; overflow-y:auto; display:none;">
                        <div style="background:#16181c; border-radius:16px; padding:15px;">
                            <div style="font-weight:900; font-size:18px; margin-bottom:15px;">日本趋势</div>
                            <div id="idolx-trends-container">
                                <div style="color:#666; font-size:13px;">加载中...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 简单响应式处理：屏幕宽时显示热搜
        if (container.offsetWidth > 600) {
            container.querySelector('.idolx-trends').style.display = 'block';
        }

        // 2. 核心逻辑：调用外部 API 生成内容
        const refreshBtn = container.querySelector('#idolx-refresh-btn');
        const tweetsContainer = container.querySelector('#idolx-tweets-container');
        const trendsContainer = container.querySelector('#idolx-trends-container');
        const tweetButtons = container.querySelectorAll('.btn-tweet-action');

        // 模拟向外部 API 发送状态并获取 JSON 的函数
        async function fetchIdolXData(actionType = 'refresh') {
            // 这里收集当前偶像的数值状态
            let currentStats = {
                fame: typeof topWin.getFame === 'function' ? topWin.getFame() : 5000,
                stress: typeof topWin.getStress === 'function' ? topWin.getStress() : 30,
                action: actionType
            };

            console.log("【秋青子】正在向 API 发送请求，当前状态：", currentStats);

            // 真实环境下这里是一个 fetch() 请求
            // return await fetch('YOUR_API_ENDPOINT', { method: 'POST', body: JSON.stringify(currentStats) }).then(res => res.json());

            // 这里做个模拟返回，哥哥接上真实的 API 后替换即可
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(generateMockResponse(currentStats));
                }, 1000);
            });
        }

        // 渲染推文列表
        function renderTweets(tweets) {
            tweetsContainer.innerHTML = '';
            tweets.forEach(tweet => {
                tweetsContainer.innerHTML += `
                    <div style="padding:15px; border-bottom:1px solid #333; display:flex; gap:10px; cursor:pointer;">
                        <img src="\${tweet.avatar}" style="width:40px; height:40px; border-radius:50%; background:#333; flex-shrink:0;">
                        <div style="flex:1;">
                            <div style="display:flex; gap:5px; margin-bottom:5px;">
                                <span style="font-weight:bold;">\${tweet.name}</span>
                                <span style="color:#666;">\${tweet.handle}</span>
                                <span style="color:#666;">· \${tweet.time}</span>
                            </div>
                            <div style="font-size:15px; line-height:1.5; margin-bottom:10px; word-break:break-word;">
                                \${tweet.content}
                            </div>
                            <div style="display:flex; justify-content:space-between; color:#666; font-size:13px; max-width:300px;">
                                <span><i class="bi bi-chat"></i> \${tweet.replies}</span>
                                <span><i class="bi bi-arrow-repeat"></i> \${tweet.retweets}</span>
                                <span><i class="bi bi-heart"></i> \${tweet.likes}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // 渲染热搜榜
        function renderTrends(trends) {
            trendsContainer.innerHTML = '';
            trends.forEach((trend, index) => {
                trendsContainer.innerHTML += `
                    <div style="margin-bottom:15px; cursor:pointer;">
                        <div style="color:#666; font-size:12px;">\${index + 1} · 流行趋势</div>
                        <div style="font-weight:bold; font-size:15px; margin:2px 0;">\${trend.keyword}</div>
                        <div style="color:#666; font-size:12px;">\${trend.posts} 帖子</div>
                    </div>
                `;
            });
        }

        // 3. 绑定事件
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> 正在生成动态...';
            const data = await fetchIdolXData('refresh');
            renderTweets(data.tweets);
            renderTrends(data.trends);
            refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> 点击拉取最新动态';
        });

        tweetButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const type = e.target.getAttribute('data-type');
                // 发泄情绪需要压力判断
                if (type === 'breakdown') {
                    let stress = typeof topWin.getStress === 'function' ? topWin.getStress() : 0;
                    if (stress < 80) {
                        alert("目前压力值不够，偶像无法触发崩溃发推哦~");
                        return;
                    }
                }

                let originalText = e.target.innerText;
                e.target.innerText = "发送中...";
                const data = await fetchIdolXData(type);
                renderTweets(data.tweets);
                renderTrends(data.trends);
                e.target.innerText = originalText;
            });
        });

        // 仅作演示用的 Mock 数据生成器
        function generateMockResponse(stats) {
            let isBreakdown = stats.action === 'breakdown';
            let mockTweets = [
                {
                    name: "Idol_Official", handle: "@idol_project", time: "刚刚", avatar: topWin.getAssetUrl('idol_avatar'),
                    content: isBreakdown ? "好累...看不见光了..." : (stats.action === 'promo' ? "新单曲《星光》绝赞发售中！请大家多多支持！#星光发布" : "今天也元气满满地完成了训练！大家晚安~"),
                    replies: isBreakdown ? "2.1K" : "456", retweets: isBreakdown ? "5K" : "1.2K", likes: isBreakdown ? "1W" : "3.4K"
                },
                {
                    name: "路人A", handle: "@passerby_a", time: "5分钟前", avatar: "",
                    content: isBreakdown ? "这偶像是怎么了？病娇人设？" : "刚刚在推上刷到，好可爱啊！",
                    replies: "12", retweets: "3", likes: "45"
                },
                {
                    name: "狂热粉", handle: "@fan_forever", time: "10分钟前", avatar: "",
                    content: isBreakdown ? "没事吧？！要好好休息啊！心疼死了😭" : "辛苦了！永远支持你！",
                    replies: "5", retweets: "0", likes: "20"
                }
            ];

            let mockTrends = [
                { keyword: "#东京电车延迟", posts: "2.4万" },
                { keyword: "#星巴克秋季限定", posts: "1.8万" },
                { keyword: isBreakdown ? "#偶像深夜崩溃" : "#星光发布", posts: "5万" },
                { keyword: "#周末台风预警", posts: "9000" }
            ];

            return { tweets: mockTweets, trends: mockTrends };
        }
    };
})();
