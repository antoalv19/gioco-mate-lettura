import { writeFileSync } from 'node:fs';

const words = [
  ['mare', '🌊', 'ma', 'il'], ['sole', '☀️', 'so', 'il'], ['pane', '🍞', 'pa', 'il'], ['luna', '🌙', 'lu', 'la'],
  ['mela', '🍎', 'me', 'la'], ['cane', '🐶', 'ca', 'il'], ['nave', '🚢', 'na', 'la'], ['casa', '🏠', 'ca', 'la'],
  ['topo', '🐭', 'to', 'il'], ['rana', '🐸', 'ra', 'la'], ['gatto', '🐱', 'ga', 'il'], ['pesce', '🐟', 'pe', 'il'],
  ['palla', '⚽', 'pa', 'la'], ['fiore', '🌸', 'fio', 'il'], ['libro', '📘', 'li', 'il'], ['mano', '✋', 'ma', 'la'],
  ['naso', '👃', 'na', 'il'], ['dado', '🎲', 'da', 'il'], ['vaso', '🏺', 'va', 'il'], ['banana', '🍌', 'ba', 'la'],
  ['limone', '🍋', 'li', 'il'], ['pera', '🍐', 'pe', 'la'], ['uva', '🍇', 'u', "l'"], ['torta', '🍰', 'to', 'la'],
  ['latte', '🥛', 'la', 'il'], ['uovo', '🥚', 'uo', "l'"], ['miele', '🍯', 'mie', 'il'], ['riso', '🍚', 'ri', 'il'],
  ['pizza', '🍕', 'pi', 'la'], ['gelato', '🍦', 'ge', 'il'], ['leone', '🦁', 'le', 'il'], ['tigre', '🐯', 'ti', 'la'],
  ['orso', '🐻', 'or', "l'"], ['zebra', '🦓', 'ze', 'la'], ['mucca', '🐮', 'mu', 'la'], ['pecora', '🐑', 'pe', 'la'],
  ['gufo', '🦉', 'gu', 'il'], ['ape', '🐝', 'a', "l'"], ['cocco', '🥥', 'co', 'il'], ['foca', '🦭', 'fo', 'la'],
].map(([word, emoji, syllable, article]) => ({ word, emoji, syllable, article }));

const subjects = [
  ['cane', '🐶', 'il', ['corre', 'dorme', 'mangia', 'salta']],
  ['gatto', '🐱', 'il', ['corre', 'dorme', 'mangia', 'salta']],
  ['rana', '🐸', 'la', ['salta', 'nuota', 'dorme', 'mangia']],
  ['pesce', '🐟', 'il', ['nuota', 'mangia', 'riposa', 'salta']],
  ['gufo', '🦉', 'il', ['vola', 'guarda', 'dorme', 'canta']],
  ['leone', '🦁', 'il', ['corre', 'ruggisce', 'dorme', 'mangia']],
  ['mucca', '🐮', 'la', ['mangia', 'cammina', 'dorme', 'beve']],
  ['ape', '🐝', "l'", ['vola', 'ronza', 'riposa', 'beve']],
  ['foca', '🦭', 'la', ['nuota', 'salta', 'dorme', 'mangia']],
  ['tigre', '🐯', 'la', ['corre', 'ruggisce', 'dorme', 'cammina']],
].map(([noun, emoji, article, actions]) => ({ noun, emoji, article, actions }));

const actionIcons = { corre: '💨', dorme: '💤', mangia: '🍽️', salta: '⬆️', nuota: '🌊', riposa: '🛏️', vola: '☁️', guarda: '👀', canta: '🎵', ruggisce: '📣', cammina: '👣', beve: '💧', ronza: '🎶' };
const scenes = subjects.flatMap(subject => subject.actions.map(action => ({ ...subject, action, sentence: `${subject.article}${subject.article === "l'" ? '' : ' '}${subject.noun} ${action}`, scene: `${subject.emoji}${actionIcons[action]}` })));

const qualities = [
  ['palla', '⚽', 'la', true], ['casa', '🏠', 'la', true], ['nave', '🚢', 'la', true], ['rana', '🐸', 'la', true], ['mela', '🍎', 'la', true],
  ['libro', '📘', 'il', false], ['fiore', '🌸', 'il', false], ['vaso', '🏺', 'il', false], ['dado', '🎲', 'il', false], ['gatto', '🐱', 'il', false],
].flatMap(([noun, emoji, article, feminine]) => [
  ['rosso', '🔴'], ['blu', '🔵'], ['verde', '🟢'], ['giallo', '🟡'],
].map(([base, marker]) => {
  const adjective = feminine && (base === 'rosso' || base === 'giallo') ? `${base.slice(0, -1)}a` : base;
  return { noun, emoji, article, adjective, marker, sentence: `${article} ${noun} è ${adjective}` };
}));

const rotate = (items, amount) => items.slice(amount % items.length).concat(items.slice(0, amount % items.length));
const id = (level, index) => `course-${String(level).padStart(2, '0')}-${String(index + 1).padStart(3, '0')}`;
const make = (level, index, levelTitle, difficulty, activity, data) => ({ id: id(level, index), level, levelTitle, difficulty, activity, ...data });
const differentWords = (current, property, index, count = 2) => rotate(words, index + 1).filter(item => item[property] !== current[property]).slice(0, count);
const differentScenes = (current, index) => {
  const sameSubject = scenes.find(item => item.noun === current.noun && item.action !== current.action);
  const sameAction = scenes.find(item => item.action === current.action && item.noun !== current.noun);
  return [sameSubject, sameAction || rotate(scenes, index + 1).find(item => item.scene !== current.scene)];
};

const levels = [];

words.forEach((item, index) => {
  const distractors = differentWords(item, 'word', index).filter(word => word.word[0] !== item.word[0]);
  const fallback = rotate(words, index + 3).filter(word => word.word[0] !== item.word[0]).slice(0, 2 - distractors.length);
  const options = rotate([`${item.word.toUpperCase()} ${item.emoji}`, ...[...distractors, ...fallback].slice(0, 2).map(word => `${word.word.toUpperCase()} ${word.emoji}`)], index);
  levels.push(make(1, index, 'Suoni e lettere', 'facile', 'letter-sound', {
    prompt: `Quale parola inizia con ${item.word[0].toUpperCase()}?`, display: item.word[0].toUpperCase(), visual: `👂 ${item.word[0].toUpperCase()}…`, options,
    correctAnswer: `${item.word.toUpperCase()} ${item.emoji}`, hint: 'Ascolta il primo suono di ogni parola.', keyWord: item.word.toUpperCase(),
  }));
});

words.forEach((item, index) => {
  const distractors = differentWords(item, 'syllable', index).slice(0, 2);
  const options = rotate([item.word.toUpperCase(), ...distractors.map(word => word.word.toUpperCase())], index + 1);
  levels.push(make(2, index, 'Sillabe maiuscole', 'facile', 'syllable-word', {
    prompt: `Quale parola inizia con ${item.syllable.toUpperCase()}?`, display: item.syllable.toUpperCase(), options,
    correctAnswer: item.word.toUpperCase(), hint: `Leggi ${item.syllable.toUpperCase()}, poi cerca la stessa sillaba all'inizio.`, keyWord: item.syllable.toUpperCase(),
  }));
});

words.forEach((item, index) => {
  const distractors = rotate(words, index + 1).filter(word => word.emoji !== item.emoji).slice(0, 2);
  const wordFirst = index % 2 === 0;
  levels.push(make(3, index, 'Parole maiuscole', 'facile', wordFirst ? 'word-to-image' : 'image-to-word', wordFirst ? {
    prompt: 'Leggi e scegli l’immagine', display: item.word.toUpperCase(), options: rotate([item.emoji, ...distractors.map(word => word.emoji)], index),
    correctAnswer: item.emoji, hint: `Leggi piano ${item.syllable.toUpperCase()}…`, keyWord: item.word.toUpperCase(),
  } : {
    prompt: 'Guarda e scegli la parola', display: item.emoji, options: rotate([item.word.toUpperCase(), ...distractors.map(word => word.word.toUpperCase())], index),
    correctAnswer: item.word.toUpperCase(), hint: `La parola inizia con ${item.word[0].toUpperCase()}.`, keyWord: item.word.toUpperCase(),
  }));
});

words.forEach((item, index) => {
  const distractors = rotate(words, index + 2).filter(word => word.emoji !== item.emoji).slice(0, 2);
  const wordFirst = index % 2 !== 0;
  levels.push(make(4, index, 'Parole minuscole', 'medio', wordFirst ? 'word-to-image' : 'image-to-word', wordFirst ? {
    prompt: 'Leggi e scegli l’immagine', display: item.word, options: rotate([item.emoji, ...distractors.map(word => word.emoji)], index + 1),
    correctAnswer: item.emoji, hint: `Leggi la parola a piccoli pezzi.`, keyWord: item.word,
  } : {
    prompt: 'Guarda e scegli la parola', display: item.emoji, options: rotate([item.word, ...distractors.map(word => word.word)], index + 1),
    correctAnswer: item.word, hint: `La parola inizia con ${item.word[0]}.`, keyWord: item.word,
  }));
});

words.forEach((item, index) => {
  const distractors = rotate(words, index + 1).filter(word => word.emoji !== item.emoji).slice(0, 2);
  const phrase = `${item.article}${item.article === "l'" ? '' : ' '}${item.word}`;
  levels.push(make(5, index, 'Due parole', 'medio', 'two-word', {
    prompt: 'Leggi e scegli l’immagine', display: phrase, options: rotate([item.emoji, ...distractors.map(word => word.emoji)], index),
    correctAnswer: item.emoji, hint: `Guarda bene la parola ${item.word.toUpperCase()}.`, keyWord: item.word,
  }));
});

scenes.forEach((item, index) => {
  const distractors = differentScenes(item, index);
  levels.push(make(6, index, 'Frasi minime', 'medio', 'sentence-to-image', {
    prompt: 'Leggi e scegli la scena', display: item.sentence, options: rotate([item.scene, ...distractors.map(scene => scene.scene)], index),
    correctAnswer: item.scene, hint: 'Prima cerca chi c’è, poi che cosa fa.', keyWord: item.action,
  }));
});

qualities.forEach((item, index) => {
  const sameObject = qualities.filter(value => value.noun === item.noun && value.adjective !== item.adjective).slice(0, 2);
  levels.push(make(7, index, 'Frasi con qualità', 'difficile', 'sentence-to-image', {
    prompt: 'Leggi e scegli la figura giusta', display: item.sentence, options: rotate([`${item.emoji}${item.marker}`, ...sameObject.map(value => `${value.emoji}${value.marker}`)], index),
    correctAnswer: `${item.emoji}${item.marker}`, hint: 'Rileggi la parola del colore.', keyWord: item.adjective,
  }));
});

scenes.forEach((item, index) => {
  levels.push(make(8, index, 'Costruisci la frase', 'difficile', 'build-sentence', {
    prompt: 'Metti le parole in ordine', display: item.scene, visual: `La scena mostra: ${item.sentence}.`, options: rotate([item.article, item.noun, item.action], index),
    correctAnswer: item.sentence, hint: `Inizia con ${item.article.toUpperCase()}.`, keyWord: item.noun,
  }));
});

scenes.forEach((item, index) => {
  const otherActions = subjects.flatMap(subject => subject.actions).filter((action, position, all) => action !== item.action && all.indexOf(action) === position).slice(index % 5, index % 5 + 2);
  const distractors = otherActions.length === 2 ? otherActions : ['corre', 'dorme'].filter(action => action !== item.action).slice(0, 2);
  levels.push(make(9, index, 'Completa la frase', 'difficile', 'complete-sentence', {
    prompt: 'Scegli la parola che manca', display: `${item.article}${item.article === "l'" ? '' : ' '}${item.noun} ___`, visual: item.scene,
    options: rotate([item.action, ...distractors], index), correctAnswer: item.action, hint: `Guarda che cosa fa ${item.article}${item.article === "l'" ? '' : ' '}${item.noun}.`, keyWord: item.noun,
  }));
});

scenes.forEach((item, index) => {
  const distractors = differentScenes(item, index);
  levels.push(make(10, index, 'Capisco la frase', 'difficile', 'image-to-sentence', {
    prompt: 'Scegli la frase giusta', display: item.scene, options: rotate([item.sentence, ...distractors.map(scene => scene.sentence)], index),
    correctAnswer: item.sentence, hint: 'Controlla sia chi c’è sia che cosa fa.', keyWord: `${item.noun} ${item.action}`,
  }));
});

writeFileSync(new URL('../educational_game_content/learn-to-read.json', import.meta.url), `${JSON.stringify(levels, null, 2)}\n`);
console.log(`Create ${levels.length} attività: ${Array.from({ length: 10 }, (_, index) => levels.filter(item => item.level === index + 1).length).join(', ')}.`);
