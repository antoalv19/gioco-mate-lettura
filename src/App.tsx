import { useEffect, useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { MathGame } from './components/MathGame';
import { ReadingGame } from './components/ReadingGame';
import { WritingGame } from './components/WritingGame';
import { PracticeHub } from './components/PracticeHub';
import { MixMatchGame } from './components/MixMatchGame';
import { loadContent } from './services/contentService';
import type { Difficulty, GameContent, Mode } from './types/content';

export default function App() {
  const [content, setContent] = useState<GameContent | null>(null); const [loadingError, setLoadingError] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null); const [difficulty, setDifficulty] = useState<Difficulty>('facile');
  const [score, setScore] = useState(0); const [best, setBest] = useState(() => Number(localStorage.getItem('piccoli-esploratori-best') || 0));
  useEffect(() => { loadContent().then(setContent).catch(error => { console.error('[Contenuti] Errore grave', error); setLoadingError(true); }); }, []);
  const correct = () => setScore(current => { const next = current + 1; if (next > best) { setBest(next); localStorage.setItem('piccoli-esploratori-best', String(next)); } return next; });
  const goHome = () => setMode(null);
  if (loadingError) return <main className="loading-screen"><div>🛠️</div><h1>Ops!</h1><p>Non riesco a preparare il gioco.<br />Riproviamo tra poco.</p><button className="primary-button" onClick={() => location.reload()}>Riprova</button></main>;
  if (!content) return <main className="loading-screen"><div className="rocket">🚀</div><h1>Sto preparando il gioco…</h1><p>Un momento, esploratore!</p></main>;
  if (!mode) return <HomeScreen difficulty={difficulty} setDifficulty={setDifficulty} onSelectMode={setMode} best={best} />;
  if (mode === 'somma') return <MathGame operation="addition" difficulty={difficulty} questions={content.addition} facts={content.funFacts} score={score} best={best} onCorrect={correct} onHome={goHome} />;
  if (mode === 'sottrazione') return <MathGame operation="subtraction" difficulty={difficulty} questions={content.subtraction} facts={content.funFacts} score={score} best={best} onCorrect={correct} onHome={goHome} />;
  if (mode === 'lettura') return <ReadingGame difficulty={difficulty} exercises={content.reading} facts={content.funFacts} score={score} best={best} onCorrect={correct} onHome={goHome} />;
  if (mode === 'scrittura') return <WritingGame difficulty={difficulty} exercises={content.writing} facts={content.funFacts} score={score} best={best} onCorrect={correct} onHome={goHome} />;
  if (mode === 'mix') return <MixMatchGame difficulty={difficulty} content={content} score={score} best={best} onCorrect={correct} onHome={goHome} />;
  return <PracticeHub difficulty={difficulty} lessons={content.practiceLessons} score={score} best={best} onHome={goHome} onGoToGame={setMode} />;
}
