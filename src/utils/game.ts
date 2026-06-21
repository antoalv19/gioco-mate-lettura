import type { Difficulty, MathQuestion } from '../types/content';

export const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
export const shuffle = <T,>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);
export const byDifficulty = <T extends { difficulty: Difficulty }>(items: T[], difficulty: Difficulty) => items.filter(item => item.difficulty === difficulty);
export const normalizeAnswer = (value: string) => value.trim().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

const ranges: Record<Difficulty, number> = { facile: 10, medio: 20, difficile: 30 };
const choiceCounts: Record<Difficulty, number> = { facile: 4, medio: 4, difficile: 4 };

export function generateWrongAnswers(correct: number, count: number, max: number) {
  const values = new Set<number>();
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4]);
  for (const offset of offsets) {
    const candidate = correct + offset;
    if (candidate >= 0 && candidate <= max * 2 && candidate !== correct) values.add(candidate);
    if (values.size === count) break;
  }
  for (let candidate = 0; values.size < count; candidate++) if (candidate !== correct) values.add(candidate);
  return [...values];
}

export function ensureFourAnswers(question: MathQuestion): MathQuestion {
  const max = ranges[question.difficulty];
  const wrongAnswers = new Set(question.answers.filter(value => value !== question.correctAnswer));
  for (const value of generateWrongAnswers(question.correctAnswer, 8, max)) {
    wrongAnswers.add(value);
    if (wrongAnswers.size === 3) break;
  }
  return {
    ...question,
    answers: shuffle([question.correctAnswer, ...[...wrongAnswers].slice(0, 3)]),
  };
}

export function generateMathQuestion(operation: 'addition' | 'subtraction', difficulty: Difficulty): MathQuestion {
  const max = ranges[difficulty];
  let a = 1 + Math.floor(Math.random() * max);
  let b = 1 + Math.floor(Math.random() * max);
  if (operation === 'subtraction' && b > a) [a, b] = [b, a];
  if (operation === 'addition' && a + b > max) b = Math.max(1, max - a);
  const correctAnswer = operation === 'addition' ? a + b : a - b;
  const answers = shuffle([correctAnswer, ...generateWrongAnswers(correctAnswer, choiceCounts[difficulty] - 1, max)]);
  const symbol = operation === 'addition' ? '+' : '−';
  return { id: `dynamic-${Date.now()}-${Math.random()}`, difficulty, question: `Quanto fa ${a} ${symbol} ${b}?`, operation, operands: [a, b], correctAnswer, answers };
}

export function speakItalian(text: string): boolean {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'it-IT';
  utterance.rate = 0.8;
  const italian = window.speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase().startsWith('it'));
  if (italian) utterance.voice = italian;
  window.speechSynthesis.speak(utterance);
  return true;
}
