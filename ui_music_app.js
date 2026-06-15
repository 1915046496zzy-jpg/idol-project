(function() {
    // ==========================================
    // 1. 音乐数据库 (Data)
    // 加入了 lrc 字段，哥哥以后可以把网上的LRC格式歌词直接贴进反引号(``)里
    // ==========================================
    const musicData = [
        {
            id: "1993154308",
            title: "マリーゴールド",
            artist: "クルミ",
            cover: "https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg",
            lrc: `
[00:00.00]マリーゴールド - クルミ
[00:15.50]風の強さがちょっと
[00:18.20]心を揺さぶりすぎて
[00:23.10]真面目に見つめた
[00:25.40]君が恋しい
[00:30.20]でんぐり返しの日々
[00:33.00]可哀想なふりをして
[00:37.80]だらけてみたけど
[00:40.10]希望の光は
[00:44.20]目の前でずっと輝いている
[00:49.00]幸せだ
[00:52.50]麦わらの帽子の君が
[00:56.20]揺れたマリーゴールドに似てる
[01:00.00]あれは空がまだ青い夏のこと
[01:07.50]懐かしいと笑えたあの日の恋
            `
        },
        {
            id: "6586114305",
            title: "心が旅立つ時",
            artist: "永田茂",
            cover: "https://i.postimg.cc/QtxVydk8/cover1.jpg",
            lrc: ""
        },
        {
            id: "435166265",
            title: "YUBIKIRI-GENMAN",
            artist: "Mili",
            cover: "https://i.postimg.cc/L6Z4X6jQ/cover2.jpg",
            lrc: ""
        },
        {
            id: "744932",
            title: "アサガオ",
            artist: "舞花",
            cover: "https://i.postimg.cc/zXkPQ1Wj/cover3.jpg",
            lrc: ""
        },
        {
            id: "27580521",
            title: "Libertus",
            artist: "Chen-U",
            cover: "https://i.postimg.cc/qR8vKkVy/cover4.jpg",
            lrc: ""
        },
        {
            id: "766287",
            title: "fairy stage",
            artist: "K2 SOUND",
            cover: "https://i.postimg.cc/KYS5n5M4/cover5.jpg",
            lrc: ""
        }
    ];

    // ==========================================
    // 2. 样式 (增加遮罩、音量条、歌词、全局悬浮窗)
    // ==========================================
    const styleId = 'qingzi-music-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            @keyframes vinyl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes bar-bounce { 0% { height: 4px; } 100% { height: 16px; } }

            .music-app-wrapper { width: 100%; height: 100%; background: #ffffff; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; position: relative; overflow: hidden; }

            .music-header { padding: 20px 20px 10px; flex-shrink: 0; }
            .music-header h1 { margin: 0; font-size: 34px; font-weight: 800; color: #1c1c1e; letter-spacing: -0.5px; }

            .music-list-container { flex: 1; overflow-y: auto; padding: 0 20px 100px; }
            .music-list-container::-webkit-scrollbar { display: none; }
            .music-item { display: flex; align-items: center; padding: 12px 10px; border-bottom: 1px solid rgba(60,60,67,0.1); cursor: pointer; transition: background 0.2s; border-radius: 8px; margin: 0 -10px; }
            .music-item:active { background: rgba(0,0,0,0.05); }
            .music-item.active .music-title { color: #fa233b; }
            .music-item-cover { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-right: 15px; }
            .music-item-info { flex: 1; overflow: hidden; }
            .music-title { font-size: 16px; font-weight: 600; color: #1c1c1e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; transition: color 0.2s; }
            .music-artist { font-size: 14px; color: #8e8e93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .music-item-anim { width: 16px; height: 16px; display: none; align-items: flex-end; justify-content: space-between; margin-left: 10px; }
            .music-item.active .music-item-anim { display: flex; }
            .music-item-anim span { width: 3px; background: #fa233b; border-radius: 3px; animation: bar-bounce 1s infinite alternate; }
            .music-item-anim span:nth-child(2) { animation-delay: 0.3s; }
            .music-item-anim span:nth-child(3) { animation-delay: 0.6s; }

            /* 迷你播放器 */
            .music-mini-player { position: absolute; bottom: 20px; left: 20px; right: 20px; height: 64px; background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); display: flex; align-items: center; padding: 0 15px; z-index: 10; cursor: pointer; border: 1px solid rgba(255,255,255,0.5); transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), opacity 0.3s; }
            .music-mini-player.hidden { transform: translateY(100px); opacity: 0; pointer-events: none; }
            .mini-cover { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 10px rgba(0,0,0,0.15); margin-right: 12px; animation: vinyl-spin 8s linear infinite; animation-play-state: paused; }
            .music-mini-player.playing .mini-cover { animation-play-state: running; }
            .mini-info { flex: 1; overflow: hidden; }
            .mini-title { font-size: 15px; font-weight: 600; color: #1c1c1e; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .mini-artist { font-size: 13px; color: #8e8e93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .mini-controls { display: flex; align-items: center; gap: 8px; margin-left: 5px; }
            .btn-music-icon { background: none; border: none; color: #1c1c1e; font-size: 22px; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; }
            .btn-music-icon:active { opacity: 0.5; }

            /* 全屏播放页 */
            .music-full-player { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #ffffff; z-index: 20; display: flex; flex-direction: column; transform: translateY(100%); transition: transform 0.5s cubic-bezier(0.2,0.8,0.2,1); }
            .music-full-player.open { transform: translateY(0); }

            /* 模糊背景 + 强白遮罩解决看不清字的问题 */
            .full-bg { position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; background-size: cover; background-position: center; filter: blur(60px); z-index: 0; transition: background-image 0.5s; pointer-events: none; }
            .full-bg-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.75); z-index: 0; pointer-events: none; }

            .full-content { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; padding: 30px; }
            .full-header { display: flex; justify-content: center; align-items: center; padding-bottom: 10px; position: relative; }
            .full-close-bar { width: 40px; height: 5px; background: rgba(0,0,0,0.2); border-radius: 5px; cursor: pointer; }

            /* 黑胶旋转 */
            .full-cover-container { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; flex-shrink: 0; }
            .full-cover-disc { width: 220px; height: 220px; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; animation: vinyl-spin 12s linear infinite; animation-play-state: paused; }
            .music-full-player.playing .full-cover-disc { animation-play-state: running; }
            .full-cover-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; box-shadow: 0 15px 40px rgba(0,0,0,0.2); border: 6px solid rgba(255,255,255,0.3); }
            .full-cover-hole { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 20px; height: 20px; border-radius: 50%; background: rgba(255,255,255,0.9); box-shadow: 0 0 0 4px rgba(0,0,0,0.08), inset 0 0 4px rgba(0,0,0,0.1); z-index: 2; }

            /* 歌词区域 */
            .lyric-container { flex: 1; overflow: hidden; position: relative; margin-bottom: 20px; mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent); -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent); }
            .lyric-scroll { position: absolute; top: 50%; width: 100%; text-align: center; transition: transform 0.3s ease-out; }
            .lrc-line { font-size: 16px; color: rgba(28,28,30,0.5); font-weight: 600; padding: 8px 0; transition: color 0.3s, transform 0.3s, font-size 0.3s; }
            .lrc-line.active { color: #fa233b; font-size: 20px; font-weight: 800; transform: scale(1.05); }

            .full-info { margin-bottom: 15px; text-align: center; }
            .full-title { font-size: 22px; font-weight: 800; color: #1c1c1e; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .full-artist { font-size: 16px; color: #fa233b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            /* 进度条 */
            .progress-container { margin-bottom: 20px; }
            .progress-bar-wrap { width: 100%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; cursor: pointer; position: relative; }
            .progress-bar-fill { height: 100%; background: #fa233b; border-radius: 3px; width: 0%; pointer-events: none; transition: width 0.1s linear; }
            .progress-bar-wrap:hover .progress-bar-fill { background: #1c1c1e; }
            .progress-time { display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #1c1c1e; font-weight: 600; }

            /* 附加控制：音量与循环 */
            .extra-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 10px; }
            .volume-wrap { display: flex; align-items: center; gap: 8px; color: #1c1c1e; width: 60%; }
            .volume-wrap i { font-size: 18px; }
            .volume-slider { flex: 1; -webkit-appearance: none; height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px; outline: none; }
            .volume-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #1c1c1e; cursor: pointer; }
            .mode-btn { background: none; border: none; color: #1c1c1e; font-size: 20px; cursor: pointer; transition: 0.2s; }
            .mode-btn:active { opacity: 0.5; }

            /* 底部大控制 */
            .full-controls { display: flex; justify-content: center; align-items: center; gap: 40px; margin-bottom: 20px; }
            .full-btn { background: none; border: none; color: #1c1c1e; font-size: 36px; cursor: pointer; transition: transform 0.1s, opacity 0.2s; display: flex; align-items: center; justify-content: center; }
            .full-btn:active { transform: scale(0.9); opacity: 0.7; }
            .full-btn-play { font-size: 50px; }

            /* ========================================= */
            /* 全局悬浮音乐胶囊 (独立于平板) */
            /* ========================================= */
            #qingzi-global-music-widget { position: fixed; top: 20px; right: -200px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border: 1px solid rgba(0,0,0,0.1); border-radius: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex; align-items: center; padding: 6px 15px 6px 6px; z-index: 999990; transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; }
            #qingzi-global-music-widget.show { right: 20px; }
            .gw-cover { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; animation: vinyl-spin 8s linear infinite; animation-play-state: paused; margin-right: 10px; }
            #qingzi-global-music-widget.playing .gw-cover { animation-play-state: running; }
            .gw-info { flex: 1; display: flex; flex-direction: column; justify-content: center; min-width: 80px; margin-right: 10px; }
            .gw-title { font-size: 13px; font-weight: 600; color: #1c1c1e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px; }
            .gw-btn { background: none; border: none; color: #fa233b; font-size: 24px; cursor: pointer; padding: 0; display: flex; align-items: center; }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // 3. 核心状态
    // ==========================================
    let audio = new Audio();
    audio.volume = 0.5;
    let currentIndex = -1;
    let isPlaying = false;
    let lrcData = []; // 解析后的歌词数组 [{time: 秒, text: "歌词"}]

    // 播放模式: 0=列表循环, 1=单曲循环, 2=随机
    let playMode = 0;
    const modeIcons = ['<i class="bi bi-repeat"></i>', '<i class="bi bi-repeat-1"></i>', '<i class="bi bi-shuffle"></i>'];

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // 解析LRC字符串
    function parseLrc(lrcStr) {
        if (!lrcStr || lrcStr.trim() === "") return [];
        const lines = lrcStr.split('\n');
        const result = [];
        const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
        lines.forEach(line => {
            const match = line.match(regex);
            if (match) {
                const m = parseInt(match[1]);
                const s = parseInt(match[2]);
                const ms = parseInt(match[3]);
                const time = m * 60 + s + (ms / (match[3].length === 2 ? 100 : 1000));
                const text = match[4].trim();
                if (text) result.push({ time, text });
            }
        });
        return result;
    }

    // 注入全局悬浮球
    let globalWidget = document.getElementById('qingzi-global-music-widget');
    if (!globalWidget) {
        globalWidget = document.createElement('div');
        globalWidget.id = 'qingzi-global-music-widget';
        globalWidget.innerHTML = `
            <img class="gw-cover" id="gw-cover" src="" alt="">
            <div class="gw-info" id="gw-info">
                <div class="gw-title" id="gw-title">--</div>
            </div>
            <button class="gw-btn" id="gw-btn-play"><i class="bi bi-play-circle-fill"></i></button>
        `;
        // 获取顶级窗口的body注入
        let targetBody = document.body;
        try { targetBody = window.parent.document.body || document.body; } catch(e){}
        targetBody.appendChild(globalWidget);
    }

    // ==========================================
    // 4. 渲染函数
    // ==========================================
    window.renderMusicApp = function(container) {
        container.innerHTML = `
            <div class="music-app-wrapper">
                <div class="music-header"><h1>音乐</h1></div>
                <div class="music-list-container" id="music-list"></div>

                <!-- 迷你播放器 (增加上一首) -->
                <div class="music-mini-player hidden" id="mini-player">
                    <img class="mini-cover" id="mini-cover" src="" alt="">
                    <div class="mini-info">
                        <div class="mini-title" id="mini-title">未播放</div>
                        <div class="mini-artist" id="mini-artist">--</div>
                    </div>
                    <div class="mini-controls">
                        <button class="btn-music-icon" id="mini-btn-prev"><i class="bi bi-skip-backward-fill"></i></button>
                        <button class="btn-music-icon" id="mini-btn-play" style="font-size:28px;"><i class="bi bi-play-fill"></i></button>
                        <button class="btn-music-icon" id="mini-btn-next"><i class="bi bi-skip-forward-fill"></i></button>
                    </div>
                </div>

                <!-- 全屏播放页 -->
                <div class="music-full-player" id="full-player">
                    <div class="full-bg" id="full-bg"></div>
                    <div class="full-bg-overlay"></div> <!-- 白底遮罩，保证深色字清晰 -->
                    <div class="full-content">
                        <div class="full-header" id="full-close-area">
                            <div class="full-close-bar"></div>
                        </div>
                        <div class="full-cover-container">
                            <div class="full-cover-disc" id="full-disc">
                                <img class="full-cover-img" id="full-cover" src="" alt="">
                                <div class="full-cover-hole"></div>
                            </div>
                        </div>

                        <!-- 歌词区域 -->
                        <div class="lyric-container">
                            <div class="lyric-scroll" id="lyric-scroll"></div>
                        </div>

                        <div class="full-info">
                            <div class="full-title" id="full-title">--</div>
                            <div class="full-artist" id="full-artist">--</div>
                        </div>

                        <!-- 音量与循环控制 -->
                        <div class="extra-controls">
                            <div class="volume-wrap">
                                <i class="bi bi-volume-down-fill"></i>
                                <input type="range" class="volume-slider" id="volume-slider" min="0" max="1" step="0.01" value="0.5">
                                <i class="bi bi-volume-up-fill"></i>
                            </div>
                            <button class="mode-btn" id="mode-btn">${modeIcons[0]}</button>
                        </div>

                        <div class="progress-container">
                            <div class="progress-bar-wrap" id="progress-wrap">
                                <div class="progress-bar-fill" id="progress-fill"></div>
                            </div>
                            <div class="progress-time">
                                <span id="time-current">0:00</span>
                                <span id="time-total">-:--</span>
                            </div>
                        </div>
                        <div class="full-controls">
                            <button class="full-btn" id="full-btn-prev"><i class="bi bi-skip-backward-fill"></i></button>
                            <button class="full-btn full-btn-play" id="full-btn-play"><i class="bi bi-play-circle-fill"></i></button>
                            <button class="full-btn" id="full-btn-next"><i class="bi bi-skip-forward-fill"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // ==========================================
        // 5. DOM 绑定
        // ==========================================
        const listContainer = container.querySelector('#music-list');
        const miniPlayer = container.querySelector('#mini-player');
        const fullPlayer = container.querySelector('#full-player');

        const miniCover = container.querySelector('#mini-cover');
        const miniTitle = container.querySelector('#mini-title');
        const miniArtist = container.querySelector('#mini-artist');
        const miniBtnPrev = container.querySelector('#mini-btn-prev');
        const miniBtnPlay = container.querySelector('#mini-btn-play');
        const miniBtnNext = container.querySelector('#mini-btn-next');

        const fullBg = container.querySelector('#full-bg');
        const fullCover = container.querySelector('#full-cover');
        const fullTitle = container.querySelector('#full-title');
        const fullArtist = container.querySelector('#full-artist');
        const fullBtnPlay = container.querySelector('#full-btn-play');
        const fullBtnPrev = container.querySelector('#full-btn-prev');
        const fullBtnNext = container.querySelector('#full-btn-next');
        const fullCloseArea = container.querySelector('#full-close-area');

        const progressWrap = container.querySelector('#progress-wrap');
        const progressFill = container.querySelector('#progress-fill');
        const timeCurrent = container.querySelector('#time-current');
        const timeTotal = container.querySelector('#time-total');

        const lyricScroll = container.querySelector('#lyric-scroll');
        const volumeSlider = container.querySelector('#volume-slider');
        const modeBtn = container.querySelector('#mode-btn');

        // 全局悬浮球内部元素
        const gwCover = document.getElementById('gw-cover');
        const gwTitle = document.getElementById('gw-title');
        const gwBtnPlay = document.getElementById('gw-btn-play');

        // 初始化音量条
        volumeSlider.value = audio.volume;

        // ==========================================
        // 6. 逻辑功能
        // ==========================================
        function renderList() {
            listContainer.innerHTML = '';
            musicData.forEach(function(song, index) {
                const item = document.createElement('div');
                item.className = 'music-item' + (index === currentIndex ? ' active' : '');
                item.innerHTML =
                    '<img class="music-item-cover" src="' + song.cover + '" alt="">' +
                    '<div class="music-item-info">' +
                        '<div class="music-title">' + song.title + '</div>' +
                        '<div class="music-artist">' + song.artist + '</div>' +
                    '</div>' +
                    '<div class="music-item-anim"><span></span><span></span><span></span></div>';
                item.onclick = function() { playSong(index); };
                listContainer.appendChild(item);
            });
        }

        function playSong(index) {
            if (index < 0 || index >= musicData.length) return;
            var song = musicData[index];

            if (currentIndex !== index) {
                currentIndex = index;
                audio.src = 'https://music.163.com/song/media/outer/url?id=' + song.id + '.mp3';

                // 更新信息
                miniTitle.innerText = song.title; miniArtist.innerText = song.artist; miniCover.src = song.cover;
                fullTitle.innerText = song.title; fullArtist.innerText = song.artist; fullCover.src = song.cover;
                fullBg.style.backgroundImage = 'url(' + song.cover + ')';
                gwTitle.innerText = song.title; gwCover.src = song.cover;

                miniPlayer.classList.remove('hidden');
                renderList();

                // 解析渲染歌词
                lrcData = parseLrc(song.lrc);
                lyricScroll.innerHTML = '';
                lyricScroll.style.transform = 'translateY(0px)';
                if (lrcData.length > 0) {
                    lrcData.forEach((lrc, i) => {
                        const p = document.createElement('div');
                        p.className = 'lrc-line';
                        p.innerText = lrc.text;
                        p.id = 'lrc-' + i;
                        lyricScroll.appendChild(p);
                    });
                } else {
                    lyricScroll.innerHTML = '<div class="lrc-line active">暂无滚动歌词</div>';
                }
            }

            audio.play().then(function() {
                isPlaying = true;
                updatePlayState();
            }).catch(function(e) {
                console.error("播放失败:", e);
                isPlaying = false;
                updatePlayState();
            });
        }

        function togglePlay() {
            if (currentIndex === -1) { playSong(0); return; }
            if (isPlaying) { audio.pause(); isPlaying = false; }
            else { audio.play(); isPlaying = true; }
            updatePlayState();
        }

        function prevSong() {
            if (playMode === 2) { playRandom(); return; }
            var idx = currentIndex - 1;
            if (idx < 0) idx = musicData.length - 1;
            playSong(idx);
        }

        function nextSong() {
            if (playMode === 2) { playRandom(); return; }
            var idx = currentIndex + 1;
            if (idx >= musicData.length) idx = 0;
            playSong(idx);
        }

        function playRandom() {
            let idx = Math.floor(Math.random() * musicData.length);
            if (idx === currentIndex && musicData.length > 1) {
                idx = (idx + 1) % musicData.length; // 避免随机到同一首
            }
            playSong(idx);
        }

        // 切换循环模式
        function toggleMode() {
            playMode = (playMode + 1) % 3;
            modeBtn.innerHTML = modeIcons[playMode];
        }

        function updatePlayState() {
            var playIcon = isPlaying ? '<i class="bi bi-pause-fill"></i>' : '<i class="bi bi-play-fill"></i>';
            var fullPlayIcon = isPlaying ? '<i class="bi bi-pause-circle-fill"></i>' : '<i class="bi bi-play-circle-fill"></i>';
            var gwPlayIcon = isPlaying ? '<i class="bi bi-pause-circle-fill"></i>' : '<i class="bi bi-play-circle-fill"></i>';

            miniBtnPlay.innerHTML = playIcon;
            fullBtnPlay.innerHTML = fullPlayIcon;
            gwBtnPlay.innerHTML = gwPlayIcon;

            if (isPlaying) {
                miniPlayer.classList.add('playing');
                fullPlayer.classList.add('playing');
                globalWidget.classList.add('playing');
            } else {
                miniPlayer.classList.remove('playing');
                fullPlayer.classList.remove('playing');
                globalWidget.classList.remove('playing');
            }

            checkGlobalWidget();
        }

        // 检查全局悬浮窗显示逻辑：有歌曲记录 且 平板不可见时显示
        function checkGlobalWidget() {
            const padWrapper = document.getElementById('qingzi-pad-wrapper');
            let isPadOpen = false;
            if (padWrapper && padWrapper.classList.contains('active')) isPadOpen = true;

            if (currentIndex !== -1 && !isPadOpen) {
                globalWidget.classList.add('show');
            } else {
                globalWidget.classList.remove('show');
            }
        }
        // 定时检查平板状态（处理拖拽或外部关闭导致的变化）
        setInterval(checkGlobalWidget, 500);

        // ==========================================
        // 7. 事件绑定
        // ==========================================
        renderList();

        miniBtnPrev.onclick = function(e) { e.stopPropagation(); prevSong(); };
        miniBtnPlay.onclick = function(e) { e.stopPropagation(); togglePlay(); };
        miniBtnNext.onclick = function(e) { e.stopPropagation(); nextSong(); };
        miniPlayer.onclick = function() { fullPlayer.classList.add('open'); };

        fullCloseArea.onclick = function() { fullPlayer.classList.remove('open'); };
        fullBtnPlay.onclick = function() { togglePlay(); };
        fullBtnPrev.onclick = function() { prevSong(); };
        fullBtnNext.onclick = function() { nextSong(); };

        modeBtn.onclick = function() { toggleMode(); };

        // 音量滑块
        volumeSlider.oninput = function(e) {
            audio.volume = e.target.value;
        };

        // 全局悬浮窗控制
        gwBtnPlay.onclick = function(e) { e.stopPropagation(); togglePlay(); };
        globalWidget.onclick = function() {
            // 尝试唤起平板并打开音乐APP
            let topWin = window;
            try { topWin = window.parent || window; } catch(e){}
            if (topWin.qingziPad) {
                if (!topWin.qingziPad.isOpen) topWin.qingziPad.togglePad();
                topWin.qingziPad.openApp('music');
            }
        };

        // 进度与歌词滚动
        let lastLrcIndex = -1;
        audio.ontimeupdate = function() {
            if (!audio.duration) return;
            var current = audio.currentTime;
            var percent = (current / audio.duration) * 100;
            progressFill.style.width = percent + '%';
            timeCurrent.innerText = formatTime(current);
            timeTotal.innerText = formatTime(audio.duration);

            // 歌词滚动逻辑
            if (lrcData.length > 0) {
                let activeIdx = -1;
                for (let i = 0; i < lrcData.length; i++) {
                    if (current >= lrcData[i].time) activeIdx = i;
                    else break;
                }
                if (activeIdx !== -1 && activeIdx !== lastLrcIndex) {
                    const oldActive = lyricScroll.querySelector('.active');
                    if (oldActive) oldActive.classList.remove('active');
                    const newActive = document.getElementById('lrc-' + activeIdx);
                    if (newActive) newActive.classList.add('active');

                    // 计算滚动距离 (保持当前句在中间)
                    const itemHeight = 35; // 预估单行高度
                    const offset = -(activeIdx * itemHeight);
                    lyricScroll.style.transform = 'translateY(' + offset + 'px)';
                    lastLrcIndex = activeIdx;
                }
            }
        };

        progressWrap.onclick = function(e) {
            if (!audio.duration) return;
            var rect = progressWrap.getBoundingClientRect();
            var clickX = e.clientX - rect.left;
            var percent = clickX / rect.width;
            audio.currentTime = percent * audio.duration;
            lastLrcIndex = -1; // 拖动进度后重置歌词索引
        };

        // 歌曲结束处理
        audio.onended = function() {
            if (playMode === 1) {
                // 单曲循环
                audio.currentTime = 0;
                audio.play();
            } else {
                nextSong();
            }
        };

        // 恢复状态（如果是热重载）
        if (currentIndex !== -1) {
            miniPlayer.classList.remove('hidden');
            updatePlayState();
        }
    };
})();
