// js/core/effects.js

/* 粒子与特效样式预设 */
const particleStyles = `
<style>
.particle { position: absolute; will-change: transform, opacity; }
.sakura-petal { background: linear-gradient(135deg, #fda4af, #fbcfe8); border-radius: 2px 20px 2px 20px; box-shadow: inset 0 0 5px rgba(255,255,255,0.8), 0 2px 5px rgba(219,39,119,0.1); }
.summer-leaf { background: linear-gradient(135deg, rgba(74,222,128,0.9), rgba(34,197,94,0.7)); border-radius: 0 50% 0 50%; box-shadow: inset 0 0 6px rgba(255,255,255,0.6), 0 2px 8px rgba(22,163,74,0.15); }
.autumn-leaf { background: linear-gradient(135deg, #ea580c, #fbbf24); border-radius: 0 50% 0 50%; box-shadow: inset 0 0 5px rgba(255,255,255,0.3), 0 2px 5px rgba(217,119,6,0.2); }
.winter-snow-orb { background: #fff; border-radius: 50%; box-shadow: 0 0 8px #fff, 0 0 15px rgba(255,255,255,0.8); }
@keyframes fallAndSway3D {
    0% { transform: translate(0, -10vh) rotateX(0deg) rotateY(0deg) rotateZ(0deg); opacity: 0; }
    10% { opacity: var(--max-opacity); }
    50% { transform: translate(var(--sway-x), 50vh) rotateX(180deg) rotateY(180deg) rotateZ(180deg); }
    90% { opacity: var(--max-opacity); }
    100% { transform: translate(calc(var(--sway-x) * 1.5), 110vh) rotateX(360deg) rotateY(360deg) rotateZ(360deg); opacity: 0; }
}
</style>
`;
document.head.insertAdjacentHTML('beforeend', particleStyles);

// 切换系统主题
function applySystemTheme(themeKey) {
    const config = systemThemes[themeKey];
    document.getElementById('global-bg').className = config.class;
    document.documentElement.style.setProperty('--theme-text-main', config.main);
    document.documentElement.style.setProperty('--theme-text-sub', config.sub);
    document.querySelectorAll('.theme-card').forEach(el => el.classList.remove('active'));

    let activeCard = document.getElementById('card-' + themeKey);
    if(activeCard) activeCard.classList.add('active');

    startParticles(config.particleType);
}

// 创建单个粒子元素
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

// 启动粒子循环
function startParticles(type) {
    const container = document.getElementById('particles-container');
    if(container) container.innerHTML = '';

    if (particleInterval) clearInterval(particleInterval);

    let frequency = 300; let maxParticles = 40;
    if(type === 'snow') { frequency = 80; maxParticles = 120; }
    if(type === 'summer-leaf') frequency = 250;

    particleInterval = setInterval(() => {
        if(document.visibilityState === 'hidden') return;
        if(container && container.childElementCount > maxParticles) return;

        const { el, duration } = createParticleElement(type);
        if(container) container.appendChild(el);

        setTimeout(() => { if(el.parentNode) el.remove(); }, duration * 1000);
    }, frequency);
}

// 音量控制
function toggleBgm() {
    const bgm = document.getElementById('bgm-player');
    const btn = document.getElementById('btn-bgm-toggle');
    if(bgm && btn) {
        if(bgm.paused) { bgm.play(); btn.innerText = 'ON'; btn.classList.add('active'); }
        else { bgm.pause(); btn.innerText = 'OFF'; btn.classList.remove('active'); }
    }
}
function changeVolume(val) {
    const bgm = document.getElementById('bgm-player');
    if(bgm) {
        bgm.volume = val / 100;
        if(val > 0 && bgm.paused) toggleBgm();
    }
}
