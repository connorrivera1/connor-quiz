/* The Connor Quiz. Edit QUESTIONS to change content; `answer` must match an option exactly. */

const QUESTIONS = [
  { cat: "Marvel", q: "Who is Connor's favorite Marvel character?", options: ["Iron Man", "Loki", "Spider-Man", "Doctor Strange"], answer: "Loki", fact: "Loki. Obviously. Did you not see the crown?" },
  { cat: "Marvel", q: "Connor's favorite character is the God of…", options: ["Thunder", "War", "Mischief", "the Underworld"], answer: "Mischief", fact: "Loki is the God of Mischief, burdened with glorious purpose." },
  { cat: "Hockey", q: "Which NHL team does Connor ride or die for?", options: ["Boston Bruins", "Montreal Canadiens", "Toronto Maple Leafs", "New York Rangers"], answer: "Toronto Maple Leafs", fact: "Leafs forever. Connor accepted the emotional damage long ago." },
  { cat: "Marvel", q: "What is Connor's favorite fictional universe?", options: ["Star Wars", "Marvel", "Harry Potter", "The Lord of the Rings"], answer: "Marvel", fact: "The Marvel Cinematic Universe, every multiverse branch included." },
  { cat: "Apple", q: "Which company is Connor's favorite?", options: ["Google", "Microsoft", "Apple", "Tesla"], answer: "Apple", fact: "Apple. Odds are you're reading this on one of its devices." },
  { cat: "Birthday", q: "When is Connor's birthday?", options: ["July 4th", "August 15th", "September 22nd", "October 31st"], answer: "August 15th", fact: "August 15th. Write it down; there will be a quiz. (This is it.)" },
  { cat: "Birthday", q: "So what is Connor's zodiac sign?", options: ["Cancer", "Virgo", "Leo", "Scorpio"], answer: "Leo", fact: "An August 15th birthday makes Connor a Leo: confident, dramatic, born for the spotlight." },
  { cat: "Birthday", q: "Connor's August birthstone happens to match this whole site. What is it?", options: ["Ruby", "Sapphire", "Peridot", "Opal"], answer: "Peridot", fact: "Peridot, a vivid green. Loki green, in fact." },
  { cat: "Marvel", q: "Which actor plays Connor's favorite character?", options: ["Tom Holland", "Tom Hiddleston", "Chris Hemsworth", "Benedict Cumberbatch"], answer: "Tom Hiddleston", fact: "Tom Hiddleston has played Loki since 2011." },
  { cat: "Marvel", q: "Who is Loki's adoptive brother?", options: ["Odin", "Heimdall", "Thor", "Balder"], answer: "Thor", fact: "Thor, God of Thunder." },
  { cat: "Marvel", q: "In which movie did Loki make his MCU debut?", options: ["The Avengers (2012)", "Thor (2011)", "Iron Man 2 (2010)", "Captain America: The First Avenger (2011)"], answer: "Thor (2011)", fact: "Thor (2011) introduced the scene-stealer." },
  { cat: "Marvel", q: "What colors would impress Connor most?", options: ["Red & gold", "Green & gold", "Blue & silver", "Black & purple"], answer: "Green & gold", fact: "Loki's signature colors, and the reason this site looks like this." },
  { cat: "Hockey", q: "Where do Connor's Leafs play their home games?", options: ["Bell Centre", "Rogers Place", "Scotiabank Arena", "Madison Square Garden"], answer: "Scotiabank Arena", fact: "Scotiabank Arena, downtown Toronto. Wear blue and white." },
  { cat: "Apple", q: "Who co-founded Apple with Steve Wozniak?", options: ["Bill Gates", "Steve Jobs", "Tim Cook", "Elon Musk"], answer: "Steve Jobs", fact: "Steve Jobs and Steve Wozniak founded Apple in 1976." },
  { cat: "Apple", q: "Where is Apple headquartered?", options: ["Seattle, WA", "Austin, TX", "Cupertino, CA", "Mountain View, CA"], answer: "Cupertino, CA", fact: "Apple Park, Cupertino: the giant glass ring." }
];

const GRADES = [
  { min: 15, letter: "A+", title: "Glorious Purpose", blurb: "Perfect score. You know Connor better than the TVA knows the Sacred Timeline. Suspicious. Are you a Variant?" },
  { min: 13, letter: "A", title: "Asgardian Royalty", blurb: "You've been paying attention. Connor would give you a seat at the high table and maybe the crown." },
  { min: 11, letter: "B", title: "Trusted Variant", blurb: "Solid. You know the important stuff, and a quick Marvel rewatch gets you the rest." },
  { min: 9, letter: "C", title: "TVA Desk Worker", blurb: "Not bad, not legendary. You know Connor like a clerk knows a case file: on paper." },
  { min: 7, letter: "D", title: "Nearly Pruned", blurb: "Yikes. The timeline is branching and you're on the wrong side. Study up." },
  { min: 0, letter: "F", title: "Sent To The Void", blurb: "Pruned. Alioth is waiting. Take it again and redeem yourself." }
];

const $ = (id) => document.getElementById(id);
const S = { i: 0, correct: 0, answers: [], order: [], streak: 0, best: 0 };

/* ---------- helpers ---------- */
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const gradeFor = (n) => GRADES.find((g) => n >= g.min);
const pad = (n) => String(n).padStart(2, "0");
const total = QUESTIONS.length;
const stages = { q: $("stageQuestion"), result: $("stageResult") };

function showStage(name) {
  Object.values(stages).forEach((s) => s.classList.remove("is-active"));
  void stages[name].offsetWidth;
  stages[name].classList.add("is-active");
}

/* ---------- splash ---------- */
(function splash() {
  const word = $("splashWord");
  [..."Connor Quiz"].forEach((ch, i) => {
    const s = document.createElement("span");
    s.textContent = ch;
    s.style.animationDelay = 340 + i * 38 + "ms";
    word.appendChild(s);
  });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(() => $("splash").classList.add("done"), reduced ? 50 : 340 + 11 * 38 + 300 + 1320 - 700);
})();

/* ---------- hero dial ticks ---------- */
(function dial() {
  const g = $("dialTicks"), NS = "http://www.w3.org/2000/svg";
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2, major = i % 6 === 0, r1 = 292, r2 = major ? 274 : 282;
    const l = document.createElementNS(NS, "line");
    l.setAttribute("x1", 300 + Math.cos(a) * r1); l.setAttribute("y1", 300 + Math.sin(a) * r1);
    l.setAttribute("x2", 300 + Math.cos(a) * r2); l.setAttribute("y2", 300 + Math.sin(a) * r2);
    if (major) l.setAttribute("class", "major");
    g.appendChild(l);
  }
})();

/* ---------- scorecard ---------- */
function updateScorecard(cat) {
  const done = S.answers.length;
  $("sAnswered").textContent = done;
  $("sCorrect").textContent = S.correct;
  $("sMissed").textContent = done ? done - S.correct : "–";
  $("sStreak").textContent = done ? S.best : "–";
  $("sCategory").textContent = cat || "–";
  $("scoreSub").textContent = done === 0 ? "Not started" : done === total ? "Complete" : `Question ${Math.min(done + 1, total)} of ${total}`;
  if (done) {
    const g = gradeFor(Math.round((S.correct / done) * total));
    $("sGrade").textContent = g.letter;
    $("sPct").textContent = `${Math.round((S.correct / done) * 100)}% correct`;
  } else {
    $("sGrade").textContent = "–";
    $("sPct").textContent = "No answers yet";
  }
  $("windowMeta").textContent = `${done} / ${total}`;
  $("quizProgress").style.transform = `scaleX(${done / total})`;
}

/* ---------- quiz flow ---------- */
function begin() {
  Object.assign(S, { i: 0, correct: 0, answers: [], streak: 0, best: 0 });
  render();
}

function render() {
  const item = QUESTIONS[S.i];
  $("windowTitle").textContent = item.cat;
  $("qIndex").textContent = `${pad(S.i + 1)} / ${total} · ${item.cat}`;
  $("qText").textContent = item.q;
  $("verdict").hidden = true;
  $("nextBtn").disabled = true;
  $("nextLabel").textContent = S.i === total - 1 ? "See My Grade" : "Next Question";
  S.order = shuffle(item.options);
  $("answers").innerHTML = "";
  S.order.forEach((opt, k) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button"; b.className = "answer"; b.dataset.v = opt;
    b.innerHTML = `<span class="answer-key">${"ABCD"[k]}</span><span class="answer-label"></span><span class="answer-mark"></span>`;
    b.querySelector(".answer-label").textContent = opt;
    b.addEventListener("click", () => choose(opt));
    li.appendChild(b);
    $("answers").appendChild(li);
  });
  showStage("q");
  updateScorecard(item.cat);
}

function choose(v) {
  if (S.answers.length > S.i) return;
  const item = QUESTIONS[S.i], ok = v === item.answer;
  S.answers.push({ chosen: v, ok });
  if (ok) { S.correct++; S.streak++; S.best = Math.max(S.best, S.streak); } else S.streak = 0;
  document.querySelectorAll(".answer").forEach((b) => {
    b.disabled = true;
    const x = b.dataset.v, mark = b.querySelector(".answer-mark");
    if (x === item.answer) { b.classList.add("is-right"); mark.textContent = "Right"; }
    else if (x === v) { b.classList.add("is-wrong"); mark.textContent = "Missed"; }
    else b.classList.add("is-dim");
  });
  const line = $("verdictLine");
  line.textContent = ok ? pick(["Correct.", "Nailed it.", "Worthy.", "Exactly right."]) : `${pick(["Not quite.", "The timeline disagrees.", "Mischief, unmanaged."])} It's ${item.answer}.`;
  line.className = "verdict-line" + (ok ? " right" : "");
  $("verdictFact").textContent = item.fact;
  $("verdict").hidden = false;
  $("nextBtn").disabled = false;
  $("nextBtn").focus({ preventScroll: true });
  updateScorecard(item.cat);
}

function next() {
  if ($("nextBtn").disabled) return;
  if (S.i < total - 1) { S.i++; render(); } else finish();
}

function finish() {
  const g = gradeFor(S.correct);
  $("windowTitle").textContent = "Final Grade";
  $("resultGrade").textContent = g.letter;
  $("resultGrade").style.setProperty("--pct", (S.correct / total) * 100);
  $("resultTitle").textContent = g.title;
  $("resultBlurb").textContent = `${S.correct} of ${total} correct. ${g.blurb}`;
  $("ledgerTally").textContent = `${S.correct} of ${total}`;
  $("ledger").innerHTML = "";
  QUESTIONS.forEach((item, i) => {
    const a = S.answers[i], li = document.createElement("li");
    if (!a.ok) li.className = "miss";
    const q = document.createElement("span"); q.className = "ledger-q"; q.textContent = item.q;
    if (!a.ok) { const sm = document.createElement("small"), s = document.createElement("s"); s.textContent = a.chosen; sm.append("You said ", s); q.appendChild(sm); }
    const n = document.createElement("span"); n.className = "ledger-n"; n.textContent = pad(i + 1);
    const an = document.createElement("span"); an.className = "ledger-a"; an.textContent = item.answer;
    li.append(n, q, an);
    $("ledger").appendChild(li);
  });
  showStage("result");
  updateScorecard("–");
  scrollTo({ top: 0, behavior: "smooth" });
}

function toast(m) {
  const t = $("toast"); t.textContent = m; t.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2400);
}

function copyScore() {
  const g = gradeFor(S.correct);
  const text = `I scored ${S.correct}/${total} (${g.letter}, "${g.title}") on The Connor Quiz.`;
  const done = () => toast("Score copied.");
  if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(text).then(done, () => toast(text));
  else toast(text);
}

/* ---------- events ---------- */
function showView(name) {
  const quiz = name === "quiz";
  $("landing").hidden = quiz;
  $("quizView").hidden = !quiz;
  scrollTo({ top: 0 });
  if (quiz) begin();
}
$("takeBtn").addEventListener("click", () => showView("quiz"));
$("homeLink").addEventListener("click", (e) => { e.preventDefault(); showView("landing"); });
$("nextBtn").addEventListener("click", next);
$("againBtn").addEventListener("click", begin);
$("copyBtn").addEventListener("click", copyScore);

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || !stages.q.classList.contains("is-active")) return;
  const idx = "1234".indexOf(e.key) >= 0 ? "1234".indexOf(e.key) : "abcd".indexOf(e.key.toLowerCase());
  if (idx >= 0 && S.order[idx]) choose(S.order[idx]);
  else if (e.key === "Enter" && !$("nextBtn").disabled && document.activeElement !== $("nextBtn")) next();
});

/* theme */
$("themeSwitch").addEventListener("click", () => {
  const r = document.documentElement, t = r.dataset.theme === "dark" ? "light" : "dark";
  r.dataset.theme = t;
  try { localStorage.setItem("connor-quiz-theme", t); } catch (e) {}
});

updateScorecard();
