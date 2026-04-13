# 📚 語文閣樓 - 國小語文互動學習應用

## 快速開始

### 本地測試
直接在瀏覽器中打開 `index.html`：
```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

### 部署到 Vercel

#### 方法 1：通過 Vercel CLI（推薦）
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登錄 Vercel
vercel login

# 部署
vercel --prod
```

#### 方法 2：通過 GitHub（推薦）
```bash
# 1. 創建 GitHub 倉庫：chinese-language-app
# 2. 推送代碼
git remote add origin https://github.com/YOUR_USERNAME/chinese-language-app.git
git branch -M main
git push -u origin main

# 3. 在 Vercel 連接 GitHub 倉庫
# 前往 https://vercel.com → Import Project
```

## 功能概述

### 三種題型
- **易混淆字詞** - 3 選 1 多選題
- **成語理解** - 填空題
- **句式排序** - 拖曳排序題

### 兩種學習模式
- **卡牌模式**：按課程順序逐課學習
- **智慧闖關**：隨機混合所有課程的題目

### 12 課課程
包含國小四年級下學期全部課文

### 年級支持
```
?grade=4-2  # 國小四年級下學期（默認）
?grade=5-1  # 國小五年級上學期
?grade=5-2  # 國小五年級下學期
?grade=6-1  # 國小六年級上學期
?grade=6-2  # 國小六年級下學期
```

## 項目結構

```
chinese-language-app/
├── index.html              # 主應用（完整代碼）
├── chinese_db.json         # 課程數據
├── vercel.json            # Vercel 配置
├── README.md              # 本文件
├── DEPLOYMENT_GUIDE.md    # 詳細部署指南
└── .gitignore
```

## 應用規格

| 項目 | 數值 |
|------|------|
| 總課程數 | 12 課 |
| 易混淆字詞題 | 36 題 |
| 成語理解題 | 36 題 |
| 句式排序題 | 24 題 |
| 總題目數 | 96 題 |
| HTML 大小 | 36.6 KB |
| JSON 大小 | 38.2 KB |
| 無依賴 | ✓ (純靜態 HTML/CSS/JS) |

## 核心功能

### 首頁
- 選擇學習模式
- 動態年級副標題
- 星場背景動畫

### 卡牌模式
- 顯示 12 課課程卡片
- 點擊進入課程
- 該課所有題目混合

### 智慧闖關
- 隨機選題
- 進度追蹤
- 實時反饋

### 答題頁面
- 進度條和題號顯示
- 根據題型動態渲染
- 立即檢查答案
- 顯示解釋和正確答案

### 結果頁面
- 分數圓形進度條
- 正確率統計
- 得分計算
- 計時統計

## 技術棧

- **HTML5** - 結構和語義化標記
- **CSS3** - 漸變、動畫、響應式設計
- **Vanilla JavaScript** - 無任何外部依賴
- **JSON** - 課程數據存儲

### 瀏覽器兼容性
- Chrome/Edge：完全支持
- Firefox：完全支持
- Safari：完全支持
- IE：不支持（使用現代瀏覽器）

## API / 數據格式

### 課程結構
```javascript
{
  "semester": "4下",
  "grade": "4-2",
  "lessons": [
    {
      "lessonId": 1,
      "title": "課文標題",
      "confusingWords": [ ... ],  // 易混淆字詞
      "idioms": [ ... ],           // 成語理解
      "sentences": [ ... ]         // 句式排序
    }
  ]
}
```

## 現場演示

部署後，應用可在以下地址訪問：
```
https://chinese-language-app.vercel.app/
```

支持的 URL 參數示例：
```
https://chinese-language-app.vercel.app/?grade=4-2
https://chinese-language-app.vercel.app/?grade=5-1
```

## 集成到 learning-platform

learning-platform 已配置：
```javascript
'chinese': 'https://chinese-language-app.vercel.app/'
```

用戶流程：
```
學霸星球首頁
  ↓
點擊「國語科」卡片
  ↓
選擇年級（4下、5上、5下、6上、6下）
  ↓
跳轉到 chinese-language-app?grade=XX
```

## 擴展和自定義

### 添加新課程
編輯 `chinese_db.json`，在 `lessons` 數組中添加新課程對象。

### 調整題目
修改 `chinese_db.json` 中的題目內容、選項或答案。

### 修改樣式
編輯 `index.html` 中的 `<style>` 部分，調整顏色、字體等。

### 添加新題型
在 `index.html` 中：
1. 添加 `renderNewType()` 函數
2. 在 `displayQuestion()` 中添加新的 `case` 語句
3. 在 `checkNewType()` 中實現答題檢查邏輯

## 已知限制

1. **數據加載**：JSON 數據通過 fetch 加載，需要正確的 CORS 配置
2. **進度保存**：目前不保存用戶進度（可用 localStorage 擴展）
3. **離線使用**：需要互聯網連接（可用 Service Worker 擴展）
4. **移動優化**：支持移動設備，但大屏幕體驗更佳

## 故障排除

### 「無法加載課程...」
- 檢查 `chinese_db.json` 是否在根目錄
- 確認 JSON 格式正確（使用 JSON 驗證工具）
- 檢查瀏覽器控制台的錯誤信息

### URL 參數無效
- 確認年級參數格式：`?grade=4-2`
- 檢查支持的年級值
- 刪除瀏覽器緩存後重新加載

### 題目無法顯示
- 驗證 JSON 數據結構
- 確認特殊字符編碼（UTF-8）
- 檢查瀏覽器開發者工具

## 許可和使用

自由使用和修改。

## 聯繫

有任何問題或建議，請提交 Issue 或 Pull Request。

---

**最後更新**：2026-04-13  
**版本**：1.0.0  
**狀態**：已上線 ✓
