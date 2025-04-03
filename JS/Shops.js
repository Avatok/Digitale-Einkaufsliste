let latitude, longitude;

// Funktion, um den Standort des Nutzers zu bekommen
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            // Zeige den Standort des Nutzers anhand der Koordinaten an
            getAddressFromCoordinates(latitude, longitude);

            // Suche nach Einkaufsmöglichkeiten in der Nähe (max. 2 km)
            fetchNearbyShops(latitude, longitude);
        }, function (error) {
            alert("Fehler beim Abrufen des Standorts: " + error.message);
        });
    } else {
        alert("Geolocation wird von diesem Browser nicht unterstützt.");
    }
}

// Funktion, um die Adresse aus den Koordinaten zu bekommen
function getAddressFromCoordinates(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

    // Anfrage an Nominatim (OpenStreetMap) zur Umwandlung von Koordinaten in eine Adresse
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.address) {
                const address = `${data.address.road} ${data.address.house_number}, ${data.address.city}`;
                document.getElementById('location-text').innerHTML = `Deine Adresse: ${address}`;
            } else {
                document.getElementById('location-text').innerHTML = 'Adresse konnte nicht gefunden werden.';
            }
        })
        .catch(error => console.log('Fehler:', error));
}

// Funktion, um nahegelegene Einkaufsmöglichkeiten anzuzeigen (max. 1 km Umkreis)
function fetchNearbyShops(latitude, longitude) {
    const query = `
        [out:json];
        (
            node["shop"="supermarket"](around:2000, ${latitude}, ${longitude});
            node["shop"="convenience"](around:2000, ${latitude}, ${longitude});
            node["shop"="discount"](around:2000, ${latitude}, ${longitude});
            node["shop"="supercenter"](around:2000, ${latitude}, ${longitude});
        );
        out body;
    `;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    // Anfrage an die Overpass API, um Shops im Umkreis von 2 km zu finden
    fetch(overpassUrl)
        .then(response => response.json())
        .then(data => {
            // Filtere die Shops, die sich innerhalb von 1 km befinden
            const nearbyShops = data.elements.filter(shop => {
                const distance = getDistance(latitude, longitude, shop.lat, shop.lon);
                return distance <= 1;  // Nur Shops im Umkreis von 1 km
            });

            // Zeige die gefilterten Shops an
            displayShops(nearbyShops);
        })
        .catch(error => console.log('Fehler:', error));
}

// Funktion, um die gefundenen Shops anzuzeigen
function displayShops(shops) {
    const offerList = document.getElementById('offer-list');
    offerList.innerHTML = '';  // Liste leeren

    if (shops.length === 0) {
        offerList.innerHTML = '<p class="text-muted text-center">Keine Einkaufsmöglichkeiten in der Nähe gefunden.</p>';
    } else {
        shops.forEach(shop => {
            const offerItem = document.createElement('div');
            offerItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-4');
            offerItem.innerHTML = `
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${shop.tags.name || 'Unbenannter Shop'}</h5>
                        <p class="card-text">Adresse: ${shop.tags.address || 'Keine Adresse verfügbar'}</p>
                        <p class="card-text">Entfernung: ${getDistanceInMeters(latitude, longitude, shop.lat, shop.lon)} Meter</p>
                        <div class="d-flex justify-content-between">
                            <a href="https://www.openstreetmap.org/?mlat=${shop.lat}&mlon=${shop.lon}#map=16/${shop.lat}/${shop.lon}" class="btn btn-outline-primary btn-sm" target="_blank">
                                Navigation
                            </a>
                            <a href="https://www.google.com/search?q=${encodeURIComponent(shop.tags.name)}" class="btn btn-outline-success btn-sm" target="_blank">
                                ${shop.tags.name || 'Laden'} suchen
                            </a>
                        </div>
                    </div>
                </div>
            `;
            offerList.appendChild(offerItem);
        });
    }
}

// Funktion zur Berechnung der Entfernung zwischen zwei Punkten (in km)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius der Erde in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;  // Entfernung in km
    return distance;
}

// Funktion, die immer die Entfernung in Metern anzeigt
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const distanceInKm = getDistance(lat1, lon1, lat2, lon2);
    const distanceInMeters = distanceInKm * 1000; // Umrechnung von km in Meter
    return Math.round(distanceInMeters); // Rundet die Entfernung auf die nächste ganze Zahl
}
