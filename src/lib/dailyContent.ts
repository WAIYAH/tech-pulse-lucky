import { softwareEngineeringGlossary, type GlossaryTerm } from "@/data/softwareEngineeringGlossary";
import { didYouKnowFacts } from "@/data/didYouKnowFacts";

const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diffMs = date.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const getWeekOfYear = (date: Date): number => {
  return Math.floor(getDayOfYear(date) / 7);
};

export const getWordOfTheDay = (referenceDate: Date = new Date()): GlossaryTerm => {
  const index = getDayOfYear(referenceDate) % softwareEngineeringGlossary.length;
  return softwareEngineeringGlossary[index];
};

export const getDidYouKnowOfTheWeek = (referenceDate: Date = new Date()): string => {
  const index = getWeekOfYear(referenceDate) % didYouKnowFacts.length;
  return didYouKnowFacts[index];
};
