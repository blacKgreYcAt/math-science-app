# ============================================
# 🚀 Learning Platform 部署和版本管理腳本 (PowerShell)
# ============================================
# 在 Windows PowerShell 中運行: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# 然後運行: .\deploy.ps1

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('deploy', 'backup', 'list', 'rollback', 'check', 'github', 'vercel', 'verify')]
    [string]$Action = 'menu'
)

# 配置
$ProjectRoot = (Get-Item -Path $PSScriptRoot).FullName
$BackupDir = Join-Path $ProjectRoot "backups\releases"
$MathAppDir = Join-Path $ProjectRoot "math-science-app"
$LearningPlatformDir = Join-Path $ProjectRoot "learning-platform"
$VersionFile = Join-Path $ProjectRoot "VERSION.md"
$ChangelogFile = Join-Path $ProjectRoot "CHANGELOG.md"

# 顏色定義
$Colors = @{
    Success = 'Green'
    Error   = 'Red'
    Warning = 'Yellow'
    Info    = 'Cyan'
}

# 輔助函數
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $Colors.Success
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $Colors.Error
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $Colors.Warning
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor $Colors.Info
}

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor $Colors.Info
    Write-Host "$Message" -ForegroundColor $Colors.Info
    Write-Host "========================================" -ForegroundColor $Colors.Info
    Write-Host ""
}

# 提取版本號
function Get-Version {
    $content = Get-Content $VersionFile | Select-String "^## 當前版本" -A 1
    if ($content) {
        $match = [regex]::Match($content[1], '\*\*v(.+?)\*\*')
        if ($match.Success) {
            return "v" + $match.Groups[1].Value
        }
    }
    return "v1.0.0-unknown"
}

# 創建備份
function Backup-Project {
    param([string]$Version)

    Write-Header "正在備份版本 $Version"

    $BackupPath = Join-Path $BackupDir $Version
    $SourcePath = Join-Path $BackupPath "source"
    $MetadataPath = Join-Path $BackupPath "metadata"

    # 創建目錄
    New-Item -ItemType Directory -Path $SourcePath -Force | Out-Null
    New-Item -ItemType Directory -Path $MetadataPath -Force | Out-Null

    # 備份源代碼
    Write-Info "備份源代碼..."
    Copy-Item -Path $MathAppDir -Destination (Join-Path $SourcePath "math-science-app") -Recurse -Force

    if (Test-Path $LearningPlatformDir) {
        Copy-Item -Path $LearningPlatformDir -Destination (Join-Path $SourcePath "learning-platform") -Recurse -Force
    }

    # 備份版本信息
    Write-Info "備份版本信息..."
    Copy-Item -Path $VersionFile -Destination $MetadataPath -Force
    Copy-Item -Path $ChangelogFile -Destination $MetadataPath -Force

    # 創建元數據文件
    $BackupInfo = @{
        version = $Version
        timestamp = (Get-Date -AsUTC -Format "O")
        git_commit = (git -C $ProjectRoot rev-parse HEAD)
        git_branch = (git -C $ProjectRoot rev-parse --abbrev-ref HEAD)
        backup_path = $BackupPath
        includes = @(
            "math-science-app (時間換算模塊)",
            "learning-platform (主學習平台)",
            "版本和變更日誌"
        )
    } | ConvertTo-Json

    Set-Content -Path (Join-Path $MetadataPath "backup-info.json") -Value $BackupInfo

    Write-Success "備份完成: $BackupPath"
}

# 列出所有版本
function List-Versions {
    Write-Header "可用的備份版本"

    if (-not (Test-Path $BackupDir)) {
        Write-Warning-Custom "備份目錄不存在"
        return
    }

    $versions = Get-ChildItem -Path $BackupDir -Directory

    if ($versions.Count -eq 0) {
        Write-Info "沒有備份版本"
        return
    }

    Write-Host "版本列表:"
    foreach ($dir in $versions) {
        $backupInfoPath = Join-Path $dir.FullName "metadata\backup-info.json"
        if (Test-Path $backupInfoPath) {
            $backupInfo = Get-Content $backupInfoPath | ConvertFrom-Json
            Write-Host "  • $($dir.Name) (備份於: $($backupInfo.timestamp))"
        } else {
            Write-Host "  • $($dir.Name)"
        }
    }
}

# 回滾到指定版本
function Rollback-To-Version {
    param([string]$TargetVersion)

    $BackupPath = Join-Path $BackupDir $TargetVersion

    if (-not (Test-Path $BackupPath)) {
        Write-Error-Custom "找不到版本 $TargetVersion 的備份"
        List-Versions
        return $false
    }

    Write-Header "準備回滾到版本 $TargetVersion"

    Write-Warning-Custom "警告: 此操作將覆蓋當前代碼!"
    $confirm = Read-Host "您確定要繼續嗎? (yes/no)"

    if ($confirm -ne "yes") {
        Write-Info "回滾已取消"
        return $true
    }

    # 創建當前版本的快照
    $CurrentVersion = Get-Version
    Write-Info "備份當前版本 $CurrentVersion..."
    Backup-Project "snapshot-$CurrentVersion-$(Get-Date -Format 'yyyyMMddHHmmss')"

    # 恢復備份
    Write-Info "恢復版本 $TargetVersion..."
    Get-ChildItem -Path $MathAppDir -Force | Remove-Item -Recurse -Force
    Copy-Item -Path (Join-Path $BackupPath "source\math-science-app\*") -Destination $MathAppDir -Recurse -Force

    if (Test-Path (Join-Path $BackupPath "source\learning-platform")) {
        Get-ChildItem -Path $LearningPlatformDir -Force | Remove-Item -Recurse -Force
        Copy-Item -Path (Join-Path $BackupPath "source\learning-platform\*") -Destination $LearningPlatformDir -Recurse -Force
    }

    Write-Success "版本已回滾到 $TargetVersion"

    # 顯示後續步驟
    Write-Host ""
    Write-Host "後續步驟:" -ForegroundColor $Colors.Info
    Write-Host "1. 驗證代碼: git status"
    Write-Host "2. 提交更改: git add . && git commit -m 'Rollback to $TargetVersion'"
    Write-Host "3. 推送到 GitHub: git push origin main"
    Write-Host "4. 部署到 Vercel: vercel --prod"

    return $true
}

# 檢查前置條件
function Check-Prerequisites {
    Write-Header "檢查前置條件"

    $missingCount = 0

    # 檢查 Git
    if (Get-Command git -ErrorAction SilentlyContinue) {
        Write-Success "Git 已安裝"
    } else {
        Write-Error-Custom "Git 未安裝"
        $missingCount++
    }

    # 檢查 Node.js
    if (Get-Command node -ErrorAction SilentlyContinue) {
        Write-Success "Node.js 已安裝"
    } else {
        Write-Warning-Custom "Node.js 未安裝 (某些功能可能不可用)"
    }

    # 檢查 Vercel CLI
    if (Get-Command vercel -ErrorAction SilentlyContinue) {
        Write-Success "Vercel CLI 已安裝"
    } else {
        Write-Warning-Custom "Vercel CLI 未安裝 (建議安裝以進行部署)"
    }

    # 檢查項目結構
    if (Test-Path $MathAppDir) {
        Write-Success "找到 math-science-app 目錄"
    } else {
        Write-Error-Custom "找不到 math-science-app 目錄"
        $missingCount++
    }

    if ($missingCount -gt 0) {
        Write-Error-Custom "缺少必要的前置條件"
        return $false
    }

    return $true
}

# 部署到 GitHub
function Deploy-To-GitHub {
    param([string]$Version)

    Write-Header "部署到 GitHub"

    Push-Location $ProjectRoot

    Write-Info "推送代碼到 GitHub..."
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "推送代碼失敗"
        Pop-Location
        return $false
    }

    Write-Info "推送標籤到 GitHub..."
    git push origin $Version
    if ($LASTEXITCODE -ne 0) {
        Write-Warning-Custom "推送標籤失敗 (可能已存在)"
    }

    Pop-Location

    Write-Success "已推送到 GitHub"
    Write-Host ""
    Write-Host "下一步:" -ForegroundColor $Colors.Info
    Write-Host "1. 訪問: https://github.com/blacKgreYcAt/learning-platform/releases/new"
    Write-Host "2. 選擇標籤: $Version"
    Write-Host "3. 創建 Release"

    return $true
}

# 部署到 Vercel
function Deploy-To-Vercel {
    Write-Header "部署到 Vercel"

    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Error-Custom "Vercel CLI 未安裝"
        Write-Host "安裝命令: npm install -g vercel" -ForegroundColor $Colors.Info
        return $false
    }

    Push-Location $ProjectRoot

    Write-Info "正在部署到 Vercel..."
    vercel --prod

    Pop-Location

    Write-Success "已部署到 Vercel"
    return $true
}

# 驗證部署
function Verify-Deployment {
    Write-Header "驗證部署"

    Write-Info "檢查代碼語法..."

    $moduleFile = Join-Path $MathAppDir "time-conversion-module.js"
    $dataFile = Join-Path $MathAppDir "time-conversion-data.js"

    if ((Test-Path $moduleFile) -and (Get-Command node -ErrorAction SilentlyContinue)) {
        node -c $moduleFile
        if ($LASTEXITCODE -eq 0) {
            Write-Success "module.js 語法檢查通過"
        } else {
            Write-Error-Custom "module.js 語法錯誤"
            return $false
        }

        node -c $dataFile
        if ($LASTEXITCODE -eq 0) {
            Write-Success "data.js 語法檢查通過"
        } else {
            Write-Error-Custom "data.js 語法錯誤"
            return $false
        }
    }

    Write-Success "代碼語法檢查通過"
    Write-Info "訪問部署的應用: https://learning-platform-two-eosin.vercel.app"
    Write-Info "檢查時間換算模塊是否正常運作"

    return $true
}

# 完整部署流程
function Full-Deployment {
    $Version = Get-Version

    # 1. 檢查前置條件
    if (-not (Check-Prerequisites)) {
        return $false
    }

    # 2. 創建備份
    Backup-Project $Version

    # 3. Git 操作
    Push-Location $ProjectRoot
    Write-Info "檢查 Git 狀態..."
    git add .
    git commit -m "Release $Version"
    Pop-Location

    # 4. 部署到 GitHub
    $githubDeploy = Read-Host "部署到 GitHub? (yes/no)"
    if ($githubDeploy -eq "yes") {
        if (-not (Deploy-To-GitHub $Version)) {
            return $false
        }
    }

    # 5. 部署到 Vercel
    $vercelDeploy = Read-Host "部署到 Vercel? (yes/no)"
    if ($vercelDeploy -eq "yes") {
        if (-not (Deploy-To-Vercel)) {
            return $false
        }
    }

    # 6. 驗證部署
    if (-not (Verify-Deployment)) {
        return $false
    }

    Write-Header "部署完成！"
    Write-Host "版本 $Version 已成功部署" -ForegroundColor $Colors.Success

    return $true
}

# 菜單
function Show-Menu {
    Write-Host ""
    Write-Host "Learning Platform 部署管理" -ForegroundColor $Colors.Info
    Write-Host "==========================="
    Write-Host "1. 完整部署流程 (備份 → GitHub → Vercel)"
    Write-Host "2. 只創建備份"
    Write-Host "3. 列出所有版本"
    Write-Host "4. 回滾到指定版本"
    Write-Host "5. 檢查前置條件"
    Write-Host "6. 部署到 GitHub"
    Write-Host "7. 部署到 Vercel"
    Write-Host "8. 驗證部署"
    Write-Host "0. 退出"
    Write-Host ""
    $choice = Read-Host "選擇操作 (0-8)"
    return $choice
}

# 主程序
function Main {
    if ($Action -eq 'menu') {
        while ($true) {
            $choice = Show-Menu

            switch ($choice) {
                '1' { Full-Deployment | Out-Null }
                '2' { Backup-Project (Get-Version) }
                '3' { List-Versions }
                '4' {
                    $version = Read-Host "輸入要回滾的版本 (例如 v0.9.0)"
                    Rollback-To-Version $version | Out-Null
                }
                '5' { Check-Prerequisites | Out-Null }
                '6' { Deploy-To-GitHub (Get-Version) | Out-Null }
                '7' { Deploy-To-Vercel | Out-Null }
                '8' { Verify-Deployment | Out-Null }
                '0' {
                    Write-Info "退出"
                    exit 0
                }
                default {
                    Write-Error-Custom "無效選擇"
                }
            }
        }
    } else {
        switch ($Action) {
            'deploy' { Full-Deployment | Out-Null }
            'backup' { Backup-Project (Get-Version) }
            'list' { List-Versions }
            'rollback' {
                $version = Read-Host "輸入要回滾的版本"
                Rollback-To-Version $version | Out-Null
            }
            'check' { Check-Prerequisites | Out-Null }
            'github' { Deploy-To-GitHub (Get-Version) | Out-Null }
            'vercel' { Deploy-To-Vercel | Out-Null }
            'verify' { Verify-Deployment | Out-Null }
        }
    }
}

# 運行主程序
Main
