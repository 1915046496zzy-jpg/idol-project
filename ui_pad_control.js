// ====== ui_pad_control.js (青子修复版) ======

/* ========== 全局点击收起子菜单 ========== */
document.addEventListener('click', function() {
    document.querySelectorAll('.interact-submenu').forEach(el => el.classList.remove('open'));
});

function toggleSubmenu(event, btnEl) {
    event.stopPropagation();
    let submenu = btnEl.querySelector('.interact-submenu');
    let wasOpen = submenu.classList.contains('open');
    document.querySelectorAll('.interact-submenu').forEach(el => el.classList.remove('open'));
    if (!wasOpen) submenu.classList.add('open');
}

/* ========== ui_pad_control.js 中的平板开关控制 (三重信号监听版) ========== */

// 打开平板的核心函数
function openPadFunction() {
    const overlay = document.getElementById('pad-overlay');
    if(overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 10);
        if (typeof updatePadTime === 'function') updatePadTime();
    }
}

// 渠道1：监听当前页面的事件 (防跨域兜底)
document.addEventListener('qingzi-open-pad', openPadFunction);

// 渠道2：尝试监听外层文档的事件
try {
    if (window.parent && window.parent.document) {
        window.parent.document.addEventListener('qingzi-open-pad', openPadFunction);
    }
} catch(e) {
    console.warn("【秋青子】跨域限制，无法在外层文档注册监听器，已降级。");
}

// 渠道3：监听跨域广播 (最稳妥的方法)
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'qingzi-open-pad') {
        openPadFunction();
    }
});


// ========== 平板内部关闭与应用切换逻辑 ==========

window.closePad = function() {
    const overlay = document.getElementById('pad-overlay');
    if(overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.style.display = 'none', 300);
        if (typeof window.closePadApp === 'function') window.closePadApp();
    }
};

window.openPadApp = function(appId) {
    document.querySelectorAll('.pad-app-window').forEach(el => el.classList.remove('active'));
    const appWindow = document.getElementById('pad-app-' + appId);
    if(appWindow) appWindow.classList.add('active');
};

window.closePadApp = function() {
    document.querySelectorAll('.pad-app-window').forEach(el => el.classList.remove('active'));
};

function updatePadTime() {
    const now = new Date();
    let h = now.getHours().toString().padStart(2, '0');
    let m = now.getMinutes().toString().padStart(2, '0');
    const timeEl = document.getElementById('pad-time');
    if(timeEl) timeEl.innerText = `${h}:${m} 🔋 98%`;
}
