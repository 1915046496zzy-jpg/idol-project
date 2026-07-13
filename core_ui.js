/* ================= 全局变量与配置 ================= */
var audioInitialized = false;
var particleInterval = null;

var systemThemes = {
    'spring': { class: 'bg-spring', main: '#db2777', sub: '#f472b6', particleType: 'sakura' },
    'summer': { class: 'bg-summer', main: '#16a34a', sub: '#4ade80', particleType: 'summer-leaf' },
    'autumn': { class: 'bg-autumn', main: '#d97706', sub: '#fcd34d', particleType: 'leaf' },
    'winter': { class: 'bg-winter', main: '#0369a1', sub: '#7dd3fc', particleType: 'snow' }
};

/* ================= 基础UI与交互逻辑 ================= */
// 动态更新左上角返回按钮
function updateTopReturnBtn(text, action) {
    const btn = document.getElementById('btn-return');
    if(action) {
        btn.innerText = '◀ ' + text;
        btn.onclick = action;
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
}

function showToast(msg) {
    const toast = document.getElementById('sys-toast');
    toast.innerText = msg;
    toast.style.opacity = 1;
    setTimeout(() => { toast.style.opacity = 0; }, 3000);
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen-panel').forEach(el => el.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if(screenId === 'splash-screen' || screenId === 'title-screen') {
        updateTopReturnBtn('', null);
    } else {
        if(screenId === 'game-screen') {
            if (typeof renderGamePage === 'function') renderGamePage();
        }
        if(screenId === 'gallery-screen') {
            if (typeof renderGalleryList === 'function') renderGalleryList();
            updateTopReturnBtn('返回主菜单', returnToMenu);
        }
        if(screenId === 'memory-screen') {
            if (typeof renderMemoryCoverList === 'function') renderMemoryCoverList();
            updateTopReturnBtn('返回主菜单', returnToMenu);
        }
        if(screenId === 'option-screen') {
            updateTopReturnBtn('返回主菜单', returnToMenu);
        }
    }
}

function returnToMenu() { switchScreen('title-screen'); }

function startSystem() {
    if (!audioInitialized) {
        const bgm = document.getElementById('bgm-player');
        if (bgm) {
            const volInput = document.getElementById('bgm-volume');
            bgm.volume = volInput ? volInput.value / 100 : 0.6;
            bgm.play().catch(e => console.log("BGM自动播放被拦截"));
        }
        audioInitialized = true;
    }
    switchScreen('title-screen');
}

/* ================= 音频控制 ================= */
function toggleBgm() {
    const bgm = document.getElementById('bgm-player');
    const btn = document.getElementById('btn-bgm-toggle');
    if (!bgm || !btn) return;
    if(bgm.paused) { bgm.play(); btn.innerText = 'ON'; btn.classList.add('active'); }
    else { bgm.pause(); btn.innerText = 'OFF'; btn.classList.remove('active'); }
}
function changeVolume(val) {
    const bgm = document.getElementById('bgm-player');
    if (!bgm) return;
    bgm.volume = val / 100;
    if(val > 0 && bgm.paused) toggleBgm();
}

/* ================= 主题与粒子特效 ================= */
function applySystemTheme(themeKey) {
    const config = systemThemes[themeKey];
    document.getElementById('global-bg').className = config.class;
    document.documentElement.style.setProperty('--theme-text-main', config.main);
    document.documentElement.style.setProperty('--theme-text-sub', config.sub);
    document.querySelectorAll('.theme-card').forEach(el => el.classList.remove('active'));
    const activeCard = document.getElementById('card-' + themeKey);
    if (activeCard) activeCard.classList.add('active');
    startParticles(config.particleType);
}

function createParticleElement(type) {
    const p = document.createElement('div'); p.className = 'particle';
    let duration = 10; let size = 10;
    if (type === 'sakura') {
        size = Math.random() * 8 + 8; p.classList.add('sakura-petal');
        p.style.width = size + 'px'; p.style.height = (size * 1.5) + 'px';
        duration = Math.random() * 8 + 7; p.style.animation = `fallAndSway3D ${duration}s linear forwards`;
        p.style.setProperty('--sway-x', `${(Math.random() - 0.5) * 30}vw`); p.style.setProperty('--max-opacity', `${Math.random() * 0.6 + 0.4}`); p.style.left = `${Math.random() * 100}vw`;
    } else if (type === 'summer-leaf') {
        size = Math.random() * 8 + 10; p.classList.add('summer-leaf');
        p.style.width = size + 'px'; p.style.height = size + 'px';
        duration = Math.random() * 6 + 5; p.style.animation = `fallAndSway3D ${duration}s linear forwards`;
        p.style.setProperty('--sway-x', `${(Math.random() - 0.5) * 50}vw`); p.style.setProperty('--max-opacity', `${Math.random() * 0.7 + 0.3}`); p.style.left = `${Math.random() * 100}vw`;
    } else if (type === 'leaf') {
        size = Math.random() * 10 + 12; p.classList.add('autumn-leaf');
        p.style.width = size + 'px'; p.style.height = size + 'px';
        duration = Math.random() * 7 + 6; p.style.animation = `fallAndSway3D ${duration}s linear forwards`;
        p.style.setProperty('--sway-x', `${(Math.random() - 0.5) * 40}vw`); p.style.setProperty('--max-opacity', `${Math.random() * 0.8 + 0.2}`); p.style.left = `${Math.random() * 100}vw`;
    } else if (type === 'snow') {
        size = Math.random() * 6 + 3; p.classList.add('winter-snow-orb');
        p.style.width = size + 'px'; p.style.height = size + 'px';
        if (Math.random() > 0.6) { p.style.filter = `blur(${Math.random() * 3 + 1}px)`; p.style.transform = 'scale(1.5)'; }
        duration = Math.random() * 8 + 6; p.style.animation = `fallAndSway3D ${duration}s linear forwards`;
        p.style.setProperty('--sway-x', `${(Math.random() - 0.5) * 30}vw`); p.style.setProperty('--max-opacity', `${Math.random() * 0.6 + 0.4}`); p.style.left = `${Math.random() * 100}vw`;
    }
    return { el: p, duration: duration };
}

function startParticles(type) {
    const container = document.getElementById('particles-container');
    if (!container) return;
    container.innerHTML = '';
    if (particleInterval) clearInterval(particleInterval);
    let frequency = 300; let maxParticles = 40;
    if(type === 'snow') { frequency = 80; maxParticles = 120; }
    if(type === 'summer-leaf') frequency = 250;
    particleInterval = setInterval(() => {
        if(document.visibilityState === 'hidden') return;
        if(container.childElementCount > maxParticles) return;
        const { el, duration } = createParticleElement(type);
        container.appendChild(el);
        setTimeout(() => { if(el.parentNode) el.remove(); }, duration * 1000);
    }, frequency);
}

// 初始化主题
window.onload = function() { applySystemTheme('spring'); };
