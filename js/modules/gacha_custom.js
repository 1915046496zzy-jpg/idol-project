// js/modules/gacha_custom.js

function showDesign() {
    hideGameSubPanels();
    document.getElementById('main-title').innerText = "自定义星探发掘企划";
    updateTopReturnBtn('返回机密情报', () => showDetail(agencyData.indexOf(currentSelectedAgency)));

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

    // 如果页面还没渲染表单骨架，这里直接不做操作，交由 agency.js 统一渲染骨架
    var ageContent = document.getElementById('age-input-content');
    if(ageContent) ageContent.innerHTML = ageWrapHTML;

    document.getElementById('character-design').style.display = 'block';
}

function handleSelectChange(selId, cusId) {
    var s = document.getElementById(selId);
    var c = document.getElementById(cusId);
    if(s.value==='custom'){
        c.style.display='block';
        c.focus();
    }else{
        c.style.display='none';
    }
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
        showToast("请填写目标偶像的姓名！");
        return;
    }
    var allCustomInputs = document.querySelectorAll('.custom-input');
    for (let input of allCustomInputs) {
        if (input.style.display === 'block' && input.value.trim() === '') {
            showToast("请完整填写所有选择了【自定义】的选项！");
            return;
        }
    }
    // 校验通过，调用 gacha_core.js 中的核心卡池方法，并打上 'custom' 标记
    showGachaInfo('custom');
}
