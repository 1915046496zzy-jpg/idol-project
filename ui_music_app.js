(function() {
    // ==========================================
    // 1. 音乐数据库 (Data)
    // ==========================================
    const musicData = [
        {
            id: "1993154308",
            title: "マリーゴールド",
            artist: "クルミ",
            cover: "https://i.postimg.cc/90qC8w8G/ta-qie-shi-guang.jpg"
        },
        {
            id: "6586114305", // 注意：原链接是playlist，如果是歌单ID可能无法播放，需替换为单曲ID
            title: "心が旅立つ時",
            artist: "永田茂",
            cover: "https://i.postimg.cc/QtxVydk8/cover1.jpg"
        },
        {
            id: "435166265",
            title: "YUBIKIRI-GENMAN",
            artist: "Mili",
            cover: "https://i.postimg.cc/L6Z4X6jQ/cover2.jpg"
        },
        {
            id: "744932",
            title: "アサガオ",
            artist: "舞花",
            cover: "https://i.postimg.cc/zXkPQ1Wj/cover3.jpg"
        },
        {
            id: "27580521",
            title: "Libertus",
            artist: "Chen-U",
            cover: "https://i.postimg.cc/qR8vKkVy/cover4.jpg"
        },
        {
            id: "766287",
            title: "fairy stage",
            artist: "K2 SOUND",
            cover: "https://i.postimg.cc/KYS5n5M4/cover5.jpg"
        }
    ];

    // ==========================================
    // 2. 样式定义 (Apple Music Style)
    // ==========================================
    const styleId = 'qingzi-music-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .music-app-wrapper { width: 100%; height: 100%; background: #ffffff; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; position: relative; overflow: hidden; }

            /* 顶部标题区 */
            .music-header { padding: 20px 20px 10px; flex-shrink: 0; }
            .music-header h1 { margin: 0; font-size: 34px; font-weight: 800; color: #1c1c1e; letter-spacing: -0.5px; }

            /* 播放列表区 */
            .music-list-container { flex: 1; overflow-y: auto; padding: 0 20px 100px; }
            .music-list-container::-webkit-scrollbar { display: none; }
            .music-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(60,60,67,0.1); cursor: pointer; transition: background 0.2s; border-radius: 8px; margin: 0 -10px; padding-left: 10px; padding-right: 10px; }
            .music-item:active { background: rgba(0,0,0,0.05); }
            .music-item.active .music-title { color: #fa233b; }
            .music-item-cover { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-right: 15px; }
            .music-item-info { flex: 1; overflow: hidden; }
            .music-title { font-size: 16px; font-weight: 600; color: #1c1c1e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; transition: color 0.2s; }
            .music-artist { font-size: 14px; color: #8e8e93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .music-item-anim { width: 16px; height: 16px; display: none; align-items: flex-end; justify-content: space-between; margin-left: 10px; }
            .music-item.active .music-item-anim { display: flex; }
            .music-item-anim span { width: 3px; background: #fa233b; border-radius: 3px; animation: bounce 1s infinite alternate; }
            .music-item-anim span:nth-child(2) { animation-delay: 0.3s; }
            .music-item-anim span:nth-child(3) { animation-delay: 0.6s; }
            @keyframes bounce { 0% { height: 4px; } 100% { height: 16px; } }

            /* 底部悬浮控制栏 (Mini Player) */
            .music-mini-player { position: absolute; bottom: 20px; left: 20px; right: 20px; height: 64px; background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); display: flex; align-items: center; padding: 0 15px; z-index: 10; cursor: pointer; border: 1px solid rgba(255,255,255,0.5); transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s; }
            .music-mini-player:active { transform: scale(0.97); }
            .music-mini-player.hidden { transform: translateY(100px); opacity: 0; pointer-events: none; }
            .mini-cover { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-right: 12px; transition: transform 0.3s; }
            .music-mini-player.playing .mini-cover { transform: scale(1.05); }
            .mini-info { flex: 1; overflow: hidden; }
            .mini-title { font-size: 15px; font-weight: 600; color: #1c1c1e; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .mini-artist { font-size: 13px; color: #8e8e93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .mini-controls { display: flex; align-items: center; gap: 15px; margin-left: 10px; }
            .btn-icon { background: none; border: none; color: #1c1c1e; font-size: 24px; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; }
            .btn-icon:active { opacity: 0.5; }

            /* 全屏播放页 (Full Player) */
            .music-full-player { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #ffffff; z-index: 20; display: flex; flex-direction: column; transform: translateY(100%); transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
            .music-full-player.open { transform: translateY(0); }

            /* 动态模糊背景 */
            .full-bg { position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; background-size: cover; background-position: center; filter: blur(60px) brightness(0.9); opacity: 0.5; z-index: 0; transition: background-image 0.5s; pointer-events: none; }

            .full-content { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; padding: 30px; }
            .full-header { display: flex; justify-content: center; align-items: center; padding-bottom: 20px; position: relative; }
            .full-close-bar { width: 40px; height: 5px; background: rgba(0,0,0,0.2); border-radius: 5px; cursor: pointer; }

            .full-cover-container { flex: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; }
            .full-cover { width: 100%; max-width: 320px; aspect-ratio: 1/1; border-radius: 12px; object-fit: cover; box-shadow: 0 20px 50px rgba(0,0,0,0.3); transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
            .music-full-player.playing .full-cover { transform: scale(1.05); }

            .full-info { margin-bottom: 30px; }
            .full-title { font-size: 24px; font-weight: 800; color: #1c1c1e; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .full-artist { font-size: 18px; color: #fa233b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            /* 进度条 */
            .progress-container { margin-bottom: 30px; }
            .progress-bar-wrap { width: 100%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; cursor: pointer; position: relative; }
            .progress-bar-fill { height: 100%; background: #8e8e93; border-radius: 3px; width: 0%; pointer-events: none; }
            .progress-bar-wrap:hover .progress-bar-fill { background: #1c1c1e; }
            .progress-time { display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #8e8e93; font-weight: 600; }

            /* 底部大控制按钮 */
            .full-controls { display: flex; justify-content: center; align-items: center; gap: 40px; margin-bottom: 40px; }
            .full-btn { background: none; border: none; color: #1c1c1e; font-size: 36px; cursor: pointer; transition: transform 0.1s, opacity 0.2s; display: flex; align-items: center; justify-content: center; }
            .full-btn:active { transform: scale(0.9); opacity: 0.7; }
            .full-btn-play { font-size: 50px; }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // 3. 核心状态与音频对象
    // ==========================================
    let audio = new Audio();
    let currentIndex = -1;
    let isPlaying = false;
    let isFullOpen = false;

    // 格式化时间 (秒 -> mm:ss)
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    // ==========================================
    // 4. 渲染函数
    // ==========================================
    window.renderMusicApp = function(container) {
        container.innerHTML = `
            <div class="music-app-wrapper">
                <!-- 顶部标题 -->
                <div class="music-header">
                    <h1>音乐</h1>
                </div>

                <!-- 播放列表 -->
                <div class="music-list-container" id="music-list"></div>

                <!-- 悬浮迷你播放器 -->
                <div class="music-mini-player hidden" id="mini-player">
                    <img class="mini-cover" id="mini-cover" src="" alt="cover">
                    <div class="mini-info">
                        <div class="mini-title" id="mini-title">未播放</div>
                        <div class="mini-artist" id="mini-artist">--</div>
                    </div>
                    <div class="mini-controls">
                        <button class="btn-icon" id="mini-btn-play"><i class="bi bi-play-fill"></i></button>
                        <button class="btn-icon" id="mini-btn-next"><i class="bi bi-skip-forward-fill"></i></button>
                    </div>
                </div>

                <!-- 全屏播放页 -->
                <div class="music-full-player" id="full-player">
                    <div class="full-bg" id="full-bg"></div>
                    <div class="full-content">
                        <div class="full-header" id="full-close-area">
                            <div class="full-close-bar"></div>
                        </div>
                        <div class="full-cover-container">
                            <img class="full-cover" id="full-cover" src="" alt="cover">
                        </div>
                        <div class="full-info">
                            <div class="full-title" id="full-title">--</div>
                            <div class="full-artist" id="full-artist">--</div>
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
        // 5. DOM 节点获取
        // ==========================================
        const listContainer = document.getElementById('music-list');
        const miniPlayer = document.getElementById('mini-player');
        const fullPlayer = document.getElementById('full-player');

        // Mini Player
        const miniCover = document.getElementById('mini-cover');
        const miniTitle = document.getElementById('mini-title');
        const miniArtist = document.getElementById('mini-artist');
        const miniBtnPlay = document.getElementById('mini-btn-play');
        const miniBtnNext = document.getElementById('mini-btn-next');

        // Full Player
        const fullBg = document.getElementById('full-bg');
        const fullCover = document.getElementById('full-cover');
        const fullTitle = document.getElementById('full-title');
        const fullArtist = document.getElementById('full-artist');
        const fullBtnPlay = document.getElementById('full-btn-play');
        const fullBtnPrev = document.getElementById('full-btn-prev');
        const fullBtnNext = document.getElementById('full-btn-next');
        const fullCloseArea = document.getElementById('full-close-area');

        // Progress
        const progressWrap = document.getElementById('progress-wrap');
        const progressFill = document.getElementById('progress-fill');
        const timeCurrent = document.getElementById('time-current');
        const timeTotal = document.getElementById('time-total');

        // ==========================================
        // 6. 逻辑方法
        // ==========================================

        // 渲染列表
        function renderList() {
            listContainer.innerHTML = '';
            musicData.forEach((song, index) => {
                const item = document.createElement('div');
                item.className = `music-item ${index === currentIndex ? 'active' : ''}`;
                item.innerHTML = `
                    <img class="music-item-cover" src="${song.cover}" alt="cover">
                    <div class="music-item-info">
                        <div class="music-title">${song.title}</div>
                        <div class="music-artist">${song.artist}</div>
                    </div>
                    <div class="music-item-anim">
                        <span></span><span></span><span></span>
                    </div>
                `;
                item.onclick = () => playSong(index);
                listContainer.appendChild(item);
            });
        }

        // 播放指定歌曲
        function playSong(index) {
            if (index < 0 || index >= musicData.length) return;
            const song = musicData[index];

            if (currentIndex !== index) {
                currentIndex = index;
                // 网易云外链源
                audio.src = `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`;

                // 更新UI信息
                miniTitle.innerText = song.title;
                miniArtist.innerText = song.artist;
                miniCover.src = song.cover;

                fullTitle.innerText = song.title;
                fullArtist.innerText = song.artist;
                fullCover.src = song.cover;
                fullBg.style.backgroundImage = `url(${song.cover})`;

                miniPlayer.classList.remove('hidden');
                renderList();
            }

            audio.play().then(() => {
                isPlaying = true;
                updatePlayState();
            }).catch(e => {
                console.error("播放失败，可能是外链失效或需要VIP权限:", e);
                alert("播放失败，可能是该歌曲没有免费外链版权。");
                isPlaying = false;
                updatePlayState();
            });
        }

        // 切换播放/暂停
        function togglePlay() {
            if (currentIndex === -1) {
                playSong(0);
                return;
            }
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
            } else {
                audio.play();
                isPlaying = true;
            }
            updatePlayState();
        }

        // 上一首/下一首
        function prevSong() {
            let nextIdx = currentIndex - 1;
            if (nextIdx < 0) nextIdx = musicData.length - 1;
            playSong(nextIdx);
        }

        function nextSong() {
            let nextIdx = currentIndex + 1;
            if (nextIdx >= musicData.length) nextIdx = 0;
            playSong(nextIdx);
        }

        // 更新UI按钮状态
        function updatePlayState() {
            const playIcon = isPlaying ? '<i class="bi bi-pause-fill"></i>' : '<i class="bi bi-play-fill"></i>';
            const fullPlayIcon = isPlaying ? '<i class="bi bi-pause-circle-fill"></i>' : '<i class="bi bi-play-circle-fill"></i>';

            miniBtnPlay.innerHTML = playIcon;
            fullBtnPlay.innerHTML = fullPlayIcon;

            if (isPlaying) {
                miniPlayer.classList.add('playing');
                fullPlayer.classList.add('playing');
            } else {
                miniPlayer.classList.remove('playing');
                fullPlayer.classList.remove('playing');
            }
        }

        // ==========================================
        // 7. 事件绑定
        // ==========================================

        // 列表初始渲染
        renderList();

        // 迷你播放器控制
        miniBtnPlay.onclick = (e) => { e.stopPropagation(); togglePlay(); };
        miniBtnNext.onclick = (e) => { e.stopPropagation(); nextSong(); };

        // 点击迷你播放器展开全屏
        miniPlayer.onclick = () => {
            fullPlayer.classList.add('open');
            isFullOpen = true;
        };

        // 全屏播放器控制
        fullCloseArea.onclick = () => {
            fullPlayer.classList.remove('open');
            isFullOpen = false;
        };

        fullBtnPlay.onclick = togglePlay;
        fullBtnPrev.onclick = prevSong;
        fullBtnNext.onclick = nextSong;

        // 音频进度更新
        audio.ontimeupdate = () => {
            if (!audio.duration) return;
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${percent}%`;
            timeCurrent.innerText = formatTime(audio.currentTime);
            timeTotal.innerText = formatTime(audio.duration);
        };

        // 进度条拖拽/点击
        progressWrap.onclick = (e) => {
            if (!audio.duration) return;
            const rect = progressWrap.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = clickX / rect.width;
            audio.currentTime = percent * audio.duration;
        };

        // 自动下一首
        audio.onended = () => {
            nextSong();
        };

        // 如果之前已经在播放，恢复状态
        if (currentIndex !== -1) {
            miniPlayer.classList.remove('hidden');
            updatePlayState();
        }
    };
})();
