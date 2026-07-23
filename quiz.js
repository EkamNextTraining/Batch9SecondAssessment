// =====================================================================
//  SF ADMIN SCENARIO QUIZ — Core Logic
//  Paste your Google Apps Script Web App URL below
// =====================================================================

const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

// ── Config ────────────────────────────────────────────────────────────
const TOTAL_Q       = 40;   // 20 scenario + 20 MCQ
const SCENARIO_END  = 20;   // Q index 0–19 = scenario, 20–39 = MCQ
const TIMER_MINS    = 60;
const MAX_VIOLATIONS = 3;

// ── State ─────────────────────────────────────────────────────────────
let currentIdx     = 0;
let answers        = {};   // key = question index, value = string (desc) or Integer (MCQ)
let timerSecs      = TIMER_MINS * 60;
let timerHandle    = null;
let candidateInfo  = {};
let violationCount = 0;
let isQuizRunning  = false;

// ══════════════════════════════════════════════════════════════════════
//  ANTI-CHEAT
// ══════════════════════════════════════════════════════════════════════

function isQuizActive() {
  return isQuizRunning && document.getElementById("screen-quiz").classList.contains("active");
}

// 1 — Tab switch
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isQuizActive()) {
    violationCount++;
    updateViolationUI();
    if (violationCount >= MAX_VIOLATIONS) {
      doSubmit(true);
    } else {
      sessionStorage.setItem("admin_tabwarn",
        `⚠️ Violation ${violationCount} of ${MAX_VIOLATIONS}: Switching tabs is not allowed.\n\n${MAX_VIOLATIONS - violationCount} violation(s) remaining before auto-submit.`);
    }
  }
  if (!document.hidden && isQuizActive()) {
    const w = sessionStorage.getItem("admin_tabwarn");
    if (w) { sessionStorage.removeItem("admin_tabwarn"); showWarning(w, violationCount); }
  }
});

// 2 — Window blur (Alt+Tab, other apps)
window.addEventListener("blur", () => {
  if (!isQuizActive() || document.hidden) return;
  violationCount++;
  updateViolationUI();
  if (violationCount >= MAX_VIOLATIONS) {
    doSubmit(true);
  } else {
    showWarning(
      `⚠️ Violation ${violationCount} of ${MAX_VIOLATIONS}: Switching windows is not allowed.\n\n${MAX_VIOLATIONS - violationCount} violation(s) remaining before auto-submit.`,
      violationCount
    );
  }
});

// 3 — Block page leave
window.addEventListener("beforeunload", e => {
  if (isQuizActive()) { e.preventDefault(); e.returnValue = ""; }
});

// 4 — Block right-click
document.addEventListener("contextmenu", e => {
  if (isQuizActive()) { e.preventDefault(); showToast("Right-click is disabled during the assessment."); }
});

// 5 — Block keyboard shortcuts
document.addEventListener("keydown", e => {
  if (!isQuizActive()) return;
  const ctrl = e.ctrlKey || e.metaKey;
  const k    = e.key.toLowerCase();
  if ((ctrl && ["t","n","w","r","u"].includes(k)) || e.key === "F12" || e.key === "F5") {
    e.preventDefault();
    showToast("Keyboard shortcut blocked during assessment.");
  }
});

function showWarning(msg, count) {
  document.getElementById("warningMsg").textContent   = msg;
  document.getElementById("warningCount").textContent = `Violation ${count} of ${MAX_VIOLATIONS}`;
  document.getElementById("warningOverlay").style.display = "flex";
}
function dismissWarning() {
  document.getElementById("warningOverlay").style.display = "none";
}
function showToast(msg) {
  let t = document.getElementById("acToast");
  if (!t) {
    t = document.createElement("div"); t.id = "acToast";
    t.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#dc2626;color:#fff;padding:9px 20px;border-radius:8px;font-weight:600;font-size:.8rem;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.3);transition:opacity .3s;pointer-events:none;font-family:Inter,sans-serif;";
    document.body.appendChild(t);
  }
  t.textContent = "🚫 " + msg; t.style.opacity = "1";
  clearTimeout(t._h); t._h = setTimeout(() => t.style.opacity = "0", 3000);
}
function updateViolationUI() {
  for (let i = 0; i < 3; i++) {
    const d = document.getElementById(`vd${i}`);
    if (d) d.classList.toggle("active", i < violationCount);
  }
}

// ══════════════════════════════════════════════════════════════════════
//  SESSION PERSISTENCE
// ══════════════════════════════════════════════════════════════════════
const SK = {
  state:"aq_state", answers:"aq_answers", candidate:"aq_candidate",
  timer:"aq_timer", idx:"aq_idx", violations:"aq_violations"
};

function saveSession() {
  try {
    sessionStorage.setItem(SK.state,      "quiz");
    sessionStorage.setItem(SK.answers,    JSON.stringify(answers));
    sessionStorage.setItem(SK.candidate,  JSON.stringify(candidateInfo));
    sessionStorage.setItem(SK.timer,      String(timerSecs));
    sessionStorage.setItem(SK.idx,        String(currentIdx));
    sessionStorage.setItem(SK.violations, String(violationCount));
  } catch(e) {}
}
function clearSession() {
  try { Object.values(SK).forEach(k => sessionStorage.removeItem(k)); } catch(e) {}
}
function loadSession() {
  try {
    if (sessionStorage.getItem(SK.state) !== "quiz") return false;
    const c = sessionStorage.getItem(SK.candidate);
    if (!c) return false;
    candidateInfo  = JSON.parse(c);
    answers        = JSON.parse(sessionStorage.getItem(SK.answers) || "{}");
    timerSecs      = parseInt(sessionStorage.getItem(SK.timer)      || String(TIMER_MINS*60), 10);
    currentIdx     = parseInt(sessionStorage.getItem(SK.idx)        || "0", 10);
    violationCount = parseInt(sessionStorage.getItem(SK.violations)  || "0", 10);
    return true;
  } catch(e) { return false; }
}

// ══════════════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════════════
window.addEventListener("DOMContentLoaded", () => {
  if (loadSession()) {
    isQuizRunning = true;
    document.getElementById("sidebarName").textContent  = candidateInfo.name  || "—";
    document.getElementById("sidebarBatch").textContent = candidateInfo.batch || "—";
    updateViolationUI();
    buildQMaps();
    showScreen("screen-quiz");
    renderQuestion(currentIdx);
    startTimer();
  } else {
    showScreen("screen-landing");
  }
});

// ══════════════════════════════════════════════════════════════════════
//  START QUIZ
// ══════════════════════════════════════════════════════════════════════
function startQuiz() {
  const name    = document.getElementById("inName").value.trim();
  const email   = document.getElementById("inEmail").value.trim();
  const batch   = document.getElementById("inBatch").value.trim();
  const role    = document.getElementById("inRole").value;
  const consent = document.getElementById("consentCheck").checked;
  const err     = document.getElementById("errMsg");

  if (!name || !email || !batch || !role) {
    err.textContent = "Please fill in all fields before starting."; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = "Please enter a valid email address."; return; }
  if (!consent) {
    err.textContent = "Please acknowledge the monitoring policy to continue."; return; }
  err.textContent = "";

  candidateInfo = { name, email, batch, role, startTime: new Date().toISOString() };
  document.getElementById("sidebarName").textContent  = name;
  document.getElementById("sidebarBatch").textContent = batch;
  isQuizRunning = true;

  buildQMaps();
  saveSession();
  showScreen("screen-quiz");
  renderQuestion(0);
  startTimer();
}

// ══════════════════════════════════════════════════════════════════════
//  TIMER
// ══════════════════════════════════════════════════════════════════════
function startTimer() {
  tickTimer();
  timerHandle = setInterval(() => {
    timerSecs--;
    tickTimer();
    saveSession();
    if (timerSecs <= 0)   { clearInterval(timerHandle); doSubmit(false); }
    if (timerSecs <= 300) { document.getElementById("sidebarTimer").classList.add("urgent"); }
  }, 1000);
}
function tickTimer() {
  const m = String(Math.floor(timerSecs / 60)).padStart(2,"0");
  const s = String(timerSecs % 60).padStart(2,"0");
  document.getElementById("sidebarTimer").textContent = `${m}:${s}`;
}

// ══════════════════════════════════════════════════════════════════════
//  QUESTION MAPS  (two separate grids in sidebar)
// ══════════════════════════════════════════════════════════════════════
function buildQMaps() {
  buildMap("qMap1", 0, SCENARIO_END);          // Q1–Q20 scenario
  buildMap("qMap2", SCENARIO_END, TOTAL_Q);    // Q21–Q40 MCQ
}
function buildMap(containerId, from, to) {
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  for (let i = from; i < to; i++) {
    const d = document.createElement("div");
    d.className  = "q-dot";
    d.id         = `qdot-${i}`;
    d.textContent = i + 1;
    d.onclick    = () => goTo(i);
    el.appendChild(d);
  }
}
function updateQMap() {
  for (let i = 0; i < TOTAL_Q; i++) {
    const d = document.getElementById(`qdot-${i}`);
    if (!d) continue;
    const answered = answers[i] !== undefined && answers[i] !== "";
    d.className = "q-dot" + (i === currentIdx ? " current" : answered ? " answered" : "");
  }
}

// ══════════════════════════════════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════════════════════════════════
function goTo(idx) {
  if (idx < 0 || idx >= TOTAL_Q) return;
  saveCurrentAnswer();
  currentIdx = idx;
  saveSession();
  renderQuestion(idx);
}

// ══════════════════════════════════════════════════════════════════════
//  RENDER QUESTION
// ══════════════════════════════════════════════════════════════════════
function renderQuestion(idx) {
  const q    = QUESTIONS[idx];
  const card = document.getElementById("qcard");
  card.classList.remove("visible");

  setTimeout(() => {
    const isScenario = q.type === "scenario";
    const isMcq      = q.type === "mcq";

    // Part banner
    const banner = document.getElementById("partBanner");
    banner.textContent = q.part;
    banner.className   = "part-banner" + (isMcq ? " part2" : "");

    // Badge & meta
    const badge = document.getElementById("qTypeBadge");
    badge.textContent = isMcq ? "MCQ" : "Scenario";
    badge.className   = "q-type-badge" + (isMcq ? " mcq" : "");

    document.getElementById("qNum").textContent    = `Q${idx + 1} / ${TOTAL_Q}`;
    document.getElementById("qCatTag").textContent = q.category;

    // Scenario box
    const sBox   = document.getElementById("scenarioBox");
    const sLabel = document.getElementById("scenarioLabel");
    const sIcon  = document.getElementById("scenarioIcon");
    document.getElementById("scenarioText").textContent = q.scenario;
    sBox.className   = "scenario-box" + (isMcq ? " mcq-scenario" : "");
    sLabel.textContent = isMcq ? "CONTEXT" : "SCENARIO";
    sIcon.textContent  = isMcq ? "📌" : "🏢";

    // Question text
    document.getElementById("qText").textContent = q.question;

    // Show/hide answer areas
    const descArea = document.getElementById("descArea");
    const mcqArea  = document.getElementById("mcqArea");

    if (isScenario) {
      descArea.style.display = "block";
      mcqArea.style.display  = "none";
      const ta = document.getElementById("descText");
      ta.value = answers[idx] || "";
      updateCharCount(ta.value.length);
      setTimeout(() => ta.focus(), 250);
    } else {
      descArea.style.display = "none";
      mcqArea.style.display  = "block";
      buildMCQOptions(q, idx);
    }

    // Nav buttons
    document.getElementById("btnPrev").disabled = idx === 0;
    document.getElementById("btnNext").disabled = idx === TOTAL_Q - 1;

    // Progress
    const answered = Object.keys(answers).filter(k => {
      const v = answers[k];
      return v !== undefined && v !== "" && v !== null;
    }).length;
    document.getElementById("qProgressText").textContent = `${answered} of ${TOTAL_Q} answered`;

    updateQMap();
    card.classList.add("visible");
  }, 180);
}

// ── Build MCQ Options ─────────────────────────────────────────────────
function buildMCQOptions(q, idx) {
  const container = document.getElementById("mcqOptions");
  container.innerHTML = "";
  const saved = answers[idx];
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "mcq-opt" + (saved === i ? " selected" : "");
    btn.innerHTML = `<span class="opt-key">${["A","B","C","D"][i]}</span><span>${opt}</span>`;
    btn.onclick = () => selectMCQ(idx, i);
    container.appendChild(btn);
  });
}

// ── MCQ Selection ─────────────────────────────────────────────────────
function selectMCQ(qIdx, optIdx) {
  answers[qIdx] = optIdx;
  document.querySelectorAll(".mcq-opt").forEach((b, i) => {
    b.classList.toggle("selected", i === optIdx);
  });
  updateQMap();
  saveSession();
  const answered = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== "").length;
  document.getElementById("qProgressText").textContent = `${answered} of ${TOTAL_Q} answered`;
}

// ── Descriptive Auto-save ─────────────────────────────────────────────
function autoSaveDesc() {
  const ta = document.getElementById("descText");
  answers[currentIdx] = ta.value;
  updateCharCount(ta.value.length);
  updateQMap();
  saveSession();
  const answered = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== "").length;
  document.getElementById("qProgressText").textContent = `${answered} of ${TOTAL_Q} answered`;
}
function updateCharCount(n) {
  const el = document.getElementById("charCount");
  if (el) el.textContent = `${n} chars`;
}

// ── Save current answer before navigating ────────────────────────────
function saveCurrentAnswer() {
  if (QUESTIONS[currentIdx].type === "scenario") {
    const ta = document.getElementById("descText");
    if (ta) answers[currentIdx] = ta.value;
  }
}

// ══════════════════════════════════════════════════════════════════════
//  SUBMIT
// ══════════════════════════════════════════════════════════════════════
function finalSubmit() {
  saveCurrentAnswer();
  const answered   = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== "").length;
  const unanswered = TOTAL_Q - answered;
  if (unanswered > 0 && !confirm(`You have ${unanswered} unanswered question(s).\n\nSubmit anyway?`)) return;
  doSubmit(false);
}

function doSubmit(wasAuto) {
  clearInterval(timerHandle);
  isQuizRunning = false;
  saveCurrentAnswer();

  const taken   = TIMER_MINS * 60 - timerSecs;
  const timeStr = `${Math.floor(taken / 60)}m ${taken % 60}s`;

  // Calculate MCQ score
  let mcqScore = 0;
  for (let i = SCENARIO_END; i < TOTAL_Q; i++) {
    if (answers[i] === QUESTIONS[i].answer) mcqScore++;
  }
  const scenarioAnswered = Object.keys(answers)
    .filter(k => parseInt(k) < SCENARIO_END && answers[k] && answers[k].trim() !== "").length;

  clearSession();
  showResultScreen(timeStr, mcqScore, scenarioAnswered, wasAuto);
  sendToSheets(timeStr, mcqScore, scenarioAnswered, wasAuto);
}

// ══════════════════════════════════════════════════════════════════════
//  RESULT SCREEN
// ══════════════════════════════════════════════════════════════════════
function showResultScreen(timeStr, mcqScore, scenarioAnswered, wasAuto) {
  showScreen("screen-result");
  document.getElementById("rName").textContent      = candidateInfo.name  || "—";
  document.getElementById("rBatch").textContent     = candidateInfo.batch || "—";
  document.getElementById("rMcq").textContent       = `${mcqScore} / 20`;
  document.getElementById("rScenario").textContent  = `${scenarioAnswered} / 20`;
  document.getElementById("rTime").textContent      = timeStr;
  document.getElementById("rViolations").textContent= `${violationCount} / ${MAX_VIOLATIONS}`;

  const banner = document.getElementById("resultBanner");
  if (wasAuto) {
    banner.textContent = "⚠️ Auto-submitted — Maximum tab violations reached";
    banner.className   = "result-status-banner auto";
  } else {
    banner.textContent = "✓ Assessment Submitted Successfully";
    banner.className   = "result-status-banner";
  }

  // MCQ breakdown
  const review = document.getElementById("mcqReview");
  const mcqRows = [];
  for (let i = SCENARIO_END; i < TOTAL_Q; i++) {
    const q       = QUESTIONS[i];
    const correct = answers[i] === q.answer;
    const selected = answers[i] !== undefined
      ? `${["A","B","C","D"][answers[i]]}. ${q.options[answers[i]]}`
      : "Not answered";
    mcqRows.push(`<div class="mcq-row">
      <span class="mcq-row-num">Q${i+1}</span>
      <span class="mcq-row-cat">${q.category}</span>
      <span class="mcq-row-result ${correct ? "mcq-correct" : "mcq-wrong"}">${correct ? "✓ Correct" : "✗ Wrong"}</span>
    </div>`);
  }
  review.innerHTML = `<p class="mcq-review-title">MCQ Results</p>` + mcqRows.join("");
}

// ══════════════════════════════════════════════════════════════════════
//  GOOGLE SHEETS
// ══════════════════════════════════════════════════════════════════════
async function sendToSheets(timeStr, mcqScore, scenarioAnswered, wasAuto) {
  const line2 = document.getElementById("submitLine2");
  const line3 = document.getElementById("submitLine3");

  // Build scenario columns
  const scenarioCols = {};
  for (let i = 0; i < SCENARIO_END; i++) {
    const q = QUESTIONS[i];
    const prefix = `Q${String(i+1).padStart(2,"0")}_Scenario`;
    scenarioCols[`${prefix}_Category`] = q.category;
    scenarioCols[`${prefix}_Scenario`] = q.scenario;
    scenarioCols[`${prefix}_Question`] = q.question;
    scenarioCols[`${prefix}_Answer`]   = answers[i] || "(No answer)";
  }

  // Build MCQ columns
  const mcqCols = {};
  for (let i = SCENARIO_END; i < TOTAL_Q; i++) {
    const q        = QUESTIONS[i];
    const num      = i - SCENARIO_END + 1;
    const prefix   = `Q${String(num).padStart(2,"0")}_MCQ`;
    const selIdx   = answers[i];
    const selected = selIdx !== undefined ? `${["A","B","C","D"][selIdx]}. ${q.options[selIdx]}` : "Not answered";
    const correct  = `${["A","B","C","D"][q.answer]}. ${q.options[q.answer]}`;
    mcqCols[`${prefix}_Category`] = q.category;
    mcqCols[`${prefix}_Scenario`] = q.scenario;
    mcqCols[`${prefix}_Question`] = q.question;
    mcqCols[`${prefix}_Selected`] = selected;
    mcqCols[`${prefix}_Correct`]  = correct;
    mcqCols[`${prefix}_Result`]   = answers[i] === q.answer ? "✓ Correct" : "✗ Wrong";
  }

  const payload = {
    timestamp:           new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    name:                candidateInfo.name,
    email:               candidateInfo.email,
    batch:               candidateInfo.batch,
    role:                candidateInfo.role,
    mcq_score:           `${mcqScore} / 20`,
    scenario_answered:   `${scenarioAnswered} / 20`,
    time_taken:          timeStr,
    tab_violations:      String(violationCount),
    submit_type:         wasAuto ? "Auto-submitted" : "Manual",
    ...scenarioCols,
    ...mcqCols
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
    line3.innerHTML = `<span class="sub-ok">All 40 responses saved to Google Sheets.</span>`;
  } catch(err) {
    line2.innerHTML = `Sending to Google Sheets... <span class="sub-err">[FAILED — ${err.message}]</span>`;
  }
}

// ══════════════════════════════════════════════════════════════════════
//  UTILS
// ══════════════════════════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

function retryQuiz() {
  clearInterval(timerHandle);
  isQuizRunning  = false;
  currentIdx     = 0;
  answers        = {};
  timerSecs      = TIMER_MINS * 60;
  candidateInfo  = {};
  violationCount = 0;
  clearSession();
  const t = document.getElementById("sidebarTimer");
  if (t) { t.classList.remove("urgent"); t.textContent = `${TIMER_MINS}:00`; }
  updateViolationUI();
  showScreen("screen-landing");
}
