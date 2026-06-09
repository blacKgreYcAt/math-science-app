// Taiwan Stock Sector Rotation Data Fetcher
// Vercel Serverless Function

const https = require('https');

function fetchTWSEData() {
  return new Promise((resolve, reject) => {
    // TWSE股票資訊API - 獲取上市公司基本資料
    const options = {
      hostname: 'www.twse.com.tw',
      path: '/exchangeReport/STOCK_DAY?response=json&date=' + getCurrentDate(),
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear() - 1911; // 民國年
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 生成模擬的板塊數據
function generateSectorData() {
  const sectors = [
    { name: '電子業', code: '2330', change5d: 2.5, change20d: 8.3, fundFlow: 'positive' },
    { name: '金融業', code: '2884', change5d: -1.2, change20d: 3.5, fundFlow: 'neutral' },
    { name: '觀光旅遊', code: '2704', change5d: 5.8, change20d: 12.1, fundFlow: 'accelerating' },
    { name: '塑膠製品', code: '1101', change5d: 0.5, change20d: -2.3, fundFlow: 'negative' },
    { name: '水泥業', code: '1101', change5d: 1.2, change20d: 4.2, fundFlow: 'neutral' },
    { name: '鋼鐵業', code: '2002', change5d: -2.1, change20d: 1.5, fundFlow: 'negative' },
    { name: '食品業', code: '1216', change5d: 3.2, change20d: 6.7, fundFlow: 'positive' },
    { name: '半導體', code: '2330', change5d: 4.5, change20d: 15.2, fundFlow: 'accelerating' },
    { name: '汽車業', code: '2201', change5d: -0.8, change20d: 2.1, fundFlow: 'neutral' },
    { name: '紡織業', code: '1101', change5d: 1.8, change20d: -1.5, fundFlow: 'slowing' }
  ];

  return sectors.map((sector, idx) => {
    const fundStatus = sector.fundFlow === 'accelerating' ? '主力'
                     : sector.fundFlow === 'positive' ? '輪動'
                     : sector.fundFlow === 'neutral' ? '觀望' : '退潮';

    return {
      id: idx + 1,
      sector: sector.name,
      code: sector.code,
      change5d: parseFloat((Math.random() * 8 - 4).toFixed(2)),
      change20d: parseFloat((Math.random() * 20 - 5).toFixed(2)),
      fundStatus: fundStatus,
      fundAmount: Math.floor(Math.random() * 10000000000),
      timestamp: new Date().toISOString()
    };
  });
}

module.exports = async (req, res) => {
  // 設置CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 生成模擬數據（實際應用可連接真實數據源）
    const sectorData = generateSectorData();

    // 計算統計信息
    const stats = {
      totalSectors: sectorData.length,
      majors: sectorData.filter(s => s.fundStatus === '主力').length,
      rotation: sectorData.filter(s => s.fundStatus === '輪動').length,
      watching: sectorData.filter(s => s.fundStatus === '觀望').length,
      declining: sectorData.filter(s => s.fundStatus === '退潮').length,
      fetchTime: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: sectorData,
      stats: stats
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
