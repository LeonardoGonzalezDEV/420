// Información predeterminada
const defaultEntries = [
    { id: 1, strain: "OG Kush", effect: "Relajante, eufórico", date: "2023-01-01" },
    { id: 2, strain: "Sour Diesel", effect: "Energizante, creativo", date: "2023-02-15" },
    { id: 3, strain: "Blue Dream", effect: "Felicidad, relajación", date: "2023-03-10" },
    { id: 4, strain: "Girl Scout Cookies", effect: "Euforia, creatividad", date: "2023-04-05" },
    { id: 5, strain: "White Widow", effect: "Enfoque, relajación", date: "2023-05-20" }
];

document.addEventListener("DOMContentLoaded", function () {
    const storedEntries = JSON.parse(localStorage.getItem("diaryEntries")) || defaultEntries;

    // Si no hay entradas almacenadas localmente, cargar las entradas predeterminadas
    if (storedEntries.length === 0) {
        localStorage.setItem("diaryEntries", JSON.stringify(defaultEntries));
    }

    loadEntries();
});

function loadEntries() {
    const storedEntries = JSON.parse(localStorage.getItem("diaryEntries")) || defaultEntries;
    const entriesDiv = document.getElementById("entries");

    // Ordenar las entradas por fecha descendente
    storedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

    entriesDiv.innerHTML = ""; // Limpiar las entradas existentes

    storedEntries.forEach((entryData) => {
        const entryDiv = createEntryElement(entryData);
        entriesDiv.appendChild(entryDiv);
    });
}

function addEntry() {
    const strain = document.getElementById("strain").value;
    const effect = document.getElementById("effect").value;
    const date = document.getElementById("date").value;

    if (strain && effect && date) {
        const entryData = { strain, effect, date };
        const entryDiv = createEntryElement(entryData);

        document.getElementById("entries").appendChild(entryDiv);

        // Limpiar los campos del formulario
        document.getElementById("diaryForm").reset();

        // Cerrar el modal
        $('#entryModal').modal('hide');

        // Mostrar la alerta
        showAlert("¡Nuevo efecto de droguita nueva agregada!");

        // Guardar la entrada localmente
        saveEntryLocally(entryData);
    } else {
        alert("Por favor, complete todos los campos mi rey.");
    }
}

function createEntryElement(entryData) {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("entry");

    const entryInfo = document.createElement("p");
    entryInfo.innerHTML = `<strong>Cepa:</strong> ${entryData.strain} | <strong>Efectos:</strong> ${entryData.effect} | <strong>Fecha:</strong> ${entryData.date}`;

    const entryActions = document.createElement("div");
    entryActions.classList.add("entry-actions");

    const shareIcon = document.createElement("i");
    shareIcon.classList.add("fas", "fa-share", "action-icon");
    shareIcon.addEventListener("click", function () {
        shareEntry(entryData);
    });

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt", "action-icon");
    deleteIcon.addEventListener("click", function () {
        deleteEntry(entryData);
    });

    
    entryActions.appendChild(deleteIcon);

    entryDiv.appendChild(entryInfo);
    entryDiv.appendChild(entryActions);

    return entryDiv;
}

function saveEntryLocally(entryData) {
    const storedEntries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    storedEntries.push(entryData);
    localStorage.setItem("diaryEntries", JSON.stringify(storedEntries));
}

function showAlert(message) {
    alert(message);
}

function shareEntry(entryData) {
    const shareText = `Cepa: ${entryData.strain}\nEfectos: ${entryData.effect}\nFecha: ${entryData.date}`;
    const sharedLink = `https://example.com/share?text=${encodeURIComponent(shareText)}`;

    // Mostrar el enlace en una alerta
    alert(`Comparte este enlace para que otros puedan ver esta entrada:\n${sharedLink}`);
}

function deleteEntry(entryData) {
    if (confirm("¿Estás seguro de que quieres eliminar esta entrada?")) {
        // Eliminar la entrada localmente
        removeEntryLocally(entryData);

        // Actualizar la vista
        loadEntries();
    }
}

function removeEntryLocally(entryData) {
    const storedEntries = JSON.parse(localStorage.getItem("diaryEntries")) || [];

    // Verificar si la entrada a eliminar no es una entrada predeterminada
    const isNotDefaultEntry = defaultEntries.every(defaultEntry => !isEqual(defaultEntry, entryData));

    if (isNotDefaultEntry) {
        // Eliminar la entrada localmente
        const updatedEntries = storedEntries.filter(entry => !isEqual(entry, entryData));
        localStorage.setItem("diaryEntries", JSON.stringify(updatedEntries));

        // Actualizar la vista
        loadEntries();
    } else {
        alert("esta no se borra mi rey intenta con otra.");
    }
}


function isEqual(entry1, entry2) {
    return (
        entry1.strain === entry2.strain &&
        entry1.effect === entry2.effect &&
        entry1.date === entry2.date
    );
}

// Cargar entradas compartidas si existe el parámetro "entries" en la URL
const urlParams = new URLSearchParams(window.location.search);
const sharedEntries = urlParams.get("entries");

if (sharedEntries) {
    const decodedEntries = JSON.parse(decodeURIComponent(sharedEntries));
    localStorage.setItem("diaryEntries", JSON.stringify(decodedEntries));
    loadEntries();
}
