// ====== ui_effects.js ======

// 1. 系统主题配置
var systemThemes = {
    'spring': { class: 'bg-spring', main: '#db2777', particleType: 'sakura' },
    'summer': { class: 'bg-summer', main: '#16a34a', particleType: 'summer-leaf' },
    'autumn': { class: 'bg-autumn', main: '#d97706', particleType: 'leaf' },
    'winter': { class: 'bg-winter', main: '#0369a1', particleType: 'snow' },
    'none': { class: '', main: '#64748b', particleType: 'none' }
};

var particleInterval = null;

// 2. 应用系统主题
function applySystemTheme(themeKey) {
    const config = systemThemes[themeKey];
    document.getElementById('global-bg').className = config.class;
    document.documentElement.style.setProperty('--theme-text-main', config.main);

    document.querySelectorAll('.theme-card').forEach(el => el.classList.remove('active'));
    document.getElementById('card-' + themeKey).classList.add('active');

    startParticles(config.particleType);

    // 如果有关闭模态框的函数，可以在这里调用，防止报错我们加个判断
    if (typeof closeModal === 'function') {
        closeModal('modal-settings');
    }
}

// 3. 创建粒子元素
function createParticleElement(type) {
    const p = document.createElement('div');
    p.className = 'particle';
    let duration = 10;
    let size = 10;

    if (type === 'sakura') {
        size = Math.random() * 8 + 8;
        p.classList.add('sakura-petal');
        p.style.width = size + 'px';
        p.style.height = (size * 1.5) + 'px';
        duration = Math.random() * 8 + 7;
    }
    else if (type === 'summer-leaf') {
        size = Math.random() * 8 + 10;
        p.classList.add('summer-leaf');
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        duration = Math.random() * 6 + 5;
    }
    else if (type === 'leaf') {
        size = Math.random() * 10 + 12;
        p.classList.add('autumn-leaf');
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        duration = Math.random() * 7 + 6;
    }
    else if (type === 'snow') {
        size = Math.random() * 6 + 3;
        p.classList.add('winter-snow-orb');
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        duration = Math.random() * 8 + 6;
    }

    p.style.animation = `fallAndSway3D ${duration}s linear forwards`;
    p.style.setProperty('--sway-x', `${(Math.random() - 0.5) * 30}vw`);
    p.style.setProperty('--max-opacity', `${Math.random() * 0.6 + 0.4}`);
    p.style.left = `${Math.random() * 100}vw`;

    return { el: p, duration: duration };
}

// 4. 启动粒子特效
function startParticles(type) {
    const container = document.getElementById('particles-container');
    if (!container) return;

    container.innerHTML = '';
    if (particleInterval) clearInterval(particleInterval);
    if (type === 'none') return;

    let frequency = 300;
    let maxParticles = 40;

    if(type === 'snow') { frequency = 80; maxParticles = 120; }
    if(type === 'summer-leaf') frequency = 250;

    particleInterval = setInterval(() => {
        if(document.visibilityState === 'hidden' || container.childElementCount > maxParticles) return;
        const { el, duration } = createParticleElement(type);
        container.appendChild(el);
        setTimeout(() => { if(el.parentNode) el.remove(); }, duration * 1000);
    }, frequency);
}
