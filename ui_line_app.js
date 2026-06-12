// ==========================================
// 秋青子专属终端：LINE 通讯录模块 (自带完美样式适配版)
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

    // --- 0. 注入 LINE 专属完美 CSS 样式 ---
    if (!topDoc.getElementById('line-app-style')) {
        const style = topDoc.createElement('style');
        style.id = 'line-app-style';
        style.innerHTML = `
            .pad-contact-wrap { padding: 20px; padding-bottom: 35px; display: flex; flex-direction: column; height: 100%; overflow: hidden; box-sizing: border-box; background: #f8fafc; }
            .chat-top-actions { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 0 5px; align-items: center; flex-shrink: 0;}
            .btn-create-group { background: #10b981; color: #fff; border: none; padding: 10px 18px; border-radius: 20px; font-weight: bold; font-size: 14px; cursor: pointer; box-shadow: 0 4px 10px rgba(16,185,129,0.2); transition: 0.2s; display: flex; align-items: center; gap: 6px;}
            .btn-create-group:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 6px 15px rgba(16,185,129,0.3);}

            .chat-list { display: flex; flex-direction: column; gap: 12px; overflow-y: auto; padding-bottom: 20px; flex: 1;}
            .chat-list::-webkit-scrollbar { width: 6px; }
            .chat-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
            .chat-list-item { display: flex; align-items: center; gap: 15px; background: #fff; padding: 15px; border-radius: 16px; cursor: pointer; transition: 0.2s; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 2px 5px rgba(0,0,0,0.02);}
            .chat-list-item:hover { transform: translateX(5px); box-shadow: 0 6px 15px rgba(0,0,0,0.05); border-color: #10b981;}
            .chat-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; object-position: top; border: 2px solid #e2e8f0; background: #f1f5f9; flex-shrink: 0;}
            .chat-info { flex: 1; min-width: 0; }
            .chat-name { font-size: 17px; font-weight: bold; color: #1e293b; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
            .chat-preview { font-size: 14px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }

            .chat-room { display: none; flex-direction: column; height: 100%; overflow: hidden; background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05);}
            .chat-room.active { display: flex; }
            .chat-room-header { display: flex; align-items: center; gap: 12px; padding: 15px 20px; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); flex-shrink: 0;}
            .btn-chat-back { background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-weight: bold; color: #475569; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: 0.2s;}
            .btn-chat-back:hover { background: #e2e8f0; color: #10b981; }
            .chat-room-title { font-weight: 900; font-size: 18px; color: #1e293b; }

            .chat-history { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; padding: 20px; background: #f8fafc;}
            .chat-history::-webkit-scrollbar { width: 6px; }
            .chat-history::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
            .bubble-row { display: flex; flex-direction: column; width: 100%; }
            .bubble-row.left { align-items: flex-start; }
            .bubble-row.right { align-items: flex-end; }
            .bubble { max-width: 75%; padding: 12px 18px; border-radius: 18px; font-size: 15px; line-height: 1.6; word-wrap: break-word; box-shadow: 0 2px 5px rgba(0,0,0,0.02);}
            .bubble-row.left .bubble { background: #fff; border: 1px solid rgba(0,0,0,0.05); border-bottom-left-radius: 4px; color: #334155; }
            .bubble-row.right .bubble { background: #10b981; color: #fff; border-bottom-right-radius: 4px; }
            /* 严格限制表情包图片的大小，防止溢出 */
            .bubble-img { max-width: 160px; max-height: 160px; object-fit: contain; border-radius: 12px; margin-top: 4px; background: transparent;}

            .chat-input-area { display: flex; align-items: center; gap: 12px; background: #fff; padding: 15px 20px; border-top: 1px solid rgba(0,0,0,0.05); position: relative; flex-shrink: 0;}
            .btn-emoji { font-size: 24px; cursor: pointer; transition: 0.2s; user-select: none; display: flex; align-items: center; color: #94a3b8;}
            .btn-emoji:hover { transform: scale(1.1); color: #10b981;}
            .chat-input { flex: 1; border: none; background: #f1f5f9; outline: none; padding: 12px 20px; font-size: 15px; border-radius: 24px; color: #334155; transition: 0.2s;}
            .chat-input:focus { background: #e2e8f0; }
            .btn-send { background: #10b981; color: #fff; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; transition: 0.2s; box-shadow: 0 4px 10px rgba(16,185,129,0.2);}
            .btn-send:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 6px 15px rgba(16,185,129,0.3);}

            .emoji-panel { position: absolute; bottom: 80px; left: 20px; width: 320px; background: #fff; border-radius: 16px; padding: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: none; grid-template-columns: repeat(3, 1fr); gap: 12px; border: 1px solid rgba(0,0,0,0.05); z-index: 30; max-height: 280px; overflow-y: auto;}
            .emoji-panel.show { display: grid; animation: fadeIn 0.2s ease;}
            .emoji-item { cursor: pointer; text-align: center; transition: 0.2s; background: #f8fafc; border-radius: 12px; padding: 8px; border: 1px solid transparent; display: flex; align-items: center; justify-content: center; aspect-ratio: 1;}
            .emoji-item:hover { transform: scale(1.05); border-color: #10b981; background: #fff;}
            .emoji-item img { width: 100%; height: 100%; object-fit: contain; }
        `;
        topDoc.head.appendChild(style);
    }

    // --- 1. 渲染 LINE 主界面 ---
    topWin.renderLineApp = function(container, parsedSysData) {
        if (!container) return;

        let db = topWin.idolDatabase || (typeof idolDatabase !== 'undefined' ? idolDatabase : []);
        let cGroups = topWin.customGroups || [];
        let getImgUrl = topWin.getAssetUrl || (typeof window.getAssetUrl === 'function' ? window.getAssetUrl : function(){return '';});

        // 外层加上 pad-contact-wrap 样式类
        var contactHtml = '<div class="pad-contact-wrap">';

        contactHtml += `<div class="chat-top-actions">
                            <span style="font-weight:900; color:#1e293b; font-size:18px;"><i class="bi bi-people-fill" style="color:#10b981;"></i> 好友列表</span>
                            <button class="btn-create-group" onclick="let tw = window.parent || window; tw.openGroupModal()"><i class="bi bi-person-plus-fill"></i> 新群聊</button>
                         </div>`;

        contactHtml += '<div id="contact-list" class="chat-list">';

        cGroups.forEach(g => {
            contactHtml += `
            <div class="chat-list-item" onclick="let tw = window.parent || window; tw.openChatRoom('${g.name}')">
                <div class="chat-avatar" style="display:flex; align-items:center; justify-content:center; font-size:28px; background: linear-gradient(135deg, #34d399, #10b981); color:#fff;"><i class="bi bi-people-fill"></i></div>
                <div class="chat-info">
                    <div class="chat-name">${g.name}</div>
                    <div class="chat-preview">群聊已创建，快来聊天吧</div>
                </div>
            </div>`;
        });

        if(db.length > 0) {
            db.forEach(idol => {
                let isNewMsg = (parsedSysData && parsedSysData.contact && parsedSysData.contact.includes(idol.name));
                let previewText = isNewMsg ? parsedSysData.contact.split('：')[1] : '点击进入聊天室...';
                let nameColor = isNewMsg ? 'color:#10b981;' : '';
                let fontWeight = isNewMsg ? 'font-weight:bold; color:#334155;' : '';
                let cAvatar = getImgUrl(idol.name + "_头像", "avatar");

                contactHtml += `
                <div class="chat-list-item" onclick="let tw = window.parent || window; tw.openChatRoom('${idol.name}')">
                    <img src="${cAvatar}" class="chat-avatar">
                    <div class="chat-info">
                        <div class="chat-name" style="${nameColor}">${idol.name}</div>
                        <div class="chat-preview" style="${fontWeight}">${previewText}</div>
                    </div>
                    ${isNewMsg ? '<div style="width:10px; height:10px; border-radius:50%; background:#ef4444; box-shadow:0 0 5px #ef4444;"></div>' : ''}
                </div>`;
            });
        } else {
            contactHtml += '<div style="text-align:center; padding:50px; color:#94a3b8; font-weight:bold;"><i class="bi bi-inbox" style="font-size:32px; display:block; margin-bottom:10px;"></i> 通讯录空空如也</div>';
        }
        contactHtml += '</div>';

        // 聊天室界面 (默认隐藏)
        contactHtml += '<div id="chat-room" class="chat-room">';
        contactHtml += '<div class="chat-room-header"><button class="btn-chat-back" onclick="let tw = window.parent || window; tw.closeChatRoom()"><i class="bi bi-chevron-left"></i></button><div class="chat-room-title" id="chat-target-name">未知联系人</div></div>';

        contactHtml += '<div class="chat-history" id="chat-history">';
        if(parsedSysData && parsedSysData.contact && parsedSysData.contact !== "无") {
            var parts = parsedSysData.contact.split('：');
            if(parts.length >= 2) {
                let msgContent = parts.slice(1).join('：');
                let emojiMatch = msgContent.match(/\[(表情_[^\]]+)\]/);
                let finalHtml = msgContent;
                if(emojiMatch) {
                    let eKey = emojiMatch[1];
                    let eUrl = getImgUrl(eKey);
                    // 给图片加上 bubble-img 类，受到完美 CSS 限制
                    if(eUrl) finalHtml = msgContent.replace(emojiMatch[0], `<br><img src="${eUrl}" class="bubble-img">`);
                }
                contactHtml += `<div class="bubble-row left"><div class="bubble">${finalHtml}</div></div>`;
            }
        } else {
            contactHtml += `<div style="text-align:center; font-size:13px; color:#cbd5e1; margin-top:30px; font-weight:bold;">没有更多历史消息了</div>`;
        }
        contactHtml += '</div>';

        contactHtml += '<div class="chat-input-area">';
        contactHtml += '<div class="btn-emoji" onclick="let tw = window.parent || window; tw.toggleEmojiPanel()"><i class="bi bi-emoji-smile-fill"></i></div>';
        contactHtml += '<input type="text" id="chat-input-box" class="chat-input" placeholder="输入回复内容..." onkeypress="if(event.keyCode==13){let tw = window.parent || window; tw.sendLineMessage()}">';
        contactHtml += '<button class="btn-send" onclick="let tw = window.parent || window; tw.sendLineMessage()"><i class="bi bi-send-fill"></i></button>';

        contactHtml += `<div class="emoji-panel" id="emoji-panel">`;
        let assets = topWin.AssetsMap || (typeof AssetsMap !== 'undefined' ? AssetsMap : {});
        for(let key in assets) {
            if(key.includes('_表情_')) {
                contactHtml += `<div class="emoji-item" onclick="let tw = window.parent || window; tw.insertEmojiImage('${key}', '${assets[key]}')" title="${key}"><img src="${assets[key]}"></div>`;
            }
        }
        contactHtml += `</div>`;

        contactHtml += '</div></div></div>'; // 闭合 chat-room 和 pad-contact-wrap
        container.innerHTML = contactHtml;
    };

    // --- 2. 交互逻辑挂载 ---
    topWin.openChatRoom = function(targetName) {
        topWin.currentChatTarget = targetName;
        let doc = topWin.document || document;
        let contactList = doc.getElementById('contact-list');
        let chatTargetName = doc.getElementById('chat-target-name');
        let chatRoom = doc.getElementById('chat-room');
        if(contactList) contactList.style.display = 'none';
        if(chatTargetName) chatTargetName.innerText = targetName;
        if(chatRoom) chatRoom.classList.add('active');

        // 滚动到底部
        let history = doc.getElementById('chat-history');
        if(history) history.scrollTop = history.scrollHeight;
    };

    topWin.closeChatRoom = function() {
        let doc = topWin.document || document;
        let chatRoom = doc.getElementById('chat-room');
        let contactList = doc.getElementById('contact-list');
        if(chatRoom) chatRoom.classList.remove('active');
        if(contactList) contactList.style.display = 'flex';

        // 关闭表情面板
        let emojiPanel = doc.getElementById('emoji-panel');
        if(emojiPanel) emojiPanel.classList.remove('show');
    };

    topWin.toggleEmojiPanel = function() {
        let doc = topWin.document || document;
        let emojiPanel = doc.getElementById('emoji-panel');
        if(emojiPanel) emojiPanel.classList.toggle('show');
    };

    topWin.insertEmojiImage = function(key, url) {
        let doc = topWin.document || document;
        let history = doc.getElementById('chat-history');
        if(!history) return;
        let displayHtml = `<img src="${url}" class="bubble-img">`;
        history.innerHTML += `<div class="bubble-row right"><div class="bubble" style="background:transparent; border:none; padding:0; box-shadow:none;">${displayHtml}</div></div>`;
        history.scrollTop = history.scrollHeight;
        topWin.toggleEmojiPanel();
    };

    topWin.sendLineMessage = function() {
        let doc = topWin.document || document;
        let input = doc.getElementById('chat-input-box');
        if(!input) return;
        let text = input.value.trim();
        if(!text) return;
        let history = doc.getElementById('chat-history');
        if(history) {
            history.innerHTML += `<div class="bubble-row right"><div class="bubble">${text}</div></div>`;
            history.scrollTop = history.scrollHeight;
        }
        input.value = '';
    };

    // 兼容向下暴露
    window.renderLineApp = topWin.renderLineApp;
    window.openChatRoom = topWin.openChatRoom;
    window.closeChatRoom = topWin.closeChatRoom;
    window.toggleEmojiPanel = topWin.toggleEmojiPanel;
    window.insertEmojiImage = topWin.insertEmojiImage;
    window.sendLineMessage = topWin.sendLineMessage;

})();
