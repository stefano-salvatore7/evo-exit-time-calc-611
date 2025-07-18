// ==UserScript==
// @name          EVO Exit Time Calculator (6h 11m)
// @namespace     https://unibo.it/
// @version       1.10
// @description   Calcola e mostra l'orario di uscita su Personale Unibo (Sistema EVO) per 6 ore e 1 minuto di lavoro netto, a cui si aggiunge la pausa rilevata (o 10 minuti predefinite). L'orario viene visualizzato in una "pillola" viola con testo bianco. Sostituisce l'orario esistente nella cella. Il bottone "6 ore e 11" appare solo sulla pagina "Cartellino" e tenta di posizionarsi accanto ad "Ora del Giorno" o, in fallback, accanto ad "Aggiorna".
// @author        Stefano
// @match         https://personale-unibo.hrgpi.it/*
// @grant         none
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Converte una stringa oraria (HH:mm) in minuti totali dalla mezzanotte.
     * @param {string} t - L'orario in formato "HH:mm".
     * @returns {number} Il numero totale di minuti.
     */
    function timeToMinutes(t) {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    }

    /**
     * Converte un numero totale di minuti dalla mezzanotte in una stringa oraria (HH:mm).
     * @param {number} mins - Il numero totale di minuti.
     * @returns {string} L'orario in formato "HH:mm".
     */
    function minutesToTime(mins) {
        const h = String(Math.floor(mins / 60)).padStart(2, '0');
        const m = String(mins % 60).padStart(2, '0');
        return `${h}:${m}`;
    }

    /**
     * Funzione principale per calcolare l'orario di uscita previsto per 6h 11m.
     * @param {Event} event - L'oggetto evento del click per prevenire la propagazione.
     */
    function calcolaPerSeiOreUndici(event) {
        event.stopPropagation();
        event.preventDefault();

        console.log("--- Avvio calcolo per oggi (EVO Exit Time Calculator 6h 11m v1.10) ---"); // Modificato versione

        const oggi = new Date();
        const giornoOggi = String(oggi.getDate());
        console.log(`Giorno corrente: ${giornoOggi}`);

        const righeTabella = document.querySelectorAll('table tr');
        let righeDelGiorno = [];
        let foundTodayRow = false;

        for (const riga of righeTabella) {
            const primaCella = riga.querySelector("td");
            if (primaCella) {
                const testoPrimaCella = primaCella.textContent.trim();

                if (testoPrimaCella === giornoOggi) {
                    foundTodayRow = true;
                    righeDelGiorno.push(riga);
                }
                else if (foundTodayRow && testoPrimaCella === "") {
                    righeDelGiorno.push(riga);
                }
                else if (foundTodayRow && testoPrimaCella !== "") {
                    break;
                }
            }
        }

        console.log(`Righe trovate per il giorno ${giornoOggi}:`, righeDelGiorno.length, righeDelGiorno);
        if (righeDelGiorno.length === 0) {
            console.warn("⚠️ Nessuna riga trovata per il giorno corrente.");
            return;
        }

        const badgeList = [];

        for (const riga of righeDelGiorno) {
            const possibleBadgeElements = riga.querySelectorAll("span[class*='badge-success'], span[class*='badge-danger'], div[class*='badge-success'], div[class*='badge-danger']");

            possibleBadgeElements.forEach(badge => {
                const orarioTesto = badge.textContent.trim();
                let tipo = null;
                let orario = null;

                const matchStandard = orarioTesto.match(/^(E|U)\s(\d{2}:\d{2})$/);
                const matchTelelavoro = orarioTesto.match(/^(E|U)\[(\d{2}:\d{2})\]$/);

                if (matchStandard) {
                    tipo = matchStandard[1];
                    orario = matchStandard[2];
                } else if (matchTelelavoro) {
                    tipo = matchTelelavoro[1];
                    orario = matchTelelavoro[2];
                }

                if (tipo && orario) {
                     badgeList.push({
                        tipo: tipo,
                        orario: orario,
                        originalElement: badge
                    });
                } else {
                    console.warn(`[DEBUG] Rilevato testo non valido per orario: "${orarioTesto}" dall'elemento:`, badge);
                }
            });
        }

        badgeList.sort((a, b) => timeToMinutes(a.orario) - timeToMinutes(b.orario));

        console.log("Badge rilevati (e ordinati cronologicamente):", badgeList);

        if (badgeList.length === 0) {
            console.warn("⚠️ Nessun badge E/U trovato per il giorno corrente.");
            return;
        }

        const entrataInizialeObj = badgeList.find(b => b.tipo === "E");
        if (!entrataInizialeObj) {
            console.warn("⚠️ Nessuna timbratura di ENTRATA ('E') trovata.");
            return;
        }
        const entrataIniziale = entrataInizialeObj.orario;
        console.log(`Entrata iniziale rilevata: ${entrataIniziale}`);

        // Base di lavoro NETTA: 6 ore e 1 minuto (361 minuti)
        const MINUTI_LAVORATIVI_NETTI_6H_01M = 361;

        // Logica per la pausa
        let pausaInizio = null;
        let pausaFine = null;
        let lastUIndex = -1;
        const PAUSA_MINIMA_PREDEFINITA = 10; // 10 minuti di pausa predefinita
        let pausaConsiderata = 0; // Questa sarà la pausa che verrà aggiunta al lavoro netto

        for (let i = badgeList.length - 1; i >= 0; i--) {
            if (badgeList[i].tipo === "U") {
                lastUIndex = i;
                pausaInizio = badgeList[i].orario;
                break;
            }
        }

        if (pausaInizio) {
            for (let j = lastUIndex + 1; j < badgeList.length; j++) {
                if (badgeList[j].tipo === "E") {
                    pausaFine = badgeList[j].orario;
                    break;
                }
            }
        }

        if (pausaInizio && pausaFine) {
            const minutiPausaReale = timeToMinutes(pausaFine) - timeToMinutes(pausaInizio);
            // Se la pausa reale è valida (tra 1 e 179 minuti), usa la reale
            if (minutiPausaReale > 0 && minutiPausaReale < 180) {
                pausaConsiderata = minutiPausaReale;
                console.log(`Pausa reale rilevata e considerata: ${pausaConsiderata} minuti.`);
            } else {
                // Se la pausa reale non è valida (es. negativa o troppo lunga), usa la predefinita
                pausaConsiderata = PAUSA_MINIMA_PREDEFINITA;
                console.log(`Pausa reale non valida o eccessiva. Usando pausa predefinita: ${pausaConsiderata} minuti.`);
            }
        } else {
            // Se non ci sono timbrature U-E valide, usa la pausa minima predefinita
            pausaConsiderata = PAUSA_MINIMA_PREDEFINITA;
            console.log(`Nessuna pausa U-E valida trovata, usando pausa predefinita: ${pausaConsiderata} minuti.`);
        }

        // Calcola i minuti lavorativi totali aggiungendo la pausa considerata al lavoro netto
        const minutiLavorativiTotali = MINUTI_LAVORATIVI_NETTI_6H_01M + pausaConsiderata;

        const entrataInizialeMinuti = timeToMinutes(entrataIniziale);
        const uscitaPrevistaMinuti = entrataInizialeMinuti + minutiLavorativiTotali;
        const uscitaPrevista = minutesToTime(uscitaPrevistaMinuti);

        console.log(`Calcolo finale (6h 11m): ${entrataIniziale} (entrata) + ${MINUTI_LAVORATIVI_NETTI_6H_01M} (lavoro netto) + ${pausaConsiderata} (pausa) = ${uscitaPrevista}`);

        const celle = righeDelGiorno[0].querySelectorAll("td");
        if (celle.length >= 8) {
            const cellaOrario = celle[7];
            // Crea un <span> e applica gli stili del "bottone"
            cellaOrario.innerHTML = ''; // Pulisci la cella
            const displaySpan = document.createElement('span');
            displaySpan.textContent = uscitaPrevista;

            Object.assign(displaySpan.style, {
                backgroundColor: "#8c00b0", // Sfondo viola
                color: "white",             // Testo bianco
                padding: "5px 10px",        // Padding
                borderRadius: "4px",        // Bordi arrotondati
                fontWeight: "bold",
                display: "inline-block"     // Permette padding e margini
            });

            cellaOrario.appendChild(displaySpan);
            cellaOrario.title = `Entrata: ${entrataIniziale} + ${MINUTI_LAVORATIVI_NETTI_6H_01M} minuti (netti) + ${pausaConsiderata} minuti (pausa) = ${uscitaPrevista}`;
            console.log(`Orario ${uscitaPrevista} (6h 11m) inserito nella cella con stile "bottone" viola.`);
        } else {
            console.warn("⚠️ Non ci sono abbastanza celle nella prima riga per inserire l'orario di uscita (6h 11m).");
        }
        console.log("--- Fine calcolo per oggi (6h 11m) ---");
    }

    // --- UI - Gestione del Bottone ---

    let calcolaSeiUndiciButton = null;

    const waitForPageElements = setInterval(() => {
        const cartellinoTitle = document.querySelector('div.title-label');
        const isCartellinoPage = cartellinoTitle && cartellinoTitle.textContent.includes('Cartellino');
        const timeTable = document.querySelector('table');

        if (isCartellinoPage && timeTable) {
            clearInterval(waitForPageElements);

            calcolaSeiUndiciButton = document.createElement("button");
            calcolaSeiUndiciButton.textContent = "6 ore e 11";

            Object.assign(calcolaSeiUndiciButton.style, {
                padding: "10px",
                backgroundColor: "#8c00b0",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                marginLeft: "10px"
            });

            calcolaSeiUndiciButton.setAttribute('type', 'button');
            calcolaSeiUndiciButton.onclick = calcolaPerSeiOreUndici;

            document.body.appendChild(calcolaSeiUndiciButton);
            console.log("Bottone '6 ore e 11' creato e aggiunto temporaneamente al body (solo su pagina Cartellino).");

            startPositioningSixElevenButton();
        }
    }, 500);

    function startPositioningSixElevenButton() {
        let positionInterval = setInterval(() => {
            const oraDelGiornoButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Ora del Giorno'));
            const updateButton = document.getElementById("firstFocus");

            if (!calcolaSeiUndiciButton) {
                clearInterval(positionInterval);
                console.warn("Bottone '6 ore e 11' non trovato, interrompo il posizionamento.");
                return;
            }

            // Scenario 1: 'Ora del Giorno' è presente E si è posizionato accanto ad 'Aggiorna' (posizione finale desiderata)
            if (oraDelGiornoButton && updateButton && oraDelGiornoButton.previousElementSibling === updateButton) {
                if (calcolaSeiUndiciButton.parentNode) {
                    if (calcolaSeiUndiciButton.parentNode !== oraDelGiornoButton.parentNode || calcolaSeiUndiciButton.previousElementSibling !== oraDelGiornoButton) {
                         oraDelGiornoButton.parentNode.insertBefore(calcolaSeiUndiciButton, oraDelGiornoButton.nextSibling);
                        console.log("SUCCESS: Bottone '6 ore e 11' posizionato accanto a 'Ora del Giorno' (dopo che si è stabilizzato). Posizionamento completato.");
                    } else {
                        console.log("INFO: Bottone '6 ore e 11' già correttamente posizionato accanto a 'Ora del Giorno'. Posizionamento completato.");
                    }
                } else {
                    console.warn("ERRORE: Bottone '6 ore e 11' non ha un parentNode per il riposizionamento preferenziale.");
                }
                clearInterval(positionInterval); // Posizionato con successo nella posizione finale, ferma il controllo
                calcolaSeiUndiciButton.onclick = calcolaPerSeiOreUndici;
            }
            // Scenario 2: 'Ora del Giorno' NON è ancora nella sua posizione finale, ma 'Aggiorna' è disponibile (fallback)
            else if (updateButton) {
                if (calcolaSeiUndiciButton.parentNode) {
                    // Sposta solo se non è già correttamente accanto ad Aggiorna o se è ancora in fondo
                    if (calcolaSeiUndiciButton.parentNode !== updateButton.parentNode || calcolaSeiUndiciButton.previousElementSibling !== updateButton) {
                        updateButton.parentNode.insertBefore(calcolaSeiUndiciButton, updateButton.nextSibling);
                        console.log("FALLBACK: Bottone '6 ore e 11' riposizionato accanto al bottone 'Aggiorna'. (In attesa che 'Ora del Giorno' si stabilizzi).");
                    } else {
                        // console.log("INFO: Bottone '6 ore e 11' già accanto ad 'Aggiorna', in attesa di 'Ora del Giorno'.");
                    }
                } else {
                    console.warn("ERRORE: Bottone '6 ore e 11' non ha un parentNode per il riposizionamento fallback.");
                }
                // NON FARE clearInterval qui. Continua a controllare per 'Ora del Giorno'.
                calcolaSeiUndiciButton.onclick = calcolaPerSeiOreUndici;
            }
            // Scenario 3: Nessun bottone di riferimento trovato ancora
            else {
                console.log("DEBUG: Attesa per i bottoni di riferimento ('Ora del Giorno' e 'Aggiorna'). Nessuno trovato ancora.");
            }
        }, 100); // Controlla ogni 100ms

        // Timeout di sicurezza
        setTimeout(() => {
            if (positionInterval) {
                clearInterval(positionInterval);
                console.warn("TIMEOUT: Posizionamento bottone '6 ore e 11' fallito dopo 30 secondi. Il bottone potrebbe rimanere nella posizione iniziale.");
            }
        }, 30000); // 30 secondi di attesa massima
    }

})();
