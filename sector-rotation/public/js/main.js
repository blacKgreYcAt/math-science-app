// Main Application Logic

class SectorRotationApp {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.currentView = 'bubble';
        this.currentFilter = '';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.render();
    }

    setupEventListeners() {
        // View Toggle
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // Refresh Button
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshData());

        // Filters
        document.getElementById('fundStatusFilter').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.applyFilter();
            if (this.currentView === 'bubble') {
                this.renderBubbleChart();
            } else {
                this.renderRankingTable();
            }
        });

        document.getElementById('rankingSortBy').addEventListener('change', (e) => {
            this.sortData(e.target.value);
            this.renderRankingTable();
        });

        // Detail Panel Close
        document.getElementById('detailClose').addEventListener('click', () => {
            this.closeDetailPanel();
        });

        // Click outside detail panel to close
        document.addEventListener('click', (e) => {
            const detailPanel = document.getElementById('detail-panel');
            if (detailPanel && !detailPanel.contains(e.target) &&
                !e.target.classList.contains('bubble') &&
                !e.target.classList.contains('ranking-row')) {
                this.closeDetailPanel();
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
                this.updateStats(result.stats);
                this.updateTimestamp(result.stats.fetchTime);
            } else {
                console.error('Failed to fetch data:', result.error);
                this.loadMockData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            // 在本地開發環境中使用模擬數據
            this.loadMockData();
        }
    }

    loadMockData() {
        console.log('Using mock data for development...');
        this.data = this.generateMockSectorData();
        this.filteredData = [...this.data];

        const stats = {
            majors: this.data.filter(s => s.fundStatus === '主力').length,
            rotation: this.data.filter(s => s.fundStatus === '輪動').length,
            watching: this.data.filter(s => s.fundStatus === '觀望').length,
            declining: this.data.filter(s => s.fundStatus === '退潮').length,
            fetchTime: new Date().toISOString()
        };

        this.updateStats(stats);
        this.updateTimestamp(stats.fetchTime);
    }

    generateMockSectorData() {
        const sectors = [
            { sector: '電子業', code: '2330', change5d: 2.45, change20d: 8.32 },
            { sector: '金融業', code: '2884', change5d: -0.85, change20d: 3.21 },
            { sector: '觀光旅遊', code: '2704', change5d: 5.32, change20d: 12.15 },
            { sector: '塑膠製品', code: '1101', change5d: -1.23, change20d: -2.18 },
            { sector: '水泥業', code: '1102', change5d: 0.56, change20d: 4.18 },
            { sector: '鋼鐵業', code: '2002', change5d: -2.34, change20d: 1.45 },
            { sector: '食品業', code: '1216', change5d: 3.12, change20d: 6.72 },
            { sector: '半導體', code: '2317', change5d: 4.28, change20d: 15.34 },
            { sector: '汽車業', code: '2201', change5d: -0.67, change20d: 2.05 },
            { sector: '紡織業', code: '1456', change5d: 1.45, change20d: -1.28 }
        ];

        return sectors.map((sector, idx) => {
            // 根據漲幅判斷資金狀態
            let fundStatus = '觀望';
            if (sector.change5d > 1 && sector.change20d > 3) {
                fundStatus = '主力';
            } else if (sector.change5d > 0 && sector.change20d > 0) {
                fundStatus = '輪動';
            } else if (sector.change5d < -1 || sector.change20d < -2) {
                fundStatus = '退潮';
            }

            return {
                id: idx + 1,
                sector: sector.sector,
                code: sector.code,
                change5d: sector.change5d,
                change20d: sector.change20d,
                fundStatus: fundStatus,
                fundAmount: Math.floor(Math.random() * 10000000000),
                timestamp: new Date().toISOString()
            };
        });
    }

    async refreshData() {
        const btn = document.getElementById('refreshBtn');
        btn.disabled = true;
        btn.textContent = '刷新中...';

        await this.loadData();
        this.render();

        btn.disabled = false;
        btn.textContent = '刷新數據';
    }

    applyFilter() {
        if (this.currentFilter) {
            this.filteredData = this.data.filter(d => d.fundStatus === this.currentFilter);
        } else {
            this.filteredData = [...this.data];
        }
    }

    sortData(sortBy) {
        const data = this.currentView === 'ranking' ? this.filteredData : this.data;

        if (sortBy === 'change20d') {
            data.sort((a, b) => b.change20d - a.change20d);
        } else if (sortBy === 'change5d') {
            data.sort((a, b) => b.change5d - a.change5d);
        } else if (sortBy === 'fundAmount') {
            data.sort((a, b) => b.fundAmount - a.fundAmount);
        }
    }

    switchView(viewName) {
        // Update buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });

        // Update views
        document.getElementById('bubble-view').classList.toggle('active', viewName === 'bubble');
        document.getElementById('ranking-view').classList.toggle('active', viewName === 'ranking');

        this.currentView = viewName;
        this.render();
    }

    render() {
        this.applyFilter();

        if (this.currentView === 'bubble') {
            this.renderBubbleChart();
        } else {
            this.sortData('change20d');
            this.renderRankingTable();
        }
    }

    renderBubbleChart() {
        // This will be handled by visualization.js
        createBubbleChart(this.filteredData, (sector) => this.showDetailPanel(sector));
    }

    renderRankingTable() {
        const tbody = document.getElementById('ranking-tbody');
        tbody.innerHTML = '';

        this.filteredData.forEach((sector, index) => {
            const row = document.createElement('tr');
            row.className = 'ranking-row';
            row.style.cursor = 'pointer';

            const change5dClass = sector.change5d >= 0 ? 'change-positive' : 'change-negative';
            const change20dClass = sector.change20d >= 0 ? 'change-positive' : 'change-negative';
            const statusClass = sector.fundStatus.toLowerCase().replace(/\s+/g, '-');
            const fundAmountDisplay = this.formatCurrency(sector.fundAmount);

            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${sector.sector}</strong></td>
                <td><span class="status-badge ${statusClass}">${sector.fundStatus}</span></td>
                <td class="${change5dClass}">${sector.change5d > 0 ? '+' : ''}${sector.change5d.toFixed(2)}%</td>
                <td class="${change20dClass}">${sector.change20d > 0 ? '+' : ''}${sector.change20d.toFixed(2)}%</td>
                <td class="fund-amount">${fundAmountDisplay}</td>
            `;

            row.addEventListener('click', () => this.showDetailPanel(sector));
            tbody.appendChild(row);
        });
    }

    showDetailPanel(sector) {
        document.getElementById('detail-sector').textContent = sector.sector;
        document.getElementById('detail-status').innerHTML =
            `<span class="status-badge ${sector.fundStatus.toLowerCase().replace(/\s+/g, '-')}">${sector.fundStatus}</span>`;
        document.getElementById('detail-change5d').textContent =
            `${sector.change5d > 0 ? '+' : ''}${sector.change5d.toFixed(2)}%`;
        document.getElementById('detail-change20d').textContent =
            `${sector.change20d > 0 ? '+' : ''}${sector.change20d.toFixed(2)}%`;
        document.getElementById('detail-fund').textContent = this.formatCurrency(sector.fundAmount);

        const panel = document.getElementById('detail-panel');
        panel.classList.remove('hidden');
        panel.classList.add('active');
    }

    closeDetailPanel() {
        const panel = document.getElementById('detail-panel');
        panel.classList.remove('active');
        setTimeout(() => panel.classList.add('hidden'), 300);
    }

    updateStats(stats) {
        document.getElementById('stat-major').textContent = stats.majors;
        document.getElementById('stat-rotation').textContent = stats.rotation;
        document.getElementById('stat-watching').textContent = stats.watching;
        document.getElementById('stat-declining').textContent = stats.declining;
    }

    updateTimestamp(timestamp) {
        const date = new Date(timestamp);
        const timeString = date.toLocaleTimeString('zh-TW');
        document.getElementById('stat-time').textContent = timeString;
    }

    formatCurrency(amount) {
        if (amount >= 1000000000) {
            return (amount / 1000000000).toFixed(2) + ' B';
        } else if (amount >= 1000000) {
            return (amount / 1000000).toFixed(2) + ' M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(2) + ' K';
        }
        return amount.toString();
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        alert.textContent = message;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }
}

// Initialize App
const app = new SectorRotationApp();

// Auto-refresh every 5 minutes
setInterval(() => {
    app.refreshData();
}, 5 * 60 * 1000);
