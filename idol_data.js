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

// 全局地图与场景数据库
var mapDatabase = {
    "东京地区": [
        {
            name: "东京都港区",
            coord: { top: "72%", left: "57%" },
            emoji: "🗼",
            desc: "繁华的核心地带，商业与娱乐的交汇处，也是众多大型企划的诞生地。",
            scenes: [
                { name: "一零三零制作", emoji: "🏢", desc: "业界最大综合事务所大楼，一切梦开始的地方。核心理念是“大家像家人一样共同进步”。" },
                { name: "微梦制作", emoji: "🎠", desc: "1030制作下属特设区域，U15低龄特化厂牌。主打纯粹的陪伴与治愈。" },
                { name: "偶像服陈列室", emoji: "👘", desc: "东京都港区，收藏着历代偶像打歌服与珍贵演出装备的陈列室。" },
                { name: "购物中心", emoji: "🛒", desc: "东京都港区，大型综合购物中心，粉丝与偶像约会的热门地点。" },
                { name: "医院", emoji: "🏥", desc: "东京都港区的综合医院，24小时急诊对应，周边居民的首选。" },
                { name: "小学", emoji: "🏫", desc: "东京都港区的公立小学，放学时分充满孩子们的欢声笑语。" }
            ]
        },
        {
            name: "东京都涩谷区",
            coord: { top: "54%", left: "20%" },
            emoji: "🛍️",
            desc: "时尚与潮流的中心，随处可见星探与怀揣梦想的年轻人。",
            scenes: [
                { name: "白之光演艺", emoji: "✨", desc: "位于表参道高奢区。顶尖艺术与高雅路线，绝不迎合下沉市场。" },
                { name: "可丽饼店", emoji: "🥞", desc: "涩谷区的可丽饼店，学生放学后最爱逛的甜品小店，原宿竹下通必打卡。" },
                { name: "唱片店", emoji: "💿", desc: "涩谷区的老字号唱片店，淘碟爱好者的天堂，从古典到摇滚货架上塞满时间的痕迹。" },
                { name: "魔镜号", emoji: "🪞", desc: "涩谷区的神秘地标，因独特的外墙设计成为路人驻足拍照的网红打卡点。" }
            ]
        },
        {
            name: "东京都新宿区",
            coord: { top: "33%", left: "32%" },
            emoji: "🌃",
            desc: "光怪陆离的不夜城，表面的繁华下隐藏着无数灰色交易。",
            scenes: [
                { name: "铃兰制作", emoji: "🥀", desc: "位于西新宿外表光鲜的高级写字楼。公众形象纯洁无瑕，私下却极度黑暗。" }
            ]
        },
        {
            name: "东京都台东区",
            coord: { top: "18%", left: "68%" },
            emoji: "⛩️",
            desc: "充满昭和风情的老街区，保留着时代的眼泪与人情味。",
            scenes: [
                { name: "飞鸟旧社", emoji: "📻", desc: "破旧的昭和风老楼。曾经的老牌霸主，如今资金链濒临断裂，设施陈旧。" }
            ]
        },
        { 
            name: "东京都千代田区", 
            coord: { top: "42%", left: "54%" }, 
            emoji: "🏯", 
            desc: "政治与文化的中心区域，治安极佳。", 
            scenes: [
                { name: "东京巨蛋", emoji: "⚾", desc: "日本最大的室内体育场及演唱会场地，能容纳数万人的热血地标。" },
                { name: "女仆咖啡厅", emoji: "👘", desc: "秋叶原系的代表，店员身着女仆装提供“萌え萌え”特制餐点。" },
                { name: "街机店", emoji: "🎮", desc: "整栋楼的抓娃娃机与音游，也是许多上班族下班后解压的去处。" }
            ] 
        },
        { 
            name: "东京都中央区", 
            coord: { top: "52%", left: "70%" }, 
            emoji: "🏬", 
            desc: "传统的高级商业区。", 
            scenes: [
                { name: "深夜便利店", emoji: "🏪", desc: "24小时亮着灯的城市驿站，深夜加班族与学生党购买夜宵的常见去处。" }
            ] 
        },
        { 
            name: "东京都品川区", 
            coord: { top: "72%", left: "41%" }, 
            emoji: "🚄", 
            desc: "重要的交通枢纽地带。", 
            scenes: [
                { name: "初中", emoji: "📚", desc: "品川区的公立初中，校舍整洁，放学后运动场上总是很热闹。" },
                { name: "新干线站台", emoji: "🚅", desc: "品川站的新干线站台，通往日本各地的起点，人来人往充满匆匆气息。" }
            ] 
        },
        { 
            name: "东京都练马区", 
            coord: { top: "22%", left: "15%" }, 
            emoji: "🏡", 
            desc: "安静的住宅区与动画产业聚集地。", 
            scenes: [
                { name: "高中", emoji: "🎓", desc: "练马区的都立高中，校园内种着樱花树，春天时风景很好。" }
            ] 
        },
        {
            name: "东京都丰岛区",
            coord: { top: "18%", left: "41%" },
            emoji: "🦉",
            desc: "充满次文化气息的繁华地带。",
            scenes: [
                { name: "地下livehouse", emoji: "🎸", desc: "东京都丰岛区的小型地下演出现场，氛围亲密，常有地下偶像在此演出。" }
            ]
        },
        { 
            name: "东京都世田谷区", 
            coord: { top: "75%", left: "14%" }, 
            emoji: "🐈", 
            desc: "高级住宅区，生活节奏缓慢。", 
            scenes: [] 
        },
        { 
            name: "东京都江东区", 
            coord: { top: "68%", left: "84%" }, 
            emoji: "🌊", 
            desc: "临海副都心，常举办大型漫展与活动。", 
            scenes: [
                { name: "水族馆", emoji: "🐠", desc: "临海而建的大型水族馆，拥有巨大的回游槽与梦幻的水母展厅。" }
            ] 
        }
    ],
    "非东京地区": [
        {
            name: "埼玉县川越市",
            emoji: "🍢",
            desc: "保留着小江户风情的城市，充满市井的烟火气。",
            scenes: [
                { name: "野猫演艺", emoji: "🐾", desc: "商店街关东煮店二楼的单间。极度草根，偶像为了生计甚至需要打工。" },
                { name: "24小时家庭餐厅", emoji: "🍽️", desc: "川越市主干道旁的连锁家庭餐厅，座位宽敞，提供全天候的洋食和定食。" }
            ]
        },
        { 
            name: "北海道札幌市", 
            emoji: "❄️", 
            desc: "北国的中心，常年积雪的浪漫之都。", 
            scenes: [
                { name: "温泉旅馆", emoji: "♨️", desc: "坐落于札幌郊外的秘汤，雪景与露天风吕交织。冬日集训后的治愈圣地，蒸腾雾气中藏着无数私下闲聊与真心话。" }
            ] 
        },
        { 
            name: "京都府京都市", 
            emoji: "🍵", 
            desc: "千年古都，随处可见穿着和服的少女。", 
            scenes: [
                { name: "传统茶室", emoji: "🍵", desc: "隐藏在祇园巷弄里的老铺茶室，提供抹茶和和果子，能听见庭院里的流水声。" }
            ] 
        },
        { 
            name: "大阪府大阪市", 
            emoji: "🐙", 
            desc: "热情似火的美食之都。", 
            scenes: [] 
        },
        {
            name: "冲绳县那霸市",
            emoji: "🌺",
            desc: "阳光、沙滩与海浪的南国度假胜地。",
            scenes: [
                { name: "私人海滩", emoji: "🏖️", desc: "冲绳县那霸市专属的幽静沙滩，海浪声中的治愈空间。" }
            ]
        },
        { 
            name: "神奈川县横滨市", 
            emoji: "🎡", 
            desc: "充满异国风情的港口城市。", 
            scenes: [
                { name: "豪华游轮甲板", emoji: "🛳️", desc: "停靠在横滨港的大型观光游轮，甲板上可以眺望整个港未来的夜景。" }
            ] 
        },
        { 
            name: "千叶县千叶市", 
            emoji: "🎢", 
            desc: "拥有大型主题乐园的欢乐之城。", 
            scenes: [] 
        },
        { 
            name: "福冈县中洲", 
            emoji: "🍜", 
            desc: "九州的繁华夜街，屋台文化盛行。",
            scenes: [
                { name: "拉面店", emoji: "🍜", desc: "中洲屋台街的招牌拉面店，豚骨汤底熬得浓郁发白，深夜仍座无虚席。" }
            ] 
        }
    ]
};


var idolDatabase = [
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
                    "💃 Dance (舞蹈)": { value: 15, max: 100, desc: "E级 - 纯路人，肢体极度不协调，经常顺拐", color: "#8b5cf6" },
                    "🌟 Visual (视觉)": { value: 65, max: 100, desc: "B级 - 实力派，极具感染力的小太阳笑容，镜头亲和力高", color: "#eab308" }
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
                        { url: "https://i.postimg.cc/pr0cr96c/lu-tian-xi-wei-hou-ru.png", title: "毫无防备的身后" },
                        { url: "https://i.postimg.cc/nV5zM44t/lu-tian-xi-wei-ru-jiao.png", title: "为你献上最柔软的栖息地" },
                        { url: "https://i.postimg.cc/MZ4TX77S/lu-tian-xi-wei-shi-hou-nei-she.png", title: "此刻，我们结为一体" },
                        { url: "https://i.postimg.cc/L47XhttS/lu-tian-xi-wei-shi-hou2.png", title: "印满爱意的证明" },
                        { url: "https://i.postimg.cc/BbdQy3SH/lu-tian-xi-wei-chuan-jiao-shi.png", title: "连同灵魂一起融化" },
                        { url: "https://i.postimg.cc/BbdQy3Sp/lu-tian-xi-wei-kou-jiao.png", title: "只想将你的一切温柔包裹" },
                        { url: "https://i.postimg.cc/fy6TFsz8/lu-tian-xi-wei-kou-jiao-hou-kou-qiang-jing-ye.png", title: "这是只属于我的甘甜" },
                        { url: "https://i.postimg.cc/qq9MYrJm/lu-tian-xi-wei-kou-jiao-hou-kou-qiang-jing-ye2.png", title: "直到被幸福彻底填满" }
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
                    "🎤 Vocal (唱功)": { value: 70, max: 100, desc: "B级 - 实力派，气息控制极佳但缺乏感情投入", color: "#ec4899" },
                    "💃 Dance (舞蹈)": { value: 65, max: 100, desc: "B级 - 实力派，随意扭动也能精准踩点", color: "#8b5cf6" },
                    "🌟 Visual (视觉)": { value: 75, max: 100, desc: "B级 - 实力派，金发大波浪带来的随性美感极度吸睛", color: "#eab308" }
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
                        { url: "https://i.postimg.cc/Wz2p1Zkj/ya-tian-zhi-sui-chuan-jiao-shi.png", title: "别……别乱动啊" },
                        { url: "https://i.postimg.cc/ZRPKmHC5/ya-tian-zhi-sui-ce-ru.png", title: "星坠之夜的交融" },
                        { url: "https://i.postimg.cc/VvYsktCr/ya-tian-zhi-sui-kou-jiao.png", title: "灯影里轻柔的侍奉" },
                        { url: "https://i.postimg.cc/QCXNd7Tk/ya-tian-zhi-sui-nu-shang-wei.png", title: "今晚、由我来好好疼爱你哦" }
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
                    "🎤 Vocal (唱功)": { value: 85, max: 100, desc: "A级 - 业界顶流，出道即巅峰，具有穿透灵魂的爆发力", color: "#ec4899" },
                    "💃 Dance (舞蹈)": { value: 45, max: 100, desc: "D级 - 勉强能看，将全部精力投入唱歌，舞蹈仅维持最低限度", color: "#8b5cf6" },
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
        "🍜 特质B【无底胃袋】": "每次结算固定扣除Funds用于餐饮；带她去拉面店进食能瞬间清空Stress。"
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
        "🎓 职业": "初中一年级学生",
        "🎂 年龄": "13岁",
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
},
        {
        id: 7,
        name: "镜宫凛",
        tag: "优雅温柔的双面歌姬",
        image: "https://i.postimg.cc/Y00kTYJ9/jing-gong-lin-ou-xiang-fu.jpg",
        memories: {
            sfw: [
                { url: "https://i.postimg.cc/Y00kTYJ9/jing-gong-lin-ou-xiang-fu.jpg", title: "偶像歌手" }
            ],
            nsfw: [
                { url: "https://i.postimg.cc/Y00kTYJ9/jing-gong-lin-ou-xiang-fu.jpg", title: "面具坠落的夜晚" }
            ]
        },
        basic: {
            "🎓 职业": "专业偶像 / 网络小说家",
            "🎂 年龄": "23岁 (生日: 2月5日)",
            "📏 身高/体型": "172cm / 高挑修长，大长腿，腰细臀翘",
            "👙 罩杯": "标准 (C罩杯)",
            "🎨 外观特征": "白皙透光肤色，雪白及腰蓬松长直发，酒红深瞳",
            "✨ 特殊特征": "舞台上温柔完美，私下神秘冷清，从不在人前卸下心防",
            "🏠 家庭与背景": "金融世家独生女，父亲为富豪榜私募基金创始人。母亲因难产去世，家境优渥却选择低调独居"
        },
        psychology: {
            "🧠 MBTI": "INTJ (建筑师型)",
            "🎭 性格底色": "表面温柔友善，实则冷清自持，主色调是戴着面具的完美偶像",
            "💦 衍生行为": "公众场合微笑体贴，私下独处时沉默发呆，将脆弱藏在深夜的创作中"
        },
        privacy: {
            "🌱 阴毛状态": "茂盛型 (浓密黑色倒三角形，自然未修剪)",
            "🍒 乳头细节": "粉嫩色型 (乳晕中等大小，颜色粉嫩)",
            "🌸 小穴外观": "湿润型 (粉色嫩穴，阴唇略显，私密处湿润快)",
            "🍑 菊花外观": "紧致粉嫩型 (未曾开发的紧致粉嫩)"
        },
        traits: {
            "✨ 特质A【双面面具】": "社交能力极强，与所有人保持恰到好处的关系。白通告中与人协作类任务成功率+15%；但私下独处时Stress自然恢复速度+50%。",
            "💔 特质B【生母之殇】": "背负着母亲难产离世的自责。生日前后3天Stress增加50点，且无法通过任何方式降低；若在此期间被温柔对待，Affection增幅翻倍。"
        },
        stats: {
            "🎤 Vocal (唱功)": { value: 82, max: 100, desc: "A级 - 业界顶流，声音温柔且有力量，情感把控精准", color: "#ec4899" },
            "💃 Dance (舞蹈)": { value: 78, max: 100, desc: "B级 - 实力派，高挑身材让舞蹈动作舒展优美，功底扎实", color: "#8b5cf6" },
            "🌟 Visual (视觉)": { value: 88, max: 100, desc: "A级 - 业界顶流，雪白长发与酒红瞳的组合极具辨识度，温柔御姐气场", color: "#eab308" }
        },
        status: {
            "💢 Stress (压力值)": { value: 25, max: 100, color: "#ef4444" },
            "❤️ Affection (羁绊)": { value: 25, max: 100, color: "#f43f5e" },
            "⛓️ Obedience (服从度)": { value: 45, max: 100, color: "#64748b" },
            "💰 Lust (堕落度)": { value: 5, max: 100, color: "#a855f7" }
        }
    },
        {
        id: 8,
        name: "伞瑠华",
        tag: "泪痣的丰满治愈系",
        image: "https://i.postimg.cc/cJ5rC104/san-liu-hua-ou-xiang-fu.png",
        memories: {
            sfw: [
                { url: "https://i.postimg.cc/cJ5rC104/san-liu-hua-ou-xiang-fu.png", title: "和想象中不一样的偶像服" },
                { url: "https://i.postimg.cc/632Tvsp2/san-liu-hua-ou-xiang-fu2.png", title: "今日的拍摄任务" },
                { url: "https://i.postimg.cc/MGrvHZqk/san-liu-hua-ou-xiang-fu-yu-mao.png", title: "小猫，要等我回来哦" }
            ],
            nsfw: [
                { url: "https://i.postimg.cc/Vstdschp/san-liu-hua-ru-jiao.png", title: "没、没想到会被这样使用……" },
                { url: "https://i.postimg.cc/cJJvdtqm/san-liu-hua-hou-ru.png", title: "请不要看那个地方……" },
                { url: "https://i.postimg.cc/GmL2jTmN/san-liu-hua-wu-tai-tiao-dan.png", title: "在台上的话……不行……会坏掉的……" }
            ]
        },
        basic: {
            "🎓 职业": "前宠物医院护士",
            "🎂 年龄": "22岁 (生日: 9月2日)",
            "📏 身高/体型": "165cm / 肉感丰满",
            "👙 罩杯": "巨乳 (G罩杯)",
            "🎨 外观特征": "白皙肤色，浅棕色蓬松及肩波浪卷短发，温暖草绿瞳",
            "✨ 特殊特征": "右眼角有一颗泪痣。习惯性含胸驼背以隐藏丰满胸部。重度猫奴。",
            "🏠 家庭与背景": "地方城市普通家庭，父母经营小超市。为养三只流浪猫在东京租房，靠微薄积蓄生活"
        },
        psychology: {
            "🧠 MBTI": "ISFJ (守卫者)",
            "🎭 性格底色": "极致温柔与讨好型人格，主色调是违背本意的顺从",
            "💦 衍生行为": "被要求穿暴露服装拍摄时，会一边红着脸流泪抱怨“这和说好的不一样啊”，一边乖乖摆出极其色情的姿势"
        },
        privacy: {
            "🌱 阴毛状态": "茂盛型 (未过度修剪，呈现自然的浅棕色)",
            "🍒 乳头细节": "熟女型 (深粉色，乳晕面积较大，乳房具重量感导致轻微下垂)",
            "🌸 小穴外观": "丰满型 (大阴唇肉感十足，完全包裹住内部)",
            "🍑 菊花外观": "柔软型 (周围肤色略深)"
        },
traits: {
    "✨ 特质A【违背本意的性感】": "安排常规Visual白通告时，有50%概率被变更为擦边/性感拍摄。触发时Stress+30，但该次通告获取Fame与Funds翻倍。",
    "🐱 特质B【猫咪治愈法】": "消耗Funds购买高级猫粮或带去猫咖，可极大幅度降低Stress；若连续3次结算未进行与猫相关互动，Stress自然下降失效。"
},
        stats: {
            "🎤 Vocal (唱功)": { value: 55, max: 100, desc: "C级 - 职业及格线，声音温柔软糯但气息偏弱", color: "#ec4899" },
            "💃 Dance (舞蹈)": { value: 40, max: 100, desc: "D级 - 勉强能看，胸部重量严重影响平衡，跳快歌极度吃力", color: "#8b5cf6" },
            "🌟 Visual (视觉)": { value: 88, max: 100, desc: "A级 - 业界顶流，肉体魅力极度诱人，吸引大量男性肉体粉", color: "#eab308" }
        },
        status: {
            "💢 Stress (压力值)": { value: 15, max: 100, color: "#ef4444" },
            "❤️ Affection (羁绊)": { value: 20, max: 100, color: "#f43f5e" },
            "⛓️ Obedience (服从度)": { value: 85, max: 100, color: "#64748b" },
            "💰 Lust (堕落度)": { value: 5, max: 100, color: "#a855f7" }
        }
    }
        ];
