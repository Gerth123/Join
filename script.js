let previousWindow = null;
        let newWindow = null;

        // Funktion zum Öffnen eines neuen Tabs und Speichern der Referenz zum vorherigen Tab
        function openNewTab(newUrl, previousUrl) {
            // Schließen des vorherigen Tabs, falls noch geöffnet
            if (previousWindow !== null && !previousWindow.closed) {
                previousWindow.close();
            }
            // Öffnen des neuen Tabs
            newWindow = window.open(newUrl, '_blank');
            // Speichern des vorherigen Tabs
            previousWindow = window.open(previousUrl, '_self');
        }

        // Funktion zum Schließen des neuen Tabs und Zurückkehren zum vorherigen Tab
        function goBackToLastTab() {
            // Schließen des neuen Fensters, falls noch geöffnet
            if (newWindow !== null && !newWindow.closed) {
                newWindow.close();
            }
            // Fokus auf das vorherige Fenster setzen
            if (previousWindow !== null && !previousWindow.closed) {
                previousWindow.focus();
            }
        }