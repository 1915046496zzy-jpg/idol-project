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
const ball = document.getElementById('drag-ball');
let isDragging = false;
let hasMoved = false;
let startX, startY, initialLeft, initialTop;

function getEventPos(e) {
    return e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
}

function onDragStart(e) {
    if (e.target !== ball) return;
    isDragging = true;
    hasMoved = false;
    ball.classList.remove('snap-anim');
    const pos = getEventPos(e);
    startX = pos.x;
    startY = pos.y;
    const rect = ball.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    ball.style.right = 'auto';
    ball.style.bottom = 'auto';
    ball.style.left = initialLeft + 'px';
    ball.style.top = initialTop + 'px';
}

function onDragMove(e) {
    if (!isDragging) return;
    const pos = getEventPos(e);
    const dx = pos.x - startX;
    const dy = pos.y - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;
    const maxX = window.innerWidth - ball.offsetWidth;
    const maxY = window.innerHeight - ball.offsetHeight;
    newLeft = Math.max(0, Math.min(newLeft, maxX));
    newTop = Math.max(0, Math.min(newTop, maxY));
    ball.style.left = newLeft + 'px';
    ball.style.top = newTop + 'px';
}

function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    if (hasMoved) {
        ball.classList.add('snap-anim');
        const rect = ball.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        if (centerX < window.innerWidth / 2) ball.style.left = '10px';
        else ball.style.left = (window.innerWidth - rect.width - 10) + 'px';
    }
}

function onBallClick() {
    if (!hasMoved) openPad();
}

// 绑定事件（兼容鼠标和触摸）
if (ball) {
    ball.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    ball.addEventListener('touchstart', onDragStart, {passive: false});
    document.addEventListener('touchmove', onDragMove, {passive: false});
    document.addEventListener('touchend', onDragEnd);
}

/* ========== 平板开关控制 ========== */
function openPad() {
    const overlay = document.getElementById('pad-overlay');
    if(overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 10);
        updatePadTime();
    }
}

function closePad() {
    const overlay = document.getElementById('pad-overlay');
    if(overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.style.display = 'none', 300);
        closePadApp();
    }
}

function openPadApp(appId) {
    document.querySelectorAll('.pad-app-window').forEach(el => el.classList.remove('active'));
    const appWindow = document.getElementById('pad-app-' + appId);
    if(appWindow) appWindow.classList.add('active');
}

function closePadApp() {
    document.querySelectorAll('.pad-app-window').forEach(el => el.classList.remove('active'));
}

function updatePadTime() {
    const now = new Date();
    let h = now.getHours().toString().padStart(2, '0');
    let m = now.getMinutes().toString().padStart(2, '0');
    const timeEl = document.getElementById('pad-time');
    if(timeEl) timeEl.innerText = `${h}:${m} 🔋 98%`;
}
