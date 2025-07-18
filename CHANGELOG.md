### **EVO Exit Time Calculator (6h 11m) - Log delle Versioni**

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
