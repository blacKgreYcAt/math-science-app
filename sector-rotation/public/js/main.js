// Taiwan Stock Sector Rotation - Law Person Fund Flow
// 基於法人資金流向的板塊輪動追蹤

class SectorRotationApp {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.render();
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshData());

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterBySearch(e.target.value);
        });

        // Detail panel close (click outside)
        document.addEventListener('click', (e) => {
            const detailPanel = document.getElementById('detail-panel');
            if (!detailPanel.contains(e.target) && !e.target.classList.contains('bubble')) {
                this.closeDetailPanel();
            }
        });

        // Sidebar items
        document.addEventListener('click', (e) => {
            if (e.target.closest('.sidebar-item')) {
                const item = e.target.closest('.sidebar-item');
                const sectorName = item.dataset.sector;
                const sector = this.data.find(s => s.sector === sectorName);
                if (sector) {
                    this.showDetailPanel(sector);
                }
            }
        });
    }

    async loadData() {
        try {
            const response = await fetch('/api/fetch-data');
            const result = await response.json();

            if (result.success) {
                this.data = result.data;
                this.filteredData = [...this.data];
            } else {
                console.log('API failed, using mock data');
                this.loadFallbackData();
            }
        } catch (error) {
            console.log('Error loading data, using mock data:', error.message);
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        console.log('Loading mock sector data...');
        this.data = this.generateMockSectorData();
        this.filteredData = [...this.data];
    }

    generateMockSectorData() {
        // 使用TWSE產業分類和法人資金流向數據
        const sectors = [
            {
                sector: '智慧型手機',
                code: '2317',
                basicFundFlow: -14.22,
                flow5d: 182.11,
                flow20d: 1245.37,
                accelerationSpeed: -25.85,
                change5d: -4.56,
                stocks: ['2317', '2354', '2392'],
                fundStatus: '觀望'
            },
            {
                sector: '整合電路製造',
                code: '2330',
                basicFundFlow: 45.67,
                flow5d: 256.34,
                flow20d: 1856.92,
                accelerationSpeed: 18.23,
                change5d: 3.45,
                stocks: ['2330', '2331', '2379'],
                fundStatus: '主力'
            },
            {
                sector: '記憶體類組',
                code: '2448',
                basicFundFlow: 12.34,
                flow5d: 145.67,
                flow20d: 923.45,
                accelerationSpeed: -8.90,
                change5d: 1.23,
                stocks: ['2448', '2474', '3034'],
                fundStatus: '輪動'
            },
            {
                sector: 'NOR Flash與磁盤機',
                code: '2357',
                basicFundFlow: -8.45,
                flow5d: 67.89,
                flow20d: 456.78,
                accelerationSpeed: -12.34,
                change5d: -2.15,
                stocks: ['2357', '2388', '2395'],
                fundStatus: '觀望'
            },
            {
                sector: 'IC設計',
                code: '3034',
                basicFundFlow: 23.45,
                flow5d: 178.90,
                flow20d: 1123.45,
                accelerationSpeed: 15.67,
                change5d: 2.89,
                stocks: ['3034', '3050', '3211'],
                fundStatus: '輪動'
            },
            {
                sector: '電子零組件',
                code: '2308',
                basicFundFlow: -5.67,
                flow5d: 89.23,
                flow20d: 567.89,
                accelerationSpeed: -10.23,
                change5d: -1.45,
                stocks: ['2308', '2311', '2313'],
                fundStatus: '觀望'
            },
            {
                sector: '光磊',
                code: '2340',
                basicFundFlow: 34.56,
                flow5d: 212.34,
                flow20d: 1456.78,
                accelerationSpeed: 22.11,
                change5d: 3.67,
                stocks: ['2340', '2342', '2344'],
                fundStatus: '主力'
            },
            {
                sector: '面板',
                code: '2408',
                basicFundFlow: -12.34,
                flow5d: -45.67,
                flow20d: -234.56,
                accelerationSpeed: -28.90,
                change5d: -5.67,
                stocks: ['2408', '2409', '2412'],
                fundStatus: '退潮'
            },
            {
                sector: '連接器',
                code: '2414',
                basicFundFlow: 15.67,
                flow5d: 123.45,
                flow20d: 789.23,
                accelerationSpeed: 9.87,
                change5d: 2.34,
                stocks: ['2414', '2416', '2420'],
                fundStatus: '輪動'
            },
            {
                sector: '光寶科',
                code: '2430',
                basicFundFlow: 8.90,
                flow5d: 98.76,
                flow20d: 654.32,
                accelerationSpeed: 5.43,
                change5d: 1.56,
                stocks: ['2430', '2433', '2436'],
                fundStatus: '輪動'
            }
        ];

        return sectors.map((s, idx) => ({
            id: idx + 1,
            sector: s.sector,
            code: s.code,
            basicFundFlow: s.basicFundFlow,      // 基本法人淨買賣超（億）
            flow5d: s.flow5d,                    // 近5日法人資金流向（億）
            flow20d: s.flow20d,                  // 近20日累計（億）
            accelerationSpeed: s.accelerationSpeed,  // 資金加速度（億/天）
            change5d: s.change5d,                // 近5日漲跌（%）
            stocks: s.stocks,                    // 代表股票
            fundStatus: s.fundStatus,
            timestamp: new Date().toISOString()
        }));
    }

    async refreshData() {
        const btn = document.getElementById('refreshBtn');
        btn.textContent = '刷新中...';
        btn.disabled = true;

        await this.loadData();
        this.render();

        btn.textContent = '刷新';
        btn.disabled = false;
    }

    filterBySearch(query) {
        if (!query.trim()) {
            this.filteredData = [...this.data];
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredData = this.data.filter(d =>
                d.sector.toLowerCase().includes(lowerQuery) ||
                d.code.includes(query)
            );
        }
        this.render();
    }

    render() {
        this.updateStats();
        this.updateSidebar();
        this.renderBubbleChart();
    }

    updateStats() {
        const rotatCount = this.data.filter(s => s.fundStatus === '輪動').length;
        const majorCount = this.data.filter(s => s.fundStatus === '主力').length;
        const watchCount = this.data.filter(s => s.fundStatus === '觀望').length;

        const rotatingEl = document.getElementById('stat-rotation');
        const majorEl = document.getElementById('stat-major');
        const watchEl = document.getElementById('stat-watching');

        if (rotatingEl) rotatingEl.textContent = rotatCount;
        if (majorEl) majorEl.textContent = majorCount;
        if (watchEl) watchEl.textContent = watchCount;
    }

    updateSidebar() {
        const sidebarList = document.getElementById('sidebarList');
        sidebarList.innerHTML = '';

        // 按法人資金流向排序
        const sorted = [...this.data].sort((a, b) => b.flow20d - a.flow20d);

        sorted.slice(0, 8).forEach(sector => {
            const item = document.createElement('div');
            item.className = 'sidebar-item';
            item.dataset.sector = sector.sector;

            const flow = sector.flow20d;
            const isPositive = flow >= 0;

            item.innerHTML = `
                <div class="sidebar-item-name">${sector.sector}</div>
                <div class="sidebar-item-value ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '+' : ''}${flow.toFixed(2)}<span style="font-size: 11px;">億</span>
                </div>
            `;

            item.addEventListener('click', () => this.showDetailPanel(sector));
            sidebarList.appendChild(item);
        });
    }

    renderBubbleChart() {
        createBubbleChart(this.filteredData, (sector) => this.showDetailPanel(sector));
    }

    showDetailPanel(sector) {
        document.getElementById('detail-sector').textContent = sector.sector;
        document.getElementById('detail-basic').textContent =
            `${sector.basicFundFlow > 0 ? '+' : ''}${sector.basicFundFlow.toFixed(2)}億`;
        document.getElementById('detail-5d').textContent =
            `${sector.flow5d > 0 ? '+' : ''}${sector.flow5d.toFixed(2)}億`;
        document.getElementById('detail-20d').textContent =
            `${sector.flow20d > 0 ? '+' : ''}${sector.flow20d.toFixed(2)}億`;
        document.getElementById('detail-speed').textContent =
            `${sector.accelerationSpeed > 0 ? '+' : ''}${sector.accelerationSpeed.toFixed(2)}億/天`;

        const changeElement = document.getElementById('detail-change');
        changeElement.textContent = `${sector.change5d > 0 ? '+' : ''}${sector.change5d.toFixed(2)}%`;
        changeElement.className = 'detail-value ' + (sector.change5d >= 0 ? 'positive' : 'negative');

        // 代表股票
        const stocksHtml = sector.stocks.map(code =>
            `<div class="stock-tag">${code}</div>`
        ).join('');
        document.getElementById('detail-stocks').innerHTML = stocksHtml;

        // 代票數
        document.getElementById('detail-codes').textContent = sector.stocks.join(' · ');

        const panel = document.getElementById('detail-panel');
        panel.classList.remove('hidden');
        panel.classList.add('active');
    }

    closeDetailPanel() {
        const panel = document.getElementById('detail-panel');
        panel.classList.remove('active');
        setTimeout(() => panel.classList.add('hidden'), 300);
    }
}

// Initialize App
const app = new SectorRotationApp();

// Auto-refresh every 5 minutes
setInterval(() => {
    app.refreshData();
}, 5 * 60 * 1000);
