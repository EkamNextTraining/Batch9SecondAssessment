// =====================================================================
//  SF ADMIN ASSESSMENT — Core Logic
//  20 Scenario + 20 MCQ + 5 Live Coding = 45 questions
//  Paste your Google Apps Script Web App URL below
// =====================================================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzO3ke5mh-sCyBfs3qBxIwUiS3dvdeuASKlbPydvQyAdhWftk_aYyE18_XLtH-ne7xi/exec";

// ── Config ─────────────────────────────────────────────────────────
const TOTAL_Q        = 45;
const SCENARIO_START = 0;
const SCENARIO_END   = 20;   // Q index 0–19
const MCQ_START      = 20;
const MCQ_END        = 40;   // Q index 20–39
const CODING_START   = 40;
const CODING_END     = 45;   // Q index 40–44
const TIMER_MINS     = 60;
const MAX_VIOLATIONS = 3;

// ── State ───────────────────────────────────────────────────────────
let currentIdx     = 0;
let answers        = {};
let timerSecs      = TIMER_MINS * 60;
let timerHandle    = null;
let candidateInfo  = {};
let violationCount = 0;
let isQuizRunning  = false;
let autosaveTimer  = null;

// ══════════════════════════════════════════════════════════════════
//  ANTI-CHEAT
// ══════════════════════════════════════════════════════════════════
function isQuizActive() {
  return isQuizRunning && document.getElementById("screen-quiz").classList.contains("active");
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && isQuizActive()) {
    handleViolation("Switching tabs is not allowed.");
  }
  if (!document.hidden && isQuizActive()) {
    const w = sessionStorage.getItem("admin_tabwarn");
    if (w) { sessionStorage.removeItem("admin_tabwarn"); showWarning(w, violationCount); }
  }
});

window.addEventListener("blur", () => {
  if (!isQuizActive() || document.hidden) return;
  handleViolation("Switching windows is not allowed.");
});

function handleViolation(reason) {
  violationCount++;
  updateViolationUI();
  if (violationCount >= MAX_VIOLATIONS) {
    doSubmit(true);
  } else {
    const msg = `⚠️ Violation ${violationCount} of ${MAX_VIOLATIONS}: ${reason}\n\n${MAX_VIOLATIONS - violationCount} violation(s) remaining before auto-submit.`;
    if (document.hidden) {
      sessionStorage.setItem("admin_tabwarn", msg);
    } else {
      showWarning(msg, violationCount);
    }
  }
}

window.addEventListener("beforeunload", e => {
  if (isQuizActive()) { e.preventDefault(); e.returnValue = ""; }
});

document.addEventListener("contextmenu", e => {
  if (isQuizActive()) { e.preventDefault(); showToast("Right-click is disabled during the assessment."); }
});

document.addEventListener("keydown", e => {
  if (!isQuizActive()) return;
  const ctrl = e.ctrlKey || e.metaKey;
  const k    = e.key.toLowerCase();
  if ((ctrl && ["t","n","w","r","u"].includes(k)) || e.key === "F12" || e.key === "F5") {
    e.preventDefault(); showToast("Keyboard shortcut blocked during assessment.");
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

// ══════════════════════════════════════════════════════════════════
//  SESSION PERSISTENCE
// ══════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════
//  START QUIZ
// ══════════════════════════════════════════════════════════════════
function startQuiz() {
  const name    = document.getElementById("inName").value.trim();
  const email   = document.getElementById("inEmail").value.trim();
  const batch   = document.getElementById("inBatch").value.trim();
  const role    = document.getElementById("inRole").value;
  const consent = document.getElementById("consentCheck").checked;
  const err     = document.getElementById("errMsg");

  if (!name || !email || !batch || !role) { err.textContent = "Please fill in all fields."; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Enter a valid email."; return; }
  if (!consent) { err.textContent = "Please acknowledge the monitoring policy."; return; }
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

// ══════════════════════════════════════════════════════════════════
//  TIMER
// ══════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════
//  QUESTION MAPS
// ══════════════════════════════════════════════════════════════════
function buildQMaps() {
  buildMap("qMap1", SCENARIO_START, SCENARIO_END);
  buildMap("qMap2", MCQ_START,      MCQ_END);
  buildMap("qMap3", CODING_START,   CODING_END);
}
function buildMap(id, from, to) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  for (let i = from; i < to; i++) {
    const d = document.createElement("div");
    d.className   = "q-dot";
    d.id          = `qdot-${i}`;
    d.textContent = i + 1;
    d.onclick     = () => goTo(i);
    el.appendChild(d);
  }
}
function updateQMap() {
  for (let i = 0; i < TOTAL_Q; i++) {
    const d = document.getElementById(`qdot-${i}`);
    if (!d) continue;
    const val      = answers[i];
    const answered = val !== undefined && val !== "" && val !== null;
    d.className = "q-dot" + (i === currentIdx ? " current" : answered ? " answered" : "");
  }
}

// ══════════════════════════════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════════════════════════════
function goTo(idx) {
  if (idx < 0 || idx >= TOTAL_Q) return;
  saveCurrentAnswer();
  currentIdx = idx;
  saveSession();
  renderQuestion(idx);
}

// ══════════════════════════════════════════════════════════════════
//  RENDER QUESTION
// ══════════════════════════════════════════════════════════════════
function renderQuestion(idx) {
  const q    = QUESTIONS[idx];
  const card = document.getElementById("qcard");
  card.classList.remove("visible");

  setTimeout(() => {
    const isScenario = q.type === "scenario";
    const isMcq      = q.type === "mcq";
    const isCoding   = q.type === "coding";

    // Part banner
    const banner = document.getElementById("partBanner");
    banner.textContent = q.part;
    banner.className = "part-banner" + (isMcq ? " part2" : isCoding ? " part3" : "");

    // Badge
    const badge = document.getElementById("qTypeBadge");
    if (isScenario) { badge.textContent = "Scenario"; badge.className = "q-type-badge"; }
    if (isMcq)      { badge.textContent = "MCQ";      badge.className = "q-type-badge mcq"; }
    if (isCoding)   { badge.textContent = q.language || "Apex"; badge.className = "q-type-badge coding"; }

    document.getElementById("qNum").textContent    = `Q${idx + 1} / ${TOTAL_Q}`;
    document.getElementById("qCatTag").textContent = q.category;

    // Scenario / context box
    const sBox   = document.getElementById("scenarioBox");
    const sLabel = document.getElementById("scenarioLabel");
    const sIcon  = document.getElementById("scenarioIcon");
    document.getElementById("scenarioText").textContent = q.scenario;
    if (isScenario) { sBox.className="scenario-box"; sLabel.textContent="SCENARIO"; sIcon.textContent="🏢"; }
    if (isMcq)      { sBox.className="scenario-box mcq-scenario"; sLabel.textContent="CONTEXT"; sIcon.textContent="📌"; }
    if (isCoding)   { sBox.className="scenario-box coding-scenario"; sLabel.textContent="REQUIREMENT"; sIcon.textContent="💻"; }

    document.getElementById("qText").textContent = q.question;

    // Hide all answer areas then show the right one
    document.getElementById("mcqArea").style.display  = "none";
    document.getElementById("descArea").style.display = "none";
    document.getElementById("codeArea").style.display = "none";

    if (isScenario) {
      document.getElementById("descArea").style.display = "block";
      const ta = document.getElementById("descText");
      ta.value = answers[idx] || "";
      updateCharCount(ta.value.length);
      setTimeout(() => ta.focus(), 250);
    }
    if (isMcq) {
      document.getElementById("mcqArea").style.display = "block";
      buildMCQOptions(q, idx);
    }
    if (isCoding) {
      document.getElementById("codeArea").style.display = "block";
      document.getElementById("editorFile").textContent = q.file || "solution.cls";
      document.getElementById("editorLang").textContent = q.language || "Apex";
      document.getElementById("hintText").textContent   = "💡 " + (q.hint || "");
      const ce = document.getElementById("codeEditor");
      ce.value       = answers[idx] || "";
      ce.placeholder = q.placeholder || "// Write your code here...";
      updateLineNumbers();
      updateCodeCharCount();
      setAutosaveIndicator(true);
      setTimeout(() => ce.focus(), 250);
    }

    // Nav
    document.getElementById("btnPrev").disabled = idx === 0;
    document.getElementById("btnNext").disabled = idx === TOTAL_Q - 1;
    updateProgressText();
    updateQMap();
    card.classList.add("visible");
  }, 180);
}

// ══════════════════════════════════════════════════════════════════
//  MCQ
// ══════════════════════════════════════════════════════════════════
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
function selectMCQ(qIdx, optIdx) {
  answers[qIdx] = optIdx;
  document.querySelectorAll(".mcq-opt").forEach((b, i) => b.classList.toggle("selected", i === optIdx));
  updateQMap();
  updateProgressText();
  saveSession();
}

// ══════════════════════════════════════════════════════════════════
//  DESCRIPTIVE
// ══════════════════════════════════════════════════════════════════
function autoSaveDesc() {
  const ta = document.getElementById("descText");
  answers[currentIdx] = ta.value;
  updateCharCount(ta.value.length);
  updateQMap();
  updateProgressText();
  saveSession();
}
function updateCharCount(n) {
  const el = document.getElementById("charCount");
  if (el) el.textContent = `${n} chars`;
}

// ══════════════════════════════════════════════════════════════════
//  CODE EDITOR
// ══════════════════════════════════════════════════════════════════
function onCodeInput() {
  const ce = document.getElementById("codeEditor");
  answers[currentIdx] = ce.value;
  updateLineNumbers();
  updateCodeCharCount();
  setAutosaveIndicator(false);
  updateQMap();
  updateProgressText();
  saveSession();
}
function handleTab(e) {
  if (e.key !== "Tab") return;
  e.preventDefault();
  const ce    = document.getElementById("codeEditor");
  const start = ce.selectionStart;
  const end   = ce.selectionEnd;
  ce.value    = ce.value.substring(0, start) + "    " + ce.value.substring(end);
  ce.selectionStart = ce.selectionEnd = start + 4;
  onCodeInput();
}
function updateLineNumbers() {
  const ce    = document.getElementById("codeEditor");
  const lines = (ce.value.match(/\n/g) || []).length + 1;
  document.getElementById("lineNumbers").textContent = Array.from({length: lines}, (_, i) => i + 1).join("\n");
}
function updateCodeCharCount() {
  const ce = document.getElementById("codeEditor");
  const el = document.getElementById("codeCharCount");
  if (ce && el) el.textContent = `${ce.value.length} chars`;
}
function setAutosaveIndicator(saved) {
  const el = document.getElementById("autosaveInd");
  if (!el) return;
  if (saved) { el.textContent = "● Saved"; el.className = "autosave-ind"; return; }
  el.textContent = "○ Saving..."; el.className = "autosave-ind saving";
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    el.textContent = "● Saved"; el.className = "autosave-ind";
  }, 800);
}
function clearCode() {
  if (!confirm("Clear all code? This cannot be undone.")) return;
  const ce = document.getElementById("codeEditor");
  ce.value = "";
  onCodeInput();
}

// ══════════════════════════════════════════════════════════════════
//  SHARED UTILS
// ══════════════════════════════════════════════════════════════════
function saveCurrentAnswer() {
  const q = QUESTIONS[currentIdx];
  if (q.type === "scenario") {
    const ta = document.getElementById("descText");
    if (ta) answers[currentIdx] = ta.value;
  }
  if (q.type === "coding") {
    const ce = document.getElementById("codeEditor");
    if (ce) answers[currentIdx] = ce.value;
  }
}
function updateProgressText() {
  const answered = Object.keys(answers).filter(k => {
    const v = answers[k];
    return v !== undefined && v !== "" && v !== null;
  }).length;
  document.getElementById("qProgressText").textContent = `${answered} of ${TOTAL_Q} answered`;
}

// ══════════════════════════════════════════════════════════════════
//  SUBMIT
// ══════════════════════════════════════════════════════════════════
function finalSubmit() {
  saveCurrentAnswer();
  const answered   = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== "" && answers[k] !== null).length;
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

  // MCQ score
  let mcqScore = 0;
  for (let i = MCQ_START; i < MCQ_END; i++) {
    if (answers[i] === QUESTIONS[i].answer) mcqScore++;
  }
  // Counts
  const scenAnswered = Object.keys(answers)
    .filter(k => parseInt(k) >= SCENARIO_START && parseInt(k) < SCENARIO_END && answers[k] && answers[k].trim() !== "").length;
  const codeAnswered = Object.keys(answers)
    .filter(k => parseInt(k) >= CODING_START && parseInt(k) < CODING_END && answers[k] && answers[k].trim() !== "").length;

  clearSession();
  showResultScreen(timeStr, mcqScore, scenAnswered, codeAnswered, wasAuto);
  sendToSheets(timeStr, mcqScore, scenAnswered, codeAnswered, wasAuto);
}

// ══════════════════════════════════════════════════════════════════
//  RESULT SCREEN
// ══════════════════════════════════════════════════════════════════
function showResultScreen(timeStr, mcqScore, scenAnswered, codeAnswered, wasAuto) {
  showScreen("screen-result");
  document.getElementById("rName").textContent     = candidateInfo.name  || "—";
  document.getElementById("rBatch").textContent    = candidateInfo.batch || "—";
  document.getElementById("rMcq").textContent      = `${mcqScore} / 20`;
  document.getElementById("rScenario").textContent = `${scenAnswered} / 20`;
  document.getElementById("rCoding").textContent   = `${codeAnswered} / 5`;
  document.getElementById("rTime").textContent     = timeStr;

  const banner = document.getElementById("resultBanner");
  banner.textContent = wasAuto
    ? "⚠️ Auto-submitted — Maximum tab violations reached"
    : "✓ Assessment Submitted Successfully";
  banner.className = "result-status-banner" + (wasAuto ? " auto" : "");

  // MCQ breakdown
  const review   = document.getElementById("mcqReview");
  const mcqRows  = [];
  for (let i = MCQ_START; i < MCQ_END; i++) {
    const q       = QUESTIONS[i];
    const correct = answers[i] === q.answer;
    mcqRows.push(`<div class="mcq-row">
      <span class="mcq-row-num">Q${i+1}</span>
      <span class="mcq-row-cat">${q.category}</span>
      <span class="mcq-row-result ${correct ? "mcq-correct" : "mcq-wrong"}">${correct ? "✓ Correct" : "✗ Wrong"}</span>
    </div>`);
  }
  review.innerHTML = `<p class="mcq-review-title">MCQ Results</p>` + mcqRows.join("");
}

// ══════════════════════════════════════════════════════════════════
//  GOOGLE SHEETS
// ══════════════════════════════════════════════════════════════════
async function sendToSheets(timeStr, mcqScore, scenAnswered, codeAnswered, wasAuto) {
  const line2 = document.getElementById("submitLine2");
  const line3 = document.getElementById("submitLine3");

  // Scenario columns
  const scenarioCols = {};
  for (let i = SCENARIO_START; i < SCENARIO_END; i++) {
    const q = QUESTIONS[i];
    const p = `Q${String(i+1).padStart(2,"0")}_Scenario`;
    scenarioCols[`${p}_Category`] = q.category;
    scenarioCols[`${p}_Scenario`] = q.scenario;
    scenarioCols[`${p}_Question`] = q.question;
    scenarioCols[`${p}_Answer`]   = answers[i] || "(No answer)";
  }

  // MCQ columns
  const mcqCols = {};
  for (let i = MCQ_START; i < MCQ_END; i++) {
    const q   = QUESTIONS[i];
    const num = i - MCQ_START + 1;
    const p   = `Q${String(num).padStart(2,"0")}_MCQ`;
    const si  = answers[i];
    mcqCols[`${p}_Category`] = q.category;
    mcqCols[`${p}_Question`] = q.question;
    mcqCols[`${p}_Selected`] = si !== undefined ? `${["A","B","C","D"][si]}. ${q.options[si]}` : "Not answered";
    mcqCols[`${p}_Correct`]  = `${["A","B","C","D"][q.answer]}. ${q.options[q.answer]}`;
    mcqCols[`${p}_Result`]   = si === q.answer ? "✓ Correct" : "✗ Wrong";
  }

  // Coding columns
  const codingCols = {};
  for (let i = CODING_START; i < CODING_END; i++) {
    const q   = QUESTIONS[i];
    const num = i - CODING_START + 1;
    const p   = `Q${String(num).padStart(2,"0")}_Coding`;
    codingCols[`${p}_Category`]    = q.category;
    codingCols[`${p}_Language`]    = q.language || "Apex";
    codingCols[`${p}_Requirement`] = q.scenario;
    codingCols[`${p}_Question`]    = q.question;
    codingCols[`${p}_Code`]        = answers[i] || "(No answer)";
  }

  const payload = {
    timestamp:         new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    name:              candidateInfo.name,
    email:             candidateInfo.email,
    batch:             candidateInfo.batch,
    role:              candidateInfo.role,
    mcq_score:         `${mcqScore} / 20`,
    scenario_answered: `${scenAnswered} / 20`,
    coding_answered:   `${codeAnswered} / 5`,
    time_taken:        timeStr,
    tab_violations:    String(violationCount),
    submit_type:       wasAuto ? "Auto-submitted" : "Manual",
    ...scenarioCols,
    ...mcqCols,
    ...codingCols
  };

  if (!SCRIPT_URL || SCRIPT_URL.includes("YOUR_GOOGLE")) {
    line2.innerHTML = `Sending to Google Sheets... <span class="sub-ok">[DEMO MODE — set SCRIPT_URL in quiz.js]</span>`;
    return;
  }

  try {
    await fetch(SCRIPT_URL, {
      method:"POST", mode:"no-cors",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    line2.innerHTML = `Sending to Google Sheets... <span class="sub-ok">[OK]</span>`;
    line3.style.display = "block";
    line3.innerHTML = `<span class="sub-ok">All 45 responses saved to Google Sheets.</span>`;
  } catch(err) {
    line2.innerHTML = `Sending to Google Sheets... <span class="sub-err">[FAILED — ${err.message}]</span>`;
  }
}

// ══════════════════════════════════════════════════════════════════
//  SCREEN SWITCH & RESTART
// ══════════════════════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}
function retryQuiz() {
  clearInterval(timerHandle);
  isQuizRunning = false; currentIdx = 0; answers = {};
  timerSecs = TIMER_MINS * 60; candidateInfo = {}; violationCount = 0;
  clearSession();
  const t = document.getElementById("sidebarTimer");
  if (t) { t.classList.remove("urgent"); t.textContent = `${TIMER_MINS}:00`; }
  updateViolationUI();
  showScreen("screen-landing");
}
