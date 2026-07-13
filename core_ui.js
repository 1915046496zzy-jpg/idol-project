@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700;900&family=ZCOOL+KuaiLe&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body, html {
    font-family: "Microsoft YaHei", -apple-system, sans-serif;
    color: #334155;
    background: transparent;
}

/* 背景和粒子层 */
#global-bg {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: -1; pointer-events: none; transition: opacity 1s ease, background 1s ease;
    background-size: cover; background-position: center;
}

.bg-spring { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fce7f3 100%); }
.bg-summer { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%); }
.bg-autumn { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef08a 100%); }
.bg-winter { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%); }

#particles-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; overflow: hidden; }
.particle { position: absolute; will-change: transform, opacity; }

.sakura-petal { background: linear-gradient(135deg, #fda4af, #fbcfe8); border-radius: 2px 20px 2px 20px; box-shadow: inset 0 0 5px rgba(255,255,255,0.8), 0 2px 5px rgba(219,39,119,0.1); }
.summer-leaf { background: linear-gradient(135deg, rgba(74,222,128,0.9), rgba(34,197,94,0.7)); border-radius: 0 50% 0 50%; box-shadow: inset 0 0 6px rgba(255,255,255,0.6), 0 2px 8px rgba(22,163,74,0.15); }
.autumn-leaf { background: linear-gradient(135deg, #ea580c, #fbbf24); border-radius: 0 50% 0 50%; box-shadow: inset 0 0 5px rgba(255,255,255,0.3), 0 2px 5px rgba(217,119,6,0.2); }
.winter-snow-orb { background: #fff; border-radius: 50%; box-shadow: 0 0 8px #fff, 0 0 15px rgba(255,255,255,0.8); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0% {opacity: 0.5; transform: scale(1);} 50% {opacity: 1; transform: scale(1.05);} 100% {opacity: 0.5; transform: scale(1);} }
@keyframes fallAndSway3D {
    0% { transform: translate(0, -10vh) rotateX(0deg) rotateY(0deg) rotateZ(0deg); opacity: 0; }
    10% { opacity: var(--max-opacity); }
    50% { transform: translate(var(--sway-x), 50vh) rotateX(180deg) rotateY(180deg) rotateZ(180deg); }
    90% { opacity: var(--max-opacity); }
    100% { transform: translate(calc(var(--sway-x) * 1.5), 110vh) rotateX(360deg) rotateY(360deg) rotateZ(360deg); opacity: 0; }
}

/* 滚动条 */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.3); }

/* ================= 终极高度与布局限制 ================= */
.screen-panel {
    display: none;
    width: 100%;
    /* 强制锁定总高度为 700px，不准再无限拉长！ */
    height: 700px;
    position: relative;
    padding: 15px 5px;
    z-index: 10;
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.screen-panel.active {
    display: flex;
    justify-content: center;
    align-items: center; /* 居中对齐玻璃面板 */
}

/* 玻璃面板：继承父级的固定高度 */
.glass-panel {
    width: 100%;
    max-width: 1050px;
    height: 100%; /* 绝对占满 700px */
    display: flex;
    flex-direction: column; /* 垂直排布：头部 + 滚动内容 */
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 24px;
    padding: 25px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.5);
    transition: all 0.6s;
}

/* 面板头部：禁止收缩 */
.panel-header {
    flex-shrink: 0;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
}
.panel-header::after { content: ''; display: block; width: 60px; height: 3px; background: currentColor; margin: 15px auto 0; border-radius: 2px; opacity: 0.3; }
.panel-header h1 { font-size: 32px; color: var(--theme-text-main, #db2777); margin-bottom: 8px; letter-spacing: 4px; font-weight: 900; }
.panel-header p { font-size: 13px; color: #64748b; font-weight: bold; letter-spacing: 4px; text-transform: uppercase; }

/* 核心滚动区域：强制限制在剩余空间内滚动，禁止撑破面板！ */
.scrollable-content {
    flex: 1;
    min-height: 0; /* 关键属性！防止被内部长内容撑破 flex 容器 */
    overflow-y: auto;
    padding-right: 10px;
    padding-bottom: 10px;
}

/* ================= 内部组件样式 ================= */
.btn-return-title { position: fixed; top: 20px; left: 20px; z-index: 100; padding: 10px 20px; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.9); border-radius: 30px; font-size: 13px; font-weight: bold; cursor: pointer; color: #475569; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s; display: none; }
.btn-return-title:hover { background: #fff; transform: translateX(-5px); color: var(--theme-text-main, #db2777); }

#splash-screen { align-items: center; justify-content: center; flex-direction: column; z-index: 30; cursor: pointer; }
.splash-logo-main, .title-logo-main { font-family: 'Noto Serif SC', serif; font-size: 6vw; font-weight: 900; color: var(--theme-text-main, #db2777); letter-spacing: 0.2em; margin-bottom: 10px; text-shadow: 2px 2px 0 rgba(255,255,255,0.8); transition: color 1s; text-align: center; }
.title-logo-main { font-size: 4vw; z-index: 2; position: relative; }
.splash-logo-sub, .title-logo-sub { font-size: 1.5vw; letter-spacing: 0.8em; color: var(--theme-text-sub, #f472b6); font-weight: bold; font-family: sans-serif; transition: color 1s; text-align: center; text-shadow: 1px 1px 0 rgba(255,255,255,0.8); }
#click-to-start { margin-top: 5vh; font-size: 18px; color: var(--theme-text-main, #db2777); letter-spacing: 4px; animation: pulse 2s infinite; font-weight: bold; padding: 20px 40px; border-radius: 30px; background: rgba(255,255,255,0.3); backdrop-filter: blur(5px); }

#title-screen { align-items: center; flex-direction: column; padding-top: 10vh; z-index: 20;}
.title-logo-container { text-align: center; margin-bottom: 5vh; position: relative; }
.title-menu { display: flex; flex-direction: column; gap: 20px; align-items: center; width: 320px; margin-top: 20px;}
.menu-btn { width: 100%; padding: 16px 0; background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.9); border-radius: 30px; font-size: 18px; font-weight: bold; color: var(--theme-text-main, #db2777); cursor: pointer; transition: all 0.3s; letter-spacing: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden; }
.menu-btn::before { content: '✦'; position: absolute; left: 20px; opacity: 0; transition: 0.3s; transform: translateX(-10px); }
.menu-btn::after { content: '✦'; position: absolute; right: 20px; opacity: 0; transition: 0.3s; transform: translateX(10px); }
.menu-btn:hover { background: #fff; transform: scale(1.05); border-color: var(--theme-text-sub, #f472b6); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
.menu-btn:hover::before, .menu-btn:hover::after { opacity: 1; transform: translateX(0); }

/* 阵营卡片 */
.agency-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.agency-card { background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.4s; display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
.agency-card::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent); transform: skewX(-20deg); transition: 0.5s; z-index: 1; }
.agency-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08); }
.agency-card:hover::before { left: 200%; }
.card-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; z-index: 2; position: relative; border-bottom: 1px solid rgba(0,0,0,0.05);}
.card-title { font-size: 18px; font-weight: bold; letter-spacing: 1px; }
.card-content-wrap { display: flex; flex-direction: column; gap: 8px; flex-grow: 1; z-index: 2; position: relative; }
.info-row { font-size: 13px; line-height: 1.5; background: rgba(255,255,255,0.5); padding: 8px 10px; border-radius: 8px; }
.info-label { font-weight: bold; margin-right: 6px; font-size: 12px; opacity: 0.9;}
.card-action-hint { margin-top: auto; padding-top: 10px; font-size: 12px; font-weight: bold; text-align: right; opacity: 0.6; transition: 0.3s; z-index: 2; position: relative; }
.agency-card:hover .card-action-hint { opacity: 1; transform: translateX(-5px); }

.card-type-A { font-family: 'Noto Serif SC', serif; background: linear-gradient(145deg, #ffffff, #fefce8); border-color: rgba(253, 224, 71, 0.5); }
.card-type-A .card-title { color: #b45309; }
.card-type-A .info-label { color: #d97706; }
.card-type-B { font-family: -apple-system, sans-serif; background: linear-gradient(135deg, #ffffff, #f8fafc); border-left: 6px solid #f97316; }
.card-type-B .card-title { color: #ea580c; font-style: italic;}
.card-type-B .info-label { color: #f97316; }
.card-type-C { font-family: 'ZCOOL KuaiLe', cursive; border-radius: 24px; background: linear-gradient(135deg, #fffbeb, #fef08a); border: 2px dashed #fde047; }
.card-type-C .card-title { color: #b45309; }
.card-type-C .info-label { color: #d97706; }
.card-type-D { font-family: 'Noto Serif SC', serif; background: linear-gradient(to bottom, #f5f5f4, #e7e5e4); border: 1px solid #d6d3d1; }
.card-type-D .card-title { color: #44403c; }
.card-type-D .info-label { color: #57534e; }
.card-type-E { background: linear-gradient(135deg, #fef9c3, #fef08a); border-radius: 8px 32px 8px 32px; border: none; box-shadow: 4px 4px 0 #eab308; }
.card-type-E .card-title { color: #ca8a04; font-family: "Comic Sans MS", cursive;}
.card-type-E .info-label { color: #b45309; }
.card-type-F { background: linear-gradient(135deg, #faf5ff, #f3e8ff); border: 1px solid rgba(216, 180, 254, 0.5); }
.card-type-F .card-title { color: #6d28d9; }
.card-type-F .info-label { color: #7c3aed; }

/* 详情面板 */
.inner-container { background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
.detail-header { text-align: center; margin-bottom: 25px; }
.detail-title-main { font-size: 28px; font-weight: 800; margin-bottom: 8px; letter-spacing: 2px;}
.detail-title-sub { font-size: 12px; opacity: 0.7; letter-spacing: 6px; font-family: monospace;}
.detail-content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
.detail-panel { background: rgba(255, 255, 255, 0.9); border-radius: 16px; padding: 20px; border: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 12px; }
.detail-panel.full-width { grid-column: 1 / -1; }
.panel-title { font-size: 15px; font-weight: bold; padding-bottom: 10px; border-bottom: 2px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 8px; color: var(--theme-text-main, #db2777); }
.panel-title::before { content: ''; display: block; width: 4px; height: 16px; background: var(--theme-text-main, #db2777); border-radius: 2px; }
.detail-item { display: flex; flex-direction: column; gap: 6px; }
.item-label { font-size: 12px; opacity: 0.7; font-weight: bold;}
.item-value { font-size: 13px; line-height: 1.6; font-weight: 500; background: rgba(0,0,0,0.02); padding: 8px 12px; border-radius: 8px;}
.desc-text { font-size: 14px; line-height: 1.8; text-indent: 2em; padding: 10px; color: #475569;}

.btn-group { display: flex; justify-content: space-between; margin-top: 15px; gap: 15px; padding-top: 15px; border-top: 1px solid rgba(0,0,0,0.05);}
.btn { padding: 12px 20px; border: none; border-radius: 30px; cursor: pointer; font-weight: 800; font-size: 13px; transition: all 0.3s; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; gap: 8px; flex: 1; }
.btn-back { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; flex: 0 0 auto; }
.btn-back:hover { background: #e2e8f0; transform: translateX(-4px); }
.btn-submit { background: var(--theme-text-main, #f472b6); color: #fff; box-shadow: 0 8px 20px rgba(0,0,0,0.15);}
.btn-submit:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 12px 25px rgba(0,0,0,0.2); }

/* 表单设计 */
.form-section { margin-bottom: 20px; background: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); }
.form-section-title { font-size: 16px; margin-bottom: 15px; font-weight: bold; color: var(--theme-text-main, #db2777); }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; }
.form-row { display: flex; align-items: flex-start; gap: 10px; }
.form-label { width: 75px; font-size: 12px; font-weight: bold; opacity: 0.8; padding-top: 10px; text-align: right; }
.form-input-wrap { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.form-input, .form-select, .custom-input { width: 100%; background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px 14px; border-radius: 10px; font-size: 13px; }
.custom-input { display: none; }
.design-header { font-size: 20px; margin-bottom: 20px; border-bottom: 2px dashed rgba(0,0,0,0.1); padding-bottom: 10px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; color: var(--theme-text-main, #db2777); }
.design-header-badge { font-size: 12px; padding: 4px 10px; background: var(--theme-text-main, #db2777); color: #fff; border-radius: 20px; opacity: 0.8; }

/* 抽卡池详情与道具 */
.gacha-pool-container { display: flex; flex-direction: column; gap: 20px; }
.gacha-rate-box { background: rgba(255,255,255,0.9); border: 2px solid var(--theme-text-sub, #f472b6); border-radius: 16px; padding: 15px; text-align: center; box-shadow: 0 4px 15px rgba(219,39,119,0.1); }
.gacha-rate-title { font-size: 18px; font-weight: 900; color: var(--theme-text-main, #db2777); margin-bottom: 8px; }
.gacha-rate-text { font-size: 13px; color: #475569; line-height: 1.6; }
.gacha-rate-text span { font-weight: bold; color: var(--theme-text-main, #db2777); }
.gacha-section-title { font-size: 15px; font-weight: bold; color: #1e293b; margin-top: 10px; padding-bottom: 8px; border-bottom: 2px dashed rgba(0,0,0,0.1); }
.gacha-item-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; margin-top: 12px; }
.gacha-item-card { background: #fff; border-radius: 12px; padding: 8px; text-align: center; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 2px 8px rgba(0,0,0,0.02); display: flex; flex-direction: column; align-items: center; gap: 6px; }
.gacha-item-img { width: 60px; height: 60px; object-fit: contain; border-radius: 8px; background: #f1f5f9; }
.gacha-item-emoji { font-size: 30px; line-height: 60px; }
.gacha-item-name { font-size: 11px; font-weight: bold; color: #334155; }
.gacha-cost-info { display: flex; justify-content: center; gap: 20px; margin-top: 15px; font-size: 14px; font-weight: bold; color: #1e293b; background: #f8fafc; padding: 12px; border-radius: 12px; }

/* 道具列表 */
.item-list-container { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
.item-list-row { display: flex; align-items: center; gap: 10px; background: #fff; padding: 10px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 2px 5px rgba(0,0,0,0.02);}
.item-list-icon { width: 40px; height: 40px; border-radius: 6px; background: #f8fafc; flex-shrink: 0; object-fit: contain; }
.item-list-text { font-size: 12px; color: #475569; flex: 1; }
.item-list-text strong { color: var(--theme-text-main, #db2777); display: block; margin-bottom: 2px; font-size: 13px;}
.item-list-text span { opacity: 0.8; font-size: 11px; margin-left: 5px; color: #64748b;}
.item-list-rate { font-weight: 900; font-family: monospace; color: #f59e0b; background: rgba(245,158,11,0.1); padding: 4px 6px; border-radius: 6px; font-size: 11px;}

/* 抽卡结果 */
.gacha-result-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 15px; background: rgba(0,0,0,0.03); border-radius: 16px; border: 1px dashed rgba(0,0,0,0.1); margin-bottom: 15px;}
.gacha-result-card { background: #fff; border-radius: 12px; padding: 10px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; overflow: hidden; transform: rotateY(90deg); animation: flipIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
@keyframes flipIn { to { transform: rotateY(0deg); } }
.gacha-result-card.idol-card { border: 2px solid #fbbf24; background: linear-gradient(135deg, #fffbeb, #fef08a); box-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
.gacha-result-card.idol-card::after { content: 'IDOL'; position: absolute; top: 0; right: 0; background: #fbbf24; color: #fff; font-size: 9px; font-weight: bold; padding: 2px 6px; border-radius: 0 0 0 8px; z-index: 5; line-height: 1;}
.gacha-result-img { width: 70px; height: 70px; object-fit: contain; border-radius: 6px; background: #f8fafc; border: 1px solid rgba(0,0,0,0.05); }
.gacha-result-emoji { font-size: 35px; line-height: 70px; }
.gacha-result-name { font-size: 12px; font-weight: 900; color: #1e293b; transition: color 0.3s;}
.gacha-result-type { font-size: 10px; color: var(--theme-text-main, #db2777); background: rgba(219,39,119,0.1); padding: 2px 6px; border-radius: 8px; }

.mark-transform-wrap { position: relative; width: 70px; height: 70px; perspective: 1000px; }
.mark-img-front, .mark-img-back { position: absolute; top:0; left:0; width:100%; height:100%; border-radius: 6px; backface-visibility: hidden; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); object-fit: contain; border: 1px solid rgba(0,0,0,0.05);}
.mark-img-front { transform: rotateY(0deg); }
.mark-img-back { transform: rotateY(180deg); background: #fdf2f8; padding: 5px;}
.gacha-result-card.duplicate-card { border: 2px solid #3b82f6; background: linear-gradient(135deg, #eff6ff, #bfdbfe); box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
.gacha-result-card.duplicate-card::after { content: 'IDOL'; position: absolute; top: 0; right: 0; background: #3b82f6; color: #fff; font-size: 9px; font-weight: bold; padding: 2px 6px; border-radius: 0 0 0 8px; z-index: 5; transition: background 0.5s; line-height: 1;}
.gacha-result-card.do-transform .mark-img-front { transform: rotateY(-180deg); }
.gacha-result-card.do-transform .mark-img-back { transform: rotateY(0deg); }
.gacha-result-card.do-transform::after { content: 'MARK'; background: #db2777; }

/* 图鉴与回忆 */
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; }
.gallery-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.4s; border: 2px solid transparent; }
.gallery-card:hover { transform: translateY(-8px); border-color: var(--theme-text-main, #db2777); box-shadow: 0 15px 30px rgba(219,39,119,0.15); }
.gallery-img-wrap { width: 100%; aspect-ratio: 3/4; overflow: hidden; position: relative; background: #f1f5f9; }
.gallery-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.gallery-card:hover img { transform: scale(1.05); }
.gallery-info { padding: 12px; text-align: center; }
.gallery-name { font-size: 16px; font-weight: 900; color: #1e293b; margin-bottom: 4px; }
.gallery-tag { font-size: 11px; color: var(--theme-text-main, #db2777); background: rgba(219,39,119,0.1); padding: 4px 8px; border-radius: 10px; display: inline-block; }

.gallery-profile { display: flex; flex-wrap: wrap; gap: 20px; }
.profile-left { flex: 0 0 250px; display: flex; flex-direction: column; gap: 15px; }
.profile-avatar { width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 4px solid #fff; }
.profile-right { flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 20px; }

.memory-header-bar { position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 2px dashed rgba(0,0,0,0.1); }
.memory-btn-back { position: absolute; left: 0; }
.memory-title-center { font-size: 20px; font-weight: 900; color: var(--theme-text-main, #db2777); letter-spacing: 2px; text-align: center; margin: 0; }

.memory-tabs { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;}
.memory-tab-btn { padding: 8px 24px; font-size: 14px; font-weight: bold; border-radius: 30px; cursor: pointer; transition: 0.3s; background: rgba(255,255,255,0.5); border: 2px solid #cbd5e1; color: #64748b; }
.memory-tab-btn.active.sfw { background: #38bdf8; border-color: #0284c7; color: #fff; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3); }
.memory-tab-btn.active.nsfw { background: #f43f5e; border-color: #e11d48; color: #fff; box-shadow: 0 4px 15px rgba(244, 63, 94, 0.3); }

.memory-photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; }
.memory-photo-card { background: #fff; border-radius: 10px; padding: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.3s; display: flex; flex-direction: column; }
.memory-photo-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
.memory-photo-img { width: 100%; object-fit: contain; border-radius: 6px; background: #f1f5f9; }
.memory-photo-title { text-align: center; font-size: 12px; font-weight: bold; color: #475569; margin-top: 8px; padding-top: 6px; border-top: 1px dashed rgba(0,0,0,0.1); }

/* 进度条 */
.stat-bar-container { width: 100%; background: rgba(0,0,0,0.05); border-radius: 6px; height: 10px; overflow: hidden; margin-top: 4px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); }
.stat-bar-fill { height: 100%; border-radius: 6px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
.stat-bar-fill::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 100%); animation: shimmer 2s infinite; }
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
.stat-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2px; }
.stat-value-text { font-weight: 900; font-size: 14px; font-family: monospace; }
.stat-desc { font-size: 10px; opacity: 0.8; margin-top: 4px; }

/* 选项 */
.option-section { background: rgba(255,255,255,0.8); border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
.option-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #334155; }
.option-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed rgba(0,0,0,0.1); flex-wrap: wrap; gap: 10px;}
input[type=range] { -webkit-appearance: none; width: 180px; background: transparent; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; background: var(--theme-text-main, #db2777); cursor: pointer; margin-top: -6px; }
input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; background: #cbd5e1; border-radius: 2px; }
.toggle-btn { padding: 6px 16px; border-radius: 16px; border: 2px solid #cbd5e1; background: transparent; cursor: pointer; font-weight: bold; font-size: 12px;}
.toggle-btn.active { border-color: var(--theme-text-main, #db2777); background: var(--theme-text-main, #db2777); color: #fff; }
.theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px; margin-top: 10px; }
.theme-card { padding: 15px 8px; border-radius: 10px; text-align: center; cursor: pointer; border: 2px solid transparent; background: rgba(255,255,255,0.5); font-size: 12px;}
.theme-card.active { background: #fff; border-color: var(--theme-text-main, #db2777); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

.loading { text-align: center; padding: 40px; color: #94a3b8; font-size: 14px; font-weight: bold; letter-spacing: 2px; animation: pulse 1.5s infinite;}
.toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: #fff; padding: 10px 20px; border-radius: 30px; font-size: 13px; z-index: 9999; opacity: 0; transition: opacity 0.3s; pointer-events: none;}
