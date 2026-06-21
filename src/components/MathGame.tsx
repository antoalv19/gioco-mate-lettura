import { useMemo, useState } from 'react';
import type { Difficulty, FunFact, MathQuestion } from '../types/content';
import { byDifficulty, generateMathQuestion, randomItem, shuffle } from '../utils/game';
import { Feedback, GameLayout, ReadAloudButton } from './Common';

export function MathGame({ operation, difficulty, questions, facts, score, best, onCorrect, onHome }: { operation: 'addition' | 'subtraction'; difficulty: Difficulty; questions: MathQuestion[]; facts: FunFact[]; score: number; best: number; onCorrect: () => void; onHome: () => void }) {
  const available = useMemo(() => byDifficulty(questions, difficulty), [questions, difficulty]);
  const makeQuestion = () => {
    if (!available.length) return generateMathQuestion(operation, difficulty);
    const selected = randomItem(available);
    return { ...selected, answers: shuffle(selected.answers) };
  };
  const [question, setQuestion] = useState<MathQuestion>(() => {
    if (!available.length) return generateMathQuestion(operation, difficulty);
    const selected = randomItem(available);
    return { ...selected, answers: shuffle(selected.answers) };
  });
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [message, setMessage] = useState(''); const [fact, setFact] = useState(''); const [attempts, setAttempts] = useState(0);
  const answer = (value: number) => {
    if (feedback === 'correct') return;
    if (value === question.correctAnswer) { setFeedback('correct'); setMessage(randomItem(['Bravissimo!', 'Ottimo lavoro!', 'Grande!', 'Risposta giusta!'])); setFact(facts.length ? randomItem(facts).text : 'Imparare rende ogni giorno una nuova avventura!'); onCorrect(); }
    else { const next = attempts + 1; setAttempts(next); setFeedback('wrong'); setMessage(next >= 2 ? `Ci sei quasi! La risposta è ${question.correctAnswer}.` : randomItem(['Quasi! Riprova.', 'Guarda bene e riprova.', 'Proviamo ancora!'])); }
  };
  const next = () => { setQuestion(makeQuestion()); setFeedback(null); setMessage(''); setAttempts(0); };
  const visual = question.visual?.join(' ') || (difficulty === 'facile' ? `${'●'.repeat(question.operands[0])}  ${operation === 'addition' ? '+' : '−'}  ${'●'.repeat(question.operands[1])}` : '');
  return <GameLayout score={score} best={best} onHome={onHome} title={operation === 'addition' ? 'Somme' : 'Sottrazioni'} icon={operation === 'addition' ? '➕' : '➖'}>
    <section className="quiz-card"><p className="instruction">Scegli la risposta giusta</p><div className="math-question">{question.question}</div>{visual && <div className="math-visual">{visual}</div>}<ReadAloudButton text={question.question} />
      <div className="answer-grid">{question.answers.map(value => <button key={value} disabled={feedback === 'correct'} onClick={() => answer(value)}>{value}</button>)}</div>
      <Feedback state={feedback} message={message} fact={fact} onNext={next} />
    </section>
  </GameLayout>;
}
