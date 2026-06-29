// ==========================================
// ui_twitter_app.js (IdolX 应用模块 - 真实手机端风格)
// ==========================================
(function() {
    let topWin = window.parent || window;

    topWin.renderTwitterApp = function(container) {
        if (!container) return;

        // 获取主角头像 (优先从数据库获取，降级到默认图)
        let mainAvatar = '';
        if (topWin.idolDatabase && topWin.idolDatabase['protagonist']) {
            mainAvatar = topWin.getAssetUrl(topWin.idolDatabase['protagonist'].avatarId, 'avatar');
        } else {
            mainAvatar = topWin.getAssetUrl('idol_avatar', 'avatar');
        }

        // 1. 构建真实推特风格 UI 结构 (亮色主题)
        container.innerHTML = `
            <div class="idolx-container" style="display:flex; flex-direction:column; height:100%; background:#ffffff; color:#0f1419; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; position:relative;">

                <!-- 顶部栏 (精简手机版) -->
                <div class="idolx-header" style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); z-index:10;">
                    <img src="\${mainAvatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; background:#e1e8ed; cursor:pointer; box-shadow:0 0 2px rgba(0,0,0,0.1);">
                    <i class="bi bi-twitter" style="font-size:24px; color:#1d9bf0;"></i>
                    <i class="bi bi-stars" style="font-size:20px; color:#0f1419;"></i>
                </div>

                <!-- 标签页 -->
                <div style="display:flex; border-bottom:1px solid #eff3f4; font-weight:bold; font-size:15px; color:#536471;">
                    <div style="flex:1; text-align:center; padding:15px 0; color:#0f1419; position:relative; cursor:pointer;">
                        为你推荐
                        <div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:56px; height:4px; background:#1d9bf0; border-radius:4px;"></div>
                    </div>
                    <div style="flex:1; text-align:center; padding:15px 0; cursor:pointer; hover:bg:#f7f9f9;">
                        正在关注
                    </div>
                </div>

                <!-- 内容区 -->
                <div class="idolx-body" style="display:flex; flex:1; overflow:hidden;">
                    <!-- 时间线 -->
                    <div class="idolx-timeline" id="idolx-timeline-scroll" style="flex:1; overflow-y:auto; position:relative; padding-bottom:60px;">

                        <!-- 刷新提示区 -->
                        <div id="idolx-refresh-btn" style="text-align:center; padding:12px; color:#1d9bf0; cursor:pointer; font-size:14px; transition:background 0.2s;">
                            下拉或点击刷新
                        </div>

                        <!-- 推文列表容器 -->
                        <div id="idolx-tweets-container">
                            <div style="padding:40px 20px; text-align:center; color:#536471; font-size:15px;">
                                欢迎来到 IdolX<br>点击右下角按钮发布你的第一条动态吧！
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 底部导航栏 (手机端特有) -->
                <div class="idolx-bottom-nav" style="height:53px; border-top:1px solid #eff3f4; display:flex; justify-content:space-around; align-items:center; background:#ffffff; position:absolute; bottom:0; width:100%; z-index:10;">
                    <i class="bi bi-house-door-fill" style="font-size:24px; color:#0f1419; cursor:pointer;"></i>
                    <i class="bi bi-search" style="font-size:24px; color:#0f1419; cursor:pointer;" id="btn-show-trends"></i>
                    <i class="bi bi-bell" style="font-size:24px; color:#0f1419; cursor:pointer;"></i>
                    <i class="bi bi-envelope" style="font-size:24px; color:#0f1419; cursor:pointer;"></i>
                </div>

                <!-- 悬浮发推按钮 (FAB) -->
                <div id="btn-compose-tweet" style="position:absolute; right:20px; bottom:70px; width:56px; height:56px; background:#1d9bf0; border-radius:50%; display:flex; justify-content:center; align-items:center; color:#fff; font-size:24px; box-shadow:0 8px 28px rgba(0,0,0,0.28); cursor:pointer; z-index:20; transition:transform 0.2s;">
                    <i class="bi bi-feather"></i>
                </div>

                <!-- 发推操作弹窗 (默认隐藏) -->
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

                <!-- 热搜面板 (侧滑/全屏) -->
                <div id="idolx-trends-panel" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:#fff; z-index:25; flex-direction:column;">
                    <div style="height:53px; padding:0 16px; border-bottom:1px solid #eff3f4; display:flex; align-items:center; gap:20px;">
                        <i class="bi bi-arrow-left" id="btn-close-trends" style="font-size:20px; cursor:pointer;"></i>
                        <input type="text" placeholder="搜索 IdolX" style="flex:1; background:#eff3f4; border:none; padding:8px 16px; border-radius:20px; outline:none; font-size:15px;">
                    </div>
                    <div style="padding:15px; font-weight:900; font-size:20px;">日本趋势</div>
                    <div id="idolx-trends-container" style="flex:1; overflow-y:auto; padding:0 15px;">
                        <div style="color:#536471; font-size:14px; text-align:center; margin-top:20px;">请先刷新获取趋势数据</div>
                    </div>
                </div>

            </div>
        `;

        // 2. 核心逻辑：调用外部 API 生成内容
        const refreshBtn = container.querySelector('#idolx-refresh-btn');
        const tweetsContainer = container.querySelector('#idolx-tweets-container');
        const trendsContainer = container.querySelector('#idolx-trends-container');

        // 弹窗与交互按钮
        const btnCompose = container.querySelector('#btn-compose-tweet');
        const composeModal = container.querySelector('#idolx-compose-modal');
        const btnCloseCompose = container.querySelector('#btn-close-compose');
        const tweetButtons = container.querySelectorAll('.btn-tweet-action');

        const btnShowTrends = container.querySelector('#btn-show-trends');
        const trendsPanel = container.querySelector('#idolx-trends-panel');
        const btnCloseTrends = container.querySelector('#btn-close-trends');

        // 打开/关闭发推面板
        btnCompose.addEventListener('click', () => composeModal.style.display = 'flex');
        btnCloseCompose.addEventListener('click', () => composeModal.style.display = 'none');

        // 打开/关闭热搜面板
        btnShowTrends.addEventListener('click', () => trendsPanel.style.display = 'flex');
        btnCloseTrends.addEventListener('click', () => trendsPanel.style.display = 'none');

        // 模拟向外部 API 发送状态并获取 JSON 的函数
        async function fetchIdolXData(actionType = 'refresh') {
            let currentStats = {
                fame: typeof topWin.getFame === 'function' ? topWin.getFame() : 5000,
                stress: typeof topWin.getStress === 'function' ? topWin.getStress() : 30,
                action: actionType
            };

            console.log("【秋青子】正在向 API 发送请求，当前状态：", currentStats);

            // 模拟 API 延迟
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(generateMockResponse(currentStats, mainAvatar));
                }, 800);
            });
        }

        // 渲染推文列表 (推特真实排版)
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
                                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;"><i class="bi bi-chat"></i> \${tweet.replies}</div>
                                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;"><i class="bi bi-arrow-repeat"></i> \${tweet.retweets}</div>
                                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;"><i class="bi bi-heart"></i> \${tweet.likes}</div>
                                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;"><i class="bi bi-bar-chart"></i> \${tweet.views}</div>
                                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;"><i class="bi bi-upload"></i></div>
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

        // 3. 绑定事件
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status"></div>';
            refreshBtn.style.background = '#f7f9f9';
            const data = await fetchIdolXData('refresh');
            renderTweets(data.tweets);
            renderTrends(data.trends);
            refreshBtn.innerHTML = '下拉或点击刷新';
            refreshBtn.style.background = 'transparent';
        });

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
                e.target.innerText = "发布中...";
                const data = await fetchIdolXData(type);
                renderTweets(data.tweets);
                renderTrends(data.trends);

                e.target.innerText = originalText;
                composeModal.style.display = 'none'; // 发完推自动关掉弹窗
                container.querySelector('#idolx-timeline-scroll').scrollTop = 0; // 滚回顶部
            });
        });

        // 模拟数据生成器
        function generateMockResponse(stats, avatarUrl) {
            let isBreakdown = stats.action === 'breakdown';
            let mainName = topWin.idolDatabase && topWin.idolDatabase['protagonist'] ? topWin.idolDatabase['protagonist'].name : "Idol_Official";

            let mockTweets = [
                {
                    name: mainName, handle: "@idol_project", time: "刚刚", avatar: avatarUrl, isVerified: true,
                    content: isBreakdown ? "好累...看不见光了...想消失..." : (stats.action === 'promo' ? "新单曲《星光》绝赞发售中！请大家多多支持！#星光发布" : "今天也元气满满地完成了训练！大家晚安~"),
                    replies: isBreakdown ? "2.1K" : "456", retweets: isBreakdown ? "5K" : "1.2K", likes: isBreakdown ? "1W" : "3.4K", views: "10W"
                },
                {
                    name: "吃瓜路人", handle: "@passerby_a", time: "5分钟前", avatar: "https://i.postimg.cc/QxX9b7k0/default-avatar.png", isVerified: false,
                    content: isBreakdown ? "这偶像是怎么了？大半夜发这种东西，是不是被潜规则了？" : "刚刚在推上刷到，确实挺好看的，粉了。",
                    replies: "12", retweets: "3", likes: "45", views: "1.2K"
                },
                {
                    name: "狂热真爱粉", handle: "@fan_forever", time: "10分钟前", avatar: "https://i.postimg.cc/PqjZ6d8m/default-avatar-2.png", isVerified: false,
                    content: isBreakdown ? "没事吧？！要好好休息啊！心疼死了😭 运营到底在干什么吃干饭的啊！！" : "辛苦了宝宝！永远支持你！买了10张CD支持！",
                    replies: "5", retweets: "0", likes: "20", views: "300"
                }
            ];

            let mockTrends = [
                { keyword: "#东京电车延迟", posts: "2.4万" },
                { keyword: "#星巴克秋季限定", posts: "1.8万" },
                { keyword: isBreakdown ? "#偶像深夜崩溃" : "#星光发布", posts: "5.2万" },
                { keyword: "#周末台风预警", posts: "9000" }
            ];

            return { tweets: mockTweets, trends: mockTrends };
        }
    };
})();
