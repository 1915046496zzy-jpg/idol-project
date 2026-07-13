// js/core/app.js

// 全局变量声明
var currentSelectedAgency = null;
var audioInitialized = false;
var particleInterval = null;
var finalCharDesignText = "";
var currentGachaType = "direct";
var currentGachaResults = [];

var stardustAmounts = [100, 300, 500, 1000, 5000];

var systemThemes = {
    'spring': { class: 'bg-spring', main: '#db2777', sub: '#f472b6', particleType: 'sakura' },
    'summer': { class: 'bg-summer', main: '#16a34a', sub: '#4ade80', particleType: 'summer-leaf' },
    'autumn': { class: 'bg-autumn', main: '#d97706', sub: '#fcd34d', particleType: 'leaf' },
    'winter': { class: 'bg-winter', main: '#0369a1', sub: '#7dd3fc', particleType: 'snow' }
};

// 工具函数
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

function hideGameSubPanels() {
    ['agency-selection', 'agency-detail', 'character-design', 'gacha-info-screen', 'gacha-result-screen'].forEach(id => {
        var el = document.getElementById(id); if(el) el.style.display = 'none';
    });
}

// 页面切换
function switchScreen(screenId) {
    document.querySelectorAll('.screen-panel').forEach(el => el.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    if(screenId === 'splash-screen' || screenId === 'title-screen') {
        updateTopReturnBtn('', null);
    } else {
        if(screenId === 'game-screen') {
            if(typeof renderGamePage === 'function') renderGamePage();
        }
        if(screenId === 'gallery-screen') {
            if(typeof renderGalleryList === 'function') renderGalleryList();
            updateTopReturnBtn('返回主菜单', returnToMenu);
        }
        if(screenId === 'memory-screen') {
            if(typeof renderMemoryCoverList === 'function') renderMemoryCoverList();
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
        if(bgm) {
            bgm.volume = document.getElementById('bgm-volume').value / 100;
            bgm.play().catch(e => console.log("BGM自动播放被拦截"));
        }
        audioInitialized = true;
    }
    switchScreen('title-screen');
}

// 初始化
window.onload = function() {
    if(typeof applySystemTheme === 'function') applySystemTheme('spring');
};
