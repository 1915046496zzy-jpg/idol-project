// ==========================================
// 秋青子专属终端：LINE 通讯录模块 (iPad大屏左右分栏重制版)
// ==========================================
(function() {
    let topWin;
    let topDoc;
    try {
        topWin = window.parent || window;
        topDoc = window.parent.document || document;
    } catch(e) {
        topWin = window;
        topDoc = document;
    }

    if (!topWin.IdolProjectData) topWin.IdolProjectData = {};
    if (!topWin.customGroups) topWin.customGroups = [];
    topWin.currentChatTarget = "";

    // --- 0. 注入 LINE 专属大屏分栏 CSS 样式 ---
    if (!topDoc.getElementById('line-app-split-style')) {
        const style = topDoc.createElement('style');
        style.id = 'line-app-split-style';
        style.innerHTML = `
            /* 整体分栏布局 */
            .pad-line-layout { display: flex; width: 100%; height: 100%; background: #f8fafc; overflow: hidden; box-sizing: border-box; }

            /* 左侧：联系人列表区 */
            .pad-line-sidebar { width: 320px; background: #fff; border-right: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; flex-shrink: 0; z-index: 10;}
            .pad-line-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); flex-shrink: 0;}
            .pad-line-title { font-size: 20px; font-weight: 900; color: #1e293b; display: flex; align-items: center; gap: 8px;}
            .btn-create-group { background: #10b981; color: #fff; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; box-shadow: 0 4px 10px rgba(16,185,129,0.2); transition: 0.2s;}
            .btn-create-group:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(16,185,129,0.3);}

            .chat-list { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 15px; display: flex; flex-direction: column; gap: 8px; }
            .chat-list::-webkit-scrollbar { width: 4px; }
            .chat-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
            .chat-list-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; cursor: pointer; transition: 0.2s; border: 1px solid transparent;}
            .chat-list-item:hover { background: #f1f5f9; }
            .chat-list-item.active { background: #ecfdf5; border-color: #a7f3d0; }
            .chat-avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; background: #fff; flex-shrink: 0;}
            .chat-info { flex: 1; min-width: 0; }
            .chat-name { font-size: 15px; font-weight: bold; color: #1e293b; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
            .chat-preview { font-size: 13px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            /* 右侧：聊天主区 */
            .pad-line-main { flex: 1; display: flex; flex-direction: column; background: #f8fafc; position: relative; min-width: 0;}

            /* 默认空白页 */
            .pad-line-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; font-weight: bold; letter-spacing: 1px;}
            .pad-line-empty i { font-size: 64px; color: #cbd5e1; margin-bottom: 15px;}

            /* 聊天室内部 */
            .chat-room { display: none; flex-direction: column; height: 100%; width: 100%;}
            .chat-room.active { display: flex; }
            .chat-room-header { padding: 20px 25px; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;}
            .chat-room-title { font-weight: 900; font-size: 18px; color: #1e293b; display: flex; align-items: center; gap: 10px;}
            .chat-room-actions { display: flex; gap: 15px; color: #64748b; font-size: 20px; cursor: pointer;}

            .chat-history { flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; gap: 18px; padding: 25px; background: #f1f5f9;}
            .chat-history::-webkit-scrollbar { width: 6px; }
            .chat-history::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }

            .bubble-row { display: flex; flex-direction: column; width: 100%; }
            .bubble-row.left { align-items: flex-start; }
            .bubble-row.right { align-items: flex-end; }
            .bubble { max-width: 65%; padding: 12px 18px; border-radius: 18px; font-size: 15px; line-height: 1.6; word-wrap: break-word; word-break: break-word; box-shadow: 0 2px 5px rgba(0,0,0,0.02);}
            .bubble-row.left .bubble { background: #fff; border: 1px solid rgba(0,0,0,0.05); border-bottom-left-radius: 4px; color: #334155; }
            .bubble-row.right .bubble { background: #10b981; color: #fff; border-bottom-right-radius: 4px; }
            .bubble-img { max-width: 200px; max-height: 200px; object-fit: contain; border-radius: 12px; margin-top: 4px; background: transparent;}

            .chat-input-area { display: flex; align-items: center; gap: 15px; background: #fff; padding: 20px 25px; border-top: 1px solid rgba(0,0,0,0.05); flex-shrink: 0;}
            .btn-emoji { font-size: 26px; cursor: pointer; transition: 0.2s; color: #94a3b8; display: flex; align-items: center;}
            .btn-emoji:hover { transform: scale(1.1); color: #10b981;}
            .chat-input { flex: 1; border: none; background: #f8fafc; outline: none; padding: 14px 20px; font-size: 15px; border-radius: 24px; color: #334155; transition: 0.2s;}
            .chat-input:focus { background: #f1f5f9; }
            .btn-send { background: #10b981; color: #fff; border: none; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; transition: 0.2s; box-shadow: 0 4px 10px rgba(16,185,129,0.2);}
            .btn-send:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(16,185,129,0.3);}

            /* 表情面板调整到右侧主区内 */
            .emoji-panel { position: absolute; bottom: 90px; left: 25px; width: 320px; background: #fff; border-radius: 16px; padding: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: none; grid-template-columns: repeat(3, 1fr); gap: 12px; border: 1px solid rgba(0,0,0,0.05); z-index: 30; max-height: 280px; overflow-y: auto;}
            .emoji-panel.show { display: grid; animation: fadeIn 0.2s ease;}
            .emoji-item { cursor: pointer; text-align: center; transition: 0.2s; background: #f8fafc; border-radius: 12px; padding: 8px; border: 1px solid transparent; display: flex; align-items: center; justify-content: center; aspect-ratio: 1;}
            .emoji-item:hover { transform: scale(1.05); border-color: #10b981; background: #fff;}
            .emoji-item img { width: 100%; height: 100%; object-fit: contain; }

            /* 创建群聊弹窗补全 */
            .line-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 999999; display: none; justify-content: center; align-items: center; opacity: 0; transition: 0.3s;}
            .line-modal-overlay.active { display: flex; opacity: 1; }
            .line-modal-content { background: #fff; width: 90%; max-width: 400px; border-radius: 24px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); transform: translateY(20px); transition: 0.3s; position: relative;}
            .line-modal-overlay.active .line-modal-content { transform: translateY(0); }
            .line-modal-header { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 20px; text-align: center; }
            .line-modal-close { position: absolute; top: 15px; right: 15px; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold; color: #64748b; font-size: 16px; display: flex; align-items: center; justify-content: center;}
            .group-checkbox-list { display: flex; flex-direction: column; gap: 10px; max-height: 250px; overflow-y: auto; margin-bottom: 20px; padding-right: 5px;}
            .group-checkbox-item { display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 12px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05);}
            .group-checkbox-item img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover;}
            .btn-line-confirm { width: 100%; padding: 14px; background: #10b981; color: #fff; border: none; border-radius: 12px; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 4px 10px rgba(16,185,129,0.2); transition: 0.2s;}
            .btn-line-confirm:hover { transform: translateY(-2px); filter: brightness(1.1);}
        `;
        topDoc.head.appendChild(style);
    }

    // --- 1. 渲染 LINE 主界面 (大屏分栏) ---
    topWin.renderLineApp = function(container, parsedSysData) {
        if (!container) return;

        let db = topWin.idolDatabase || (typeof idolDatabase !== 'undefined' ? idolDatabase : []);
        let cGroups = topWin.customGroups || [];
        let getImgUrl = topWin.getAssetUrl || (typeof window.getAssetUrl === 'function' ? window.getAssetUrl : function(){return '';});

        let html = '<div class="pad-line-layout">';

        // ========== 左侧：联系人列表 ==========
        html += `<div class="pad-line-sidebar">
                    <div class="pad-line-header">
                        <div class="pad-line-title"><i class="bi bi-chat-dots-fill" style="color:#10b981;"></i> LINE</div>
                        <button class="btn-create-group" onclick="let tw = window.parent || window; tw.openLineGroupModal()" title="发起群聊"><i class="bi bi-plus-lg"></i></button>
                    </div>
                    <div class="chat-list" id="line-contact-list">`;

        // 渲染官方账号 (固定置顶)
        html += `       <div class="chat-list-item" onclick="let tw = window.parent || window; tw.openLineChat('事务所官方', 'official')">
                            <div class="chat-avatar" style="display:flex; align-items:center; justify-content:center; font-size:24px; background: #1e293b; color:#fff;"><i class="bi bi-building-fill"></i></div>
                            <div class="chat-info">
                                <div class="chat-name">事务所系统通知</div>
                                <div class="chat-preview">本周通告结算已出炉...</div>
                            </div>
                        </div>`;

        // 渲染群聊
        cGroups.forEach(g => {
            html += `   <div class="chat-list-item" onclick="let tw = window.parent || window; tw.openLineChat('${g.name}', 'group')">
                            <div class="chat-avatar" style="display:flex; align-items:center; justify-content:center; font-size:24px; background: linear-gradient(135deg, #34d399, #10b981); color:#fff;"><i class="bi bi-people-fill"></i></div>
                            <div class="chat-info">
                                <div class="chat-name">${g.name}</div>
                                <div class="chat-preview">群聊已创建，快来聊天吧</div>
                            </div>
                        </div>`;
        });

        // 渲染偶像单聊
        if(db.length > 0) {
            db.forEach(idol => {
                let isNewMsg = (parsedSysData && parsedSysData.contact && parsedSysData.contact.includes(idol.name));
                let previewText = isNewMsg ? parsedSysData.contact.split('：')[1] : '点击查看最新消息...';
                let nameColor = isNewMsg ? 'color:#10b981;' : '';
                let fontWeight = isNewMsg ? 'font-weight:bold; color:#334155;' : '';
                let cAvatar = getImgUrl(idol.name + "_头像", "avatar");

                html += `
                        <div class="chat-list-item" id="list-item-${idol.name}" onclick="let tw = window.parent || window; tw.openLineChat('${idol.name}', 'single', '${cAvatar}')">
                            <img src="${cAvatar}" class="chat-avatar">
                            <div class="chat-info">
                                <div class="chat-name" style="${nameColor}">${idol.name}</div>
                                <div class="chat-preview" style="${fontWeight}">${previewText}</div>
                            </div>
                            ${isNewMsg ? '<div style="width:10px; height:10px; border-radius:50%; background:#ef4444; box-shadow:0 0 5px #ef4444;"></div>' : ''}
                        </div>`;
            });
        }
        html += `   </div></div>`; // 结束左侧

        // ========== 右侧：主聊天区 ==========
        html += `<div class="pad-line-main">
                    <!-- 默认空白提示 -->
                    <div class="pad-line-empty" id="line-empty-state">
                        <i class="bi bi-chat-heart"></i>
                        <div>请在左侧选择联系人开始聊天</div>
                    </div>

                    <!-- 聊天室界面 -->
                    <div class="chat-room" id="line-chat-room">
                        <div class="chat-room-header">
                            <div class="chat-room-title" id="line-chat-title">未知联系人</div>
                            <div class="chat-room-actions">
                                <i class="bi bi-telephone-fill" title="语音通话(未解锁)"></i>
                                <i class="bi bi-camera-video-fill" title="视频通话(未解锁)"></i>
                                <i class="bi bi-three-dots-vertical"></i>
                            </div>
                        </div>

                        <div class="chat-history" id="line-chat-history">`;

        // 预加载当前有消息的记录
        if(parsedSysData && parsedSysData.contact && parsedSysData.contact !== "无") {
            var parts = parsedSysData.contact.split('：');
            if(parts.length >= 2) {
                let msgContent = parts.slice(1).join('：');
                let emojiMatch = msgContent.match(/\[(表情_[^\]]+)\]/);
                let finalHtml = msgContent;
                if(emojiMatch) {
                    let eKey = emojiMatch[1];
                    let eUrl = getImgUrl(eKey);
                    if(eUrl) finalHtml = msgContent.replace(emojiMatch[0], `<br><img src="${eUrl}" class="bubble-img">`);
                }
                html += `<div class="bubble-row left"><div class="bubble">${finalHtml}</div></div>`;
            }
        }

        html += `       </div>

                        <div class="chat-input-area">
                            <div class="btn-emoji" onclick="let tw = window.parent || window; tw.toggleLineEmoji()"><i class="bi bi-emoji-smile-fill"></i></div>
                            <div class="btn-emoji"><i class="bi bi-image" title="发送照片(开发中)"></i></div>
                            <input type="text" id="line-input-box" class="chat-input" placeholder="输入回复内容..." onkeypress="if(event.keyCode==13){let tw = window.parent || window; tw.sendLineMsg()}">
                            <button class="btn-send" onclick="let tw = window.parent || window; tw.sendLineMsg()"><i class="bi bi-send-fill"></i></button>

                            <div class="emoji-panel" id="line-emoji-panel">`;
        let assets = topWin.AssetsMap || (typeof AssetsMap !== 'undefined' ? AssetsMap : {});
        for(let key in assets) {
            if(key.includes('_表情_')) {
                html += `<div class="emoji-item" onclick="let tw = window.parent || window; tw.insertLineEmoji('${key}', '${assets[key]}')" title="${key}"><img src="${assets[key]}"></div>`;
            }
        }
        html += `           </div>
                        </div>
                    </div>
                 </div>`; // 结束右侧主区

        html += `</div>`; // 结束整体分栏布局

        // ========== 附加：独立的群聊创建弹窗 ==========
        if (!topDoc.getElementById('line-group-modal')) {
            let modalHtml = `
            <div class="line-modal-overlay" id="line-group-modal">
                <div class="line-modal-content">
                    <button class="line-modal-close" onclick="let tw = window.parent || window; tw.closeLineGroupModal()"><i class="bi bi-x-lg"></i></button>
                    <div class="line-modal-header">发起新群聊</div>
                    <input type="text" id="line-group-name" placeholder="输入群聊名称..." style="width:100%; padding:12px; border-radius:12px; border:1px solid #cbd5e1; margin-bottom:15px; font-size:15px; outline:none; background:#f8fafc;">
                    <div class="group-checkbox-list" id="line-group-members"></div>
                    <button class="btn-line-confirm" onclick="let tw = window.parent || window; tw.confirmCreateGroup()">确认创建</button>
                </div>
            </div>`;
            container.insertAdjacentHTML('beforeend', modalHtml);
        }

        container.innerHTML = html;
    };

    // --- 2. 交互逻辑挂载 ---

    // 打开聊天室 (分栏模式下不需要返回按钮，直接右侧切换)
    topWin.openLineChat = function(targetName, type, avatarUrl) {
        topWin.currentChatTarget = targetName;
        let doc = topWin.document || document;

        // 左侧列表高亮切换
        let items = doc.querySelectorAll('.chat-list-item');
        items.forEach(el => el.classList.remove('active'));
        let currentItem = doc.getElementById('list-item-' + targetName);
        if(currentItem) currentItem.classList.add('active');

        // 右侧界面切换
        let emptyState = doc.getElementById('line-empty-state');
        let chatRoom = doc.getElementById('line-chat-room');
        let chatTitle = doc.getElementById('line-chat-title');

        if(emptyState) emptyState.style.display = 'none';
        if(chatRoom) chatRoom.classList.add('active');

        // 渲染标题区
        let titleIcon = '';
        if(type === 'official') titleIcon = '<i class="bi bi-building-fill" style="color:#64748b;"></i> ';
        else if(type === 'group') titleIcon = '<i class="bi bi-people-fill" style="color:#10b981;"></i> ';
        else if(avatarUrl) titleIcon = `<img src="${avatarUrl}" style="width:28px; height:28px; border-radius:50%; object-fit:cover; border:1px solid #e2e8f0;"> `;

        if(chatTitle) chatTitle.innerHTML = titleIcon + targetName;

        let history = doc.getElementById('line-chat-history');
        if(history) history.scrollTop = history.scrollHeight;
    };

    // 发送消息
    topWin.sendLineMsg = function() {
        let doc = topWin.document || document;
        let input = doc.getElementById('line-input-box');
        if(!input) return;
        let text = input.value.trim();
        if(!text) return;
        let history = doc.getElementById('line-chat-history');
        if(history) {
            history.innerHTML += `<div class="bubble-row right"><div class="bubble">${text}</div></div>`;
            history.scrollTop = history.scrollHeight;
        }
        input.value = '';
    };

    // 表情相关
    topWin.toggleLineEmoji = function() {
        let doc = topWin.document || document;
        let emojiPanel = doc.getElementById('line-emoji-panel');
        if(emojiPanel) emojiPanel.classList.toggle('show');
    };

    topWin.insertLineEmoji = function(key, url) {
        let doc = topWin.document || document;
        let history = doc.getElementById('line-chat-history');
        if(!history) return;
        let displayHtml = `<img src="${url}" class="bubble-img">`;
        history.innerHTML += `<div class="bubble-row right"><div class="bubble" style="background:transparent; border:none; padding:0; box-shadow:none;">${displayHtml}</div></div>`;
        history.scrollTop = history.scrollHeight;
        topWin.toggleLineEmoji();
    };

    // --- 3. 群聊模态框逻辑 ---
    topWin.openLineGroupModal = function() {
        let doc = topWin.document || document;
        let listHtml = '';
        let db = topWin.idolDatabase || (typeof idolDatabase !== 'undefined' ? idolDatabase : []);
        let getImgUrl = topWin.getAssetUrl || (typeof window.getAssetUrl === 'function' ? window.getAssetUrl : function(){return '';});

        if(db.length > 0) {
            db.forEach(idol => {
                let cAvatar = getImgUrl(idol.name + "_头像", "avatar");
                listHtml += `
                <div class="group-checkbox-item">
                    <input type="checkbox" id="chk-${idol.name}" value="${idol.name}" style="width:18px; height:18px; cursor:pointer;">
                    <img src="${cAvatar}">
                    <label for="chk-${idol.name}" style="font-size:15px; color:#334155; cursor:pointer; flex:1; font-weight:bold;">${idol.name}</label>
                </div>`;
            });
        }
        let memberList = doc.getElementById('line-group-members');
        let modal = doc.getElementById('line-group-modal');
        if(memberList) memberList.innerHTML = listHtml;
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    };

    topWin.closeLineGroupModal = function() {
        let doc = topWin.document || document;
        let modal = doc.getElementById('line-group-modal');
        if(modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    };

    topWin.confirmCreateGroup = function() {
        let doc = topWin.document || document;
        let nameInput = doc.getElementById('line-group-name');
        if(!nameInput) return;
        let nameVal = nameInput.value.trim();
        if(!nameVal) { alert("请输入群聊名称！"); return; }

        let selected = [];
        doc.querySelectorAll('#line-group-members input:checked').forEach(cb => selected.push(cb.value));
        if(selected.length < 2) { alert("群聊至少需要选择2位联系人！"); return; }

        topWin.customGroups.push({ name: nameVal, members: selected });
        topWin.closeLineGroupModal();

        // 重新渲染 LINE 列表
        let padContactContainer = doc.getElementById('pad-content-contact');
        if(padContactContainer && typeof topWin.renderLineApp === 'function') {
            topWin.renderLineApp(padContactContainer, {}); // 这里可以传入缓存的 parsedSysData
        }
    };

})();
