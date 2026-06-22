import type { Difficulty, FunFact, LearnToReadExercise, MathQuestion, PracticeLesson, ReadingExercise, WritingExercise } from '../types/content';

const difficulties: Difficulty[] = ['facile', 'medio', 'difficile'];
const isDifficulty = (value: unknown): value is Difficulty => difficulties.includes(value as Difficulty);
const warn = (kind: string, item: unknown) => console.warn(`[Contenuti] ${kind} ignorato perché non valido`, item);

export function validateMath(items: unknown, operation: 'addition' | 'subtraction'): MathQuestion[] {
  if (!Array.isArray(items)) return [];
  return items.filter((raw): raw is MathQuestion => {
    const item = raw as Partial<MathQuestion>;
    const valid = Boolean(item.id && isDifficulty(item.difficulty) && item.operation === operation && Array.isArray(item.operands) && item.operands.length === 2 && typeof item.correctAnswer === 'number' && Array.isArray(item.answers) && item.answers.includes(item.correctAnswer) && (operation !== 'subtraction' || (item.operands[0] ?? 0) >= (item.operands[1] ?? 0)));
    if (!valid) warn(operation, raw);
    return valid;
  });
}

export function validateFacts(items: unknown): FunFact[] {
  if (!Array.isArray(items)) return [];
  return items.filter((raw): raw is FunFact => {
    const item = raw as Partial<FunFact>; const valid = Boolean(item.id && item.text && isDifficulty(item.difficulty));
    if (!valid) warn('curiosità', raw); return valid;
  });
}
export function validateReading(items: unknown): ReadingExercise[] {
  if (!Array.isArray(items)) return [];
  return items.filter((raw): raw is ReadingExercise => {
    const item = raw as Partial<ReadingExercise>; const type = (raw as { type?: string }).type;
    if (type === 'letter') return false;
    const allowedTypes = ['syllable', 'word-to-emoji', 'emoji-to-word', 'sentence-to-emoji'];
    const valid = Boolean(item.id && type && allowedTypes.includes(type) && isDifficulty(item.difficulty) && item.prompt && item.display && item.correctAnswer != null && Array.isArray(item.answers) && item.answers.includes(item.correctAnswer));
    if (!valid) warn('lettura', raw); return valid;
  });
}
export function validateWriting(items: unknown): WritingExercise[] {
  if (!Array.isArray(items)) return [];
  return items.filter((raw): raw is WritingExercise => {
    const item = raw as Partial<WritingExercise>; const valid = Boolean(item.id && item.word && isDifficulty(item.difficulty) && item.emoji && Array.isArray(item.syllables) && item.completeWord?.masked);
    if (!valid) warn('scrittura', raw); return valid;
  });
}
export function validatePractice(items: unknown): PracticeLesson[] {
  if (!Array.isArray(items)) return [];
  return items.filter((raw): raw is PracticeLesson => {
    const item = raw as Partial<PracticeLesson>; const valid = Boolean(item.id && item.area && isDifficulty(item.difficulty) && item.title && item.explanation && item.question && Array.isArray(item.answers) && item.answers.includes(item.correctAnswer!));
    if (!valid) warn('pratica', raw); return valid;
  });
}

export function validateLearnToRead(items: unknown): LearnToReadExercise[] {
  if (!Array.isArray(items)) return [];
  const activities = ['letter-sound', 'syllable-word', 'word-to-image', 'image-to-word', 'two-word', 'sentence-to-image', 'image-to-sentence', 'build-sentence', 'complete-sentence', 'same-different'];
  return items.filter((raw): raw is LearnToReadExercise => {
    const item = raw as Partial<LearnToReadExercise>;
    const valid = Boolean(item.id && typeof item.level === 'number' && item.level >= 1 && item.level <= 10 && item.levelTitle && isDifficulty(item.difficulty) && item.activity && activities.includes(item.activity) && item.prompt && item.display && Array.isArray(item.options) && item.options.length >= 2 && typeof item.correctAnswer === 'string' && (item.activity === 'build-sentence' || item.options.includes(item.correctAnswer)) && item.hint);
    if (!valid) warn('imparo-a-leggere', raw); return valid;
  });
}
