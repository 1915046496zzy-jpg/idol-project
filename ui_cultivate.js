/* =========================================================
   ui_cultivate.js
   培养模块独立逻辑与渲染脚本
========================================================= */

// 1. 互动语料库
if(typeof bubbleTexts === 'undefined') {
    var bubbleTexts = {
        '戳戳': ["呀！制作人不要突然戳我啦...", "呜...好痒...", "制作人是小孩子吗？", "诶嘿，抓到你的手了！"],
        '交流': ["今天的工作也很顺利哦！", "有点累了，可以休息一下吗？", "制作人一直看着我，我会害羞的...", "接下来有什么安排呢？"],
        '摸头': ["唔...感觉像小狗一样被对待了...", "制作人的手好温暖...", "嘿嘿，再多摸一会儿也可以哦。", "不要弄乱我的发型啦！"],
        '送礼': ["哇！这是给我的吗？谢谢制作人！", "我会好好珍惜的！", "制作人怎么知道我喜欢这个？"],
        '挠痒': ["哈哈哈哈！快停下！", "不要碰那里...好痒...哈哈...", "救命...眼泪都要笑出来了..."],
        '打屁股': ["呀啊！变、变态制作人！", "呜呜...好痛，不要在这里...", "对不起我错了，请原谅我..."],
        '亲吻': ["唔...嘴唇...好软...", "制作人...这样会被别人看到的...", "嗯...再深一点..."],
        '口交': ["唔唔...咳...太大了...", "呼...这样舒服吗，制作人...", "哈啊...弄得脸上都是了..."],
        '揉胸': ["呀！不要这么用力揉...", "呜...胸部感觉变得好奇怪...", "制作人喜欢这里吗..."],
        '自慰': ["哈啊...被制作人看着...好羞耻...", "嗯啊...手指...进去了...", "要、要高潮了..."]
    };
}

// 2. 气泡弹出函数
function showBubble(type) {
    let texts = bubbleTexts[type] || ["..."];
    if(!Array.isArray(texts) && texts[currentIdolNameForCultivate] && Array.isArray(texts[currentIdolNameForCultivate][type])) {
        texts = texts[currentIdolNameForCultivate][type];
    } else if(!Array.isArray(texts)) {
        texts = ["..."];
    }
    let randomText = texts[Math.floor(Math.random() * texts.length)];
    let bubble = document.getElementById('cultivate-bubble');
    bubble.innerText = randomText;
    bubble.classList.add('show');
    setTimeout(() => bubble.classList.remove('show'), 3000);
}

// 3. 培养模块交互函数
function switchCultivateIdol(name) {
    if (currentIdolNameForCultivate === name) return;
    currentIdolNameForCultivate = name;
    renderAllPages();
    switchTab('cultivate');
}

function toggleCultivateInv() {
    document.getElementById('cultivate-inv-drawer').classList.toggle('open');
}

function filterInv(type, btnEl) {
    document.querySelectorAll('.inv-tab').forEach(el => el.classList.remove('active'));
    btnEl.classList.add('active');
    document.querySelectorAll('#inv-grid-content .inv-item').forEach(el => {
        if(type === 'all' || el.getAttribute('data-type') === type) el.style.display = 'flex';
        else el.style.display = 'none';
    });
}

function openItemModal(name, img, isEmoji, desc) {
    document.getElementById('item-modal-title').innerText = name;
    let iconWrap = document.getElementById('item-modal-icon-wrap');
    if(isEmoji) iconWrap.innerHTML = `<div class="item-modal-emoji">${img}</div>`;
    else iconWrap.innerHTML = `<img src="${img}" class="item-modal-icon">`;

    document.getElementById('item-modal-desc').innerText = desc;
    document.getElementById('item-modal-desc').style.display = 'none';

    document.getElementById('item-modal-use-btn').onclick = function() {
        sendAction(`对${currentIdolNameForCultivate}使用了[${name}]`);
        closeModal('modal-item');
    };

    document.getElementById('modal-item').style.display = 'flex';
    setTimeout(() => document.getElementById('modal-item').classList.add('active'), 10);
}

function toggleItemDesc() {
    let desc = document.getElementById('item-modal-desc');
    desc.style.display = (desc.style.display === 'none') ? 'block' : 'none';
}

// 4. 生成培养模块 HTML 的核心函数
function getCultivateHTML() {
    if(!currentIdolNameForCultivate) currentIdolNameForCultivate = (parsedSysData.status && parsedSysData.status['当前偶像']) || '';
    if(!currentIdolNameForCultivate && typeof idolDatabase !== 'undefined' && idolDatabase.length > 0) currentIdolNameForCultivate = idolDatabase[0].name;

    let html = '<div id="page-cultivate" class="page">';

    // 顶部头像栏
    html += '<div class="idol-list-container">';
    if(typeof idolDatabase !== 'undefined' && idolDatabase.length > 0) {
        idolDatabase.forEach(idol => {
            let activeClass = (idol.name === currentIdolNameForCultivate) ? 'active' : '';
            let lockedClass = checkIsUnlocked(idol.name) ? '' : 'locked';
            let avatarUrl = getAssetUrl(idol.name + "_头像", "avatar");
            html += `<div class="idol-mini-wrap ${activeClass} ${lockedClass}" onclick="switchCultivateIdol('${idol.name}')" title="${idol.name}">
                        <img src="${avatarUrl}" class="idol-mini-avatar">
                        <div class="idol-mini-name">${idol.name}</div>
                     </div>`;
        });
    }
    html += '</div>';

    let currentCultivateUnlocked = checkIsUnlocked(currentIdolNameForCultivate);

    html += '<div class="cultivate-layout">';
    let currentIdolImgCultivate = getAssetUrl(currentIdolNameForCultivate + "_立绘");

    // 中间立绘与气泡
    html += '<div class="cultivate-view">';
    if(currentIdolImgCultivate) html += `<img src="${currentIdolImgCultivate}" class="cultivate-avatar ${currentCultivateUnlocked ? '' : 'locked'}">`;
    else html += '<div style="text-align:center; padding-top:40%; color:#94a3b8;">暂无立绘数据</div>';

    if(!currentCultivateUnlocked) {
        html += '<div class="bubble-dialog show" id="cultivate-bubble" style="opacity:1; transform:translateY(-50%) scale(1);">该偶像尚未签订契约...</div>';
    } else {
        html += '<div class="bubble-dialog" id="cultivate-bubble">这里是对话内容...</div>';
    }
    html += '</div>';

    // 右侧互动按钮
    html += `<div class="interact-btns" ${currentCultivateUnlocked ? '' : 'style="display:none;"'}>`;
    html += `<div class="interact-btn" onclick="toggleSubmenu(event, this)">👋<span>日常</span>
                <div class="interact-submenu">
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('挠痒')">挠痒</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('送礼')">送礼</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('摸头')">摸头</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('交流')">交流</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('戳戳')">戳戳</div>
                </div>
             </div>`;
    html += `<div class="interact-btn r18" onclick="toggleSubmenu(event, this)">🔞<span>R18</span>
                <div class="interact-submenu">
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('自慰')">自慰</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('揉胸')">揉胸</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('口交')">口交</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('亲吻')">亲吻</div>
                    <div class="sub-btn" onclick="event.stopPropagation(); showBubble('打屁股')">打屁股</div>
                </div>
             </div>`;
    html += '</div>';

    // 左下角背包悬浮按钮
    html += `<div class="btn-open-inv" onclick="toggleCultivateInv()" ${currentCultivateUnlocked ? '' : 'style="display:none;"'}>🎒</div>`;

    let stardustCount = "0";
    let realItems = [];
    if(Array.isArray(parsedSysData.inventory)) {
        parsedSysData.inventory.forEach(itemName => {
            if(itemName.includes("星尘")) stardustCount = itemName.replace(/[^0-9]/ig,"");
            else realItems.push(itemName);
        });
    }

    // 底部背包面板
    html += `<div class="inventory-drawer" id="cultivate-inv-drawer" ${currentCultivateUnlocked ? '' : 'style="display:none;"'}>
                <div class="inv-drag-bar" onclick="toggleCultivateInv()"></div>
                <div class="inv-header">
                    <span style="font-size: 16px; font-weight: bold; color: #475569;">🎒 培养背包</span>
                    <div class="stardust-display"><img src="https://i.postimg.cc/JhBnDD5Y/xing-chen-png-xiao.png">${stardustCount}</div>
                </div>
                <div class="inv-tabs">
                    <div class="inv-tab active" onclick="filterInv('all', this)">全部</div>
                    <div class="inv-tab" onclick="filterInv('business', this)">业务</div>
                    <div class="inv-tab" onclick="filterInv('psychology', this)">心理</div>
                    <div class="inv-tab" onclick="filterInv('easter_egg', this)">彩蛋</div>
                </div>
                <div class="inventory-grid" id="inv-grid-content">`;

    if(realItems.length > 0) {
        realItems.forEach(itemName => {
            let countMatch = itemName.match(/\*\s*(\d+)/); let count = countMatch ? countMatch[1] : 1; let cleanName = itemName.split('*')[0].trim();
            if(cleanName.includes('偶像印记')) {
                let idolN = cleanName.split('·')[0]; let bgImg = getAssetUrl(idolN + "_头像", "avatar"); let desc = `用于解锁 ${idolN} 潜力上限与强化专属特质。`;
                html += `<div class="inv-item mark-item" style="--mark-bg: url('${bgImg}')" data-type="business" onclick="openItemModal('${cleanName}', 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png', false, '${desc}')">
                            <img src="https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png"><div class="inv-count">${count}</div>
                         </div>`;
            } else {
                let matchedItem = (typeof itemPool !== 'undefined') ? itemPool.find(i => cleanName.includes(i.name)) : null;
                if (matchedItem) {
                    let imgHtml = matchedItem.isEmoji ? `<div class="inv-item-emoji">${matchedItem.img}</div>` : `<img src="${matchedItem.img}">`;
                    let safeDesc = matchedItem.desc.replace(/'/g, "\\'");
                    html += `<div class="inv-item" data-type="${matchedItem.type}" onclick="openItemModal('${matchedItem.name}', '${matchedItem.img}', ${matchedItem.isEmoji}, '${safeDesc}')">${imgHtml}<div class="inv-count">${count}</div></div>`;
                } else {
                    html += `<div class="inv-item" data-type="unknown" onclick="openItemModal('${cleanName}', '📦', true, '暂无详细描述')"><div class="inv-item-emoji">📦</div><div class="inv-count">${count}</div></div>`;
                }
            }
        });
    } else {
        html += '<div style="grid-column:1/-1; text-align:center; font-size:14px; color:#94a3b8; padding:20px;">背包空空如也...</div>';
    }
    html += '</div></div></div></div>';
    return html;
}
