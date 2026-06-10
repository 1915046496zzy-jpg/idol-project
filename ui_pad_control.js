// ====== ui_pad_control.js ======

/* ========== 1. 悬浮球的全局注入与全屏拖拽 ========== */
(function initGlobalFloatBall() {
    // 尝试获取最外层的文档对象（突破 iframe）
    const topDoc = window.parent.document || document;

    // 如果已经注入过，就不要重复注入啦
    if (topDoc.getElementById('qingzi-drag-ball')) return;

    // 创建悬浮球 DOM
    const ball = topDoc.createElement('div');
    ball.id = 'qingzi-drag-ball';
    ball.innerHTML = '📱';
    ball.title = '打开终端平板';
    // 将样式直接写在行内，确保跨层级生效
    Object.assign(ball.style, {
        position: 'fixed',
        right: '20px',
        bottom: '120px',
        width: '56px',
        height: '56px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '2px solid #db2777',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15), inset 0 0 10px rgba(219,39,119,0.1)',
        cursor: 'grab',
        zIndex: '999999', // 绝对顶层
        userSelect: 'none',
        touchAction: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s'
    });

    topDoc.body.appendChild(ball);

    // 拖拽相关变量
    let isDragging = false;
    let hasMoved = false;
    let startX, startY, initialLeft, initialTop;

    function getEventPos(e) {
        return e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
    }

    function onDragStart(e) {
        if (e.target.id !== 'qingzi-drag-ball' && e.target.closest('#qingzi-drag-ball') === null) return;
        isDragging = true;
        hasMoved = false;
        ball.style.transition = 'none'; // 拖拽时取消动画
        ball.style.cursor = 'grabbing';

        const pos = getEventPos(e);
        startX = pos.x;
        startY = pos.y;

        const rect = ball.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        // 强制使用 left 和 top 定位
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

        const winWidth = topDoc.defaultView.innerWidth;
        const winHeight = topDoc.defaultView.innerHeight;

        // 边界限制
        newLeft = Math.max(0, Math.min(newLeft, winWidth - ball.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, winHeight - ball.offsetHeight));

        ball.style.left = newLeft + 'px';
        ball.style.top = newTop + 'px';
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        ball.style.cursor = 'grab';

        if (hasMoved) {
            // 贴边动画
            ball.style.transition = 'left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.2s';
            const rect = ball.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const winWidth = topDoc.defaultView.innerWidth;

            if (centerX < winWidth / 2) {
                ball.style.left = '10px';
            } else {
                ball.style.left = (winWidth - rect.width - 10) + 'px';
            }
        }
    }

    function onBallClick(e) {
        if (e) e.stopPropagation();
        if (!hasMoved) {
            // 因为悬浮球在最外层，调用当前 iframe 内的打开函数
            if (typeof window.openPad === 'function') {
                window.openPad();
            }
        }
    }

    // 绑定事件到最外层
    ball.addEventListener('mousedown', onDragStart);
    topDoc.addEventListener('mousemove', onDragMove);
    topDoc.addEventListener('mouseup', onDragEnd);
    ball.addEventListener('touchstart', onDragStart, {passive: false});
    topDoc.addEventListener('touchmove', onDragMove, {passive: false});
    topDoc.addEventListener('touchend', onDragEnd);

    ball.addEventListener('click', onBallClick);
})();

/* ========== 2. 平板界面的开关与切换 ========== */
window.openPad = function() {
    const overlay = document.getElementById('pad-overlay');
    if(overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 10);
        if(typeof updatePadTime === 'function') updatePadTime();
    }
};

window.closePad = function() {
    const overlay = document.getElementById('pad-overlay');
    if(overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.style.display = 'none', 300);
        closePadApp();
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

window.updatePadTime = function() {
    const now = new Date();
    let h = now.getHours().toString().padStart(2, '0');
    let m = now.getMinutes().toString().padStart(2, '0');
    const timeEl = document.getElementById('pad-time');
    if(timeEl) timeEl.innerText = `${h}:${m} 🔋 98%`;
};

/* ========== 3. 全局收起子菜单 ========== */
document.addEventListener('click', function() {
    document.querySelectorAll('.interact-submenu').forEach(el => el.classList.remove('open'));
});

window.toggleSubmenu = function(event, btnEl) {
    event.stopPropagation();
    let submenu = btnEl.querySelector('.interact-submenu');
    let wasOpen = submenu.classList.contains('open');
    document.querySelectorAll('.interact-submenu').forEach(el => el.classList.remove('open'));
    if (!wasOpen) submenu.classList.add('open');
};
