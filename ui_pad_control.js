// ====== ui_pad_control.js ======

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

/* ========== 悬浮球拖拽与平板交互逻辑 ========== */

/* ========== ui_pad_control.js 中的平板开关控制 (信号监听版) ========== */

// 获取最外层的 document，作为信号接收站
const topDoc = window.parent.document || document;

// 监听外面悬浮球发来的“打开平板”信号
topDoc.addEventListener('qingzi-open-pad', function() {
    const overlay = document.getElementById('pad-overlay');
    if(overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 10);
        if (typeof updatePadTime === 'function') updatePadTime();
    }
});

// 平板内部的关闭按钮，还是挂载到当前 window 上，因为是在平板内部点击的
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
