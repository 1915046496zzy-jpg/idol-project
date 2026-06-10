// ====== message_sender.js ======

class MessageSender {
    constructor() {
        console.log('【秋青子终端】消息发送器初始化完成');
    }

    /**
     * 发送消息到 SillyTavern 原生聊天框
     * @param {string} message - 要发送的指令或对话
     */
    async sendToChat(message) {
        try {
            // 突破 iframe 寻找酒馆的真实 document
            let targetDoc = document;
            if (window.parent && window.parent !== window) {
                targetDoc = window.parent.document;
            }

            // 寻找酒馆原生的输入框和发送按钮
            const inputArea = targetDoc.getElementById('send_textarea');
            const sendBtn = targetDoc.getElementById('send_but');

            if (!inputArea || !sendBtn) {
                console.error('❌ 找不到酒馆的输入框或发送按钮！');
                // 降级方案：让用户手动复制
                prompt("无法自动填入，请手动复制发送：", message);
                return false;
            }

            if (inputArea.disabled || sendBtn.classList.contains('disabled')) {
                console.warn('⚠️ 酒馆输入框或按钮当前被禁用（可能正在生成回复）');
                return false;
            }

            // 追加消息到输入框
            const existingValue = inputArea.value;
            inputArea.value = existingValue ? existingValue + '\n' + message : message;

            // 触发 input 和 change 事件，让酒馆的前端框架察觉到内容变化
            inputArea.dispatchEvent(new Event('input', { bubbles: true }));
            inputArea.dispatchEvent(new Event('change', { bubbles: true }));

            // 稍微等待一下，确保事件被处理，然后点击发送
            await new Promise(resolve => setTimeout(resolve, 300));
            sendBtn.click();

            console.log('✅ 指令已自动发送：', message);
            return true;

        } catch (error) {
            console.error('❌ 发送消息失败:', error);
            return false;
        }
    }
}

// 挂载到全局
window.qingziSender = new MessageSender();

// 覆盖我们之前的旧版 sendAction 函数
window.sendAction = function(text) {
    // 自动包装成系统触发指令格式
    let formattedText = `/send ${text}|/trigger`;
    window.qingziSender.sendToChat(formattedText);

    // 如果哥哥有自定义的弹窗提示函数，可以在这里调用
    // showToast("正在执行指令...");
};
