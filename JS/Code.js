document.addEventListener("DOMContentLoaded", () => {
    class Item {
        constructor(name, price, quantity) {
            this.name = name;          // Name des Produkts
            this.price = price;        // Preis des Produkts
            this.quantity = quantity;  // Menge des Produkts
            this.bought = false;       // Status des Produkts (ob gekauft oder nicht)
        }
    }

    class ShoppingList {
        constructor() {
            // Lade die gespeicherten Items aus dem Local Storage oder verwende ein leeres Array
            this.items = JSON.parse(localStorage.getItem("items")) || [];
            this.itemList = document.getElementById("item-list"); // Element für die Liste der Items
            this.totalPrice = document.getElementById("total-price"); // Element für den Gesamtpreis
            this.itemName = document.getElementById("item-name"); // Eingabefeld für Produktname
            this.itemQuantity = document.getElementById("item-quantity"); // Eingabefeld für Menge
            this.itemPrice = document.getElementById("item-price"); // Eingabefeld für Preis
            this.addItemBtn = document.getElementById("add-item"); // Button zum Hinzufügen von Items
            this.addItemBtn.addEventListener("click", () => this.addItem()); // Event-Listener für den Button
            this.updateList(); // Initiale Aktualisierung der Liste
        }

        // Speichert die Liste der Items im Local Storage
        saveToLocalStorage() {
            localStorage.setItem("items", JSON.stringify(this.items));
        }

        // Aktualisiert die Anzeige der Einkaufsliste
        updateList() {
            this.itemList.innerHTML = ""; // Leert die Liste
            let total = 0; // Variable für den Gesamtpreis
            this.items.forEach((item, index) => {
                const li = document.createElement("li");
                // Erstellen eines Listenelements für jedes Item
                const itemNameSpan = document.createElement("span");
                itemNameSpan.textContent = `${item.quantity} x ${item.name} - ${item.price.toFixed(2)}€`; // Zeigt Produktinformationen an
                li.appendChild(itemNameSpan); // Füge die Produktinformationen hinzu

                // Buttons für Markieren und Löschen
                li.innerHTML += `
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-warning toggle" data-index="${index}">${item.bought ? 'Durchstreichen' : 'Markieren'}</button>
                        <button class="btn btn-sm btn-danger delete" data-index="${index}">Löschen</button>
                    </div>`;

                this.itemList.appendChild(li); // Füge das Listenelement zur Liste hinzu
                total += item.price * item.quantity; // Berechne den Gesamtpreis
            });
            this.totalPrice.innerText = `Gesamt: ${total.toFixed(2)}€`; // Zeige den Gesamtpreis an
            this.saveToLocalStorage(); // Speichern der Liste im Local Storage
        }

        // Fügt ein neues Item zur Liste hinzu
        addItem() {
            const name = this.itemName.value.trim(); // Hole den Produktnamen
            const price = parseFloat(this.itemPrice.value); // Hole den Preis
            const quantity = parseInt(this.itemQuantity.value); // Hole die Menge

            // Wenn alle Felder gültig sind, füge das Item zur Liste hinzu
            if (name && !isNaN(price) && price > 0 && !isNaN(quantity) && quantity > 0) {
                this.items.push(new Item(name, price, quantity));
                this.itemName.value = ""; // Eingabefelder zurücksetzen
                this.itemQuantity.value = "";
                this.itemPrice.value = "";
                this.updateList(); // Liste aktualisieren
            }
        }

        // Löscht ein Item aus der Liste
        deleteItem(index) {
            this.items.splice(index, 1); // Löscht das Item an der angegebenen Indexposition
            this.updateList(); // Liste nach dem Löschen aktualisieren
        }

        // Toggle für den "gekauft"-Status eines Items
        toggleBought(index) {
            this.items[index].bought = !this.items[index].bought;
            this.updateList(); // Liste aktualisieren
        }
    }

    // Erstelle eine neue Instanz der Einkaufslisten-Klasse
    const shoppingList = new ShoppingList();

    // Event-Listener für Klicks auf die Buttons "Löschen" und "Markieren"
    document.getElementById("item-list").addEventListener("click", (event) => {
        if (event.target.classList.contains("delete")) {
            shoppingList.deleteItem(event.target.dataset.index); // Lösche das Item
        }
        if (event.target.classList.contains("toggle")) {
            shoppingList.toggleBought(event.target.dataset.index); // Toggle den Status des Items
        }
    });
});
