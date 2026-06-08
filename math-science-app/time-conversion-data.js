/**
 * 時間換算教學模塊 - 數據和題庫
 * 包含：教學內容 + 50道題目（基礎15 + 進階20 + 挑戰15）
 */

// ============ 教學內容 ============
const TIME_CONVERSION_TUTORIAL = {
  chapter1: {
    title: '⏰ 基礎概念：時間的單位轉換',
    subtitle: '認識時間單位之間的關係',
    duration: '5-10分鐘',
    sections: [
      {
        heading: '1️⃣ 分層時間單位 - 點擊查看',
        content: `
          <div class="time-conversion-basic-mobile">
            <!-- 層級1：1天 = 24小時 -->
            <div class="conversion-layer">
              <div class="layer-header">
                <div class="header-icon">🌅</div>
                <div class="header-text">
                  <div class="header-title">1 天 = 24 小時</div>
                  <div class="header-hint">按下方的方塊查看</div>
                </div>
              </div>

              <div class="progress-bar-wrapper">
                <div class="progress-bar-container">
                  <div class="progress-segments">
                    <button class="progress-segment" data-segment="1" onclick="highlightSegment(this, 1)">
                      <span class="segment-label">0-6h</span>
                    </button>
                    <button class="progress-segment" data-segment="2" onclick="highlightSegment(this, 2)">
                      <span class="segment-label">6-12h</span>
                    </button>
                    <button class="progress-segment" data-segment="3" onclick="highlightSegment(this, 3)">
                      <span class="segment-label">12-18h</span>
                    </button>
                    <button class="progress-segment" data-segment="4" onclick="highlightSegment(this, 4)">
                      <span class="segment-label">18-24h</span>
                    </button>
                  </div>
                </div>
                <div class="segment-info" id="segmentInfo">
                  <span id="segmentDisplay">點擊上方的方塊試試看</span>
                </div>
              </div>
            </div>

            <!-- 層級2：1小時 = 60分鐘 -->
            <div class="conversion-layer">
              <div class="layer-header">
                <div class="header-icon">⏱️</div>
                <div class="header-text">
                  <div class="header-title">1 小時 = 60 分鐘</div>
                  <div class="header-hint">按下方的方塊查看</div>
                </div>
              </div>

              <div class="progress-bar-wrapper">
                <div class="progress-bar-container">
                  <div class="progress-segments">
                    <button class="progress-segment" data-segment="1" onclick="highlightMinutes(this, 1)">
                      <span class="segment-label">0-20m</span>
                    </button>
                    <button class="progress-segment" data-segment="2" onclick="highlightMinutes(this, 2)">
                      <span class="segment-label">20-40m</span>
                    </button>
                    <button class="progress-segment" data-segment="3" onclick="highlightMinutes(this, 3)">
                      <span class="segment-label">40-60m</span>
                    </button>
                  </div>
                </div>
                <div class="segment-info" id="minutesInfo">
                  <span id="minutesDisplay">點擊上方的方塊試試看</span>
                </div>
              </div>
            </div>

            <!-- 層級3：1分鐘 = 60秒 -->
            <div class="conversion-layer">
              <div class="layer-header">
                <div class="header-icon">⏰</div>
                <div class="header-text">
                  <div class="header-title">1 分鐘 = 60 秒</div>
                  <div class="header-hint">按下方的方塊查看</div>
                </div>
              </div>

              <div class="progress-bar-wrapper">
                <div class="progress-bar-container">
                  <div class="progress-segments">
                    <button class="progress-segment" data-segment="1" onclick="highlightSeconds(this, 1)">
                      <span class="segment-label">0-15s</span>
                    </button>
                    <button class="progress-segment" data-segment="2" onclick="highlightSeconds(this, 2)">
                      <span class="segment-label">15-30s</span>
                    </button>
                    <button class="progress-segment" data-segment="3" onclick="highlightSeconds(this, 3)">
                      <span class="segment-label">30-45s</span>
                    </button>
                    <button class="progress-segment" data-segment="4" onclick="highlightSeconds(this, 4)">
                      <span class="segment-label">45-60s</span>
                    </button>
                  </div>
                </div>
                <div class="segment-info" id="secondsInfo">
                  <span id="secondsDisplay">點擊上方的方塊試試看</span>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        heading: '2️⃣ 互動轉換器 - 輸入數字看結果',
        content: `
          <div class="interactive-converter-mobile">
            <div class="converter-header">
              <div class="converter-title">🎮 我來試試看</div>
              <div class="converter-hint">輸入數字，看看會轉換成什麼！</div>
            </div>

            <div class="converter-cards">
              <!-- 天 → 小時 -->
              <div class="converter-card">
                <div class="card-label">天 → 小時</div>

                <div class="input-wrapper">
                  <input
                    type="number"
                    class="converter-input"
                    id="daysInput"
                    placeholder="0"
                    inputmode="numeric"
                    min="0"
                    max="100"
                    value="2"
                    oninput="updateDaysConversion(this.value)">
                  <span class="input-unit">天</span>
                </div>

                <div class="arrow-icon">↓</div>

                <div class="result-wrapper">
                  <div class="result-value" id="hoursResult">48</div>
                  <span class="result-unit">小時</span>
                </div>
              </div>

              <!-- 小時 → 分鐘 -->
              <div class="converter-card">
                <div class="card-label">小時 → 分鐘</div>

                <div class="input-wrapper">
                  <input
                    type="number"
                    class="converter-input"
                    id="hoursInput"
                    placeholder="0"
                    inputmode="numeric"
                    min="0"
                    max="100"
                    value="3"
                    oninput="updateHoursConversion(this.value)">
                  <span class="input-unit">小時</span>
                </div>

                <div class="arrow-icon">↓</div>

                <div class="result-wrapper">
                  <div class="result-value" id="minutesResult">180</div>
                  <span class="result-unit">分鐘</span>
                </div>
              </div>

              <!-- 分鐘 → 秒 -->
              <div class="converter-card">
                <div class="card-label">分鐘 → 秒</div>

                <div class="input-wrapper">
                  <input
                    type="number"
                    class="converter-input"
                    id="minutesInput"
                    placeholder="0"
                    inputmode="numeric"
                    min="0"
                    max="100"
                    value="5"
                    oninput="updateMinutesConversion(this.value)">
                  <span class="input-unit">分鐘</span>
                </div>

                <div class="arrow-icon">↓</div>

                <div class="result-wrapper">
                  <div class="result-value" id="secondsResult">300</div>
                  <span class="result-unit">秒</span>
                </div>
              </div>
            </div>

            <!-- 反向轉換選項 -->
            <div class="reverse-mode-toggle">
              <button class="toggle-btn" id="reverseToggleBtn" onclick="toggleReverseMode()">
                <span class="toggle-icon">↔️</span>
                <span class="toggle-text">想要反向轉換？</span>
              </button>
            </div>
          </div>
        `
      },
      {
        heading: '3️⃣ 轉換公式 - 向下和向上',
        content: `
          <div class="formula-cards-mobile">
            <!-- 向下轉換 -->
            <div class="formula-card forward">
              <div class="formula-direction">向下轉換 (× 倍數)</div>

              <div class="formula-items">
                <div class="formula-item">
                  <span class="formula-from">天</span>
                  <span class="formula-op">×24</span>
                  <span class="formula-to">小時</span>
                </div>

                <div class="formula-item">
                  <span class="formula-from">小時</span>
                  <span class="formula-op">×60</span>
                  <span class="formula-to">分鐘</span>
                </div>

                <div class="formula-item">
                  <span class="formula-from">分鐘</span>
                  <span class="formula-op">×60</span>
                  <span class="formula-to">秒</span>
                </div>
              </div>
            </div>

            <!-- 向上轉換 -->
            <div class="formula-card reverse">
              <div class="formula-direction">向上轉換 (÷ 除數)</div>

              <div class="formula-items">
                <div class="formula-item">
                  <span class="formula-from">小時</span>
                  <span class="formula-op">÷24</span>
                  <span class="formula-to">天</span>
                </div>

                <div class="formula-item">
                  <span class="formula-from">分鐘</span>
                  <span class="formula-op">÷60</span>
                  <span class="formula-to">小時</span>
                </div>

                <div class="formula-item">
                  <span class="formula-from">秒</span>
                  <span class="formula-op">÷60</span>
                  <span class="formula-to">分鐘</span>
                </div>
              </div>
            </div>
          </div>
        `
      }
    ],
    interactive: true
  },

  chapter2: {
    title: '📈 跨日計算（正推）：時間往前走',
    subtitle: '已知開始時間和經過的時間，求結束時間',
    duration: '10-15分鐘',
    sections: [
      {
        heading: '📍 經典例題',
        content: `
          <div class="example-problem">
            <div class="problem-text">
              <strong>問題：</strong> 周一下午3點開始閱讀，經過30小時後是周幾幾點？
            </div>
            <div class="step-solution">
              <div class="solution-step">
                <div class="step-num">第1步</div>
                <div class="step-explain">把30小時轉換為天和小時</div>
                <div class="step-work">
                  30 ÷ 24 = 1 ... 6<br>
                  所以 30小時 = 1天 + 6小時
                </div>
              </div>
              <div class="solution-step">
                <div class="step-num">第2步</div>
                <div class="step-explain">先加上6小時</div>
                <div class="step-work">
                  下午3點 + 6小時 = 下午9點<br>
                  (3 + 6 = 9)
                </div>
              </div>
              <div class="solution-step">
                <div class="step-num">第3步</div>
                <div class="step-explain">再加上1天</div>
                <div class="step-work">
                  周一下午9點 + 1天 = 周二下午9點
                </div>
              </div>
            </div>
            <div class="answer-box" style="background: rgba(0,255,136,0.15);">
              <strong>✓ 答案：周二下午9點</strong>
            </div>
          </div>
        `
      },
      {
        heading: '🎨 時間分解視覺化 - 小時如何分解為天？',
        content: `
          <div class="time-decomposition">
            <div class="decomposition-header">
              <div class="decomposition-title">小時 = ? 天 + ? 小時</div>
              <div class="decomposition-hint" style="color: #b8c5d6; font-size: 14px; margin-top: 8px; margin-bottom: 12px;">💡 點擊下方按鈕，選擇不同的小時數查看分解過程</div>
              <div class="decomposition-buttons" style="display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap;">
                <button onclick="visualizeDecomposition(30)" class="decomposition-btn" style="background: rgba(0,245,255,0.15); border: 2px solid #00f5ff; color: #00f5ff; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">試試 30小時</button>
                <button onclick="visualizeDecomposition(36)" class="decomposition-btn" style="background: rgba(0,245,255,0.15); border: 2px solid #00f5ff; color: #00f5ff; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">試試 36小時</button>
                <button onclick="visualizeDecomposition(48)" class="decomposition-btn" style="background: rgba(0,245,255,0.15); border: 2px solid #00f5ff; color: #00f5ff; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">試試 48小時</button>
              </div>
            </div>

            <div id="decompositionVisualization" style="margin-top: 20px;">
              <div class="decomposition-bar">
                <div id="dayBar" class="decomposition-segment" style="background: linear-gradient(90deg, #00ff88 0%, #00ff88 100%); height: 40px; border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; color: #0a0e27; font-weight: bold;"></div>
                <div id="hourBar" class="decomposition-segment" style="background: linear-gradient(90deg, #00f5ff 0%, #00f5ff 100%); height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #0a0e27; font-weight: bold;"></div>
              </div>
              <div class="decomposition-result" style="margin-top: 15px; padding: 15px; background: rgba(0,245,255,0.08); border: 2px solid #00f5ff; border-radius: 8px;">
                <div id="decompositionText" style="text-align: center; color: #b8c5d6; font-size: 16px;"></div>
              </div>
            </div>
          </div>
        `
      },
      {
        heading: '💡 解題技巧',
        content: `
          <div class="tips-box">
            <div class="tip">
              <strong>✓ 技巧1：</strong> 先把「小時」轉換為「天+小時」
            </div>
            <div class="tip">
              <strong>✓ 技巧2：</strong> 先加「小時」，再加「天」
            </div>
            <div class="tip">
              <strong>✓ 技巧3：</strong> 如果小時超過24，要進位成天
            </div>
            <div class="tip">
              <strong>⚠️ 注意：</strong> 24點 = 0點（下一天的開始）
            </div>
          </div>
        `
      },
      {
        heading: '🎯 再試一個例題（可拖拽時間軸）',
        content: `
          <div class="interactive-example">
            <div class="timeline-label">周三 早上8點 → 經過48小時</div>
            <canvas id="timeline1" width="600" height="100" style="border: 1px solid #00f5ff; margin: 20px 0;"></canvas>
            <div id="timeline1Result" style="margin-top: 10px; color: #00ff88;"></div>
          </div>
        `
      }
    ],
    interactive: true
  },

  chapter3: {
    title: '🔙 跨日計算（反推）：時間往回推',
    subtitle: '已知結束時間和經過的時間，求開始時間',
    duration: '10-15分鐘',
    sections: [
      {
        heading: '📍 經典反推題',
        content: `
          <div class="example-problem">
            <div class="problem-text">
              <strong>問題：</strong> 今天早上8點，已經是課程啟動後的第30小時。課程是什麼時候開始的？
            </div>
            <div class="step-solution">
              <div class="solution-step">
                <div class="step-num">第1步</div>
                <div class="step-explain">把30小時轉換為天和小時</div>
                <div class="step-work">
                  30 ÷ 24 = 1 ... 6<br>
                  所以 30小時 = 1天 + 6小時
                </div>
              </div>
              <div class="solution-step">
                <div class="step-num">第2步</div>
                <div class="step-explain">從「今天早上8點」往回推6小時</div>
                <div class="step-work">
                  早上8點 - 6小時 = 前天晚上2點<br>
                  (8 - 6 = 2)
                </div>
              </div>
              <div class="solution-step">
                <div class="step-num">第3步</div>
                <div class="step-explain">再往回推1天</div>
                <div class="step-work">
                  前天晚上2點 - 1天 = 前前天晚上2點<br>
                  （或說：前天晚上2點就是前天的第2小時）
                </div>
              </div>
            </div>
            <div class="answer-box" style="background: rgba(255,0,170,0.15);">
              <strong>✓ 答案：前天晚上2點（22:00）</strong><br>
              <small>驗證：前天晚上2點 → 今天早上8點 = 30小時 ✓</small>
            </div>
          </div>
        `
      },
      {
        heading: '🔄 反向時間分解視覺化 - 往回推怎麼計算？',
        content: `
          <div class="time-decomposition-reverse">
            <div class="decomposition-header">
              <div class="decomposition-title">往回推 ? 小時 = 往回推 ? 天 + ? 小時</div>
              <div class="decomposition-hint" style="color: #b8c5d6; font-size: 14px; margin-top: 8px; margin-bottom: 12px;">💡 點擊下方按鈕，選擇不同的小時數查看反向分解過程</div>
              <div class="decomposition-buttons" style="display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap;">
                <button onclick="visualizeReverseDecomposition(30)" class="decomposition-btn" style="background: rgba(255,0,170,0.15); border: 2px solid #ff00aa; color: #ff00aa; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">往回推 30小時</button>
                <button onclick="visualizeReverseDecomposition(36)" class="decomposition-btn" style="background: rgba(255,0,170,0.15); border: 2px solid #ff00aa; color: #ff00aa; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">往回推 36小時</button>
                <button onclick="visualizeReverseDecomposition(48)" class="decomposition-btn" style="background: rgba(255,0,170,0.15); border: 2px solid #ff00aa; color: #ff00aa; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">往回推 48小時</button>
              </div>
            </div>

            <div id="reverseDecompositionVisualization" style="margin-top: 20px;">
              <div class="decomposition-bar">
                <div id="reverseDayBar" class="decomposition-segment" style="background: linear-gradient(90deg, #ff00aa 0%, #ff00aa 100%); height: 40px; border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; color: #0a0e27; font-weight: bold;"></div>
                <div id="reverseHourBar" class="decomposition-segment" style="background: linear-gradient(90deg, #ff0088 0%, #ff0088 100%); height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #0a0e27; font-weight: bold;"></div>
              </div>
              <div class="decomposition-result" style="margin-top: 15px; padding: 15px; background: rgba(255,0,170,0.08); border: 2px solid #ff00aa; border-radius: 8px;">
                <div id="reverseDecompositionText" style="text-align: center; color: #b8c5d6; font-size: 16px;"></div>
              </div>
            </div>

            <div id="reverseCalculationSteps" style="margin-top: 20px;"></div>
          </div>
        `
      },
      {
        heading: '💡 反推解題技巧',
        content: `
          <div class="tips-box">
            <div class="tip">
              <strong>✓ 技巧1：</strong> 把「小時」轉換為「天+小時」（和正推一樣）
            </div>
            <div class="tip">
              <strong>✓ 技巧2：</strong> 先「減小時」，再「減天」
            </div>
            <div class="tip">
              <strong>✓ 技巧3：</strong> 往回推時，如果小時不夠減，要借1天（+24小時）
            </div>
            <div class="tip">
              <strong>⚠️ 注意：</strong> 早上8點 - 10小時 需要借1天，變成 (8+24) - 10 = 22點（晚上10點）
            </div>
          </div>
        `
      }
    ],
    interactive: true
  },

  chapter4: {
    title: '🎮 交互練習：動手試試看',
    subtitle: '10個精心設計的練習題，循序漸進加深理解',
    duration: '20-30分鐘',
    sections: [
      {
        heading: '⭐ 基礎練習（1-3題）',
        content: `
          <div style="background: rgba(0,245,255,0.05); padding: 20px; border-radius: 10px; margin-bottom: 20px;">

          <div class="practice-box" style="background: rgba(0,245,255,0.08); border: 2px solid #00f5ff; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div class="practice-problem" style="font-size: 16px; font-weight: bold; color: #00f5ff;">📍 練習1：周二下午5點，經過42小時後是周幾幾點？</div>
              <span style="background: #00f5ff; color: #0a0e27; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">正推</span>
            </div>
            <div style="background: rgba(0,245,255,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #b8c5d6; font-size: 13px;">💡 提示：42小時 = 1天 + 18小時</div>
            <input type="text" id="practice1Answer" placeholder="周三下午11點" style="width: 100%; padding: 10px; background: rgba(0,245,255,0.1); border: 1px solid #00f5ff; border-radius: 6px; color: #00f5ff; font-size: 14px; margin-bottom: 12px;">
            <div id="practiceResult1" class="practice-result" style="display:none; margin-bottom: 12px;"></div>
            <button onclick="checkPractice(1)" class="btn-check" style="background: #00f5ff; color: #0a0e27; padding: 10px 20px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">提交答案 ✓</button>
          </div>

          <div class="practice-box" style="background: rgba(255,0,170,0.08); border: 2px solid #ff00aa; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div class="practice-problem" style="font-size: 16px; font-weight: bold; color: #ff00aa;">📍 練習2：周五早上10點，已經是課程啟動後第36小時。課程何時開始？</div>
              <span style="background: #ff00aa; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">反推</span>
            </div>
            <div style="background: rgba(255,0,170,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #b8c5d6; font-size: 13px;">💡 提示：36小時 = 1天 + 12小時</div>
            <input type="text" id="practice2Answer" placeholder="周三晚上10點" style="width: 100%; padding: 10px; background: rgba(255,0,170,0.1); border: 1px solid #ff00aa; border-radius: 6px; color: #ff00aa; font-size: 14px; margin-bottom: 12px;">
            <div id="practiceResult2" class="practice-result" style="display:none; margin-bottom: 12px;"></div>
            <button onclick="checkPractice(2)" class="btn-check" style="background: #ff00aa; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">提交答案 ✓</button>
          </div>

          <div class="practice-box" style="background: rgba(0,255,136,0.08); border: 2px solid #00ff88; border-radius: 10px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div class="practice-problem" style="font-size: 16px; font-weight: bold; color: #00ff88;">📍 練習3：周一下午2點，已經經過60小時。最開始是何時？</div>
              <span style="background: #00ff88; color: #0a0e27; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">反推</span>
            </div>
            <div style="background: rgba(0,255,136,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #b8c5d6; font-size: 13px;">💡 提示：60小時 = 2天 + 12小時</div>
            <input type="text" id="practice3Answer" placeholder="周五下午2點" style="width: 100%; padding: 10px; background: rgba(0,255,136,0.1); border: 1px solid #00ff88; border-radius: 6px; color: #00ff88; font-size: 14px; margin-bottom: 12px;">
            <div id="practiceResult3" class="practice-result" style="display:none; margin-bottom: 12px;"></div>
            <button onclick="checkPractice(3)" class="btn-check" style="background: #00ff88; color: #0a0e27; padding: 10px 20px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">提交答案 ✓</button>
          </div>

          </div>
        `
      },
      {
        heading: '⭐⭐ 進階練習（4-7題）',
        content: `
          <div style="background: rgba(255,193,7,0.05); padding: 20px; border-radius: 10px;">

          <div class="practice-box" style="background: rgba(0,245,255,0.08); border: 2px solid #00f5ff; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div class="practice-problem" style="font-size: 15px; font-weight: bold; color: #00f5ff;">📍 練習4：周三早上8點，經過30小時後是？</div>
              <span style="background: #00f5ff; color: #0a0e27; padding: 5px 10px; border-radius: 20px; font-size: 12px;">正推</span>
            </div>
            <div style="background: rgba(0,245,255,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #b8c5d6; font-size: 13px;">💡 提示：30小時 = 1天 + 6小時</div>
            <input type="text" id="practice4Answer" placeholder="周四下午2點" style="width: 100%; padding: 10px; background: rgba(0,245,255,0.1); border: 1px solid #00f5ff; border-radius: 6px; color: #00f5ff; font-size: 14px; margin-bottom: 12px;">
            <div id="practiceResult4" class="practice-result" style="display:none; margin-bottom: 12px;"></div>
            <button onclick="checkPractice(4)" class="btn-check" style="background: #00f5ff; color: #0a0e27; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">提交 ✓</button>
          </div>

          <div class="practice-box" style="background: rgba(255,0,170,0.08); border: 2px solid #ff00aa; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div class="practice-problem" style="font-size: 15px; font-weight: bold; color: #ff00aa;">📍 練習5：周一晚上8點，經過48小時後是？</div>
              <span style="background: #ff00aa; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">正推</span>
            </div>
            <div style="background: rgba(255,0,170,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #b8c5d6; font-size: 13px;">💡 提示：48小時 = 2天 + 0小時</div>
            <input type="text" id="practice5Answer" placeholder="周三晚上8點" style="width: 100%; padding: 10px; background: rgba(255,0,170,0.1); border: 1px solid #ff00aa; border-radius: 6px; color: #ff00aa; font-size: 14px; margin-bottom: 12px;">
            <div id="practiceResult5" class="practice-result" style="display:none; margin-bottom: 12px;"></div>
            <button onclick="checkPractice(5)" class="btn-check" style="background: #ff00aa; color: white; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">提交 ✓</button>
          </div>

          <div class="practice-box" style="background: rgba(0,255,136,0.08); border: 2px solid #00ff88; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div class="practice-problem" style="font-size: 15px; font-weight: bold; color: #00ff88;">📍 練習6：周四午夜12點（0點），經過26小時後是？</div>
              <span style="background: #00ff88; color: #0a0e27; padding: 5px 10px; border-radius: 20px; font-size: 12px;">正推</span>
            </div>
            <div style="background: rgba(0,255,136,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #b8c5d6; font-size: 13px;">💡 提示：26小時 = 1天 + 2小時</div>
            <input type="text" id="practice6Answer" placeholder="周五凌晨2點" style="width: 100%; padding: 10px; background: rgba(0,255,136,0.1); border: 1px solid #00ff88; border-radius: 6px; color: #00ff88; font-size: 14px; margin-bottom: 12px;">
            <div id="practiceResult6" class="practice-result" style="display:none; margin-bottom: 12px;"></div>
            <button onclick="checkPractice(6)" class="btn-check" style="background: #00ff88; color: #0a0e27; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">提交 ✓</button>
          </div>

          <div class="practice-box" style="background: rgba(156,39,176,0.08); border: 2px solid #b400ff; border-radius: 10px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div class="practice-problem" style="font-size: 15px; font-weight: bold; color: #b400ff;">📍 練習7：周三下午1點，已經是課程啟動後第26小時。課程何時開始？</div>
              <span style="background: #b400ff; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">反推</span>
            </div>
            <div style="background: rgba(156,39,176,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #b8c5d6; font-size: 13px;">💡 提示：26小時 = 1天 + 2小時</div>
            <input type="text" id="practice7Answer" placeholder="周一下午11點" style="width: 100%; padding: 10px; background: rgba(156,39,176,0.1); border: 1px solid #b400ff; border-radius: 6px; color: #b400ff; font-size: 14px; margin-bottom: 12px;">
            <div id="practiceResult7" class="practice-result" style="display:none; margin-bottom: 12px;"></div>
            <button onclick="checkPractice(7)" class="btn-check" style="background: #b400ff; color: white; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">提交 ✓</button>
          </div>

          </div>
        `
      },
      {
        heading: '⭐⭐⭐ 挑戰練習（8-10題）',
        content: `
          <div style="background: rgba(233,30,99,0.05); padding: 20px; border-radius: 10px;">

          <div class="practice-box" style="background: rgba(0,245,255,0.08); border: 2px solid #00f5ff; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div class="practice-problem" style="font-size: 15px; font-weight: bold; color: #00f5ff;">📍 練習8：周二凌晨3點，經過72小時後是？</div>
              <span style="background: #00f5ff; color: #0a0e27; padding: 5px 10px; border-radius: 20px; font-size: 12px;">正推</span>
            </div>
            <div style="background: rgba(0,245,255,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #b8c5d6; font-size: 13px;">💡 提示：72小時 = 3天</div>
            <input type="text" id="practice8Answer" placeholder="周五凌晨3點" style="width: 100%; padding: 10px; background: rgba(0,245,255,0.1); border: 1px solid #00f5ff; border-radius: 6px; color: #00f5ff; font-size: 14px; margin-bottom: 12px;">
            <div id="practiceResult8" class="practice-result" style="display:none; margin-bottom: 12px;"></div>
            <button onclick="checkPractice(8)" class="btn-check" style="background: #00f5ff; color: #0a0e27; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">提交 ✓</button>
          </div>

          <div class="practice-box" style="background: rgba(255,0,170,0.08); border: 2px solid #ff00aa; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div class="practice-problem" style="font-size: 15px; font-weight: bold; color: #ff00aa;">📍 練習9：周一午夜12點，已經是課程啟動後第48小時。課程何時開始？</div>
              <span style="background: #ff00aa; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">反推</span>
            </div>
            <div style="background: rgba(255,0,170,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #b8c5d6; font-size: 13px;">💡 提示：48小時 = 2天</div>
            <input type="text" id="practice9Answer" placeholder="周六午夜12點" style="width: 100%; padding: 10px; background: rgba(255,0,170,0.1); border: 1px solid #ff00aa; border-radius: 6px; color: #ff00aa; font-size: 14px; margin-bottom: 12px;">
            <div id="practiceResult9" class="practice-result" style="display:none; margin-bottom: 12px;"></div>
            <button onclick="checkPractice(9)" class="btn-check" style="background: #ff00aa; color: white; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">提交 ✓</button>
          </div>

          <div class="practice-box" style="background: rgba(0,255,136,0.08); border: 2px solid #00ff88; border-radius: 10px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div class="practice-problem" style="font-size: 15px; font-weight: bold; color: #00ff88;">📍 練習10：周三下午6點，經過54小時後是？</div>
              <span style="background: #00ff88; color: #0a0e27; padding: 5px 10px; border-radius: 20px; font-size: 12px;">正推</span>
            </div>
            <div style="background: rgba(0,255,136,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #b8c5d6; font-size: 13px;">💡 提示：54小時 = 2天 + 6小時</div>
            <input type="text" id="practice10Answer" placeholder="周五下午12點" style="width: 100%; padding: 10px; background: rgba(0,255,136,0.1); border: 1px solid #00ff88; border-radius: 6px; color: #00ff88; font-size: 14px; margin-bottom: 12px;">
            <div id="practiceResult10" class="practice-result" style="display:none; margin-bottom: 12px;"></div>
            <button onclick="checkPractice(10)" class="btn-check" style="background: #00ff88; color: #0a0e27; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">提交 ✓</button>
          </div>

          </div>
        `
      }
    ],
    interactive: true
  },

  chapter5: {
    title: '✅ 本章小測：確認你的理解',
    subtitle: '5道簡單題，檢查學習成果',
    duration: '5-10分鐘',
    sections: [
      {
        heading: '開始小測',
        content: `<div id="chapterQuizContainer" style="padding: 20px; background: rgba(0,245,255,0.05); border-radius: 10px;"></div>`
      },
      {
        heading: '🎓 進入正式題庫',
        content: `
          <div class="quiz-selection" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 20px;">
            <button onclick="initTimeConversionQuiz('basic')" class="quiz-btn" style="background: rgba(0,245,255,0.15); border: 2px solid #00f5ff; padding: 20px; border-radius: 10px; color: #00f5ff; font-weight: bold; cursor: pointer;">
              <div style="font-size: 24px; margin-bottom: 10px;">⭐</div>
              <div style="font-size: 16px; margin-bottom: 5px;">基礎題庫</div>
              <div style="font-size: 12px; color: #b8c5d6;">15道題 • 簡單</div>
            </button>
            <button onclick="initTimeConversionQuiz('intermediate')" class="quiz-btn" style="background: rgba(255,0,170,0.15); border: 2px solid #ff00aa; padding: 20px; border-radius: 10px; color: #ff00aa; font-weight: bold; cursor: pointer;">
              <div style="font-size: 24px; margin-bottom: 10px;">⭐⭐</div>
              <div style="font-size: 16px; margin-bottom: 5px;">進階題庫</div>
              <div style="font-size: 12px; color: #b8c5d6;">20道題 • 中等</div>
            </button>
            <button onclick="initTimeConversionQuiz('advanced')" class="quiz-btn" style="background: rgba(0,255,136,0.15); border: 2px solid #00ff88; padding: 20px; border-radius: 10px; color: #00ff88; font-weight: bold; cursor: pointer;">
              <div style="font-size: 24px; margin-bottom: 10px;">⭐⭐⭐</div>
              <div style="font-size: 16px; margin-bottom: 5px;">挑戰題庫</div>
              <div style="font-size: 12px; color: #b8c5d6;">15道題 • 困難</div>
            </button>
          </div>
        `
      }
    ]
  }
};

// ============ 題庫數據 ============

// 基礎題（15道）- 簡單的單位轉換
const BASIC_PROBLEMS = [
  {
    id: 'basic-1',
    difficulty: 'easy',
    content: '1天等於多少小時？',
    type: 'multiple_choice',
    options: ['12小時', '24小時', '18小時', '30小時'],
    answer: '24小時',
    explanation: '1天的定義就是24小時，這是基本的時間單位。'
  },
  {
    id: 'basic-2',
    difficulty: 'easy',
    content: '48小時等於幾天？',
    type: 'multiple_choice',
    options: ['2天', '3天', '4天', '48天'],
    answer: '2天',
    explanation: '48 ÷ 24 = 2，所以48小時 = 2天。'
  },
  {
    id: 'basic-3',
    difficulty: 'easy',
    content: '2天等於多少小時？',
    type: 'multiple_choice',
    options: ['24小時', '36小時', '48小時', '52小時'],
    answer: '48小時',
    explanation: '2 × 24 = 48，所以2天 = 48小時。'
  },
  {
    id: 'basic-4',
    difficulty: 'easy',
    content: '1小時等於多少分鐘？',
    type: 'multiple_choice',
    options: ['30分鐘', '45分鐘', '60分鐘', '90分鐘'],
    answer: '60分鐘',
    explanation: '1小時的定義就是60分鐘，這是基本的時間單位。'
  },
  {
    id: 'basic-5',
    difficulty: 'easy',
    content: '3小時等於多少分鐘？',
    type: 'multiple_choice',
    options: ['120分鐘', '150分鐘', '180分鐘', '210分鐘'],
    answer: '180分鐘',
    explanation: '3 × 60 = 180，所以3小時 = 180分鐘。'
  },
  {
    id: 'basic-6',
    difficulty: 'easy',
    content: '120分鐘等於幾小時？',
    type: 'multiple_choice',
    options: ['1小時', '2小時', '3小時', '4小時'],
    answer: '2小時',
    explanation: '120 ÷ 60 = 2，所以120分鐘 = 2小時。'
  },
  {
    id: 'basic-7',
    difficulty: 'easy',
    content: '1分鐘等於多少秒？',
    type: 'multiple_choice',
    options: ['30秒', '45秒', '60秒', '90秒'],
    answer: '60秒',
    explanation: '1分鐘的定義就是60秒，這是基本的時間單位。'
  },
  {
    id: 'basic-8',
    difficulty: 'easy',
    content: '5分鐘等於多少秒？',
    type: 'multiple_choice',
    options: ['150秒', '200秒', '250秒', '300秒'],
    answer: '300秒',
    explanation: '5 × 60 = 300，所以5分鐘 = 300秒。'
  },
  {
    id: 'basic-9',
    difficulty: 'easy',
    content: '180秒等於幾分鐘？',
    type: 'multiple_choice',
    options: ['2分鐘', '3分鐘', '4分鐘', '5分鐘'],
    answer: '3分鐘',
    explanation: '180 ÷ 60 = 3，所以180秒 = 3分鐘。'
  },
  {
    id: 'basic-10',
    difficulty: 'easy',
    content: '1天 = ____ 分鐘',
    type: 'multiple_choice',
    options: ['240分鐘', '960分鐘', '1440分鐘', '2880分鐘'],
    answer: '1440分鐘',
    explanation: '1天 = 24小時，24 × 60 = 1440分鐘。'
  },
  {
    id: 'basic-11',
    difficulty: 'easy',
    content: '72小時 = ____ 天',
    type: 'multiple_choice',
    options: ['2天', '3天', '4天', '6天'],
    answer: '3天',
    explanation: '72 ÷ 24 = 3，所以72小時 = 3天。'
  },
  {
    id: 'basic-12',
    difficulty: 'easy',
    content: '240分鐘 = ____ 小時',
    type: 'multiple_choice',
    options: ['2小時', '3小時', '4小時', '5小時'],
    answer: '4小時',
    explanation: '240 ÷ 60 = 4，所以240分鐘 = 4小時。'
  },
  {
    id: 'basic-13',
    difficulty: 'easy',
    content: '1天2小時 = ____ 小時',
    type: 'multiple_choice',
    options: ['24小時', '25小時', '26小時', '27小時'],
    answer: '26小時',
    explanation: '1天 = 24小時，24 + 2 = 26小時。'
  },
  {
    id: 'basic-14',
    difficulty: 'easy',
    content: '2天3小時 = ____ 小時',
    type: 'multiple_choice',
    options: ['48小時', '50小時', '51小時', '52小時'],
    answer: '51小時',
    explanation: '2天 = 48小時，48 + 3 = 51小時。'
  },
  {
    id: 'basic-15',
    difficulty: 'easy',
    content: '如果現在是周一早上8點，24小時後是：',
    type: 'multiple_choice',
    options: ['周一晚上8點', '周二早上8點', '周二晚上8點', '周三早上8點'],
    answer: '周二早上8點',
    explanation: '24小時 = 1天，早上8點 + 1天 = 周二早上8點。'
  }
];

// 進階題（20道）- 跨日正推計算
const INTERMEDIATE_PROBLEMS = [
  {
    id: 'inter-1',
    difficulty: 'medium',
    content: '周一早上8點，經過30小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '30小時 = 幾天 + 幾小時？',
        answer: '1天6小時',
        options: ['1天6小時', '1天4小時', '2天6小時', '1天12小時'],
        hint: '30 ÷ 24 = 1 餘 6'
      },
      {
        step: 2,
        prompt: '早上8點 + 6小時 = 幾點？',
        answer: '下午2點',
        options: ['中午12點', '下午1點', '下午2點', '下午3點'],
        hint: '8 + 6 = 14，14點就是下午2點'
      },
      {
        step: 3,
        prompt: '周一下午2點 + 1天 = 周幾幾點？',
        answer: '周二下午2點',
        options: ['周一晚上2點', '周二早上2點', '周二下午2點', '周二晚上2點'],
        hint: '加1天就是隔天同一個時間'
      }
    ],
    feedback: {
      correct: '✓ 完美！你掌握了跨日計算的方法。',
      wrong: '提示：先把小時轉為天+小時，然後分別加上去。'
    }
  },
  {
    id: 'inter-2',
    difficulty: 'medium',
    content: '周三下午3點，經過36小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '36小時 = 幾天 + 幾小時？',
        answer: '1天12小時',
        options: ['1天6小時', '1天12小時', '1天18小時', '2天'],
        hint: '36 ÷ 24 = 1 餘 12'
      },
      {
        step: 2,
        prompt: '下午3點 + 12小時 = 幾點？',
        answer: '凌晨3點',
        options: ['凌晨3點', '早上3點', '中午3點', '下午3點'],
        hint: '15 + 12 = 27，27 - 24 = 3點，是第二天凌晨'
      },
      {
        step: 3,
        prompt: '周三凌晨3點 + 1天 = 周幾幾點？',
        answer: '周四凌晨3點',
        options: ['周三凌晨3點', '周四凌晨3點', '周四早上3點', '周四中午3點'],
        hint: '從周三加1天變成周四'
      }
    ]
  },
  {
    id: 'inter-3',
    difficulty: 'medium',
    content: '周二晚上8點（20點），經過42小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '42小時 = 幾天 + 幾小時？',
        answer: '1天18小時',
        options: ['1天12小時', '1天18小時', '2天', '2天6小時'],
        hint: '42 ÷ 24 = 1 餘 18'
      },
      {
        step: 2,
        prompt: '晚上8點(20點) + 18小時 = 幾點？',
        answer: '下午2點',
        options: ['凌晨2點', '早上2點', '中午2點', '下午2點'],
        hint: '20 + 18 = 38，38 - 24 = 14點（下午2點）'
      },
      {
        step: 3,
        prompt: '周二下午2點 + 1天 = 周幾幾點？',
        answer: '周三下午2點',
        options: ['周二下午2點', '周三早上2點', '周三下午2點', '周四下午2點']
      }
    ]
  },
  {
    id: 'inter-4',
    difficulty: 'medium',
    content: '周四早上6點，經過48小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '48小時 = 幾天？',
        answer: '2天',
        options: ['1天', '2天', '3天', '48天'],
        hint: '48 ÷ 24 = 2'
      },
      {
        step: 2,
        prompt: '早上6點 + 0小時（沒有餘下小時數）',
        answer: '早上6點',
        options: ['凌晨6點', '早上6點', '中午6點', '下午6點']
      },
      {
        step: 3,
        prompt: '周四早上6點 + 2天 = 周幾幾點？',
        answer: '周六早上6點',
        options: ['周四早上6點', '周五早上6點', '周六早上6點', '周日早上6點']
      }
    ]
  },
  {
    id: 'inter-5',
    difficulty: 'medium',
    content: '周一下午1點(13點)，經過26小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '26小時 = 幾天 + 幾小時？',
        answer: '1天2小時',
        options: ['1天2小時', '1天4小時', '1天6小時', '2天'],
        hint: '26 ÷ 24 = 1 餘 2'
      },
      {
        step: 2,
        prompt: '下午1點(13點) + 2小時 = 幾點？',
        answer: '下午3點',
        options: ['下午1點', '下午2點', '下午3點', '下午4點'],
        hint: '13 + 2 = 15點（下午3點）'
      },
      {
        step: 3,
        prompt: '周一下午3點 + 1天 = 周幾幾點？',
        answer: '周二下午3點',
        options: ['周一下午3點', '周二早上3點', '周二下午3點', '周二晚上3點']
      }
    ]
  },
  {
    id: 'inter-6',
    difficulty: 'medium',
    content: '周五晚上10點(22點)，經過38小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '38小時 = 幾天 + 幾小時？',
        answer: '1天14小時',
        options: ['1天10小時', '1天14小時', '1天18小時', '2天'],
        hint: '38 ÷ 24 = 1 餘 14'
      },
      {
        step: 2,
        prompt: '晚上10點(22點) + 14小時 = 幾點？',
        answer: '中午12點',
        options: ['凌晨12點', '早上12點', '中午12點', '晚上12點'],
        hint: '22 + 14 = 36，36 - 24 = 12點（中午）'
      },
      {
        step: 3,
        prompt: '周五中午12點 + 1天 = 周幾幾點？',
        answer: '周六中午12點',
        options: ['周五中午12點', '周六早上12點', '周六中午12點', '周日中午12點']
      }
    ]
  },
  {
    id: 'inter-7',
    difficulty: 'medium',
    content: '周二早上11點，經過25小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '25小時 = 幾天 + 幾小時？',
        answer: '1天1小時',
        options: ['1天1小時', '1天3小時', '1天5小時', '2天'],
        hint: '25 ÷ 24 = 1 餘 1'
      },
      {
        step: 2,
        prompt: '早上11點 + 1小時 = 幾點？',
        answer: '中午12點',
        options: ['早上10點', '早上11點', '中午12點', '下午1點'],
        hint: '11 + 1 = 12'
      },
      {
        step: 3,
        prompt: '周二中午12點 + 1天 = 周幾幾點？',
        answer: '周三中午12點',
        options: ['周二中午12點', '周三早上12點', '周三中午12點', '周三晚上12點']
      }
    ]
  },
  {
    id: 'inter-8',
    difficulty: 'medium',
    content: '周一凌晨2點，經過56小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '56小時 = 幾天 + 幾小時？',
        answer: '2天8小時',
        options: ['2天', '2天8小時', '3天', '2天16小時'],
        hint: '56 ÷ 24 = 2 餘 8'
      },
      {
        step: 2,
        prompt: '凌晨2點 + 8小時 = 幾點？',
        answer: '早上10點',
        options: ['凌晨2點', '早上8點', '早上10點', '中午12點'],
        hint: '2 + 8 = 10'
      },
      {
        step: 3,
        prompt: '周一早上10點 + 2天 = 周幾幾點？',
        answer: '周三早上10點',
        options: ['周一早上10點', '周二早上10點', '周三早上10點', '周四早上10點']
      }
    ]
  },
  {
    id: 'inter-9',
    difficulty: 'medium',
    content: '周三下午7點(19點)，經過50小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '50小時 = 幾天 + 幾小時？',
        answer: '2天2小時',
        options: ['2天', '2天2小時', '2天6小時', '2天12小時'],
        hint: '50 ÷ 24 = 2 餘 2'
      },
      {
        step: 2,
        prompt: '下午7點(19點) + 2小時 = 幾點？',
        answer: '晚上9點',
        options: ['晚上7點', '晚上8點', '晚上9點', '晚上10點'],
        hint: '19 + 2 = 21點（晚上9點）'
      },
      {
        step: 3,
        prompt: '周三晚上9點 + 2天 = 周幾幾點？',
        answer: '周五晚上9點',
        options: ['周三晚上9點', '周四晚上9點', '周五晚上9點', '周六晚上9點']
      }
    ]
  },
  {
    id: 'inter-10',
    difficulty: 'medium',
    content: '周五中午12點，經過24小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '24小時 = 幾天？',
        answer: '1天',
        options: ['12小時', '1天', '2天', '24天']
      },
      {
        step: 2,
        prompt: '中午12點 + 0小時（沒有額外小時）',
        answer: '中午12點'
      },
      {
        step: 3,
        prompt: '周五中午12點 + 1天 = 周幾幾點？',
        answer: '周六中午12點',
        options: ['周五中午12點', '周六早上12點', '周六中午12點', '周日中午12點']
      }
    ]
  },
  {
    id: 'inter-11',
    difficulty: 'medium',
    content: '周二下午4點(16點)，經過32小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '32小時 = 幾天 + 幾小時？',
        answer: '1天8小時',
        options: ['1天6小時', '1天8小時', '1天10小時', '2天'],
        hint: '32 ÷ 24 = 1 餘 8'
      },
      {
        step: 2,
        prompt: '下午4點(16點) + 8小時 = 幾點？',
        answer: '午夜12點',
        options: ['晚上8點', '晚上10點', '午夜12點', '凌晨2點'],
        hint: '16 + 8 = 24點，就是午夜'
      },
      {
        step: 3,
        prompt: '周二午夜12點 + 1天 = 周幾幾點？',
        answer: '周三午夜12點',
        options: ['周二午夜12點', '周三凌晨12點', '周三午夜12點', '周四午夜12點']
      }
    ]
  },
  {
    id: 'inter-12',
    difficulty: 'medium',
    content: '周六早上9點，經過33小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '33小時 = 幾天 + 幾小時？',
        answer: '1天9小時',
        options: ['1天6小時', '1天9小時', '1天12小時', '2天']
      },
      {
        step: 2,
        prompt: '早上9點 + 9小時 = 幾點？',
        answer: '下午6點',
        options: ['下午3點', '下午5點', '下午6點', '下午8點']
      },
      {
        step: 3,
        prompt: '周六下午6點 + 1天 = 周幾幾點？',
        answer: '周日下午6點'
      }
    ]
  },
  {
    id: 'inter-13',
    difficulty: 'medium',
    content: '周四晚上6點(18點)，經過28小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '28小時 = 幾天 + 幾小時？',
        answer: '1天4小時',
        options: ['1天2小時', '1天4小時', '1天6小時', '2天']
      },
      {
        step: 2,
        prompt: '晚上6點(18點) + 4小時 = 幾點？',
        answer: '晚上10點',
        options: ['晚上8點', '晚上10點', '晚上11點', '午夜12點']
      },
      {
        step: 3,
        prompt: '周四晚上10點 + 1天 = 周幾幾點？',
        answer: '周五晚上10點'
      }
    ]
  },
  {
    id: 'inter-14',
    difficulty: 'medium',
    content: '周一上午10點，經過54小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '54小時 = 幾天 + 幾小時？',
        answer: '2天6小時',
        options: ['2天', '2天6小時', '2天12小時', '3天']
      },
      {
        step: 2,
        prompt: '上午10點 + 6小時 = 幾點？',
        answer: '下午4點',
        options: ['下午2點', '下午3點', '下午4點', '下午5點']
      },
      {
        step: 3,
        prompt: '周一下午4點 + 2天 = 周幾幾點？',
        answer: '周三下午4點'
      }
    ]
  },
  {
    id: 'inter-15',
    difficulty: 'medium',
    content: '周日下午2點(14點)，經過40小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '40小時 = 幾天 + 幾小時？',
        answer: '1天16小時',
        options: ['1天12小時', '1天16小時', '1天18小時', '2天']
      },
      {
        step: 2,
        prompt: '下午2點(14點) + 16小時 = 幾點？',
        answer: '凌晨6點',
        options: ['凌晨4點', '凌晨5點', '凌晨6點', '早上7點']
      },
      {
        step: 3,
        prompt: '周日凌晨6點 + 1天 = 周幾幾點？',
        answer: '周一凌晨6點'
      }
    ]
  },
  {
    id: 'inter-16',
    difficulty: 'medium',
    content: '周二晚上11點(23點)，經過30小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '30小時 = 幾天 + 幾小時？',
        answer: '1天6小時',
        options: ['1天4小時', '1天6小時', '1天8小時', '2天']
      },
      {
        step: 2,
        prompt: '晚上11點(23點) + 6小時 = 幾點？',
        answer: '早上5點',
        options: ['凌晨3點', '早上4點', '早上5點', '早上6點']
      },
      {
        step: 3,
        prompt: '周二早上5點 + 1天 = 周幾幾點？',
        answer: '周三早上5點'
      }
    ]
  },
  {
    id: 'inter-17',
    difficulty: 'medium',
    content: '周四上午7點，經過44小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '44小時 = 幾天 + 幾小時？',
        answer: '1天20小時',
        options: ['1天16小時', '1天18小時', '1天20小時', '2天']
      },
      {
        step: 2,
        prompt: '上午7點 + 20小時 = 幾點？',
        answer: '凌晨3點',
        options: ['晚上8點', '晚上11點', '凌晨1點', '凌晨3點']
      },
      {
        step: 3,
        prompt: '周四凌晨3點 + 1天 = 周幾幾點？',
        answer: '周五凌晨3點'
      }
    ]
  },
  {
    id: 'inter-18',
    difficulty: 'medium',
    content: '周六下午5點(17點)，經過27小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '27小時 = 幾天 + 幾小時？',
        answer: '1天3小時',
        options: ['1天1小時', '1天3小時', '1天5小時', '2天']
      },
      {
        step: 2,
        prompt: '下午5點(17點) + 3小時 = 幾點？',
        answer: '晚上8點',
        options: ['晚上7點', '晚上8點', '晚上9點', '晚上10點']
      },
      {
        step: 3,
        prompt: '周六晚上8點 + 1天 = 周幾幾點？',
        answer: '周日晚上8點'
      }
    ]
  },
  {
    id: 'inter-19',
    difficulty: 'medium',
    content: '周一早上3點，經過60小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '60小時 = 幾天？',
        answer: '2天12小時',
        options: ['2天', '2天6小時', '2天12小時', '3天']
      },
      {
        step: 2,
        prompt: '早上3點 + 12小時 = 幾點？',
        answer: '下午3點',
        options: ['下午1點', '下午2點', '下午3點', '下午4點']
      },
      {
        step: 3,
        prompt: '周一下午3點 + 2天 = 周幾幾點？',
        answer: '周三下午3點'
      }
    ]
  },
  {
    id: 'inter-20',
    difficulty: 'medium',
    content: '周五晚上9點(21點)，經過35小時後是周幾幾點？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '35小時 = 幾天 + 幾小時？',
        answer: '1天11小時',
        options: ['1天9小時', '1天11小時', '1天13小時', '2天']
      },
      {
        step: 2,
        prompt: '晚上9點(21點) + 11小時 = 幾點？',
        answer: '早上8點',
        options: ['凌晨6點', '早上7點', '早上8點', '早上9點']
      },
      {
        step: 3,
        prompt: '周五早上8點 + 1天 = 周幾幾點？',
        answer: '周六早上8點'
      }
    ]
  }
];

// 挑戰題（15道）- 跨日反推計算
const ADVANCED_PROBLEMS = [
  {
    id: 'adv-1',
    difficulty: 'hard',
    content: '今天早上8點，已經是某課程啟動後的第30小時。課程是什麼時候開始的？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '30小時 = 幾天 + 幾小時？',
        answer: '1天6小時',
        options: ['1天4小時', '1天6小時', '1天8小時', '2天'],
        hint: '30 ÷ 24 = 1 餘 6'
      },
      {
        step: 2,
        prompt: '早上8點 - 6小時 = 幾點？',
        answer: '凌晨2點',
        options: ['凌晨12點', '凌晨1點', '凌晨2點', '凌晨3點'],
        hint: '8 - 6 = 2'
      },
      {
        step: 3,
        prompt: '今天凌晨2點 - 1天 = 幾點？',
        answer: '昨天凌晨2點',
        options: ['前天凌晨2點', '昨天凌晨2點', '昨天早上2點', '昨天下午2點'],
        hint: '往回推1天就是前一天同時間'
      }
    ]
  },
  {
    id: 'adv-2',
    difficulty: 'hard',
    content: '現在是周五下午3點，已經是某比賽開始後的第42小時。比賽是周幾幾點開始的？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '42小時 = 幾天 + 幾小時？',
        answer: '1天18小時',
        options: ['1天16小時', '1天18小時', '1天20小時', '2天'],
        hint: '42 ÷ 24 = 1 餘 18'
      },
      {
        step: 2,
        prompt: '下午3點(15點) - 18小時 = 幾點？',
        answer: '前天下午9點',
        options: ['下午9點', '前一天下午9點', '前天下午9點', '昨天下午9點'],
        hint: '15 - 18 = -3，要借1天(+24)，所以24 + 15 - 18 = 21點(下午9點)，但這是前一天'
      },
      {
        step: 3,
        prompt: '周五下午9點往回推1天 = 周幾幾點？',
        answer: '周四下午9點',
        options: ['周四下午9點', '周四上午9點', '周五上午9點', '周五下午9點']
      }
    ]
  },
  {
    id: 'adv-3',
    difficulty: 'hard',
    content: '現在是周三早上10點，經過了某課程啟動後的第50小時。課程開始時間是？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '50小時 = 幾天 + 幾小時？',
        answer: '2天2小時',
        options: ['2天', '2天2小時', '2天6小時', '3天']
      },
      {
        step: 2,
        prompt: '早上10點 - 2小時 = 幾點？',
        answer: '早上8點',
        options: ['早上6點', '早上8點', '早上10點', '中午10點']
      },
      {
        step: 3,
        prompt: '周三早上8點往回推2天 = 周幾幾點？',
        answer: '周一早上8點',
        options: ['周一早上8點', '周二早上8點', '周三早上8點', '周四早上8點']
      }
    ]
  },
  {
    id: 'adv-4',
    difficulty: 'hard',
    content: '今天晚上8點(20點)，已經是某活動開始後的第36小時。活動是什麼時候開始的？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '36小時 = 幾天 + 幾小時？',
        answer: '1天12小時',
        options: ['1天8小時', '1天10小時', '1天12小時', '2天']
      },
      {
        step: 2,
        prompt: '晚上8點(20點) - 12小時 = 幾點？',
        answer: '早上8點',
        options: ['凌晨8點', '早上8點', '中午8點', '下午8點']
      },
      {
        step: 3,
        prompt: '今天早上8點往回推1天 = 幾點？',
        answer: '昨天早上8點',
        options: ['昨天早上8點', '昨天晚上8點', '前天早上8點', '今天早上8點']
      }
    ]
  },
  {
    id: 'adv-5',
    difficulty: 'hard',
    content: '現在是周一下午5點(17點)，已經是某課程啟動後的第48小時。課程開始時間是？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '48小時 = 幾天？',
        answer: '2天',
        options: ['1天', '2天', '3天', '48天']
      },
      {
        step: 2,
        prompt: '下午5點(17點) - 0小時（沒有餘數）',
        answer: '下午5點',
        options: ['下午5點', '早上5點', '晚上5點', '中午5點']
      },
      {
        step: 3,
        prompt: '周一下午5點往回推2天 = 周幾幾點？',
        answer: '周六下午5點',
        options: ['周六下午5點', '周日下午5點', '周一下午5點', '周二下午5點']
      }
    ]
  },
  {
    id: 'adv-6',
    difficulty: 'hard',
    content: '現在是周四晚上10點(22點)，已經經過了某練習開始後的第56小時。練習是周幾幾點開始的？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '56小時 = 幾天 + 幾小時？',
        answer: '2天8小時',
        options: ['2天6小時', '2天8小時', '2天10小時', '3天']
      },
      {
        step: 2,
        prompt: '晚上10點(22點) - 8小時 = 幾點？',
        answer: '下午2點',
        options: ['下午12點', '下午2點', '下午4點', '下午6點']
      },
      {
        step: 3,
        prompt: '周四下午2點往回推2天 = 周幾幾點？',
        answer: '周二下午2點',
        options: ['周二下午2點', '周三下午2點', '周四下午2點', '周五下午2點']
      }
    ]
  },
  {
    id: 'adv-7',
    difficulty: 'hard',
    content: '現在是周六凌晨3點，已經是某任務進行了第40小時。任務是周幾幾點開始的？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '40小時 = 幾天 + 幾小時？',
        answer: '1天16小時',
        options: ['1天14小時', '1天16小時', '1天18小時', '2天']
      },
      {
        step: 2,
        prompt: '凌晨3點 - 16小時 = 幾點？',
        answer: '前一天下午11點',
        options: ['下午3點', '下午7點', '下午11點', '下午12點'],
        hint: '3 - 16 要借1天，(3 + 24) - 16 = 11點，是前一天'
      },
      {
        step: 3,
        prompt: '周六凌晨3點往回推1天得到下午11點，那是周幾？',
        answer: '周五下午11點',
        options: ['周四下午11點', '周五下午11點', '周六下午11點', '周日下午11點']
      }
    ]
  },
  {
    id: 'adv-8',
    difficulty: 'hard',
    content: '現在是周日下午4點(16點)，已經經過某活動開始後的第52小時。活動開始時間是？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '52小時 = 幾天 + 幾小時？',
        answer: '2天4小時',
        options: ['2天2小時', '2天4小時', '2天6小時', '3天']
      },
      {
        step: 2,
        prompt: '下午4點(16點) - 4小時 = 幾點？',
        answer: '中午12點',
        options: ['上午12點', '中午12點', '下午12點', '午夜12點']
      },
      {
        step: 3,
        prompt: '周日中午12點往回推2天 = 周幾幾點？',
        answer: '周五中午12點',
        options: ['周四中午12點', '周五中午12點', '周六中午12點', '周日中午12點']
      }
    ]
  },
  {
    id: 'adv-9',
    difficulty: 'hard',
    content: '現在是周二上午9點，已經是某課程啟動後的第45小時。課程開始時間是？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '45小時 = 幾天 + 幾小時？',
        answer: '1天21小時',
        options: ['1天19小時', '1天21小時', '1天23小時', '2天']
      },
      {
        step: 2,
        prompt: '上午9點 - 21小時 = 幾點？',
        answer: '前一天中午12點',
        options: ['前一天上午12點', '前一天中午12點', '前一天下午12點', '當天午夜12點'],
        hint: '9 - 21要借1天，(9 + 24) - 21 = 12點'
      },
      {
        step: 3,
        prompt: '周二上午9點減去1天（借的那天）= 周幾中午12點？',
        answer: '周一中午12點',
        options: ['周一中午12點', '周二中午12點', '周三中午12點', '周二上午12點']
      }
    ]
  },
  {
    id: 'adv-10',
    difficulty: 'hard',
    content: '現在是周五晚上11點(23點)，已經過了某練習開始後的第38小時。練習是周幾幾點開始的？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '38小時 = 幾天 + 幾小時？',
        answer: '1天14小時',
        options: ['1天12小時', '1天14小時', '1天16小時', '2天']
      },
      {
        step: 2,
        prompt: '晚上11點(23點) - 14小時 = 幾點？',
        answer: '前一天下午9點',
        options: ['下午9點', '前一天下午9點', '前一天晚上9點', '當天下午9點'],
        hint: '23 - 14 = 9點（下午9點），但這是前一天'
      },
      {
        step: 3,
        prompt: '周五晚上11點的前一天下午9點 = 周幾幾點？',
        answer: '周四下午9點',
        options: ['周三下午9點', '周四下午9點', '周五下午9點', '周四晚上9點']
      }
    ]
  },
  {
    id: 'adv-11',
    difficulty: 'hard',
    content: '現在是周四早上7點，已經是某比賽開始後的第64小時。比賽是周幾幾點開始的？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '64小時 = 幾天 + 幾小時？',
        answer: '2天16小時',
        options: ['2天12小時', '2天16小時', '2天18小時', '3天']
      },
      {
        step: 2,
        prompt: '早上7點 - 16小時 = 幾點？',
        answer: '前一天下午3點',
        options: ['下午3點', '前一天下午3點', '前一天晚上3點', '當天下午3點'],
        hint: '7 - 16要借1天，(7 + 24) - 16 = 15點（下午3點）'
      },
      {
        step: 3,
        prompt: '周四早上7點的前一天下午3點 - 1天 = 周幾幾點？',
        answer: '周二下午3點',
        options: ['周一下午3點', '周二下午3點', '周三下午3點', '周四下午3點']
      }
    ]
  },
  {
    id: 'adv-12',
    difficulty: 'hard',
    content: '現在是周一中午12點，已經經過某活動開始後的第31小時。活動開始時間是？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '31小時 = 幾天 + 幾小時？',
        answer: '1天7小時',
        options: ['1天5小時', '1天7小時', '1天9小時', '2天']
      },
      {
        step: 2,
        prompt: '中午12點 - 7小時 = 幾點？',
        answer: '早上5點',
        options: ['凌晨5點', '早上5點', '上午5點', '下午5點']
      },
      {
        step: 3,
        prompt: '周一早上5點往回推1天 = 周幾幾點？',
        answer: '周日早上5點',
        options: ['周六早上5點', '周日早上5點', '周一早上5點', '周二早上5點']
      }
    ]
  },
  {
    id: 'adv-13',
    difficulty: 'hard',
    content: '現在是周六下午7點(19點)，已經是某工作進行了第41小時。工作是周幾幾點開始的？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '41小時 = 幾天 + 幾小時？',
        answer: '1天17小時',
        options: ['1天15小時', '1天17小時', '1天19小時', '2天']
      },
      {
        step: 2,
        prompt: '下午7點(19點) - 17小時 = 幾點？',
        answer: '凌晨2點',
        options: ['凌晨2點', '早上2點', '上午2點', '晚上2點'],
        hint: '19 - 17 = 2'
      },
      {
        step: 3,
        prompt: '周六凌晨2點往回推1天 = 周幾幾點？',
        answer: '周五凌晨2點',
        options: ['周四凌晨2點', '周五凌晨2點', '周六凌晨2點', '周日凌晨2點']
      }
    ]
  },
  {
    id: 'adv-14',
    difficulty: 'hard',
    content: '現在是周三下午6點(18點)，已經經過某課程啟動後的第34小時。課程開始時間是？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '34小時 = 幾天 + 幾小時？',
        answer: '1天10小時',
        options: ['1天8小時', '1天10小時', '1天12小時', '2天']
      },
      {
        step: 2,
        prompt: '下午6點(18點) - 10小時 = 幾點？',
        answer: '早上8點',
        options: ['凌晨8點', '早上8點', '中午8點', '下午8點']
      },
      {
        step: 3,
        prompt: '周三早上8點往回推1天 = 周幾幾點？',
        answer: '周二早上8點',
        options: ['周一早上8點', '周二早上8點', '周三早上8點', '周四早上8點']
      }
    ]
  },
  {
    id: 'adv-15',
    difficulty: 'hard',
    content: '現在是周日晚上9點(21點)，已經經過某項目開始後的第58小時。項目是周幾幾點開始的？',
    type: 'step_by_step',
    questions: [
      {
        step: 1,
        prompt: '58小時 = 幾天 + 幾小時？',
        answer: '2天10小時',
        options: ['2天8小時', '2天10小時', '2天12小時', '3天']
      },
      {
        step: 2,
        prompt: '晚上9點(21點) - 10小時 = 幾點？',
        answer: '上午11點',
        options: ['早上11點', '上午11點', '中午11點', '晚上11點']
      },
      {
        step: 3,
        prompt: '周日上午11點往回推2天 = 周幾幾點？',
        answer: '周五上午11點',
        options: ['周四上午11點', '周五上午11點', '周六上午11點', '周日上午11點']
      }
    ]
  }
];

// 本章小測（5道基礎題）
const CHAPTER_QUIZ = [
  {
    id: 'quiz-1',
    content: '1天 = 多少小時？',
    type: 'multiple_choice',
    options: ['12小時', '24小時', '36小時', '48小時'],
    answer: '24小時'
  },
  {
    id: 'quiz-2',
    content: '周一晚上8點，經過24小時後是周幾幾點？',
    type: 'multiple_choice',
    options: ['周一晚上8點', '周二早上8點', '周二晚上8點', '周三晚上8點'],
    answer: '周二晚上8點'
  },
  {
    id: 'quiz-3',
    content: '36小時 = 幾天幾小時？',
    type: 'multiple_choice',
    options: ['1天6小時', '1天10小時', '1天12小時', '2天'],
    answer: '1天12小時'
  },
  {
    id: 'quiz-4',
    content: '周三下午2點，經過30小時後是周幾幾點？',
    type: 'multiple_choice',
    options: ['周三晚上8點', '周四下午2點', '周四晚上8點', '周五下午2點'],
    answer: '周四晚上8點'
  },
  {
    id: 'quiz-5',
    content: '今天早上10點已經是某課程啟動後的第25小時，課程開始時間是？',
    type: 'multiple_choice',
    options: ['昨天早上8點', '昨天晚上8點', '昨天下午8點', '前天早上10點'],
    answer: '昨天下午8點'
  }
];

// 導出所有數據
const TIME_CONVERSION_DATA = {
  tutorial: TIME_CONVERSION_TUTORIAL,
  basicProblems: BASIC_PROBLEMS,
  intermediateProblems: INTERMEDIATE_PROBLEMS,
  advancedProblems: ADVANCED_PROBLEMS,
  chapterQuiz: CHAPTER_QUIZ,

  // 合併所有題目
  allProblems: [
    ...BASIC_PROBLEMS,
    ...INTERMEDIATE_PROBLEMS,
    ...ADVANCED_PROBLEMS
  ],

  // 統計信息
  stats: {
    totalProblems: 50,
    basicCount: 15,
    intermediateCount: 20,
    advancedCount: 15,
    chapterQuizCount: 5
  }
};
