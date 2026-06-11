// ====== item_data.js (全局仓库版) ======
(function() {
    let topWin;
    try { topWin = window.parent || window; } catch(e) { topWin = window; }
    if (!topWin.IdolProjectData) topWin.IdolProjectData = {};

    // 存入道具数据库
    topWin.IdolProjectData.itemPool = [
        // ================= 【心理状态干预】 =================
        { type: 'psychology', name: "薄荷糖", img: "https://i.postimg.cc/d3kyKtLB/bao-he-tang-(1).png", weight: 100, desc: "微量缓解压力 (Stress -5%)" },
        { type: 'psychology', name: "热牛奶", img: "https://i.postimg.cc/VvxbsQCM/re-niu-nai-(1).png", weight: 30, desc: "少量缓解压力 (Stress -15%)" },
        { type: 'psychology', name: "安眠香薰", img: "https://i.postimg.cc/vTgVdHcv/an-mian-xiang-xun-(1).png", weight: 20, desc: "中度舒缓精神 (Stress -30%)" },
        { type: 'psychology', name: "度假机票", img: "https://i.postimg.cc/fyG0Wn9m/du-jia-ji-piao-(1).png", weight: 2, desc: "彻底清空压力 (Stress -80%)" },
        { type: 'psychology', name: "镇静药片", img: "https://i.postimg.cc/pL7chsD5/zhen-jing-yao-pian-(1).png", weight: 60, desc: "微量提升堕落度 (Lust +10)" },
        { type: 'psychology', name: "VIP房卡", img: "https://i.postimg.cc/W1KYF5MJ/vip-fang-ka-(1).png", weight: 40, desc: "开启密会 (Lust +20)" },
        { type: 'psychology', name: "高额合同", img: "https://i.postimg.cc/P5cVpSmZ/gao-e-he-tong-(1).png", weight: 20, desc: "中度提升堕落度 (Lust +40)" },
        { type: 'psychology', name: "皮带项圈", img: "https://i.postimg.cc/zGM2bxng/pi-dai-xiang-quan-(1).png", weight: 5, desc: "大幅提升堕落度 (Lust +60)" },
        { type: 'psychology', name: "行程表", img: "https://i.postimg.cc/J47JkgCK/xing-cheng-biao.png", weight: 30, desc: "规划时间 (Obedience +5)" },
        { type: 'psychology', name: "制作人指令卡", img: "https://i.postimg.cc/c41YnjGh/zhi-zuo-ren-zhi-ling-ka.png", weight: 15, desc: "强制服从 (Obedience +10)" },
        { type: 'psychology', name: "制作人徽章", img: "https://i.postimg.cc/025mw31C/zhi-zuo-ren-hui-zhang.png", weight: 8, desc: "权威象征 (Obedience +15)" },
        { type: 'psychology', name: "金色企划书", img: "https://i.postimg.cc/ZKY3dgzx/jin-se-qi-hua-shu.png", weight: 2, desc: "绝对服从 (Obedience +20)" },
        { type: 'psychology', name: "粉丝来信", img: "https://i.postimg.cc/y8VfWnLJ/fen-si-lai-xin.png", weight: 40, desc: "增加偶像羁绊 (Affection +2)" },
        { type: 'psychology', name: "手写便签", img: "https://i.postimg.cc/cLsD6TF8/shou-xie-bian-qian.png", weight: 30, desc: "传递关怀 (Affection +4)" },
        { type: 'psychology', name: "纪念相册", img: "https://i.postimg.cc/qvkmgQ16/ji-nian-xiang-ce.png", weight: 20, desc: "回忆杀 (Affection +7)" },
        { type: 'psychology', name: "情书", img: "https://i.postimg.cc/BnqhtNmj/qing-shu.png", weight: 10, desc: "直球告白 (Affection +10)" },

        // ================= 【业务能力提升】 =================
        { type: 'business', name: "练习话筒", img: "https://i.postimg.cc/gkvzGc7d/lian-xi-hua-tong.png", weight: 20, desc: "Vocal能力微量提升 (+2)" },
        { type: 'business', name: "专业麦克风", img: "https://i.postimg.cc/TYrdT2sY/zhuan-ye-mai-ke-feng.png", weight: 12, desc: "Vocal能力少量提升 (+5)" },
        { type: 'business', name: "水晶麦克风", img: "https://i.postimg.cc/MKy6zZLW/shui-jing-mai-ke-feng.png", weight: 6, desc: "Vocal能力中量提升 (+8)" },
        { type: 'business', name: "金唱片", img: "https://i.postimg.cc/MKy6zZL6/jin-chang-pian.png", weight: 2, desc: "Vocal能力大幅提升 (+10)" },
        { type: 'business', name: "练习舞鞋", img: "https://i.postimg.cc/cHcpPPzf/lian-xi-wu-xie-(1).png", weight: 20, desc: "Dance能力微量提升 (+2)" },
        { type: 'business', name: "演出舞鞋", img: "https://i.postimg.cc/qRGPWWFL/yan-chu-wu-xie-1.png", weight: 12, desc: "Dance能力少量提升 (+5)" },
        { type: 'business', name: "水晶舞鞋", img: "https://i.postimg.cc/PxMg007M/shui-jing-wu-xie-(1).png", weight: 6, desc: "Dance能力中量提升 (+8)" },
        { type: 'business', name: "闪耀舞鞋", img: "https://i.postimg.cc/26xsggtG/shan-yao-wu-xie-(1).png", weight: 2, desc: "Dance能力大幅提升 (+10)" },
        { type: 'business', name: "拍立得", img: "https://i.postimg.cc/5jckyV63/pai-li-de.png", weight: 20, desc: "Visual能力微量提升 (+2)" },
        { type: 'business', name: "摄影胶卷", img: "https://i.postimg.cc/SQXSnfJZ/she-ying-jiao-juan.png", weight: 12, desc: "Visual能力少量提升 (+5)" },
        { type: 'business', name: "时尚杂志", img: "https://i.postimg.cc/NGysKk5J/shi-shang-za-zhi.png", weight: 6, desc: "Visual能力中量提升 (+8)" },
        { type: 'business', name: "封面海报", img: "https://i.postimg.cc/t70mJjYz/feng-mian-hai-bao.png", weight: 2, desc: "Visual能力大幅提升 (+10)" },

        // ================= 【特殊彩蛋与剧情】 =================
        { type: 'easter_egg', name: "冰棒", img: "https://i.postimg.cc/85V97FNx/bing-bang.png", weight: 40, desc: "降温解暑 (Stress -10%, Affection +5)" },
        { type: 'easter_egg', name: "珍珠奶茶", img: "https://i.postimg.cc/6qWPhD7H/zhen-zhu-nai-cha.png", weight: 25, desc: "甜品治愈 (Stress -20%, Affection +3)" },
        { type: 'easter_egg', name: "麦片粥", img: "https://i.postimg.cc/26fM1qCq/mai-pian-zhou.png", weight: 15, desc: "温暖肠胃 (Stress -25%, Affection +1)" },
        { type: 'easter_egg', name: "巧克力蛋糕", img: "https://i.postimg.cc/d1mXrq01/qiao-ke-li-dan-gao.png", weight: 8, desc: "高热量治愈 (Stress -50%, Affection +3)" },
        { type: 'easter_egg', name: "小黄鸭", img: "https://i.postimg.cc/vmZWwN3D/xiao-huang-ya.png", weight: 5, desc: "触发共浴剧情。Stress -20, Affection +5" },
        { type: 'easter_egg', name: "草莓饭团", img: "https://i.postimg.cc/vBdk41bJ/cao-mei-fan-tuan.png", weight: 5, desc: "触发投喂剧情。Stress -10, Affection +1 (芦田希未额外加成)" },
        { type: 'easter_egg', name: "制作人玩偶", img: "https://i.postimg.cc/YSC1BsbG/zhi-zuo-ren-wan-ou.png", weight: 4, desc: "触发制作人玩偶剧情。Stress -40, Affection +20" },
        { type: 'easter_egg', name: "创可贴", img: "https://i.postimg.cc/NMwSKyBW/chuang-ke-tie.png", weight: 5, desc: "触发包扎剧情。Stress -15, Affection +5" },
        { type: 'easter_egg', name: "星星布丁", img: "https://i.postimg.cc/NFsnxWy8/xing-xing-bu-ding.png", weight: 5, desc: "触发甜点时间。Stress -30, Affection +5" },
        { type: 'easter_egg', name: "身体乳", img: "https://i.postimg.cc/fLjFmwbK/shen-ti-ru.png", weight: 4, desc: "触发涂抹剧情。Stress -10, Affection +3" },
        { type: 'easter_egg', name: "婚纱", img: "https://i.postimg.cc/ydztDJ7B/hun-sha.png", weight: 1, desc: "触发试穿婚纱绝密剧情。Affection +30" },
        { type: 'easter_egg', name: "对戒戒指盒", img: "https://i.postimg.cc/Y9wZv4tK/dui-jie-jie-zhi-he.png", weight: 2, desc: "触发赠礼剧情。Affection +20" },

        { type: 'easter_egg', name: "Cupless Bra", img: "https://i.postimg.cc/hGmN48RR/cupless-bra.png", weight: 3, desc: "触发更衣剧情。Stress+10, Aff+3, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "兔女郎装", img: "https://i.postimg.cc/fyzPv63m/tu-nu-lang-zhuang.png", weight: 3, desc: "触发Cosplay剧情。Stress+10, Aff+8, Ob+10, Lust+5" },
        { type: 'easter_egg', name: "奶牛比基尼", img: "https://i.postimg.cc/76Mc0xLx/nai-niu-bi-ji-ni.png", weight: 3, desc: "触发牧场摄影。Stress+10, Aff+8, Ob+15, Lust+5" },
        { type: 'easter_egg', name: "情趣内衣", img: "https://i.postimg.cc/Yq1txyrh/qing-qu-nei-yi.png", weight: 3, desc: "触发夜间招待。Stress-10, Aff+6, Ob+10" },
        { type: 'easter_egg', name: "幸运胖次", img: "https://i.postimg.cc/W41McHXh/xing-yun-pang-ci.png", weight: 3, desc: "触发搜查剧情。Stress-10, Aff+15, Ob+10" },
        { type: 'easter_egg', name: "猫耳发箍", img: "https://i.postimg.cc/KY8nhHJ8/mao-er-fa-gu.png", weight: 4, desc: "触发猫娘撒娇。Stress-10, Aff+3" },

        { type: 'easter_egg', name: "跳蛋", img: "https://i.postimg.cc/yN8FCbvd/tiao-dan.png", weight: 4, desc: "触发隐藏刺激事件。Stress-20, Aff+5, Ob+10, Lust+5" },
        { type: 'easter_egg', name: "震动棒", img: "https://i.postimg.cc/N0j1vzpH/zhen-dong-bang.png", weight: 4, desc: "触发休息室调教。Stress-20, Aff+5, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "G点按摩器", img: "https://i.postimg.cc/wvdZ1tg4/G-dian-an-mo-qi-(G-spot-massager).png", weight: 3, desc: "触发深层开发。Stress-20, Aff+3, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "前列腺按摩器", img: "https://i.postimg.cc/26FJhz55/qian-lie-xian-an-mo-qi-aneros.png", weight: 2, desc: "触发特殊体质开发。Stress-20, Aff+3, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "双头龙", img: "https://i.postimg.cc/JncgZ1hK/shuang-tou-long-double-dildo.png", weight: 2, desc: "触发双人互动。Stress-20, Aff+1, Ob+20, Lust+15" },

        { type: 'easter_egg', name: "乳夹", img: "https://i.postimg.cc/Y9fVYpSg/ru-jia.png", weight: 3, desc: "触发敏感度训练。Stress+15, Aff+1, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "乳环", img: "https://i.postimg.cc/rmCbx8pz/ru-huan.png", weight: 3, desc: "触发穿孔改造。Stress+15, Aff+1, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "乳钉", img: "https://i.postimg.cc/hjbwTSGv/ru-ding.png", weight: 3, desc: "触发穿孔改造。Stress+15, Aff+1, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "乳链", img: "https://i.postimg.cc/RFQ8KM0d/ru-lian.png", weight: 3, desc: "触发牵引调教。Stress+15, Aff+1, Ob+10, Lust+10" },
        { type: 'easter_egg', name: "榨乳器", img: "https://i.postimg.cc/Y0rPxJ48/zha-ru-qi.png", weight: 2, desc: "触发催乳剧情。Stress+15, Aff+3, Ob+10, Lust+5" },
        { type: 'easter_egg', name: "金色乳头夹", img: "https://i.postimg.cc/63Ng87BW/jin-se-ru-tou-jia.png", weight: 2, desc: "触发高级调教。Stress-15, Aff+5, Ob+10" },

        { type: 'easter_egg', name: "宝石肛塞", img: "https://i.postimg.cc/Gh0cG1CY/bao-shi-gang-sai.png", weight: 3, desc: "触发常驻佩戴指令。Stress+10, Aff+3, Ob+5, Lust+5" },
        { type: 'easter_egg', name: "尾巴肛塞", img: "https://i.postimg.cc/Dyq7cYvP/wei-ba-gang-sai.png", weight: 3, desc: "触发宠物扮演。Stress+10, Aff+6, Ob+5, Lust+5" },
        { type: 'easter_egg', name: "拉珠", img: "https://i.postimg.cc/XJ0mrZnJ/la-zhu-anal-beads.png", weight: 3, desc: "触发登台挑战。Stress+15, Aff+1, Ob+20, Lust+15" },

        { type: 'easter_egg', name: "口球", img: "https://i.postimg.cc/pTt4m9PV/kou-qiu.png", weight: 3, desc: "触发禁言惩罚。Stress+10, Aff+1, Ob+20, Lust+5" },
        { type: 'easter_egg', name: "环形口塞", img: "https://i.postimg.cc/C1VXRZwV/huan-xing-kou-sai.png", weight: 3, desc: "触发深喉拓展。Stress+10, Aff+1, Ob+10, Lust+5" },
        { type: 'easter_egg', name: "金属项圈", img: "https://i.postimg.cc/TY8RgX6n/jin-shu-xiang-quan.png", weight: 3, desc: "触发主奴契约。Stress+10, Aff+3, Ob+10, Lust+5" },
        { type: 'easter_egg', name: "狗链", img: "https://i.postimg.cc/TwXFKyT8/gou-lian.png", weight: 2, desc: "触发遛狗剧情。Stress+15, Aff+1, Ob+50, Lust+10" },
        { type: 'easter_egg', name: "手铐", img: "https://i.postimg.cc/c4Qdc5xw/shou-kao.png", weight: 3, desc: "触发拘禁审问。Stress+5, Aff+3, Ob+10, Lust+1" },
        { type: 'easter_egg', name: "束缚带", img: "https://i.postimg.cc/ZKrJLDbd/shu-fu-dai.png", weight: 3, desc: "触发强制压制。Stress+10, Aff+3, Ob+10, Lust+1" },
        { type: 'easter_egg', name: "龟甲缚", img: "https://i.postimg.cc/TwXFKyTv/gui-jia-fu.png", weight: 2, desc: "触发绳艺展示。Stress+10, Aff+1, Ob+10, Lust+1" },
        { type: 'easter_egg', name: "鞭子", img: "https://i.postimg.cc/ZRh2W942/bian-zi.png", weight: 2, desc: "触发肉体惩戒。Stress+20, Aff+1, Ob+30, Lust+10" },
        { type: 'easter_egg', name: "蜡烛", img: "https://i.postimg.cc/hjq6XJKv/la-zhu.png", weight: 2, desc: "触发滴蜡体验。Stress-10, Aff+3" },
        { type: 'easter_egg', name: "鼻勾", img: "https://i.postimg.cc/Kzyw1KxV/bi-gou.png", weight: 2, desc: "触发屈辱姿态。Stress+10, Aff+1, Ob+5, Lust+1" },
        { type: 'easter_egg', name: "尿道棒", img: "https://i.postimg.cc/fLjFmwbT/niao-dao-bang.png", weight: 2, desc: "触发极限忍耐。Stress+20, Aff+1, Ob+20, Lust+20" },
        { type: 'easter_egg', name: "贞操带", img: "https://i.postimg.cc/tJqczL1k/zhen-cao-dai.png", weight: 2, desc: "触发欲望管理。Stress+15, Aff+1, Ob+20, Lust+10" },
        { type: 'easter_egg', name: "录像带", img: "https://i.postimg.cc/PrmdMFXC/lu-xiang-dai.png", weight: 2, desc: "触发绝密要挟剧情。Stress+5, Aff+3, Ob+10, Lust+1" },
        { type: 'easter_egg', name: "眼罩", img: "https://i.postimg.cc/WbMs7fN6/yan-zhao.png", weight: 4, desc: "触发视觉剥夺体验。Stress+10, Aff+1" }
    ];

    // 为了向下兼容旧 HTML 的写法
    window.itemPool = topWin.IdolProjectData.itemPool;

})();
