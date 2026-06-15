(function() {
    // ==========================================
    // 1. 音乐数据库
    // ==========================================
    const musicData = [
        {
            id: "1993154308",
            title: "マリーゴールド",
            artist: "クルミ",
            cover: "https://i.postimg.cc/bvPCh0cH/109951168006412374.jpg"
        },
        {
            id: "542042",
            title: "心が旅立つ時",
            artist: "永田茂",
            cover: "https://i.postimg.cc/wTs0R49R/109951164728008085.jpg"
        },
        {
            id: "435166265",
            title: "YUBIKIRI-GENMAN",
            artist: "Mili",
            cover: "https://i.postimg.cc/tg95fXWS/18801648835570109.jpg"
        },
        {
            id: "744932",
            title: "アサガオ",
            artist: "舞花",
            cover: "https://i.postimg.cc/13Q2m1Dp/698189883649629.png"
        },
        {
            id: "27580521",
            title: "Libertus",
            artist: "Chen-U",
            cover: "https://i.postimg.cc/xjN4L1RH/5695470231949594.jpg"
        },
        {
            id: "766287",
            title: "fairy stage",
            artist: "K2 SOUND",
            cover: "https://i.postimg.cc/jqnFySXz/875211255709998.png"
        }
    ];

    // ==========================================
    // 2. 样式 (Apple Music + 黑胶旋转 + 全局胶囊)
    // ==========================================
    const styleId = 'qingzi-music-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            @keyframes vinyl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes bar-bounce { 0% { height: 4px; } 100% { height: 16px; } }

            .music-app-wrapper { width: 100%; height: 100%; background: #ffffff; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; position: relative; overflow: hidden; }

            /* 顶部与列表 */
            .music-header { padding: 20px 20px 10px; flex-shrink: 0; }
            .music-header h1 { margin: 0; font-size: 34px; font-weight: 800; color: #1c1c1e; letter-spacing: -0.5px; }
            .music-list-container { flex: 1; overflow-y: auto; padding: 0 20px 120px; }
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

            /* ====== 迷你播放器 (增强版) ====== */
            .music-mini-player {
                position: absolute; bottom: 20px; left: 20px; right: 20px; height: 75px;
                background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                display: flex; align-items: center; padding: 0 15px;
                z-index: 10; cursor: pointer; border: 1px solid rgba(255,255,255,0.5);
                transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), opacity 0.3s;
            }
            .music-mini-player.hidden { transform: translateY(100px); opacity: 0; pointer-events: none; }
            .mini-cover { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 10px rgba(0,0,0,0.15); margin-right: 12px; animation: vinyl-spin 8s linear infinite; animation-play-state: paused; }
            .music-mini-player.playing .mini-cover { animation-play-state: running; }
            .mini-info { width: 120px; overflow: hidden; margin-right: 10px; flex-shrink: 0; }
            .mini-title { font-size: 14px; font-weight: 600; color: #1c1c1e; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .mini-artist { font-size: 12px; color: #8e8e93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            .mini-controls-wrap { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: flex-end; gap: 5px; }
            .mini-controls { display: flex; align-items: center; gap: 12px; }
            .btn-music-icon { background: none; border: none; color: #1c1c1e; font-size: 20px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; }
            .btn-music-icon:active { opacity: 0.5; }
            .btn-play-big { font-size: 28px; }

            /* 音量条 */
            .vol-wrap { display: flex; align-items: center; gap: 8px; width: 150px; color: #8e8e93; font-size: 14px; }
            .vol-slider { -webkit-appearance: none; flex: 1; height: 4px; border-radius: 2px; background: rgba(0,0,0,0.1); outline: none; }
            .vol-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #1c1c1e; cursor: pointer; }

            /* ====== 全屏播放页 ====== */
            .music-full-player { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #1c1c1e; z-index: 20; display: flex; flex-direction: column; transform: translateY(100%); transition: transform 0.5s cubic-bezier(0.2,0.8,0.2,1); }
            .music-full-player.open { transform: translateY(0); }

            /* 模糊背景加暗色遮罩解决字体看不清问题 */
            .full-bg { position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; background-size: cover; background-position: center; filter: blur(60px) brightness(0.4); opacity: 0.8; z-index: 0; transition: background-image 0.5s; pointer-events: none; }

            .full-content { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; padding: 30px; }
            .full-header { display: flex; justify-content: center; align-items: center; padding-bottom: 20px; position: relative; }
            .full-close-bar { width: 40px; height: 5px; background: rgba(255,255,255,0.3); border-radius: 5px; cursor: pointer; }

            /* 全屏黑胶 */
            .full-cover-container { flex: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; }
            .full-cover-disc { width: 280px; height: 280px; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; animation: vinyl-spin 12s linear infinite; animation-play-state: paused; }
            .music-full-player.playing .full-cover-disc { animation-play-state: running; }
            .full-cover-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 6px solid rgba(255,255,255,0.1); }
            .full-cover-hole { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.9); box-shadow: 0 0 0 4px rgba(0,0,0,0.08), inset 0 0 4px rgba(0,0,0,0.1); z-index: 2; }

            /* 全屏信息全部改白色 */
            .full-info { margin-bottom: 30px; text-align: center; }
            .full-title { font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
            .full-artist { font-size: 18px; color: rgba(255,255,255,0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            /* 进度条 */
            .progress-container { margin-bottom: 30px; }
            .progress-bar-wrap { width: 100%; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; cursor: pointer; position: relative; }
            .progress-bar-fill { height: 100%; background: #ffffff; border-radius: 3px; width: 0%; pointer-events: none; transition: width 0.1s linear; box-shadow: 0 0 8px rgba(255,255,255,0.5); }
            .progress-time { display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 600; }

            /* 全屏底部控制区 */
            .full-controls-area { display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px; }
            .full-controls { display: flex; justify-content: space-between; align-items: center; padding: 0 10px; }
            .full-btn { background: none; border: none; color: #ffffff; font-size: 32px; cursor: pointer; transition: transform 0.1s, opacity 0.2s; display: flex; align-items: center; justify-content: center; }
            .full-btn:active { transform: scale(0.9); opacity: 0.7; }
            .full-btn-play { font-size: 60px; }
            .full-btn-small { font-size: 24px; color: rgba(255,255,255,0.6); }

            .full-vol-wrap { display: flex; align-items: center; gap: 15px; color: rgba(255,255,255,0.6); font-size: 18px; padding: 0 10px; }
            .full-vol-slider { -webkit-appearance: none; flex: 1; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.2); outline: none; }
            .full-vol-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #ffffff; cursor: pointer; box-shadow: 0 0 5px rgba(0,0,0,0.5); }

            /* ====== 全局音乐悬浮胶囊 ====== */
            #qingzi-music-capsule {
                position: fixed; left: -100px; bottom: 80px; height: 50px;
                background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
                border-radius: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                display: flex; align-items: center; padding: 0 15px 0 5px; gap: 10px;
                z-index: 999999; border: 1px solid rgba(0,0,0,0.1);
                transition: left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            #qingzi-music-capsule.show { left: 20px; }
            .capsule-cover { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; animation: vinyl-spin 8s linear infinite; animation-play-state: paused; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            #qingzi-music-capsule.playing .capsule-cover { animation-play-state: running; }
            .capsule-btn { background: none; border: none; color: #1c1c1e; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // 3. 播放器全局状态
    // ==========================================
    if (!window.qingziAudio) {
        window.qingziAudio = new Audio();
        window.qingziAudio.volume = 0.5;
    }
    const audio = window.qingziAudio;
    let currentIndex = -1;
    let isPlaying = !audio.paused && audio.src !== "";

    // 播放模式: 0=列表循环, 1=单曲循环, 2=随机播放
    let playModeIdx = 0;
    const modeIcons = ['<i class="bi bi-repeat"></i>', '<i class="bi bi-repeat-1"></i>', '<i class="bi bi-shuffle"></i>'];

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // ==========================================
    // 4. 全局悬浮胶囊注入 (退出平板时显示)
    // ==========================================
    let capsule = document.getElementById('qingzi-music-capsule');
    if (!capsule) {
        let topDoc = window.parent.document || document;
        capsule = topDoc.createElement('div');
        capsule.id = 'qingzi-music-capsule';
        capsule.innerHTML = `
            <img class="capsule-cover" id="cap-cover" src="">
            <button class="capsule-btn" id="cap-btn-play"><i class="bi bi-play-fill"></i></button>
            <button class="capsule-btn" id="cap-btn-next"><i class="bi bi-skip-forward-fill"></i></button>
        `;
        topDoc.body.appendChild(capsule);

        // 胶囊事件绑定
        capsule.querySelector('#cap-btn-play').onclick = () => { if(window.toggleMusicPlay) window.toggleMusicPlay(); };
        capsule.querySelector('#cap-btn-next').onclick = () => { if(window.nextMusicSong) window.nextMusicSong(); };

        // 监控平板状态，决定是否显示胶囊
        setInterval(() => {
            const padWrap = topDoc.getElementById('qingzi-pad-wrapper');
            const isPadOpen = padWrap && padWrap.classList.contains('active');
            const hasMusic = audio.src && audio.src !== "";
            if (!isPadOpen && hasMusic) {
                capsule.classList.add('show');
            } else {
                capsule.classList.remove('show');
            }
        }, 500);
    }

    // ==========================================
    // 5. 渲染平板内App界面
    // ==========================================
    window.renderMusicApp = function(container) {
        container.innerHTML = `
            <div class="music-app-wrapper">
                <div class="music-header"><h1>音乐</h1></div>
                <div class="music-list-container" id="music-list"></div>

                <!-- 迷你播放器 (增强) -->
                <div class="music-mini-player hidden" id="mini-player">
                    <img class="mini-cover" id="mini-cover" src="" alt="">
                    <div class="mini-info">
                        <div class="mini-title" id="mini-title">未播放</div>
                        <div class="mini-artist" id="mini-artist">--</div>
                    </div>
                    <div class="mini-controls-wrap">
                        <div class="mini-controls">
                            <button class="btn-music-icon mode-btn"><i class="bi bi-repeat"></i></button>
                            <button class="btn-music-icon" id="mini-btn-prev"><i class="bi bi-skip-backward-fill"></i></button>
                            <button class="btn-music-icon btn-play-big" id="mini-btn-play"><i class="bi bi-play-fill"></i></button>
                            <button class="btn-music-icon" id="mini-btn-next"><i class="bi bi-skip-forward-fill"></i></button>
                        </div>
                        <div class="vol-wrap">
                            <i class="bi bi-volume-down"></i>
                            <input type="range" class="vol-slider mini-vol" min="0" max="100" value="${audio.volume * 100}">
                        </div>
                    </div>
                </div>

                <!-- 全屏播放页 -->
                <div class="music-full-player" id="full-player">
                    <div class="full-bg" id="full-bg"></div>
                    <div class="full-content">
                        <div class="full-header" id="full-close-area"><div class="full-close-bar"></div></div>

                        <div class="full-cover-container">
                            <div class="full-cover-disc" id="full-disc">
                                <img class="full-cover-img" id="full-cover" src="">
                                <div class="full-cover-hole"></div>
                            </div>
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

                        <div class="full-controls-area">
                            <div class="full-controls">
                                <button class="full-btn full-btn-small mode-btn"><i class="bi bi-repeat"></i></button>
                                <button class="full-btn" id="full-btn-prev"><i class="bi bi-skip-backward-fill"></i></button>
                                <button class="full-btn full-btn-play" id="full-btn-play"><i class="bi bi-play-circle-fill"></i></button>
                                <button class="full-btn" id="full-btn-next"><i class="bi bi-skip-forward-fill"></i></button>
                                <button class="full-btn full-btn-small"><i class="bi bi-music-note-list"></i></button>
                            </div>
                            <div class="full-vol-wrap">
                                <i class="bi bi-volume-down-fill"></i>
                                <input type="range" class="full-vol-slider" min="0" max="100" value="${audio.volume * 100}">
                                <i class="bi bi-volume-up-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // ==========================================
        // 6. DOM与逻辑绑定
        // ==========================================
        const listContainer = container.querySelector('#music-list');
        const miniPlayer = container.querySelector('#mini-player');
        const fullPlayer = container.querySelector('#full-player');

        // 按钮获取
        const btnPlays = container.querySelectorAll('#mini-btn-play, #full-btn-play');
        const btnPrevs = container.querySelectorAll('#mini-btn-prev, #full-btn-prev');
        const btnNexts = container.querySelectorAll('#mini-btn-next, #full-btn-next');
        const modeBtns = container.querySelectorAll('.mode-btn');
        const volSliders = container.querySelectorAll('.vol-slider, .full-vol-slider');

        // 信息获取
        const covers = container.querySelectorAll('#mini-cover, #full-cover, #cap-cover');
        const titles = container.querySelectorAll('#mini-title, #full-title');
        const artists = container.querySelectorAll('#mini-artist, #full-artist');
        const fullBg = container.querySelector('#full-bg');

        // 渲染列表
        function renderList() {
            listContainer.innerHTML = '';
            musicData.forEach(function(song, index) {
                const item = document.createElement('div');
                item.className = 'music-item' + (index === currentIndex ? ' active' : '');
                item.innerHTML =
                    '<img class="music-item-cover" src="' + song.cover + '">' +
                    '<div class="music-item-info"><div class="music-title">' + song.title + '</div><div class="music-artist">' + song.artist + '</div></div>' +
                    '<div class="music-item-anim"><span></span><span></span><span></span></div>';
                item.onclick = function() { playSong(index); };
                listContainer.appendChild(item);
            });
        }

        // 核心播放控制
        function playSong(index) {
            if (index < 0 || index >= musicData.length) return;
            const song = musicData[index];

            if (currentIndex !== index) {
                currentIndex = index;
                audio.src = 'https://music.163.com/song/media/outer/url?id=' + song.id + '.mp3';

                titles.forEach(el => el.innerText = song.title);
                artists.forEach(el => el.innerText = song.artist);
                covers.forEach(el => { if(el) el.src = song.cover; });
                fullBg.style.backgroundImage = 'url(' + song.cover + ')';

                miniPlayer.classList.remove('hidden');
                renderList();
            }

            audio.play().then(() => { isPlaying = true; updatePlayState(); })
                 .catch(e => { console.error("播放失败:", e); isPlaying = false; updatePlayState(); });
        }

        function togglePlay() {
            if (currentIndex === -1) { playSong(0); return; }
            if (isPlaying) { audio.pause(); isPlaying = false; }
            else { audio.play(); isPlaying = true; }
            updatePlayState();
        }

        function prevSong() {
            if (playModeIdx === 2) { playRandom(); return; } // 随机模式
            let idx = currentIndex - 1;
            if (idx < 0) idx = musicData.length - 1;
            playSong(idx);
        }

        function nextSong() {
            if (playModeIdx === 2) { playRandom(); return; } // 随机模式
            let idx = currentIndex + 1;
            if (idx >= musicData.length) idx = 0;
            playSong(idx);
        }

        function playRandom() {
            let idx = Math.floor(Math.random() * musicData.length);
            playSong(idx);
        }

        function toggleMode() {
            playModeIdx = (playModeIdx + 1) % 3;
            modeBtns.forEach(btn => btn.innerHTML = modeIcons[playModeIdx]);
        }

        function updatePlayState() {
            const playIcon = isPlaying ? '<i class="bi bi-pause-fill"></i>' : '<i class="bi bi-play-fill"></i>';
            const fullPlayIcon = isPlaying ? '<i class="bi bi-pause-circle-fill"></i>' : '<i class="bi bi-play-circle-fill"></i>';

            container.querySelector('#mini-btn-play').innerHTML = playIcon;
            container.querySelector('#full-btn-play').innerHTML = fullPlayIcon;

            // 更新全局胶囊的图标
            let topDoc = window.parent.document || document;
            let capPlayBtn = topDoc.querySelector('#cap-btn-play');
            if(capPlayBtn) capPlayBtn.innerHTML = playIcon;

            if (isPlaying) {
                miniPlayer.classList.add('playing');
                container.querySelector('#full-player').classList.add('playing');
                if(capsule) capsule.classList.add('playing');
            } else {
                miniPlayer.classList.remove('playing');
                container.querySelector('#full-player').classList.remove('playing');
                if(capsule) capsule.classList.remove('playing');
            }
        }

        // 暴露全局方法给胶囊调用
        window.toggleMusicPlay = togglePlay;
        window.nextMusicSong = nextSong;

        // 事件绑定
        renderList();

        btnPlays.forEach(btn => btn.onclick = (e) => { e.stopPropagation(); togglePlay(); });
        btnPrevs.forEach(btn => btn.onclick = (e) => { e.stopPropagation(); prevSong(); });
        btnNexts.forEach(btn => btn.onclick = (e) => { e.stopPropagation(); nextSong(); });
        modeBtns.forEach(btn => btn.onclick = (e) => { e.stopPropagation(); toggleMode(); });

        // 音量联动同步
        volSliders.forEach(slider => {
            slider.oninput = (e) => {
                e.stopPropagation();
                let val = e.target.value;
                audio.volume = val / 100;
                volSliders.forEach(s => s.value = val); // 同步两个滑块
            };
        });

        // 展开与收起
        miniPlayer.onclick = (e) => { if(e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) container.querySelector('#full-player').classList.add('open'); };
        container.querySelector('#full-close-area').onclick = () => container.querySelector('#full-player').classList.remove('open');

        // 进度条
        const progressFill = container.querySelector('#progress-fill');
        const timeCur = container.querySelector('#time-current');
        const timeTot = container.querySelector('#time-total');

        audio.ontimeupdate = () => {
            if (!audio.duration) return;
            progressFill.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
            timeCur.innerText = formatTime(audio.currentTime);
            timeTot.innerText = formatTime(audio.duration);
        };

        container.querySelector('#progress-wrap').onclick = (e) => {
            if (!audio.duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        };

        // 歌曲结束自动处理 (考虑循环模式)
        audio.onended = () => {
            if (playModeIdx === 1) { // 单曲循环
                audio.currentTime = 0;
                audio.play();
            } else {
                nextSong();
            }
        };

        // 初始化恢复状态
        if (currentIndex !== -1) {
            miniPlayer.classList.remove('hidden');
            titles.forEach(el => el.innerText = musicData[currentIndex].title);
            artists.forEach(el => el.innerText = musicData[currentIndex].artist);
            covers.forEach(el => { if(el) el.src = musicData[currentIndex].cover; });
            fullBg.style.backgroundImage = 'url(' + musicData[currentIndex].cover + ')';
            modeBtns.forEach(btn => btn.innerHTML = modeIcons[playModeIdx]);
            updatePlayState();
        }
    };
})();
