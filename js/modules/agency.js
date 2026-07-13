// js/modules/agency.js

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

    // 预留自定义抽卡表单容器
    html += '<div id="character-design" style="display:none;"><div class="inner-container scrollable-content">';
    html += '<div class="design-header"><div>专属偶像定制 (保底企划)</div><div class="design-header-badge" id="selected-agency-display"></div></div>';
    html += '<div style="text-align:center; color:#ef4444; font-weight:bold; margin-bottom:20px; font-size:14px;">※ 规则注意：您在此处定制的专属偶像，将占用本次十连必定获得一位偶像的保底名额！</div>';

    html += '<div class="form-section"><div class="form-section-title">基础物理档案</div><div class="form-grid">';
    html += '<div class="form-row"><div class="form-label">姓名</div><div class="form-input-wrap"><input type="text" id="char-name" class="form-input" placeholder="需手动输入目标姓名(必填)..."></div></div>';
    html += '<div id="age-input-wrap" class="form-row"><div class="form-label">年龄</div><div class="form-input-wrap" id="age-input-content"></div></div>';

    if(typeof renderSelectRow === 'function') {
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
    }

    html += '<div class="btn-group"><button class="btn btn-back" onclick="showDetail(agencyData.indexOf(currentSelectedAgency))">◀ 返回机密情报</button><button class="btn btn-submit" onclick="validateAndShowGachaInfo()">确认无误，前往卡池 ▶</button></div></div></div>';

    html += '<div id="gacha-info-screen" style="display:none;"></div>';
    html += '<div id="gacha-result-screen" style="display:none;"></div>';

    document.getElementById('content').innerHTML = html;
    showList();
}

function showList() {
    hideGameSubPanels();
    document.getElementById('main-title').innerText = "✦ 选择入职阵营 ✦";
    document.getElementById('agency-selection').style.display = 'block';
    currentSelectedAgency = null;
    updateTopReturnBtn('返回主菜单', returnToMenu);
}

function showDetail(index) {
    if (typeof agencyData === 'undefined') {
        document.getElementById('content').innerHTML = '<div class="loading">❌ 无法获取阵营数据，请确保 idol_data.js 已正确加载。</div>';
        return;
    }
    currentSelectedAgency = agencyData[index];
    hideGameSubPanels();
    document.getElementById('main-title').innerText = "机密情报查阅";
    updateTopReturnBtn('返回阵营列表', showList);

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

    // 只有在引入了自定义抽卡模块时才显示此按钮
    if(typeof showDesign === 'function') {
        detailHtml += `<button class="btn btn-submit" style="background:var(--theme-text-main, #db2777); filter:brightness(0.9);" onclick="showDesign()">自定义保底发掘 ▶</button>`;
    }

    detailHtml += '</div></div>';

    document.getElementById('agency-detail').innerHTML = detailHtml; document.getElementById('agency-detail').style.display = 'block';
}
