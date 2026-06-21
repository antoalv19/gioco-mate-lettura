import type { ReactNode } from 'react';
import { speakItalian } from '../utils/game';

export function TopBar({ score, best, onHome }: { score: number; best: number; onHome: () => void }) {
  return <header className="topbar">
    <button className="icon-button" onClick={onHome} aria-label="Torna alla home">🏠 <span>Home</span></button>
    <div className="score-pill" aria-label={`Punti ${score}`}>⭐ {score}</div>
    <div className="best-pill" aria-label={`Record ${best}`}>🏆 {best}</div>
  </header>;
}

export function ReadAloudButton({ text, label = 'Ascolta' }: { text: string; label?: string }) {
  return <button className="listen-button" onClick={() => speakItalian(text)} aria-label={`Ascolta: ${text}`}>🔊 {label}</button>;
}

export function Feedback({ state, message, fact, onNext, nextLabel = 'Nuova domanda' }: { state: 'correct' | 'wrong' | null; message: string; fact?: string; onNext?: () => void; nextLabel?: string }) {
  if (!state) return null;
  return <div className={`feedback ${state}`} role="status" aria-live="polite">
    <div className="feedback-message">{state === 'correct' ? '🎉' : '💛'} {message}</div>
    {state === 'correct' && fact && <div className="fact"><span>💡 Lo sapevi?</span> {fact}</div>}
    {state === 'correct' && onNext && <button className="primary-button" onClick={onNext}>{nextLabel} ➜</button>}
  </div>;
}

export function GameLayout({ children, score, best, onHome, title, icon }: { children: ReactNode; score: number; best: number; onHome: () => void; title: string; icon: string }) {
  return <main className="app-shell game-shell"><TopBar score={score} best={best} onHome={onHome} /><section className="game-heading"><span>{icon}</span><h1>{title}</h1></section>{children}</main>;
}
