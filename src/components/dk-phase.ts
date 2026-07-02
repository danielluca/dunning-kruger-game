export type DKPhase = {
  name: string;
  range: [number, number];
  color: string;
  desc: string;
};

export const DK_PHASES: DKPhase[] = [
  { name: "Mount of Stupidity", range: [0, 30], color: "#e74c3c", desc: "Wenig Wissen, hohes Selbstvertrauen — die gefährlichste Zone." },
  { name: "Valley of Despair", range: [30, 55], color: "#e67e22", desc: "Erkenntnis wächst, Selbstvertrauen sinkt — das echte Lernen beginnt." },
  { name: "Slope of Enlightenment", range: [55, 80], color: "#f1c40f", desc: "Wissen und Selbsteinschätzung nähern sich an." },
  { name: "Plateau of Sustainability", range: [80, 100], color: "#2ecc71", desc: "Wissen und Selbstvertrauen sind im Einklang — echter Experte." },
];

export function getPhase(accuracy: number, avgConfidence: number): DKPhase {
  const confidencePct = (avgConfidence / 5) * 100;
  const overconfidence = confidencePct - accuracy;

  // High confidence plus low knowledge is the classic overconfidence peak.
  if (accuracy < 50 && confidencePct >= 70) return DK_PHASES[0];

  // Strong knowledge with reasonably calibrated confidence maps to sustainable expertise.
  if (accuracy >= 80 && confidencePct >= 70 && Math.abs(overconfidence) <= 20) return DK_PHASES[3];

  // Low confidence (or clear underconfidence) often indicates the valley phase.
  if ((accuracy < 60 && confidencePct < 60) || overconfidence < -15) return DK_PHASES[1];

  // Remaining profiles are typically in active learning/calibration.
  return DK_PHASES[2];
}

export function getPhaseAnalysisText(phaseName: string): string {
  if (phaseName === "Mount of Stupidity") {
    return "Du warst sehr sicher, obwohl noch einige Wissenslücken da sind. Das ist der klassische Startpunkt: gut sichtbar, aber auch gut korrigierbar durch Feedback und Übung.";
  }
  if (phaseName === "Valley of Despair") {
    return "Du schätzt dich aktuell eher vorsichtig ein. Genau diese Nüchternheit ist oft der Moment, in dem nachhaltiges Lernen richtig Fahrt aufnimmt.";
  }
  if (phaseName === "Plateau of Sustainability") {
    return "Starke Trefferquote und gut kalibriertes Selbstvertrauen: Wissen und Selbsteinschätzung sind in guter Balance. Das ist ein belastbares Expertenprofil.";
  }
  return "Du bist klar auf dem Lernpfad: Das Wissen wächst und deine Selbsteinschätzung wird zunehmend präziser. Genau hier entsteht echte Kompetenz.";
}
