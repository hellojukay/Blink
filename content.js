// 内容脚本 - 在页面中央显示搜索框
(function() {
    'use strict';

    let searchContainer = null;
    let isVisible = false;
    let historySearch = null;

    // 避免重复注入
    if (window.historyAlfredInjected) return;
    window.historyAlfredInjected = true;

    class InPageHistorySearch {
        constructor() {
            this.searchInput = null;
            this.resultsContainer = null;
            this.allHistory = [];
            this.filteredResults = [];
            this.selectedIndex = -1;
            this.isNavigationMode = false;
            this.isLoading = false;
            
            this.init();
        }

        init() {
            this.createSearchUI();
            this.setupEventListeners();
            this.hide();
        }

        createSearchUI() {
            // 创建主容器
            searchContainer = document.createElement('div');
            searchContainer.id = 'history-alfred-container';
            searchContainer.innerHTML = `
                <div class="history-alfred-backdrop"></div>
                <div class="history-alfred-modal">
                    <div class="search-container">
                        <div class="search-box">
                            <input type="text" id="history-alfred-input" placeholder="搜索浏览历史..." autofocus>
                            <div class="search-icon">🔍</div>
                        </div>
                        <div id="history-alfred-results" class="results-container">
                            <!-- 搜索结果将在这里动态显示 -->
                        </div>
                        <div class="footer">
                            <div class="navigation-mode-indicator" id="navigation-mode-dot" style="display: none;">●</div>
                            <span>Tab 进入选择模式 (请切换到英文输入法)</span>
                            <span>↑↓/jk 选择</span>
                            <span>↵ 打开</span>
                            <span>⌘K/Ctrl+K 清除</span>
                            <span>ESC 关闭</span>
                            <span>Ctrl+Shift+O/Cmd+Shift+O 打开</span>
                        </div>
                    </div>
                </div>
            `;

            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                #history-alfred-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 999999;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }

                #history-alfred-container.active {
                    display: flex;
                }

                .history-alfred-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .history-alfred-modal {
                    position: relative;
                    z-index: 1000000;
                    width: 640px;
                    max-width: 90vw;
                    max-height: 80vh;
                    background: rgba(245, 245, 245, 0.95);
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                    transform: scale(0.95);
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }

                #history-alfred-container.active .history-alfred-modal {
                    transform: scale(1);
                    opacity: 1;
                }

                .search-container {
                    padding: 24px;
                }

                .search-box {
                    position: relative;
                    margin-bottom: 20px;
                }

                #history-alfred-input {
                    width: 100%;
                    padding: 18px 52px 18px 24px;
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 12px;
                    color: #333;
                    font-size: 16px;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                }

                #history-alfred-input:focus {
                    border-color: #007acc;
                    box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                #history-alfred-input::placeholder {
                    color: #999;
                }

                .search-icon {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 18px;
                    opacity: 0.6;
                }

                .results-container {
                    max-height: 400px;
                    overflow-y: auto;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
                }

                .results-container::-webkit-scrollbar {
                    width: 6px;
                }

                .results-container::-webkit-scrollbar-track {
                    background: transparent;
                }

                .results-container::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 3px;
                }

                .result-item {
                    display: flex;
                    align-items: center;
                    padding: 14px 18px;
                    margin-bottom: 6px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
                }

                .result-item:hover {
                    background: rgba(255, 255, 255, 1);
                    transform: translateX(4px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
                }

                .result-item.selected {
                    background: linear-gradient(90deg, #4da6ff, #3399ff);
                    border-color: #66ccff;
                    box-shadow: 0 4px 8px rgba(77, 166, 255, 0.3);
                }

                .result-icon {
                    width: 16px;
                    height: 16px;
                    margin-right: 12px;
                    flex-shrink: 0;
                    border-radius: 2px;
                }

                .result-content {
                    flex: 1;
                    min-width: 0;
                }

                .result-title {
                    font-size: 14px;
                    font-weight: 500;
                    color: #333;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .result-url {
                    font-size: 12px;
                    color: #666;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .result-time {
                    font-size: 11px;
                    color: #999;
                    margin-left: 8px;
                    white-space: nowrap;
                }

                .empty-state {
                    text-align: center;
                    padding: 40px 20px;
                    color: #999;
                    font-size: 14px;
                }

                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 13px;
                    color: #666;
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                    padding-top: 16px;
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 12px;
                    position: relative;
                }

                .footer span {
                    background: rgba(255, 255, 255, 0.6);
                    padding: 4px 12px;
                    border-radius: 20px;
                    backdrop-filter: blur(4px);
                    color: #555;
                }

                .navigation-mode-indicator {
                    color: #4CAF50;
                    font-size: 16px;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 8px;
                }

                .loading {
                    text-align: center;
                    padding: 20px;
                    color: #666666;
                }

                .highlight {
                    background-color: rgba(0, 122, 204, 0.3);
                    padding: 1px 2px;
                    border-radius: 2px;
                }

                /* 动画效果 */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .history-alfred-modal {
                    animation: fadeIn 0.2s ease-out;
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(searchContainer);

            // 获取元素引用
            this.searchInput = document.getElementById('history-alfred-input');
            this.resultsContainer = document.getElementById('history-alfred-results');
        }

        setupEventListeners() {
            // 搜索输入事件
            this.searchInput.addEventListener('input', (e) => {
                this.debounce(this.handleSearch.bind(this), 150)(e.target.value);
            });

            // 键盘导航事件
            this.searchInput.addEventListener('keydown', (e) => {
                this.handleKeyboardNavigation(e);
            });

            // 点击背景关闭
            searchContainer.querySelector('.history-alfred-backdrop').addEventListener('click', () => {
                this.hide();
            });
        }

        async loadHistory() {
            try {
                this.showLoading();
                const historyItems = await chrome.runtime.sendMessage({
                    action: 'searchHistory',
                    text: '',
                    maxResults: 1000
                });

                this.allHistory = historyItems
                    .filter(item => item.url && item.title)
                    .sort((a, b) => b.lastVisitTime - a.lastVisitTime);

                this.hideLoading();
                this.renderResults(this.allHistory.slice(0, 10));
            } catch (error) {
                console.error('加载历史记录失败:', error);
                this.showError('加载历史记录失败');
            }
        }

        handleSearch(query) {
            if (!query.trim()) {
                this.filteredResults = this.allHistory.slice(0, 10);
            } else {
                // 将查询字符串按空格分割成多个关键字
                const searchTerms = query.toLowerCase().split(' ').filter(term => term.trim() !== '');
                
                this.filteredResults = this.allHistory.filter(item => {
                    const title = (item.title || '').toLowerCase();
                    const url = (item.url || '').toLowerCase();
                    
                    // 检查所有关键字是否都在标题或URL中
                    return searchTerms.every(term => 
                        title.includes(term) || url.includes(term)
                    );
                }).slice(0, 20);
            }

            this.selectedIndex = 0;
            this.renderResults(this.filteredResults, query);
        }

        renderResults(results, query = '') {
            if (results.length === 0) {
                this.resultsContainer.innerHTML = `
                    <div class="empty-state">
                        ${query ? '没有找到匹配的结果' : '暂无历史记录'}
                    </div>
                `;
                return;
            }

            const resultsHTML = results.map((item, index) => {
                const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=16`;
                const timeAgo = this.formatTimeAgo(item.lastVisitTime);
                const highlightedTitle = this.highlightText(item.title || item.url, query);
                const highlightedUrl = this.highlightText(item.url, query);

                return `
                    <div class="result-item ${index === this.selectedIndex ? 'selected' : ''}" 
                         data-index="${index}" data-url="${item.url}">
                        <img class="result-icon" src="${faviconUrl}" alt="" onerror="this.style.display='none'">
                        <div class="result-content">
                            <div class="result-title">${highlightedTitle}</div>
                            <div class="result-url">${highlightedUrl}</div>
                        </div>
                        <div class="result-time">${timeAgo}</div>
                    </div>
                `;
            }).join('');

            this.resultsContainer.innerHTML = resultsHTML;

            // 添加点击事件
            this.resultsContainer.querySelectorAll('.result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const url = item.dataset.url;
                    this.openUrl(url);
                });
            });
        }

        handleKeyboardNavigation(e) {
            const maxIndex = this.filteredResults.length - 1;

            // 在输入模式下，只有特定按键才会被处理
            if (!this.isNavigationMode) {
                // Tab键切换到导航模式
                if (e.key === 'Tab') {
                    e.preventDefault();
                    this.isNavigationMode = true;
                    
                    // 显示导航模式指示器
                    const indicator = document.getElementById('navigation-mode-dot');
                    if (indicator) {
                        indicator.style.display = 'flex';
                    }
                    
                    // 尝试重置输入法状态
                    this.searchInput.blur();
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    
                    // 初始化选择索引
                    if (this.filteredResults.length > 0 && this.selectedIndex === -1) {
                        this.selectedIndex = 0;
                        this.updateSelection();
                    }
                    return;
                }
                
                // 其他按键保持在输入模式
                return;
            }

            // 导航模式下的按键处理
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, maxIndex);
                    this.updateSelection();
                    break;
                case 'j':
                    console.log('j key pressed in navigation mode');
                    e.preventDefault();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, maxIndex);
                    this.updateSelection();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                    this.updateSelection();
                    break;
                case 'k':
                    console.log('k key pressed in navigation mode');
                    e.preventDefault();
                    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                    this.updateSelection();
                    break;
                case 'Tab':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                    } else {
                        this.selectedIndex = Math.min(this.selectedIndex + 1, maxIndex);
                    }
                    this.updateSelection();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (this.filteredResults[this.selectedIndex]) {
                        this.openUrl(this.filteredResults[this.selectedIndex].url);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.hide();
                    break;
                case 'K':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        this.searchInput.value = '';
                        this.handleSearch('');
                    }
                    break;
                default:
                    // 其他按键切换回输入模式
                    e.preventDefault(); // 防止默认行为
                    this.isNavigationMode = false;
                    // 隐藏导航模式指示器
                    const indicator = document.getElementById('navigation-mode-dot');
                    if (indicator) {
                        indicator.style.display = 'none';
                    }
                    this.searchInput.focus();
                    break;
            }
        }

        updateSelection() {
            const items = this.resultsContainer.querySelectorAll('.result-item');
            items.forEach((item, index) => {
                item.classList.toggle('selected', index === this.selectedIndex);
            });

            const selectedItem = items[this.selectedIndex];
            if (selectedItem) {
                selectedItem.scrollIntoView({ block: 'nearest' });
            }
        }

        openUrl(url) {
            window.open(url, '_blank');
            this.hide();
        }

        highlightText(text, query) {
            if (!query.trim()) return text;
            
            const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        }

        escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        formatTimeAgo(timestamp) {
            const now = Date.now();
            const diff = now - timestamp;
            
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) return `${days}天前`;
            if (hours > 0) return `${hours}小时前`;
            if (minutes > 0) return `${minutes}分钟前`;
            return '刚刚';
        }

        showLoading() {
            this.resultsContainer.innerHTML = '<div class="loading">加载中...</div>';
        }

        hideLoading() {
            // 加载完成后自动隐藏
        }

        showError(message) {
            this.resultsContainer.innerHTML = `
                <div class="empty-state">
                    ${message}
                </div>
            `;
        }

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        async show() {
            if (!isVisible) {
                searchContainer.classList.add('active');
                isVisible = true;
                
                // 重置模式为输入模式
                this.isNavigationMode = false;
                this.selectedIndex = -1;
                
                // 隐藏导航模式指示器
                const indicator = document.getElementById('navigation-mode-dot');
                if (indicator) {
                    indicator.style.display = 'none';
                }
                
                // 加载历史记录
                if (this.allHistory.length === 0) {
                    await this.loadHistory();
                }
                
                // 聚焦输入框
                setTimeout(() => {
                    this.searchInput.focus();
                    this.searchInput.select();
                }, 100);
            }
        }

        hide() {
            if (isVisible) {
                searchContainer.classList.remove('active');
                isVisible = false;
                this.searchInput.value = '';
                this.handleSearch('');
                this.selectedIndex = -1;
                this.isNavigationMode = false;
                
                // 隐藏导航模式指示器
                const indicator = document.getElementById('navigation-mode-dot');
                if (indicator) {
                    indicator.style.display = 'none';
                }
            }
        }

        toggle() {
            if (isVisible) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    // 初始化搜索实例
    historySearch = new InPageHistorySearch();

    // 监听快捷键 - 改为 Ctrl+Shift+O 和 Command+Shift+O
    document.addEventListener('keydown', (e) => {
        // 检查快捷键组合：Ctrl+Shift+O (Windows/Linux) 或 Command+Shift+O (Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'O') {
            e.preventDefault();
            e.stopPropagation();
            historySearch.toggle();
        }

        // 检查快捷键组合：Cmd/Ctrl + K（备用快捷键）
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            // 如果焦点在输入框中，不触发
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            historySearch.toggle();
        }
    });

    // 监听来自后台脚本的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'toggleSearch') {
            historySearch.toggle();
        }
    });

    console.log('History Alfred 内容脚本已加载，快捷键：Ctrl+Shift+O 或 Command+Shift+O');
})();