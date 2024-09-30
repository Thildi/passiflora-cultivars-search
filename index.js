let cultivars = []; // Array zum Speichern der Cultivar-Daten

// Funktion, um die Daten aus der JSON-Datei zu laden
async function loadCultivars() {
  try {
    // Lade die JSON-Datei und speichere die Daten im cultivars-Array
    const response = await fetch("./lib/data.json");
    cultivars = await response.json();
  } catch (error) {
    // Fehlerbehandlung, falls das Laden der Daten fehlschlägt
    console.error("Fehler beim Laden der Cultivar-Daten:", error);
  }

  // Funktion, um die Anzahl der Einträge anzuzeigen
  function displayEntryCount() {
    const entryCountElement = document.getElementById("entry-count");
    entryCountElement.innerText = `Total Entries: ${cultivars.length}`; // Zeigt die Anzahl der Einträge an
  }

  displayEntryCount(); // Aufruf der Funktion zur Anzeige der Eintragsanzahl
}

// Funktion für die Suche von Cultivars basierend auf den Eingabefeldern

function searchCultivars() {
  const name = document
    .getElementById("cultivar-name")
    .value.trim()
    .toLowerCase();
  const femaleParent = document
    .getElementById("female-parent")
    .value.trim()
    .toLowerCase();
  const maleParent = document
    .getElementById("male-parent")
    .value.trim()
    .toLowerCase();
  const breeder = document.getElementById("breeder").value.trim().toLowerCase();
  const year = document.getElementById("year").value.trim();

  const results = cultivars.filter((cultivar) => {
    return (
      (name === "" || cultivar["Cultivar Name"].toLowerCase().includes(name)) &&
      (femaleParent === "" ||
        cultivar["Female Parent"].toLowerCase().includes(femaleParent)) &&
      (maleParent === "" ||
        (cultivar["Male Parent"] &&
          cultivar["Male Parent"].toLowerCase().includes(maleParent))) && // Null-Check und toLowerCase
      (breeder === "" || cultivar["Breeder"].toLowerCase().includes(breeder)) &&
      (year === "" ||
        (cultivar["Year"] && cultivar["Year"].toString() === year))
    );
  });

  displayResults(results);
}

/* ALTE FUNKTION: function capitalizeWords(str) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase()); // Ersetzt den ersten Buchstaben jedes Wortes durch einen Großbuchstaben
}*/

// Funktion zur Großschreibung der ersten Buchstaben in einem String
function capitalizeWords(str) {
  return str
    .toLowerCase() // Optional: Alle Zeichen erstmal klein machen
    .split(" ") // Zeichenkette nach Leerzeichen teilen
    .map((word) => {
      // Sonderfall für "Mc"-Präfix
      if (word.startsWith("mc")) {
        return "Mc" + word.charAt(2).toUpperCase() + word.slice(3);
      }
      // Standardmäßige Großschreibung
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
// Funktion, um einen Event Listener für die Enter-Taste zu allen Eingabefeldern hinzuzufügen
function addEnterKeyListenerToInputs() {
  // Array von IDs der Eingabefelder
  const inputIds = [
    "cultivar-name",
    "female-parent",
    "male-parent",
    "breeder",
    "year",
  ];

  // Iteriere über jedes Eingabefeld
  inputIds.forEach((inputId) => {
    const inputField = document.getElementById(inputId);
    inputField.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Verhindert, dass das Formular abgeschickt wird
        searchCultivars(); // Ruft die Suchfunktion auf
      }
    });
  });
}

// Funktion für die Anzeige der Ergebnisse in einer Tabelle
function displayResults(results) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Leere den Container vor der Anzeige neuer Ergebnisse

  // Überprüfen, ob Ergebnisse vorhanden sind
  if (results.length > 0) {
    const table = document.createElement("table");
    table.classList.add("result-table"); // Füge der Tabelle die CSS-Klasse hinzu

    // Tabelle Kopf erstellen
    const thead = document.createElement("thead");
    thead.innerHTML = `
            <tr>
                <th>Cultivar Name</th>
                <th>Female Parent</th>
                <th>Male Parent</th>
                <th>Breeder</th>
                <th>Year</th>
            </tr>
        `;
    table.appendChild(thead); // Kopf zur Tabelle hinzufügen

    // Tabelle Körper erstellen und Ergebnisse hinzufügen
    const tbody = document.createElement("tbody");
    results.forEach((cultivar) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td data-label="Cultivar Name">'${capitalizeWords(
        cultivar["Cultivar Name"]
      )}'</td>
      <td data-label="Female Parent">${cultivar["Female Parent"]}</td>
      <td data-label="Male Parent">${
        cultivar["Male Parent"] !== null ? cultivar["Male Parent"] : "N/A"
      }</td>
      <td data-label="Breeder">${capitalizeWords(cultivar["Breeder"])}</td>
      <td data-label="Year">${
        cultivar["Year"] !== null ? cultivar["Year"] : "N/A"
      }</td>
  `;
      tbody.appendChild(row); // Zeile zum Körper der Tabelle hinzufügen
    });
    table.appendChild(tbody); // Körper zur Tabelle hinzufügen
    resultsContainer.appendChild(table); // Tabelle im Container anzeigen
  } else {
    resultsContainer.innerHTML = "<p>Keine Ergebnisse gefunden</p>"; // Nachricht anzeigen, wenn keine Ergebnisse vorhanden sind
  }
}

// Reset-Funktion, um alle Eingabefelder zu leeren
function resetSearch() {
  document.getElementById("cultivar-name").value = "";
  document.getElementById("female-parent").value = "";
  document.getElementById("male-parent").value = "";
  document.getElementById("breeder").value = "";
  document.getElementById("year").value = "";
  document.getElementById("results").innerHTML = ""; // Ergebnisse zurücksetzen
}
// Der Button wird angezeigt, wenn der Benutzer nach unten scrollt
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  var backToTopBtn = document.getElementById("back-to-top-btn");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopBtn.style.display = "block"; // Button sichtbar machen
  } else {
    backToTopBtn.style.display = "none"; // Button verstecken
  }
}

// Scrollt die Seite nach oben, wenn der Button geklickt wird
document.getElementById("back-to-top-btn").onclick = function () {
  document.body.scrollTop = 0; // Für Safari
  document.documentElement.scrollTop = 0; // Für Chrome, Firefox, IE und Opera
};

// Event Listener für die Buttons
document
  .getElementById("search-btn")
  .addEventListener("click", searchCultivars); // Suchbutton
document.getElementById("reset-btn").addEventListener("click", resetSearch); // Resetbutton

window.onload = function () {
  loadCultivars(); // Lade die Daten
  addEnterKeyListenerToInputs(); // Füge den Enter-Taste-Listener hinzu
};
