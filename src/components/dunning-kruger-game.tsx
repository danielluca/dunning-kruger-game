import { useState } from "react";
import { DK_PHASES, getPhase, getPhaseAnalysisText } from "./dk-phase";

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  difficulty: "leicht" | "mittel" | "schwer";
};

type QuestionSet = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  questions: Question[];
};

type Answer = {
  correct: boolean;
  confidence: number;
  questionId: number;
};

const QUESTION_SETS: Record<string, QuestionSet> = {
  dev: {
    id: "dev",
    label: "Produktentwicklung & Tech",
    emoji: "⚙️",
    description: "APIs, SaaS-Metriken, Softwarekonzepte",
    questions: [
      {
        id: 1,
        question: "Was bedeutet 'Time to First Byte' (TTFB) in der Webentwicklung?",
        options: [
          "Die Zeit bis der erste Buchstabe auf dem Bildschirm erscheint",
          "Die Zeit zwischen dem Absenden einer HTTP-Anfrage und dem Empfang des ersten Bytes der Antwort",
          "Die Geschwindigkeit der Internetverbindung in Bytes pro Sekunde",
          "Die Ladezeit bis die Seite vollständig gerendert ist",
        ],
        correct: 1,
        difficulty: "mittel",
      },
      {
        id: 2,
        question: "Was beschreibt das 'Pareto-Prinzip' (80/20-Regel) in der Praxis am besten?",
        options: [
          "80% der Arbeit sollte in 20% der Zeit erledigt werden",
          "Ein Produkt sollte 80% der Nutzerwünsche mit 20% des Aufwands erfüllen",
          "Ca. 80% der Ergebnisse entstehen durch ca. 20% der Ursachen",
          "Teams sollten 80% der Zeit planen und 20% umsetzen",
        ],
        correct: 2,
        difficulty: "leicht",
      },
      {
        id: 3,
        question: "Was ist der Unterschied zwischen 'Latenz' und 'Durchsatz' in einem System?",
        options: [
          "Latenz = Servergeschwindigkeit, Durchsatz = Netzwerkgeschwindigkeit",
          "Latenz = Zeit pro Anfrage, Durchsatz = Anzahl Anfragen pro Zeiteinheit",
          "Latenz = Datenvolumen, Durchsatz = Übertragungsgeschwindigkeit",
          "Es gibt keinen relevanten Unterschied",
        ],
        correct: 1,
        difficulty: "mittel",
      },
      {
        id: 4,
        question: "Was versteht man unter 'Churn Rate' in einem SaaS-Unternehmen?",
        options: [
          "Die Wachstumsrate neuer Kunden pro Monat",
          "Der Anteil der Kunden, die ihren Vertrag nicht verlängern oder kündigen",
          "Die durchschnittliche Nutzungsdauer pro Nutzer täglich",
          "Der Umsatz pro aktivem Nutzer",
        ],
        correct: 1,
        difficulty: "leicht",
      },
      {
        id: 5,
        question: "Was bedeutet 'Idempotenz' bei einer HTTP-Methode?",
        options: [
          "Die Anfrage wird verschlüsselt übertragen",
          "Die Methode kann nur einmal aufgerufen werden",
          "Mehrfaches Ausführen derselben Anfrage hat dasselbe Ergebnis wie einmaliges Ausführen",
          "Die Anfrage wird automatisch wiederholt falls sie fehlschlägt",
        ],
        correct: 2,
        difficulty: "schwer",
      },
      {
        id: 6,
        question: "Was ist 'Survivorship Bias'?",
        options: [
          "Die Tendenz, Risiken zu überschätzen weil man Negativbeispiele im Kopf hat",
          "Ein Fehler bei dem nur erfolgreiche Fälle analysiert werden, während gescheiterte ignoriert werden",
          "Die Neigung, eigene Überlebenschancen in Krisen zu überschätzen",
          "Ein statistischer Effekt der durch kleine Stichproben entsteht",
        ],
        correct: 1,
        difficulty: "mittel",
      },
      {
        id: 7,
        question: "Was beschreibt 'Technische Schulden' (Technical Debt)?",
        options: [
          "Lizenzkosten für verwendete Softwarebibliotheken",
          "Der finanzielle Aufwand für die IT-Infrastruktur",
          "Kurzfristige Lösungen im Code, die langfristig Mehraufwand durch Überarbeitung erzeugen",
          "Verzögerungen durch fehlendes technisches Personal",
        ],
        correct: 2,
        difficulty: "leicht",
      },
      {
        id: 8,
        question: "Was ist ein 'A/B-Test' in der Produktentwicklung?",
        options: [
          "Ein Test der zwei verschiedene Produkte gegeneinander vergleicht",
          "Ein Verfahren bei dem zwei Varianten einer Lösung gleichzeitig an unterschiedlichen Nutzergruppen getestet werden",
          "Eine Qualitätsprüfung bei der Entwickler (A) und Designer (B) separat testen",
          "Ein Sicherheitstest bei dem zwei Szenarien durchgespielt werden",
        ],
        correct: 1,
        difficulty: "leicht",
      },
    ],
  },
  datev: {
    id: "datev",
    label: "DATEV-Ökosystem",
    emoji: "📊",
    description: "Lohnbuchhaltung, Schnittstellen, Compliance",
    questions: [
      {
        id: 1,
        question: "Was ist LODAS im DATEV-Kontext?",
        options: [
          "Eine DATEV-Anwendung zur Finanzbuchhaltung für Großunternehmen",
          "Ein Lohnabrechnungsprogramm von DATEV für Steuerberater und Mandanten",
          "Eine Schnittstelle zur elektronischen Kommunikation mit Finanzämtern",
          "Ein Dokumentenmanagementsystem für Kanzleien",
        ],
        correct: 1,
        difficulty: "leicht",
      },
      {
        id: 2,
        question: "Was regelt die GoBD in Bezug auf digitale Dokumente?",
        options: [
          "Ausschließlich die Aufbewahrungsfristen für Papierbelege",
          "Grundsätze für ordnungsgemäße Führung und Aufbewahrung von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form",
          "Die technischen Anforderungen an Steuerberatungssoftware",
          "Die Datenschutzanforderungen für Mandantendaten nach DSGVO",
        ],
        correct: 1,
        difficulty: "mittel",
      },
      {
        id: 3,
        question: "Was bedeutet 'Auftragsverarbeitung' (Art. 28 DSGVO) für ein SaaS-Unternehmen das Lohndaten verarbeitet?",
        options: [
          "Das Unternehmen ist selbst verantwortlich für die Rechtmäßigkeit der Datenverarbeitung",
          "Das Unternehmen verarbeitet personenbezogene Daten im Auftrag des Verantwortlichen (z.B. der Kanzlei) und benötigt einen AVV",
          "Das Unternehmen darf die Daten für eigene Zwecke nutzen, solange es anonymisiert",
          "Das Unternehmen haftet nicht für Datenpannen, wenn der Auftraggeber zustimmt",
        ],
        correct: 1,
        difficulty: "mittel",
      },
      {
        id: 4,
        question: "Was ist die eAU (elektronische Arbeitsunfähigkeitsbescheinigung)?",
        options: [
          "Ein digitales Formular das Arbeitnehmer direkt beim Arbeitgeber einreichen",
          "Ein Verfahren bei dem Krankenkassen AU-Daten elektronisch an Arbeitgeber übermitteln — der Arbeitnehmer muss keine Papierbescheinigung mehr einreichen",
          "Eine App zur Krankmeldung über das Smartphone",
          "Ein DATEV-internes Format für die Lohnbuchhaltung",
        ],
        correct: 1,
        difficulty: "mittel",
      },
      {
        id: 5,
        question: "Was versteht man unter 'Personalstammdaten' in der Lohnbuchhaltung?",
        options: [
          "Monatlich wechselnde Daten wie Arbeitsstunden und Zuschläge",
          "Die unveränderlichen Basisdaten eines Mitarbeiters wie Name, Adresse, Steuer-ID, Sozialversicherungsnummer und Beschäftigungsart",
          "Ausschließlich die Bankverbindung des Mitarbeiters",
          "Die kumulierten Jahresgehaltsdaten für die Steuererklärung",
        ],
        correct: 1,
        difficulty: "leicht",
      },
      {
        id: 6,
        question: "Was ist der Unterschied zwischen 'Personalstammdaten' und 'Bewegungsdaten' in der Lohnbuchhaltung?",
        options: [
          "Es gibt keinen Unterschied — beides bezeichnet Mitarbeiterdaten",
          "Stammdaten sind dauerhafte Basisdaten eines Mitarbeiters; Bewegungsdaten sind periodisch anfallende Abrechnungsdaten wie Stunden, Zuschläge oder Spesen",
          "Stammdaten kommen vom Arbeitnehmer, Bewegungsdaten vom Arbeitgeber",
          "Bewegungsdaten sind gesetzlich nicht aufbewahrungspflichtig",
        ],
        correct: 1,
        difficulty: "leicht",
      },
      {
        id: 7,
        question: "Wie lang ist die gesetzliche Aufbewahrungspflicht für Lohnunterlagen in Deutschland in der Regel?",
        options: [
          "3 Jahre",
          "6 Jahre",
          "10 Jahre",
          "25 Jahre",
        ],
        correct: 2,
        difficulty: "mittel",
      },
      {
        id: 8,
        question: "Was beschreibt der Begriff 'DATEV-Rechenzentrum' im Kontext einer Kanzlei?",
        options: [
          "Den lokalen Server in der Kanzlei auf dem DATEV-Software läuft",
          "Die zentrale IT-Infrastruktur von DATEV, über die Kanzleien ihre Anwendungen und Daten cloud-basiert nutzen und austauschen",
          "Ein physisches Rechenzentrum das Kanzleien mieten können",
          "Die Buchhaltungsabteilung innerhalb von DATEV eG",
        ],
        correct: 1,
        difficulty: "schwer",
      },
    ],
  },
  marketing: {
    id: "marketing",
    label: "Marketing & Growth",
    emoji: "🚀",
    description: "Performance, Branding & Strategie",
    questions: [
      {
        id: 1,
        question: "Was ist der Hauptunterschied zwischen ROI (Return on Investment) und ROAS (Return on Ad Spend)?",
        options: [
          "Es gibt keinen Unterschied, beide Begriffe sind synonym",
          "ROAS betrachtet nur den Umsatz im Verhältnis zu den Werbekosten, ROI berücksichtigt die Gesamtkosten",
          "ROI bezieht sich nur auf Offline-Marketing, ROAS nur auf Online-Marketing",
          "ROAS wird in Prozent angegeben, ROI als absoluter Währungsbetrag",
        ],
        correct: 1,
        difficulty: "mittel",
      },
      {
        id: 2,
        question: "Was versteht man im SEO unter dem 'Crawler' (oder Spider)?",
        options: [
          "Ein Programm, das Webseiten automatisch nach Sicherheitslücken durchsucht",
          "Ein Tool zur Analyse von Ladezeiten",
          "Ein Bot einer Suchmaschine, der das Web durchsucht und Seiten für den Index erfasst",
          "Eine Software, die künstliche Backlinks generiert",
        ],
        correct: 2,
        difficulty: "leicht",
      },
      {
        id: 3,
        question: "Was beschreibt die 'Click-Through-Rate' (CTR)?",
        options: [
          "Das Verhältnis von Klicks auf eine Anzeige zu den gesamten Impressionen",
          "Die Anzahl der Nutzer, die nach dem Klick auch etwas kaufen",
          "Die Geschwindigkeit, mit der ein Nutzer durch eine Website navigiert",
          "Die Kosten, die pro Klick auf eine Werbeanzeige anfallen",
        ],
        correct: 0,
        difficulty: "leicht",
      },
      {
        id: 4,
        question: "Was ist das primäre Ziel von 'Content Marketing'?",
        options: [
          "Möglichst viele Werbebanner auf der eigenen Seite zu platzieren",
          "Direkte Verkaufsgespräche per Telefon zu forcieren",
          "Durch wertvolle, relevante Informationen eine Zielgruppe anzusprechen und langfristig zu binden",
          "Das Kopieren von Inhalten der Konkurrenz zur Reichweitensteigerung",
        ],
        correct: 2,
        difficulty: "leicht",
      },
      {
        id: 5,
        question: "Was bedeutet 'Attribution' im Online-Marketing?",
        options: [
          "Die Zuweisung von Conversions zu verschiedenen Touchpoints in der Customer Journey",
          "Die Gestaltung von Werbemitteln für verschiedene Zielgruppen",
          "Der Schutz von Markennamen vor Missbrauch durch Dritte",
          "Die automatische Gebotsanpassung in Google Ads",
        ],
        correct: 0,
        difficulty: "schwer",
      },
      {
        id: 6,
        question: "Was ist ein 'Lead' im Marketing-Kontext?",
        options: [
          "Der Marktführer in einer bestimmten Branche",
          "Ein qualifizierter Kontakt von einem potenziellen Kunden (z.B. durch Newsletter-Anmeldung)",
          "Der wichtigste Werbekanal eines Unternehmens",
          "Ein Kunde, der bereits mehr als drei Käufe getätigt hat",
        ],
        correct: 1,
        difficulty: "leicht",
      },
      {
        id: 7,
        question: "Wofür steht 'Lookalike Audience' bei Social Media Ads?",
        options: [
          "Nutzer, die genau wie das Marketing-Team aussehen",
          "Eine Zielgruppe, die den bestehenden Kunden in ihren Merkmalen und Interessen ähnelt",
          "Nutzer, die nur die Profile der Konkurrenz besuchen",
          "Eine Testgruppe, die keine Werbung angezeigt bekommt",
        ],
        correct: 1,
        difficulty: "mittel",
      },
      {
        id: 8,
        question: "Was ist der 'Customer Lifetime Value' (CLV)?",
        options: [
          "Der Betrag, den ein Kunde für seinen ersten Kauf ausgibt",
          "Die Zeit, die ein Kunde durchschnittlich auf der Website verbringt",
          "Der geschätzte Gesamtwert, den ein Kunde während der gesamten Beziehung zum Unternehmen generiert",
          "Die Kosten, die anfallen, um einen neuen Kunden zu gewinnen",
        ],
        correct: 2,
        difficulty: "mittel",
      },
    ],
  },
};

const CONFIDENCE_LABELS = [
  { value: 1, label: "Keine Ahnung", emoji: "🤷" },
  { value: 2, label: "Unsicher", emoji: "😕" },
  { value: 3, label: "Mittel", emoji: "🤔" },
  { value: 4, label: "Ziemlich sicher", emoji: "😌" },
  { value: 5, label: "Absolut sicher", emoji: "💪" },
];

export default function DunningKrugerGame() {
  const [phase, setPhase] = useState("intro");
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedConfidence, setSelectedConfidence] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");

  const activeSet = selectedSet ? QUESTION_SETS[selectedSet] : null;
  const questions = activeSet?.questions ?? [];
  const q: Question | undefined = questions[currentQ];

  function startGame() {
    if (!nameInput.trim() || !selectedSet) return;
    setPlayerName(nameInput.trim());
    setPhase("quiz");
  }

  function handleAnswer(idx: number) {
    if (answered) return;
    setSelectedAnswer(idx);
  }

  function confirmAnswer() {
    if (answered || selectedAnswer === null || selectedConfidence === null || !q) return;
    const correct = selectedAnswer === q.correct;
    setAnswers((prev) => [...prev, { correct, confidence: selectedConfidence, questionId: q.id }]);
    setAnswered(true);
    scrollToTop();
  }

  function nextQuestion() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setSelectedConfidence(null);
      setAnswered(false);
      scrollToTop();
    } else {
      setPhase("result");
      scrollToTop();
    }
  }

  function resetGame() {
    setPhase("intro");
    setSelectedSet(null);
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setSelectedConfidence(null);
    setAnswered(false);
    setNameInput("");
    scrollToTop();
  }

  const accuracy = answers.length > 0
    ? Math.round((answers.filter(a => a.correct).length / answers.length) * 100)
    : 0;
  const avgConfidence = answers.length > 0
    ? answers.reduce((s, a) => s + a.confidence, 0) / answers.length
    : 0;
  const confidencePct = Math.round((avgConfidence / 5) * 100);
  const currentPhase = getPhase(accuracy, avgConfidence);
  const overconfidenceScore = confidencePct - accuracy;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      fontFamily: "var(--sans)",
      color: "var(--text)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transition: "background 0.3s, color 0.3s",
    }}>
      {/* Header */}
      <div style={{
        width: "100%",
        borderBottom: "1px solid var(--border)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxSizing: "border-box",
        background: "var(--bg)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <span style={{ fontSize: "20px" }}>🧠</span>
        <span style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-h)", opacity: 0.8 }}>
          Dunning–Kruger Experiment
        </span>
        {phase === "quiz" && activeSet && (
          <>
            <div style={{
              marginLeft: "12px", fontSize: "12px", fontWeight: "500",
              color: "var(--accent)", background: "var(--accent-bg)",
              padding: "4px 12px", borderRadius: "20px",
              border: "1px solid var(--accent-border)",
            }}>
              {activeSet.emoji} {activeSet.label}
            </div>
            <span style={{ marginLeft: "auto", fontSize: "13px", color: "var(--text)", opacity: 0.5, fontWeight: "500" }}>
              {currentQ + 1} / {questions.length}
            </span>
          </>
        )}

        <a
          href="https://github.com/danielluca/dunning-kruger-game"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: phase === "quiz" && activeSet ? "12px" : "auto",
            display: "flex",
            alignItems: "center",
            color: "var(--text)",
            opacity: 0.5,
            transition: "opacity 0.2s",
            textDecoration: "none",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}
        >
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" aria-label="GitHub">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>

      <div style={{ width: "100%", maxWidth: "800px", padding: "60px 24px", boxSizing: "border-box" }}>

        {/* INTRO */}
        {phase === "intro" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "72px", marginBottom: "24px" }}>🏔️</div>
            <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: "800", lineHeight: 1.1, marginBottom: "16px", color: "var(--text-h)", letterSpacing: "-1px" }}>
              Weißt du, was du weißt?
            </h1>
            <p style={{ fontSize: "18px", color: "var(--text)", maxWidth: "540px", margin: "0 auto 48px", lineHeight: 1.6, opacity: 0.8 }}>
              Beantworte {questions.length || 8} Fragen und schätze dabei ein, wie sicher du dir bist.
              Am Ende siehst du, wo du auf der Dunning-Kruger-Kurve landest.
            </p>

            {/* Category selection */}
            <div style={{ marginBottom: "40px" }}>
              <p style={{ fontSize: "13px", color: "var(--text)", opacity: 0.6, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: "700", marginBottom: "20px" }}>
                Thema wählen
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", justifyContent: "center" }}>
                {Object.values(QUESTION_SETS).map(set => (
                  <button key={set.id} onClick={() => setSelectedSet(set.id)} style={{
                    background: selectedSet === set.id
                      ? "var(--accent-bg)"
                      : "var(--bg)",
                    border: selectedSet === set.id
                      ? "2px solid var(--accent)"
                      : "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "24px",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    textAlign: "center",
                    boxShadow: selectedSet === set.id ? "0 4px 12px var(--accent-bg)" : "none",
                    transform: selectedSet === set.id ? "translateY(-2px)" : "none",
                  }}>
                    <div style={{ fontSize: "32px", marginBottom: "12px" }}>{set.emoji}</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: selectedSet === set.id ? "var(--accent)" : "var(--text-h)", marginBottom: "6px" }}>
                      {set.label}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text)", opacity: 0.7 }}>
                      {set.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* DK phases info */}
            <div style={{
              background: "var(--code-bg)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "28px 32px",
              marginBottom: "40px",
              textAlign: "left",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}>
              <p style={{ fontSize: "13px", color: "var(--text)", opacity: 0.6, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: "700", marginBottom: "18px" }}>
                Die vier Phasen
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {DK_PHASES.map(p => (
                  <div key={p.name} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: p.color, flexShrink: 0, marginTop: "6px", boxShadow: `0 0 8px ${p.color}44` }} />
                    <div>
                      <span style={{ fontWeight: "700", fontSize: "15px", color: "var(--text-h)" }}>{p.name}</span>
                      <span style={{ color: "var(--text)", fontSize: "14px", opacity: 0.8 }}> — {p.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && startGame()}
                placeholder="Dein Name oder Kürzel …"
                style={{
                  background: "var(--bg)",
                  border: "2px solid var(--border)",
                  borderRadius: "12px",
                  padding: "16px 24px",
                  color: "var(--text-h)",
                  fontSize: "16px",
                  width: "100%",
                  maxWidth: "340px",
                  outline: "none",
                  textAlign: "center",
                  transition: "border-color 0.2s",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
              <button onClick={startGame} disabled={!nameInput.trim() || !selectedSet} style={{
                background: (nameInput.trim() && selectedSet) ? "var(--accent)" : "var(--border)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "16px 48px",
                fontSize: "16px",
                cursor: (nameInput.trim() && selectedSet) ? "pointer" : "default",
                fontWeight: "700",
                letterSpacing: "0.5px",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: (nameInput.trim() && selectedSet) ? "0 4px 14px var(--accent-bg)" : "none",
              }}>
                {!selectedSet ? "Zuerst ein Thema wählen" : "Experiment starten →"}
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === "quiz" && q && (
          <div>
            <div style={{ height: "6px", background: "var(--border)", borderRadius: "10px", marginBottom: "40px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%`,
                background: "var(--accent)",
                borderRadius: "10px",
                transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }} />
            </div>

            <div style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "40px",
              marginBottom: "32px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px", alignItems: "center" }}>
                <span style={{
                  fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: q.difficulty === "leicht" ? "#10b981" : q.difficulty === "mittel" ? "#f59e0b" : "#ef4444",
                  background: q.difficulty === "leicht" ? "#10b98122" : q.difficulty === "mittel" ? "#f59e0b22" : "#ef444422",
                  padding: "4px 12px", borderRadius: "20px",
                }}>
                  {q.difficulty}
                </span>
              </div>
              <p style={{ fontSize: "clamp(18px, 3vw, 22px)", lineHeight: 1.5, fontWeight: "700", color: "var(--text-h)", margin: 0 }}>
                {q.question}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              {q.options.map((opt: string, idx: number) => {
                let bg = "var(--bg)";
                let border = "1px solid var(--border)";
                let color = "var(--text)";
                let fontWeight = "500";

                if (answered) {
                  if (idx === q.correct) {
                    bg = "#10b98122"; border = "2px solid #10b981"; color = "#059669"; fontWeight = "700";
                  }
                  else if (idx === selectedAnswer && idx !== q.correct) {
                    bg = "#ef444422"; border = "2px solid #ef4444"; color = "#dc2626"; fontWeight = "700";
                  }
                } else if (idx === selectedAnswer) {
                  bg = "var(--accent-bg)"; border = "2px solid var(--accent)"; color = "var(--accent)"; fontWeight = "700";
                }

                return (
                  <button key={idx} onClick={() => handleAnswer(idx)} style={{
                    background: bg, border, borderRadius: "16px", padding: "18px 24px",
                    color, fontSize: "16px", textAlign: "left", cursor: answered ? "default" : "pointer",
                    transition: "all 0.2s", lineHeight: 1.4, fontWeight, boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                  }}>
                    <span style={{ opacity: 0.4, marginRight: "12px", fontWeight: "800", fontSize: "13px" }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {!answered && (
              <div style={{
                background: "var(--code-bg)",
                border: "1px solid var(--border)",
                borderRadius: "20px", padding: "28px 32px", marginBottom: "32px",
              }}>
                <p style={{ fontSize: "13px", color: "var(--text)", opacity: 0.6, marginBottom: "20px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Wie sicher bist du dir?
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {CONFIDENCE_LABELS.map(c => (
                    <button key={c.value} onClick={() => setSelectedConfidence(c.value)} style={{
                      background: selectedConfidence === c.value ? "var(--accent)" : "var(--bg)",
                      border: selectedConfidence === c.value ? "1px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: "12px", padding: "10px 18px",
                      color: selectedConfidence === c.value ? "#fff" : "var(--text)",
                      fontSize: "14px", cursor: "pointer", transition: "all 0.2s", fontWeight: "600",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                    }}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!answered ? (
              <button onClick={confirmAnswer} disabled={selectedAnswer === null || selectedConfidence === null} style={{
                background: (selectedAnswer !== null && selectedConfidence !== null) ? "var(--accent)" : "var(--border)",
                color: "#fff", border: "none", borderRadius: "12px", padding: "16px 32px", fontSize: "16px",
                cursor: (selectedAnswer !== null && selectedConfidence !== null) ? "pointer" : "default",
                fontWeight: "700", transition: "all 0.2s", width: "100%", maxWidth: "260px",
                boxShadow: (selectedAnswer !== null && selectedConfidence !== null) ? "0 4px 14px var(--accent-bg)" : "none",
              }}>
                Antwort bestätigen
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{
                  background: answers[answers.length - 1]?.correct ? "#10b98115" : "#ef444415",
                  border: `1px solid ${answers[answers.length - 1]?.correct ? "#10b981" : "#ef4444"}`,
                  borderRadius: "16px", padding: "20px", fontSize: "16px", fontWeight: "600",
                  color: answers[answers.length - 1]?.correct ? "#059669" : "#dc2626",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span>
                    {answers[answers.length - 1]?.correct ? "✓ Super, das war richtig!" : "✗ Schade, das war leider falsch."}
                  </span>
                  <span style={{ fontSize: "14px", opacity: 0.8 }}>
                    Selbstvertrauen: {CONFIDENCE_LABELS.find(c => c.value === answers[answers.length - 1]?.confidence)?.label}
                  </span>
                </div>
                <button onClick={nextQuestion} style={{
                  background: "var(--accent)", color: "#fff", border: "none", borderRadius: "12px",
                  padding: "16px 32px", fontSize: "16px", cursor: "pointer",
                  fontWeight: "700", width: "100%", maxWidth: "260px", alignSelf: "flex-end",
                  boxShadow: "0 4px 14px var(--accent-bg)",
                }}>
                  {currentQ < questions.length - 1 ? "Nächste Frage →" : "Endergebnis anzeigen →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div style={{ fontSize: "80px", marginBottom: "24px" }}>
                {currentPhase.name === "Mount of Stupidity"
                  ? "🏔️"
                  : currentPhase.name === "Valley of Despair"
                    ? "😬"
                    : currentPhase.name === "Slope of Enlightenment"
                      ? "🎯"
                      : "🧙‍♂️"}
              </div>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: "800", marginBottom: "12px", color: "var(--text-h)" }}>
                {playerName}, dein Ergebnis
              </h2>
              {activeSet && (
                <div style={{ fontSize: "14px", color: "var(--accent)", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>
                  {activeSet.emoji} {activeSet.label}
                </div>
              )}
              <div style={{
                display: "inline-block",
                background: `${currentPhase.color}15`,
                border: `2px solid ${currentPhase.color}`,
                borderRadius: "12px", padding: "8px 24px", fontSize: "16px",
                color: currentPhase.color, marginBottom: "20px", fontWeight: "800",
              }}>
                {currentPhase.name}
              </div>
              <p style={{ color: "var(--text)", fontSize: "18px", maxWidth: "540px", margin: "0 auto", lineHeight: 1.6, opacity: 0.8 }}>
                {currentPhase.desc}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
              {[
                { label: "Richtige Antworten", value: `${accuracy}%`, sub: `${answers.filter(a => a.correct).length}/${answers.length} korrekt`, color: "#10b981" },
                { label: "Ø Selbstvertrauen", value: `${confidencePct}%`, sub: `${avgConfidence.toFixed(1)} von 5`, color: "var(--accent)" },
                { label: "Kalibrierung", value: `${overconfidenceScore > 0 ? "+" : ""}${overconfidenceScore}%`, sub: overconfidenceScore > 0 ? "zu selbstsicher" : overconfidenceScore < -5 ? "zu bescheiden" : "perfekt!", color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: "20px", padding: "24px", textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}>
                  <div style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px", color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-h)", fontWeight: "700", letterSpacing: "0.5px", marginBottom: "4px" }}>{s.label}</div>
                  <div style={{ fontSize: "13px", color: "var(--text)", opacity: 0.6 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: "var(--code-bg)", border: "1px solid var(--border)",
              borderRadius: "24px", padding: "32px", marginBottom: "32px",
            }}>
              <p style={{ fontSize: "13px", color: "var(--text)", opacity: 0.6, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: "700", marginBottom: "24px" }}>
                Deine Position auf der Kurve
              </p>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "60px", marginBottom: "16px" }}>
                {DK_PHASES.map(p => {
                  const isActive = p.name === currentPhase.name;
                  return (
                    <div key={p.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "100%",
                        height: isActive ? "24px" : "8px",
                        borderRadius: "10px",
                        background: isActive ? p.color : "var(--border)",
                        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        boxShadow: isActive ? `0 4px 12px ${p.color}44` : "none",
                      }} />
                      <div style={{ fontSize: "11px", fontWeight: isActive ? "800" : "600", color: isActive ? p.color : "var(--text)", opacity: isActive ? 1 : 0.4, textAlign: "center", lineHeight: 1.2 }}>
                        {p.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: "24px", padding: "32px", marginBottom: "32px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            }}>
              <p style={{ fontSize: "13px", color: "var(--text)", opacity: 0.6, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: "700", marginBottom: "20px" }}>
                Detaillierte Analyse
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {answers.map((a, i) => {
                  const conf = CONFIDENCE_LABELS.find(c => c.value === a.confidence);
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "16px",
                      padding: "14px 20px", borderRadius: "12px",
                      background: a.correct ? "#10b98108" : "#ef444408",
                      border: `1px solid ${a.correct ? "#10b98122" : "#ef444422"}`,
                    }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: a.correct ? "#10b981" : "#ef4444",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "14px", fontWeight: "800"
                      }}>
                        {a.correct ? "✓" : "✗"}
                      </div>
                      <span style={{ flex: 1, fontSize: "15px", fontWeight: "600", color: "var(--text-h)" }}>Frage {i + 1}</span>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text)", opacity: 0.7 }}>{conf?.emoji} {conf?.label}</span>
                      {a.correct && a.confidence <= 2 && (
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#f59e0b", background: "#f59e0b15", padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase" }}>zu bescheiden</span>
                      )}
                      {!a.correct && a.confidence >= 4 && (
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#ef4444", background: "#ef444415", padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase" }}>überschätzt</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              borderRadius: "20px", padding: "28px", marginBottom: "40px",
            }}>
              <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: "800", marginBottom: "12px", letterSpacing: "2px", textTransform: "uppercase" }}>
                💡 Analyse
              </p>
              <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text-h)", margin: 0, fontWeight: "500" }}>
                {getPhaseAnalysisText(currentPhase.name)}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={resetGame} style={{
                background: "var(--bg)", color: "var(--text)",
                border: "2px solid var(--border)", borderRadius: "12px",
                padding: "16px 32px", fontSize: "15px", cursor: "pointer", fontWeight: "700",
                transition: "all 0.2s",
              }}>
                ↺ Nochmal von vorn
              </button>
              {activeSet && Object.values(QUESTION_SETS).filter(s => s.id !== activeSet.id).map(other => (
                <button key={other.id} onClick={() => {
                  setSelectedSet(other.id);
                  setCurrentQ(0); setAnswers([]); setSelectedAnswer(null);
                  setSelectedConfidence(null); setAnswered(false);
                  setPhase("quiz");
                }} style={{
                  background: "var(--accent)",
                  color: "#fff", border: "none",
                  borderRadius: "12px", padding: "16px 32px", fontSize: "15px",
                  cursor: "pointer", fontWeight: "700", transition: "all 0.2s",
                  boxShadow: "0 4px 14px var(--accent-bg)",
                }}>
                  {other.emoji} {other.label} testen
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "40px", fontSize: "12px", color: "var(--text)", opacity: 0.4, textAlign: "center", fontWeight: "500" }}>
        Basierend auf Kruger & Dunning, 1999 · Journal of Personality and Social Psychology
      </div>
    </div>
  );
}
