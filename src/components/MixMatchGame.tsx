import { useMemo, useState } from 'react';
import type { Difficulty, GameContent } from '../types/content';
import { byDifficulty, shuffle } from '../utils/game';
import { MathGame } from './MathGame';
import { ReadingGame } from './ReadingGame';
import { WritingGame } from './WritingGame';

type Activity = 'somma' | 'sottrazione' | 'lettura' | 'scrittura';

const labels: Record<Activity, string> = {
  somma: 'Somme', sottrazione: 'Sottrazioni', lettura: 'Lettura', scrittura: 'Scrittura',
};

export function MixMatchGame({ difficulty, content, score, best, onCorrect, onHome }: { difficulty: Difficulty; content: GameContent; score: number; best: number; onCorrect: () => void; onHome: () => void }) {
  const activities = useMemo(() => {
    const result: Activity[] = ['somma', 'sottrazione'];
    if (byDifficulty(content.reading, difficulty).length) result.push('lettura');
    if (byDifficulty(content.writing, difficulty).length) result.push('scrittura');
    return result;
  }, [content, difficulty]);
  const [queue, setQueue] = useState<Activity[]>(() => shuffle(activities));
  const [round, setRound] = useState(0);
  const current = queue[0];

  const nextActivity = () => {
    setQueue(previous => {
      if (previous.length > 1) return previous.slice(1);
      const next = shuffle(activities);
      if (next.length > 1 && next[0] === previous[0]) next.push(next.shift()!);
      return next;
    });
    setRound(value => value + 1);
  };

  if (!current) return <main className="loading-screen"><div>🧩</div><h1>Prepariamo altre domande</h1><p>Prova un altro livello.</p><button className="primary-button" onClick={onHome}>Torna alla home</button></main>;

  const shared = { difficulty, facts: content.funFacts, score, best, onCorrect, onHome, onRequestNext: nextActivity, contextLabel: `Mix & Match · ${labels[current]}` };
  if (current === 'somma') return <MathGame key={`${current}-${round}`} {...shared} operation="addition" questions={content.addition} />;
  if (current === 'sottrazione') return <MathGame key={`${current}-${round}`} {...shared} operation="subtraction" questions={content.subtraction} />;
  if (current === 'lettura') return <ReadingGame key={`${current}-${round}`} {...shared} exercises={content.reading} />;
  return <WritingGame key={`${current}-${round}`} {...shared} exercises={content.writing} />;
}
