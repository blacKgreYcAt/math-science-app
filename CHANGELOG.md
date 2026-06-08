# 📋 CHANGELOG - 更新日誌

所有重要的變化都記錄在此文件中。

該項目遵循 [Semantic Versioning](https://semver.org/lang/zh_CN/)。

---

## [1.0.0-beta.1] - 2026-06-08

### ✨ Added (新增)

#### 時間換算互動教學模塊
- **新文件**: 
  - `time-conversion-data.js` (45 KB) - 完整教學和題庫數據
  - `time-conversion-module.js` (24 KB) - 核心交互邏輯
  - `TIME_CONVERSION_IMPLEMENTATION.md` - 實現文檔

- **5章引導式教學**:
  - 第1章: 基礎概念 - 時間單位轉換規則和交互式換算器
  - 第2章: 跨日正推 - 已知起始時間，求結束時間的方法
  - 第3章: 跨日反推 - 已知結束時間，反推起始時間的方法
  - 第4章: 交互練習 - 3個可拖拽時間軸的練習題
  - 第5章: 本章小測 - 5道快速評估題

- **50道完整題庫**:
  - 基礎題 (15道): 單位轉換基礎
  - 進階題 (20道): 跨日正推計算
  - 挑戰題 (15道): 跨日反推計算
  - 本章小測 (5道): 章節評估

- **交互式功能**:
  - TimelineAnimator 類 - Canvas 時間軸動畫
  - 步驟式答題系統 - 分步驟驗證理解
  - 詳細反饋機制 - 正確答案解析 + 錯誤分析
  - 進度追蹤 - 實時顯示學習進度

- **首頁集成**:
  - 新增「🕐 時間換算專項」導航按鈕
  - 粉色主題樣式 (`#ff00aa`)
  - 完整的導航流程

- **CSS 樣式** (900+ 行):
  - 教學模塊樣式
  - 時間軸樣式
  - 題庫樣式
  - 反饋樣式
  - 動畫和過渡

### 🔧 Fixed (修復)

- **修復函數重複定義**:
  - 問題: `backToHome()` 定義了兩次
  - 解決: 將時間換算模塊的返回函數改名為 `backToTimeConversion()`
  - 受影響: index.html 第1787行、第596行

- **統一顯示/隱藏邏輯**:
  - 問題: 混合使用 `classList` 和 `style.display`
  - 解決: 全部統一改為使用 `style.display` 方式
  - 受影響函數:
    - `goToTimeConversionModule()` - 完全重寫
    - `goToTimeConversionQuiz()` - 完全重寫
    - `initTimeConversionQuiz()` - 完全重寫
    - `backToTimeConversionHome()` - 完全重寫

- **修復導航邏輯**:
  - 隱藏所有其他頁面時的邏輯清晰
  - 確保正確的頁面顯示順序
  - 驗證所有頁面容器都被正確處理

### 📚 Documentation (文檔)

- `CODE_INSPECTION_REPORT.md` - 完整的代碼檢查報告
- `FINAL_TEST_CHECKLIST.md` - 詳細的測試清單
- `TIME_CONVERSION_IMPLEMENTATION.md` - 實現詳細文檔
- 更新 `README.md` 以包含新模塊信息

### 🧪 Testing (測試)

- JavaScript 語法檢查: ✅ 通過
- DOM 元素完整性: ✅ 驗證
- 函數命名一致性: ✅ 檢查
- 邏輯流程驗證: ✅ 完成
- 代碼風格檢查: ✅ 通過

### ⚙️ Changed (變更)

- `index.html`: 添加時間換算模塊集成 (+150行)
  - HTML 結構 (+30行)
  - CSS 樣式 (+900行)
  - JavaScript 邏輯 (+20行)

- `package.json`: 添加版本管理命令 (如果需要)

### 📊 Statistics (統計)

- **新增代碼**: ~3000 行 (HTML + CSS + JS)
- **新增數據**: 50道題 + 5章教學
- **新增文檔**: 4個文檔文件
- **修復問題**: 6個問題
- **測試覆蓋**: 8個主要功能點

---

## [0.9.0] - 2026-04-14

### ✨ Added

- **應用集成**:
  - Chinese Language App (語文閣樓)
  - 英文應用更新 (FRY 1000)
  - 年級選擇支持

- **首頁重組**:
  - 3個區域設計: 快速遊戲 + 科目學習 + 其他應用
  - 年級模態框導航
  - 多年級課程支持

### 🔧 Fixed

- 年級模態框動畫不顯示問題
- 語文應用鏈接更新
- 英文應用 URL 修正
- 應用導航流程優化

### 📊 Metrics

- 應用總數: 8個
- 支持年級: 4下、5上、5下、6上、6下
- 總題庫: 200+ 道題

---

## [0.8.0] - 2026-03-31

### ✨ Added

- **完整修復套件**:
  - 14個已知問題的全面修復
  - RAF 內存洩漏修復
  - 遊戲狀態污染修復
  - 觸摸事件監聽器修復

- **應用穩定化**:
  - natural-science-app: 8章遊戲穩定
  - schulte-grid-app: 視覺訓練穩定
  - social-studies-app: 社會科目穩定

### 🔧 Fixed

- RAF 動畫在卸載時未取消
- 章節切換時遊戲狀態污染
- 觸摸事件監聽器移除失敗
- RAF 變量未完全清理
- 事件處理器模式不一致
- 移動設備上不希望的滾動

### 📚 Documentation

- `BUGFIX_REPORT.md` - 詳細的 14 個 bug 修復報告

---

## [0.7.0] - 2026-03-30

### ✨ Added

- **多應用集成**:
  - Natural Science App (自然科綜合)
  - Schulte Grid App (視覺訓練)
  - Social Studies App (社會科)

- **功能豐富**:
  - 8 個應用卡片
  - 多章節教學
  - 遊戲化學習

### 📊 Initial Release

- 首頁上線
- 基本應用集成
- 初始部署到 Vercel

---

## 遷移指南

### 從 v0.9.0 升級到 v1.0.0-beta.1

#### 破壞性變更
- ❌ `backToHome()` 在時間換算模塊不再適用
- ✅ 使用 `backToTimeConversion()` 代替

#### 新增依賴
- 無新增 npm 依賴（純 HTML/CSS/JS）

#### 迁移步驟
```bash
# 1. 更新代碼
git pull origin main

# 2. 備份當前版本
npm run backup:current  # 如果有此命令

# 3. 驗證新功能
# 在瀏覽器中打開並測試時間換算模塊

# 4. 部署
npm run deploy  # 或 vercel --prod
```

#### 回滾步驟（如果出現問題）
```bash
# 回滾到 v0.9.0
git checkout v0.9.0
npm run deploy

# 或使用 Vercel 回滾功能
vercel rollback
```

---

## 版本支持政策

### 當前支持狀態

| 版本 | 狀態 | 支持期限 |
|-----|------|---------|
| 1.0.0-beta.1 | 活躍開發 | 2026-07-08 |
| 0.9.0 | 維護中 | 2026-08-08 |
| 0.8.0 及更早 | 停止支持 | - |

### 報告問題

發現 bug 時，請包含以下信息:
1. **版本號**: `v1.0.0-beta.1`
2. **複現步驟**: 詳細的步驟
3. **期望結果**: 應該發生什麼
4. **實際結果**: 實際發生了什麼
5. **瀏覽器**: Chrome/Firefox/Safari 等
6. **設備**: PC/Mobile
7. **截圖**: 如適用

---

## 發佈計劃

### Q2 2026 (4-6月)
- ✅ v0.9.0: 多應用集成
- ✅ v0.8.0: 完整修復
- ✅ v1.0.0-beta.1: 時間換算模塊

### Q3 2026 (7-9月) - 計劃中
- [ ] v1.0.0: 正式發佈
- [ ] v1.1.0: 更多應用
- [ ] v1.2.0: 學習分析面板

### Q4 2026 (10-12月) - 計劃中
- [ ] v2.0.0: 主要功能升級

---

## 貢獻指南

### 提交代碼前
1. 創建功能分支: `git checkout -b feature/your-feature`
2. 提交更改: `git commit -m "feat: your feature"`
3. 創建 Pull Request

### 代碼風格
- 使用 Semantic Versioning
- 遵循 Conventional Commits
- 添加適當的文檔和註釋

### 版本更新步驟
1. 更新 `VERSION.md`
2. 更新 `CHANGELOG.md`
3. 創建 git tag
4. 推送到 GitHub

---

**最後更新**: 2026-06-08  
**維護者**: Benjamin Chu  
**聯繫**: benjaminchu0508@gmail.com
