// ==========================================
// 星探寻访 (Gacha) APP 独立模块 - 闪耀偶像大师风格重制版
// ==========================================

(function() {
    let topDoc;
    let topWin;
    try {
        topDoc = window.parent.document || document;
        topWin = window.parent || window;
    } catch (e) {
        topDoc = document;
        topWin = window;
    }

    if (typeof topWin.playerCurrency === 'undefined') {
        topWin.playerCurrency = { stardust: 50000 };
    }

    // --- 为了绝对安全，内置一份默认的道具池数据，防止外部文件未加载导致空池 ---
    const defaultItemPool = [
        { type: 'psychology', name: <q>"薄荷糖"</q>, img: <q>"https://i.postimg.cc/d3kyKtLB/bao-he-tang-(1).png"</q>, weight: 100, desc: <q>"微量缓解压力 (Stress -5%)"</q> },
        { type: 'psychology', name: <q>"热牛奶"</q>, img: <q>"https://i.postimg.cc/VvxbsQCM/re-niu-nai-(1).png"</q>, weight: 30, desc: <q>"少量缓解压力 (Stress -15%)"</q> },
        { type: 'psychology', name: <q>"安眠香薰"</q>, img: <q>"https://i.postimg.cc/vTgVdHcv/an-mian-xiang-xun-(1).png"</q>, weight: 20, desc: <q>"中度舒缓精神 (Stress -30%)"</q> },
        { type: 'psychology', name: <q>"VIP房卡"</q>, img: <q>"https://i.postimg.cc/W1KYF5MJ/vip-fang-ka-(1).png"</q>, weight: 40, desc: <q>"开启密会 (Lust +20)"</q> },
        { type: 'psychology', name: <q>"金色企划书"</q>, img: <q>"https://i.postimg.cc/ZKY3dgzx/jin-se-qi-hua-shu.png"</q>, weight: 2, desc: <q>"绝对服从 (Obedience +20)"</q> },
        { type: 'psychology', name: <q>"情书"</q>, img: <q>"https://i.postimg.cc/BnqhtNmj/qing-shu.png"</q>, weight: 10, desc: <q>"直球告白 (Affection +10)"</q> },
        { type: 'business', name: <q>"专业麦克风"</q>, img: <q>"https://i.postimg.cc/TYrdT2sY/zhuan-ye-mai-ke-feng.png"</q>, weight: 12, desc: <q>"Vocal能力少量提升 (+5)"</q> },
        { type: 'business', name: <q>"金唱片"</q>, img: <q>"https://i.postimg.cc/MKy6zZL6/jin-chang-pian.png"</q>, weight: 2, desc: <q>"Vocal能力大幅提升 (+10)"</q> },
        { type: 'business', name: <q>"闪耀舞鞋"</q>, img: <q>"https://i.postimg.cc/26xsggtG/shan-yao-wu-xie-(1).png"</q>, weight: 2, desc: <q>"Dance能力大幅提升 (+10)"</q> },
        { type: 'business', name: <q>"封面海报"</q>, img: <q>"https://i.postimg.cc/t70mJjYz/feng-mian-hai-bao.png"</q>, weight: 2, desc: <q>"Visual能力大幅提升 (+10)"</q> },
        { type: 'easter_egg', name: <q>"草莓饭团"</q>, img: <q>"https://i.postimg.cc/vBdk41bJ/cao-mei-fan-tuan.png"</q>, weight: 5, desc: <q>"触发投喂剧情。Stress -10, Affection +1"</q> },
        { type: 'easter_egg', name: <q>"婚纱"</q>, img: <q>"https://i.postimg.cc/ydztDJ7B/hun-sha.png"</q>, weight: 1, desc: <q>"触发试穿婚纱绝密剧情。Affection +30"</q> },
        { type: 'easter_egg', name: <q>"兔女郎装"</q>, img: <q>"https://i.postimg.cc/fyzPv63m/tu-nu-lang-zhuang.png"</q>, weight: 3, desc: <q>"触发Cosplay剧情。Stress+10, Aff+8, Ob+10, Lust+5"</q> },
        { type: 'easter_egg', name: <q>"录像带"</q>, img: <q>"https://i.postimg.cc/PrmdMFXC/lu-xiang-dai.png"</q>, weight: 2, desc: <q>"触发绝密要挟剧情。Stress+5, Aff+3, Ob+10, Lust+1"</q> }
    ];

    // 获取真实道具池：优先用外部挂载的，如果没有就用内置的
    function getActiveItemPool() {
        if (typeof topWin.itemPool !== 'undefined' && topWin.itemPool.length > 0) {
            return topWin.itemPool;
        }
        return defaultItemPool;
    }

    // --- 注入专属 Idolmaster 风格高阶 CSS ---
    if (!topDoc.getElementById('qingzi-gacha-imas-style')) {
        const style = topDoc.createElement('style');
        style.id = 'qingzi-gacha-imas-style';
        style.innerHTML = `
            /* 基础容器 - 偶像大师典型的明亮格子/星光背景 */
            .imas-container { width: 100%; height: 100%; display: flex; flex-direction: column; background: #fdfdfd; background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 20px 20px; font-family: -apple-system, "Microsoft YaHei", sans-serif; position: relative; overflow: hidden; }

            /* 顶部资产栏 */
            .imas-top-bar { height: 65px; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); border-bottom: 2px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; padding: 0 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); z-index: 10; flex-shrink: 0; position: relative; }
            .imas-top-bar::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #38bdf8, #f472b6, transparent); }

            .imas-title-wrap { display: flex; align-items: center; gap: 15px; }
            .imas-main-title { font-size: 24px; font-weight: 900; color: #1e293b; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .imas-sub-title { font-size: 11px; background: #1e293b; color: #fff; padding: 2px 8px; border-radius: 12px; font-weight: bold; letter-spacing: 1px; }

            .imas-currency { display: flex; align-items: center; gap: 8px; background: #fff; padding: 5px 20px; border-radius: 30px; border: 2px solid #fbbf24; box-shadow: inset 0 2px 5px rgba(0,0,0,0.05), 0 2px 8px rgba(245,158,11,0.2); }
            .imas-currency i { color: #f59e0b; font-size: 20px; filter: drop-shadow(0 0 5px rgba(245,158,11,0.5)); }
            .imas-currency-val { font-size: 20px; font-weight: 900; font-family: "Impact", monospace; color: #b45309; }

            /* 主界面结构 */
            .imas-main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }

            /* 顶部标签页 (常驻/限定) */
            .imas-tab-bar { display: flex; justify-content: center; gap: 20px; padding: 15px 0; z-index: 5; position: relative; }
            .imas-tab { padding: 10px 40px; border-radius: 30px; font-size: 16px; font-weight: 900; cursor: pointer; transition: 0.3s; background: #f1f5f9; color: #64748b; border: 2px solid #cbd5e1; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .imas-tab.active { background: linear-gradient(135deg, #f472b6, #db2777); color: #fff; border-color: #be185d; box-shadow: 0 8px 20px rgba(219,39,119,0.3); transform: scale(1.05); }
            .imas-tab i { margin-right: 8px; }

            /* Banner 区域 (华丽的横幅) */
            .imas-banner-wrap { flex: 1; margin: 0 30px 20px; border-radius: 24px; overflow: hidden; position: relative; background: #1e293b; box-shadow: 0 15px 35px rgba(0,0,0,0.15); border: 4px solid #fff; }
            .imas-banner-bg { position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; opacity: 0.6; transition: opacity 0.5s; }
            .imas-banner-char { position: absolute; right: 5%; bottom: -5%; height: 115%; object-fit: contain; filter: drop-shadow(-15px 0 25px rgba(0,0,0,0.6)); pointer-events: none; transition: 0.5s; z-index: 2; }

            /* 光效点缀 */
            .imas-banner-wrap::before { content: ''; position: absolute; top:0; left:0; width:50%; height:100%; background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%); z-index: 1; }
            .imas-banner-wrap::after { content: ''; position: absolute; bottom:0; left:0; width:100%; height:30%; background: linear-gradient(0deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%); z-index: 1; mix-blend-mode: overlay; }

            .imas-banner-info { position: absolute; left: 40px; top: 50%; transform: translateY(-50%); color: #fff; z-index: 3; max-width: 55%; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
            .imas-banner-type { display: inline-block; padding: 6px 16px; background: linear-gradient(90deg, #f59e0b, #fbbf24); border-radius: 20px; font-size: 14px; font-weight: 900; letter-spacing: 2px; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(245,158,11,0.4); border: 2px solid #fff; color: #78350f; }
            .imas-banner-name { font-size: 52px; font-weight: 900; margin-bottom: 15px; line-height: 1.1; font-family: 'Noto Serif SC', serif; letter-spacing: 2px; }
            .imas-banner-desc { font-size: 16px; opacity: 0.9; line-height: 1.6; background: rgba(0,0,0,0.4); padding: 10px 15px; border-radius: 12px; backdrop-filter: blur(5px); border-left: 4px solid #f472b6; }

            /* 底部操作区 */
            .imas-action-bar { padding: 0 30px 30px; display: flex; align-items: center; justify-content: space-between; z-index: 10; }

            .imas-btn-detail { display: flex; align-items: center; gap: 8px; padding: 14px 28px; background: #fff; border: 2px solid #cbd5e1; border-radius: 30px; color: #475569; font-weight: 900; cursor: pointer; transition: 0.2s; font-size: 16px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
            .imas-btn-detail:hover { background: #f8fafc; color: #db2777; border-color: #f472b6; transform: translateY(-2px); }

            .imas-pull-group { display: flex; gap: 25px; }
            .imas-btn-pull { position: relative; width: 220px; height: 75px; border-radius: 38px; border: 3px solid #fff; cursor: pointer; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15); transition: 0.2s; }
            .imas-btn-pull:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.25); filter: brightness(1.1); }
            .imas-btn-pull:active { transform: translateY(2px); }
            .imas-btn-pull.disabled { opacity: 0.5; pointer-events: none; filter: grayscale(1); }

            /* 单抽按钮 - 蓝色/青色系 */
            .imas-btn-single { background: linear-gradient(135deg, #0ea5e9, #2563eb); color: #fff; }
            /* 十连按钮 - 粉色/金色系 (偶像大师标志性抽卡色) */
            .imas-btn-ten { background: linear-gradient(135deg, #f472b6, #db2777); color: #fff; }

            .imas-pull-text { font-size: 20px; font-weight: 900; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 2; }
            .imas-pull-cost { font-size: 14px; display: flex; align-items: center; gap: 6px; opacity: 0.95; font-weight: 900; z-index: 2; margin-top: 2px; background: rgba(0,0,0,0.2); padding: 2px 10px; border-radius: 12px; }
            .imas-pull-cost i { font-size: 15px; color: #fcd34d; }

            /* 高光扫过特效 */
            .imas-btn-pull::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%); transform: rotate(45deg) translateY(-100%); transition: 0.6s; }
            .imas-btn-pull:hover::before { transform: rotate(45deg) translateY(100%); }

            /* ================= 抽卡过程闪耀动画层 ================= */
            /* 必须覆盖在最顶层 */
            .imas-anim-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: #fff; z-index: 9999; display: none; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; opacity: 0; transition: opacity 0.3s; }
            .imas-anim-overlay.active { display: flex; opacity: 1; }

            /* 星光放射背景 */
            .imas-anim-bg { position: absolute; width: 200%; height: 200%; background: conic-gradient(from 0deg at 50% 50%, #fff 0deg, #fbcfe8 45deg, #bae6fd 90deg, #fff 135deg, #fef08a 180deg, #fff 225deg, #c7d2fe 270deg, #fbcfe8 315deg, #fff 360deg); animation: rotateBg 4s linear infinite; opacity: 0.3; }
            @keyframes rotateBg { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

            /* 飞入的信封/闪光 */
            .imas-anim-flash { width: 100px; height: 100px; background: #fff; border-radius: 50%; box-shadow: 0 0 50px 20px #fff, 0 0 100px 50px #f472b6, 0 0 150px 80px #fbbf24; animation: flashBurst 2s ease-in forwards; z-index: 2; position: relative; display: flex; justify-content: center; align-items: center; font-size: 50px; color: #db2777; }
            @keyframes flashBurst { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.5); opacity: 1; } 80% { transform: scale(5); opacity: 1; } 100% { transform: scale(20); opacity: 0; } }

            .imas-anim-text { position: absolute; z-index: 3; color: #db2777; font-size: 28px; font-weight: 900; letter-spacing: 8px; text-shadow: 0 0 10px #fff; animation: textFade 2s ease-in forwards; bottom: 20%; }
            @keyframes textFade { 0% { opacity:0; transform:translateY(20px); } 20% { opacity:1; transform:translateY(0); } 80% { opacity:1; } 100% { opacity:0; } }

            /* ================= 结果展示层 ================= */
            /* 必须覆盖在最顶层 */
            .imas-result-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(15px); z-index: 9998; display: none; flex-direction: column; opacity: 0; transition: opacity 0.5s; }
            .imas-result-overlay.active { display: flex; opacity: 1; }

            .imas-res-header { text-align: center; padding: 40px 0 20px; position: relative; }
            .imas-res-title { color: #fff; font-size: 32px; font-weight: 900; letter-spacing: 6px; text-shadow: 0 0 20px rgba(255,255,255,0.5); }
            .imas-res-title::before, .imas-res-title::after { content: '✦'; color: #f472b6; margin: 0 15px; font-size: 24px; }

            .imas-res-grid { flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: 25px; padding: 20px 50px; overflow-y: auto; perspective: 1200px; }

            /* 卡片本身 */
            .imas-res-card { width: 150px; height: 210px; background: #fff; border-radius: 16px; display: flex; flex-direction: column; align-items: center; padding: 15px 10px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); position: relative; transform-style: preserve-3d; transform: rotateY(90deg) scale(0.8); opacity: 0; border: 4px solid transparent; }
            .imas-res-card.flip-in { animation: imasCardFlip 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            @keyframes imasCardFlip { to { transform: rotateY(0deg) scale(1); opacity: 1; } }

            /* 华丽度区分 */
            /* 偶像卡 (SSR级别光效) */
            .imas-res-card.type-idol { background: linear-gradient(180deg, #fffbeb, #fef08a); border-color: #fbbf24; box-shadow: 0 0 30px rgba(245, 158, 11, 0.5), inset 0 0 20px rgba(255,255,255,0.8); }
            .imas-res-card.type-idol::before { content: ''; position: absolute; top:-5px; left:-5px; right:-5px; bottom:-5px; border-radius: 20px; background: linear-gradient(45deg, #f59e0b, #fbbf24, #fff, #f59e0b); z-index: -1; animation: ssrBorder 2s linear infinite; }
            @keyframes ssrBorder { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }

            /* 印记转化 (SR级别) */
            .imas-res-card.type-dup { background: linear-gradient(180deg, #eff6ff, #bae6fd); border-color: #38bdf8; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4); }
            /* 道具/星尘 (R级别) */
            .imas-res-card.type-item { background: linear-gradient(180deg, #f8fafc, #e2e8f0); border-color: #94a3b8; }
            .imas-res-card.type-currency { background: linear-gradient(180deg, #fefce8, #fde68a); border-color: #fcd34d; }

            .imas-res-tag { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 900; color: #fff; padding: 4px 15px; border-radius: 12px; z-index: 5; box-shadow: 0 4px 10px rgba(0,0,0,0.3); white-space: nowrap; border: 2px solid #fff; }
            .type-idol .imas-res-tag { background: linear-gradient(90deg, #db2777, #f472b6); }
            .type-dup .imas-res-tag { background: linear-gradient(90deg, #2563eb, #3b82f6); }
            .type-item .imas-res-tag { background: linear-gradient(90deg, #475569, #64748b); }
            .type-currency .imas-res-tag { background: linear-gradient(90deg, #d97706, #f59e0b); }

            .imas-res-img-wrap { width: 90px; height: 90px; margin-top: 15px; margin-bottom: 15px; position: relative; border-radius: 12px; overflow: hidden; background: #fff; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 0 10px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05); }
            .imas-res-img-wrap img { width: 100%; height: 100%; object-fit: contain; }
            .imas-res-img-wrap i { font-size: 45px; color: #94a3b8; }

            .imas-res-name { font-size: 14px; font-weight: 900; text-align: center; line-height: 1.3; width: 100%; z-index: 2; }
            .type-idol .imas-res-name { color: #9a3412; }
            .type-dup .imas-res-name { color: #1e3a8a; }
            .type-item .imas-res-name { color: #334155; }
            .type-currency .imas-res-name { color: #9a3412; }

            /* 重复印记翻转特效 */
            .imas-res-card.type-dup .imas-res-img-wrap img.mark-front, .imas-res-card.type-dup .imas-res-img-wrap i.mark-back { position: absolute; top:0; left:0; width:100%; height:100%; backface-visibility: hidden; transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .imas-res-card.type-dup .imas-res-img-wrap img.mark-front { transform: rotateY(0deg); }
            .imas-res-card.type-dup .imas-res-img-wrap i.mark-back { transform: rotateY(180deg); background: #fdf2f8; color: #db2777; display: flex; align-items: center; justify-content: center; font-size: 45px; }
            .imas-res-card.do-transform .mark-front { transform: rotateY(-180deg) !important; }
            .imas-res-card.do-transform .mark-back { transform: rotateY(0deg) !important; }

            .imas-res-footer { padding: 30px; display: flex; justify-content: center; gap: 30px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); }
            .imas-btn-res { padding: 18px 50px; border-radius: 40px; font-size: 18px; font-weight: 900; cursor: pointer; border: 3px solid #fff; transition: 0.2s; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
            .imas-btn-res-close { background: rgba(255,255,255,0.2); color: #fff; backdrop-filter: blur(5px); }
            .imas-btn-res-close:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); }
            .imas-btn-res-again { background: linear-gradient(135deg, #f472b6, #db2777); color: #fff; }
            .imas-btn-res-again:hover { filter: brightness(1.1); transform: translateY(-3px); box-shadow: 0 15px 30px rgba(219,39,119,0.5); }

            /* ================= 卡池详情侧边抽屉 ================= */
            .imas-detail-drawer { position: absolute; top: 0; right: -100%; width: 65%; max-width: 700px; height: 100%; background: #f8fafc; box-shadow: -15px 0 40px rgba(0,0,0,0.2); z-index: 50; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; border-left: 2px solid #e2e8f0; }
            .imas-detail-drawer.open { right: 0; }
            .imas-detail-header { padding: 25px 35px; border-bottom: 2px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #fff; }
            .imas-detail-title { font-size: 22px; font-weight: 900; color: #1e293b; display: flex; align-items: center; gap: 10px; }
            .imas-btn-close-drawer { background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 20px; color: #64748b; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; }
            .imas-btn-close-drawer:hover { background: #fee2e2; color: #ef4444; transform: rotate(90deg); }

            .imas-detail-content { flex: 1; overflow-y: auto; padding: 35px; }
            .imas-detail-content::-webkit-scrollbar { width: 8px; }
            .imas-detail-content::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

            .imas-info-section { margin-bottom: 35px; background: #fff; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; }
            .imas-section-title { font-size: 18px; font-weight: 900; color: #db2777; border-bottom: 2px dashed #fbcfe8; padding-bottom: 10px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }

            .imas-rate-box { display: flex; flex-direction: column; gap: 10px; }
            .imas-rate-row { display: flex; justify-content: space-between; padding: 12px 15px; background: #f8fafc; border-radius: 8px; font-size: 15px; }
            .imas-rate-label { color: #475569; font-weight: bold; }
            .imas-rate-val { color: #1e293b; font-family: "Impact", monospace; font-weight: 900; font-size: 16px; letter-spacing: 1px; }

            .imas-idol-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 15px; }
            .imas-idol-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: center; transition: 0.2s; }
            .imas-idol-item:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-color: #cbd5e1; }
            .imas-idol-img { width: 70px; height: 70px; object-fit: cover; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 10px; }
            .imas-idol-name { font-size: 13px; font-weight: 900; color: #334155; }

            .imas-item-list { display: flex; flex-direction: column; gap: 12px; }
            .imas-item-row { display: flex; align-items: center; gap: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 20px; transition: 0.2s; }
            .imas-item-row:hover { background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .imas-item-icon-wrap { width: 45px; height: 45px; background: #fff; border-radius: 10px; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); flex-shrink: 0; padding: 5px; }
            .imas-item-icon-wrap img { width: 100%; height: 100%; object-fit: contain; }
            .imas-item-info { flex: 1; }
            .imas-item-name { font-size: 15px; font-weight: 900; color: #1e293b; margin-bottom: 4px; }
            .imas-item-desc { font-size: 13px; color: #64748b; }
        `;
        topDoc.head.appendChild(style);
    }

    topWin.renderGachaApp = function(container) {
        // --- 卡池配置 ---
        const pools = {
            'standard': {
                id: 'standard',
                name: '常驻星探发掘',
                desc: '发掘隐藏在街头巷尾的原石，扩充事务所战力。',
                bg: 'https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg',
                charImg: '',
                idolRate: 0.04,
                typeLabel: 'STANDARD SCOUT'
            },
            'limited': {
                id: 'limited',
                name: '【限定】星光坠落之夜',
                desc: '本期特选偶像发掘概率大幅提升！不容错过的命运邂逅。',
                bg: 'https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg', // 如果有限定背景可替换
                charImg: (topWin.idolDatabase && topWin.idolDatabase.length > 0) ? topWin.idolDatabase[0].image : '',
                idolRate: 0.08,
                typeLabel: 'LIMITED SCOUT'
            }
        };

        let currentPoolId = 'standard';

        const html = `
            <div class="imas-container">
                <!-- 顶部 -->
                <div class="imas-top-bar">
                    <div class="imas-title-wrap">
                        <span class="imas-main-title">星探寻访</span>
                        <span class="imas-sub-title">PRODUCE GACHA</span>
                    </div>
                    <div class="imas-currency">
                        <i class="bi bi-stars"></i>
                        <span class="imas-currency-val" id="imas-stardust-val">${topWin.playerCurrency.stardust}</span>
                    </div>
                </div>

                <!-- 主体 -->
                <div class="imas-main-area">
                    <!-- 标签页 -->
                    <div class="imas-tab-bar">
                        <div class="imas-tab active" data-target="standard"><i class="bi bi-geo-alt-fill"></i> 常驻发掘</div>
                        <div class="imas-tab" data-target="limited"><i class="bi bi-stars"></i> 限定发掘 UP!</div>
                    </div>

                    <!-- Banner 展示 -->
                    <div class="imas-banner-wrap">
                        <img src="${pools[currentPoolId].bg}" class="imas-banner-bg" id="imas-banner-bg">
                        <img src="${pools[currentPoolId].charImg}" class="imas-banner-char" id="imas-banner-char" style="display:${pools[currentPoolId].charImg?'block':'none'};">

                        <div class="imas-banner-info">
                            <div class="imas-banner-type" id="imas-banner-type">${pools[currentPoolId].typeLabel}</div>
                            <div class="imas-banner-name" id="imas-banner-name">${pools[currentPoolId].name}</div>
                            <div class="imas-banner-desc" id="imas-banner-desc">${pools[currentPoolId].desc}</div>
                        </div>
                    </div>

                    <!-- 底部操作 -->
                    <div class="imas-action-bar">
                        <button class="imas-btn-detail" id="btn-imas-detail">
                            <i class="bi bi-info-circle-fill" style="color:#3b82f6;"></i> 卡池详情
                        </button>

                        <div class="imas-pull-group">
                            <button class="imas-btn-pull imas-btn-single" id="btn-imas-single">
                                <span class="imas-pull-text">发掘 1 回</span>
                                <div class="imas-pull-cost"><i class="bi bi-stars"></i> 1000</div>
                            </button>
                            <button class="imas-btn-pull imas-btn-ten" id="btn-imas-ten">
                                <span class="imas-pull-text">发掘 10 回</span>
                                <div class="imas-pull-cost"><i class="bi bi-stars"></i> 10000</div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 侧边详情抽屉 -->
                <div class="imas-detail-drawer" id="imas-detail-drawer">
                    <div class="imas-detail-header">
                        <div class="imas-detail-title"><i class="bi bi-pie-chart-fill" style="color:#db2777;"></i> 卡池情报公示</div>
                        <button class="imas-btn-close-drawer" id="btn-imas-close-drawer"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="imas-detail-content" id="imas-detail-content">
                        <!-- 动态渲染内容 -->
                    </div>
                </div>

                <!-- 🌟 全屏抽卡动画层 (修正层级，确保覆盖全屏) 🌟 -->
                <div class="imas-anim-overlay" id="imas-anim-overlay">
                    <div class="imas-anim-bg"></div>
                    <div class="imas-anim-flash"><i class="bi bi-envelope-heart-fill"></i></div>
                    <div class="imas-anim-text">星光闪耀中...</div>
                </div>

                <!-- 🌟 全屏抽卡结果层 🌟 -->
                <div class="imas-result-overlay" id="imas-result-overlay">
                    <div class="imas-res-header">
                        <div class="imas-res-title">发掘报告</div>
                    </div>
                    <div class="imas-res-grid" id="imas-res-grid"></div>
                    <div class="imas-res-footer">
                        <button class="imas-btn-res imas-btn-res-close" id="btn-res-close"><i class="bi bi-check-lg"></i> 确认</button>
                        <button class="imas-btn-res imas-btn-res-again" id="btn-res-again"><i class="bi bi-arrow-repeat"></i> 再次发掘 (10000)</button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // --- 获取 DOM ---
        const uiStardust = container.querySelector('#imas-stardust-val');
        const uiBannerBg = container.querySelector('#imas-banner-bg');
        const uiBannerChar = container.querySelector('#imas-banner-char');
        const uiBannerType = container.querySelector('#imas-banner-type');
        const uiBannerName = container.querySelector('#imas-banner-name');
        const uiBannerDesc = container.querySelector('#imas-banner-desc');
        const btnSingle = container.querySelector('#btn-imas-single');
        const btnTen = container.querySelector('#btn-imas-ten');

        const drawer = container.querySelector('#imas-detail-drawer');
        const drawerContent = container.querySelector('#imas-detail-content');

        const animOverlay = container.querySelector('#imas-anim-overlay');
        const resultOverlay = container.querySelector('#imas-result-overlay');
        const resGrid = container.querySelector('#imas-res-grid');

        // 更新余额显示
        function updateCurrencyUI() {
            uiStardust.innerText = topWin.playerCurrency.stardust;
            if (topWin.playerCurrency.stardust < 1000) btnSingle.classList.add('disabled'); else btnSingle.classList.remove('disabled');
            if (topWin.playerCurrency.stardust < 10000) btnTen.classList.add('disabled'); else btnTen.classList.remove('disabled');
        }

        // 切换卡池
        container.querySelectorAll('.imas-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.imas-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentPoolId = tab.getAttribute('data-target');
                const p = pools[currentPoolId];

                uiBannerBg.src = p.bg;
                if(p.charImg) { uiBannerChar.src = p.charImg; uiBannerChar.style.display = 'block'; }
                else { uiBannerChar.style.display = 'none'; }

                uiBannerType.innerText = p.typeLabel;
                uiBannerName.innerText = p.name;
                uiBannerDesc.innerText = p.desc;
            });
        });

        // 渲染详情抽屉 (包含道具池渲染修复)
        function renderDetailDrawer() {
            const p = pools[currentPoolId];
            const iRate = p.idolRate * 100;
            const resRate = 1 - p.idolRate;
            const starRate = (resRate * 0.45) * 100;
            const itemRate = (resRate * 0.55) * 100;

            const activeItemPool = getActiveItemPool();

            let dHtml = `
                <div class="imas-info-section">
                    <div class="imas-section-title"><i class="bi bi-bar-chart-fill"></i> 提供比例</div>
                    <div class="imas-rate-box">
                        <div class="imas-rate-row"><span class="imas-rate-label">偶像发掘率</span><span class="imas-rate-val" style="color:#db2777;">${iRate.toFixed(1)}%</span></div>
                        <div class="imas-rate-row"><span class="imas-rate-label">资源道具提供率</span><span class="imas-rate-val">${itemRate.toFixed(1)}%</span></div>
                        <div class="imas-rate-row"><span class="imas-rate-label">星尘资源返还率</span><span class="imas-rate-val">${starRate.toFixed(1)}%</span></div>
                    </div>
                </div>

                <div class="imas-info-section">
                    <div class="imas-section-title"><i class="bi bi-people-fill"></i> 登场偶像</div>
                    <div class="imas-idol-grid">
            `;

            if (topWin.idolDatabase && topWin.idolDatabase.length > 0) {
                topWin.idolDatabase.forEach(idol => {
                    dHtml += `<div class="imas-idol-item"><img src="${idol.image}" class="imas-idol-img"><div class="imas-idol-name">${idol.name}</div></div>`;
                });
            } else {
                dHtml += `<div style="grid-column:1/-1; color:#94a3b8; font-size:14px; font-weight:bold;">暂无偶像数据</div>`;
            }
            dHtml += `</div></div>`;

            // 修复后的道具池渲染
            dHtml += `
                <div class="imas-info-section">
                    <div class="imas-section-title"><i class="bi bi-box2-heart-fill"></i> 包含资源道具</div>
                    <div class="imas-item-list">
            `;
            if (activeItemPool.length > 0) {
                activeItemPool.forEach(item => {
                    dHtml += `
                        <div class="imas-item-row">
                            <div class="imas-item-icon-wrap"><img src="${item.img}"></div>
                            <div class="imas-item-info">
                                <div class="imas-item-name">${item.name}</div>
                                <div class="imas-item-desc">${item.desc}</div>
                            </div>
                        </div>
                    `;
                });
            } else {
                dHtml += `<div style="color:#94a3b8; font-size:14px; font-weight:bold;">无法读取道具数据</div>`;
            }
            dHtml += `</div></div>`;

            drawerContent.innerHTML = dHtml;
        }

        container.querySelector('#btn-imas-detail').addEventListener('click', () => {
            renderDetailDrawer();
            drawer.classList.add('open');
        });
        container.querySelector('#btn-imas-close-drawer').addEventListener('click', () => {
            drawer.classList.remove('open');
        });

        // --- 抽卡执行核心 ---
        function executePull(times) {
            const cost = times * 1000;
            if (topWin.playerCurrency.stardust < cost) return;

            topWin.playerCurrency.stardust -= cost;
            updateCurrencyUI();

            const p = pools[currentPoolId];
            const results = [];
            let seenIdols = new Set();
            const db = topWin.idolDatabase || [];

            // 获取真实生效的道具池并计算总权重
            const activeItemPool = getActiveItemPool();
            const currentTotalItemWeight = activeItemPool.reduce((sum, item) => sum + item.weight, 0) || 1;

            for(let i=0; i<times; i++) {
                let roll = Math.random();
                if (roll <= p.idolRate && db.length > 0) {
                    let rIdol = db[Math.floor(Math.random() * db.length)];
                    let isDup = Math.random() < 0.3 || seenIdols.has(rIdol.name);
                    if (isDup) {
                        results.push({ type: 'duplicate', name: rIdol.name, img: rIdol.image });
                    } else {
                        seenIdols.add(rIdol.name);
                        results.push({ type: 'idol', name: rIdol.name, img: rIdol.image });
                    }
                } else {
                    let itemRoll = Math.random();
                    if (itemRoll <= 0.45 || activeItemPool.length === 0) {
                        let sRoll = Math.random() * 100;
                        let amt = 100;
                        if(sRoll<=1) amt=5000; else if(sRoll<=6) amt=1000; else if(sRoll<=20) amt=500; else if(sRoll<=50) amt=300;
                        results.push({ type: 'stardust', amount: amt });
                        topWin.playerCurrency.stardust += amt; // 返还星尘
                    } else {
                        let weightRoll = Math.random() * currentTotalItemWeight;
                        let selectedItem = activeItemPool[0];
                        for(let item of activeItemPool) {
                            if(weightRoll < item.weight) { selectedItem = item; break; }
                            weightRoll -= item.weight;
                        }
                        results.push({ type: 'item', data: selectedItem });
                    }
                }
            }

            // 触发全屏动画
            showPullAnimation(results);
        }

        // 动画演出 (修复层级显示问题)
        function showPullAnimation(results) {
            // 确保每次播放重新触发CSS动画
            const flashEl = animOverlay.querySelector('.imas-anim-flash');
            const textEl = animOverlay.querySelector('.imas-anim-text');
            flashEl.style.animation = 'none'; textEl.style.animation = 'none';
            void flashEl.offsetWidth; // 触发重绘
            flashEl.style.animation = 'flashBurst 2.5s ease-in forwards';
            textEl.style.animation = 'textFade 2.5s ease-in forwards';

            animOverlay.style.display = 'flex';
            setTimeout(() => animOverlay.classList.add('active'), 10);

            // 动画持续2.5秒后切入结果页
            setTimeout(() => {
                animOverlay.classList.remove('active');
                setTimeout(() => {
                    animOverlay.style.display = 'none';
                    renderResults(results);
                }, 300);
            }, 2500);
        }

        // 渲染结果
        function renderResults(results) {
            resGrid.innerHTML = '';
            results.forEach((res, idx) => {
                let delay = idx * 0.15; // 卡片依次翻开
                let cHtml = '';

                if (res.type === 'idol') {
                    cHtml = `
                        <div class="imas-res-card type-idol flip-in" style="animation-delay:${delay}s">
                            <div class="imas-res-tag">SSR 偶像</div>
                            <div class="imas-res-img-wrap"><img src="${res.img}"></div>
                            <div class="imas-res-name">${res.name}</div>
                        </div>
                    `;
                } else if (res.type === 'duplicate') {
                    cHtml = `
                        <div class="imas-res-card type-dup flip-in" style="animation-delay:${delay}s">
                            <div class="imas-res-tag">SR 印记</div>
                            <div class="imas-res-img-wrap">
                                <img src="${res.img}" class="mark-front">
                                <i class="bi bi-vinyl-fill mark-back"></i>
                            </div>
                            <div class="imas-res-name dup-name" data-name="${res.name}">${res.name}</div>
                        </div>
                    `;
                } else if (res.type === 'stardust') {
                    cHtml = `
                        <div class="imas-res-card type-currency flip-in" style="animation-delay:${delay}s">
                            <div class="imas-res-tag">R 资源</div>
                            <div class="imas-res-img-wrap" style="background:transparent;"><i class="bi bi-stars" style="color:#f59e0b; font-size:55px;"></i></div>
                            <div class="imas-res-name">星尘 ×${res.amount}</div>
                        </div>
                    `;
                } else {
                    cHtml = `
                        <div class="imas-res-card type-item flip-in" style="animation-delay:${delay}s">
                            <div class="imas-res-tag">R 道具</div>
                            <div class="imas-res-img-wrap" style="background:transparent;"><img src="${res.data.img}"></div>
                            <div class="imas-res-name">${res.data.name}</div>
                        </div>
                    `;
                }
                resGrid.insertAdjacentHTML('beforeend', cHtml);
            });

            updateCurrencyUI();

            resultOverlay.style.display = 'flex';
            setTimeout(() => resultOverlay.classList.add('active'), 10);

            // 触发重复卡印记翻转动画 (在所有卡片进场后)
            setTimeout(() => {
                const dupCards = resGrid.querySelectorAll('.type-dup');
                dupCards.forEach(el => {
                    el.classList.add('do-transform');
                    const nameEl = el.querySelector('.dup-name');
                    nameEl.innerText = nameEl.getAttribute('data-name') + '·印记';
                });
            }, 1000 + (results.length * 150));
        }

        // 按钮绑定
        btnSingle.addEventListener('click', () => executePull(1));
        btnTen.addEventListener('click', () => executePull(10));

        container.querySelector('#btn-res-close').addEventListener('click', () => {
            resultOverlay.classList.remove('active');
            setTimeout(() => resultOverlay.style.display = 'none', 500);
        });

        container.querySelector('#btn-res-again').addEventListener('click', () => {
            resultOverlay.classList.remove('active');
            setTimeout(() => {
                resultOverlay.style.display = 'none';
                executePull(10);
            }, 500);
        });

        // 初始化
        updateCurrencyUI();
    };
})();
