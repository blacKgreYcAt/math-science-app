# 🌟 星際數學探險 - 版本管理

## 當前版本
**v1.0.0-beta.1** (時間換算模塊發佈版)

---

## 版本歷史

### v1.0.0-beta.1 - 2026-06-08 ✨ **最新版本**
**狀態**: 測試版 / 準備發佈

**新增功能**:
- ✨ 時間換算互動教學模塊
  - 5章引導式教學（基礎→進階→反推）
  - 50道完整題庫（基礎15 + 進階20 + 挑戰15）
  - 交互式時間軸動畫
  - 步驟式答題系統
  - 詳細反饋和錯誤分析
- ✨ 完整的代碼檢查和修復

**修復的問題**:
- 🔧 修復函數重複定義（backToHome）
- 🔧 統一顯示/隱藏邏輯（classList → style.display）
- 🔧 修復導航函數完整性

**測試狀態**: ✅ 代碼檢查通過

**文件清單**:
- `time-conversion-data.js` (45 KB) - 教學+題庫數據
- `time-conversion-module.js` (24 KB) - 核心邏輯
- `index.html` (修改) - 集成時間換算模塊
- `CODE_INSPECTION_REPORT.md` - 檢查報告
- `FINAL_TEST_CHECKLIST.md` - 測試清單

---

### v0.9.0 - 2026-04-14
**狀態**: 穩定版

**特性**:
- 8個學習應用集成
- 遊戲化和卡牌模式
- 首頁重組（3個區域）
- 年級多選支持

**應用**:
- Math Science App
- Natural Science App
- Social Studies App
- Schulte Grid App
- Chinese Language App
- English App (FRY 1000)
- Energy Lab 4
- Farm Food Life

---

## 版本規則

### 版本號格式: MAJOR.MINOR.PATCH-PRERELEASE

- **MAJOR** (主版本): 重大功能更新（如新模塊）
- **MINOR** (次版本): 新功能或功能改進
- **PATCH** (補丁版本): Bug 修復
- **PRERELEASE** (預發佈): alpha, beta, rc

### 發佈流程

```
開發 → 測試 → Beta (v1.x.x-beta.y) → Release (v1.x.x) → 部署
```

---

## 備份和回滾指南

### 自動備份位置
```
備份目錄: /backups/releases/

結構:
├── v1.0.0-beta.1/         (最新版本備份)
│   ├── source/            (完整源碼)
│   ├── build/             (構建文件)
│   └── metadata/          (版本信息)
├── v0.9.0/                (前一個版本)
└── ...
```

### 回滾命令
```bash
# 查看所有版本
npm run version:list

# 回滾到指定版本
npm run version:rollback -- v0.9.0

# 重新部署當前版本
npm run deploy:current
```

---

## 發佈清單

### 發佈前檢查
- [ ] 代碼通過語法檢查
- [ ] 所有功能測試通過
- [ ] 沒有控制台錯誤
- [ ] 版本號已更新
- [ ] CHANGELOG 已更新
- [ ] 備份已創建
- [ ] Git tag 已創建

### GitHub 發佈步驟
```bash
# 1. 提交所有更改
git add .
git commit -m "Release v1.0.0-beta.1: Time conversion module"

# 2. 創建標籤
git tag -a v1.0.0-beta.1 -m "Beta release: Time conversion module with 50 problems"

# 3. 推送到 GitHub
git push origin main
git push origin v1.0.0-beta.1

# 4. 在 GitHub 上創建 Release
# https://github.com/blacKgreYcAt/learning-platform/releases/new
```

### Vercel 部署步驟
```bash
# 1. 確保已連接 Vercel
vercel --prod

# 2. 部署後驗證
vercel ls

# 3. 如需回滾
vercel rollback
```

---

## 回滾情景和恢復指南

### 情景1: 部署到 Vercel 後發現錯誤
**步驟**:
1. 在 Vercel 儀表板點擊「Rollback」
2. 選擇前一個穩定部署
3. 確認回滾

**本地恢復**:
```bash
git reset --hard v0.9.0
git push origin main --force
```

### 情景2: GitHub 推送後發現問題
**步驟**:
1. 重置本地倉庫
   ```bash
   git reset --hard HEAD~1
   ```
2. 刪除遠程標籤
   ```bash
   git push origin --delete v1.0.0-beta.1
   ```
3. 重新測試後推送

### 情景3: 需要緊急修復
**步驟**:
1. 從穩定版本創建修復分支
   ```bash
   git checkout -b hotfix/critical-bug v0.9.0
   ```
2. 修復問題
3. 發佈 v0.9.1
4. 合併回 main

---

## 版本控制最佳實踐

### Commit 消息格式
```
type(scope): subject

feat(time-conversion): add interactive timeline
fix(navigation): resolve backToHome function conflict
docs(version): update changelog
test(module): add comprehensive test suite
```

### Git 分支策略
```
main (穩定版本)
  ├── develop (開發分支)
  ├── feature/time-conversion
  ├── hotfix/critical-bug
  └── release/v1.0.0-beta.1
```

### 發佈前檢查清單
- [ ] 所有 feature 分支已合併
- [ ] 代碼審查已完成
- [ ] 單元測試通過
- [ ] 集成測試通過
- [ ] 備份已驗證
- [ ] 版本號已更新
- [ ] 標籤已創建
- [ ] Release notes 已準備

---

## 常用命令

```bash
# 查看當前版本
cat VERSION.md

# 查看版本歷史
git log --oneline --graph

# 查看所有標籤
git tag -l

# 查看特定標籤
git show v1.0.0-beta.1

# 從標籤檢出代碼
git checkout v0.9.0

# 創建新標籤
git tag -a v1.0.0-beta.2 -m "Release message"

# 推送標籤
git push origin v1.0.0-beta.2
```

---

## 環境配置

### 開發環境
```
Node.js: LTS
Git: Latest
Python: 3.8+ (用於備份腳本)
```

### 部署環境
- **GitHub**: https://github.com/blacKgreYcAt/learning-platform
- **Vercel**: https://learning-platform-two-eosin.vercel.app
- **備份**: /backups/releases/

---

**最後更新**: 2026-06-08  
**維護者**: Benjamin Chu  
**郵箱**: benjaminchu0508@gmail.com
