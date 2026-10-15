// ========== القائمة في الجوال ==========
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "✕" : "☰";
});
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.textContent = "☰";
  })
);

// ========== محاكاة التنبيهات الحيّة ==========
const alerts = [
  { sev: "critical", msg: "Ransomware behavior detected on HOST-FIN-07" },
  { sev: "high", msg: "Multiple failed logins (brute force) – user: admin" },
  { sev: "medium", msg: "Suspicious PowerShell execution – WS-112" },
  { sev: "low", msg: "New device connected to corporate Wi-Fi" },
  { sev: "high", msg: "Outbound traffic to known malicious IP" },
  { sev: "medium", msg: "Phishing email reported by user" },
  { sev: "low", msg: "Port scan detected from internal host" },
  { sev: "critical", msg: "Privilege escalation attempt on DC-01" },
  { sev: "medium", msg: "Impossible travel login – Riyadh → London" },
  { sev: "low", msg: "Antivirus signature updated successfully" },
];
const feed = document.getElementById("alertFeed");
const MAX_ALERTS = 9;

function addAlert() {
  const a = alerts[Math.floor(Math.random() * alerts.length)];
  const time = new Date().toLocaleTimeString("en-GB");
  const li = document.createElement("li");
  li.innerHTML = `<span class="time">${time}</span><span class="sev ${a.sev}">${a.sev.toUpperCase()}</span><span>${a.msg}</span>`;
  feed.prepend(li);
  if (feed.children.length > MAX_ALERTS) feed.lastElementChild.remove();
}
for (let i = 0; i < 5; i++) addAlert();
setInterval(addAlert, 2200);

// ========== عدّاد الأرقام ==========
function animateCount(el) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = +el.dataset.target;
  let current = 0;
  const step = () => {
    current++;
    el.textContent = current;
    if (current < target) setTimeout(step, 1200 / target);
  };
  step();
}

// ========== ظهور العناصر عند التمرير ==========
document.querySelectorAll(".card, .pillar, .stat, .flip, .metric, details, .section-title")
  .forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      const num = entry.target.querySelector(".num");
      if (num && !num.dataset.done) { num.dataset.done = "1"; animateCount(num); }
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ========== تمييز الرابط النشط في القائمة ==========
const sections = document.querySelectorAll("section[id]");
const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  const y = window.scrollY + 120;
  sections.forEach((sec) => {
    const link = navLinks.querySelector(`a[href="#${sec.id}"]`);
    if (!link) return;
    link.classList.toggle("active", y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
  });
  toTop.classList.toggle("show", window.scrollY > 600);
});

// ========== التبويبات ==========
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// ========== قلب بطاقات الأدوات ==========
document.querySelectorAll(".flip").forEach((card) => {
  const toggle = () => card.classList.toggle("flipped");
  card.addEventListener("click", toggle);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  });
});

// ========== الاختبار ==========
const questions = [
  {
    q: "ماذا يعني اختصار SOC؟",
    options: ["Security Operations Center", "System Operation Control", "Secure Online Connection", "Software Optimization Center"],
    answer: 0,
    explain: "SOC = Security Operations Center أي مركز العمليات الأمنية.",
  },
  {
    q: "أي أداة تجمع السجلات من كل الأنظمة وتربطها لإطلاق التنبيهات؟",
    options: ["EDR", "SIEM", "Firewall", "VPN"],
    answer: 1,
    explain: "الـ SIEM هو القلب التقني للـ SOC لجمع السجلات وتحليلها.",
  },
  {
    q: "من المسؤول عن الفرز الأولي للتنبيهات؟",
    options: ["مدير الـ SOC", "محلل المستوى 3", "محلل المستوى 1", "مهندس الشبكات"],
    answer: 2,
    explain: "محلل المستوى الأول (Tier 1) هو خط الدفاع الأول للفرز.",
  },
  {
    q: "ما المرحلة التي يتم فيها عزل الأنظمة المصابة؟",
    options: ["الاستعداد", "الاحتواء والإزالة والتعافي", "ما بعد الحادثة", "الاكتشاف والتحليل"],
    answer: 1,
    explain: "العزل جزء من مرحلة الاحتواء (Containment).",
  },
  {
    q: "ماذا يقيس مؤشر MTTD؟",
    options: ["متوسط وقت الاكتشاف", "متوسط وقت الإصلاح", "عدد الحوادث", "نسبة الإنذارات الكاذبة"],
    answer: 0,
    explain: "MTTD = Mean Time To Detect، أي متوسط الوقت لاكتشاف التهديد.",
  },
];

let current = 0;
let score = 0;
const qEl = document.getElementById("quizQ");
const optsEl = document.getElementById("quizOptions");
const fbEl = document.getElementById("quizFeedback");
const nextBtn = document.getElementById("quizNext");
const countEl = document.getElementById("quizCount");
const barEl = document.getElementById("quizBar");
const quizMain = document.getElementById("quizMain");
const quizResult = document.getElementById("quizResult");

function showQuestion() {
  const item = questions[current];
  countEl.textContent = `السؤال ${current + 1} من ${questions.length}`;
  barEl.style.width = `${(current / questions.length) * 100}%`;
  qEl.textContent = item.q;
  fbEl.textContent = "";
  nextBtn.hidden = true;
  optsEl.innerHTML = "";
  item.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-opt";
    btn.textContent = opt;
    btn.addEventListener("click", () => choose(i, btn));
    optsEl.appendChild(btn);
  });
}

function choose(i, btn) {
  const item = questions[current];
  const buttons = optsEl.querySelectorAll(".quiz-opt");
  buttons.forEach((b) => (b.disabled = true));
  buttons[item.answer].classList.add("correct");
  if (i === item.answer) {
    score++;
    fbEl.textContent = "✅ إجابة صحيحة! " + item.explain;
  } else {
    btn.classList.add("wrong");
    fbEl.textContent = "❌ إجابة خاطئة. " + item.explain;
  }
  nextBtn.textContent = current === questions.length - 1 ? "عرض النتيجة" : "التالي";
  nextBtn.hidden = false;
}

nextBtn.addEventListener("click", () => {
  current++;
  if (current < questions.length) showQuestion();
  else showResult();
});

function showResult() {
  const msg =
    score === questions.length ? "ممتاز! أنت جاهز للانضمام لفريق SOC 🛡️"
    : score >= 3 ? "أداء جيد! راجع الأقسام مرة أخرى لتصل للعلامة الكاملة."
    : "لا بأس، اقرأ الموقع مرة أخرى وجرّب من جديد.";
  quizMain.hidden = true;
  quizResult.hidden = false;
  quizResult.innerHTML = `
      <p class="score">${score}/${questions.length}</p>
      <p>${msg}</p>
      <br>
      <button class="btn btn-primary" id="quizRestart">أعد المحاولة</button>`;
  document.getElementById("quizRestart").addEventListener("click", () => {
    current = 0; score = 0;
    quizResult.hidden = true; quizMain.hidden = false;
    showQuestion();
  });
}

showQuestion();

// ========== السنة في الفوتر ==========
document.getElementById("year").textContent = new Date().getFullYear();
