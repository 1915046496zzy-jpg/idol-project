// js/modules/gacha_core.js

// 展示卡池详情（支持 type = 'direct' 或 'custom'）
function showGachaInfo(type) {
    currentGachaType = type;
    var aCode = currentSelectedAgency['代号'] || '';
    var customName = document.getElementById('char-name') ? document.getElementById('char-name').value || '未知原石' : '未知原石';

    if (type === 'custom') {
        updateTopReturnBtn('返回发掘企划', typeof showDesign === 'function' ? showDesign : () => showDetail(agencyData.indexOf(currentSelectedAgency)));
    } else {
        updateTopReturnBtn('返回机密情报', () => showDetail(agencyData.indexOf(currentSelectedAgency)));
    }

    // 如果是自定义抽卡，拼装最终要发给酒馆的档案字符串
    if (type === 'custom' && typeof getOptionValue === 'function') {
        var fields = {
            '基础物理': [
                {k: '年龄', v: getOptionValue('sel-age', 'cus-age')},
                {k: '体型', v: getOptionValue('sel-bodyt', 'cus-bodyt')},
                {k: '罩杯', v: getOptionValue('sel-cup', 'cus-cup')},
                {k: '肤色', v: getOptionValue('sel-skin', 'cus-skin')},
                {k: '发色', v: getOptionValue('sel-hcolor', 'cus-hcolor')},
                {k: '发型', v: getOptionValue('sel-hstyle', 'cus-hstyle')},
                {k: '瞳色', v: getOptionValue('sel-eye', 'cus-eye')},
                {k: '特征', v: getOptionValue('sel-traitm', 'cus-traitm')}
            ],
            '心理羁绊': [
                {k: 'MBTI', v: getOptionValue('sel-mbti', 'cus-mbti')},
                {k: '底色', v: getOptionValue('sel-pbase', 'cus-pbase')},
                {k: '主色调', v: getOptionValue('sel-pmain', 'cus-pmain')},
                {k: '点缀', v: getOptionValue('sel-pdeco', 'cus-pdeco')},
                {k: '衍生', v: getOptionValue('sel-pderiv', 'cus-pderiv')},
                {k: '初遇', v: getOptionValue('sel-bond', 'cus-bond')}
            ],
            '隐秘生理': [
                {k: '阴毛', v: getOptionValue('sel-pubic', 'cus-pubic')},
                {k: '乳头', v: getOptionValue('sel-nipple', 'cus-nipple')},
                {k: '小穴', v: getOptionValue('sel-pussy', 'cus-pussy')},
                {k: '菊花', v: getOptionValue('sel-anus', 'cus-anus')}
            ]
        };

        finalCharDesignText = "姓名: " + customName + "\\n[基础物理档案]\\n";
        fields['基础物理'].forEach(f => finalCharDesignText += f.k + ": " + f.v + "\\n");
        finalCharDesignText += "\\n[心理与社会关系]\\n";
        fields['心理羁绊'].forEach(f => finalCharDesignText += f.k + ": " + f.v + "\\n");
        finalCharDesignText += "\\n[深度隐秘生理档案]\\n";
        fields['隐秘生理'].forEach(f => finalCharDesignText += f.k + ": " + f.v + "\\n");
    }

    hideGameSubPanels();
    document.getElementById('main-title').innerText = "星探卡池详情";

    var idolRateNum = (aCode.indexOf('C')>-1) ? 0.08 : 0.04;
    var itemRateNum = 1 - idolRateNum;
    var stardustProb = itemRateNum * 0.45;
    var subItemProb = itemRateNum * 0.55;

    var extraNotice = "";
    if(aCode.indexOf('C')>-1) {
        extraNotice = "<br><span style='color:#e11d48;'>【微梦特权】卡池已过滤16岁以上角色，偶像出货率提升至8%！</span>";
    }

    var currentTotalItemWeight = (typeof itemPool !== 'undefined') ? itemPool.reduce((sum, item) => sum + item.weight, 0) : 1;

    var gHtml = '<div class="inner-container scrollable-content">';
    gHtml += '<div class="gacha-pool-container">';

    gHtml += `<div class="gacha-rate-box">
                <div class="gacha-rate-title">✦ 常驻星探发掘池 ✦</div>
                <div class="gacha-rate-text">
                    当前阵营：<span>${currentSelectedAgency['名称']}</span><br>
                    大盘概率：偶像 <span>${(idolRateNum*100).toFixed(0)}%</span> | 星尘 <span>${(stardustProb*100).toFixed(2)}%</span> | 资源道具 <span>${(subItemProb*100).toFixed(2)}%</span> ${extraNotice}
                </div>
              </div>`;

    gHtml += `<div><div class="gacha-section-title">✨ 可发掘偶像预留 (包含但不限于)</div><div class="gacha-item-grid">`;
    if(typeof idolDatabase !== 'undefined' && idolDatabase.length > 0) {
        idolDatabase.forEach(idol => {
            gHtml += `<div class="gacha-item-card"><img src="${idol.image}" class="gacha-item-img"><div class="gacha-item-name">${idol.name}</div></div>`;
        });
    }
    if(type === 'custom') {
        gHtml += `<div class="gacha-item-card" style="border:2px dashed #fbbf24;"><div class="gacha-item-img gacha-item-emoji">👤</div><div class="gacha-item-name" style="color:#b45309;">${customName} (保底)</div></div>`;
    } else {
        gHtml += `<div class="gacha-item-card"><div class="gacha-item-img gacha-item-emoji">❓</div><div class="gacha-item-name">未知原石...</div></div>`;
    }
    gHtml += `</div></div>`;

    gHtml += `<div><div class="gacha-section-title">🎁 资源道具 & 转化产物详细说明</div><div class="item-list-container">`;
    gHtml += `<div class="item-list-row"><img src="https://i.postimg.cc/JhBnDD5Y/xing-chen-png-xiao.png" class="item-list-icon">
                <div class="item-list-text"><strong>星尘</strong>通用发掘货币。随机获得(100~5000，数量越高概率越低)。</div>
                <div class="item-list-rate">${(stardustProb*100).toFixed(2)}%</div></div>`;
    gHtml += `<div class="item-list-row"><img src="https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png" class="item-list-icon">
                <div class="item-list-text">    <strong>偶像印记</strong>抽到重复偶像自动转化。解锁潜力上限与专属特质。<br>
使用效果:<br>
- 1枚: 选择一项业务能力(Vocal/Dance/Visual)直接+10。<br>
- 2枚: 专属特质强化 (具体效果视偶像特质而定)。<br>
- 3枚 (满命): 获得【闪耀】特殊标识 。</div>
                <div class="item-list-rate">抽卡重复</div></div>`;

    const renderItemCategory = (catType, title) => {
        if(typeof itemPool === 'undefined') return '';
        let catItems = itemPool.filter(i => i.type === catType);
        if(catItems.length === 0) return '';
        let catHtml = `<div style="padding:10px 12px; background:rgba(0,0,0,0.02); font-weight:bold; color:#475569; font-size:13px; margin-top:10px; border-radius:8px;">${title}</div>`;
        catItems.forEach(item => {
            let itemProb = (item.weight / currentTotalItemWeight) * subItemProb;
            catHtml += `<div class="item-list-row">
                            <img src="${item.img}" class="item-list-icon">
                            <div class="item-list-text"><strong>${item.name}</strong><span>${item.desc}</span></div>
                            <div class="item-list-rate">${(itemProb*100).toFixed(2)}%</div>
                        </div>`;
        });
        return catHtml;
    };

    gHtml += renderItemCategory('business', '【业务能力提升类】 (Dance / Vocal / Visual)');
    gHtml += renderItemCategory('psychology', '【心理状态干预类】 (Stress / 羁绊 / 服从 / 堕落)');
    gHtml += renderItemCategory('easter_egg', '【特殊彩蛋与专属剧情类】 (极稀有)');

    gHtml += `</div></div>`;

    gHtml += `<div class="gacha-cost-info">本次发掘消耗：<del style="opacity:0.5;">10000 星尘</del> <span style="color:#ef4444; margin-left:10px;">FREE (新手特权)</span></div>`;
    gHtml += `<div style="text-align:center; font-size:13px; color:#ef4444; font-weight:bold; margin-top:10px;">※ 开场白新手福利：本次十连必定获得至少1位偶像！</div>`;

    gHtml += '</div><div class="btn-group">';
    if (type === 'custom') {
        gHtml += `<button class="btn btn-back" onclick="showDesign()">◀ 返回修改保底目标</button>`;
    } else {
        gHtml += `<button class="btn btn-back" onclick="showDetail(agencyData.indexOf(currentSelectedAgency))">◀ 返回机密情报</button>`;
    }
    gHtml += `<button class="btn btn-submit" onclick="simulateGacha()">开始发掘 (本次10连免费) ▶</button></div></div>`;

    document.getElementById('gacha-info-screen').innerHTML = gHtml;
    document.getElementById('gacha-info-screen').style.display = 'block';
}

// 模拟抽卡逻辑
function simulateGacha() {
    var aCode = currentSelectedAgency['代号'] || '';
    var idolRate = (aCode.indexOf('C')>-1) ? 0.08 : 0.04;
    var customName = document.getElementById('char-name') ? document.getElementById('char-name').value || '未知原石' : '未知原石';

    currentGachaResults = [];
    let seenIdols = new Set();
    var currentTotalItemWeight = (typeof itemPool !== 'undefined') ? itemPool.reduce((sum, item) => sum + item.weight, 0) : 1;

    for(let i=0; i<10; i++) {
        if (i === 0) {
            // 首抽保底判断
            if (currentGachaType === 'custom') {
                seenIdols.add(customName);
                currentGachaResults.push({ type: 'idol', name: customName, isCustom: true, isDuplicate: false });
            } else {
                let rIdol = idolDatabase[Math.floor(Math.random() * idolDatabase.length)];
                seenIdols.add(rIdol.name);
                currentGachaResults.push({ type: 'idol', name: rIdol.name, img: rIdol.image, isDuplicate: false });
            }
        } else {
            let roll = Math.random();
            if (roll <= idolRate) {
                let rIdol = idolDatabase[Math.floor(Math.random() * idolDatabase.length)];
                if (seenIdols.has(rIdol.name)) {
                    currentGachaResults.push({ type: 'duplicate', name: rIdol.name, idolImg: rIdol.image, markImg: 'https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png' });
                } else {
                    seenIdols.add(rIdol.name);
                    currentGachaResults.push({ type: 'idol', name: rIdol.name, img: rIdol.image, isDuplicate: false });
                }
            } else {
                let itemRoll = Math.random();
                if (itemRoll <= 0.45 || typeof itemPool === 'undefined') {
                    let sRoll = Math.random() * 100;
                    let amt = 100;
                    if (sRoll <= 1) amt = 5000;
                    else if (sRoll <= 6) amt = 1000;
                    else if (sRoll <= 20) amt = 500;
                    else if (sRoll <= 50) amt = 300;
                    else amt = 100;
                    currentGachaResults.push({ type: 'stardust', amount: amt, img: 'https://i.postimg.cc/JhBnDD5Y/xing-chen-png-xiao.png' });
                } else {
                    let weightRoll = Math.random() * currentTotalItemWeight;
                    let selectedItem = itemPool[0];
                    for(let item of itemPool) {
                        if(weightRoll < item.weight) { selectedItem = item; break; }
                        weightRoll -= item.weight;
                    }
                    currentGachaResults.push({ type: 'item', data: selectedItem });
                }
            }
        }
    }
    currentGachaResults.sort(() => Math.random() - 0.5);
    renderGachaResult();
}

// 渲染抽卡结果与动画
function renderGachaResult() {
    hideGameSubPanels();
    document.getElementById('main-title').innerText = "星探发掘结果";
    updateTopReturnBtn('返回卡池详情', () => showGachaInfo(currentGachaType));

    var rHtml = '<div class="inner-container scrollable-content">';
    rHtml += '<div style="text-align:center; font-weight:bold; margin-bottom:15px; color:#64748b;">✦ 十连发掘完毕 ✦</div>';
    rHtml += '<div class="gacha-result-grid">';

    currentGachaResults.forEach((res, idx) => {
        let delay = idx * 0.1;
        if (res.type === 'idol') {
            if (res.isCustom) {
                rHtml += `<div class="gacha-result-card idol-card" style="animation-delay:${delay}s"><div class="gacha-result-img gacha-result-emoji">👤</div><div class="gacha-result-name">${res.name}</div><div class="gacha-result-type">NEW IDOL</div></div>`;
            } else {
                rHtml += `<div class="gacha-result-card idol-card" style="animation-delay:${delay}s"><img src="${res.img}" class="gacha-result-img"><div class="gacha-result-name">${res.name}</div><div class="gacha-result-type">NEW IDOL</div></div>`;
            }
        } else if (res.type === 'duplicate') {
            rHtml += `
            <div class="gacha-result-card duplicate-card" style="animation-delay:${delay}s">
                <div class="mark-transform-wrap">
                    <img src="${res.idolImg}" class="mark-img-front">
                    <img src="${res.markImg}" class="mark-img-back">
                </div>
                <div class="gacha-result-name duplicate-name" data-name="${res.name}">${res.name}</div>
                <div class="gacha-result-type" style="color:#3b82f6; background:rgba(59,130,246,0.1);">DUPLICATE</div>
            </div>`;
        } else if (res.type === 'stardust') {
            rHtml += `<div class="gacha-result-card" style="animation-delay:${delay}s"><img src="${res.img}" class="gacha-result-img" style="object-fit:contain;"><div class="gacha-result-name">星尘 ×${res.amount}</div><div class="gacha-result-type" style="color:#64748b; background:rgba(0,0,0,0.05);">CURRENCY</div></div>`;
        } else {
            rHtml += `<div class="gacha-result-card" style="animation-delay:${delay}s"><img src="${res.data.img}" class="gacha-result-img" style="object-fit:contain;"><div class="gacha-result-name">${res.data.name}</div><div class="gacha-result-type" style="color:#64748b; background:rgba(0,0,0,0.05);">ITEM</div></div>`;
        }
    });

    rHtml += '</div><div class="btn-group"><button class="btn btn-back" onclick="simulateGacha()">🔄 重新发掘 (免费)</button><button class="btn btn-submit" onclick="executeFinalGachaCommand()">确认入职并生成档案 ▶</button></div></div>';

    document.getElementById('gacha-result-screen').innerHTML = rHtml;
    document.getElementById('gacha-result-screen').style.display = 'block';

    setTimeout(() => {
        document.querySelectorAll('.gacha-result-card.duplicate-card').forEach(el => {
            el.classList.add('do-transform');
            setTimeout(() => {
                const nameEl = el.querySelector('.duplicate-name');
                const oldName = nameEl.getAttribute('data-name');
                nameEl.innerText = oldName + '·偶像印记';
                nameEl.style.color = '#db2777';
            }, 400);
        });
    }, 1500);
}

// 确认抽卡结果，发送指令
function executeFinalGachaCommand() {
    var idolsCount = currentGachaResults.filter(r => r.type === 'idol' || r.type === 'duplicate').length;
    var finalMessage = "";

    if(currentGachaType === 'direct') {
        finalMessage = '/send 【星探发掘确认】当前阵营：' + currentSelectedAgency['名称'] + '\\n本次十连获得偶像（含重复印记）数量：' + idolsCount + '位。请求根据抽卡结果生成剧情与入职档案。|/trigger';
    } else {
        finalMessage = '/send 【自定义星探发掘确认】当前阵营：' + currentSelectedAgency['名称'] + '\\n\\n【保底目标档案】\\n' + finalCharDesignText + '\\n本次十连获得偶像（含重复印记）总数：' + idolsCount + '位。请求根据抽卡结果生成保底偶像入职档案与剧情。|/trigger';
    }
    if (typeof triggerSlash === 'function') {
        triggerSlash(finalMessage);
    } else {
        alert("未检测到酒馆环境，发送指令: " + finalMessage);
    }
}
