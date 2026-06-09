// Taiwan Stock Sector Rotation Tracker - Complete Implementation
// Based on https://sectorrotation.netlify.app/

class SectorRotationApp {
    constructor() {
        this.allData = [];
        this.filteredData = [];
        this.selectedStatus = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.render();
    }

    setupEventListeners() {
        // Status filter clicks on left sidebar
        document.addEventListener('click', (e) => {
            const statCard = e.target.closest('[data-status]');
            if (statCard) {
                const status = statCard.dataset.status;
                this.selectStatus(status);
            }
        });

        // Detail panel close
        document.addEventListener('click', (e) => {
            if (e.target.id === 'detail-panel' || e.target.closest('.detail-close')) {
                this.closeDetailPanel();
            }
        });
    }

    async loadData() {
        try {
            const response = await fetch('/api/fetch-data');
            const result = await response.json();
            if (result.success) {
                this.allData = result.data;
            } else {
                this.loadMockData();
            }
        } catch (error) {
            console.log('Using mock data:', error.message);
            this.loadMockData();
        }

        this.filteredData = [...this.allData];
    }

    loadMockData() {
        this.allData = [
            {
                id: 1,
                sector: '整合電路製造',
                status: '主力',
                flow5d: 298.3,
                flow20d: 1245.37,
                accelerationSpeed: 25.85,
                change5d: 3.45,
                subCategories: [
                    { name: 'AI 晶圓組裝', value: 298.3 },
                    { name: 'EMS 電子代工', value: 295.1 },
                    { name: '整合無線外', value: 270.1 }
                ],
                color: '#d4a844' // 黃色/金色
            },
            {
                id: 2,
                sector: '銀行金融',
                status: '主力',
                flow5d: 219.2,
                flow20d: 856.92,
                accelerationSpeed: 18.23,
                change5d: 2.89,
                subCategories: [
                    { name: '金控公司', value: 219.2 },
                    { name: '銀行', value: 185.3 },
                    { name: '保險', value: 152.4 }
                ],
                color: '#e97755' // 橙色/紅色
            },
            {
                id: 3,
                sector: '雲端與...',
                status: '短期',
                flow5d: 96.3,
                flow20d: 523.45,
                accelerationSpeed: 12.34,
                change5d: 1.56,
                subCategories: [
                    { name: '雲端基礎設施', value: 96.3 },
                    { name: '資料中心', value: 78.9 },
                    { name: 'SaaS應用', value: 67.5 }
                ],
                color: '#f97316' // 橙色
            },
            {
                id: 4,
                sector: 'AI 先進',
                status: '短期',
                flow5d: 187.65,
                flow20d: 934.23,
                accelerationSpeed: 15.67,
                change5d: 2.34,
                subCategories: [
                    { name: 'AI晶片', value: 187.65 },
                    { name: 'AI軟體', value: 156.3 },
                    { name: 'AI服務', value: 134.7 }
                ],
                color: '#8bc34a' // 綠色
            },
            {
                id: 5,
                sector: '記憶體類',
                status: '觀望',
                flow5d: -45.67,
                flow20d: 234.56,
                accelerationSpeed: -8.9,
                change5d: -1.23,
                subCategories: [
                    { name: 'DRAM', value: -45.67 },
                    { name: 'NAND Flash', value: -23.4 },
                    { name: '3D NAND', value: 12.3 }
                ],
                color: '#22c55e' // 綠色
            },
            {
                id: 6,
                sector: '離岸風...',
                status: '觀察',
                flow5d: 0.0,
                flow20d: -234.56,
                accelerationSpeed: -28.9,
                change5d: -5.67,
                subCategories: [
                    { name: '風機製造', value: 0.0 },
                    { name: '海上安裝', value: -45.3 },
                    { name: '維運服務', value: -78.9 }
                ],
                color: '#ef4444' // 紅色
            },
            {
                id: 7,
                sector: 'CPU...',
                status: '觀察',
                flow5d: -1182.3,
                flow20d: -1123.45,
                accelerationSpeed: -45.2,
                change5d: -8.9,
                subCategories: [
                    { name: 'CPU設計', value: -1182.3 },
                    { name: 'GPU製造', value: -856.7 },
                    { name: 'SoC開發', value: -634.2 }
                ],
                color: '#22c55e' // 綠色
            }
        ];
    }

    selectStatus(status) {
        // Toggle selection
        if (this.selectedStatus === status) {
            this.selectedStatus = null;
            this.filteredData = [...this.allData];
        } else {
            this.selectedStatus = status;
            this.filteredData = this.allData.filter(d => d.status === status);
        }

        // Update UI and re-render
        this.updateStatuses();
        this.renderBubbleChart();
    }

    updateStatuses() {
        // Recalculate status counts from filtered data
        const data = this.selectedStatus ? this.allData : this.filteredData;

        document.querySelectorAll('[data-status]').forEach(el => {
            const status = el.dataset.status;
            const count = data.filter(d => d.status === status).length;
            const valueEl = el.querySelector('.status-value');
            if (valueEl) valueEl.textContent = count;

            if (this.selectedStatus === status) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    render() {
        this.updateStatuses();
        this.renderBubbleChart();
    }

    renderBubbleChart() {
        createBubbleChart(
            this.filteredData,
            this.selectedStatus,
            (sector) => this.showDetailPanel(sector)
        );
    }

    showDetailPanel(sector) {
        const panel = document.getElementById('detail-panel');
        const title = panel.querySelector('.detail-title');
        const subCategoriesEl = panel.querySelector('.sub-categories');

        title.textContent = sector.sector;

        // Show sub-categories
        subCategoriesEl.innerHTML = sector.subCategories
            .map(sub => `
                <div class="sub-category">
                    <span>${sub.name}</span>
                    <span class="value ${sub.value >= 0 ? 'positive' : 'negative'}">
                        ${sub.value >= 0 ? '+' : ''}${sub.value.toFixed(1)}億
                    </span>
                </div>
            `)
            .join('');

        panel.classList.add('active');
    }

    closeDetailPanel() {
        document.getElementById('detail-panel').classList.remove('active');
    }
}

// Initialize app
const app = new SectorRotationApp();
