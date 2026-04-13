# 語文科應用部署指南

## 專案概述

**語文閣樓** - 國小語文互動學習應用
- 應用名稱：chinese-language-app
- 部署位置：Vercel
- 預計 URL：https://chinese-language-app.vercel.app

## 本地開發結構

```
chinese-language-app/
├── index.html (36KB - 完整應用)
├── chinese_db.json (38KB - 12課課程數據)
├── vercel.json (配置)
├── .gitignore
└── .git/ (本地倉庫)
```

## 部署步驟

### 1. 在 GitHub 上創建倉庫
```bash
# 前往 https://github.com/blacKgreYcAt
# 新建倉庫，名稱為：chinese-language-app
```

### 2. 設置遠程倉庫
```bash
cd chinese-language-app

# 移除現有的遠程倉庫（如果有）
git remote remove origin

# 添加新的遠程倉庫
git remote add origin https://github.com/blacKgreYcAt/chinese-language-app.git

# 設置主分支
git branch -M main

# 首次推送
git push -u origin main
```

### 3. 在 Vercel 上部署
1. 登錄 Vercel (https://vercel.com)
2. 點擊「New Project」
3. 選擇 GitHub 倉庫 `chinese-language-app`
4. 配置如下：
   - Framework Preset: 無（Other）
   - Root Directory: ./
   - Build Command: 留空
   - Output Directory: 留空
5. 點擊「Deploy」

### 4. Vercel 部署完成後
應用將自動部署到：
- https://chinese-language-app.vercel.app

## 功能特性

### 三種題型
1. **易混淆字詞** - 單選題（3個選項）
2. **成語理解** - 填空題（輸入正確成語）
3. **句式排序** - 拖曳排序題（5個句子部分）

### 12 課課程
包含所有國小四年級下學期課文：
1. 一束鮮花
2. 花園裡有一個問號
3. 龜兔賽跑
4. 手指頭的故事
5. 老鷹與小鷹
6. 世界最長的河
7. 住在樹上的動物
8. 飛天夢
9. 石頭變成了什麼
10. 掌聲響起來
11. 找春天
12. 孩子的心

### 兩種模式
- **卡牌模式**：按課程順序學習
- **智慧闖關**：隨機混合所有題目

### 支持年級參數
```
?grade=4-2  (國小四下)
?grade=5-1  (國小五上)
?grade=5-2  (國小五下)
?grade=6-1  (國小六上)
?grade=6-2  (國小六下)
```

## 數據結構

### JSON 格式
```json
{
  "semester": "4下",
  "grade": "4-2",
  "lessons": [
    {
      "lessonId": 1,
      "title": "一束鮮花",
      "confusingWords": [...],
      "idioms": [...],
      "sentences": [...]
    }
  ]
}
```

### 題型結構

**易混淆字詞**
```json
{
  "questionId": "cw1-1",
  "question": "爸爸的___很美麗。",
  "options": ["束", "刺", "速"],
  "correctAnswer": "束",
  "explanation": "解釋文本"
}
```

**成語理解**
```json
{
  "questionId": "idiom1-1",
  "idiom": "煥然一新",
  "explanation": "形容呈現嶄新的面貌",
  "example": "經過整修後，老房子___",
  "exampleAnswer": "煥然一新",
  "questionType": "fill"
}
```

**句式排序**
```json
{
  "questionId": "sent1-1",
  "pattern": "與其…不如…",
  "parts": ["與其", "在旁邊抱怨", "不如", "自己動手", "改變現狀"],
  "correctOrder": ["與其", "在旁邊抱怨", "不如", "自己動手", "改變現狀"],
  "correctSentence": "與其在旁邊抱怨，不如自己動手改變現狀。"
}
```

## 集成到 learning-platform

learning-platform 已更新：
- 啟用了國語科卡片
- 添加了 `showGradeModal('chinese')` 點擊事件
- 配置了應用 URL：`https://chinese-language-app.vercel.app/`

流程：
```
learning-platform 首頁
  → 點擊「國語科」卡片
  → 選擇年級（4下、5上、5下、6上、6下）
  → 跳轉到 chinese-language-app?grade=4-2
```

## 未來擴展

### 增加其他年級數據
修改 `chinese_db.json`，為其他年級添加課程：
- 4-2（國小四下）
- 5-1（國小五上）
- 5-2（國小五下）
- 6-1（國小六上）
- 6-2（國小六下）

### 新增題型
修改 `index.html`，添加新的 `renderXXX()` 函數

### 增強功能
- 進度保存（localStorage）
- 用戶成績統計
- 離線支持
- 多語言支持

## 故障排除

### 應用無法加載數據
檢查：
1. `chinese_db.json` 是否在根目錄
2. 瀏覽器控制台是否有 CORS 錯誤
3. 網絡連接是否正常

### URL 參數無效
確認：
1. 參數格式：`?grade=4-2`
2. 支持的年級值：4-2, 5-1, 5-2, 6-1, 6-2
3. 默認年級為 4-2

### 題目顯示異常
檢查：
1. `chinese_db.json` 中題目結構是否正確
2. 題目的必需字段是否完整
3. 特殊字符編碼（UTF-8）是否正確

## 文件清單

- **index.html** (36.6 KB)
  - 1800+ 行完整應用代碼
  - 包含所有頁面、樣式和邏輯
  - 支持三種題型和兩種模式

- **chinese_db.json** (38.2 KB)
  - 12 課課程數據
  - 36 個易混淆字詞題
  - 36 個成語理解題
  - 24 個句式排序題
  - 共計 96 個題目

- **vercel.json** (69 B)
  - Vercel 配置文件

- **.gitignore**
  - Git 忽略列表

## 聯繫與支持

如有任何問題，請檢查：
1. 本地開發：在瀏覽器中打開 `index.html`
2. 部署狀態：檢查 Vercel 面板
3. 數據完整性：驗證 `chinese_db.json` 格式

## 版本歷史

### v1.0.0 (2026-04-13)
- 初始版本上線
- 12 課課程完整
- 3 種題型實現
- 2 種學習模式
- 支持年級參數
