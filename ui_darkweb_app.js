// ==========================================
// ui_darkweb_app.js - 暗网终端APP UI渲染逻辑
// ==========================================

window.renderDarkwebApp = function(container) {
    if (!container) return;

    // 清空容器
    container.innerHTML = '';
    container.style.backgroundColor = '#0f172a';
    container.style.color = '#e2e8f0';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    const html = `
        <style>
            .dw-nav { display: flex; background: #1e293b; border-bottom: 1px solid #334155; padding: 10px; gap: 10px; }
            .dw-nav-btn { flex: 1; padding: 10px; background: #0f172a; border: 1px solid #334155; color: #94a3b8; border-radius: 6px; cursor: pointer; text-align: center; font-weight: bold; transition: 0.2s; }
            .dw-nav-btn.active { background: #ef4444; color: #fff; border-color: #ef4444; }
            .dw-nav-btn:hover:not(.active) { background: #334155; color: #fff; }

            .dw-content-area { flex: 1; overflow-y: auto; padding: 20px; position: relative; }
            .dw-panel { display: none; flex-direction: column; gap: 15px; }
            .dw-panel.active { display: flex; }

            /* 黑通告卡片 */
            .dw-job-card { background: #1e293b; border: 1px solid #ef4444; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
            .dw-job-title { color: #ef4444; font-size: 16px; font-weight: bold; }
            .dw-job-desc { color: #94a3b8; font-size: 14px; }
            .dw-job-reward { color: #10b981; font-weight: bold; }
            .dw-job-btn { background: #ef4444; color: #fff; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; }
            .dw-job-btn:hover { background: #dc2626; }

            /* 黑市道具卡片 */
            .dw-item-card { background: #1e293b; border: 1px solid #8b5cf6; border-radius: 8px; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
            .dw-item-info { display: flex; flex-direction: column; gap: 5px; }
            .dw-item-name { color: #8b5cf6; font-weight: bold; }
            .dw-item-price { color: #f59e0b; font-size: 14px; }
            .dw-item-btn { background: #8b5cf6; color: #fff; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; }

            /* 黑暗微博帖子 */
            .dw-post { background: #1e293b; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; gap: 10px; border-left: 3px solid #334155; }
            .dw-post-user { color: #64748b; font-size: 12px; font-weight: bold; display: flex; justify-content: space-between; }
            .dw-post-content { color: #cbd5e1; font-size: 14px; line-height: 1.5; }
            .dw-post-tags { display: flex; gap: 5px; }
            .dw-post-tag { background: #0f172a; color: #ef4444; font-size: 12px; padding: 2px 6px; border-radius: 4px; }
        </style>

        <div class="dw-nav">
            <div class="dw-nav-btn active" data-target="dw-jobs"><i class="bi bi-briefcase-fill"></i> 地下委托</div>
            <div class="dw-nav-btn" data-target="dw-market"><i class="bi bi-cart-x-fill"></i> 黑市交易</div>
            <div class="dw-nav-btn" data-target="dw-forum"><i class="bi bi-chat-square-quote-fill"></i> 深渊论坛</div>
        </div>

        <div class="dw-content-area">
            <!-- 板块一：黑通告 -->
            <div class="dw-panel active" id="dw-jobs">
                <div class="dw-job-card">
                    <div class="dw-job-title"><i class="bi bi-exclamation-triangle-fill"></i> 财阀私人晚宴</div>
                    <div class="dw-job-desc">需要一名年轻偶像陪同出席闭门晚宴。不论手段，只需让她在今晚听话。</div>
                    <div class="dw-job-reward">报酬: ¥5,000,000</div>
                    <button class="dw-job-btn" onclick="console.log('接取黑通告')">接取委托</button>
                </div>
            </div>

            <!-- 板块二：黑市 -->
            <div class="dw-panel" id="dw-market">
                <div style="color:#94a3b8; text-align:center; padding:20px;">[道具库数据待接入]</div>
                <!-- 预留道具位 -->
                <div class="dw-item-card">
                    <div class="dw-item-info">
                        <div class="dw-item-name">未知药剂样本</div>
                        <div class="dw-item-price">¥500,000</div>
                    </div>
                    <button class="dw-item-btn">购买</button>
                </div>
            </div>

            <!-- 板块三：黑暗微博 -->
            <div class="dw-panel" id="dw-forum">
                <div class="dw-post">
                    <div class="dw-post-user"><span>Anonymous_892</span><span>刚刚</span></div>
                    <div class="dw-post-content">有人看到昨天那个新团的演出了吗？那个领舞的腿绝了，不知道多少钱能让她单独跳一次。</div>
                    <div class="dw-post-tags"><span class="dw-post-tag">#意淫</span><span class="dw-post-tag">#情报求购</span></div>
                </div>
                <div class="dw-post">
                    <div class="dw-post-user"><span>VIP_User_X</span><span>2小时前</span></div>
                    <div class="dw-post-content">别被她们清纯的人设骗了。我手里有某家公司后台的监控录像，叫声可比唱歌好听多了。</div>
                    <div class="dw-post-tags"><span class="dw-post-tag">#黑料</span><span class="dw-post-tag">#流出</span></div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // 绑定导航栏切换事件
    const navBtns = container.querySelectorAll('.dw-nav-btn');
    const panels = container.querySelectorAll('.dw-panel');

    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有激活状态
            navBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // 激活当前点击的
            this.classList.add('active');
            const targetId = this.getAttribute('data-target');
            container.querySelector('#' + targetId).classList.add('active');
        });
    });
};
