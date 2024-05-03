function openNewTab(newUrl) {
    newWindow = window.open(newUrl, '_blank');
}

// Funktion zum Schließen des neuen Tabs und Zurückkehren zum vorherigen Tab
function goBackToLastTab() {
    window.close();
}