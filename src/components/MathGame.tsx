import { useEffect, useMemo, useState } from 'react';
import type { Difficulty, FunFact, MathQuestion } from '../types/content';
import { byDifficulty, ensureFourAnswers, generateMathQuestion, randomItem } from '../utils/game';
import { Feedback, GameLayout, ReadAloudButton } from './Common';

export function MathGame({ operation, difficulty, questions, facts, score, best, onCorrect, onHome, onRequestNext, contextLabel, visualSupportMode = 'after-error' }: { operation: 'addition' | 'subtraction'; difficulty: Difficulty; questions: MathQuestion[]; facts: FunFact[]; score: number; best: number; onCorrect: () => void; onHome: () => void; onRequestNext?: () => void; contextLabel?: string; visualSupportMode?: 'always' | 'after-error' }) {
  const available = useMemo(() => byDifficulty(questions, difficulty), [questions, difficulty]);
  const makeQuestion = () => {
    if (!available.length) return ensureFourAnswers(generateMathQuestion(operation, difficulty));
    const selected = randomItem(available);
    return ensureFourAnswers(selected);
  };
  const [question, setQuestion] = useState<MathQuestion>(() => {
    if (!available.length) return ensureFourAnswers(generateMathQuestion(operation, difficulty));
    const selected = randomItem(available);
    return ensureFourAnswers(selected);
  });
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [typedValue, setTypedValue] = useState('');
  const [message, setMessage] = useState(''); const [fact, setFact] = useState(''); const [attempts, setAttempts] = useState(0);
  const answer = (value: number) => {
    if (feedback === 'correct') return;
    setSelectedAnswer(value);
    setTypedValue('');
    if (value === question.correctAnswer) { setFeedback('correct'); setMessage(randomItem(['Bravissimo!', 'Ottimo lavoro!', 'Grande!', 'Risposta giusta!'])); setFact(facts.length ? randomItem(facts).text : 'Imparare rende ogni giorno una nuova avventura!'); onCorrect(); }
    else { const next = attempts + 1; setAttempts(next); setFeedback('wrong'); setMessage(next >= 2 ? `Ci sei quasi! La risposta è ${question.correctAnswer}.` : randomItem(['Quasi! Riprova.', 'Guarda bene e riprova.', 'Proviamo ancora!'])); }
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (feedback === 'correct' || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        setFeedback(null); setMessage(''); setSelectedAnswer(null);
        setTypedValue(current => `${current}${event.key}`.slice(0, 2));
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        setTypedValue(current => current.slice(0, -1));
      } else if (event.key === 'Enter' && typedValue) {
        event.preventDefault();
        answer(Number(typedValue));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [feedback, typedValue, question.correctAnswer]);
  const next = () => {
    if (onRequestNext) { onRequestNext(); return; }
    setQuestion(makeQuestion()); setFeedback(null); setSelectedAnswer(null); setTypedValue(''); setMessage(''); setAttempts(0);
  };
  const showVisual = visualSupportMode === 'always' || attempts > 0;
  const visual = question.visual?.join(' ') || '💡 Conta con le dita o fai piccoli passi.';
  const symbol = operation === 'addition' ? '+' : '−';
  const spokenEquation = `${question.operands[0]} ${operation === 'addition' ? 'più' : 'meno'} ${question.operands[1]} uguale a?`;
  const displayedAnswer = selectedAnswer ?? (typedValue || '?');
  return <GameLayout score={score} best={best} onHome={onHome} title={operation === 'addition' ? 'Somme' : 'Sottrazioni'} icon={operation === 'addition' ? '➕' : '➖'}>
    {contextLabel && <div className="mix-badge">🔀 {contextLabel}</div>}
    <section className="quiz-card"><p className="instruction">Completa l’equazione</p>
      <div className="equation" aria-label={`${question.operands[0]} ${symbol} ${question.operands[1]} uguale ${displayedAnswer === '?' ? 'punto interrogativo' : displayedAnswer}`}>
        <span>{question.operands[0]}</span><span>{symbol}</span><span>{question.operands[1]}</span><span>=</span>
        <span className={`result-box ${feedback ?? 'waiting'}`}>{displayedAnswer}</span>
      </div>
      {showVisual && <div className={`math-visual ${question.visual ? '' : 'fallback-hint'}`} role="status">{visual}</div>}<ReadAloudButton text={spokenEquation} />
      <p className="keyboard-hint">⌨️ Puoi scrivere il numero e premere Invio</p>
      <div className="answer-grid math-answers">{question.answers.map(value => <button key={value} className={selectedAnswer === value ? 'chosen' : ''} disabled={feedback === 'correct'} onClick={() => answer(value)}>{value}</button>)}</div>
      <Feedback state={feedback} message={message} fact={fact} onNext={next} />
    </section>
  </GameLayout>;
}
