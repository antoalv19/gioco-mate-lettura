# Guida ai contenuti

I file si trovano in `educational_game_content/`. Ogni elemento deve avere un `id` unico e una difficoltà tra `facile`, `medio` e `difficile`. Un elemento non valido viene ignorato e segnalato solo nella console del browser.

## Nuova domanda di matematica

Aggiungi un oggetto a `math-addition.json` o `math-subtraction.json`. In una sottrazione il primo operando deve essere maggiore o uguale al secondo. `answers` deve contenere `correctAnswer`.

```json
{"id":"add-013","difficulty":"facile","question":"Quanto fa 3 + 4?","operation":"addition","operands":[3,4],"correctAnswer":7,"answers":[6,7,8]}
```

Se non ci sono domande valide per un livello, l’app ne genera automaticamente.

## Nuovo esercizio di lettura

Aggiungi un oggetto a `reading.json`. I tipi ammessi sono `letter`, `syllable`, `word-to-emoji`, `emoji-to-word` e `sentence-to-emoji`. Usa il minuscolo per gli esercizi medi e frasi di 2–5 parole per gli esercizi difficili.

```json
{"id":"read-013","type":"emoji-to-word","difficulty":"difficile","prompt":"Scegli la parola giusta","display":"☀️","correctAnswer":"SOLE","answers":["MARE","SOLE","LUNA","CASA"]}
```

## Nuova parola di scrittura

Aggiungi un oggetto a `writing.json`, includendo parola, emoji, sillabe e versione con lettere mancanti.

```json
{"id":"write-013","word":"PANE","emoji":"🍞","category":"cibo","difficulty":"facile","syllables":["PA","NE"],"listenAndWrite":true,"completeWord":{"masked":"P_NE","missingLetters":["A"]}}
```

## Nuova curiosità

Aggiungi un oggetto a `fun-facts.json`. Categorie consigliate: `dinosauri`, `spazio`, `mare`, `animali`, `relitti`.

```json
{"id":"space-003","category":"spazio","text":"Venere è avvolto da tante nuvole!","difficulty":"facile"}
```

## Nuova lezione guidata

Aggiungi un oggetto a `practice-lessons.json`. Le aree ammesse sono `somme`, `sottrazioni`, `lettura` e `scrittura`.

```json
{"id":"practice-read-004","area":"lettura","difficulty":"facile","title":"La lettera L","explanation":"La L fa un suono leggero.","example":"L con A forma LA.","visual":["L","+","A","=","LA"],"question":"Quale sillaba leggi?","answers":["LA","LE","LI"],"correctAnswer":"LA"}
```

## Usare un repository GitHub remoto

1. Copia i sette file di `educational_game_content/` nella cartella `content/` del repository.
2. Apri `src/config/contentSource.ts`.
3. Imposta `mode` su `remote`.
4. Sostituisci `remoteBaseUrl` con l’URL raw della cartella, terminato da `/`.
5. Lascia `fallbackToLocal: true` per usare automaticamente i file locali quando la rete non è disponibile.

Quando aggiungi un nuovo file o ne cambi il nome, aggiorna anche `manifest.json`.
