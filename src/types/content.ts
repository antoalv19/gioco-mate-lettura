export type Difficulty = 'facile' | 'medio' | 'difficile';
export type Mode = 'somma' | 'sottrazione' | 'lettura' | 'scrittura' | 'pratica';

export interface FunFact { id: string; category: string; text: string; difficulty: Difficulty }
export interface MathQuestion { id: string; difficulty: Difficulty; question: string; operation: 'addition' | 'subtraction'; operands: [number, number]; correctAnswer: number; answers: number[]; visual?: string[] }
export interface ReadingExercise { id: string; type: 'letter' | 'syllable' | 'word-to-emoji' | 'emoji-to-word'; difficulty: Difficulty; prompt: string; display: string; correctAnswer: string; answers: string[] }
export interface WritingExercise { id: string; word: string; emoji: string; category: string; difficulty: Difficulty; syllables: string[]; listenAndWrite: boolean; completeWord: { masked: string; missingLetters: string[] } }
export interface PracticeLesson { id: string; area: 'somme' | 'sottrazioni' | 'lettura' | 'scrittura'; difficulty: Difficulty; title: string; explanation: string; example: string; visual: string[]; question: string; answers: Array<string | number>; correctAnswer: string | number }
export interface GameContent { funFacts: FunFact[]; addition: MathQuestion[]; subtraction: MathQuestion[]; reading: ReadingExercise[]; writing: WritingExercise[]; practiceLessons: PracticeLesson[] }
