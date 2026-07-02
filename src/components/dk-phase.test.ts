import { describe, expect, it } from "vitest";

import { getPhase } from "./dk-phase";

type Case = {
  name: string;
  accuracy: number;
  avgConfidence: number;
  expectedPhase: string;
};

const CASES: Case[] = [
  {
    name: "high knowledge + high confidence is plateau, not mount",
    accuracy: 88,
    avgConfidence: 4.6,
    expectedPhase: "Plateau of Sustainability",
  },
  {
    name: "low knowledge + high confidence maps to mount",
    accuracy: 35,
    avgConfidence: 4.5,
    expectedPhase: "Mount of Stupidity",
  },
  {
    name: "low confidence while learning maps to valley",
    accuracy: 52,
    avgConfidence: 2.3,
    expectedPhase: "Valley of Despair",
  },
  {
    name: "mid knowledge + calibrated confidence maps to slope",
    accuracy: 68,
    avgConfidence: 3.4,
    expectedPhase: "Slope of Enlightenment",
  },
  {
    name: "strong underconfidence maps to valley",
    accuracy: 82,
    avgConfidence: 2.6,
    expectedPhase: "Valley of Despair",
  },
];

describe("getPhase", () => {
  it.each(CASES)("$name", ({ accuracy, avgConfidence, expectedPhase }: Case) => {
    const phase = getPhase(accuracy, avgConfidence);
    expect(phase.name).toBe(expectedPhase);
  });
});
