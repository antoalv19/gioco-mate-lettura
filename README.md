# Piccoli Esploratori

Gioco educativo in italiano per somme, sottrazioni, lettura, scrittura e pratica guidata. Funziona interamente nel browser: non usa account, database o server applicativi.

## Avvio locale

Serve Node.js 18 o successivo.

```bash
npm install
npm run dev
```

Aprire l’indirizzo mostrato nel terminale. Per verificare la versione finale:

```bash
npm run build
npm run preview
```

## Struttura

- `src/components/`: schermate e componenti dell’interfaccia
- `src/services/`: caricamento e validazione dei contenuti
- `src/utils/`: generazione esercizi, testo, casualità e sintesi vocale
- `src/config/contentSource.ts`: unica configurazione della fonte dei contenuti
- `educational_game_content/`: tutti i contenuti educativi JSON

Il punteggio migliore viene conservato nel browser con `localStorage`. La lettura ad alta voce usa la Web Speech API: funziona meglio in browser moderni come Chrome, Edge e Safari. Se una voce italiana non è installata viene usata la voce disponibile; se l’API manca, il resto del gioco continua a funzionare.

Per modificare o pubblicare i contenuti, vedere [CONTENT_GUIDE.md](./CONTENT_GUIDE.md).
