import { useState } from "react";

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
};

const CONFIDENCE_LABELS = [
  { value: 1, label: "Keine Ahnung", emoji: "🤷" },
  { value: 2, label: "Unsicher", emoji: "😕" },
  { value: 3, label: "Mittel", emoji: "🤔" },
  { value: 4, label: "Ziemlich sicher", emoji: "😌" },
  { value: 5, label: "Absolut sicher", emoji: "💪" },
];

const DK_PHASES = [
  { name: "Mount of Stupidity", range: [0, 30], color: "#e74c3c", desc: "Wenig Wissen, hohes Selbstvertrauen — die gefährlichste Zone." },
  { name: "Valley of Despair", range: [30, 55], color: "#e67e22", desc: "Erkenntnis wächst, Selbstvertrauen sinkt — das echte Lernen beginnt." },
  { name: "Slope of Enlightenment", range: [55, 80], color: "#f1c40f", desc: "Wissen und Selbsteinschätzung nähern sich an." },
  { name: "Plateau of Sustainability", range: [80, 100], color: "#2ecc71", desc: "Wissen und Selbstvertrauen sind im Einklang — echter Experte." },
];

function getPhase(accuracy: number, avgConfidence: number) {
  const overconfidence = (avgConfidence / 5) * 100 - accuracy;
  if (overconfidence > 35) return DK_PHASES[0];
  if (overconfidence > 10) return DK_PHASES[1];
  if (overconfidence > -10) return DK_PHASES[2];
  return DK_PHASES[3];
}

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
    if (selectedAnswer === null || selectedConfidence === null || !q) return;
    const correct = selectedAnswer === q.correct;
    setAnswers([...answers, { correct, confidence: selectedConfidence, questionId: q.id }]);
    setAnswered(true);
  }

  function nextQuestion() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setSelectedConfidence(null);
      setAnswered(false);
    } else {
      setPhase("result");
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
      background: "linear-gradient(135deg, #0f0c29, #1a1a2e, #16213e)",
      fontFamily: "'Georgia', serif",
      color: "#e8e8f0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Header */}
      <div style={{
        width: "100%",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxSizing: "border-box",
      }}>
        <span style={{ fontSize: "20px" }}>🧠</span>
        <span style={{ fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
          Dunning–Kruger Experiment
        </span>
        {phase === "quiz" && activeSet && (
          <>
            <span style={{
              marginLeft: "8px", fontSize: "11px", fontFamily: "monospace",
              color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.05)",
              padding: "3px 10px", borderRadius: "6px",
            }}>
              {activeSet.emoji} {activeSet.label}
            </span>
            <span style={{ marginLeft: "auto", fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
              {currentQ + 1} / {questions.length}
            </span>
          </>
        )}
      </div>

      <div style={{ width: "100%", maxWidth: "720px", padding: "40px 24px", boxSizing: "border-box" }}>

        {/* INTRO */}
        {phase === "intro" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🏔️</div>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "700", lineHeight: 1.2, marginBottom: "12px", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Weißt du, was du weißt?
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.55)", maxWidth: "480px", margin: "0 auto 32px", lineHeight: 1.7 }}>
              Beantworte {questions.length || 8} Fragen und schätze dabei ein, wie sicher du dir bist.
              Am Ende siehst du, wo du auf der Dunning-Kruger-Kurve landest.
            </p>

            {/* Category selection */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "14px" }}>
                Thema wählen
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                {Object.values(QUESTION_SETS).map(set => (
                  <button key={set.id} onClick={() => setSelectedSet(set.id)} style={{
                    background: selectedSet === set.id
                      ? "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(37,99,235,0.25))"
                      : "rgba(255,255,255,0.04)",
                    border: selectedSet === set.id
                      ? "1px solid #7c3aed"
                      : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "14px",
                    padding: "20px 28px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "center",
                    minWidth: "180px",
                    fontFamily: "inherit",
                  }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{set.emoji}</div>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: selectedSet === set.id ? "#fff" : "rgba(255,255,255,0.7)", marginBottom: "4px" }}>
                      {set.label}
                    </div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                      {set.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* DK phases info */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "22px 28px",
              marginBottom: "32px",
              textAlign: "left",
            }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px", fontFamily: "monospace" }}>
                Die vier Phasen
              </p>
              {DK_PHASES.map(p => (
                <div key={p.name} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.color, flexShrink: 0, marginTop: "5px" }} />
                  <div>
                    <span style={{ fontWeight: "600", fontSize: "14px" }}>{p.name}</span>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}> — {p.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && startGame()}
                placeholder="Dein Name oder Kürzel …"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  padding: "14px 20px",
                  color: "#fff",
                  fontSize: "16px",
                  width: "300px",
                  outline: "none",
                  textAlign: "center",
                  fontFamily: "inherit",
                }}
              />
              <button onClick={startGame} disabled={!nameInput.trim() || !selectedSet} style={{
                background: (nameInput.trim() && selectedSet) ? "linear-gradient(90deg, #7c3aed, #2563eb)" : "rgba(255,255,255,0.08)",
                color: (nameInput.trim() && selectedSet) ? "#fff" : "rgba(255,255,255,0.3)",
                border: "none",
                borderRadius: "10px",
                padding: "14px 36px",
                fontSize: "16px",
                cursor: (nameInput.trim() && selectedSet) ? "pointer" : "default",
                fontWeight: "600",
                letterSpacing: "0.5px",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}>
                {!selectedSet ? "Zuerst ein Thema wählen" : "Experiment starten →"}
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === "quiz" && q && (
          <div>
            <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginBottom: "36px" }}>
              <div style={{
                height: "100%",
                width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%`,
                background: "linear-gradient(90deg, #7c3aed, #2563eb)",
                borderRadius: "2px",
                transition: "width 0.4s ease",
              }} />
            </div>

            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "28px",
              marginBottom: "24px",
            }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
                <span style={{
                  fontSize: "11px", fontFamily: "monospace", letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: q.difficulty === "leicht" ? "#2ecc71" : q.difficulty === "mittel" ? "#f1c40f" : "#e74c3c",
                  background: "rgba(255,255,255,0.05)", padding: "3px 10px", borderRadius: "6px",
                }}>
                  {q.difficulty}
                </span>
              </div>
              <p style={{ fontSize: "clamp(15px, 2.5vw, 18px)", lineHeight: 1.6, fontWeight: "500", margin: 0 }}>
                {q.question}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {q.options.map((opt: string, idx: number) => {
                let bg = "rgba(255,255,255,0.04)";
                let border = "1px solid rgba(255,255,255,0.08)";
                let color = "#e8e8f0";
                if (answered) {
                  if (idx === q.correct) { bg = "rgba(46,204,113,0.15)"; border = "1px solid #2ecc71"; color = "#2ecc71"; }
                  else if (idx === selectedAnswer && idx !== q.correct) { bg = "rgba(231,76,60,0.15)"; border = "1px solid #e74c3c"; color = "#e74c3c"; }
                } else if (idx === selectedAnswer) {
                  bg = "rgba(124,58,237,0.2)"; border = "1px solid #7c3aed";
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)} style={{
                    background: bg, border, borderRadius: "10px", padding: "14px 18px",
                    color, fontSize: "14px", textAlign: "left", cursor: answered ? "default" : "pointer",
                    transition: "all 0.2s", lineHeight: 1.5, fontFamily: "inherit",
                  }}>
                    <span style={{ opacity: 0.5, marginRight: "10px", fontFamily: "monospace", fontSize: "12px" }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {!answered && (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px", padding: "20px 24px", marginBottom: "20px",
              }}>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "14px", fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Wie sicher bist du dir?
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {CONFIDENCE_LABELS.map(c => (
                    <button key={c.value} onClick={() => setSelectedConfidence(c.value)} style={{
                      background: selectedConfidence === c.value ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)",
                      border: selectedConfidence === c.value ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px", padding: "8px 14px", color: "#e8e8f0",
                      fontSize: "13px", cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                    }}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!answered ? (
              <button onClick={confirmAnswer} disabled={selectedAnswer === null || selectedConfidence === null} style={{
                background: (selectedAnswer !== null && selectedConfidence !== null) ? "linear-gradient(90deg, #7c3aed, #2563eb)" : "rgba(255,255,255,0.06)",
                color: (selectedAnswer !== null && selectedConfidence !== null) ? "#fff" : "rgba(255,255,255,0.25)",
                border: "none", borderRadius: "10px", padding: "13px 28px", fontSize: "15px",
                cursor: (selectedAnswer !== null && selectedConfidence !== null) ? "pointer" : "default",
                fontWeight: "600", transition: "all 0.2s", fontFamily: "inherit",
              }}>
                Antwort bestätigen
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  flex: 1,
                  background: answers[answers.length - 1]?.correct ? "rgba(46,204,113,0.1)" : "rgba(231,76,60,0.1)",
                  border: `1px solid ${answers[answers.length - 1]?.correct ? "#2ecc71" : "#e74c3c"}`,
                  borderRadius: "10px", padding: "12px 16px", fontSize: "14px",
                  color: answers[answers.length - 1]?.correct ? "#2ecc71" : "#e74c3c",
                }}>
                  {answers[answers.length - 1]?.correct ? "✓ Richtig!" : "✗ Leider falsch."}
                  {" "}Dein Selbstvertrauen: {CONFIDENCE_LABELS.find(c => c.value === answers[answers.length - 1]?.confidence)?.label}
                </div>
                <button onClick={nextQuestion} style={{
                  background: "linear-gradient(90deg, #7c3aed, #2563eb)",
                  color: "#fff", border: "none", borderRadius: "10px",
                  padding: "12px 22px", fontSize: "14px", cursor: "pointer",
                  fontWeight: "600", fontFamily: "inherit", whiteSpace: "nowrap",
                }}>
                  {currentQ < questions.length - 1 ? "Weiter →" : "Auswertung →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <div style={{ fontSize: "52px", marginBottom: "16px" }}>
                {overconfidenceScore > 35 ? "🏔️" : overconfidenceScore > 10 ? "😬" : overconfidenceScore > -10 ? "🎯" : "🧙‍♂️"}
              </div>
              <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "700", marginBottom: "8px" }}>
                {playerName}, dein Ergebnis
              </h2>
              {activeSet && (
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "12px", fontFamily: "monospace" }}>
                  {activeSet.emoji} {activeSet.label}
                </div>
              )}
              <div style={{
                display: "inline-block",
                background: `${currentPhase.color}22`,
                border: `1px solid ${currentPhase.color}`,
                borderRadius: "8px", padding: "6px 16px", fontSize: "14px",
                color: currentPhase.color, marginBottom: "8px", fontWeight: "600",
              }}>
                {currentPhase.name}
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", maxWidth: "400px", margin: "8px auto 0", lineHeight: 1.6 }}>
                {currentPhase.desc}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "Richtige Antworten", value: `${accuracy}%`, sub: `${answers.filter(a => a.correct).length}/${answers.length} korrekt` },
                { label: "Ø Selbstvertrauen", value: `${confidencePct}%`, sub: `${avgConfidence.toFixed(1)} von 5` },
                { label: "Überschätzung", value: `${overconfidenceScore > 0 ? "+" : ""}${overconfidenceScore}%`, sub: overconfidenceScore > 0 ? "zu selbstsicher" : overconfidenceScore < -5 ? "zu bescheiden" : "gut kalibriert" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px", padding: "18px 14px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "700", marginBottom: "4px" }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px", marginBottom: "4px" }}>{s.label}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "24px", marginBottom: "24px",
            }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "16px" }}>
                Wo du auf der Kurve stehst
              </p>
              <div style={{ display: "flex", gap: "6px" }}>
                {DK_PHASES.map(p => (
                  <div key={p.name} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      height: "8px", borderRadius: "4px",
                      background: p.name === currentPhase.name ? p.color : `${p.color}44`,
                      marginBottom: "8px",
                      transform: p.name === currentPhase.name ? "scaleY(2)" : "scaleY(1)",
                      transformOrigin: "center", transition: "all 0.3s",
                    }} />
                    <div style={{ fontSize: "10px", color: p.name === currentPhase.name ? p.color : "rgba(255,255,255,0.25)", lineHeight: 1.3 }}>
                      {p.name.split(" ").slice(0, 2).join(" ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "20px 24px", marginBottom: "24px",
            }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "14px" }}>
                Frage für Frage
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {answers.map((a, i) => {
                  const conf = CONFIDENCE_LABELS.find(c => c.value === a.confidence);
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 14px", borderRadius: "8px",
                      background: a.correct ? "rgba(46,204,113,0.07)" : "rgba(231,76,60,0.07)",
                    }}>
                      <span style={{ fontSize: "13px", color: a.correct ? "#2ecc71" : "#e74c3c", fontFamily: "monospace", width: "20px" }}>
                        {a.correct ? "✓" : "✗"}
                      </span>
                      <span style={{ flex: 1, fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Frage {i + 1}</span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{conf?.emoji} {conf?.label}</span>
                      {a.correct && a.confidence <= 2 && (
                        <span style={{ fontSize: "11px", color: "#f1c40f", background: "rgba(241,196,15,0.1)", padding: "2px 8px", borderRadius: "4px" }}>zu bescheiden</span>
                      )}
                      {!a.correct && a.confidence >= 4 && (
                        <span style={{ fontSize: "11px", color: "#e74c3c", background: "rgba(231,76,60,0.1)", padding: "2px 8px", borderRadius: "4px" }}>überschätzt</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: "12px", padding: "20px 22px", marginBottom: "24px",
            }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "8px", fontFamily: "monospace", letterSpacing: "1px" }}>
                💡 ERKENNTNIS
              </p>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                {overconfidenceScore > 35
                  ? "Du hast dich deutlich überschätzt — das ist der klassische 'Mount Stupid'. Das Gute: Wer das erkennt, ist auf dem Weg zum echten Lernen."
                  : overconfidenceScore > 10
                    ? "Kleines Missverhältnis zwischen Selbstvertrauen und tatsächlichem Wissen — du bist auf dem Weg in das Valley of Despair. Das ist gut: Hier beginnt echtes Lernen."
                    : overconfidenceScore > -10
                      ? "Deine Selbsteinschätzung trifft dein Wissen gut — das ist Kalibrierung auf dem Plateau der Erleuchtung."
                      : "Du hast dich eher unterschätzt — Imposter Syndrome? Du weißt mehr als du denkst."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={resetGame} style={{
                background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
                padding: "12px 24px", fontSize: "14px", cursor: "pointer", fontFamily: "inherit",
              }}>
                ↺ Nochmal / anderes Thema
              </button>
              {activeSet && Object.values(QUESTION_SETS).filter(s => s.id !== activeSet.id).map(other => (
                <button key={other.id} onClick={() => {
                  setSelectedSet(other.id);
                  setCurrentQ(0); setAnswers([]); setSelectedAnswer(null);
                  setSelectedConfidence(null); setAnswered(false);
                  setPhase("quiz");
                }} style={{
                  background: "linear-gradient(90deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2))",
                  color: "rgba(255,255,255,0.7)", border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: "10px", padding: "12px 24px", fontSize: "14px",
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  {other.emoji} {other.label} ausprobieren
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "24px", fontSize: "11px", color: "rgba(255,255,255,0.15)", textAlign: "center", fontFamily: "monospace" }}>
        Basierend auf Kruger & Dunning, 1999 · Journal of Personality and Social Psychology
      </div>
    </div>
  );
}
