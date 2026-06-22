import { useMemo, useState } from 'react';
import type { Difficulty, Mode, PracticeLesson } from '../types/content';
import { byDifficulty, ensureFourChoices, randomItem } from '../utils/game';
import { GameLayout, ReadAloudButton } from './Common';

const areas = [
  { value: 'somme', label: 'Somme', icon: '➕', mode: 'somma' }, { value: 'sottrazioni', label: 'Sottrazioni', icon: '➖', mode: 'sottrazione' },
  { value: 'lettura', label: 'Lettura', icon: '📖', mode: 'lettura' }, { value: 'scrittura', label: 'Scrittura', icon: '✏️', mode: 'scrittura' },
] as const;
const answerKind = (value: string | number) => {
  if (typeof value === 'number') return 'number';
  if (!/[A-Za-zÀ-ÿ]/.test(value)) return 'symbol';
  const text = value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/\s/.test(text)) return 'phrase';
  if (text.length === 1) return 'letter';
  if (text.length === 2) return 'syllable';
  return 'word';
};

export function PracticeHub({ difficulty, lessons, score, best, onHome, onGoToGame }: { difficulty: Difficulty; lessons: PracticeLesson[]; score: number; best: number; onHome: () => void; onGoToGame: (m: Mode) => void }) {
  const [area, setArea] = useState<PracticeLesson['area'] | null>(null); const [lesson, setLesson] = useState<PracticeLesson | null>(null); const [state, setState] = useState<'correct' | 'wrong' | null>(null);
  const available = useMemo(() => byDifficulty(lessons, difficulty), [lessons, difficulty]);
  const prepareLesson = (item: PracticeLesson) => ({ ...item, answers: ensureFourChoices(item.correctAnswer, item.answers, lessons.filter(candidate => candidate.area === item.area && answerKind(candidate.correctAnswer) === answerKind(item.correctAnswer)).flatMap(candidate => candidate.answers).filter(value => answerKind(value) === answerKind(item.correctAnswer))) });
  const choose = (selected: typeof areas[number]) => { setArea(selected.value); const matches = available.filter(item => item.area === selected.value); setLesson(matches.length ? prepareLesson(randomItem(matches)) : null); setState(null); };
  const retry = () => setState(null);
  const another = () => { if (!area) return; const matches = available.filter(item => item.area === area); setLesson(matches.length ? prepareLesson(randomItem(matches)) : null); setState(null); };
  if (!area) return <GameLayout score={score} best={best} onHome={onHome} title="Impara con me" icon="🧭"><section className="practice-picker"><p>Scegli cosa imparare</p><div className="practice-grid">{areas.map(item => <button key={item.value} onClick={() => choose(item)}><span>{item.icon}</span><strong>{item.label}</strong></button>)}</div></section></GameLayout>;
  const selectedArea = areas.find(item => item.value === area)!;
  if (!lesson) return <GameLayout score={score} best={best} onHome={onHome} title="Impara con me" icon="🧭"><section className="quiz-card"><p className="empty-message">Questa lezione sta arrivando! Prova un altro livello.</p><button className="primary-button" onClick={() => setArea(null)}>Scegli ancora</button></section></GameLayout>;
  return <GameLayout score={score} best={best} onHome={onHome} title={lesson.title} icon={selectedArea.icon}><section className="quiz-card lesson-card">
    <div className="lesson-step"><span>1</span><div><small>SCOPRI</small><p>{lesson.explanation}</p></div></div><ReadAloudButton text={`${lesson.explanation} ${lesson.example}`} label="Ascolta la spiegazione" />
    <div className="visual-example" aria-label={lesson.example}><p>{lesson.example}</p><div>{lesson.visual.join(' ')}</div></div>
    <div className="lesson-step"><span>2</span><div><small>PROVA TU</small><p>{lesson.question}</p></div></div>
    <div className="answer-grid">{lesson.answers.map(value => <button key={String(value)} onClick={() => setState(value === lesson.correctAnswer ? 'correct' : 'wrong')}>{value}</button>)}</div>
    {state && <div className={`feedback ${state}`} role="status"><div className="feedback-message">{state === 'correct' ? '🎉 Sì! Hai capito!' : '💛 Va bene, guardiamo e proviamo ancora.'}</div><div className="practice-actions"><button className="help-button" onClick={retry}>↻ Prova ancora</button>{state === 'correct' && <button className="primary-button" onClick={another}>Altra lezione</button>}</div></div>}
    <div className="lesson-footer"><button className="text-button" onClick={() => setArea(null)}>← Cambia argomento</button><button className="primary-button" onClick={() => onGoToGame(selectedArea.mode)}>Vai al gioco ▶</button></div>
  </section></GameLayout>;
}
