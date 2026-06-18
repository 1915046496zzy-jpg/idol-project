// ==========================================
// 秋青子专属小组件：同步音乐播放面板
// 文件名：widget_music.js
// ==========================================
(function() {
    window.QingziWidgets = window.QingziWidgets || {};

    window.QingziWidgets['music'] = {
        size: '4x2', // 占用 4x2 的宽条格子
        render: function(container) {
            container.innerHTML = `
                <style>
                    .widget-music-wrap {
                        width: 100%; height: 100%;
                        background: #1c1c1e;
                        border-radius: 24px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                        display: flex; align-items: center; padding: 15px 20px;
                        position: relative; overflow: hidden;
                        color: #fff;
                    }
                    /* 背景高斯模糊 */
                    .wg-music-bg {
                        position: absolute; top: -20%; left: -20%; width: 140%; height: 140%;
                        background-size: cover; background-position: center;
                        filter: blur(40px) brightness(0.5); z-index: 0; transition: 0.5s;
                    }
                    .wg-music-content { position: relative; z-index: 1; display: flex; width: 100%; align-items: center; gap: 20px; }
                    .wg-cover-wrap { width: 90px; height: 90px; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 15px rgba(0,0,0,0.3); flex-shrink: 0;}
                    .wg-cover { width: 100%; height: 100%; object-fit: cover; }
                    .wg-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
                    .wg-title { font-size: 18px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
                    .wg-artist { font-size: 14px; color: rgba(255,255,255,0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                    .wg-controls { display: flex; gap: 15px; align-items: center; margin-top: 10px; }
                    .wg-btn { background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; padding: 0; transition: 0.2s; }
                    .wg-btn:active { transform: scale(0.9); opacity: 0.7; }
                    .wg-btn-play { font-size: 36px; }
                </style>
                <div class="widget-music-wrap">
                    <div class="wg-music-bg" id="wg-m-bg"></div>
                    <div class="wg-music-content">
                        <div class="wg-cover-wrap">
                            <img src="https://i.postimg.cc/ZqyRBBxD/yin-ji-png-xiao.png" class="wg-cover" id="wg-m-cover">
                        </div>
                        <div class="wg-info">
                            <div class="wg-title" id="wg-m-title">未在播放</div>
                            <div class="wg-artist" id="wg-m-artist">--</div>
                            <div class="wg-controls">
                                <button class="wg-btn" id="wg-btn-prev"><i class="bi bi-skip-backward-fill"></i></button>
                                <button class="wg-btn wg-btn-play" id="wg-btn-play"><i class="bi bi-play-circle-fill"></i></button>
                                <button class="wg-btn" id="wg-btn-next"><i class="bi bi-skip-forward-fill"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const bg = container.querySelector('#wg-m-bg');
            const cover = container.querySelector('#wg-m-cover');
            const title = container.querySelector('#wg-m-title');
            const artist = container.querySelector('#wg-m-artist');
            const btnPlay = container.querySelector('#wg-btn-play');
            const btnPrev = container.querySelector('#wg-btn-prev');
            const btnNext = container.querySelector('#wg-btn-next');

            // 绑定按钮事件到全局挂载的音乐方法
            btnPlay.onclick = () => { if(window.toggleMusicPlay) window.toggleMusicPlay(); };
            btnNext.onclick = () => { if(window.nextMusicSong) window.nextMusicSong(); };
            // prevSong 因为原版没有暴露，我们可以通过点击触发音乐APP内的按钮，或者暴露出来。
            // 这里用简单的 DOM 触发魔法：
            btnPrev.onclick = () => {
                let doc = window.parent.document || document;
                let btn = doc.querySelector('#mini-btn-prev');
                if(btn) btn.click();
            };

            // 定时器实时同步音乐 APP 的状态
            setInterval(() => {
                let doc = window.parent.document || document;
                const audio = window.qingziAudio;

                if (audio) {
                    btnPlay.innerHTML = (!audio.paused && audio.src) ? '<i class="bi bi-pause-circle-fill"></i>' : '<i class="bi bi-play-circle-fill"></i>';
                }

                const miniTitle = doc.querySelector('#mini-title');
                const miniArtist = doc.querySelector('#mini-artist');
                const miniCover = doc.querySelector('#mini-cover');

                if (miniTitle && miniTitle.innerText !== "未播放") {
                    title.innerText = miniTitle.innerText;
                    artist.innerText = miniArtist.innerText;
                    if(miniCover && cover.src !== miniCover.src) {
                        cover.src = miniCover.src;
                        bg.style.backgroundImage = `url(${miniCover.src})`;
                    }
                }
            }, 500);
        }
    };
})();
