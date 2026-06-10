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

/* ========== 平板开关控制 ========== */
/* ========== ui_pad_control.js 中的平板开关控制 ========== */

// 把函数挂载到 window 上，这样外面的新悬浮球脚本才能调用到它！
window.openPad = function() {
    const overlay = document.getElementById('pad-overlay');
    if(overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 10);
        if (typeof updatePadTime === 'function') updatePadTime();
    }
};

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
