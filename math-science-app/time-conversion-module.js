/**
 * 時間換算互動教學模塊
 * 包含：教學邏輯、時間軸動畫、步驟式答題、反饋系統
 */

// ============ 全局狀態管理 ============
const timeConversionState = {
  currentChapter: 1,
  currentProblemIndex: 0,
  currentDifficulty: 'basic', // basic, intermediate, advanced
  currentStep: 0,
  userAnswers: [],
  isAnsweredCorrect: false,
  quizProgress: {
    basic: { completed: 0, total: 15 },
    intermediate: { completed: 0, total: 20 },
    advanced: { completed: 0, total: 15 }
  }
};

// ============ 時間軸動畫器 ============
class TimelineAnimator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // 配置
    this.colors = {
      background: '#0d0d2b',
      grid: 'rgba(0, 245, 255, 0.1)',
      line: '#00f5ff',
      dayText: '#b400ff',
      hourMark: 'rgba(0, 255, 136, 0.3)',
      currentTime: '#ff00aa',
      text: '#e8e8ff'
    };

    this.padding = 40;
    this.hourWidth = (this.width - 2 * this.padding) / 24;

    // 拖拽狀態
    this.isDragging = false;
    this.dragStartX = 0;
    this.startDay = 3; // 周三
    this.startHour = 15; // 下午3點
    this.currentHour = 15;
    this.elapsedHours = 0;

    // 綁定事件監聽
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.canvas.addEventListener('mouseleave', (e) => this.onMouseLeave(e));

    // 觸控支持
    this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
    this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
    this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
  }

  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 檢查是否點擊在時間軸區域
    if (y > 70 && y < 110) {
      this.isDragging = true;
      this.dragStartX = x;
      this.canvas.style.cursor = 'grabbing';
    }
  }

  onMouseMove(e) {
    if (!this.isDragging) {
      const rect = this.canvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      this.canvas.style.cursor = (y > 70 && y < 110) ? 'grab' : 'default';
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const deltaX = currentX - this.dragStartX;

    // 計算小時偏移
    const hourDelta = deltaX / this.hourWidth;
    this.currentHour = this.startHour + hourDelta;

    // 限制在有效範圍內
    this.currentHour = Math.max(0, Math.min(this.currentHour, 60)); // 最多拖動到 +36 小時

    // 計算經過的小時數
    this.elapsedHours = this.currentHour - this.startHour;

    // 重繪
    this.drawTimelineWithDrag();
    this.updateResultDisplay();
  }

  onMouseUp(e) {
    this.isDragging = false;
    this.canvas.style.cursor = 'default';
  }

  onMouseLeave(e) {
    this.isDragging = false;
    this.canvas.style.cursor = 'default';
  }

  onTouchStart(e) {
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const y = touch.clientY - rect.top;

    if (y > 70 && y < 110) {
      this.isDragging = true;
      this.dragStartX = touch.clientX - rect.left;
    }
  }

  onTouchMove(e) {
    if (!this.isDragging) return;

    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const deltaX = currentX - this.dragStartX;

    const hourDelta = deltaX / this.hourWidth;
    this.currentHour = this.startHour + hourDelta;
    this.currentHour = Math.max(0, Math.min(this.currentHour, 60));

    this.elapsedHours = this.currentHour - this.startHour;

    this.drawTimelineWithDrag();
    this.updateResultDisplay();

    e.preventDefault();
  }

  onTouchEnd(e) {
    this.isDragging = false;
  }

  drawTimelineWithDrag() {
    // 清空canvas
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 繪製背景網格
    this.drawGrid();

    // 繪製天數標籤
    this.drawDayLabels(this.startDay, this.startDay + 2);

    // 繪製小時刻度
    this.drawHourMarks();

    // 繪製當前時間範圍
    this.drawTimeRange(this.startHour, this.currentHour);
  }

  updateResultDisplay() {
    const resultDiv = document.getElementById('timeline1Result');
    if (!resultDiv) return;

    const days = Math.floor(this.elapsedHours / 24);
    const hours = Math.floor(this.elapsedHours % 24);

    let resultText = `⏱️ 已拖動：${this.elapsedHours.toFixed(1)}小時 `;

    if (this.elapsedHours >= 24) {
      resultText += `= ${days}天 ${hours}小時`;
    }

    // 計算結束時間
    let endDay = '周三';
    let endHour = this.currentHour;

    const dayOffset = Math.floor(this.currentHour / 24);
    if (dayOffset > 0) {
      const dayNames = ['周三', '周四', '周五'];
      endDay = dayNames[Math.min(dayOffset, dayNames.length - 1)];
      endHour = this.currentHour % 24;
    }

    resultText += `<br>✓ 結果：${endDay} ${Math.floor(endHour)}點`;

    resultDiv.innerHTML = resultText;
  }

  drawTimeline(startDay, startHour, endDay, endHour) {
    // 保存初始狀態用於拖拽
    this.startDay = startDay;
    this.startHour = startHour;
    this.currentHour = endHour;
    this.elapsedHours = endHour - startHour;

    // 清空canvas
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 繪製背景網格
    this.drawGrid();

    // 繪製天數標籤
    this.drawDayLabels(startDay, endDay);

    // 繪製小時刻度
    this.drawHourMarks();

    // 繪製時間範圍
    this.drawTimeRange(startHour, endHour);
  }

  drawGrid() {
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 1;

    // 豎線（每小時）
    for (let i = 0; i <= 24; i++) {
      const x = this.padding + i * this.hourWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 60);
      this.ctx.lineTo(x, this.height - 20);
      this.ctx.stroke();
    }
  }

  drawDayLabels(startDay, endDay) {
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const days = [];
    let currentDay = startDay;

    for (let i = 0; i < 3; i++) {
      days.push(dayNames[currentDay % 7]);
      currentDay++;
    }

    this.ctx.fillStyle = this.colors.dayText;
    this.ctx.font = 'bold 16px Microsoft JhengHei';
    this.ctx.textAlign = 'center';

    // 繪製天數標籤
    const labelY = 30;
    const spacing = (this.width - 2 * this.padding) / 2;

    days.forEach((day, index) => {
      const x = this.padding + spacing * index + spacing / 2;
      this.ctx.fillText(day, x, labelY);
    });
  }

  drawHourMarks() {
    this.ctx.fillStyle = this.colors.hourMark;
    this.ctx.font = '12px Microsoft JhengHei';
    this.ctx.textAlign = 'center';

    for (let i = 0; i <= 24; i++) {
      const x = this.padding + i * this.hourWidth;

      // 小標記
      if (i % 6 === 0) {
        this.ctx.fillRect(x - 2, this.height - 25, 4, 8);
        this.ctx.fillText(i + 'h', x, this.height - 5);
      }
    }
  }

  drawTimeRange(startHour, endHour) {
    // 繪製起始時間標記
    const startX = this.padding + startHour * this.hourWidth;
    this.ctx.fillStyle = '#00ff88';
    this.ctx.beginPath();
    this.ctx.arc(startX, 90, 6, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#00ff88';
    this.ctx.font = 'bold 14px Microsoft JhengHei';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('開始', startX, 50);

    // 繪製結束時間標記
    const endX = this.padding + endHour * this.hourWidth;
    this.ctx.fillStyle = this.colors.currentTime;
    this.ctx.beginPath();
    this.ctx.arc(endX, 90, 6, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = this.colors.currentTime;
    this.ctx.fillText('現在', endX, 50);

    // 繪製連接線
    this.ctx.strokeStyle = 'rgba(255, 0, 170, 0.3)';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, 90);
    this.ctx.lineTo(endX, 90);
    this.ctx.stroke();
  }

  animateTimelineShift(fromHour, toHour, duration = 800) {
    const startTime = Date.now();
    const startHour = fromHour;
    const endHour = toHour;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentHour = startHour + (endHour - startHour) * progress;

      // 重繪時間軸
      this.drawTimeline(1, startHour, 2, currentHour);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}

// ============ 教學章節管理 ============
function initTimeConversionTutorial() {
  console.log('initTimeConversionTutorial called');

  const container = document.getElementById('timeConversionTutorial');
  if (!container) {
    console.error('timeConversionTutorial container not found');
    return;
  }

  console.log('Container found, checking for tabs...');

  // 創建導航按鈕
  const tabs = document.querySelector('.tutorial-tabs');
  if (!tabs) {
    console.log('tutorial-tabs not found, creating...');
    const tabsHTML = `
      <div class="tutorial-tabs">
        <button class="tab-btn active" onclick="switchTutorialChapter(1)">📖 基礎概念</button>
        <button class="tab-btn" onclick="switchTutorialChapter(2)">📈 正推計算</button>
        <button class="tab-btn" onclick="switchTutorialChapter(3)">🔙 反推計算</button>
        <button class="tab-btn" onclick="switchTutorialChapter(4)">🎮 交互練習</button>
        <button class="tab-btn" onclick="switchTutorialChapter(5)">✅ 本章小測</button>
      </div>
    `;
    container.insertAdjacentHTML('afterbegin', tabsHTML);
    console.log('tutorial-tabs created');
  } else {
    console.log('tutorial-tabs already exists');
  }

  // 加載第一章
  console.log('Loading chapter 1...');
  switchTutorialChapter(1);
  console.log('Chapter 1 loaded');
}

function switchTutorialChapter(chapterNum) {
  timeConversionState.currentChapter = chapterNum;

  // 更新選中狀態
  document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx + 1 === chapterNum);
  });

  const contentContainer = document.getElementById('timeConversionTutorialContent');
  const progressDisplay = document.getElementById('tutorialProgress');

  if (!contentContainer) {
    console.error('timeConversionTutorialContent container not found');
    return;
  }

  // 清空內容
  contentContainer.innerHTML = '';

  // 檢查 TIME_CONVERSION_DATA 是否存在
  if (typeof TIME_CONVERSION_DATA === 'undefined' || !TIME_CONVERSION_DATA.tutorial) {
    console.error('TIME_CONVERSION_DATA not loaded properly', TIME_CONVERSION_DATA);
    contentContainer.innerHTML = '<p style="color: #ff6b6b;">⚠️ 教學數據加載失敗，請刷新頁面</p>';
    return;
  }

  const chapterKey = `chapter${chapterNum}`;
  const chapter = TIME_CONVERSION_DATA.tutorial[chapterKey];

  if (!chapter) {
    console.error(`Chapter ${chapterNum} not found in tutorial data`);
    contentContainer.innerHTML = `<p style="color: #ff6b6b;">⚠️ 第 ${chapterNum} 章數據未找到</p>`;
    return;
  }

  // 構建章節內容
  let html = `
    <div class="tutorial-chapter">
      <div class="chapter-header">
        <h2>${chapter.title}</h2>
        <p>${chapter.subtitle}</p>
        <div class="chapter-info">
          <span class="duration">⏱️ ${chapter.duration}</span>
        </div>
      </div>
  `;

  // 添加各個章節
  chapter.sections.forEach((section, idx) => {
    html += `
      <div class="chapter-section">
        <h3>${section.heading}</h3>
        <div class="section-content">
          ${section.content}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  contentContainer.innerHTML = html;

  // 更新進度
  if (progressDisplay) {
    progressDisplay.textContent = `第 ${chapterNum} / 5 章`;
  }

  // 初始化交互元素
  if (chapterNum === 1) {
    initBasicConverterInteractive();
  } else if (chapterNum === 2) {
    initTimelineInteractive1();
  } else if (chapterNum === 3) {
    initTimelineInteractive2();
  } else if (chapterNum === 4) {
    initPracticeTimelines();
  } else if (chapterNum === 5) {
    initChapterQuiz();
  }
}

// ============ 基礎概念交互 ============
function initBasicConverterInteractive() {
  const input = document.getElementById('days');
  if (!input) return;

  input.addEventListener('input', function() {
    const days = parseFloat(this.value) || 0;
    const hours = days * 24;
    const minutes = hours * 60;
    const seconds = minutes * 60;

    const resultDiv = document.getElementById('conversionResult');
    if (resultDiv) {
      resultDiv.style.display = days > 0 ? 'block' : 'none';
      resultDiv.innerHTML = `
        <div style="font-size: 18px; margin-bottom: 10px;">
          <strong>${days}天 =
          ${hours}小時 =
          ${minutes}分鐘 =
          ${seconds}秒</strong>
        </div>
      `;
    }
  });
}

// ============ 時間軸交互 ============
function initTimelineInteractive1() {
  // 第二章的時間軸演示
  setTimeout(() => {
    const canvas = document.getElementById('timeline1');
    if (!canvas) return;

    const animator = new TimelineAnimator('timeline1');
    animator.drawTimeline(3, 8, 5, 8); // 周三早上8點 → 經過48小時後是周五早上8點

    const resultDiv = document.getElementById('timeline1Result');
    if (resultDiv) {
      resultDiv.innerHTML = `💡 提示：在時間軸上拖拽紅點，看看時間如何變化！<br>✓ 當前：周五 8點（經過48小時 = 2天）`;
    }
  }, 100);
}

function initTimelineInteractive2() {
  // 第三章的反推演示
  // 實現類似的時間軸
}

// ============ 練習時間軸 ============
function initPracticeTimelines() {
  // 初始化練習1, 2, 3的時間軸交互
  console.log('Practice timelines initialized');
}

// ============ 本章小測 ============
function initChapterQuiz() {
  const container = document.getElementById('chapterQuizContainer');
  if (!container) return;

  const quiz = TIME_CONVERSION_DATA.chapterQuiz;
  let html = `<div class="chapter-quiz">`;

  quiz.forEach((problem, idx) => {
    html += `
      <div class="quiz-question" id="quiz-${idx}">
        <div class="quiz-number">第 ${idx + 1} 題</div>
        <div class="quiz-content">${problem.content}</div>
        <div class="quiz-options">
    `;

    problem.options.forEach((option) => {
      html += `
        <button class="quiz-option" onclick="submitQuizAnswer(${idx}, '${option}')">
          ${option}
        </button>
      `;
    });

    html += `
        </div>
        <div class="quiz-result-${idx}" style="display: none; margin-top: 10px;"></div>
      </div>
    `;
  });

  html += `
    <button onclick="finishChapterQuiz()" class="btn-next" id="finishQuizBtn" style="display: none;">
      完成小測，進入正式題庫
    </button>
  </div>`;

  container.innerHTML = html;
}

function submitQuizAnswer(questionIdx, selectedAnswer) {
  const problem = TIME_CONVERSION_DATA.chapterQuiz[questionIdx];
  const resultDiv = document.querySelector(`.quiz-result-${questionIdx}`);

  if (!resultDiv) return;

  if (selectedAnswer === problem.answer) {
    resultDiv.innerHTML = '✓ 正確！';
    resultDiv.style.color = '#00ff88';
    resultDiv.style.display = 'block';

    // 禁用所有按鈕
    document.querySelectorAll(`#quiz-${questionIdx} .quiz-option`).forEach(btn => {
      btn.disabled = true;
    });

    // 檢查是否全部正確
    checkAllQuizAnswered();
  } else {
    resultDiv.innerHTML = `✗ 不對，正確答案是：${problem.answer}`;
    resultDiv.style.color = '#ff6b6b';
    resultDiv.style.display = 'block';
  }
}

function checkAllQuizAnswered() {
  const allAnswered = document.querySelectorAll('.quiz-result-0, .quiz-result-1, .quiz-result-2, .quiz-result-3, .quiz-result-4').length === 5;
  const finishBtn = document.getElementById('finishQuizBtn');

  if (finishBtn && allAnswered) {
    finishBtn.style.display = 'block';
  }
}

function finishChapterQuiz() {
  // 進入正式題庫
  goToTimeConversionQuiz();
}

// ============ 題庫管理 ============
function initTimeConversionQuiz(difficulty = 'basic') {
  timeConversionState.currentDifficulty = difficulty;
  timeConversionState.currentProblemIndex = 0;
  timeConversionState.currentStep = 0;
  timeConversionState.userAnswers = [];

  // 隱藏教學，顯示題庫
  const tutorialEl = document.getElementById('timeConversionTutorial');
  const quizPageEl = document.getElementById('timeConversionQuizPage');

  if (tutorialEl) tutorialEl.style.display = 'none';
  if (quizPageEl) quizPageEl.style.display = 'block';

  displayCurrentProblem();
}

function displayCurrentProblem() {
  const difficulty = timeConversionState.currentDifficulty;
  let problemSet = [];

  if (difficulty === 'basic') {
    problemSet = TIME_CONVERSION_DATA.basicProblems;
  } else if (difficulty === 'intermediate') {
    problemSet = TIME_CONVERSION_DATA.intermediateProblems;
  } else if (difficulty === 'advanced') {
    problemSet = TIME_CONVERSION_DATA.advancedProblems;
  }

  const problem = problemSet[timeConversionState.currentProblemIndex];
  if (!problem) {
    showQuizComplete(difficulty);
    return;
  }

  const container = document.getElementById('quizProblemContainer');
  if (!container) return;

  // 更新進度條
  updateProgressBar(difficulty);

  if (problem.type === 'step_by_step') {
    displayStepByStepProblem(problem);
  } else {
    displayMultipleChoiceProblem(problem);
  }
}

function displayMultipleChoiceProblem(problem) {
  const container = document.getElementById('quizProblemContainer');

  let html = `
    <div class="quiz-problem">
      <div class="problem-header">
        <h3>${problem.content}</h3>
      </div>
      <div class="problem-options">
  `;

  problem.options.forEach((option) => {
    html += `
      <button class="option-btn" onclick="submitMultipleChoiceAnswer('${option}')">
        ${option}
      </button>
    `;
  });

  html += `
    </div>
    <div id="answerFeedback"></div>
  </div>
  `;

  container.innerHTML = html;
}

function displayStepByStepProblem(problem) {
  const container = document.getElementById('quizProblemContainer');
  const currentStep = timeConversionState.currentStep;

  if (currentStep >= problem.questions.length) {
    moveToNextProblem();
    return;
  }

  const step = problem.questions[currentStep];

  let html = `
    <div class="quiz-problem">
      <div class="problem-header">
        <h3>${problem.content}</h3>
        <div class="step-indicator">
          第 ${currentStep + 1} / ${problem.questions.length} 步
        </div>
      </div>
      <div class="step-content">
        <div class="step-question">${step.prompt}</div>
  `;

  if (step.options) {
    html += '<div class="step-options">';
    step.options.forEach((option) => {
      html += `
        <button class="step-option-btn" onclick="submitStepAnswer('${option}')">
          ${option}
        </button>
      `;
    });
    html += '</div>';
  } else {
    html += `
      <div class="step-input-area">
        <input type="text" id="stepAnswerInput" placeholder="輸入答案" onkeypress="if(event.key==='Enter') submitStepAnswer(this.value)">
        <button onclick="submitStepAnswer(document.getElementById('stepAnswerInput').value)" class="btn-submit">提交</button>
      </div>
    `;
  }

  html += `
    </div>
    <div id="stepFeedback"></div>
  </div>
  `;

  container.innerHTML = html;

  // 如果有提示，顯示提示按鈕
  if (step.hint) {
    const feedbackDiv = document.getElementById('stepFeedback');
    if (feedbackDiv) {
      feedbackDiv.innerHTML += `
        <button onclick="showHint()" class="btn-hint" style="margin-top: 10px;">💡 查看提示</button>
      `;
    }
  }
}

function submitMultipleChoiceAnswer(selectedAnswer) {
  const difficulty = timeConversionState.currentDifficulty;
  let problemSet = [];

  if (difficulty === 'basic') {
    problemSet = TIME_CONVERSION_DATA.basicProblems;
  } else if (difficulty === 'intermediate') {
    problemSet = TIME_CONVERSION_DATA.intermediateProblems;
  } else if (difficulty === 'advanced') {
    problemSet = TIME_CONVERSION_DATA.advancedProblems;
  }

  const problem = problemSet[timeConversionState.currentProblemIndex];
  const feedbackDiv = document.getElementById('answerFeedback');

  if (selectedAnswer === problem.answer) {
    showCorrectFeedback(problem, feedbackDiv);
    timeConversionState.quizProgress[difficulty].completed++;

    setTimeout(() => {
      moveToNextProblem();
    }, 2000);
  } else {
    showWrongFeedback(problem, selectedAnswer, feedbackDiv);
  }
}

function submitStepAnswer(userAnswer) {
  const difficulty = timeConversionState.currentDifficulty;
  let problemSet = [];

  if (difficulty === 'basic') {
    problemSet = TIME_CONVERSION_DATA.basicProblems;
  } else if (difficulty === 'intermediate') {
    problemSet = TIME_CONVERSION_DATA.intermediateProblems;
  } else if (difficulty === 'advanced') {
    problemSet = TIME_CONVERSION_DATA.advancedProblems;
  }

  const problem = problemSet[timeConversionState.currentProblemIndex];
  const step = problem.questions[timeConversionState.currentStep];
  const feedbackDiv = document.getElementById('stepFeedback');

  if (userAnswer === step.answer) {
    showCorrectStepFeedback(step, problem, feedbackDiv);
    timeConversionState.currentStep++;

    setTimeout(() => {
      displayStepByStepProblem(problem);
    }, 1500);
  } else {
    showWrongStepFeedback(step, userAnswer, feedbackDiv);
  }
}

function showHint() {
  const difficulty = timeConversionState.currentDifficulty;
  let problemSet = TIME_CONVERSION_DATA[difficulty === 'basic' ? 'basicProblems' : difficulty === 'intermediate' ? 'intermediateProblems' : 'advancedProblems'];

  const problem = problemSet[timeConversionState.currentProblemIndex];
  const step = problem.questions[timeConversionState.currentStep];

  if (step.hint) {
    const feedbackDiv = document.getElementById('stepFeedback');
    if (feedbackDiv) {
      feedbackDiv.innerHTML = `<div class="hint-box">💡 提示：${step.hint}</div>`;
    }
  }
}

function showCorrectFeedback(problem, container) {
  container.innerHTML = `
    <div class="feedback-box correct-feedback">
      <div class="feedback-icon">✓</div>
      <div class="feedback-text">答對了！</div>
      <div class="feedback-explanation">${problem.explanation || ''}</div>
    </div>
  `;
  container.style.display = 'block';
}

function showWrongFeedback(problem, selectedAnswer, container) {
  container.innerHTML = `
    <div class="feedback-box wrong-feedback">
      <div class="feedback-icon">✗</div>
      <div class="feedback-text">答錯了</div>
      <div class="error-analysis">
        <div>你選擇的是：<strong>${selectedAnswer}</strong></div>
        <div>正確答案是：<strong>${problem.answer}</strong></div>
        <div style="margin-top: 10px; color: #00ff88;">說明：${problem.explanation}</div>
      </div>
      <button onclick="retryCurrentProblem()" class="btn-retry">重新試試</button>
    </div>
  `;
  container.style.display = 'block';
}

function showCorrectStepFeedback(step, problem, container) {
  container.innerHTML = `
    <div class="feedback-box correct-feedback">
      <div class="feedback-icon">✓</div>
      <div class="feedback-text">正確！</div>
      <div style="margin-top: 10px; font-size: 14px; color: #b4b4ff;">
        這一步的答案是：<strong>${step.answer}</strong>
      </div>
    </div>
  `;
  container.style.display = 'block';
}

function showWrongStepFeedback(step, selectedAnswer, container) {
  container.innerHTML = `
    <div class="feedback-box wrong-feedback">
      <div class="feedback-icon">✗</div>
      <div class="feedback-text">這一步的答案不對</div>
      <div class="error-analysis">
        <div>你的答案：<strong>${selectedAnswer}</strong></div>
        <div>正確答案：<strong>${step.answer}</strong></div>
        ${step.hint ? `<div style="margin-top: 10px; color: #00ff88;">提示：${step.hint}</div>` : ''}
      </div>
      <button onclick="retryCurrentStep()" class="btn-retry">重新試試</button>
    </div>
  `;
  container.style.display = 'block';
}

function retryCurrentProblem() {
  const feedbackDiv = document.getElementById('answerFeedback');
  if (feedbackDiv) {
    feedbackDiv.innerHTML = '';
    feedbackDiv.style.display = 'none';
  }

  // 重新顯示題目
  const difficulty = timeConversionState.currentDifficulty;
  let problemSet = TIME_CONVERSION_DATA[difficulty === 'basic' ? 'basicProblems' : difficulty === 'intermediate' ? 'intermediateProblems' : 'advancedProblems'];
  displayMultipleChoiceProblem(problemSet[timeConversionState.currentProblemIndex]);
}

function retryCurrentStep() {
  const feedbackDiv = document.getElementById('stepFeedback');
  if (feedbackDiv) {
    feedbackDiv.innerHTML = '';
    feedbackDiv.style.display = 'none';
  }

  // 重新顯示該步驟
  const difficulty = timeConversionState.currentDifficulty;
  let problemSet = TIME_CONVERSION_DATA[difficulty === 'basic' ? 'basicProblems' : difficulty === 'intermediate' ? 'intermediateProblems' : 'advancedProblems'];
  displayStepByStepProblem(problemSet[timeConversionState.currentProblemIndex]);
}

function moveToNextProblem() {
  const difficulty = timeConversionState.currentDifficulty;
  let problemSet = TIME_CONVERSION_DATA[difficulty === 'basic' ? 'basicProblems' : difficulty === 'intermediate' ? 'intermediateProblems' : 'advancedProblems'];

  timeConversionState.currentProblemIndex++;
  timeConversionState.currentStep = 0;

  if (timeConversionState.currentProblemIndex >= problemSet.length) {
    showQuizComplete(difficulty);
  } else {
    displayCurrentProblem();
  }
}

function updateProgressBar(difficulty) {
  const progress = timeConversionState.quizProgress[difficulty];
  const progressDiv = document.getElementById('quizProgress');

  if (progressDiv) {
    const current = timeConversionState.currentProblemIndex + 1;
    progressDiv.innerHTML = `
      <div class="progress-text">
        第 ${current} / ${progress.total} 題
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(current / progress.total) * 100}%"></div>
      </div>
    `;
  }
}

function showQuizComplete(difficulty) {
  const container = document.getElementById('quizProblemContainer');
  const totalCorrect = timeConversionState.quizProgress[difficulty].completed;
  const total = timeConversionState.quizProgress[difficulty].total;
  const percentage = Math.round((totalCorrect / total) * 100);

  let nextDifficulty = '';
  if (difficulty === 'basic') {
    nextDifficulty = 'intermediate';
  } else if (difficulty === 'intermediate') {
    nextDifficulty = 'advanced';
  }

  let html = `
    <div class="quiz-complete">
      <div class="complete-header">🎉 完成！</div>
      <div class="complete-stats">
        <div class="stat">
          <div class="stat-label">${difficulty === 'basic' ? '基礎題' : difficulty === 'intermediate' ? '進階題' : '挑戰題'}</div>
          <div class="stat-value">${totalCorrect} / ${total}</div>
          <div class="stat-percentage">${percentage}% 正確率</div>
        </div>
      </div>
  `;

  if (nextDifficulty) {
    html += `
      <button onclick="initTimeConversionQuiz('${nextDifficulty}')" class="btn-next">
        ➜ 進入${nextDifficulty === 'intermediate' ? '進階題' : '挑戰題'}
      </button>
    `;
  } else {
    html += `
      <button onclick="backToTimeConversionHome()" class="btn-next">
        ← 返回首頁
      </button>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}

// ============ 導航函數 ============
function goToTimeConversionModule() {
  // 隱藏所有頁面
  const homePageEl = document.getElementById('homePage');
  const cardModeEl = document.getElementById('cardModePage');
  const gameModeEl = document.getElementById('gameModePage');
  const gamePlayEl = document.getElementById('gamePlayPage');
  const tutorialEl = document.getElementById('tutorialPage');
  const timeConvEl = document.getElementById('timeConversionPage');

  if (homePageEl) homePageEl.style.display = 'none';
  if (cardModeEl) {
    cardModeEl.style.display = 'none';
    cardModeEl.classList.remove('active');
  }
  if (gameModeEl) {
    gameModeEl.style.display = 'none';
    gameModeEl.classList.remove('active');
  }
  if (gamePlayEl) {
    gamePlayEl.style.display = 'none';
    gamePlayEl.classList.remove('active');
  }
  if (tutorialEl) tutorialEl.style.display = 'none';

  // 顯示時間換算頁面
  if (timeConvEl) {
    timeConvEl.style.display = 'block';
    timeConvEl.classList.add('active');
    initTimeConversionModule();
  }
}

function goToTimeConversionQuiz() {
  const tutorialEl = document.getElementById('timeConversionTutorial');
  const quizPageEl = document.getElementById('timeConversionQuizPage');

  if (tutorialEl) tutorialEl.style.display = 'none';
  if (quizPageEl) {
    quizPageEl.style.display = 'block';
    initTimeConversionQuiz('basic');
  }
}

function backToTimeConversionHome() {
  const timeConvPageEl = document.getElementById('timeConversionPage');
  const quizPageEl = document.getElementById('timeConversionQuizPage');
  const tutorialEl = document.getElementById('timeConversionTutorial');

  if (timeConvPageEl) timeConvPageEl.style.display = 'block';
  if (quizPageEl) quizPageEl.style.display = 'none';
  if (tutorialEl) tutorialEl.style.display = 'block';
}

function initTimeConversionModule() {
  console.log('initTimeConversionModule called');
  try {
    initTimeConversionTutorial();
    console.log('initTimeConversionTutorial completed successfully');
  } catch (error) {
    console.error('Error in initTimeConversionTutorial:', error);
  }
}

// ============ 輔助函數 ============
function calculateTimeAfterHours(startDay, startHour, hours) {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const endHour = (startHour + remainingHours) % 24;
  const endDay = startDay + days + Math.floor((startHour + remainingHours) / 24);

  return { day: endDay, hour: endHour };
}

function calculateTimeBeforeHours(endDay, endHour, hours) {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  let startHour = endHour - remainingHours;
  let startDay = endDay - days;

  if (startHour < 0) {
    startHour += 24;
    startDay--;
  }

  return { day: startDay, hour: startHour };
}

// ============ 基礎概念交互函數 ============

// 進度條互動 - 天/小時
function highlightSegment(button, segment) {
  const container = button.closest('.progress-segments');
  const buttons = container.querySelectorAll('.progress-segment');

  buttons.forEach(btn => btn.classList.remove('highlight'));
  button.classList.add('highlight');

  const hours = segment * 6;
  const startHour = (segment - 1) * 6;
  document.getElementById('segmentDisplay').textContent =
    `✓ ${startHour}-${hours} 小時是一天中的 ${segment}/4`;
}

// 進度條互動 - 分鐘
function highlightMinutes(button, segment) {
  const container = button.closest('.progress-segments');
  const buttons = container.querySelectorAll('.progress-segment');
  buttons.forEach(btn => btn.classList.remove('highlight'));
  button.classList.add('highlight');

  const minutes = segment * 20;
  const startMin = (segment - 1) * 20;
  document.getElementById('minutesDisplay').textContent =
    `✓ ${startMin}-${minutes} 分鐘是一小時中的 ${segment}/3`;
}

// 進度條互動 - 秒
function highlightSeconds(button, segment) {
  const container = button.closest('.progress-segments');
  const buttons = container.querySelectorAll('.progress-segment');
  buttons.forEach(btn => btn.classList.remove('highlight'));
  button.classList.add('highlight');

  const seconds = segment * 15;
  const startSec = (segment - 1) * 15;
  document.getElementById('secondsDisplay').textContent =
    `✓ ${startSec}-${seconds} 秒是一分鐘中的 ${segment}/4`;
}

// 轉換器互動函數
function updateDaysConversion(value) {
  const days = parseInt(value) || 0;
  document.getElementById('hoursResult').textContent = days * 24;
}

function updateHoursConversion(value) {
  const hours = parseInt(value) || 0;
  document.getElementById('minutesResult').textContent = hours * 60;
}

function updateMinutesConversion(value) {
  const minutes = parseInt(value) || 0;
  document.getElementById('secondsResult').textContent = minutes * 60;
}

// 反向轉換切換
let reverseMode = false;

function toggleReverseMode() {
  reverseMode = !reverseMode;
  const btn = document.getElementById('reverseToggleBtn');
  const labels = document.querySelectorAll('.card-label');

  if (reverseMode) {
    btn.classList.add('active');
    labels[0].textContent = '小時 ← 天';
    labels[1].textContent = '分鐘 ← 小時';
    labels[2].textContent = '秒 ← 分鐘';

    document.getElementById('daysInput').placeholder = '輸入小時';
    document.getElementById('hoursInput').placeholder = '輸入分鐘';
    document.getElementById('minutesInput').placeholder = '輸入秒';
  } else {
    btn.classList.remove('active');
    labels[0].textContent = '天 → 小時';
    labels[1].textContent = '小時 → 分鐘';
    labels[2].textContent = '分鐘 → 秒';

    document.getElementById('daysInput').placeholder = '0';
    document.getElementById('hoursInput').placeholder = '0';
    document.getElementById('minutesInput').placeholder = '0';
  }
}

// 初始化基礎概念
function initializeBasicConcept() {
  // 立即設置初始值
  updateDaysConversion(2);
  updateHoursConversion(3);
  updateMinutesConversion(5);
}

// ============ 第二章：時間分解視覺化 ============
/**
 * 視覺化時間分解 - 將小時分解為天和小時
 * @param {number} totalHours - 總小時數
 */
function visualizeDecomposition(totalHours) {
  // 計算分解結果
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  // 計算條形寬度比例
  const maxWidth = 100; // 百分比
  const dayWidth = (days * 24 / totalHours) * maxWidth;
  const hourWidth = (remainingHours / totalHours) * maxWidth;

  // 更新條形圖
  const dayBar = document.getElementById('dayBar');
  const hourBar = document.getElementById('hourBar');
  const decompositionText = document.getElementById('decompositionText');

  if (!dayBar || !hourBar || !decompositionText) return;

  // 設置條形寬度
  if (days > 0) {
    dayBar.style.width = dayWidth + '%';
    dayBar.textContent = `${days}天 (${days * 24}小時)`;
    dayBar.style.display = 'flex';
  } else {
    dayBar.style.display = 'none';
  }

  if (remainingHours > 0) {
    hourBar.style.width = hourWidth + '%';
    hourBar.textContent = `${remainingHours}小時`;
    hourBar.style.display = 'flex';
  } else {
    hourBar.style.display = 'none';
  }

  // 更新結果文本
  decompositionText.innerHTML = `
    <div style="font-size: 18px; margin-bottom: 10px;">✓ ${totalHours}小時 = ${days}天 + ${remainingHours}小時</div>
    <div style="font-size: 14px; color: #00f5ff;">
      計算過程：${totalHours} ÷ 24 = ${days} ... ${remainingHours}
    </div>
  `;

  // 添加動畫效果
  dayBar.style.transition = 'all 0.5s ease';
  hourBar.style.transition = 'all 0.5s ease';
}

// ============ 第二章：時間加法動畫 ============
/**
 * 顯示分步驟的時間加法動畫
 * @param {string} startDay - 開始日期
 * @param {number} startHour - 開始小時
 * @param {number} totalHours - 總小時數
 */
function animateTimeAddition(startDay, startHour, totalHours) {
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  // 第一步：計算分解
  console.log(`${startDay} ${startHour}點 + ${totalHours}小時`);
  console.log(`= ${startDay} ${startHour}點 + ${days}天 + ${hours}小時`);

  // 第二步：先加小時
  let intermediateHour = startHour + hours;
  let currentDay = startDay;

  if (intermediateHour >= 24) {
    intermediateHour -= 24;
    currentDay = getNextDay(currentDay);
  }

  console.log(`= ${currentDay} ${intermediateHour}點 + ${days}天`);

  // 第三步：再加天數
  let finalDay = currentDay;
  for (let i = 0; i < days; i++) {
    finalDay = getNextDay(finalDay);
  }

  console.log(`= ${finalDay} ${intermediateHour}點`);

  return {
    startDay,
    startHour,
    intermediateDay: currentDay,
    intermediateHour,
    finalDay,
    finalHour: intermediateHour
  };
}

/**
 * 獲取下一天的日期
 * @param {string} day - 當前日期（如 '周一'、'周二' 等）
 * @returns {string} 下一天的日期
 */
function getNextDay(day) {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const currentIndex = days.indexOf(day);
  if (currentIndex === -1) return day; // 如果沒找到，返回原值

  const nextIndex = (currentIndex + 1) % 7;
  return days[nextIndex];
}

/**
 * 顯示時間加法的分步驟視覺化
 * @param {string} containerId - 容器 ID
 * @param {string} startDay - 開始日期
 * @param {number} startHour - 開始小時
 * @param {number} totalHours - 總小時數
 */
function displayTimeAdditionSteps(containerId, startDay, startHour, totalHours) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const result = animateTimeAddition(startDay, startHour, totalHours);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  container.innerHTML = `
    <div class="time-addition-steps">
      <div class="addition-step" style="padding: 15px; margin: 10px 0; background: rgba(0,245,255,0.08); border: 2px solid #00f5ff; border-radius: 8px;">
        <div style="font-size: 14px; color: #b8c5d6; margin-bottom: 8px;">第1步：分解小時數</div>
        <div style="font-size: 18px; font-weight: bold; color: #00f5ff;">
          ${totalHours}小時 = ${days}天 + ${hours}小時
        </div>
      </div>

      <div class="addition-step" style="padding: 15px; margin: 10px 0; background: rgba(0,255,136,0.08); border: 2px solid #00ff88; border-radius: 8px;">
        <div style="font-size: 14px; color: #b8c5d6; margin-bottom: 8px;">第2步：先加小時</div>
        <div style="font-size: 18px; font-weight: bold; color: #00ff88;">
          ${startDay} ${startHour}點 + ${hours}小時 = ${result.intermediateDay} ${result.intermediateHour}點
        </div>
      </div>

      <div class="addition-step" style="padding: 15px; margin: 10px 0; background: rgba(255,0,170,0.08); border: 2px solid #ff00aa; border-radius: 8px;">
        <div style="font-size: 14px; color: #b8c5d6; margin-bottom: 8px;">第3步：再加天數</div>
        <div style="font-size: 18px; font-weight: bold; color: #ff00aa;">
          ${result.intermediateDay} ${result.intermediateHour}點 + ${days}天 = ${result.finalDay} ${result.finalHour}點
        </div>
      </div>

      <div class="final-answer" style="padding: 15px; margin: 10px 0; background: rgba(0,255,136,0.15); border: 3px solid #00ff88; border-radius: 8px; text-align: center;">
        <div style="font-size: 14px; color: #b8c5d6; margin-bottom: 8px;">✓ 最終答案</div>
        <div style="font-size: 24px; font-weight: bold; color: #00ff88;">
          ${result.finalDay} ${result.finalHour}點
        </div>
      </div>
    </div>
  `;
}

// ============ 第三章：反向時間分解視覺化 ============
/**
 * 視覺化反向時間分解 - 往回推多少小時
 * @param {number} totalHours - 往回推的總小時數
 */
function visualizeReverseDecomposition(totalHours) {
  // 計算分解結果
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  // 計算條形寬度比例
  const maxWidth = 100; // 百分比
  const dayWidth = (days * 24 / totalHours) * maxWidth;
  const hourWidth = (remainingHours / totalHours) * maxWidth;

  // 更新條形圖
  const dayBar = document.getElementById('reverseDayBar');
  const hourBar = document.getElementById('reverseHourBar');
  const decompositionText = document.getElementById('reverseDecompositionText');
  const stepsContainer = document.getElementById('reverseCalculationSteps');

  if (!dayBar || !hourBar || !decompositionText) return;

  // 設置條形寬度
  if (days > 0) {
    dayBar.style.width = dayWidth + '%';
    dayBar.textContent = `⬅ ${days}天`;
    dayBar.style.display = 'flex';
  } else {
    dayBar.style.display = 'none';
  }

  if (remainingHours > 0) {
    hourBar.style.width = hourWidth + '%';
    hourBar.textContent = `⬅ ${remainingHours}小時`;
    hourBar.style.display = 'flex';
  } else {
    hourBar.style.display = 'none';
  }

  // 更新結果文本
  decompositionText.innerHTML = `
    <div style="font-size: 18px; margin-bottom: 10px;">✓ 往回推 ${totalHours}小時 = 往回推 ${days}天 + ${remainingHours}小時</div>
    <div style="font-size: 14px; color: #ff00aa;">
      計算過程：${totalHours} ÷ 24 = ${days} ... ${remainingHours}
    </div>
  `;

  // 添加計算步驟
  displayReverseTimeSubtractionSteps(stepsContainer, totalHours);

  // 添加動畫效果
  dayBar.style.transition = 'all 0.5s ease';
  hourBar.style.transition = 'all 0.5s ease';
}

/**
 * 獲取前一天的日期
 * @param {string} day - 當前日期（如 '周一'、'周二' 等）
 * @returns {string} 前一天的日期
 */
function getPreviousDay(day) {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const currentIndex = days.indexOf(day);
  if (currentIndex === -1) return day; // 如果沒找到，返回原值

  const prevIndex = (currentIndex - 1 + 7) % 7;
  return days[prevIndex];
}

/**
 * 顯示反向時間減法的分步驟視覺化
 * @param {element} container - 容器元素
 * @param {number} totalHours - 往回推的總小時數
 */
function displayReverseTimeSubtractionSteps(container, totalHours) {
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  // 假設從「今天早上8點」往回推
  const endDay = '今天';
  const endHour = 8;

  // 第一步：往回推小時
  let intermediateHour = endHour - hours;
  let currentDay = endDay;

  if (intermediateHour < 0) {
    intermediateHour += 24;
    currentDay = getPreviousDay(endDay);
  }

  // 第二步：往回推天數
  let startDay = currentDay;
  for (let i = 0; i < days; i++) {
    startDay = getPreviousDay(startDay);
  }

  if (!container) return;

  container.innerHTML = `
    <div class="reverse-subtraction-steps" style="margin-top: 15px;">
      <div style="padding: 12px; margin: 8px 0; background: rgba(255,0,170,0.08); border-left: 4px solid #ff00aa; border-radius: 4px;">
        <div style="font-size: 13px; color: #b8c5d6; margin-bottom: 6px;">📍 例子：從「今天早上8點」往回推 ${totalHours}小時</div>
        <div style="font-size: 16px; font-weight: bold; color: #ff00aa;">
          第1步：${endDay} ${endHour}點 - ${hours}小時 = ${currentDay} ${intermediateHour}點
        </div>
        <div style="font-size: 16px; font-weight: bold; color: #ff00aa; margin-top: 8px;">
          第2步：${currentDay} ${intermediateHour}點 - ${days}天 = ${startDay} ${intermediateHour}點
        </div>
      </div>
    </div>
  `;
}
