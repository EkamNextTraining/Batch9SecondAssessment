// =====================================================================
//  SF LIVE CODING ASSESSMENT — Core Logic
//  Replace SCRIPT_URL with your Google Apps Script Web App URL
// =====================================================================

const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

// ── Anti-Cheat ────────────────────────────────────────────────────────
let violationCount   = 0;
const MAX_VIOLATIONS = 3;
let isQuizRunning    = false;
let autoSubmitted    = false;

function isQuizActive() {
  return isQuizRunning && document.getElementById("screen-quiz").classList.contains("active");
}

// 1. Tab switch / window blur detection
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isQuizActive()) {
    violationCount++;
    updateViolationDots();

    if (violationCount >= MAX_VIOLATIONS) {
      autoSubmitted = true;
      doSubmit(true);
    } else {
      sessionStorage.setItem(
        "lc_tabwarn",
        `⚠️ Violation ${violationCount} of ${MAX_VIOLATIONS}: Switching tabs or windows is not allowed.\n\n${MAX_VIOLATIONS - violationCount} violation(s) remaining before auto-submit.`
      );
    }
  }
  if (!document.hidden && isQuizActive()) {
    const warn = sessionStorage.getItem("lc_tabwarn");
    if (warn) {
      sessionStorage.removeItem("lc_tabwarn");
      showWarningOverlay(warn, violationCount);
    }
  }
});

// 2. Window focus loss (covers Alt+Tab, opening other apps)
window.addEventListener("blur", () => {
  if (!isQuizActive()) return;
  // visibilitychange fires for most cases; blur catches OS-level focus loss
  // Only trigger if visibilitychange didn't already fire
  if (!document.hidden) {
    violationCount++;
    updateViolationDots();
    if (violationCount >= MAX_VIOLATIONS) {
      autoSubmitted = true;
      doSubmit(true);
    } else {
      showWarningOverlay(
        `⚠️ Violation ${violationCount} of ${MAX_VIOLATIONS}: Switching windows is not allowed.\n\n${MAX_VIOLATIONS - violationCount} violation(s) remaining before auto-submit.`,
        violationCount
      );
    }
  }
});

// 3. Block page close/refresh
window.addEventListener("beforeunload", (e) => {
  if (isQuizActive()) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// 4. Disable right-click
document.addEventListener("contextmenu", (e) => {
  if (isQuizActive()) {
    e.preventDefault();
    showToast("Right-click is disabled during the assessment.");
  }
});

// 5. Block keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (!isQuizActive()) return;
  const ctrl = e.ctrlKey || e.metaKey;
  const key  = e.key.toLowerCase();
  if (
    (ctrl && ["t", "n", "w", "r", "u"].includes(key)) ||
    e.key === "F12" || e.key === "F5"
  ) {
    e.preventDefault();
    showToast("Keyboard shortcut blocked during assessment.");
  }
});

function showWarningOverlay(message, count) {
  const overlay  = document.getElementById("warningOverlay");
  const msgEl    = document.getElementById("warningMsg");
  const countEl  = document.getElementById("warningCount");
  msgEl.textContent   = message;
  countEl.textContent = `Violation ${count} of ${MAX_VIOLATIONS}`;
  overlay.style.display = "flex";
}

function dismissWarning() {
  document.getElementById("warningOverlay").style.display = "none";
}

function showToast(msg) {
  let toast = document.getElementById("antiCheatToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "antiCheatToast";
    toast.style.cssText = `
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      background:#dc2626; color:#fff; padding:10px 22px; border-radius:8px;
      font-weight:600; font-size:0.82rem; z-index:9999;
      box-shadow:0 4px 20px rgba(0,0,0,0.3); transition:opacity 0.3s;
      pointer-events:none; font-family:'Inter',sans-serif;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = "🚫 " + msg;
  toast.style.opacity = "1";
  clearTimeout(toast._hide);
  toast._hide = setTimeout(() => { toast.style.opacity = "0"; }, 3000);
}

function updateViolationDots() {
  for (let i = 0; i < 3; i++) {
    const dot = document.getElementById(`vd${i}`);
    if (dot) dot.classList.toggle("active", i < violationCount);
  }
}

// ── Session Storage ───────────────────────────────────────────────────
const SK = {
  state:     "lc_state",
  answers:   "lc_answers",
  candidate: "lc_candidate",
  timer:     "lc_timer",
  questions: "lc_questions",
  idx:       "lc_idx",
  violations:"lc_violations"
};

function saveSession() {
  try {
    sessionStorage.setItem(SK.answers,    JSON.stringify(answers));
    sessionStorage.setItem(SK.candidate,  JSON.stringify(candidateInfo));
    sessionStorage.setItem(SK.timer,      String(timerSecs));
    sessionStorage.setItem(SK.idx,        String(currentIdx));
    sessionStorage.setItem(SK.questions,  JSON.stringify(QUESTIONS));
    sessionStorage.setItem(SK.violations, String(violationCount));
  } catch(e) {}
}

function clearSession() {
  try { Object.values(SK).forEach(k => sessionStorage.removeItem(k)); } catch(e) {}
}

function setSessionState(s) {
  try { sessionStorage.setItem(SK.state, s); } catch(e) {}
}

function loadSession() {
  try {
    const state = sessionStorage.getItem(SK.state);
    if (!state || state === "landing") return false;
    const savedQ = sessionStorage.getItem(SK.questions);
    const savedC = sessionStorage.getItem(SK.candidate);
    if (!savedQ || !savedC) return false;
    QUESTIONS      = JSON.parse(savedQ);
    answers        = JSON.parse(sessionStorage.getItem(SK.answers) || "{}");
    candidateInfo  = JSON.parse(savedC);
    timerSecs      = parseInt(sessionStorage.getItem(SK.timer) || "3600", 10);
    currentIdx     = parseInt(sessionStorage.getItem(SK.idx)   || "0", 10);
    violationCount = parseInt(sessionStorage.getItem(SK.violations) || "0", 10);
    return state;
  } catch(e) { return false; }
}

// ── State ─────────────────────────────────────────────────────────────
let currentIdx    = 0;
let answers       = {};
let timerSecs     = 60 * 60;
let timerHandle   = null;
let candidateInfo = {};

// ── Init ──────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  const restored = loadSession();
  if (restored === "quiz") {
    restoreQuizScreen();
  } else {
    showScreen("screen-landing");
  }
});

function restoreQuizScreen() {
  isQuizRunning = true;
  document.getElementById("sidebarName").textContent  = candidateInfo.name  || "—";
  document.getElementById("sidebarBatch").textContent = candidateInfo.batch || "—";
  updateViolationDots();
  buildQMap();
  showScreen("screen-quiz");
  renderQuestion(currentIdx);
  startTimer();
}

// ── Start Quiz ────────────────────────────────────────────────────────
function startQuiz() {
  const name    = document.getElementById("inName").value.trim();
  const email   = document.getElementById("inEmail").value.trim();
  const batch   = document.getElementById("inBatch").value.trim();
  const role    = document.getElementById("inRole").value;
  const consent = document.getElementById("consentCheck").checked;
  const err     = document.getElementById("errMsg");

  if (!name || !email || !batch || !role) {
    err.textContent = "All fields are required before starting."; return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = "Please enter a valid email address."; return;
  }
  if (!consent) {
    err.textContent = "Please acknowledge the anti-cheat policy to continue."; return;
  }
  err.textContent = "";

  candidateInfo = { name, email, batch, role, startTime: new Date().toISOString() };
  QUESTIONS = buildQuestionSet();

  document.getElementById("sidebarName").textContent  = name;
  document.getElementById("sidebarBatch").textContent = batch;

  isQuizRunning = true;
  buildQMap();
  setSessionState("quiz");
  saveSession();
  showScreen("screen-quiz");
  renderQuestion(0);
  startTimer();
}

// ── Timer ─────────────────────────────────────────────────────────────
function startTimer() {
  updateTimerDisplay();
  timerHandle = setInterval(() => {
    timerSecs--;
    updateTimerDisplay();
    saveSession();
    if (timerSecs <= 0)   { clearInterval(timerHandle); doSubmit(false); }
    if (timerSecs <= 300) { document.getElementById("sidebarTimer").classList.add("urgent"); }
  }, 1000);
}

function updateTimerDisplay() {
  const m = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const s = String(timerSecs % 60).padStart(2, "0");
  document.getElementById("sidebarTimer").textContent = `${m}:${s}`;
}

// ── Question Map ──────────────────────────────────────────────────────
function buildQMap() {
  const map = document.getElementById("qMap");
  map.innerHTML = "";
  QUESTIONS.forEach((q, i) => {
    const d = document.createElement("div");
    d.className = "q-dot";
    d.id = `qdot-${i}`;
    d.innerHTML = `<span>Q${i + 1} — ${q.category.split("—")[0].trim()}</span>`;
    d.onclick = () => goTo(i);
    map.appendChild(d);
  });
}

function updateQMap() {
  QUESTIONS.forEach((_, i) => {
    const d = document.getElementById(`qdot-${i}`);
    if (!d) return;
    d.className = "q-dot" +
      (i === currentIdx ? " current" :
       answers[i] && answers[i].trim() !== "" ? " answered" : "");
  });
}

// ── Navigate ──────────────────────────────────────────────────────────
function goTo(idx) {
  if (idx < 0 || idx >= QUESTIONS.length) return;
  saveCurrentAnswer();
  currentIdx = idx;
  saveSession();
  renderQuestion(idx);
}

function renderQuestion(idx) {
  const q    = QUESTIONS[idx];
  const card = document.getElementById("qcard");

  card.classList.remove("visible");

  setTimeout(() => {
    const badge = document.getElementById("qTypeBadge");
    badge.textContent = q.language;
    badge.className   = "q-type-badge " + (q.badge || "");

    document.getElementById("qNum").textContent     = `Q${idx + 1} / ${QUESTIONS.length}`;
    document.getElementById("qCatTag").textContent  = q.category;
    document.getElementById("reqText").textContent  = q.requirement;
    document.getElementById("qText").textContent    = q.question;
    document.getElementById("editorFile").textContent = q.file || "solution.cls";
    document.getElementById("editorLang").textContent = q.language;
    document.getElementById("hintText").textContent   = "💡 " + (q.hint || "");

    const codeArea = document.getElementById("codeArea");
    codeArea.value       = answers[idx] || "";
    codeArea.placeholder = q.placeholder || "// Write your code here...";

    updateLineNumbers();
    updateCharCount();
    updateAutosave(true);

    document.getElementById("btnPrev").disabled = idx === 0;
    document.getElementById("btnNext").disabled = idx === QUESTIONS.length - 1;

    const answered = Object.values(answers).filter(v => v && v.trim() !== "").length;
    document.getElementById("qProgressText").textContent =
      `${answered} of ${QUESTIONS.length} answered`;

    updateQMap();
    card.classList.add("visible");
    codeArea.focus();
  }, 180);
}

// ── Code Editor ────────────────────────────────────────────────────────
function onCodeInput() {
  answers[currentIdx] = document.getElementById("codeArea").value;
  updateLineNumbers();
  updateCharCount();
  updateAutosave(false);
  updateQMap();
  saveSession();

  const answered = Object.values(answers).filter(v => v && v.trim() !== "").length;
  document.getElementById("qProgressText").textContent =
    `${answered} of ${QUESTIONS.length} answered`;
}

function handleTab(e) {
  if (e.key !== "Tab") return;
  e.preventDefault();
  const ta    = document.getElementById("codeArea");
  const start = ta.selectionStart;
  const end   = ta.selectionEnd;
  ta.value    = ta.value.substring(0, start) + "    " + ta.value.substring(end);
  ta.selectionStart = ta.selectionEnd = start + 4;
  onCodeInput();
}

function updateLineNumbers() {
  const code  = document.getElementById("codeArea").value;
  const lines = code.split("\n").length;
  const nums  = Array.from({length: lines}, (_, i) => i + 1).join("\n");
  document.getElementById("lineNumbers").textContent = nums;
}

function updateCharCount() {
  const len = document.getElementById("codeArea").value.length;
  document.getElementById("charCount").textContent = `${len} chars`;
}

let autosaveTimeout;
function updateAutosave(immediate) {
  const indicator = document.getElementById("autosaveIndicator");
  if (immediate) {
    indicator.textContent = "● Auto-saved";
    indicator.className   = "autosave-indicator";
    return;
  }
  indicator.textContent = "○ Saving...";
  indicator.className   = "autosave-indicator saving";
  clearTimeout(autosaveTimeout);
  autosaveTimeout = setTimeout(() => {
    indicator.textContent = "● Auto-saved";
    indicator.className   = "autosave-indicator";
  }, 800);
}

function clearCode() {
  if (!confirm("Clear all code in this editor? This cannot be undone.")) return;
  document.getElementById("codeArea").value = "";
  onCodeInput();
}

function saveCurrentAnswer() {
  answers[currentIdx] = document.getElementById("codeArea").value;
}

// ── Final Submit ───────────────────────────────────────────────────────
function finalSubmit() {
  saveCurrentAnswer();
  const answered   = Object.values(answers).filter(v => v && v.trim() !== "").length;
  const unanswered = QUESTIONS.length - answered;
  if (unanswered > 0) {
    if (!confirm(`You have ${unanswered} unanswered question(s).\n\nSubmit anyway?`)) return;
  }
  doSubmit(false);
}

function doSubmit(wasAuto) {
  clearInterval(timerHandle);
  isQuizRunning = false;

  const timeTaken = 60 * 60 - timerSecs;
  const timeStr   = `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`;
  const answered  = Object.values(answers).filter(v => v && v.trim() !== "").length;

  setSessionState("result");
  saveSession();

  showResultScreen(timeStr, answered, wasAuto);
  sendToSheets(timeStr, answered, wasAuto);
}

// ── Result Screen ──────────────────────────────────────────────────────
function showResultScreen(timeStr, answered, wasAuto) {
  showScreen("screen-result");

  document.getElementById("rName").textContent      = candidateInfo.name  || "—";
  document.getElementById("rBatch").textContent     = candidateInfo.batch || "—";
  document.getElementById("rAnswered").textContent  = `${answered} / ${QUESTIONS.length}`;
  document.getElementById("rTime").textContent      = timeStr;
  document.getElementById("rViolations").textContent= `${violationCount} / ${MAX_VIOLATIONS}`;
  document.getElementById("rSubmitType").textContent= wasAuto ? "Auto-submitted" : "Manual submit";

  const banner = document.getElementById("resultBanner");
  if (wasAuto) {
    banner.textContent = "⚠️ Auto-submitted — Maximum tab violations reached";
    banner.className   = "result-status-banner auto";
  } else {
    banner.textContent = "✓ Assessment Submitted Successfully";
    banner.className   = "result-status-banner";
  }

  // Per-question summary
  const summary = document.getElementById("resultSummary");
  summary.innerHTML = QUESTIONS.map((q, i) => {
    const done = answers[i] && answers[i].trim() !== "";
    return `<div class="rs-q-row">
      <span class="rs-q-num">Q${i + 1}</span>
      <span class="rs-q-cat">${q.category}</span>
      <span class="rs-q-status ${done ? "rs-q-done" : "rs-q-skip"}">${done ? "✓ Answered" : "Skipped"}</span>
    </div>`;
  }).join("");
}

// ── Send to Google Sheets ──────────────────────────────────────────────
async function sendToSheets(timeStr, answered, wasAuto) {
  const line2 = document.getElementById("submitLine2");
  const line3 = document.getElementById("submitLine3");

  // Build per-question columns
  const qData = {};
  QUESTIONS.forEach((q, i) => {
    const prefix = `Q${String(i + 1).padStart(2, "0")}`;
    qData[`${prefix}_Category`]    = q.category;
    qData[`${prefix}_Language`]    = q.language;
    qData[`${prefix}_Requirement`] = q.requirement;
    qData[`${prefix}_Question`]    = q.question;
    qData[`${prefix}_Code`]        = answers[i] || "(No answer)";
  });

  const payload = {
    timestamp:       new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    name:            candidateInfo.name,
    email:           candidateInfo.email,
    batch:           candidateInfo.batch,
    role:            candidateInfo.role,
    questions_answered: `${answered} / ${QUESTIONS.length}`,
    time_taken:      timeStr,
    tab_violations:  `${violationCount}`,
    submit_type:     wasAuto ? "Auto-submitted" : "Manual",
    ...qData
  };

  if (!SCRIPT_URL || SCRIPT_URL.includes("YOUR_GOOGLE")) {
    line2.innerHTML = `Sending to Google Sheets... <span class="sub-ok">[DEMO MODE — set SCRIPT_URL in quiz.js]</span>`;
    return;
  }

  try {
    await fetch(SCRIPT_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    line2.innerHTML = `Sending to Google Sheets... <span class="sub-ok">[OK]</span>`;
    line3.style.display = "block";
    line3.innerHTML = `<span class="sub-ok">Results successfully saved to Google Sheets.</span>`;
  } catch (err) {
    line2.innerHTML = `Sending to Google Sheets... <span class="sub-err">[FAILED]</span>`;
    line3.style.display = "block";
    line3.innerHTML = `<span class="sub-err">${err.message}</span>`;
  }
}

// ── Screen Switch ──────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

// ── Restart ────────────────────────────────────────────────────────────
function retryQuiz() {
  clearInterval(timerHandle);
  isQuizRunning  = false;
  autoSubmitted  = false;
  currentIdx     = 0;
  answers        = {};
  timerSecs      = 60 * 60;
  candidateInfo  = {};
  QUESTIONS      = [];
  violationCount = 0;
  clearSession();

  const timer = document.getElementById("sidebarTimer");
  if (timer) { timer.classList.remove("urgent"); timer.textContent = "60:00"; }
  updateViolationDots();

  const l2 = document.getElementById("submitLine2");
  const l3 = document.getElementById("submitLine3");
  if (l2) l2.innerHTML = `Sending to Google Sheets... <span class="sub-spin">●</span>`;
  if (l3) { l3.style.display = "none"; l3.innerHTML = ""; }

  showScreen("screen-landing");
}
