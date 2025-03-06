document.addEventListener("DOMContentLoaded", () => {
    class Item {
        constructor(name, price, quantity) {
            this.name = name;
            this.price = price;
            this.quantity = quantity;
            this.bought = false;
        }
    }

    class ShoppingList {
        constructor() {
            this.items = JSON.parse(localStorage.getItem("items")) || [];
            this.itemList = document.getElementById("item-list");
            this.totalPrice = document.getElementById("total-price");
            this.itemName = document.getElementById("item-name");
            this.itemQuantity = document.getElementById("item-quantity");
            this.itemPrice = document.getElementById("item-price");
            this.addItemBtn = document.getElementById("add-item");
            this.addItemBtn.addEventListener("click", () => this.addItem());
            this.updateList();
        }

        saveToLocalStorage() {
            localStorage.setItem("items", JSON.stringify(this.items));
        }

        updateList() {
            this.itemList.innerHTML = "";
            let total = 0;
            this.items.forEach((item, index) => {
                const li = document.createElement("li");
                li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "shadow-sm", "rounded-lg", "p-2");

                const itemNameSpan = document.createElement("span");
                itemNameSpan.textContent = `${item.quantity} x ${item.name} - ${item.price.toFixed(2)}€ - ${(item.price * item.quantity).toFixed(2)}€`; // Gesamtpreis des Produkts (Anzahl * Preis)
                itemNameSpan.style.textDecoration = item.bought ? "line-through" : "none"; // Nur der Text wird durchgestrichen

                li.appendChild(itemNameSpan); // Füge den Namen, Preis und Gesamtpreis als Span hinzu

                li.innerHTML += `
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-warning toggle mr-2 rounded" data-index="${index}">${item.bought ? 'Durchstreichen' : 'Markieren'}</button>
                        <button class="btn btn-sm btn-danger delete rounded" data-index="${index}">Löschen</button>
                    </div>`;

                this.itemList.appendChild(li);
                total += item.price * item.quantity; // Gesamtpreis unter Berücksichtigung der Stückzahl
            });
            this.totalPrice.innerText = `Gesamt: ${total.toFixed(2)}€`;
            this.saveToLocalStorage();
        }

        addItem() {
            const name = this.itemName.value.trim();
            const price = parseFloat(this.itemPrice.value);
            const quantity = parseInt(this.itemQuantity.value);

            if (name && !isNaN(price) && price > 0 && !isNaN(quantity) && quantity > 0) {
                this.items.push(new Item(name, price, quantity));
                this.itemName.value = "";
                this.itemQuantity.value = "";
                this.itemPrice.value = "";
                this.updateList();
            }
        }

        deleteItem(index) {
            this.items.splice(index, 1);
            this.updateList();
        }

        toggleBought(index) {
            this.items[index].bought = !this.items[index].bought;
            this.updateList();
        }
    }

    const shoppingList = new ShoppingList();

    document.getElementById("item-list").addEventListener("click", (event) => {
        if (event.target.classList.contains("delete")) {
            shoppingList.deleteItem(event.target.dataset.index);
        }
        if (event.target.classList.contains("toggle")) {
            shoppingList.toggleBought(event.target.dataset.index);
        }
    });
});
