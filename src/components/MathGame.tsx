import { useMemo, useState } from 'react';
import type { Difficulty, FunFact, MathQuestion } from '../types/content';
import { byDifficulty, ensureFourAnswers, generateMathQuestion, randomItem } from '../utils/game';
import { Feedback, GameLayout, ReadAloudButton } from './Common';

export function MathGame({ operation, difficulty, questions, facts, score, best, onCorrect, onHome }: { operation: 'addition' | 'subtraction'; difficulty: Difficulty; questions: MathQuestion[]; facts: FunFact[]; score: number; best: number; onCorrect: () => void; onHome: () => void }) {
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
  const [message, setMessage] = useState(''); const [fact, setFact] = useState(''); const [attempts, setAttempts] = useState(0);
  const answer = (value: number) => {
    if (feedback === 'correct') return;
    setSelectedAnswer(value);
    if (value === question.correctAnswer) { setFeedback('correct'); setMessage(randomItem(['Bravissimo!', 'Ottimo lavoro!', 'Grande!', 'Risposta giusta!'])); setFact(facts.length ? randomItem(facts).text : 'Imparare rende ogni giorno una nuova avventura!'); onCorrect(); }
    else { const next = attempts + 1; setAttempts(next); setFeedback('wrong'); setMessage(next >= 2 ? `Ci sei quasi! La risposta è ${question.correctAnswer}.` : randomItem(['Quasi! Riprova.', 'Guarda bene e riprova.', 'Proviamo ancora!'])); }
  };
  const next = () => { setQuestion(makeQuestion()); setFeedback(null); setSelectedAnswer(null); setMessage(''); setAttempts(0); };
  const visual = question.visual?.join(' ') || (difficulty === 'facile' ? `${'●'.repeat(question.operands[0])}  ${operation === 'addition' ? '+' : '−'}  ${'●'.repeat(question.operands[1])}` : '');
  const symbol = operation === 'addition' ? '+' : '−';
  const spokenEquation = `${question.operands[0]} ${operation === 'addition' ? 'più' : 'meno'} ${question.operands[1]} uguale a?`;
  return <GameLayout score={score} best={best} onHome={onHome} title={operation === 'addition' ? 'Somme' : 'Sottrazioni'} icon={operation === 'addition' ? '➕' : '➖'}>
    <section className="quiz-card"><p className="instruction">Completa l’equazione</p>
      <div className="equation" aria-label={`${question.operands[0]} ${symbol} ${question.operands[1]} uguale ${selectedAnswer ?? 'punto interrogativo'}`}>
        <span>{question.operands[0]}</span><span>{symbol}</span><span>{question.operands[1]}</span><span>=</span>
        <span className={`result-box ${feedback ?? 'waiting'}`}>{selectedAnswer ?? '?'}</span>
      </div>
      {visual && <div className="math-visual">{visual}</div>}<ReadAloudButton text={spokenEquation} />
      <div className="answer-grid math-answers">{question.answers.map(value => <button key={value} className={selectedAnswer === value ? 'chosen' : ''} disabled={feedback === 'correct'} onClick={() => answer(value)}>{value}</button>)}</div>
      <Feedback state={feedback} message={message} fact={fact} onNext={next} />
    </section>
  </GameLayout>;
}
