import { contentSourceConfig } from '../config/contentSource';
import type { GameContent } from '../types/content';
import { validateFacts, validateMath, validatePractice, validateReading, validateWriting } from './validators';

type Manifest = { files: Record<keyof GameContent, string> };
const getJson = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<unknown>;
};

async function loadFrom(baseUrl: string): Promise<GameContent> {
  const manifest = await getJson(`${baseUrl}manifest.json`) as Manifest;
  if (!manifest?.files) throw new Error('Manifest non valido');
  const keys = Object.keys(manifest.files) as Array<keyof GameContent>;
  const values = await Promise.all(keys.map(async key => {
    try { return await getJson(`${baseUrl}${manifest.files[key]}`); }
    catch (error) { console.warn(`[Contenuti] Impossibile caricare ${key}`, error); return []; }
  }));
  const raw = Object.fromEntries(keys.map((key, index) => [key, values[index]])) as Record<keyof GameContent, unknown>;
  return {
    funFacts: validateFacts(raw.funFacts), addition: validateMath(raw.addition, 'addition'), subtraction: validateMath(raw.subtraction, 'subtraction'),
    reading: validateReading(raw.reading), writing: validateWriting(raw.writing), practiceLessons: validatePractice(raw.practiceLessons),
  };
}

export async function loadContent(): Promise<GameContent> {
  if (contentSourceConfig.mode === 'remote') {
    try { return await loadFrom(contentSourceConfig.remoteBaseUrl); }
    catch (error) { console.warn('[Contenuti] Fonte remota non disponibile', error); if (!contentSourceConfig.fallbackToLocal) throw error; }
  }
  return loadFrom(contentSourceConfig.localBaseUrl);
}
