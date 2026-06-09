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
let ball = document.getElementById('drag-ball');

// 【核心修改】：将悬浮球拔出到最外层窗口
if (ball) {
    try {
        // 尝试获取酒馆的最外层文档对象
        let topDoc = window.parent.document || document;

        // 如果悬浮球还没有在最外层，就把它移过去
        if (ball.parentNode !== topDoc.body) {
            topDoc.body.appendChild(ball);
            // 确保悬浮球的层级绝对最高，并且定位基准是整个屏幕
            ball.style.position = 'fixed';
            ball.style.zIndex = '999999';
        }
    } catch (e) {
        console.warn("无法突破跨域限制，悬浮球保留在当前沙盒内。");
    }
}

let isDragging = false;
let hasMoved = false;
let startX, startY, initialLeft, initialTop;

function getEventPos(e) {
    return e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
}

function onDragStart(e) {
    // 因为 ball 可能被移到了 parent，这里的事件目标判断要兼容一下
    if (e.target.id !== 'drag-ball' && e.target.closest('#drag-ball') === null) return;

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

    // 获取当前悬浮球所在的窗口尺寸（可能是顶层窗口）
    let winWidth = window.parent.innerWidth || window.innerWidth;
    let winHeight = window.parent.innerHeight || window.innerHeight;

    const maxX = winWidth - ball.offsetWidth;
    const maxY = winHeight - ball.offsetHeight;
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
        let winWidth = window.parent.innerWidth || window.innerWidth;

        if (centerX < winWidth / 2) ball.style.left = '10px';
        else ball.style.left = (winWidth - rect.width - 10) + 'px';
    }
}

function onBallClick(e) {
    // 阻止事件冒泡，防止触发其他不必要的点击
    if (e) e.stopPropagation();
    if (!hasMoved) openPad();
}

// 重新绑定事件（注意监听器要绑定在最外层文档上，保证拖拽流畅）
if (ball) {
    let topDoc = window.parent.document || document;

    ball.addEventListener('mousedown', onDragStart);
    topDoc.addEventListener('mousemove', onDragMove);
    topDoc.addEventListener('mouseup', onDragEnd);
    ball.addEventListener('touchstart', onDragStart, {passive: false});
    topDoc.addEventListener('touchmove', onDragMove, {passive: false});
    topDoc.addEventListener('touchend', onDragEnd);

    // 给悬浮球绑定点击事件
    ball.onclick = onBallClick;
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
