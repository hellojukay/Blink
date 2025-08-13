// 后台服务工作线程
chrome.runtime.onInstalled.addListener(() => {
    console.log('History Alfred 插件已安装');
});

// 监听快捷键命令
chrome.commands.onCommand.addListener((command) => {
    if (command === 'open-history-search') {
        // 向当前活动标签页发送消息
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSearch' });
            }
        });
    }
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'searchHistory') {
        // 搜索历史记录
        chrome.history.search({
            text: request.text || '',
            maxResults: request.maxResults || 1000,
            startTime: Date.now() - (30 * 24 * 60 * 60 * 1000) // 最近30天
        }, (results) => {
            // 按访问时间排序，最新的在前面
            const sortedResults = results
                .filter(item => item.url && item.title)
                .sort((a, b) => b.lastVisitTime - a.lastVisitTime);
            
            sendResponse(sortedResults);
        });
        
        return true; // 保持消息通道开放，用于异步响应
    }
});

// 清理旧的历史记录（可选）
chrome.runtime.onStartup.addListener(() => {
    console.log('History Alfred 插件启动');
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 可以在这里添加额外的逻辑
});