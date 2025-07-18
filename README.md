# EVO Exit Time Calculator (6h 11m)

Questo script Tampermonkey/Greasemonkey è una versione complementare dell'EVO Exit Time Calculator, specificamente progettata per calcolare l'orario di uscita basandosi su un monte ore di **6 ore e 1 minuto di lavoro netto**, a cui viene aggiunta la pausa. È destinato al sistema di gestione delle presenze EVO (usato su `https://personale-unibo.hrgpi.it/`). Calcola automaticamente l'orario di uscita previsto per la giornata corrente.

**(Versione Script: 1.06)**

## Caratteristiche

* **Calcolo Orario di Uscita (6h 01m + Pausa):** Determina l'orario di uscita necessario per completare **6 ore e 1 minuto di lavoro netto** (361 minuti). A questo si aggiunge la durata della pausa pranzo effettivamente rilevata dalle timbrature "U" e "E".
* **Gestione Pausa Flessibile:**
    * Se vengono rilevate timbrature di uscita (`U`) e rientro (`E`) che definiscono una pausa valida (tra 1 e 179 minuti), viene utilizzata la durata effettiva di tale pausa.
    * Se non ci sono timbrature di pausa (U/E) o la pausa rilevata non è valida (es. negativa o troppo lunga), viene applicata una pausa predefinita di 10 minuti.
* **Gestione Timbrature Flessibile:** Supporta sia il formato standard `E HH:mm` / `U HH:mm` che il formato "Telelavoro" `E[HH:mm]` / `U[HH:mm]`.
* **Iniezione Diretta e Sovrascrittura con Stile:** Inserisce l'orario calcolato direttamente nella tabella delle timbrature del giorno, **visualizzandolo come una "pillola" con sfondo viola e testo bianco**, sovrascrivendo qualsiasi orario precedentemente visualizzato da questo script o dall'EVO Exit Time Calculator (principale).
* **Posizionamento Intuitivo e Robusto:** Il bottone "**6 ore e 11**" appare solo sulla pagina "Cartellino".
    * Tenta di posizionarsi strategicamente accanto al bottone "**Ora del Giorno**" (se lo script principale è installato e attivo).
    * Se il bottone "Ora del Giorno" non viene trovato entro pochi secondi, il bottone "**6 ore e 11**" si riposizionerà automaticamente accanto al bottone "**Aggiorna**" (quello di sistema) per garantire che sia sempre in una posizione comoda e visibile.
* **Apparizione Condizionale:** Il bottone appare **esclusivamente sulla pagina "Cartellino"** per garantire il corretto funzionamento e evitare la comparsa su altre sezioni del portale EVO.

## Installazione e Aggiornamenti Automatici

Per installare lo script e assicurarti che si aggiorni automaticamente dal repository GitHub, segui i passaggi per il tuo browser:

### 1. Installare l'estensione Tampermonkey

Se non l'hai già fatto, installa l'estensione Tampermonkey nel tuo browser:

* **[Tampermonkey per Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)**
* **[Tampermonkey per Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpbldmmepgdkmfapfmccmocdkf)**
* **[Tampermonkey per Firefox](https://addons.mozilla.org/it/firefox/addon/tampermonkey/)** (o Greasemonkey se preferisci)

### 2. Configurazione del Browser (Importante!)

Per consentire l'esecuzione corretta dello script, potrebbero essere necessari alcuni passaggi di configurazione nel tuo browser:

#### Per Google Chrome:

1.  Apri Chrome e digita `chrome://extensions/` nella barra degli indirizzi, poi premi Invio.
2.  In alto a destra, attiva la **"Modalità sviluppatore"** (interruttore).
3.  Individua Tampermonkey nell'elenco delle estensioni.
4.  Clicca su **"Dettagli"** sotto Tampermonkey.
5.  Assicurati che l'opzione **"Consenti script utente"** sia attiva.
6.  Assicurati che l'opzione **"Consenti l'accesso agli URL del file"** sia attiva.

#### Per Microsoft Edge:

1.  Apri Edge e digita `edge://extensions/` nella barra degli indirizzi, poi premi Invio.
2.  In alto a destra, attiva la **"Modalità sviluppatore"** (interruttore). Potrebbe comparire un avviso di sicurezza nella parte superiore del browser; è normale quando si usa questa modalità.
3.  Individua Tampermonkey nell'elenco delle estensioni.
4.  Clicca su **"Dettagli"** sotto Tampermonkey.
5.  Assicurati che l'opzione **"Consenti estensioni da altri archivi"** (o "Allow extensions from other stores", se il browser è in inglese) sia attiva.
6.  **Assicurati che l'opzione "Consenti l'accesso agli URL del file" sia attiva.**

### 3. Installazione dello Script per Aggiornamenti Automatici

Ora che il tuo browser è configurato, puoi installare lo script:

[**Clicca qui per installare/aggiornare EVO Exit Time Calculator (6h 11m)**](https://github.com/stefano-salvatore7/evo-exit-time-calc-611/raw/refs/heads/main/evo-exit-time-calculator-611.user.js)

* Dopo aver cliccato, Tampermonkey (o Greasemonkey) ti mostrerà il codice dello script e ti chiederà di **"Installa"** (se è la prima volta) o **"Aggiorna"** (se stai aggiornando una versione precedente). Conferma l'azione.

### 4. Verifica Aggiornamenti Automatici (Tampermonkey)

Una volta installato tramite il link RAW, Tampermonkey dovrebbe gestire automaticamente gli aggiornamenti. Puoi verificare le impostazioni:

* Clicca sull'icona di Tampermonkey nel tuo browser e seleziona **"Dashboard"**.
* Trova "EVO Exit Time Calculator (6h 11m)" nell'elenco.
* Verifica che la casella "Controlla aggiornamenti" sia spuntata. L'URL di aggiornamento dovrebbe essere corretto (quello RAW che hai usato per l'installazione).
* Tampermonkey controllerà periodicamente il repository per nuove versioni e ti notificherà se è disponibile un aggiornamento. Puoi anche forzare un controllo cliccando sull'icona delle frecce circolari (Aggiorna) accanto al nome dello script.

## Utilizzo

Una volta installato, lo script si attiverà automaticamente quando visiterai la pagina delle timbrature EVO su `https://personale-unibo.hrgpi.it/*`.

1.  Naviga alla pagina delle timbrature (assicurati che sia la pagina "Cartellino").
2.  Il bottone "**6 ore e 11**" apparirà accanto a "**Ora del Giorno**" (se presente) o accanto a "**Aggiorna**".
3.  Clicca su "**6 ore e 11**" per visualizzare l'orario di uscita calcolato per il giorno corrente (per 6h 01m di netto + pausa) nella tabella. Verrà visualizzato solo questo orario in una "pillola" viola. Se un orario calcolato per 7h 12m era presente, verrà sostituito.

## Contributi (Facoltativo)

Se desideri contribuire a migliorare questo script, sentiti libero di aprire una "Issue" o proporre una "Pull Request" sul repository GitHub.

## Log delle Versioni

Per un riepilogo delle modifiche e delle funzionalità introdotte in ogni versione dello script, consulta il file [CHANGELOG.md](CHANGELOG.md) nel repository.

---

*Sviluppato da Stefano con l'assistenza di Gemini.*
