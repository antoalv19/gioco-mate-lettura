import { useMemo, useRef, useState } from 'react';
import type { Difficulty, FunFact, LearnToReadExercise } from '../types/content';
import { byDifficulty, ensureFourChoices, normalizeAnswer, randomItem, speakItalian } from '../utils/game';
import { Feedback, GameLayout } from './Common';

type ItemProgress = { correct: number; mistakes: number; hints: number; audio: number; mastered: boolean };
type ReadingProgress = Record<string, ItemProgress>;
const STORAGE_KEY = 'piccoli-esploratori-reading-progress';
const SESSION_LENGTH = 5;

function loadProgress(): ReadingProgress {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as ReadingProgress; }
  catch { return {}; }
}

export function LearnToReadGame({ difficulty, exercises, facts, score, best, onCorrect, onHome }: { difficulty: Difficulty; exercises: LearnToReadExercise[]; facts: FunFact[]; score: number; best: number; onCorrect: () => void; onHome: () => void }) {
  const solvedRef = useRef(false);
  const available = useMemo(() => byDifficulty(exercises, difficulty), [exercises, difficulty]);
  const levels = useMemo(() => [...new Set(available.map(item => item.level))].sort((a, b) => a - b), [available]);
  const [progress, setProgress] = useState<ReadingProgress>(loadProgress);
  const [level, setLevel] = useState<number | null>(null);
  const [exercise, setExercise] = useState<LearnToReadExercise | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [fact, setFact] = useState('');
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const itemsForLevel = (value: number) => available.filter(item => item.level === value);
  const masteredInLevel = (value: number) => itemsForLevel(value).filter(item => progress[item.id]?.mastered).length;
  const recommendedLevel = levels.find(value => masteredInLevel(value) < Math.min(2, itemsForLevel(value).length)) ?? levels[levels.length - 1];

  const saveProgress = (next: ReadingProgress) => { setProgress(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const updateItem = (id: string, change: Partial<ItemProgress>) => {
    const current = progress[id] || { correct: 0, mistakes: 0, hints: 0, audio: 0, mastered: false };
    const merged = { ...current, ...change };
    saveProgress({ ...progress, [id]: merged });
  };
  const prepareExercise = (item: LearnToReadExercise) => item.activity === 'build-sentence' ? item : { ...item, options: ensureFourChoices(item.correctAnswer, item.options, available.filter(candidate => candidate.level === item.level && candidate.activity === item.activity).flatMap(candidate => candidate.options)) };
  const chooseExercise = (selectedLevel: number, previousId?: string) => {
    const pool = itemsForLevel(selectedLevel).filter(item => item.id !== previousId);
    const candidates = pool.filter(item => !progress[item.id]?.mastered);
    const selected = randomItem(candidates.length ? candidates : (pool.length ? pool : itemsForLevel(selectedLevel)));
    return selected ? prepareExercise(selected) : selected;
  };
  const startLevel = (selectedLevel: number) => {
    solvedRef.current = false; setLevel(selectedLevel); setExercise(chooseExercise(selectedLevel)); setFeedback(null); setAttempts(0); setSelectedWords([]); setSessionAnswered(0); setSessionCorrect(0); setShowSummary(false);
  };
  const answer = (value: string) => {
    if (!exercise || solvedRef.current || feedback === 'correct') return;
    if (normalizeAnswer(value) === normalizeAnswer(exercise.correctAnswer)) {
      solvedRef.current = true;
      const current = progress[exercise.id] || { correct: 0, mistakes: 0, hints: 0, audio: 0, mastered: false };
      const correct = current.correct + 1;
      updateItem(exercise.id, { correct, mastered: correct >= 2 });
      setFeedback('correct'); setFact(facts.length ? randomItem(facts).text : 'Leggere apre la porta a tante storie!'); setSessionAnswered(value => value + 1); setSessionCorrect(value => value + 1); onCorrect();
    } else {
      const nextAttempts = attempts + 1; setAttempts(nextAttempts); setFeedback('wrong');
      const current = progress[exercise.id] || { correct: 0, mistakes: 0, hints: 0, audio: 0, mastered: false };
      updateItem(exercise.id, { mistakes: current.mistakes + 1, hints: current.hints + 1 });
    }
  };
  const next = () => {
    if (!exercise || level == null) return;
    if (sessionAnswered >= SESSION_LENGTH) { setShowSummary(true); return; }
    solvedRef.current = false;
    setExercise(chooseExercise(level, exercise.id)); setFeedback(null); setAttempts(0); setSelectedWords([]); setFact('');
  };
  const listen = () => {
    if (!exercise) return;
    const spokenText = exercise.activity === 'build-sentence' || exercise.activity === 'image-to-sentence' ? exercise.correctAnswer : exercise.display.replaceAll('___', exercise.correctAnswer);
    speakItalian(spokenText);
    const current = progress[exercise.id] || { correct: 0, mistakes: 0, hints: 0, audio: 0, mastered: false };
    updateItem(exercise.id, { audio: current.audio + 1 });
  };

  if (!available.length) return <GameLayout score={score} best={best} onHome={onHome} title="Imparo a Leggere" icon="🌈"><p className="empty-message">Questo percorso sta arrivando. Prova un altro livello.</p></GameLayout>;

  if (level == null || !exercise) return <GameLayout score={score} best={best} onHome={onHome} title="Imparo a Leggere" icon="🌈"><section className="reading-path"><p className="path-intro">Lettere, parole e piccole frasi</p><button className="continue-reading" onClick={() => startLevel(recommendedLevel)}>▶ Continua dal livello {recommendedLevel}</button><div className="level-grid">{levels.map(value => { const sample = itemsForLevel(value)[0]; const mastered = masteredInLevel(value); const total = itemsForLevel(value).length; return <button key={value} onClick={() => startLevel(value)}><span>{value}</span><strong>{sample.levelTitle}</strong><small>{mastered}/{total} attività imparate</small></button>; })}</div></section></GameLayout>;

  if (showSummary) return <GameLayout score={score} best={best} onHome={onHome} title="Piccola pausa!" icon="⭐"><section className="session-summary"><div className="summary-stars">{'⭐'.repeat(Math.max(1, sessionCorrect))}</div><h2>Hai completato {SESSION_LENGTH} attività!</h2><p>Risposte corrette: <strong>{sessionCorrect}</strong></p><div className="summary-actions"><button className="help-button" onClick={() => setLevel(null)}>Scegli livello</button><button className="primary-button" onClick={() => startLevel(level)}>Continua ▶</button></div></section></GameLayout>;

  const isBuild = exercise.activity === 'build-sentence';
  const letterAlreadyShownInVisual = exercise.activity === 'letter-sound' && Boolean(exercise.visual);
  const visibleOptions = isBuild ? exercise.options.filter(word => !selectedWords.includes(word)) : exercise.options;
  const successMessage = exercise.activity.includes('sentence') || exercise.level >= 5 ? 'Ottimo! Hai letto tutta la frase.' : 'Bravo! Hai letto bene.';
  return <GameLayout score={score} best={best} onHome={onHome} title={`Livello ${exercise.level} · ${exercise.levelTitle}`} icon="🌈"><section className="quiz-card learn-read-card"><div className="session-progress"><span style={{ width: `${(sessionAnswered / SESSION_LENGTH) * 100}%` }} /></div><p className="question-count">Attività {Math.min(feedback === 'correct' ? sessionAnswered : sessionAnswered + 1, SESSION_LENGTH)} di {SESSION_LENGTH}</p><p className="instruction">{exercise.prompt}</p>
    {exercise.visual && !isBuild && <div className="reading-scene" aria-label={exercise.visual}>{exercise.visual}</div>}
    {!letterAlreadyShownInVisual && <div className={`course-display ${exercise.level >= 4 ? 'lowercase-print' : ''}`}>{exercise.display}</div>}
    <button className="listen-button" onClick={listen}>🔊 Ascolta</button>
    {attempts > 0 && <div className="hint" role="status">💡 {exercise.hint}{attempts > 1 && exercise.keyWord && <> Parola importante: <strong>{exercise.keyWord}</strong></>}</div>}
    {isBuild ? <><div className="sentence-builder" aria-label="Frase costruita">{selectedWords.length ? selectedWords.join(' ') : 'Tocca le parole nell’ordine giusto'}</div><div className="word-chips">{visibleOptions.map(word => <button key={word} disabled={feedback === 'correct'} onClick={() => setSelectedWords(value => [...value, word])}>{word}</button>)}</div><div className="builder-actions"><button className="help-button" disabled={!selectedWords.length || feedback === 'correct'} onClick={() => setSelectedWords(value => value.slice(0, -1))}>↶ Indietro</button><button className="primary-button" disabled={!selectedWords.length || feedback === 'correct'} onClick={() => answer(selectedWords.join(' '))}>Fatto ✓</button></div></> : <div className="answer-grid text-answers">{visibleOptions.map(option => <button key={option} disabled={feedback === 'correct'} onClick={() => answer(option)}>{option}</button>)}</div>}
    <Feedback state={feedback} message={feedback === 'correct' ? successMessage : attempts > 1 ? 'Rileggi piano e guarda la parola importante.' : 'Quasi. Rileggi piano.'} fact={fact} onNext={next} nextLabel={sessionAnswered >= SESSION_LENGTH ? 'Vedi come è andata' : 'Avanti'} />
  </section></GameLayout>;
}
