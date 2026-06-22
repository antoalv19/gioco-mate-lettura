import { useMemo, useState } from 'react';
import type { Difficulty, FunFact, WritingExercise } from '../types/content';
import { byDifficulty, normalizeAnswer, randomItem } from '../utils/game';
import { Feedback, GameLayout, ReadAloudButton } from './Common';

export function WritingGame({ difficulty, exercises, facts, score, best, onCorrect, onHome, onRequestNext, contextLabel }: { difficulty: Difficulty; exercises: WritingExercise[]; facts: FunFact[]; score: number; best: number; onCorrect: () => void; onHome: () => void; onRequestNext?: () => void; contextLabel?: string }) {
  const available = useMemo(() => byDifficulty(exercises, difficulty), [exercises, difficulty]);
  const [exercise, setExercise] = useState(() => randomItem(available)); const [kind, setKind] = useState<'listen' | 'complete'>(() => Math.random() > .5 ? 'listen' : 'complete'); const [value, setValue] = useState(''); const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null); const [attempts, setAttempts] = useState(0); const [hint, setHint] = useState(0); const [fact, setFact] = useState('');
  if (!exercise) return <GameLayout score={score} best={best} onHome={onHome} title="Scrittura" icon="✏️"><p className="empty-message">Le parole stanno arrivando! Prova un altro livello.</p></GameLayout>;
  const check = () => { if (!value) return; if (normalizeAnswer(value) === normalizeAnswer(exercise.word)) { setFeedback('correct'); setFact(facts.length ? randomItem(facts).text : 'Ogni parola scritta è una piccola conquista!'); onCorrect(); } else { setAttempts(a => a + 1); setFeedback('wrong'); setHint(h => Math.max(h, attempts >= 1 ? 2 : 1)); } };
  const next = () => { if (onRequestNext) { onRequestNext(); return; } setExercise(randomItem(available)); setKind(Math.random() > .5 ? 'listen' : 'complete'); setValue(''); setFeedback(null); setAttempts(0); setHint(0); };
  return <GameLayout score={score} best={best} onHome={onHome} title="Scrittura" icon="✏️">{contextLabel && <div className="mix-badge">🔀 {contextLabel}</div>}<section className="quiz-card writing-card"><p className="instruction">{kind === 'listen' ? 'Ascolta e scrivi la parola' : 'Completa la parola'}</p><div className="word-support">{difficulty !== 'difficile' && <span>{exercise.emoji}</span>}<strong>{kind === 'complete' ? exercise.completeWord.masked : '🔊'}</strong></div><ReadAloudButton text={exercise.word} label="Ascolta la parola" />
    {hint > 0 && <div className="hint" role="status">💡 Inizia con <strong>{exercise.word[0]}</strong>{hint > 1 && <> · Dilla a pezzetti: <strong>{exercise.syllables.join(' - ')}</strong></>}</div>}
    <label className="sr-only" htmlFor="word-input">Scrivi la parola</label><input id="word-input" className="word-input" autoComplete="off" autoCapitalize="characters" value={value} disabled={feedback === 'correct'} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Scrivi qui…" />
    <div className="writing-actions"><button className="help-button" onClick={() => setHint(h => Math.min(2, h + 1))}>💡 Aiuto</button><button className="primary-button" onClick={check}>Controlla ✓</button></div>
    <Feedback state={feedback} message={feedback === 'correct' ? 'Scritta benissimo!' : attempts >= 2 ? `La parola è ${exercise.word}. Riproviamo insieme!` : 'Quasi! Ascolta ancora.'} fact={fact} onNext={next} nextLabel="Nuova parola" />
  </section></GameLayout>;
}
