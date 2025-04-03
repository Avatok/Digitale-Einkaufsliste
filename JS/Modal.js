// Funktion, die aufgerufen wird, wenn der "Hinzufügen"-Button gedrückt wird
document.querySelectorAll('.add-item-btn').forEach(button => {
    button.addEventListener('click', function () {
        const quantity = document.getElementById('item-quantity').value;
        const name = document.getElementById('item-name').value;
        const price = document.getElementById('item-price').value;

        // Eingabewerte prüfen
        if (!quantity || !name || !price || quantity <= 0 || price <= 0) {
            // Fehler anzeigen, wenn ein Wert ungültig ist
            document.getElementById('errorMessage').innerText = "Bitte stelle sicher, dass alle Felder korrekt ausgefüllt sind.";
            $('#errorModal').modal('show'); // Bootstrap Modal anzeigen
        } else {
            // Wenn alles korrekt ist, führe die Logik für das Hinzufügen der Items aus
            // Hier kannst du die Logik hinzufügen, um die Artikel hinzuzufügen und die Gesamtpreisberechnung zu aktualisieren.
            console.log("Artikel hinzugefügt: " + name + ", Menge: " + quantity + ", Preis: " + price);
        }
    });
});
