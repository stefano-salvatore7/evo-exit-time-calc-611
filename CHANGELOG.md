### **EVO Exit Time Calculator (6h 11m) - Log delle Versioni**

---

**Versione 1.08**
* **Data di Rilascio:** 18 Luglio 2025
* **Autore:** Stefano
* **Modifiche:** **Migliorata la robustezza e la velocità del posizionamento del bottone.** Il bottone "6 ore e 11" si posizionerà immediatamente accanto al bottone "Aggiorna" di sistema come fallback iniziale, e poi si sposterà accanto al bottone "Ora del Giorno" se quest'ultimo appare successivamente, garantendo una posizione corretta e rapida in tutti gli scenari.

---

**Versione 1.07**
* **Data di Rilascio:** 18 Luglio 2025
* **Autore:** Stefano
* **Modifiche:** **Velocizzato il posizionamento del bottone.** Ridotto l'intervallo di controllo da 500ms a 100ms. Il bottone "6 ore e 11" si riposizionerà accanto al bottone "Ora del Giorno" (o "Aggiorna" come fallback) molto più rapidamente (max 2 secondi).

---

**Versione 1.06**
* **Data di Rilascio:** 18 Luglio 2025
* **Autore:** Stefano
* **Modifiche:** **Migliorata la logica di posizionamento del bottone "6 ore e 11".** Se il bottone "Ora del Giorno" (dello script principale) non è presente, il bottone si posizionerà come fallback accanto al bottone "Aggiorna" di sistema, garantendo che sia sempre in una posizione visibile.

---

**Versione 1.05**
* **Data di Rilascio:** 18 Luglio 2025
* **Autore:** Stefano
* **Modifiche:** **Miglioramento visuale dell'orario calcolato nella cella.** L'orario viene ora visualizzato all'interno di una "pillola" con sfondo viola e testo bianco, per una maggiore leggibilità e coerenza visiva con i bottoni.

---

**Versione 1.04**
* **Data di Rilascio:** 18 Luglio 2025
* **Autore:** Stefano
* **Modifiche:** Modificato il testo del bottone da "Ora 6h 11m" a "**6 ore e 11**" per una maggiore concisione.

---

**Versione 1.03**
* **Data di Rilascio:** 18 Luglio 2025
* **Autore:** Stefano
* **Modifiche:** **Ricalibrato il calcolo dell'orario di uscita per 6h 11m.** Il monte ore base è ora di **6 ore e 1 minuto di lavoro netto**. A questo si aggiunge la pausa rilevata (se timbrature U/E presenti e valide) oppure una pausa predefinita di 10 minuti (se U/E assenti o pausa non valida). Questo risolve l'errore precedente dove la pausa veniva aggiunta in modo errato o ignorata.
    * Esempio: Entrata 7:30 + 6h 01m (netto) + 17m (pausa U 13:23 E 13:40) = Uscita 13:48.

---

**Versione 1.02**
* **Data di Rilascio:** 18 Luglio 2025
* **Autore:** Stefano
* **Modifiche:** Implementata la **sovrascrittura completa della cella orario**. Quando si clicca sul bottone "Ora 6h 11m", l'orario calcolato sostituisce qualsiasi contenuto precedente nella cella, garantendo una visualizzazione singola e chiara (in viola). Aggiornate le descrizioni.

---

**Versione 1.01**
* **Data di Rilascio:** 18 Luglio 2025
* **Autore:** Stefano
* **Modifiche:** **Correzione critica del calcolo dell'orario di uscita.** Il calcolo ora si basa esattamente su 6 ore e 11 minuti **totali** di presenza dal timbro di entrata, senza aggiungere ulteriormente la pausa. La pausa viene comunque rilevata e mostrata nel tooltip per scopi informativi, ma non influisce sulla durata complessiva delle 6h 11m.
    * L'orario di uscita è `Ora di Entrata + 6 ore e 11 minuti`.
    * Testato con entrata 7:30 -> uscita 13:41.

---

**Versione 1.00**
* **Data di Rilascio:** 18 Luglio 2025
* **Autore:** Stefano
* **Modifiche:** Versione iniziale dello script "EVO Exit Time Calculator (6h 11m)".
    * Calcola l'orario di uscita per un totale di 6 ore e 11 minuti lavorative.
    * Include la gestione della pausa pranzo (U/E) con una pausa predefinita di 10 minuti.
    * Supporta i formati di timbratura standard (`E HH:mm`, `U HH:mm`) e telelavoro (`E[HH:mm]`, `U[HH:mm]`).
    * Aggiunge un bottone "Ora 6h 11m" posizionato accanto al bottone "Ora del Giorno" (se l'altro script è attivo).
    * Visualizza l'orario calcolato nella tabella accanto a quello per 7h 12m, con un colore e un'etichetta distintivi.

---
