# 🏷️ 版本管理系統 - 完整指南

**學霸星球 (Learning Platform)** 現已配備完整的版本管理、備份和回滾系統。

---

## 📦 已部署的版本

### 當前版本: **v1.0.0-beta.1** ✨

- **發佈日期**: 2026-06-08
- **狀態**: 測試版 (Beta)
- **主要功能**: 時間換算互動教學模塊
- **包含內容**: 
  - 5章引導式教學
  - 50道完整題庫
  - 交互式時間軸動畫
  - 詳細反饋系統

### 前一個版本: **v0.9.0** (穩定版)

- **發佈日期**: 2026-04-14
- **特性**: 8個應用集成，多年級支持
- **回滾命令**: `./deploy.sh` → 選擇 4 → 輸入 `v0.9.0`

---

## 📁 版本管理文檔

### 核心文檔

| 文件 | 用途 | 更新頻率 |
|-----|------|---------|
| **VERSION.md** | 版本號 + 版本歷史 | 每次發佈時 |
| **CHANGELOG.md** | 詳細的更新日誌 | 每次發佈時 |
| **DEPLOYMENT_GUIDE.md** | 部署和回滾指南 | 按需 |
| **版本管理系統總結** | 本文檔 | 按需 |

### 部署腳本

| 文件 | 系統 | 功能 |
|-----|------|------|
| **deploy.sh** | Linux/Mac | 完整部署管理 |
| **deploy.ps1** | Windows | PowerShell 部署管理 |

---

## 🚀 快速操作

### 1️⃣ 完整部署（推薦）

```bash
# Linux/Mac
./deploy.sh
# 選擇 1: 完整部署流程

# Windows
.\deploy.ps1
# 選擇 1: 完整部署流程
```

**包含步驟**:
1. 檢查前置條件 ✅
2. 創建備份 ✅
3. 推送到 GitHub ✅
4. 部署到 Vercel ✅
5. 驗證部署 ✅

### 2️⃣ 回滾到前一個版本（緊急）

```bash
# Linux/Mac
./deploy.sh
# 選擇 4: 回滾到指定版本
# 輸入: v0.9.0

# Windows
.\deploy.ps1
# 選擇 4: 回滾到指定版本
# 輸入: v0.9.0
```

### 3️⃣ 只創建備份

```bash
./deploy.sh   # 或 .\deploy.ps1
# 選擇 2: 只創建備份
```

### 4️⃣ 列出所有版本

```bash
./deploy.sh   # 或 .\deploy.ps1
# 選擇 3: 列出所有版本
```

---

## 📂 備份位置和結構

```
backups/releases/
├── v1.0.0-beta.1/          (最新版本)
│   ├── source/
│   │   ├── math-science-app/
│   │   └── learning-platform/
│   └── metadata/
│       ├── VERSION.md
│       ├── CHANGELOG.md
│       └── backup-info.json
│
├── v0.9.0/                  (穩定版)
│   └── ...
│
└── snapshot-xxx/            (緊急快照)
    └── ...
```

**備份大小**: 約 50-100 MB 每個版本

**備份保留政策**: 
- 當前版本: 無限期保留
- 前 5 個版本: 完整備份
- 更早版本: 可選擇刪除以節省空間

---

## 🔄 回滾流程圖

```
發現問題
   ↓
./deploy.sh (或 .\deploy.ps1)
   ↓
選擇 3: 列出所有版本
   ↓
選擇 4: 回滾到指定版本
   ↓
確認回滾 → 代碼自動恢復
   ↓
選擇 8: 驗證部署
   ↓
選擇 7: 部署到 Vercel
   ↓
應用恢復正常 ✅
```

---

## 📋 版本命名規則

### 格式: MAJOR.MINOR.PATCH-PRERELEASE

```
v1.0.0-beta.1
│ │ │ │     │
│ │ │ │     └─ 預發佈版本號
│ │ │ └─────── 補丁版本（Bug 修復）
│ │ └───────── 次版本（新功能）
│ └─────────── 主版本（重大功能）
└───────────── 版本前綴
```

### 版本示例

- `v0.9.0` - 穩定版本（當前生產）
- `v1.0.0-alpha.1` - Alpha 測試版
- `v1.0.0-beta.1` - Beta 測試版（當前）
- `v1.0.0-rc.1` - Release Candidate
- `v1.0.0` - 正式發佈版本

---

## ✅ 部署檢查清單

### 部署前

- [ ] 代碼已通過語法檢查
- [ ] 所有功能已測試
- [ ] 沒有控制台錯誤
- [ ] 版本號已更新
- [ ] CHANGELOG 已更新
- [ ] 備份腳本可用

### 部署中

- [ ] 前置條件檢查通過
- [ ] 備份成功創建
- [ ] Git 提交成功
- [ ] GitHub 推送成功
- [ ] 標籤已推送
- [ ] Vercel 部署成功

### 部署後

- [ ] 應用在 Vercel 可訪問
- [ ] 代碼語法檢查通過
- [ ] 關鍵功能驗證
- [ ] 沒有紅色錯誤（開發者工具）

---

## 🆘 故障排查

### 問題 1: 部署失敗

```bash
# 1. 檢查前置條件
./deploy.sh
# 選擇 5

# 2. 驗證代碼
./deploy.sh
# 選擇 8

# 3. 檢查 Git 狀態
git status
```

### 問題 2: Vercel 部署後有錯誤

```bash
# 選項 A: 使用 Vercel 儀表板回滾
# 訪問: https://vercel.com/dashboard
# 找到上一個部署，點擊 Rollback

# 選項 B: 本地回滾
./deploy.sh
# 選擇 4 → 輸入 v0.9.0
# 選擇 7 → 重新部署到 Vercel
```

### 問題 3: GitHub 推送失敗

```bash
# 查看詳細錯誤
git push -v origin main

# 如果是認證問題
git config --global user.email "benjaminchu0508@gmail.com"
git config --global user.name "Benjamin Chu"
```

---

## 📊 關鍵功能對比

| 功能 | v0.9.0 | v1.0.0-beta.1 |
|-----|--------|-----------------|
| 8個應用集成 | ✅ | ✅ |
| 時間換算模塊 | ❌ | ✅ (新增) |
| 交互式教學 | ❌ | ✅ (新增) |
| 50道題庫 | ❌ | ✅ (新增) |
| 代碼檢查 | ✅ | ✅ |
| 完整備份系統 | ❌ | ✅ (新增) |

---

## 🔐 安全指南

### Git 提交前檢查

```bash
# 檢查敏感信息
grep -r "password\|api.key\|secret" math-science-app/

# 檢查大文件
find math-science-app -size +5M

# 正確的提交流程
git add math-science-app/
git commit -m "Release v1.0.0-beta.1: ..."
git push origin main
```

### 備份安全性

- 備份存儲在本地 `/backups/releases/` 目錄
- 包含 git commit 和分支信息
- 定期驗證備份完整性
- 建議定期上傳備份到 S3 或其他云存儲

---

## 📈 未來版本計劃

### v1.0.0 (計劃中)
- [ ] 時間換算模塊正式發佈
- [ ] 100% 代碼覆蓋率
- [ ] 生產環境驗證

### v1.1.0 (計劃中)
- [ ] 新增更多應用
- [ ] 性能優化
- [ ] 用戶分析面板

### v2.0.0 (計劃中)
- [ ] 主要功能重構
- [ ] 新的視覺設計
- [ ] 移動應用

---

## 📞 支持和聯繫

### 常見問題

**Q: 備份多久需要更新一次?**
A: 每次主要更新時自動創建備份。可手動創建快照備份。

**Q: 可以恢復多久前的版本?**
A: 保留所有備份版本。只要備份未刪除，就可以恢復。

**Q: 部署到 GitHub 後可以回滾嗎?**
A: 可以。使用 `git reset` 和 `git push --force` 恢復。

**Q: Vercel 部署失敗怎麼辦?**
A: 使用 Vercel 儀表板的「Rollback」功能或本地回滾。

### 聯繫方式

- **Email**: benjaminchu0508@gmail.com
- **GitHub**: https://github.com/blacKgreYcAt/learning-platform
- **Issues**: https://github.com/blacKgreYcAt/learning-platform/issues

---

## 🎯 關鍵命令速查

```bash
# 查看當前版本
cat VERSION.md

# 列出所有備份
ls -la /backups/releases/

# 部署當前版本
./deploy.sh      # 或 .\deploy.ps1

# 回滾到前一版本
./deploy.sh      # 選擇 4 → v0.9.0

# 查看 git 歷史
git log --oneline | head -20

# 查看版本標籤
git tag -l

# 從特定標籤檢出
git checkout v0.9.0
```

---

## 📅 時間軸

```
2026-03-30  v0.7.0 初始發佈
2026-04-14  v0.9.0 多應用集成
2026-06-08  v1.0.0-beta.1 時間換算模塊 ← 當前版本
2026-07-08  v1.0.0 計劃發佈
2026-08-08  v1.1.0 計劃新增功能
```

---

## 📖 相關文檔

- **[VERSION.md](./VERSION.md)** - 版本號和版本歷史
- **[CHANGELOG.md](./CHANGELOG.md)** - 詳細的更新日誌
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - 部署和回滾指南
- **[CODE_INSPECTION_REPORT.md](./math-science-app/CODE_INSPECTION_REPORT.md)** - 代碼檢查報告
- **[FINAL_TEST_CHECKLIST.md](./math-science-app/FINAL_TEST_CHECKLIST.md)** - 測試清單

---

**版本管理系統已就緒！** 🎉

現在你可以：
- ✅ 輕鬆創建版本備份
- ✅ 部署到 GitHub 和 Vercel
- ✅ 在出現問題時快速回滾
- ✅ 跟蹤完整的開發歷史
- ✅ 安全地管理生產環境

**最後更新**: 2026-06-08  
**系統版本**: 1.0.0  
**維護者**: Benjamin Chu
