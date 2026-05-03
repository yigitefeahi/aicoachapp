type RoleOption = {
  title: string;
  level: string;
  focus: string;
};

type InterviewQuestion = {
  order: number;
  question: string;
  tag: string;
};

type FeedbackMetric = {
  label: string;
  value: number;
  note: string;
};

const roleOptions: RoleOption[] = [
  {
    title: "Frontend Developer",
    level: "Junior",
    focus: "React, TypeScript, component thinking",
  },
  {
    title: "Product Manager",
    level: "Associate",
    focus: "Prioritization, discovery, stakeholder communication",
  },
  {
    title: "Data Analyst",
    level: "Entry",
    focus: "SQL, dashboarding, metric interpretation",
  },
];

const interviewQuestions: InterviewQuestion[] = [
  {
    order: 1,
    question: "Son projende zorlandigin teknik bir problemi nasil cozdun?",
    tag: "Behavioral",
  },
  {
    order: 2,
    question: "React component yapisini planlarken nelere dikkat edersin?",
    tag: "Technical",
  },
  {
    order: 3,
    question: "Bir ekip arkadasindan gec gelen teslimi nasil yonetirsin?",
    tag: "Communication",
  },
];

const feedbackMetrics: FeedbackMetric[] = [
  {
    label: "Icerik kalitesi",
    value: 82,
    note: "Cevaplar somut orneklerle desteklenmis.",
  },
  {
    label: "Iletisim",
    value: 76,
    note: "Cevap yapisi guclu, kapanis cumleleri netlestirilebilir.",
  },
  {
    label: "Ozguven",
    value: 88,
    note: "Ses tonu ve tempo mulakat icin uygun.",
  },
];

const screenLog = [
  "Web landing ve onboarding ekrani",
  "CV profil ozeti ekrani",
  "Hedef rol secim ekrani",
  "Mock mulakat akisi ekrani",
  "Skor ve feedback raporu ekrani",
];

export default function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">AI</span>
          <div>
            <strong>AI Coach</strong>
            <small>Web Interview Platform</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Ana web ekranlari">
          <a href="#overview">Overview</a>
          <a href="#profile">CV Profile</a>
          <a href="#roles">Role Match</a>
          <a href="#interview">Interview</a>
          <a href="#feedback">Feedback</a>
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">4. Hafta Frontend Teslimi</p>
            <h1>Web tabanli AI mulakat koçu</h1>
          </div>
          <span className="status-pill">Mock data aktif</span>
        </header>

        <section className="hero-grid" id="overview">
          <div className="hero-card">
            <p className="eyebrow">Web App</p>
            <h2>CV'ne gore mulakat provasi yap, cevaplarini gelistir.</h2>
            <p>
              Bu frontend taslagi backend baglantisi olmadan, mock verilerle
              kullanici yolculugunu gosterir. Responsive web paneli olarak
              tasarlanmistir.
            </p>
            <div className="action-row">
              <button>Mulakati Baslat</button>
              <button className="secondary-button">CV Ozetini Gor</button>
            </div>
          </div>

          <div className="stat-grid">
            <article className="stat-card">
              <strong>5</strong>
              <span>Frontend ekrani</span>
            </article>
            <article className="stat-card">
              <strong>3</strong>
              <span>Mock hedef rol</span>
            </article>
            <article className="stat-card">
              <strong>82%</strong>
              <span>Ortalama skor</span>
            </article>
            <article className="stat-card">
              <strong>Web</strong>
              <span>Platform tipi</span>
            </article>
          </div>
        </section>

        <section className="section-grid">
          <article className="panel" id="profile">
            <div className="section-heading">
              <p className="eyebrow">Screen 01</p>
              <h2>CV Profil Ozeti</h2>
            </div>
            <div className="profile-card">
              <div className="avatar">YE</div>
              <div>
                <h3>Yigit Efe Ahi</h3>
                <p>Frontend Developer adayi</p>
              </div>
            </div>
            <div className="tag-list">
              <span>React</span>
              <span>TypeScript</span>
              <span>FastAPI temeli</span>
              <span>Takim calismasi</span>
            </div>
            <p className="muted">
              Mock CV analizine gore aday, component bazli dusunme ve temel API
              entegrasyonu konularinda guclu.
            </p>
          </article>

          <article className="panel" id="roles">
            <div className="section-heading">
              <p className="eyebrow">Screen 02</p>
              <h2>Hedef Rol Secimi</h2>
            </div>
            <div className="role-list">
              {roleOptions.map((role) => (
                <article className="role-card" key={role.title}>
                  <div>
                    <h3>{role.title}</h3>
                    <p>{role.focus}</p>
                  </div>
                  <span>{role.level}</span>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="panel wide-panel" id="interview">
          <div className="section-heading">
            <p className="eyebrow">Screen 03</p>
            <h2>Mock Mulakat Akisi</h2>
          </div>
          <div className="question-list">
            {interviewQuestions.map((item) => (
              <article className="question-card" key={item.order}>
                <span className="question-order">0{item.order}</span>
                <div>
                  <h3>{item.question}</h3>
                  <p>{item.tag} question</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-grid">
          <article className="panel" id="feedback">
            <div className="section-heading">
              <p className="eyebrow">Screen 04</p>
              <h2>Feedback Raporu</h2>
            </div>
            <div className="metric-list">
              {feedbackMetrics.map((metric) => (
                <div className="metric" key={metric.label}>
                  <div className="metric-header">
                    <strong>{metric.label}</strong>
                    <span>{metric.value}/100</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  <p>{metric.note}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="section-heading">
              <p className="eyebrow">Screen Log</p>
              <h2>Frontend ekran listesi</h2>
            </div>
            <ul className="screen-log">
              {screenLog.map((screen) => (
                <li key={screen}>
                  <span />
                  {screen}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}
