# History Alfred - Chrome History Search Extension

A Chrome browser extension that provides a fast and elegant history search experience, similar to Alfred.

## Features

- 🔍 **Fast Search**: Real-time search through browsing history, supports multi-keyword search (separated by spaces)
- ⌨️ **Keyboard Shortcuts**:
  - `Ctrl+Shift+O` - Primary shortcut (Windows/Linux)
  - `Cmd+Shift+O` - Primary shortcut (Mac)
  - `Cmd+K` - Alternative shortcut (Mac)
  - `Ctrl+K` - Alternative shortcut (Windows/Linux)
- 🎯 **Smart Navigation**:
  - Use ↑/↓ arrow keys or `J`/`K` keys to navigate results (Vim-style)
  - `Tab` key for quick switching
  - `Enter` to open the selected page
- 🎨 **Elegant UI**: Mac Spotlight-inspired design with a clean and fresh interface
- ⚡ **Live Preview**: Displays website favicons and last visited time
- 🖥️ **Centered Display**: Search box appears in the center of the browser page
- 🟢 **Selection Mode Indicator**: A small green dot indicates when selection mode is active

## Installation

### 1. Developer Mode Installation

1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked"
5. Select the project folder

### 2. Set Up Keyboard Shortcuts (Optional)

1. After installation, go to `chrome://extensions/shortcuts`
2. Find **"History Alfred"**
3. Customize the activation shortcut as needed

## How to Use

### Activation Shortcuts

- **Primary Shortcut**:
  - Windows/Linux: `Ctrl+Shift+O`
  - Mac: `Cmd+Shift+O`

- **Alternative Shortcut**:
  - Mac: `Cmd+K`
  - Windows/Linux: `Ctrl+K`

### Usage Guide

- **Search**: Type keywords directly. Supports multi-keyword search (separated by spaces)
- **Navigation**: Use ↑/↓ arrow keys, `Tab`, or `J`/`K` keys (Vim-style)
  - ⚠️ *Note*: Switch to English input method before using `J`/`K` to avoid input interference
- **Open**: Press `Enter` to open the selected page
- **Clear**: Press `Cmd+K` or `Ctrl+K` to clear the search box
- **Exit**: Press `Esc` to close the search box
- **Click**: Click on a search result to open it directly
- **Background**: Click the gray background area to close the search box

## Technical Features

- **Manifest V3**: Built using the latest Chrome extension standard
- **Fuzzy Search**: Supports fuzzy matching for titles and URLs
- **Multi-keyword Search**: Supports multiple keywords separated by spaces
- **Performance Optimization**: Smart caching and paginated loading
- **Responsive Design**: Adapts to various screen sizes
- **Page Integration**: Displays directly on the page without using a popup


