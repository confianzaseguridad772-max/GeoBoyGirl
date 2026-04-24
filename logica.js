window.onload = () => {
    solicitarUbicacion();
};

function solicitarUbicacion() {
    const geoStatus = document.getElementById('geoStatus');
    const geoInput = document.getElementById('georeferencia');
    const btn = document.getElementById('submitBtn');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                // Guardar coordenadas
                geoInput.value = `${pos.coords.latitude}, ${pos.coords.longitude}`;
                
                // Actualizar interfaz visual
                geoStatus.innerText = "📍 Ubicación capturada correctamente";
                geoStatus.classList.add('ready'); // Activa el estilo verde del CSS
                
                // Habilitar el formulario
                btn.disabled = false;
                btn.innerText = "Registrar Información";
            },
            (error) => {
                console.error(error);
                geoStatus.innerText = "⚠️ Error: Debe activar el GPS y permitir el acceso.";
                geoStatus.style.background = "#fee2e2";
                geoStatus.style.color = "#b91c1c";
                alert("Para registrar los datos, es obligatorio activar la ubicación de su celular.");
            },
            { 
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0 
            }
        );
    } else {
        geoStatus.innerText = "❌ Su navegador no soporta geolocalización.";
    }
}

function agregarHijo() {
    const contenedorHijos = document.getElementById('lista-hijos');
    const div = document.createElement('div');
    div.className = 'entry-group';
    div.innerHTML = `
        <label>DNI del Hijo:</label>
        <input type="number" name="hijo_dni[]" placeholder="DNI" required>
        <label>Nombre del Hijo:</label>
        <input type="text" name="hijo_nombre[]" placeholder="Nombres" required>
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
    
    // Validación de seguridad extra por si el GPS falló
    const geoValue = document.getElementById('georeferencia').value;
    if (!geoValue) {
        alert("No se ha capturado la ubicación. Por favor, recargue la página.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Enviando datos al Excel...";

    const formData = new FormData(this);
    const data = {};
    
    // Procesar campos simples y arrays para que Google Apps Script los entienda
    formData.forEach((value, key) => {
        if (key.includes('[]')) {
            if (!data[key]) data[key] = [];
            data[key].push(value);
        } else {
            data[key] = value;
        }
    });

    // URL de tu Google Apps Script (Ya actualizada)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFBJeSC-FduYSBNY2zcdgEOOv7erSU1w0ENotDp_r1D77DjVdzhdJyQOQX7uHOESAE/exec';

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Evita problemas de CORS con Google Scripts
        body: JSON.stringify(data)
    }).then(() => {
        alert("¡Registro guardado exitosamente en GeoBoy!");
        location.reload(); // Recarga para limpiar y preparar nuevo registro
    }).catch((error) => {
        console.error('Error:', error);
        alert("Hubo un error al enviar. Verifique su conexión a internet.");
        btn.disabled = false;
        btn.innerText = "Reintentar Registro";
    });
});
