// ==UserScript==
// @name          EVO Exit Time Calculator (6h 11m)
// @namespace     https://unibo.it/
// @version       1.00
// @description   Calcola l'orario di uscita su Personale Unibo (Sistema EVO) per 6 ore e 11 minuti, includendo la pausa tra timbrature e posiziona il bottone accanto ad "Ora del Giorno". Appare solo sulla pagina "Cartellino". Aggiunge una pausa predefinita di 10 minuti.
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

        console.log("--- Avvio calcolo per oggi (EVO Exit Time Calculator 6h 11m v1.00) ---");
        
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
                
                // Parsing per gestire E HH:mm e E[HH:mm]
                const matchStandard = orarioTesto.match(/^(E|U)\s(\d{2}:\d{2})$/); // Es: "E 08:00"
                const matchTelelavoro = orarioTesto.match(/^(E|U)\[(\d{2}:\d{2})\]$/); // Es: "E[08:00]"

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

        let pausaInizio = null;
        let pausaFine = null;
        let lastUIndex = -1;

        for (let i = badgeList.length - 1; i >= 0; i--) {
            if (badgeList[i].tipo === "U") {
                lastUIndex = i;
                pausaInizio = badgeList[i].orario;
                break;
            }
        }
        
        console.log(`Ultima U trovata: ${pausaInizio ? pausaInizio : 'Nessuna'}`);

        if (pausaInizio) {
            for (let j = lastUIndex + 1; j < badgeList.length; j++) {
                if (badgeList[j].tipo === "E") {
                    pausaFine = badgeList[j].orario;
                    break;
                }
            }
        }
        console.log(`Prima E dopo l'ultima U: ${pausaFine ? pausaFine : 'Nessuna'}`);

        // Minuti lavorativi base per 6 ore e 11 minuti (6 * 60 + 11 = 360 + 11 = 371 minuti)
        let minutiLavorativiBase = 371; 
        let pausaConsiderata = 0; // Minuti di pausa che verranno effettivamente inclusi nel calcolo

        // Logica per la pausa predefinita di 10 minuti
        const PAUSA_MINIMA_PREDEFINITA = 10; // 10 minuti di pausa predefinita

        if (pausaInizio && pausaFine) {
            const minutiPausaReale = timeToMinutes(pausaFine) - timeToMinutes(pausaInizio);
            console.log(`Minuti di pausa calcolati (reali): ${minutiPausaReale}`);

            // Se la pausa reale è valida (tra 1 e 179 minuti)
            if (minutiPausaReale > 0 && minutiPausaReale < 180) {
                // Prende il massimo tra la pausa reale e la pausa minima predefinita
                pausaConsiderata = Math.max(PAUSA_MINIMA_PREDEFINITA, minutiPausaReale);
                console.log(`Pausa considerata: ${pausaConsiderata} minuti (max tra reale e predefinita).`);
            } else {
                // Se la pausa reale non è valida (es. negativa o troppo lunga), usa la pausa minima predefinita
                pausaConsiderata = PAUSA_MINIMA_PREDEFINITA;
                console.log(`Pausa reale non valida, usando pausa predefinita: ${pausaConsiderata} minuti.`);
            }
        } else {
            // Se non ci sono timbrature di pausa (U-E), usa la pausa minima predefinita
            pausaConsiderata = PAUSA_MINIMA_PREDEFINITA;
            console.log(`Nessuna pausa U-E valida trovata, usando pausa predefinita: ${pausaConsiderata} minuti.`);
        }
        
        // Calcola i minuti lavorativi totali aggiungendo la pausa considerata
        const minutiLavorativiTotali = minutiLavorativiBase + pausaConsiderata;

        const entrataInizialeMinuti = timeToMinutes(entrataIniziale);
        const uscitaPrevistaMinuti = entrataInizialeMinuti + minutiLavorativiTotali;
        const uscitaPrevista = minutesToTime(uscitaPrevistaMinuti);

        console.log(`Calcolo finale (6h 11m): ${entrataIniziale} (entrata) + ${minutiLavorativiTotali} minuti (lavoro base + pausa) = ${uscitaPrevista}`);

        const celle = righeDelGiorno[0].querySelectorAll("td");
        if (celle.length >= 8) {
            const cellaOrario = celle[7]; 
            // Aggiorna la cella destinazione per non sovrapporsi all'altro script
            // Inseriamo l'orario calcolato in una nuova riga/cella o in una cella specifica se disponibile
            // Per ora, lo appendiamo allo stesso target dell'altro script, ma con un'etichetta chiara.
            // Se in futuro si volesse una cella separata, bisognerebbe identificare un'altra colonna.

            let existingText = cellaOrario.textContent;
            let newText = ` / ${uscitaPrevista} (6h11)`;
            
            // Evita di aggiungere duplicati se già presente
            if (!existingText.includes(" (6h11)")) {
                cellaOrario.textContent = existingText + newText;
            } else {
                // Se c'è già (6h11), lo aggiorna
                cellaOrario.textContent = existingText.replace(/ \/ \d{2}:\d{2} \(6h11\)/, newText);
            }

            cellaOrario.style.color = "purple"; // Colore diverso per distinzione
            cellaOrario.style.fontWeight = "bold"; 
            cellaOrario.title = `Entrata: ${entrataIniziale} + ${minutiLavorativiTotali} minuti (${pausaConsiderata} pausa inclusa) per 6h 11m`;
            console.log(`Orario ${uscitaPrevista} (6h 11m) inserito nella cella.`);
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
            calcolaSeiUndiciButton.textContent = "Ora 6h 11m"; 
            
            Object.assign(calcolaSeiUndiciButton.style, {
                padding: "10px",
                backgroundColor: "#8c00b0", // Un colore diverso (viola) per distinguerlo
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
            console.log("Bottone 'Ora 6h 11m' creato e aggiunto temporaneamente al body (solo su pagina Cartellino).");

            startPositioningSixElevenButton();
        }
    }, 500); 

    function startPositioningSixElevenButton() {
        const waitForOraDelGiornoButton = setInterval(() => {
            // Cerchiamo il bottone "Ora del Giorno" del primo script
            const oraDelGiornoButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Ora del Giorno'));
            
            if (calcolaSeiUndiciButton && oraDelGiornoButton) {
                clearInterval(waitForOraDelGiornoButton); 

                if (calcolaSeiUndiciButton.parentNode) {
                    calcolaSeiUndiciButton.parentNode.removeChild(calcolaSeiUndiciButton);
                }

                // Inseriamo il nuovo bottone dopo il bottone "Ora del Giorno"
                oraDelGiornoButton.parentNode.insertBefore(calcolaSeiUndiciButton, oraDelGiornoButton.nextSibling);
                console.log("Bottone 'Ora 6h 11m' riposizionato accanto al bottone 'Ora del Giorno'.");
                
                calcolaSeiUndiciButton.onclick = calcolaPerSeiOreUndici;
                console.log("Evento onclick ricollegato al bottone dopo il riposizionamento.");
            }
        }, 500); 
    }

})();
