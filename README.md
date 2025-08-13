# History Alfred - Chrome 历史记录搜索插件

一个类似 Alfred 的 Chrome 浏览器历史记录搜索插件，提供快速、优雅的历史记录搜索体验。

## 功能特点

- 🔍 **快速搜索**: 实时搜索浏览历史记录，支持多关键字搜索（使用空格分隔）
- ⌨️ **快捷键支持**: 
  - `Ctrl+Shift+O` - 主快捷键（Windows/Linux）
  - `Cmd+Shift+O` - 主快捷键（Mac）
  - `Cmd+K` - 备用快捷键（Mac）
  - `Ctrl+K` - 备用快捷键（Windows/Linux）
- 🎯 **智能导航**: 
  - 上下箭头键或 J/K 键切换结果（类似 Vim）
  - Tab 键快速切换
  - Enter 键直接打开页面
- 🎨 **优雅界面**: 类似 Mac Spotlight 的设计风格，明亮清新的界面配色
- ⚡ **实时预览**: 显示网站图标和最后访问时间
- 🖥️ **页面中央**: 搜索框显示在浏览器页面正中央
- 🟢 **选择模式状态指示**: 绿色小点提示当前处于选择模式

## 安装方法

### 1. 开发者模式安装
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目文件夹

### 2. 设置快捷键（可选）
1. 安装后访问 `chrome://extensions/shortcuts`
2. 找到 "History Alfred"
3. 可以自定义激活快捷键

## 使用方法

### 快捷键激活
- **主快捷键**: 
  - Windows/Linux: `Ctrl+Shift+O`
  - Mac: `Cmd+Shift+O`
- **备用快捷键**: 
  - Mac: `Cmd+K`
  - Windows/Linux: `Ctrl+K`

### 操作指南
- **搜索**: 直接输入关键词，支持多关键字搜索（使用空格分隔）
- **导航**: 使用 ↑↓ 箭头键、Tab 键或 J/K 键（类似 Vim）
  - **注意**: 使用 J/K 键导航前请切换到英文输入法，避免输入法干扰
- **打开**: 按 Enter 键打开选中的页面
- **清除**: `Cmd+K` 或 `Ctrl+K` 清除搜索框
- **退出**: 按 Esc 键关闭搜索框
- **点击**: 点击搜索结果直接打开
- **背景**: 点击灰色背景区域关闭搜索框

## 技术特性

- **Manifest V3**: 使用最新的 Chrome 扩展标准
- **模糊搜索**: 支持标题和 URL 的模糊匹配
- **多关键字搜索**: 支持使用空格分隔的多个关键字搜索
- **性能优化**: 智能缓存和分页加载
- **响应式设计**: 适配不同屏幕尺寸
- **页面集成**: 直接在页面内显示，无需 popup

## 文件结构

```
History-Alfred/
├── manifest.json          # 插件配置文件
├── background.js          # 后台脚本
├── content.js             # 内容脚本（主功能）
├── content.css            # 内容脚本样式
├── icons/                 # 图标文件夹
│   ├── icon16.png         # 16x16 图标
│   ├── icon48.png         # 48x48 图标
│   └── icon128.png        # 128x128 图标
└── README.md              # 说明文档
```

## 开发说明

### 技术栈
- HTML5 + CSS3 + JavaScript (ES6+)
- Chrome Extension API
- Manifest V3

### 浏览器兼容性
- Chrome 88+
- Edge 88+
- 其他基于 Chromium 的浏览器

### 快捷键说明
- **Ctrl+Shift+O/Cmd+Shift+O**: 这是主要的激活快捷键，需要按住 Ctrl/Cmd 和 Shift 键再按字母 O（大写）
- **Cmd+K/Ctrl+K**: 这是备用快捷键，适用于习惯 Alfred 的用户

## 更新日志

### v1.1.0
- ✨ 新增多关键字搜索功能（使用空格分隔）
- 🐛 修复Tab键切换导航模式时输入法未切换为英文导致输出字符的问题
- 🎨 优化UI设计，采用类似 Mac Spotlight 的明亮清新风格
- 🟢 增加选择模式状态指示（绿色小点提示）

### v1.0.0
- ✨ 初始版本发布
- 🔍 基础搜索功能
- ⌨️ Ctrl+Shift+O/Cmd+Shift+O 快捷键支持
- 🎨 Alfred 风格界面
- 🖥️ 页面中央显示搜索框

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License