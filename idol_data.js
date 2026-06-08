// 六大阵营机密情报数据
var agencyData = [
    {
        "代号": "选择A",
        "名称": "Lumière Blanc (白之光演艺)",
        "特点": "顶尖艺术与高雅路线。包装极高门槛的完美偶像，绝不迎合下沉市场。",
        "优势": "掌握国际高端时尚杂志、古典乐及奢侈品代言资源。",
        "劣势": "前期粉丝积累极慢，对业务能力要求苛刻。",
        "详细介绍": "所在地: 东京都涩谷区神宫前 (表参道高奢区)。禁止任何丑闻，一旦被爆出负面新闻直接解约封杀。"
    },
    {
        "代号": "选择B",
        "名称": "1030 Production (一零三零制作)",
        "特点": "业界最大综合事务所。起源于草根团体，如今已发展为业界巨头。",
        "优势": "垄断级国民通告、巨蛋演唱会资源与打歌节目通道。",
        "劣势": "旗下组合众多，存在激烈的良性竞争。",
        "详细介绍": "所在地: 东京都港区赤坂 (大型综合办公大楼)。核心理念是“大家像家人一样共同进步”。资源极其丰厚，氛围积极向上，是无数新人向往的王道偶像殿堂。"
    },
    {
        "代号": "选择C",
        "名称": "Petit Rêve (微梦制作)",
        "特点": "U15低龄特化厂牌。主打纯粹的陪伴、养成与治愈。",
        "优势": "拥有专属课业辅导团队、童装代言及低龄垂直市场渠道。",
        "劣势": "受劳动法夜间通告严格限制。",
        "详细介绍": "所在地: 1030制作下属特设区域。制作人不仅是上司，更是“保姆”与“长辈”，需兼顾偶像的学业与演艺活动。"
    },
    {
        "代号": "选择D",
        "名称": "Sunset Asuka (飞鸟旧社)",
        "特点": "时代眼泪与老牌没落。充满人情味。",
        "优势": "保留极少数传统电视节目的午夜档固定名额。",
        "劣势": "资金链濒临断裂，设施陈旧。",
        "详细介绍": "所在地: 东京都台东区浅草 (破旧的昭和风老楼)。连空调都经常坏。留下的都是不愿放弃梦想的“原石”或被大厂淘汰的弃子。制作人与偶像常常需要一起吃苦，互相扶持度过难关。"
    },
    {
        "代号": "选择E",
        "名称": "Stray Cats (野猫演艺)",
        "特点": "极度草根与市井偶像。极具烟火气与生命力。",
        "优势": "零规矩限制，主要靠商店街大叔大妈的赞助。",
        "劣势": "常年赤字，公司连正经法人资格都存疑。",
        "详细介绍": "所在地: 埼玉县川越市商店街 (关东煮店二楼的单间)。偶像为了维持生计，白天需要在楼下关东煮店、便利店兼职打工，晚上在街头路演。像野猫一样顽强生存。"
    },
    {
        "代号": "选择F",
        "名称": "Suzuran Production (铃兰制作)",
        "特点": "中型事务所。公众形象纯洁无瑕，私下却极度黑暗。",
        "优势": "表面有常规通告，暗地掌握灰色资金及政商高层招待渠道。",
        "劣势": "内部实行残酷的“字母评级与债务制”。",
        "详细介绍": "所在地: 东京都新宿区西新宿 (外表光鲜的高级写字楼)。低级成员要参与夜间陪同来偿还天价债务，高级成员需签订“专属契约”提供特殊服务。制作人既可同流合污，也可试图在泥潭中保护她们。"
    }
];



const idolDatabase = [
            {
                id: 1,
                name: "浅宫加爱",
                tag: "极具感染力的小太阳",
                image: "https://i.postimg.cc/MGf2Z4Bp/qian-gong-jia-ai.png",
                memories: {
                    sfw: [
                        { url: "https://i.postimg.cc/MGf2Z4Bp/qian-gong-jia-ai.png", title: "最后一步是勇气" },
                        { url: "https://i.postimg.cc/43qwcb8c/qian-gong-jia-ai-xiao-fu.png", title: "夏服 · 笑容确认" },
                        { url: "https://i.postimg.cc/gJJJCQ8C/qian-gong-jia-ai-gan-xie-ji.png", title: "谢谢你看到这里" },
                        { url: "https://i.postimg.cc/JnnnfvZ9/qian-gong-jia-ai-yu-zhong.png", title: "伞下的空想临界" },
                        { url: "https://i.postimg.cc/j555pmyq/qian-gong-jia-ai-zuo-mian-dian.png", title: "料理与笑容的配比" }
                    ],
                    nsfw: [
                        { url: "https://i.postimg.cc/8kK9H3ZY/qian-gong-jia-ai-chuang-shang-tuo-yi.png", title: "剥落的茧与初绽之花" },
                        { url: "https://i.postimg.cc/B666rkHR/qian-gong-jia-ai-quan-luo-jin-zhang.png", title: "突如其来的零距离" },
                        { url: "https://i.postimg.cc/rmmmB3xb/qian-gong-jia-ai-chuan-jiao-shi-ti-wei.png", title: "魔力回路·直连校准" }
                    ]
                },
                basic: {
                    "🎓 职业": "高中二年级学生",
                    "🎂 年龄": "16岁 (生日: 4月14日)",
                    "📏 身高/体型": "155cm / 娇小匀称",
                    "👙 罩杯": "微乳 (B罩杯)",
                    "🎨 外观特征": "白皙粉嫩肤色，自然深棕及肩短发，清澈棕瞳",
                    "✨ 特殊特征": "笑容极具感染力",
                    "🏠 家庭与背景": "普通工薪家庭，父母非常支持梦想。零花钱仅够电车票和便宜零食。因看到商场演出决定站在舞台上。"
                },
                psychology: {
                    "🧠 MBTI": "ENFP (小太阳)",
                    "🎭 性格底色": "天然纯真，习惯用元气掩饰不安",
                    "💦 衍生行为": "紧张时会揪裙角并疯狂鞠躬道歉"
                },
                privacy: {
                    "🌱 阴毛状态": "稀疏型 (只有少量几根，范围很小)",
                    "🍒 乳头细节": "浅色乳头型 (颜色偏粉红，尺寸较小)",
                    "🌸 小穴外观": "一线天型 (阴唇紧闭，缝隙极细几乎不可见)",
                    "🍑 菊花外观": "紧致型 (开口很小，皮肤绷得很紧)"
                },
                traits: {
                    "✨ 特质A【天生感染力】": "笑容极具亲和力。常规白通告成功率提升10%，粉丝获取倍率增加20%。",
                    "💢 特质B【肢体不协调】": "极易平地摔。舞蹈训练与通告失败率增加15%；若失败，压力值额外增加10点。"
                },
                stats: {
                    "🎤 Vocal (唱功)": { value: 45, max: 100, desc: "C级 - 职业及格线，声音清脆有辨识度", color: "#ec4899" },
                    "💃 Dance (舞蹈)": { value: 25, max: 100, desc: "D级 - 勉强能看，经常跟不上节拍", color: "#8b5cf6" },
                    "🌟 Visual (视觉)": { value: 55, max: 100, desc: "C级 - 职业及格线，极具亲和力的邻家感", color: "#eab308" }
                },
                status: {
                    "💢 Stress (压力值)": { value: 0, max: 100, color: "#ef4444" },
                    "❤️ Affection (羁绊)": { value: 40, max: 100, color: "#f43f5e" },
                    "⛓️ Obedience (服从度)": { value: 60, max: 100, color: "#64748b" },
                    "💰 Lust (堕落度)": { value: 0, max: 100, color: "#a855f7" }
                }
            },
            {
                id: 2,
                name: "芦田希未",
                tag: "慵懒的随性天才",
                image: "https://i.postimg.cc/63ZtXc2K/lu-tian-xi-wei.png",
                memories: {
                    sfw: [
                        { url: "https://i.postimg.cc/63ZtXc2K/lu-tian-xi-wei.png", title: "闪耀的星辰" },
                        { url: "https://i.postimg.cc/wxsZw3L9/lu-tian-xi-wei-zhun-bei-deng-tai.png", title: "后台五分钟" }
                    ],
                    nsfw: [
                        { url: "https://i.postimg.cc/3JJTnmjb/lu-tian-xi-wei-luo-ti-chen-shan.png", title: "借来的慵懒" },
                        { url: "https://i.postimg.cc/VNBSXXWc/lu-tian-xi-wei-zi-wei.png", title: "深夜的个人修行" },
                        { url: "https://i.postimg.cc/MGbc11mS/lu-tian-xi-wei-xi-zao.png", title: "花洒下的哼唱时光" },
                        { url: "https://i.postimg.cc/Bbh7b8VY/lu-tian-xi-wei-chuan-jiao-shi-nei-she.png", title: "契约的最终流向" },
                        { url: "https://i.postimg.cc/pr0cr96c/lu-tian-xi-wei-hou-ru.png", title: "毫无防备的身后" }
                    ]
                },
                basic: {
                    "🎓 职业": "初中三年级学生",
                    "🎂 年龄": "15岁 (生日: 11月23日)",
                    "📏 身高/体型": "160cm / 标准苗条",
                    "👙 罩杯": "标准 (C罩杯)",
                    "🎨 外观特征": "白皙粉嫩肤色，耀眼灿金及腰大波浪长卷，明亮翠绿瞳",
                    "✨ 特殊特征": "随时随地都在打哈欠，眼神总是带着没睡醒的迷离",
                    "🏠 家庭与背景": "父母皆为外派高管，资金极其宽裕但对金钱无概念。在长椅睡觉时被吵醒，觉得当偶像能打发时间便签约了。"
                },
                psychology: {
                    "🧠 MBTI": "ISTP (慵懒随性/逻辑怪)",
                    "🎭 性格底色": "极度慵懒，对周遭事物漠不关心，主色调是随性亲昵",
                    "💦 衍生行为": "遇到不想参加的训练，会直接抱着制作人的手臂喊darling来逃避"
                },
                privacy: {
                    "🌱 阴毛状态": "白虎型 (天生几乎不长阴毛，外阴光滑无毛)",
                    "🍒 乳头细节": "浅色乳头型 (颜色偏粉红，尺寸饱满)",
                    "🌸 小穴外观": "馒头型 (阴阜饱满隆起，整体圆润突出)",
                    "🍑 菊花外观": "平滑型 (褶皱很少，相对光滑)"
                },
                traits: {
                    "✨ 特质A【随性天才】": "拥有恐怖的舞台直觉。Visual(视觉)与Dance(舞蹈)属性成长速度提升200%。",
                    "💤 特质B【小憩一会】": "每日固定扣除大量Stress并恢复状态。但在持续集中注意力的通告时，有15%概率因睡着导致失败。"
                },
                stats: {
                    "🎤 Vocal (唱功)": { value: 75, max: 100, desc: "B级 - 实力派，气息控制极佳但缺乏感情投入", color: "#ec4899" },
                    "💃 Dance (舞蹈)": { value: 92, max: 100, desc: "A级 - 业界顶流，身体柔韧性与节奏感属于怪物级别", color: "#8b5cf6" },
                    "🌟 Visual (视觉)": { value: 95, max: 100, desc: "S级 - 传说级，只需站在那里就能让全场失声的压倒性魅力", color: "#eab308" }
                },
                status: {
                    "💢 Stress (压力值)": { value: 10, max: 100, color: "#ef4444" },
                    "❤️ Affection (羁绊)": { value: 40, max: 100, color: "#f43f5e" },
                    "⛓️ Obedience (服从度)": { value: 20, max: 100, color: "#64748b" },
                    "💰 Lust (堕落度)": { value: 5, max: 100, color: "#a855f7" }
                }
            },
            {
                id: 3,
                name: "鸭田志穂",
                tag: "冷酷的孤高歌姬",
                image: "https://i.postimg.cc/PJ3hH5zq/ya-tian-zhi-sui-wu-tai-ge-chang.png",
                memories: {
                    sfw: [
                        { url: "https://i.postimg.cc/PJ3hH5zq/ya-tian-zhi-sui-wu-tai-ge-chang.png", title: "深蓝色咏叹调" },
                        { url: "https://i.postimg.cc/T17Gx3q3/ya-tian-zhi-sui-wu-tai-ge-chang2.png", title: "高一级的拟声唱法" },
                        { url: "https://i.postimg.cc/prGxvLYy/ya-tian-zhi-sui-wu-tai-ge-chang3.png", title: "传达到了吗？" },
                        { url: "https://i.postimg.cc/cC9ZWLM1/ya-tian-zhi-sui-du-gao.png", title: "排练的陷阱" },
                        { url: "https://i.postimg.cc/4yLZGxbd/ya-tian-zhi-sui-du-gao-xian-qi.png", title: "这写的什么啊？" }
                    ],
                    nsfw: [
                        { url: "https://i.postimg.cc/Wz2p1Zkj/ya-tian-zhi-sui-chuan-jiao-shi.png", title: "看着我……别移开视线" },
                        { url: "https://i.postimg.cc/ZRPKmHC5/ya-tian-zhi-sui-ce-ru.png", title: "星坠之夜的交融" },
                        { url: "https://i.postimg.cc/VvYsktCr/ya-tian-zhi-sui-kou-jiao.png", title: "灯影里轻柔的侍奉" },
                        { url: "https://i.postimg.cc/QCXNd7Tk/ya-tian-zhi-sui-nu-shang-wei.png", title: "别……别乱动啊" }
                    ]
                },
                basic: {
                    "🎓 职业": "高中二年级学生",
                    "🎂 年龄": "16岁",
                    "📏 身高/体型": "162cm / 娇小干瘦",
                    "👙 罩杯": "贫乳 (A罩杯)",
                    "🎨 外观特征": "苍白肤色，水蓝色及腰长直发，宝石蓝瞳",
                    "✨ 特殊特征": "眼神常年冰冷，身形单薄",
                    "🏠 家庭与背景": "父母离异，极度疼爱的弟弟因车祸离世。独自居住在廉价公寓，极度节俭。将唱歌视为延续弟弟生命与证明存在的唯一方式。"
                },
                psychology: {
                    "🧠 MBTI": "INTJ (冷酷理性/效率至上)",
                    "🎭 性格底色": "表面冷漠封闭，抗拒社交，主色调是唱歌至上",
                    "💦 衍生行为": "看到身材丰满的偶像时会紧咬嘴唇，加大声乐训练强度来发泄"
                },
                privacy: {
                    "🌱 阴毛状态": "自然蔓延型 (顺着大腿内侧自然生长)",
                    "🍒 乳头细节": "小乳头型 (尺寸很小，扁平或微突)",
                    "🌸 小穴外观": "一线天型 (阴唇紧闭，缝隙极细几乎不可见)",
                    "🍑 菊花外观": "紧致型 (开口很小，皮肤绷得很紧)"
                },
                traits: {
                    "✨ 特质A【孤高歌姬】": "极致的声乐天赋。Vocal成长速度提升200%；但极度抵触唱歌以外工作，Visual与Dance白通告失败率增加20%。",
                    "💢 特质B【唯一执念】": "若连续3个通告未安排Vocal相关工作，Stress增加30点；强制接取非Vocal的黑通告时，Stress增加量翻倍。"
                },
                stats: {
                    "🎤 Vocal (唱功)": { value: 96, max: 100, desc: "S级 - 传说级，具有穿透灵魂的爆发力", color: "#ec4899" },
                    "💃 Dance (舞蹈)": { value: 65, max: 100, desc: "B级 - 实力派，基础扎实但缺乏情感表现", color: "#8b5cf6" },
                    "🌟 Visual (视觉)": { value: 70, max: 100, desc: "B级 - 实力派，五官精致但常年面无表情，气质清冷", color: "#eab308" }
                },
                status: {
                    "💢 Stress (压力值)": { value: 50, max: 100, color: "#ef4444" },
                    "❤️ Affection (羁绊)": { value: 20, max: 100, color: "#f43f5e" },
                    "⛓️ Obedience (服从度)": { value: 40, max: 100, color: "#64748b" },
                    "💰 Lust (堕落度)": { value: 0, max: 100, color: "#a855f7" }
                }
            },
    {
    "id": 4,
    "name": "益田春子",
    "tag": "迷途的温柔乡",
    "image": "https://i.postimg.cc/hPgnBLnc/yi-tian-chun-zi-ou-xiang-wu-tai.png",
    "memories": {
        "sfw": [
            { "url": "https://i.postimg.cc/3xBVF253/yi-tian-chun-zi-zuo-zai-sha-fa.png", "title": "追忆的窗边" },
            { "url": "https://i.postimg.cc/8cz935h2/yi-tian-chun-zi-he-fu-pin-cha.png", "title": "春凪の茶歇" },
            { "url": "https://i.postimg.cc/Kj8wVznp/yi-tian-chun-zi-he-xiao-hai-zi.png", "title": "慈愛の箱庭" },
            { "url": "https://i.postimg.cc/T13FSwrZ/yi-tian-chun-zi-na-zhe-ka-fei.png", "title": "微苦的清晨" },
            { "url": "https://i.postimg.cc/44FXGkmW/yi-tian-chun-zi-chu-fang-liao-li.png", "title": "日常的香辛料" },
            { "url": "https://i.postimg.cc/hPrBPX4j/yi-tian-chun-zi-wei-ni-da-san.png", "title": "突如其来的阵雨" },
            { "url": "https://i.postimg.cc/hPgnBLnc/yi-tian-chun-zi-ou-xiang-wu-tai.png", "title": "永远的首席女主角" },
            { "url": "https://i.postimg.cc/vHMysryG/yi-tian-chun-zi-gong-yuan-de-zhang-yi.png", "title": "夜风中的片刻" },
            { "url": "https://i.postimg.cc/wvkzv720/yi-tian-chun-zi-fen-si-jian-mian-hui.png", "title": "粉丝见面会" },
            { "url": "https://i.postimg.cc/yNYtPvyp/yi-tian-chun-zi-he-cha.png", "title": "贵妇人的嗜好" },
            { "url": "https://i.postimg.cc/ZqK2cVxf/yi-tian-chun-zi-wu-dao-fu.png", "title": "带着热度的间歇" }
        ],
        "nsfw": [
            { "url": "https://i.postimg.cc/qBZprVzj/yi-tian-chun-zi-chuan-jiao-shi.png", "title": "魔力临界·深渊之底" },
            { "url": "https://i.postimg.cc/BZwJ39XN/yi-tian-chun-zi-hou-ru.png", "title": "夜暗的回眸" },
            { "url": "https://i.postimg.cc/sf03zdvm/yi-tian-chun-zi-bu-ru.png", "title": "温暖的包容" },
            { "url": "https://i.postimg.cc/5N1JVBJx/yi-tian-chun-zi-chuan-jiao-shi-nei-she.png", "title": "灵魂交融的深层" }
        ]
    },
    "basic": {
        "🎓 职业": "无业",
        "🎂 年龄": "21岁",
        "📏 身高/体型": "168cm / 丰满肉感",
        "👙 罩杯": "巨乳 (G罩杯)",
        "🎨 外观特征": "白皙肤色，墨紫色及腰长直发（发尾微卷），温和深紫色瞳孔",
        "✨ 特殊特征": "永远挂着温和从容的微笑，眼角轻微下垂，极度缺乏方向感",
        "🏠 家庭与背景": "地方城市普通中产家庭，父母关系和睦。短大毕业后靠打工积蓄生活，坚信会在演艺圈遇到命运之人。面试迷路时被制作人捡到"
    },
    "psychology": {
        "🧠 MBTI": "ISFJ (温和守卫者)",
        "🎭 性格底色": "极致的温和与包容，几乎不会生气。随遇而安的天然，将一切视为命运的安排",
        "💦 衍生行为": "迷路时不会惊慌求助，而是找个地方坐下喝茶，等制作人来找她"
    },
    "privacy": {
        "🌱 阴毛状态": "茂盛型 (修剪整齐，呈现倒三角形)",
        "🍒 乳头细节": "熟女型 (颜色偏深粉，乳晕面积较大，乳头挺拔)",
        "🌸 小穴外观": "丰满型 (阴阜脂肪丰厚，大阴唇饱满将内部完全包裹)",
        "🍑 菊花外观": "柔软型 (周围肤色略深，肉感十足)"
    },
    "traits": {
        "✨ 特质A【方向剥夺】": "Dance成长速度降低50%；但Visual通告中Fame获取倍率增加30%。",
        "🌱 特质B【母性包容】": "初始Obedience极高。安排高压力或黑通告时，Stress增加量固定减半。"
    },
    "stats": {
        "🎤 Vocal (唱功)": { value: 65, max: 100, desc: "B级 - 实力派，声音温柔治愈，气息平稳", color: "#ec4899" },
        "💃 Dance (舞蹈)": { value: 20, max: 100, desc: "E级 - 纯路人，毫无空间感，经常撞到队友", color: "#8b5cf6" },
        "🌟 Visual (视觉)": { value: 85, max: 100, desc: "A级 - 业界顶流，成熟女性的极致肉体魅力与温婉气质", color: "#eab308" }
    },
    "status": {
        "💢 Stress (压力值)": { value: 0, max: 100, color: "#ef4444" },
        "❤️ Affection (羁绊)": { value: 60, max: 100, color: "#f43f5e" },
        "⛓️ Obedience (服从度)": { value: 80, max: 100, color: "#64748b" },
        "💰 Lust (堕落度)": { value: 15, max: 100, color: "#a855f7" }
    }
},
    {
    "id": 5,
    "name": "本东姬乃",
    "tag": "脱离常识的银色王女",
    "image": "https://i.postimg.cc/zf67gjtC/ben-dong-ji-nai-yao-wang-ye-kong.png",
    "memories": {
        "sfw": [
            { "url": "https://i.postimg.cc/9MscHKpQ/ben-dong-ji-nai-wu-tai.png", "title": "星轨的交汇" },
            { "url": "https://i.postimg.cc/ZRXJz2cn/ben-dong-ji-nai-chi-la-mian.png", "title": "深夜的豚骨汤底" },
            { "url": "https://i.postimg.cc/j5BRYmXC/ben-dong-ji-nai-shou-huo-ji.png", "title": "售货机旁" },
            { "url": "https://i.postimg.cc/zf67gjtC/ben-dong-ji-nai-yao-wang-ye-kong.png", "title": "遥望故乡之夜" },
            { "url": "https://i.postimg.cc/5tTgC37S/ben-dong-ji-nai-zhe-shi-zui-gao-ji-mi.png", "title": "这是最高秘密" }
        ],
        "nsfw": [
            { "url": "https://i.postimg.cc/FK8pLZWb/ben-dong-ji-nai-zhan-shi-xiao-xue.png", "title": "通往根源的邀请函" },
            { "url": "https://i.postimg.cc/VNpgCRGS/ben-dong-ji-nai-chuan-jiao-shi.png", "title": "魔力融解·临界点" },
            { "url": "https://i.postimg.cc/FK8pLZWY/ben-dong-ji-nai-hou-ru2.png", "title": "背对背的背德" },
            { "url": "https://i.postimg.cc/SK3dMrTC/ben-dong-ji-nai-kou-jiao.png", "title": "对魔棒的亲吻" }
        ]
    },
    "basic": {
        "🎓 职业": "来历不明的少女",
        "🎂 年龄": "18岁",
        "📏 身高/体型": "169cm / 高挑丰满",
        "👙 罩杯": "巨乳 (F罩杯)",
        "🎨 外观特征": "苍白肤色，银白及腰长直发(常戴深色天鹅绒发箍)，幽深紫瞳",
        "✨ 特殊特征": "说话使用古典敬语，举止端庄严谨，经常长时间注视夜空",
        "🏠 家庭与背景": "背景完全空白。不携带现金，缺乏现代常识。自称背负着“寻找某种事物”的使命。"
    },
    "psychology": {
        "🧠 MBTI": "INFJ (提倡者/静谧的神秘)",
        "🎭 性格底色": "严谨的古典教养与不可侵犯的高贵，主色调是认真且浑然天成的电波逻辑",
        "💦 衍生行为": "被问及身世、来历或某些常识盲区时，会用食指抵住嘴唇，说出“这是最高秘密”"
    },
    "privacy": {
        "🌱 阴毛状态": "稀疏型 (呈现淡淡的银色，范围极小)",
        "🍒 乳头细节": "小乳头型 (颜色极浅，形状小巧)",
        "🌸 小穴外观": "紧闭型 (阴唇严丝合缝，呈现浅粉色)",
        "🍑 菊花外观": "紧致型 (周围皮肤光滑无褶皱)"
    },
    "traits": {
        "✨ 特质A【银色王女】": "具备强烈神秘感。Visual白通告Fame获取翻倍；拒绝黑通告，强制安排时直接失败且Affection大幅下降。",
        "🍜 特质B【无底胃袋】": "每次结算固定扣除Funds用于餐饮；带她去拉面店进食能瞬间清空Stress。",
    },
    "stats": {
        "🎤 Vocal (唱功)": { "value": 70, "max": 100, "desc": "B级 - 实力派，音色空灵清冷，具备极高的辨识度", "color": "#ec4899" },
        "💃 Dance (舞蹈)": { "value": 50, "max": 100, "desc": "C级 - 职业及格线，动作优雅端庄，但缺乏流行舞爆发力", "color": "#8b5cf6" },
        "🌟 Visual (视觉)": { "value": 92, "max": 100, "desc": "A级 - 业界顶流，无可挑剔的神秘气质与完美容貌", "color": "#eab308" }
    },
    "status": {
        "💢 Stress (压力值)": { "value": 0, "max": 100, "color": "#ef4444" },
        "❤️ Affection (羁绊)": { "value": 40, "max": 100, "color": "#f43f5e" },
        "⛓️ Obedience (服从度)": { "value": 40, "max": 100, "color": "#64748b" },
        "💰 Lust (堕落度)": { "value": 0, "max": 100, "color": "#a855f7" }
    }
},
    {
    "id": 6,
    "name": "社奈虹花",
    "tag": "早熟的小观察者",
    "image": "https://i.postimg.cc/WphSstnw/she-nai-hong-hua-shui-shou-ou-xiang-fu.png",
    "memories": {
        "sfw": [
            { "url": "https://i.postimg.cc/c1M0Kg9D/she-nai-hong-hua-tian-bing-qi-lin.png", "title": "盛夏融梦" },
            { "url": "https://i.postimg.cc/Rhc7mQ4L/she-nai-hong-hua-hong-qi-pao.png", "title": "红莲的走廊" },
            { "url": "https://i.postimg.cc/KzjpmWH6/she-nai-hong-hua-sheng-dan-jie.png", "title": "被灯火与雪所祝福的、午夜赠礼" },
            { "url": "https://i.postimg.cc/1tX7yddy/she-nai-hong-hua-xiao-fu.png", "title": "樱花的上学路" },
            { "url": "https://i.postimg.cc/PxJVd7R0/she-nai-hong-hua-si-ku-shui.png", "title": "池畔的小天使" },
            { "url": "https://i.postimg.cc/26y9Ctt8/she-nai-hong-hua-qiu.png", "title": "枫语" },
            { "url": "https://i.postimg.cc/WphSstnw/she-nai-hong-hua-shui-shou-ou-xiang-fu.png", "title": "小水手" },
            { "url": "https://i.postimg.cc/h47fy8SJ/she-nai-hong-hua-ou-xiang-fu1.png", "title": "绽放于星尘的Pink Reverie" },
            { "url": "https://i.postimg.cc/7PTfs1xf/she-nai-hong-hua-ou-xiang-fu3.png", "title": "咏叹" },
            { "url": "https://i.postimg.cc/sfZv6PVW/she-nai-hong-hua-ou-xiang-fu2.png", "title": "把全部的视线、都献给我吧" }
        ],
        "nsfw": [
            { "url": "https://i.postimg.cc/qq8srX4w/she-nai-hong-hua-jiao-tang.png", "title": "琉璃彼岸的誓约" },
            { "url": "https://i.postimg.cc/MHy7wbqg/she-nai-hong-hua-wan-shui-qiang.png", "title": "白浊的水枪之战" },
            { "url": "https://i.postimg.cc/Fztywn56/she-nai-hong-hua-chuan-jiao-shi.png", "title": "纯真的祭坛" },
            { "url": "https://i.postimg.cc/rsWsDTnM/she-nai-hong-hua-kou-jiao.png", "title": "未知の雫" },
            { "url": "https://i.postimg.cc/HnQwm4d4/she-nai-hong-hua-hou-ru1.png", "title": "甜美的献身" }
        ]
    },
    "basic": {
        "🎓 职业": "初中生",
        "🎂 年龄": "14岁",
        "📏 身高/体型": "152cm / 娇小纤细",
        "👙 罩杯": "平胸 (发育中)",
        "🎨 外观特征": "铂金色波浪卷长发，双马尾绳编辫，灰色大眼睛，脸颊上一颗痣",
        "✨ 特殊特征": "看人时歪着头、大眼睛直直盯着，让人招架不住",
        "🏠 家庭与背景": "普通家庭，有父母但很少提起。从小习惯独处，喜欢自己琢磨事情"
    },
    "psychology": {
        "🧠 MBTI": "ISTP (理性观察者/早熟的好奇心)",
        "🎭 性格底色": "表面乖巧安静，内在早熟通透。习惯用那双灰眼睛观察世界，不主动但也不怯场",
        "💦 衍生行为": "对同龄人不感兴趣，觉得幼稚。会用学术的口吻讨论成年人话题，但真遇到时会脸红"
    },
    "privacy": {
        "🌱 阴毛状态": "白虎型 (无毛，光滑洁净)",
        "🍒 乳头细节": "幼嫩型 (小且敏感，发育中)",
        "🌸 小穴外观": "紧闭型 (处女，颜色浅粉)",
        "🍑 菊花外观": "小巧型 (开口极小)"
    },
    "traits": {
        "✨ 特质A【想长大】": "渴望被当大人对待。被认真征求意见时Affection上升+50%；被敷衍或当小孩时Stress增加+20。",
        "🔍️ 特质B【好奇心驱动】": "对未知事物有探索欲。首次接触新类型通告时，学习速度+30%；但重复练习时耐心-15%。"
    },
    "stats": {
        "🎤 Vocal (唱功)": { value: 50, max: 100, desc: "D级 - 初学阶段，声音干净有潜力，零技巧", color: "#ec4899" },
        "💃 Dance (舞蹈)": { value: 35, max: 100, desc: "E级 - 纯素人，肢体不协调但态度认真", color: "#8b5cf6" },
        "🌟 Visual (视觉)": { value: 75, max: 100, desc: "B级 - 实力派，铂金发灰瞳辨识度极高，盯着人看时有魔力", color: "#eab308" }
    },
    "status": {
        "💢 Stress (压力值)": { value: 10, max: 100, color: "#ef4444" },
        "❤️ Affection (羁绊)": { value: 10, max: 100, color: "#f43f5e" },
        "⛓️ Obedience (服从度)": { value: 40, max: 100, color: "#64748b" },
        "💰 Lust (堕落度)": { value: 5, max: 100, color: "#a855f7" }
    }
}
        ];

