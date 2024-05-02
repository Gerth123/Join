// let previousWindow = [];

// function openNewTab(newUrl, previousUrl) {
//     window.open(newUrl, '_blank');
//     previousWindow.splice(0, 1);
//     previousWindow.push(previousUrl);
// }
// function goBackToLastTab() {
//     window.open('add_task.html');
// }

let previousWindow = null;

// Funktion zum Öffnen eines neuen Tabs und Speichern der Referenz zum vorherigen Tab
function openNewTab(newUrl, previousUrl) {
    previousWindow = previousUrl;
    newWindow = window.open(newUrl, '_blank');
}

// Funktion zum Schließen des neuen Tabs und Zurückkehren zum vorherigen Tab
function goBackToLastTab() {
    window.location.href = previousWindow;
}