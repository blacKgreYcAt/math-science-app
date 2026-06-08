# 📖 部署和回滾指南

完整的版本管理、備份和部署流程文檔。

---

## 快速開始

### 第一次使用

#### 1. 準備環境

**必需工具**:
- Git (2.0+)
- Node.js 或 Python (用於備份腳本)

**可選工具** (用於 Vercel 部署):
- Vercel CLI: `npm install -g vercel`

#### 2. 初始化

```bash
# 進入項目目錄
cd /path/to/project

# 在第一次運行前，給部署腳本權限
chmod +x deploy.sh  # Linux/Mac

# Windows PowerShell 用戶: 設置執行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 3. 查看當前版本

```bash
# Linux/Mac
./deploy.sh

# 或查看版本文件
cat VERSION.md
```

```powershell
# Windows
.\deploy.ps1

# 或查看版本文件
Get-Content VERSION.md
```

---

## 部署流程

### 🚀 完整部署流程（推薦）

此流程包含備份、GitHub 推送和 Vercel 部署。

**選項 1: 使用菜單界面**

```bash
# Linux/Mac
./deploy.sh
# 選擇 1

# Windows PowerShell
.\deploy.ps1
# 選擇 1
```

**選項 2: 命令行直接執行**

```bash
# Linux/Mac
./deploy.sh  # 進入菜單選擇 1

# Windows PowerShell
.\deploy.ps1 -Action deploy
```

**流程步驟**:
1. ✅ 檢查前置條件
2. ✅ 創建當前版本備份
3. ✅ 推送代碼到 GitHub
4. ✅ 推送 git tag 到 GitHub
5. ✅ 部署到 Vercel（如果選擇）
6. ✅ 驗證部署

**預期輸出**:
```
✅ 備份完成: /backups/releases/v1.0.0-beta.1
✅ 已推送到 GitHub
✅ 已部署到 Vercel
✅ 代碼語法檢查通過
✅ 版本 v1.0.0-beta.1 已成功部署
```

---

### 📦 只創建備份

不部署，只創建當前版本的備份。

```bash
# Linux/Mac
./deploy.sh
# 選擇 2

# Windows PowerShell
.\deploy.ps1 -Action backup
```

**備份位置**: `/backups/releases/v1.0.0-beta.1/`

**包含內容**:
- `source/math-science-app/` - 完整源代碼
- `source/learning-platform/` - 學習平台代碼（如果存在）
- `metadata/VERSION.md` - 版本信息
- `metadata/CHANGELOG.md` - 更新日誌
- `metadata/backup-info.json` - 備份元數據

---

### 📋 列出所有版本

查看所有可用的備份版本。

```bash
# Linux/Mac
./deploy.sh
# 選擇 3

# Windows PowerShell
.\deploy.ps1 -Action list
```

**輸出示例**:
```
可用的備份版本
=========================================
版本列表:
  • v1.0.0-beta.1 (備份於: 2026-06-08T12:30:45Z)
  • v0.9.0 (備份於: 2026-04-14T08:15:30Z)
  • snapshot-v1.0.0-beta.1-1717939445 (備份於: 2026-06-08T12:35:20Z)
```

---

## 🔙 回滾流程

當發現部署版本有問題時，回滾到前一個穩定版本。

### 情景 1: 發現代碼錯誤

**步驟**:

#### 1. 列出可用版本

```bash
./deploy.sh
# 選擇 3
```

#### 2. 確定回滾目標

檢查版本列表，選擇前一個穩定版本（例如 `v0.9.0`）

#### 3. 執行回滾

```bash
# Linux/Mac
./deploy.sh
# 選擇 4
# 輸入版本: v0.9.0

# Windows PowerShell
.\deploy.ps1 -Action rollback
# 輸入版本: v0.9.0
```

#### 4. 驗證回滾

```bash
# 檢查代碼是否恢復
git status

# 檢查文件內容
cat math-science-app/index.html | head -20
```

#### 5. 提交並部署

```bash
# 提交更改
git add .
git commit -m "Rollback to v0.9.0 - fix critical issues"

# 推送到 GitHub
git push origin main

# 部署到 Vercel
vercel --prod
```

### 情景 2: Vercel 部署後發現問題

**快速回滾方式** (無需本地修改):

1. **使用 Vercel 儀表板回滾**:
   - 訪問: https://vercel.com/dashboard
   - 進入 learning-platform 項目
   - 點擊「Deployments」標籤
   - 找到前一個穩定部署
   - 點擊「Rollback」按鈕
   - 確認回滾

2. **本地驗證並重新部署**:
   ```bash
   ./deploy.sh
   # 選擇 4 回滾到前一個版本
   # 選擇 8 驗證部署
   # 選擇 7 重新部署到 Vercel
   ```

### 情景 3: GitHub 推送後發現問題

如果已推送到 GitHub 但還未部署到 Vercel:

```bash
# 1. 重置本地倉庫
git reset --hard v0.9.0

# 2. 強制推送回 GitHub
git push origin main --force

# 3. 刪除錯誤的標籤
git push origin --delete v1.0.0-beta.1

# 4. 重新測試
./deploy.sh
# 選擇 8 驗證部署

# 5. 重新部署
./deploy.sh
# 選擇 7 部署到 Vercel
```

---

## 🔍 驗證部署

部署後驗證應用是否正常運作。

```bash
# Linux/Mac
./deploy.sh
# 選擇 8

# Windows PowerShell
.\deploy.ps1 -Action verify
```

**驗證項目**:
- ✅ 代碼語法檢查 (JavaScript)
- ✅ 可訪問部署的 URL
- ✅ 時間換算模塊正常加載

**手動驗證清單**:

在瀏覽器中打開: https://learning-platform-two-eosin.vercel.app

- [ ] 首頁加載正常
- [ ] 看到「🕐 時間換算專項」按鈕
- [ ] 點擊按鈕進入模塊
- [ ] 教學內容正確顯示
- [ ] 開發者工具（F12）沒有紅色錯誤

---

## 📊 版本備份結構

```
backups/
└── releases/
    ├── v1.0.0-beta.1/
    │   ├── source/
    │   │   ├── math-science-app/
    │   │   │   ├── index.html
    │   │   │   ├── time-conversion-module.js
    │   │   │   └── ... (所有應用文件)
    │   │   └── learning-platform/
    │   └── metadata/
    │       ├── VERSION.md
    │       ├── CHANGELOG.md
    │       └── backup-info.json
    │
    ├── v0.9.0/
    │   └── ... (前一個版本的備份)
    │
    └── snapshot-v1.0.0-beta.1-1717939445/
        └── ... (快照備份)
```

**備份元數據示例**:
```json
{
  "version": "v1.0.0-beta.1",
  "timestamp": "2026-06-08T12:30:45Z",
  "git_commit": "abc123def456...",
  "git_branch": "main",
  "backup_path": "/backups/releases/v1.0.0-beta.1",
  "includes": [
    "math-science-app (時間換算模塊)",
    "learning-platform (主學習平台)",
    "版本和變更日誌"
  ]
}
```

---

## 🛠️ 常見問題

### Q1: 如何查看特定版本的代碼?

```bash
# 克隆特定版本
git clone --branch v0.9.0 https://github.com/blacKgreYcAt/learning-platform

# 或從備份恢復
cp -r /backups/releases/v0.9.0/source/math-science-app ./
```

### Q2: 如何比較兩個版本的差異?

```bash
# 查看兩個標籤之間的差異
git log v0.9.0..v1.0.0-beta.1 --oneline

# 查看文件差異
git diff v0.9.0 v1.0.0-beta.1 -- math-science-app/
```

### Q3: 備份可以保留多久?

建議保留策略:
- **當前版本**: 無限期保留
- **前 5 個版本**: 保留完整備份
- **更早版本**: 可選擇只保留元數據，刪除源文件以節省空間

```bash
# 清理舊備份（保留最近 5 個版本）
cd /backups/releases
ls -t | tail -n +6 | xargs rm -rf
```

### Q4: 部署失敗怎麼辦?

**排查步驟**:

1. 檢查前置條件
   ```bash
   ./deploy.sh
   # 選擇 5
   ```

2. 驗證代碼
   ```bash
   ./deploy.sh
   # 選擇 8
   ```

3. 檢查 Git 狀態
   ```bash
   git status
   git log --oneline | head -5
   ```

4. 查看詳細錯誤
   ```bash
   # GitHub 推送錯誤
   git push -v origin main

   # Vercel 部署錯誤
   vercel logs
   ```

5. 如果無法修復，回滾到前一個版本
   ```bash
   ./deploy.sh
   # 選擇 4
   ```

### Q5: 如何自動化每日備份?

**Linux/Mac - 使用 cron**:

```bash
# 編輯 crontab
crontab -e

# 添加每天凌晨 2:00 自動備份
0 2 * * * cd /path/to/project && ./deploy.sh 2

# 或添加備份並郵件通知
0 2 * * * cd /path/to/project && ./deploy.sh 2 && echo "Backup completed" | mail -s "Daily Backup" you@example.com
```

**Windows - 使用任務計劃程序**:

1. 打開「任務計劃程序」
2. 創建基本任務
3. 設置觸發器: 每天凌晨 2:00
4. 設置操作: 運行程序
5. 程序: `powershell.exe`
6. 參數: `-File "C:\path\to\deploy.ps1" -Action backup`

---

## 📞 支持和幫助

### 獲取幫助

```bash
# 查看當前版本
cat VERSION.md

# 查看更新日誌
cat CHANGELOG.md

# 查看部署指南
cat DEPLOYMENT_GUIDE.md
```

### 報告問題

部署過程中遇到問題?

1. **收集信息**:
   ```bash
   # 檢查環境
   git --version
   node --version  # 如果有 Node.js
   vercel --version  # 如果有 Vercel CLI

   # 檢查版本
   cat VERSION.md

   # 檢查最近的提交
   git log --oneline | head -10
   ```

2. **查看錯誤日誌**:
   ```bash
   # GitHub 推送錯誤
   git push -v origin main 2>&1 | tee git-error.log

   # Vercel 部署日誌
   vercel logs > vercel-error.log

   # 腳本日誌
   ./deploy.sh > deploy-error.log 2>&1
   ```

3. **聯繫支持**:
   - GitHub Issues: https://github.com/blacKgreYcAt/learning-platform/issues
   - Email: benjaminchu0508@gmail.com

---

## ✅ 檢查清單

### 首次部署前

- [ ] 環境已設置（Git、Node.js）
- [ ] 部署腳本有執行權限（Linux/Mac）
- [ ] 已連接 GitHub 和 Vercel 賬戶
- [ ] VERSION.md 和 CHANGELOG.md 已更新
- [ ] 代碼已通過本地測試

### 部署中

- [ ] 前置條件檢查通過
- [ ] 備份已創建
- [ ] Git 提交成功
- [ ] GitHub 推送成功
- [ ] 標籤已推送到 GitHub
- [ ] Vercel 部署成功

### 部署後

- [ ] 應用在 Vercel 上可訪問
- [ ] 代碼語法檢查通過
- [ ] 關鍵功能已驗證
- [ ] 時間換算模塊正常運作
- [ ] 開發者工具沒有紅色錯誤

### 緊急情況下

- [ ] 備份已確認存在
- [ ] 回滾版本已確認可用
- [ ] 回滾命令已記錄
- [ ] 支持聯繫方式已準備

---

**最後更新**: 2026-06-08  
**文檔版本**: 1.0.0  
**維護者**: Benjamin Chu
