/* ================= 抽卡系统全局变量1 ================= */
var currentSelectedAgency = null;
var finalCharDesignText = "";
var currentGachaType = "direct";
var currentGachaResults = [];
var stardustAmounts = [100, 300, 500, 1000, 5000];

/* ================= 基础工具函数 ================= */
function hideGameSubPanels() {
    ['agency-selection', 'agency-detail', 'character-design', 'gacha-info-screen', 'gacha-result-screen'].forEach(id => {
        var el = document.getElementById(id); if(el) el.style.display = 'none';
    });
}

/* ================= 阵营选择与详情 ================= */
function showList() {
    hideGameSubPanels();
    document.getElementById('main-title').innerText = "✦ 选择入职阵营 ✦";
    document.getElementById('agency-selection').style.display = 'block';
    currentSelectedAgency = null;
    if (typeof updateTopReturnBtn === 'function') updateTopReturnBtn('返回主菜单', returnToMenu);
}

function showDetail(index) {
    if (typeof agencyData === 'undefined') {
        document.getElementById('content').innerHTML = '<div class="loading">❌ 无法获取阵营数据，请确保 idol_data.js 已正确加载。</div>';
        return;
    }
    currentSelectedAgency = agencyData[index];
    hideGameSubPanels();
    document.getElementById('main-title').innerText = "机密情报查阅";
    if (typeof updateTopReturnBtn === 'function') updateTopReturnBtn('返回阵营列表', showList);

    var aCode = currentSelectedAgency['代号'] || 'UNKNOWN'; var themeClass = '';
    var buffName = "未知光环", buffDesc = "暂无数据";

    if(aCode.indexOf('A')>-1) { themeClass = 'card-type-A'; buffName="无瑕的白天鹅"; buffDesc="Visual初始评级强制提升一档"; }
    else if(aCode.indexOf('B')>-1) { themeClass = 'card-type-B'; buffName="百万星光的交汇"; buffDesc="常规训练获取经验+20%"; }
    else if(aCode.indexOf('C')>-1) { themeClass = 'card-type-C'; buffName="未完成的童话书"; buffDesc="Stress增长速度减半"; }
    else if(aCode.indexOf('D')>-1) { themeClass = 'card-type-D'; buffName="逆光飞翔的残羽"; buffDesc="初始好感度+20"; }
    else if(aCode.indexOf('E')>-1) { themeClass = 'card-type-E'; buffName="雨夜中的流浪猫"; buffDesc="无视通告最低属性门槛"; }
    else if(aCode.indexOf('F')>-1) { themeClass = 'card-type-F'; buffName="毒药与蜜糖"; buffDesc="黑通告资金收益*1.5倍"; }

    var detailHtml = `<div class="inner-container scrollable-content ${themeClass}"><div class="detail-header"><div class="detail-title-main" style="color:inherit;">${currentSelectedAgency['名称']||'未知'}</div><div class="detail-title-sub" style="color:inherit; opacity:0.8;">代号(CODE): ${aCode}</div></div><div class="detail-content-grid">`;

    detailHtml += '<div class="detail-panel"><div class="panel-title">🛡️ 基础战略</div>';
    ['特点', '优势', '劣势'].forEach(k => { if (currentSelectedAgency[k]) detailHtml += `<div class="detail-item"><div class="item-label">${k}</div><div class="item-value">${currentSelectedAgency[k]}</div></div>`; });
    detailHtml += '</div>';

    detailHtml += `<div class="detail-panel"><div class="panel-title">✨ 阵营专属光环</div><div class="detail-item"><div class="item-label" style="color:var(--theme-text-main, #db2777); font-size:14px;">【${buffName}】</div><div class="item-value" style="border-left: 3px solid var(--theme-text-main, #db2777);">${buffDesc}</div></div></div>`;

    if (currentSelectedAgency['详细介绍']) detailHtml += `<div class="detail-panel full-width"><div class="panel-title">🔍 深度调查</div><div class="desc-text">${currentSelectedAgency['详细介绍']}</div></div>`;

    detailHtml += '</div><div class="btn-group">';
    detailHtml += `<button class="btn btn-submit" onclick="showGachaInfo('direct')">常规星探发掘 ▶</button>`;
    detailHtml += `<button class="btn btn-submit" style="background:var(--theme-text-main, #db2777); filter:brightness(0.9);" onclick="showDesign()">自定义保底发掘 ▶</button>`;
    detailHtml += '</div></div>';

    document.getElementById('agency-detail').innerHTML = detailHtml; document.getElementById('agency-detail').style.display = 'block';
}

/* ================= 自定义保底设计 ================= */
function showDesign() {
    hideGameSubPanels();
    document.getElementById('main-title').innerText = "自定义星探发掘企划";
    if (typeof updateTopReturnBtn === 'function') updateTopReturnBtn('返回机密情报', () => showDetail(agencyData.indexOf(currentSelectedAgency)));

    var aCode = currentSelectedAgency['代号'] || '';
    var isPetitReve = aCode.indexOf('C') > -1;

    var ageWrapHTML = '';
    if (isPetitReve) {
        ageWrapHTML = `
            <select id="sel-age" class="form-select" onchange="handleSelectChange('sel-age', 'cus-age')">
                <option value="12岁">12岁</option>
                <option value="13岁">13岁</option>
                <option value="14岁">14岁</option>
                <option value="15岁">15岁</option>
            </select>
            <input type="number" id="cus-age" class="custom-input" style="display:none;" placeholder="微梦限制不可自定义更大年龄">
        `;
    } else {
        let optionsHtml = '';
        for(let i=12; i<=25; i++) { optionsHtml += `<option value="${i}岁">${i}岁</option>`; }
        optionsHtml += `<option value="custom">✍️ 自定义输入(如26岁+)...</option>`;
        ageWrapHTML = `
            <select id="sel-age" class="form-select" onchange="handleSelectChange('sel-age', 'cus-age')">
                ${optionsHtml}
            </select>
            <input type="number" id="cus-age" class="custom-input" min="12" placeholder="请输入具体年龄数字...">
        `;
    }
    document.getElementById('age-input-content').innerHTML = ageWrapHTML;
    document.getElementById('character-design').style.display = 'block';
}

function handleSelectChange(selId, cusId) {
    var s = document.getElementById(selId); var c = document.getElementById(cusId);
    if(s.value==='custom'){c.style.display='block';c.focus();}else{c.style.display='none';}
}
function getOptionValue(selId, cusId) {
    var s = document.getElementById(selId);
    if(s.value==='custom'){
        var val = document.getElementById(cusId).value;
        return val ? val + '岁' : '未填写';
    }
    return s.value;
}
function renderSelectRow(lbl, selId, cusId, opts) {
    var h = `<div class="form-row"><div class="form-label">${lbl}</div><div class="form-input-wrap"><select id="${selId}" class="form-select" onchange="handleSelectChange('${selId}', '${cusId}')">`;
    opts.forEach(o=>h+=`<option value="${o}">${o}</option>`);
    h+=`<option value="custom">✍️ 自定义输入...</option></select><input type="text" id="${cusId}" class="custom-input" placeholder="请输入..."></div></div>`;
    return h;
}

function validateAndShowGachaInfo() {
    var charName = document.getElementById('char-name').value.trim();
    if (!charName) {
        if(typeof showToast === 'function') showToast("请填写目标偶像的姓名！");
        else alert("请填写目标偶像的姓名！");
        return;
    }
    var allCustomInputs = document.querySelectorAll('.custom-input');
    for (let input of allCustomInputs) {
        if (input.style.display === 'block' && input.value.trim() === '') {
            if(typeof showToast === 'function') showToast("请完整填写所有选择了【自定义】的选项！");
            else alert("请完整填写所有选择了【自定义】的选项！");
            return;
        }
    }
    showGachaInfo('custom');
}

/* ================= 抽卡详情展示 ================= */
function showGachaInfo(type) {
    currentGachaType = type;
    var aCode = currentSelectedAgency['代号'] || '';
    var customName = document.getElementById('char-name') ? document.getElementById('char-name').value || '未知原石' : '未知原石';

    if (typeof updateTopReturnBtn === 'function') {
        if (type === 'custom') {
            updateTopReturnBtn('返回发掘企划', showDesign);
        } else {
            updateTopReturnBtn('返回机密情报', () => showDetail(agencyData.indexOf(currentSelectedAgency)));
        }
    }

    if (type === 'custom') {
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

    var gHtml = '<div class="inner-container scrollable-content"><div class="gacha-pool-container">';

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

    // 星尘与印记
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

/* ================= 模拟抽卡逻辑 ================= */
function simulateGacha() {
    var aCode = currentSelectedAgency['代号'] || '';
    var idolRate = (aCode.indexOf('C')>-1) ? 0.08 : 0.04;
    var customName = document.getElementById('char-name') ? document.getElementById('char-name').value || '未知原石' : '未知原石';

    currentGachaResults = [];
    let seenIdols = new Set();
    var currentTotalItemWeight = (typeof itemPool !== 'undefined') ? itemPool.reduce((sum, item) => sum + item.weight, 0) : 1;

    for(let i=0; i<10; i++) {
        if (i === 0) {
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
                        if(weightRoll < item.weight) {
                            selectedItem = item;
                            break;
                        }
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

function renderGachaResult() {
    hideGameSubPanels();
    document.getElementById('main-title').innerText = "星探发掘结果";
    if (typeof updateTopReturnBtn === 'function') updateTopReturnBtn('返回卡池详情', () => showGachaInfo(currentGachaType));

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

function executeFinalGachaCommand() {
    var idolsCount = currentGachaResults.filter(r => r.type === 'idol' || r.type === 'duplicate').length;

    // 1. 初始化统计容器
    var stardustTotal = 0;
    var itemCounts = {};  // 用于统计道具数量
    var markCounts = {};  // 用于统计偶像印记数量
    var newIdols = [];    // 用于记录新获得的偶像

    // 2. 遍历抽卡结果，进行归类和计数
    currentGachaResults.forEach(res => {
        if (res.type === 'stardust') {
            stardustTotal += res.amount;
        } else if (res.type === 'item') {
            var itemName = res.data.name;
            itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
        } else if (res.type === 'idol') {
            newIdols.push(res.name);
        } else if (res.type === 'duplicate') {
            // 重复偶像自动转化为印记
            var markName = res.name + '·偶像印记';
            markCounts[markName] = (markCounts[markName] || 0) + 1;
        }
    });

    // 3. 将字典转换为带数量的字符串数组
    var itemStrings = [];
    for (var iName in itemCounts) {
        itemStrings.push(iName + " ×" + itemCounts[iName]);
    }

    var markStrings = [];
    for (var mName in markCounts) {
        markStrings.push(mName + " ×" + markCounts[mName]);
    }

    // 4. 拼装结构化资源清单
    var resourceText = "【本次发掘资源清单】\\n" +
                       "- 获得星尘: " + stardustTotal + "\\n" +
                       "- 获得道具: " + (itemStrings.length > 0 ? itemStrings.join("、") : "无") + "\\n" +
                       "- 获得新偶像: " + (newIdols.length > 0 ? newIdols.join("、") : "无") + "\\n" +
                       "- 获得印记转化: " + (markStrings.length > 0 ? markStrings.join("、") : "无");

    // 5. 拼装发给 AI 的终极系统指令
    var finalMessage = "";

    // 🌟 这里新增了一段强制隐藏的警告指令
    var hiddenWarning = "\\n⚠️【重要系统限制】：上述《资源清单》仅用于你在末尾输出的 <UpdateVariable> 标签块中更新 JSON Patch 变量（将星尘、道具、印记入账）。**绝对禁止**在 <sys_ui> 的剧情正文、对话或选项中提及任何星尘、道具或印记的获得过程。剧情应完全专注于你与偶像初次见面的情景与互动。";

    if(currentGachaType === 'direct') {
        finalMessage = "/send [系统日志：新档案录入请求]\\n当前阵营：" + currentSelectedAgency['名称'] + "\\n" + resourceText + hiddenWarning + "\\n\\n[系统指令]\\n请基于上述信息创作开场白剧情：描述制作人迎接新偶像入职的场景。\\n⚠️你必须在回复最末尾输出 <sys_ui> 标签块。\\n⚠️你必须在回复最末尾输出 <UpdateVariable> 标签块，并将获得的资源写入后台！|/trigger";
    } else {
        finalMessage = "/send [系统日志：自定义星探发掘确认]\\n当前阵营：" + currentSelectedAgency['名称'] + "\\n" + resourceText + "\\n\\n【保底目标详细设定】\\n" + finalCharDesignText + hiddenWarning + "\\n\\n[系统指令]\\n请基于上述设定创作保底偶像入职的开场白剧情。\\n⚠️你必须在回复最末尾输出 <sys_ui> 标签块。\\n⚠️你必须在回复最末尾输出 <UpdateVariable> 标签块，初始化这位角色的变量，并将资源写入后台！|/trigger";
    }

    if (typeof triggerSlash === 'function') {
        triggerSlash(finalMessage);
    } else {
        alert("未检测到酒馆环境，发送指令: " + finalMessage);
    }

/* ================= 入口：渲染主界面 ================= */
function renderGamePage() {
    var html = '<div id="agency-selection" class="scrollable-content"><div class="agency-grid">';
    if(typeof agencyData === 'undefined') {
        html += '<div style="grid-column:1/-1; text-align:center; padding:40px; color:#ef4444;">❌ 未找到 agencyData 数据，请检查 idol_data.js。</div>';
    } else {
        agencyData.forEach((item, index) => {
            var code = item['代号'] || ''; var typeClass = '';
            if(code.indexOf('A')>-1) typeClass = 'card-type-A'; else if(code.indexOf('B')>-1) typeClass = 'card-type-B'; else if(code.indexOf('C')>-1) typeClass = 'card-type-C'; else if(code.indexOf('D')>-1) typeClass = 'card-type-D'; else if(code.indexOf('E')>-1) typeClass = 'card-type-E'; else if(code.indexOf('F')>-1) typeClass = 'card-type-F';

            html += `<div class="agency-card ${typeClass}" onclick="showDetail(${index})"><div class="card-header"><span class="card-title">${item['名称']||'未知'}</span></div><div class="card-content-wrap">`;
            ['特点', '优势'].forEach(f => { if(item[f]) html += `<div class="info-row"><span class="info-label">[${f}]</span> ${item[f]}</div>`; });
            html += `</div><div class="card-action-hint">查阅机密情报 →</div></div>`;
        });
    }
    html += '</div></div><div id="agency-detail"></div>';

    html += '<div id="character-design"><div class="inner-container scrollable-content">';
    html += '<div class="design-header"><div>专属偶像定制 (保底企划)</div><div class="design-header-badge" id="selected-agency-display"></div></div>';

    html += '<div style="text-align:center; color:#ef4444; font-weight:bold; margin-bottom:20px; font-size:14px;">※ 规则注意：您在此处定制的专属偶像，将占用本次十连必定获得一位偶像的保底名额！</div>';

    html += '<div class="form-section"><div class="form-section-title">基础物理档案</div><div class="form-grid">';
    html += '<div class="form-row"><div class="form-label">姓名</div><div class="form-input-wrap"><input type="text" id="char-name" class="form-input" placeholder="需手动输入目标姓名(必填)..."></div></div>';
    html += '<div id="age-input-wrap" class="form-row"><div class="form-label">年龄</div><div class="form-input-wrap" id="age-input-content"></div></div>';

    html += renderSelectRow('体型', 'sel-bodyt', 'cus-bodyt', ['娇小干瘦', '娇小匀称', '标准苗条', '微胖肉感', '高挑丰腴', '紧实肌肉']);
    html += renderSelectRow('罩杯', 'sel-cup', 'cus-cup', ['平胸 (AA罩杯)', '贫乳 (A罩杯)', '微乳 (B罩杯)', '标准 (C罩杯)', '丰满 (D罩杯)', '大乳 (E罩杯)', '巨乳 (F罩杯及以上)']);
    html += renderSelectRow('肤色', 'sel-skin', 'cus-skin', ['苍白', '偏白', '小麦色', '蜜褐色', '深色', '黑皮']);
    html += renderSelectRow('发色', 'sel-hcolor', 'cus-hcolor', ['黑色', '棕色', '金色', '银色', '粉色', '红色', '蓝色', '双色拼接']);
    html += renderSelectRow('发型', 'sel-hstyle', 'cus-hstyle', ['长直发', '大波浪', '齐肩短发', '超短发', '高扎双马尾', '低扎双马尾', '单侧马尾', '丸子头', '姬发式']);
    html += renderSelectRow('瞳色', 'sel-eye', 'cus-eye', ['黑色', '棕色', '蓝色', '绿色', '金色', '紫色', '红色', '异色瞳']);
    html += renderSelectRow('特征', 'sel-traitm', 'cus-traitm', ['无', '眼角泪痣', '小虎牙', '面颊雀斑', '体表伤疤', '黑眼圈', '佩戴眼镜']);
    html += '</div></div>';

    html += '<div class="form-section"><div class="form-section-title">心理与社会关系</div><div class="form-grid">';
    html += renderSelectRow('MBTI', 'sel-mbti', 'cus-mbti', ['INFP (内向敏感/理想主义)', 'INFJ (温柔坚定/洞察人心)', 'INTJ (冷酷理性/谋略家)', 'INTP (慵懒随性/逻辑怪)', 'ENFP (热情活泼/小太阳)', 'ENTP (腹黑/乐子人)', 'ESTP (外向张扬/行动派)', 'ISFJ (温柔奉献/保护者)', 'ISTJ (刻板严肃/守规矩)']);
    html += renderSelectRow('性格底色', 'sel-pbase', 'cus-pbase', ['极度自卑怯懦', '高傲慕强', '极度缺爱', '绝对理智', '天然纯真', '自我毁灭倾向']);
    html += renderSelectRow('主色调', 'sel-pmain', 'cus-pmain', ['盲目顺从依赖', '口嫌体正直', '言语刻薄', '讨好型人格', '元气掩饰不安', '病娇占有欲']);
    html += renderSelectRow('点缀', 'sel-pdeco', 'cus-pdeco', ['结巴脸红', '害怕黑暗', '贪吃甜食', '轻微强迫症', '乡下口音', '执念小物件']);
    html += renderSelectRow('衍生行为', 'sel-pderiv', 'cus-pderiv', ['主动跪下请求惩罚', '揪衣角', '咬指甲', '流泪', '蹭人怀里', '打扫卫生']);
    html += renderSelectRow('初遇关系', 'sel-bond', 'cus-bond', ['流浪少女', '欠款人', '青梅竹马', '狂热粉丝', '跳槽者', '把柄持有者', '财阀眼线']);
    html += '</div></div>';

    html += '<div class="form-section"><div class="form-section-title">深度隐秘生理档案</div><div class="form-grid">';
    html += renderSelectRow('阴毛状态', 'sel-pubic', 'cus-pubic', ['浓密型', '稀疏型', '倒三角型', '自然蔓延型', '造型修剪型', '完全剃光型', '毛茬型', '有色型', '不对称型', '散 stray 型', '白虎型']);
    html += renderSelectRow('乳头细节', 'sel-nipple', 'cus-nipple', ['小乳头型', '长乳头型', '粗乳头型', '巨大乳头型', '内陷乳头型', '单侧内陷型', '浮肿乳头型', '深色乳头型', '浅色乳头型', '大乳晕型', '小乳晕型', '乳晕凸起型']);
    html += renderSelectRow('小穴外观', 'sel-pussy', 'cus-pussy', ['维纳斯裂缝型', '蝴蝶型', '馒头型', '一线天型', '肥厚型', '单薄型', '深色型', '不对称型', '阴蒂突出型', '凹陷型']);
    html += renderSelectRow('菊花外观', 'sel-anus', 'cus-anus', ['深色型', '凸出型', '外翻型', '松弛型', '紧致型', '凹陷型', '多褶型', '平滑型', '心形型', '小巧型', '皱缩型', '纵向型', '三角型', '不规则型', '色素沉淀型', '毛发环绕型']);
    html += '</div></div>';

    html += '<div class="btn-group"><button class="btn btn-back" onclick="showDetail(agencyData.indexOf(currentSelectedAgency))">◀ 返回机密情报</button><button class="btn btn-submit" onclick="validateAndShowGachaInfo()">确认无误，前往卡池 ▶</button></div></div></div>';

    html += '<div id="gacha-info-screen" style="display:none;"></div>';
    html += '<div id="gacha-result-screen" style="display:none;"></div>';

    document.getElementById('content').innerHTML = html;
    showList();
}
