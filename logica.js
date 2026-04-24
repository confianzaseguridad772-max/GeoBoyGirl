// Obtener Georeferencia al cargar
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            document.getElementById('georeferencia').value = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        });
    }
};

function agregarHijo() {
    const div = document.createElement('div');
    div.className = 'entry-group';
    div.innerHTML = `
        <label>DNI:</label><input type="number" name="hijo_dni[]" required>
        <label>Nombre:</label><input type="text" name="hijo_nombre[]" required>
        <label>Fecha de Nacimiento:</label><input type="date" name="hijo_fecha[]" required>
    `;
    document.getElementById('lista-hijos').appendChild(div);
}

function agregarCuidador() {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'cuidadores[]';
    input.placeholder = 'Nombre del cuidador';
    input.style.marginBottom = '5px';
    document.getElementById('lista-cuidadores').appendChild(input);
}

document.getElementById('mainForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = "Enviando...";

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        if (!data[key]) { data[key] = []; }
        data[key].push(value);
    });

    // Envío a Google Apps Script
    fetch('TU_URL_DE_APPS_SCRIPT', {
        method: 'POST',
        mode: 'no-cors', // Importante para evitar bloqueos CORS simples
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }).then(() => {
        alert("Datos enviados correctamente.");
        this.reset();
        btn.disabled = false;
        btn.innerText = "Enviar Información";
    }).catch(err => alert("Error: " + err));
});
