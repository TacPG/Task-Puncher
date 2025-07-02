// ===============================
// タスクパンチャー：統合JS（重ポチ音、パーティクル、物理反発）
// ===============================

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const doneBtn = document.getElementById('done-btn');
const counterSpan = document.getElementById('counter');
let punchCounter = 0;
let audioContext;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}


initAudio(); // ← すでにあるはず

// 🔽ここに追記！
function unlockMobileAudio() {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  gain.gain.value = 0.001;
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.05);
}

window.addEventListener('touchstart', () => {
  initAudio();
  unlockMobileAudio();
}, { once: true });

window.addEventListener('click', () => {
  initAudio();
  unlockMobileAudio();
}, { once: true });

// 以降、既存の playGunshotSound_Kar98k などの定義はそのままでOK


// 🔊 重ポチ音（ホッチキス風クリック）
function playClickSound_Heavy() {
    if (!audioContext) return;
    if (audioContext.state === 'suspended') audioContext.resume();
    const now = audioContext.currentTime;

    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.05, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 400;
    noiseFilter.Q.value = 1;

    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    noiseSource.connect(noiseFilter).connect(noiseGain).connect(audioContext.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.06);

    const clickOsc = audioContext.createOscillator();
    const clickGain = audioContext.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(150, now);
    clickGain.gain.setValueAtTime(0.3, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    clickOsc.connect(clickGain).connect(audioContext.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.05);
}

// 🔫 リアルな銃声音
function playGunshotSound_Kar98k() {
    if (!audioContext) return;
    if (audioContext.state === 'suspended') audioContext.resume();
    const now = audioContext.currentTime;

    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.03, audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const burstFilter = audioContext.createBiquadFilter();
    burstFilter.type = 'bandpass';
    burstFilter.frequency.value = 5000;
    burstFilter.Q.value = 1.5;

    const burstGain = audioContext.createGain();
    burstGain.gain.setValueAtTime(1.0, now);
    burstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    noiseSource.connect(burstFilter).connect(burstGain).connect(audioContext.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.05);

    const boomOsc = audioContext.createOscillator();
    const boomGain = audioContext.createGain();
    boomOsc.type = 'sawtooth';
    boomOsc.frequency.setValueAtTime(350, now);
    boomOsc.frequency.exponentialRampToValueAtTime(90, now + 0.2);
    boomGain.gain.setValueAtTime(0.9, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    boomOsc.connect(boomGain).connect(audioContext.destination);
    boomOsc.start(now);
    boomOsc.stop(now + 0.3);

    const ringOsc = audioContext.createOscillator();
    const ringGain = audioContext.createGain();
    const delay = audioContext.createDelay();
    const feedback = audioContext.createGain();
    delay.delayTime.value = 0.06;
    feedback.gain.value = 0.4;
    ringOsc.type = 'triangle';
    ringOsc.frequency.setValueAtTime(1800, now + 0.03);
    ringGain.gain.setValueAtTime(0.3, now + 0.03);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    ringOsc.connect(ringGain).connect(delay).connect(feedback).connect(delay);
    feedback.connect(audioContext.destination);
    ringOsc.start(now + 0.03);
    ringOsc.stop(now + 0.2);
}

// 🔁 コッキング音
function playCockingSound_Kar98k() {
    if (!audioContext) return;
    if (audioContext.state === 'suspended') audioContext.resume();
    const now = audioContext.currentTime;

    const click1 = audioContext.createOscillator();
    const click1Gain = audioContext.createGain();
    click1.type = 'square';
    click1.frequency.setValueAtTime(4000, now);
    click1Gain.gain.setValueAtTime(0.25, now);
    click1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    click1.connect(click1Gain).connect(audioContext.destination);
    click1.start(now);
    click1.stop(now + 0.03);

    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const metalFilter = audioContext.createBiquadFilter();
    metalFilter.type = 'bandpass';
    metalFilter.frequency.value = 2200;
    metalFilter.Q.value = 10;

    const metalGain = audioContext.createGain();
    metalGain.gain.setValueAtTime(0.2, now + 0.05);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    noiseSource.connect(metalFilter).connect(metalGain).connect(audioContext.destination);
    noiseSource.start(now + 0.05);
    noiseSource.stop(now + 0.15);

    const lockOsc = audioContext.createOscillator();
    const lockGain = audioContext.createGain();
    lockOsc.type = 'sawtooth';
    lockOsc.frequency.setValueAtTime(700, now + 0.2);
    lockGain.gain.setValueAtTime(0.4, now + 0.2);
    lockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    lockOsc.connect(lockGain).connect(audioContext.destination);
    lockOsc.start(now + 0.2);
    lockOsc.stop(now + 0.3);
}

// ✨ タスク追加音
function playTaskAddSound() {
    if (!audioContext) return;
    if (audioContext.state === 'suspended') audioContext.resume();
    const now = audioContext.currentTime;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain).connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.15);
}

// 🎆 パーティクル破片
function spawnParticles(x, y) {
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        document.body.appendChild(p);
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 40 + 10;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--dx', `${Math.cos(angle) * radius}px`);
        p.style.setProperty('--dy', `${Math.sin(angle) * radius}px`);
        setTimeout(() => p.remove(), 500);
    }
}

// 📦 タスク生成＆選択処理
function createTask(taskText) {
    const li = document.createElement('li');
    li.className = 'task-item enter';
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskText;
    li.appendChild(span);
    taskList.appendChild(li);
    setTimeout(() => li.classList.remove('enter'), 300);

    playTaskAddSound();

    li.addEventListener('click', () => {
        if (li.classList.contains('selected')) return;
        const currentSelected = document.querySelector('.task-item.selected');
        if (currentSelected) currentSelected.classList.remove('selected');
        li.classList.add('selected');
        playClickSound_Heavy();
        playCockingSound_Kar98k();
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
    playClickSound_Heavy();
    createTask(taskText);
    taskInput.value = '';
    taskInput.focus();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

doneBtn.addEventListener('mousedown', () => {
    doneBtn.classList.add('pressed');
});
doneBtn.addEventListener('mouseup', () => {
    doneBtn.classList.remove('pressed');
});

doneBtn.addEventListener('click', (e) => {
    const selectedTask = document.querySelector('.task-item.selected:not(.punched)');
    if (selectedTask) {
        doneBtn.classList.add('hit');
        setTimeout(() => doneBtn.classList.remove('hit'), 300);

        playGunshotSound_Kar98k();
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 150);

        const rect = selectedTask.getBoundingClientRect();
        spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

        selectedTask.classList.add('punched', 'punched-animation');
        selectedTask.classList.remove('selected');
        setTimeout(() => selectedTask.remove(), 500);

        punchCounter++;
        counterSpan.textContent = punchCounter;
        counterSpan.classList.add('pop');
        setTimeout(() => counterSpan.classList.remove('pop'), 300);
    }
});

initAudio();
createTask("Add Today's Task");

let lastTypeSoundTime = 0;
taskInput.addEventListener('keydown', (e) => {
  const now = performance.now();
  if (e.key.length === 1 && now - lastTypeSoundTime > 30) {
    initAudio();  // 念のためAudioContextを復帰
    playTypewriterClick();
    lastTypeSoundTime = now;
  }
});

// ← ここに追加！
function unlockMobileAudio() {
  initAudio(); // resume を確実に呼ぶ
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  gain.gain.value = 0.001; // 無音
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.05);
}


window.addEventListener('touchstart', unlockMobileAudio, { once: true });
window.addEventListener('click', unlockMobileAudio, { once: true });

function playTypewriterClick() {
    if (!audioContext) return;
    if (audioContext.state === 'suspended') audioContext.resume();

    const now = audioContext.currentTime;

    const clickOsc = audioContext.createOscillator();
    const clickGain = audioContext.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(3000 + Math.random() * 500, now);
    clickGain.gain.setValueAtTime(0.05, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    clickOsc.connect(clickGain).connect(audioContext.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.03);
}


