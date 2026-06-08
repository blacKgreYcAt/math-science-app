#!/bin/bash

# ============================================
# 🚀 Learning Platform 部署和版本管理腳本
# ============================================

set -e  # 遇到錯誤時退出

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${PROJECT_ROOT}/backups/releases"
MATH_APP_DIR="${PROJECT_ROOT}/math-science-app"
LEARNING_PLATFORM_DIR="${PROJECT_ROOT}/learning-platform"
VERSION_FILE="${PROJECT_ROOT}/VERSION.md"
CHANGELOG_FILE="${PROJECT_ROOT}/CHANGELOG.md"

# 函數定義
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 提取版本號
get_version() {
    grep "^## 當前版本" "$VERSION_FILE" -A 1 | grep "**v" | sed 's/.*\*\*\(v[^*]*\)\*\*.*/\1/'
}

# 創建備份
backup_project() {
    local version=$1
    local backup_path="${BACKUP_DIR}/${version}"

    print_header "正在備份版本 ${version}"

    # 創建備份目錄
    mkdir -p "${backup_path}/{source,metadata}"

    # 備份源代碼
    print_info "備份源代碼..."
    cp -r "${MATH_APP_DIR}" "${backup_path}/source/math-science-app"
    cp -r "${LEARNING_PLATFORM_DIR}" "${backup_path}/source/learning-platform" 2>/dev/null || true

    # 備份版本信息
    print_info "備份版本信息..."
    cp "${VERSION_FILE}" "${backup_path}/metadata/"
    cp "${CHANGELOG_FILE}" "${backup_path}/metadata/"

    # 創建備份元數據
    cat > "${backup_path}/metadata/backup-info.json" << EOF
{
  "version": "${version}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "git_commit": "$(cd ${PROJECT_ROOT} && git rev-parse HEAD)",
  "git_branch": "$(cd ${PROJECT_ROOT} && git rev-parse --abbrev-ref HEAD)",
  "backup_path": "${backup_path}",
  "includes": [
    "math-science-app (時間換算模塊)",
    "learning-platform (主學習平台)",
    "版本和變更日誌"
  ]
}
EOF

    print_success "備份完成: ${backup_path}"
}

# 列出所有版本
list_versions() {
    print_header "可用的備份版本"

    if [ ! -d "$BACKUP_DIR" ]; then
        print_warning "備份目錄不存在"
        return
    fi

    echo "版本列表:"
    for dir in "$BACKUP_DIR"/*; do
        if [ -d "$dir" ]; then
            version=$(basename "$dir")
            if [ -f "$dir/metadata/backup-info.json" ]; then
                timestamp=$(grep "timestamp" "$dir/metadata/backup-info.json" | cut -d'"' -f4)
                echo "  • ${version} (備份於: ${timestamp})"
            else
                echo "  • ${version}"
            fi
        fi
    done
}

# 回滾到指定版本
rollback_to_version() {
    local target_version=$1
    local backup_path="${BACKUP_DIR}/${target_version}"

    if [ ! -d "$backup_path" ]; then
        print_error "找不到版本 ${target_version} 的備份"
        list_versions
        return 1
    fi

    print_header "準備回滾到版本 ${target_version}"

    print_warning "警告: 此操作將覆蓋當前代碼!"
    read -p "您確定要繼續嗎? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "回滾已取消"
        return 0
    fi

    # 創建當前版本的快照
    local current_version=$(get_version)
    print_info "備份當前版本 ${current_version}..."
    backup_project "snapshot-${current_version}-$(date +%s)"

    # 恢復備份
    print_info "恢復版本 ${target_version}..."
    rm -rf "${MATH_APP_DIR}"/*
    cp -r "${backup_path}/source/math-science-app"/* "${MATH_APP_DIR}/"

    if [ -d "${backup_path}/source/learning-platform" ]; then
        rm -rf "${LEARNING_PLATFORM_DIR}"/*
        cp -r "${backup_path}/source/learning-platform"/* "${LEARNING_PLATFORM_DIR}/"
    fi

    print_success "版本已回滾到 ${target_version}"

    # 顯示後續步驟
    echo -e "\n${BLUE}後續步驟:${NC}"
    echo "1. 驗證代碼: cd $PROJECT_ROOT && git status"
    echo "2. 提交更改: git add . && git commit -m 'Rollback to ${target_version}'"
    echo "3. 推送到 GitHub: git push origin main"
    echo "4. 部署到 Vercel: vercel --prod"
}

# 檢查前置條件
check_prerequisites() {
    print_header "檢查前置條件"

    local missing=0

    # 檢查 Git
    if ! command -v git &> /dev/null; then
        print_error "Git 未安裝"
        missing=1
    else
        print_success "Git 已安裝"
    fi

    # 檢查 Vercel CLI
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI 未安裝 (建議安裝以進行部署)"
    else
        print_success "Vercel CLI 已安裝"
    fi

    # 檢查項目結構
    if [ ! -d "$MATH_APP_DIR" ]; then
        print_error "找不到 math-science-app 目錄"
        missing=1
    else
        print_success "找到 math-science-app 目錄"
    fi

    if [ $missing -eq 1 ]; then
        print_error "缺少必要的前置條件"
        return 1
    fi

    return 0
}

# 準備部署
prepare_deployment() {
    local version=$1

    print_header "準備部署版本 ${version}"

    # 檢查 Git 狀態
    cd "$PROJECT_ROOT"

    if [ -n "$(git status -s)" ]; then
        print_warning "工作目錄有未提交的更改"
        git status -s
        read -p "繼續? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            return 1
        fi
    fi

    # 創建 Git tag
    print_info "創建 Git tag: ${version}"
    git tag -a "$version" -m "Release ${version}" || print_warning "Tag 可能已存在"

    print_success "部署準備完成"
}

# 部署到 GitHub
deploy_to_github() {
    local version=$1

    print_header "部署到 GitHub"

    cd "$PROJECT_ROOT"

    print_info "推送代碼到 GitHub..."
    git push origin main

    print_info "推送標籤到 GitHub..."
    git push origin "$version"

    print_success "已推送到 GitHub"
    echo -e "\n${BLUE}下一步:${NC}"
    echo "1. 訪問: https://github.com/blacKgreYcAt/learning-platform/releases/new"
    echo "2. 選擇標籤: ${version}"
    echo "3. 創建 Release"
}

# 部署到 Vercel
deploy_to_vercel() {
    print_header "部署到 Vercel"

    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI 未安裝"
        echo "安裝命令: npm i -g vercel"
        return 1
    fi

    cd "$PROJECT_ROOT"

    print_info "正在部署到 Vercel..."
    vercel --prod

    print_success "已部署到 Vercel"
}

# 部署後驗證
verify_deployment() {
    print_header "驗證部署"

    print_info "檢查代碼語法..."
    node -c "$MATH_APP_DIR/time-conversion-module.js"
    node -c "$MATH_APP_DIR/time-conversion-data.js"

    print_success "代碼語法檢查通過"

    print_info "訪問部署的應用: https://learning-platform-two-eosin.vercel.app"
    print_info "檢查時間換算模塊是否正常運作"
}

# 完整部署流程
full_deployment() {
    local version=$(get_version)

    # 1. 檢查前置條件
    if ! check_prerequisites; then
        return 1
    fi

    # 2. 創建備份
    backup_project "$version"

    # 3. 準備部署
    if ! prepare_deployment "$version"; then
        return 1
    fi

    # 4. 部署到 GitHub
    read -p "部署到 GitHub? (yes/no): " github_deploy
    if [ "$github_deploy" = "yes" ]; then
        deploy_to_github "$version"
    fi

    # 5. 部署到 Vercel
    read -p "部署到 Vercel? (yes/no): " vercel_deploy
    if [ "$vercel_deploy" = "yes" ]; then
        deploy_to_vercel
    fi

    # 6. 驗證部署
    verify_deployment

    print_header "部署完成！"
    echo -e "${GREEN}版本 ${version} 已成功部署${NC}"
}

# 主菜單
show_menu() {
    echo ""
    echo "Learning Platform 部署管理"
    echo "=========================="
    echo "1. 完整部署流程 (備份 → GitHub → Vercel)"
    echo "2. 只創建備份"
    echo "3. 列出所有版本"
    echo "4. 回滾到指定版本"
    echo "5. 檢查前置條件"
    echo "6. 部署到 GitHub"
    echo "7. 部署到 Vercel"
    echo "8. 驗證部署"
    echo "0. 退出"
    echo ""
    read -p "選擇操作 (0-8): " choice
}

# 主程序
main() {
    while true; do
        show_menu

        case $choice in
            1)
                full_deployment
                ;;
            2)
                backup_project "$(get_version)"
                ;;
            3)
                list_versions
                ;;
            4)
                read -p "輸入要回滾的版本 (例如 v0.9.0): " version
                rollback_to_version "$version"
                ;;
            5)
                check_prerequisites
                ;;
            6)
                deploy_to_github "$(get_version)"
                ;;
            7)
                deploy_to_vercel
                ;;
            8)
                verify_deployment
                ;;
            0)
                print_info "退出"
                exit 0
                ;;
            *)
                print_error "無效選擇"
                ;;
        esac
    done
}

# 運行主程序
main
