// ==========================================
// 秋青子专属终端：LINE 通讯录模块 (ui_line_app.js)
// ==========================================
(function() {
    let topWin;
    try { topWin = window.parent || window; } catch(e) { topWin = window; }
    if (!topWin.IdolProjectData) topWin.IdolProjectData = {};
    if (!topWin.IdolProjectData.customGroups) topWin.IdolProjectData.customGroups = [];

    topWin.currentChatTarget = "";

    // --- 1. 渲染 LINE 主界面 ---
    topWin.renderLineApp = function(container, parsedSysData) {
        if (!container) return;

        // 从全局仓库获取数据
        let db = topWin.IdolProjectData.idolDatabase || [];
        let customGroups = topWin.IdolProjectData.customGroups || [];
        let getImgUrl = topWin.getAssetUrl || (typeof window.getAssetUrl === 'function' ? window.getAssetUrl : function(){return '';});

        var contactHtml = '';

        // 顶部操作栏
        contactHtml += `<div class="chat-top-actions">
                            <span style="font-weight:bold; color:#475569; font-size:16px;"><i class="bi bi-people-fill"></i> 联系人列表</span>
                            <button class="btn-create-group" onclick="let tw = window.parent || window; tw.openGroupModal()"><i class="bi bi-plus-circle-fill"></i> 发起群聊</button>
                         </div>`;

        // 联系人列表
        contactHtml += '<div id="contact-list" class="chat-list">';

        // 渲染群聊
        customGroups.forEach(g => {
            contactHtml += `
            <div class="chat-list-item" onclick="let tw = window.parent || window; tw.openChatRoom('${g.name}')">
                <div class="chat-avatar" style="display:flex; align-items:center; justify-content:center; font-size:28px; background:#10b981; color:#fff;"><i class="bi bi-people-fill"></i></div>
                <div class="chat-info">
                    <div class="chat-name">${g.name}</div>
                    <div class="chat-preview">群聊已创建</div>
                </div>
            </div>`;
        });

        // 渲染偶像好友
        if(db.length > 0) {
            db.forEach(idol => {
                let isNewMsg = (parsedSysData && parsedSysData.contact && parsedSysData.contact.includes(idol.name));
                let previewText = isNewMsg ? parsedSysData.contact.split('：')[1] : '点击进入聊天室...';
                let nameColor = isNewMsg ? 'color:var(--theme-text-main, #db2777);' : '';
                let cAvatar = getImgUrl(idol.name + "_头像", "avatar");

                contactHtml += `
                <div class="chat-list-item" onclick="let tw = window.parent || window; tw.openChatRoom('${idol.name}')">
                    <img src="${cAvatar}" class="chat-avatar">
                    <div class="chat-info">
                        <div class="chat-name" style="${nameColor}">${idol.name}</div>
                        <div class="chat-preview" style="font-weight:${isNewMsg?'bold':'normal'}">${previewText}</div>
                    </div>
                </div>`;
            });
        } else {
            contactHtml += '<div style="text-align:center; padding:50px; color:#94a3b8; font-weight:bold;"><i class="bi bi-phone-fill"></i> 通讯录为空</div>';
        }
        contactHtml += '</div>';

        // 聊天室界面
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
                    if(eUrl) finalHtml = msgContent.replace(emojiMatch[0], `<br><img src="${eUrl}" class="bubble-img">`);
                }
                contactHtml += `<div class="bubble-row left"><div class="bubble">${finalHtml}</div></div>`;
            }
        } else {
            contactHtml += `<div style="text-align:center; font-size:13px; color:#cbd5e1; margin-top:30px;">没有更多历史消息了</div>`;
        }
        contactHtml += '</div>';

        // 输入区
        contactHtml += '<div class="chat-input-area">';
        contactHtml += '<div class="btn-emoji" onclick="let tw = window.parent || window; tw.toggleEmojiPanel()"><i class="bi bi-emoji-smile"></i></div>';
        contactHtml += '<input type="text" id="chat-input-box" class="chat-input" placeholder="输入回复内容...">';
        contactHtml += '<button class="btn-send" onclick="let tw = window.parent || window; tw.sendLineMessage()"><i class="bi bi-send-fill"></i></button>';

        // 表情面板
        contactHtml += `<div class="emoji-panel" id="emoji-panel">`;
        let assets = topWin.IdolProjectData.AssetsMap || (typeof AssetsMap !== 'undefined' ? AssetsMap : {});
        for(let key in assets) {
            if(key.includes('_表情_')) {
                contactHtml += `<div class="emoji-item" onclick="let tw = window.parent || window; tw.insertEmojiImage('${key}', '${assets[key]}')" title="${key}"><img src="${assets[key]}"></div>`;
            }
        }
        contactHtml += `</div>`;

        contactHtml += '</div>';
        contactHtml += '</div>';

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
    };

    topWin.closeChatRoom = function() {
        let doc = topWin.document || document;
        let chatRoom = doc.getElementById('chat-room');
        let contactList = doc.getElementById('contact-list');
        if(chatRoom) chatRoom.classList.remove('active');
        if(contactList) contactList.style.display = 'flex';
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
        history.innerHTML += `<div class="bubble-row right"><div class="bubble">${displayHtml}</div></div>`;
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

    topWin.openGroupModal = function() {
        let doc = topWin.document || document;
        let getImgUrl = topWin.getAssetUrl || (typeof window.getAssetUrl === 'function' ? window.getAssetUrl : function(){return '';});
        let db = topWin.IdolProjectData.idolDatabase || [];
        let listHtml = '';
        db.forEach(idol => {
            let cAvatar = getImgUrl(idol.name + "_头像", "avatar");
            listHtml += `
            <div class="group-checkbox-item">
                <input type="checkbox" id="chk-${idol.name}" value="${idol.name}">
                <img src="${cAvatar}">
                <label for="chk-${idol.name}" style="font-size:15px; color:#334155;">${idol.name}</label>
            </div>`;
        });
        let groupMembersList = doc.getElementById('group-members-list');
        let modalGroup = doc.getElementById('modal-group');
        if(groupMembersList) groupMembersList.innerHTML = listHtml;
        if(modalGroup) {
            modalGroup.style.display = 'flex';
            setTimeout(() => modalGroup.classList.add('active'), 10);
        }
    };

    topWin.createGroup = function() {
        let doc = topWin.document || document;
        let nameInput = doc.getElementById('group-name-input');
        if(!nameInput) return;
        let nameVal = nameInput.value.trim();
        if(!nameVal) {
            if(topWin.showToast) topWin.showToast("请输入群聊名称！");
            return;
        }

        let selected = [];
        doc.querySelectorAll('#group-members-list input:checked').forEach(cb => selected.push(cb.value));
        if(selected.length < 2) {
            if(topWin.showToast) topWin.showToast("群聊至少需要选择2位联系人！");
            return;
        }

        topWin.IdolProjectData.customGroups.push({ name: nameVal, members: selected });

        let modalGroup = doc.getElementById('modal-group');
        if(modalGroup) {
            modalGroup.classList.remove('active');
            setTimeout(() => modalGroup.style.display = 'none', 300);
        }

        if(topWin.showToast) topWin.showToast("群聊创建成功！");

        // 重新渲染 LINE 界面以显示新群聊
        let padContactContainer = doc.getElementById('pad-content-contact');
        if (topWin.renderLineApp && padContactContainer) {
            topWin.renderLineApp(padContactContainer, topWin.IdolProjectData.parsedSysData || {});
        }
    };

    // --- 3. 兼容向下暴露 ---
    window.renderLineApp = topWin.renderLineApp;
    window.openChatRoom = topWin.openChatRoom;
    window.closeChatRoom = topWin.closeChatRoom;
    window.toggleEmojiPanel = topWin.toggleEmojiPanel;
    window.insertEmojiImage = topWin.insertEmojiImage;
    window.sendLineMessage = topWin.sendLineMessage;
    window.openGroupModal = topWin.openGroupModal;
    window.createGroup = topWin.createGroup;

})();
