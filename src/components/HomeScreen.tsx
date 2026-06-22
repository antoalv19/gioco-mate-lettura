import type { Difficulty, Mode } from '../types/content';

const modes: Array<{ mode: Mode; icon: string; label: string; color: string; subtitle?: string }> = [
  { mode: 'somma', icon: '➕', label: 'Somme', color: 'coral' },
  { mode: 'sottrazione', icon: '➖', label: 'Sottrazioni', color: 'blue' },
  { mode: 'lettura', icon: '📖', label: 'Lettura', color: 'purple' },
  { mode: 'scrittura', icon: '✏️', label: 'Scrittura', color: 'green' },
  { mode: 'imparo-lettura', icon: '🌈', label: 'Imparo a Leggere', color: 'rainbow', subtitle: 'Lettere, parole e piccole frasi' },
  { mode: 'mix', icon: '🔀', label: 'Mix & Match', color: 'pink' },
  { mode: 'pratica', icon: '🧭', label: 'Impara con me', color: 'yellow' },
];
const levels: Array<{ value: Difficulty; label: string; icon: string }> = [
  { value: 'facile', label: 'Facile', icon: '🌱' }, { value: 'medio', label: 'Medio', icon: '🌼' }, { value: 'difficile', label: 'Difficile', icon: '🚀' },
];

export function HomeScreen({ difficulty, setDifficulty, onSelectMode, best }: { difficulty: Difficulty; setDifficulty: (d: Difficulty) => void; onSelectMode: (m: Mode) => void; best: number }) {
  return <main className="app-shell home">
    <div className="sky-decoration" aria-hidden="true">☀️</div>
    <header className="hero"><div className="mascot" aria-hidden="true">🦕</div><div><p className="eyebrow">Giochiamo e impariamo!</p><h1>Piccoli Esploratori</h1><p>Scegli un’avventura 👇</p></div><div className="record">🏆 Record: {best}</div></header>
    <section aria-labelledby="difficulty-title" className="difficulty-card"><h2 id="difficulty-title">Quanto vuoi esplorare?</h2><div className="difficulty-options">{levels.map(level => <button key={level.value} className={difficulty === level.value ? 'selected' : ''} aria-pressed={difficulty === level.value} onClick={() => setDifficulty(level.value)}><span>{level.icon}</span>{level.label}</button>)}</div></section>
    <section className="mode-grid" aria-label="Scegli il gioco">{modes.map(item => <button key={item.mode} className={`mode-card ${item.color} ${item.mode === 'imparo-lettura' ? 'wide' : ''}`} onClick={() => onSelectMode(item.mode)}><span className="mode-icon">{item.icon}</span><span className="mode-copy"><strong>{item.label}</strong>{item.subtitle && <small>{item.subtitle}</small>}</span><span className="play-dot">▶</span></button>)}</section>
  </main>;
}
