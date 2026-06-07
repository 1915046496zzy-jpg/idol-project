// 扩充道具池与抽卡权重设定
// 分类：'business'(业务能力), 'psychology'(心理状态), 'easter_egg'(彩蛋)
var itemPool = [
    // ================= 【心理状态干预】 =================
    // Stress类
    { type: 'psychology', name: "薄荷糖", img: "https://i.postimg.cc/d3kyKtLB/bao-he-tang-(1).png", weight: 100, desc: "微量缓解压力 (Stress -5%)" },
    { type: 'psychology', name: "热牛奶", img: "https://i.postimg.cc/VvxbsQCM/re-niu-nai-(1).png", weight: 30, desc: "少量缓解压力 (Stress -15%)" },
    { type: 'psychology', name: "安眠香薰", img: "https://i.postimg.cc/vTgVdHcv/an-mian-xiang-xun-(1).png", weight: 20, desc: "中度舒缓精神 (Stress -30%)" },
    { type: 'psychology', name: "度假机票", img: "https://i.postimg.cc/fyG0Wn9m/du-jia-ji-piao-(1).png", weight: 2, desc: "彻底清空压力 (Stress -80%)" },

    // Obedience/Lust类
    { type: 'psychology', name: "镇静药片", img: "https://i.postimg.cc/pL7chsD5/zhen-jing-yao-pian-(1).png", weight: 60, desc: "微量提升堕落度 (Lust +10)" },
    { type: 'psychology', name: "VIP房卡", img: "https://i.postimg.cc/W1KYF5MJ/vip-fang-ka-(1).png", weight: 40, desc: "开启密会 (Lust +20)" },
    { type: 'psychology', name: "高额合同", img: "https://i.postimg.cc/P5cVpSmZ/gao-e-he-tong-(1).png", weight: 20, desc: "中度提升堕落度 (Lust +40)" },
    { type: 'psychology', name: "皮带项圈", img: "https://i.postimg.cc/zGM2bxng/pi-dai-xiang-quan-(1).png", weight: 5, desc: "大幅提升堕落度 (Lust +60)" },
    { type: 'psychology', name: "行程表", img: "https://i.postimg.cc/J47JkgCK/xing-cheng-biao.png", weight: 30, desc: "规划时间 (Obedience +5)" },
    { type: 'psychology', name: "制作人指令卡", img: "https://i.postimg.cc/c41YnjGh/zhi-zuo-ren-zhi-ling-ka.png", weight: 15, desc: "强制服从 (Obedience +10)" },
    { type: 'psychology', name: "制作人徽章", img: "https://i.postimg.cc/025mw31C/zhi-zuo-ren-hui-zhang.png", weight: 8, desc: "权威象征 (Obedience +15)" },
    { type: 'psychology', name: "金色企划书", img: "https://i.postimg.cc/ZKY3dgzx/jin-se-qi-hua-shu.png", weight: 2, desc: "绝对服从 (Obedience +20)" },

    // Affection类
    { type: 'psychology', name: "粉丝来信", img: "https://i.postimg.cc/y8VfWnLJ/fen-si-lai-xin.png", weight: 40, desc: "增加偶像羁绊 (Affection +2)" },
    { type: 'psychology', name: "手写便签", img: "https://i.postimg.cc/cLsD6TF8/shou-xie-bian-qian.png", weight: 30, desc: "传递关怀 (Affection +4)" },
    { type: 'psychology', name: "纪念相册", img: "https://i.postimg.cc/qvkmgQ16/ji-nian-xiang-ce.png", weight: 20, desc: "回忆杀 (Affection +7)" },
    { type: 'psychology', name: "情书", img: "https://i.postimg.cc/BnqhtNmj/qing-shu.png", weight: 10, desc: "直球告白 (Affection +10)" },
