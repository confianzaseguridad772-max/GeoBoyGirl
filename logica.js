// Obtener geolocalización al cargar el formulario
window.onload = () => {
    const geoStatus = document.getElementById('geoStatus');
    const geoInput = document.getElementById('georeferencia');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                geoInput.value = `${pos.coords.latitude}, ${pos.coords.longitude}`;
                geoStatus.innerText = "📍 Ubicación capturada";
                geoStatus.style.color = "#059669";
            },
            () => { geoStatus.innerText = "⚠️ Activa el GPS para registrar la ubicación"; },
            { enableHighAccuracy: true }
        );
    }
};

function agregarHijo() {
    const div = document.createElement('div');
    div.className = 'entry-group';
    div.innerHTML = `
        <label>DNI del Hijo:</label><input type="number" name="hijo_dni[]" required>
        <label>Nombre del Hijo:</label><input type="text" name="hijo_nombre[]" required>
        <label>Fecha de Nacimiento:</label><input type="date" name="hijo_fecha[]" required>
    `;
    document.getElementById('lista-hijos').appendChild(div);
}

function agregarCuidador() {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'cuidadores[]';
    input.placeholder = 'Nombre del cuidador';
    input.style.marginBottom = '10px';
    input.required = true;
    document.getElementById('lista-cuidadores').appendChild(input);
}

document.getElementById('mainForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = "Enviando...";

    const formData = new FormData(this);
    const data = {};
    
    // Procesar campos simples y arrays
    formData.forEach((value, key) => {
        if (key.includes('[]')) {
            if (!data[key]) data[key] = [];
            data[key].push(value);
        } else {
            data[key] = value;
        }
    });

    // REEMPLAZA ESTO CON LA URL DE TU SCRIPT DESPLEGADO
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFBJeSC-FduYSBNY2zcdgEOOv7erSU1w0ENotDp_r1D77DjVdzhdJyQOQX7uHOESAE/exec';

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
    }).then(() => {
        alert("¡Registro guardado correctamente!");
        location.reload();
    }).catch(() => {
        alert("Error al enviar.");
        btn.disabled = false;
    });
});
