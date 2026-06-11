// 全局图床资源映射表
var AssetsMap = {
    // ================= 【立绘与头像】 =================
    "浅宫加爱_立绘": "https://i.postimg.cc/MGf2Z4Bp/qian-gong-jia-ai.png",
    "芦田希未_立绘": "https://i.postimg.cc/63ZtXc2K/lu-tian-xi-wei.png",
    "鸭田志穂_立绘": "https://i.postimg.cc/PJ3hH5zq/ya-tian-zhi-sui-wu-tai-ge-chang.png",
    "益田春子_立绘": "https://i.postimg.cc/hPgnBLnc/yi-tian-chun-zi-ou-xiang-wu-tai.png",
    "本东姬乃_立绘": "https://i.postimg.cc/zf67gjtC/ben-dong-ji-nai-yao-wang-ye-kong.png",
    "社奈虹花_立绘": "https://i.postimg.cc/WphSstnw/she-nai-hong-hua-shui-shou-ou-xiang-fu.png",

    // ================= 【表情包区】 =================
    "本东姬奈_表情_吃饭啦": "https://i.postimg.cc/6q3ScV46/ben-dong-ji-nai-biao-qing-chi-fan-la.png",
    "本东姬奈_表情_我爱拉面": "https://i.postimg.cc/7h6c91JH/ben-dong-ji-nai-biao-qing-wo-ai-la-mian.png",
    "浅宫加爱_表情_嗨嗨": "https://i.postimg.cc/NFMVD82F/qian-gong-jia-ai-biao-qing-hai-hai.png",
    "浅宫加爱_表情_谢谢你": "https://i.postimg.cc/HnxKz08j/qian-gong-jia-ai-biao-qing-xie-xie-ni.png",
    "益田春子_表情_呵呵": "https://i.postimg.cc/4yS0SKpH/yi-tian-chun-zi-biao-qing-he-he.png",
    "益田春子_表情_太棒啦": "https://i.postimg.cc/j2F1FWy7/yi-tian-chun-zi-biao-qing-tai-bang-la.png",
    "社奈虹花_表情_晚安": "https://i.postimg.cc/fyrPr3YZ/she-nai-hong-hua-biao-qing-wan-an.png",
    "社奈虹花_表情_真的可以吗": "https://i.postimg.cc/1XjdjgD9/she-nai-hong-hua-biao-qing-zhen-de-ke-yi-ma.png",
    "芦田希未_表情_一起嗨吧": "https://i.postimg.cc/MHT450fG/lu-tian-xi-wei-biao-qing-yi-qi-hai-ba.png",
    "芦田希未_表情_爱你们哟": "https://i.postimg.cc/yxd5jh38/lu-tian-xi-wei-biao-qing-ai-ni-men-you.png",
    "鸭田志穂_表情_哼": "https://i.postimg.cc/T14s4ynw/ya-tian-zhi-sui-biao-qing-heng.png",
    "鸭田志穂_表情_抱歉啦": "https://i.postimg.cc/PJR7RL1q/ya-tian-zhi-sui-biao-qing-bao-qian-la.png",

    // ================= 【剧情插图与CG】 =================
    "浅宫加爱_SFW_偶像服": "https://i.postimg.cc/MGf2Z4Bp/qian-gong-jia-ai.png",
    "浅宫加爱_NSFW_传教士体位": "https://i.postimg.cc/rmmmB3xb/qian-gong-jia-ai-chuan-jiao-shi-ti-wei.png",
    "芦田希未_SFW_偶像服": "https://i.postimg.cc/63ZtXc2K/lu-tian-xi-wei.png",
    "芦田希未_NSFW_后入": "https://i.postimg.cc/pr0cr96c/lu-tian-xi-wei-hou-ru.png",

    // ================= 【场景与大地图】 =================
    "场景_世界地图": "https://i.postimg.cc/02gmvkZy/da-de-tu.png",
    "地名_北海道札幌市": "https://i.postimg.cc/05KmhMGz/bei-hai-dao-zha-huang-shi.png",
    "地名_东京都世田谷区": "https://i.postimg.cc/0yPw6VT2/dong-jing-dou-shi-tian-gu-qu.png",
    "地名_东京都中央区": "https://i.postimg.cc/pLCnKDv9/dong-jing-dou-zhong-yang-qu.png",
    "地名_东京都丰岛区": "https://i.postimg.cc/DyVshv51/dong-jing-dou-feng-dao-qu.png",
    "地名_东京都千代田区": "https://i.postimg.cc/Qxp7x2yX/dong-jing-dou-qian-dai-tian-qu2.png",
    "地名_东京都台东区": "https://i.postimg.cc/T3fDytz5/dong-jing-dou-tai-dong-qu.png",
    "地名_东京都品川区": "https://i.postimg.cc/PrmDrgFF/dong-jing-dou-pin-chuan-qu.png",
    "地名_东京都新宿区": "https://i.postimg.cc/kgqbVT0x/dong-jing-dou-xin-su-qu.png",
    "地名_东京都江东区": "https://i.postimg.cc/sDFSzjKw/dong-jing-dou-jiang-dong-qu.png",
    "地名_东京都涩谷区": "https://i.postimg.cc/kgqbVT09/dong-jing-dou-se-gu-qu.png",
    "地名_东京都港区": "https://i.postimg.cc/KvXLbGQr/dong-jing-dou-gang-qu.png",
    "地名_东京都练马区": "https://i.postimg.cc/VLyMwf4H/dong-jing-dou-lian-ma-qu.png",
    "地名_京都府京都市": "https://i.postimg.cc/GmKsvkRN/jing-dou-fu-jing-dou-shi.png",
    "地名_冲绳县那霸市": "https://i.postimg.cc/tRnP8ZdJ/chong-sheng-xian-na-ba-shi.png",
    "地名_千叶县千叶市": "https://i.postimg.cc/s22GmvfH/qian-ye-xian-qian-ye-shi.png",
    "地名_埼玉县川越市": "https://i.postimg.cc/bvvSgsYC/qi-yu-xian-chuan-yue-shi.png",
    "地名_大阪府大阪市": "https://i.postimg.cc/ZYv3XBPC/da-ban-fu-da-ban-shi.png",
    "地名_神奈川县横滨市": "https://i.postimg.cc/GppTKH3Z/shen-nai-chuan-xian-heng-bin-shi.png",
    "地名_福冈县中洲": "https://i.postimg.cc/SxdzcW46/fu-gang-xian-zhong-zhou.png",

    // ================= 【场景】 =================
    "事务所_一零三零制作": "https://i.postimg.cc/TwL9kkYX/yi-ling-san-ling-zhi-zuo.png",
    "事务所_微梦制作": "https://i.postimg.cc/NM94NNGn/wei-meng-zhi-zuo.png",
    "事务所_白之光演艺": "https://i.postimg.cc/xCJRssjs/bai-zhi-guang-yan-yi.png",
    "事务所_野猫演艺": "https://i.postimg.cc/MTMDssZg/ye-mao-yan-yi.png",
    "事务所_铃兰制作": "https://i.postimg.cc/50Y3PP9s/ling-lan-zhi-zuo.png",
    "事务所_飞鸟旧社": "https://i.postimg.cc/Ss2rZZQT/fei-niao-jiu-she.png",
    "北海道_温泉旅馆": "https://i.postimg.cc/dtT7F04P/bei-hai-dao-zha-huang-shi-wen-quan-lu-guan.png"
};
