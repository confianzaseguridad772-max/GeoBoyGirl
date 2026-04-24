window.onload = () => {
    solicitarUbicacion();
};

function solicitarUbicacion() {
    const geoStatus = document.getElementById('geoStatus');
    const geoText = document.getElementById('geoText');
    const geoIcon = geoStatus.querySelector('i');
    const geoInput = document.getElementById('georeferencia');
    const btn = document.getElementById('submitBtn');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                // 1. Guardar coordenadas
                geoInput.value = `${pos.coords.latitude}, ${pos.coords.longitude}`;
                
                // 2. Actualizar interfaz visual (Verde)
                geoStatus.classList.remove('waiting');
                geoStatus.classList.add('ready');
                geoIcon.classList.remove('fa-satellite-dish', 'fa-spin');
                geoIcon.classList.add('fa-check-circle');
                geoText.innerText = "Ubicación capturada correctamente";
                
                // 3. MOSTRAR EL BOTÓN DE ENVÍO
                btn.style.display = 'flex'; // Cambia de hidden a visible
                btn.disabled = false;
            },
            (error) => {
                console.error("Error GPS:", error);
                
                // Interfaz de error (Rojo intenso)
                geoStatus.style.background = "#fee2e2";
                geoStatus.style.color = "#991b1b";
                geoIcon.classList.remove('fa-satellite-dish', 'fa-spin');
                geoIcon.classList.add('fa-exclamation-triangle');
                geoText.innerText = "ERROR: Debe activar el GPS de su celular.";
                
                alert("⚠️ ATENCIÓN: El GPS es obligatorio. Por favor, actívelo y recargue la página.");
                
                // Mantenemos el botón oculto
                btn.style.display = 'none'; 
            },
            { 
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0 
            }
        );
    } else {
        geoText.innerText = "❌ Navegador no compatible con GPS.";
    }
}

// Las funciones de añadir hijo/cuidador ya funcionan con el nuevo CSS
function agregarHijo() {
    const contenedorHijos = document.getElementById('lista-hijos');
    const div = document.createElement('div');
    div.className = 'entry-group';
    div.innerHTML = `
        <label>DNI del Hijo:</label>
        <input type="number" name="hijo_dni[]" placeholder="DNI del menor" required>
        <label>Nombre del Hijo:</label>
        <input type="text" name="hijo_nombre[]" placeholder="Nombres completos" required>
        <label>Fecha de Nacimiento:</label>
        <input type="date" name="hijo_fecha[]" required>
    `;
    contenedorHijos.appendChild(div);
}

function agregarCuidador() {
    const contenedorCuidadores = document.getElementById('lista-cuidadores');
    const div = document.createElement('div');
    div.className = 'entry-group';
    div.innerHTML = `
        <label>Parentesco del Cuidador:</label>
        <select name="cuidadores[]" required>
            <option value="" disabled selected>Seleccione...</option>
            <option value="Madre">Madre</option>
            <option value="Padre">Padre</option>
            <option value="Abuelos">Abuelos</option>
            <option value="Tios">Tíos</option>
            <option value="Primos">Primos</option>
            <option value="Hermanos">Hermanos</option>
        </select>
    `;
    contenedorCuidadores.appendChild(div);
}

document.getElementById('mainForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    
    // Validación final de seguridad
    const geoValue = document.getElementById('georeferencia').value;
    if (!geoValue) {
        alert("No se ha capturado la ubicación GPS. No se puede guardar.");
        location.reload(); // Recarga para forzar el GPS
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Registrando en Excel...`;

    const formData = new FormData(this);
    const data = {};
    
    // Procesar campos simples y arrays para Google Apps Script
    formData.forEach((value, key) => {
        if (key.includes('[]')) {
            if (!data[key]) data[key] = [];
            data[key].push(value);
        } else {
            data[key] = value;
        }
    });

    // Tu URL actual (Asegúrate de que sea la URL de la IMPLEMENTACIÓN ACTUALIZADA)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNtVxD-aceLdrlTbyPyasko9UuH38Z7Y8C2JVxAElCT7o4cbR0KunaP7zgsesUMqsW/exec';

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Necesario para Google Scripts
        body: JSON.stringify(data)
    }).then(() => {
        alert("¡Registro guardado exitosamente en GeoBoy!");
        location.reload(); 
    }).catch((error) => {
        console.error('Error:', error);
        alert("Hubo un error al enviar. Verifique su conexión a internet.");
        btn.disabled = false;
        btn.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> Reintentar Registro`;
    });
});
