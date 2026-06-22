import { useMemo, useState } from 'react';
import type { Difficulty, FunFact, ReadingExercise } from '../types/content';
import { byDifficulty, normalizeAnswer, randomItem, shuffle } from '../utils/game';
import { Feedback, GameLayout, ReadAloudButton } from './Common';

export function ReadingGame({ difficulty, exercises, facts, score, best, onCorrect, onHome, onRequestNext, contextLabel }: { difficulty: Difficulty; exercises: ReadingExercise[]; facts: FunFact[]; score: number; best: number; onCorrect: () => void; onHome: () => void; onRequestNext?: () => void; contextLabel?: string }) {
  const available = useMemo(() => byDifficulty(exercises, difficulty), [exercises, difficulty]);
  const [exercise, setExercise] = useState(() => randomItem(available)); const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null); const [fact, setFact] = useState('');
  if (!exercise) return <GameLayout score={score} best={best} onHome={onHome} title="Lettura" icon="📖"><p className="empty-message">Questi esercizi stanno arrivando! Prova un altro livello.</p></GameLayout>;
  const answer = (value: string) => { if (feedback === 'correct') return; if (normalizeAnswer(value) === normalizeAnswer(exercise.correctAnswer)) { setFeedback('correct'); setFact(facts.length ? randomItem(facts).text : 'Le parole sono piccoli ponti per nuove storie!'); onCorrect(); } else setFeedback('wrong'); };
  const next = () => { if (onRequestNext) { onRequestNext(); return; } const item = randomItem(available); setExercise({ ...item, answers: shuffle(item.answers) }); setFeedback(null); };
  const spoken = exercise.type === 'word-to-emoji' || exercise.type === 'sentence-to-emoji' ? exercise.display : `${exercise.prompt} ${exercise.display}`;
  const lowercase = exercise.display !== exercise.display.toUpperCase();
  const sentence = exercise.type === 'sentence-to-emoji';
  return <GameLayout score={score} best={best} onHome={onHome} title="Lettura" icon="📖">{contextLabel && <div className="mix-badge">🔀 {contextLabel}</div>}<section className="quiz-card"><p className="instruction">{exercise.prompt}</p><div className={`reading-display ${lowercase ? 'lowercase-print' : ''} ${sentence ? 'sentence-display' : ''}`}>{exercise.display}</div><ReadAloudButton text={spoken} />
    <div className="answer-grid text-answers">{exercise.answers.map(value => <button key={value} disabled={feedback === 'correct'} onClick={() => answer(value)}>{value}</button>)}</div>
    <Feedback state={feedback} message={feedback === 'correct' ? 'Hai letto benissimo!' : 'Quasi! Ascolta e riprova.'} fact={fact} onNext={next} />
  </section></GameLayout>;
}
