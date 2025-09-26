// Objeto con los productos y sus precios.
const productos = {
    'sope de pollo': 20.00,
    'sope de picadillo': 20.00,
    'enchilada de pollo': 20.00,
    'enchilada de picadillo': 20.00,
    'doradita de pollo': 30.00,
    'doradita de picadillo': 30.00,
    'pozole chico': 50.00,
    'pozole grande': 70.00,
    'taco dorado': 16.00,
    'tostada': 80.00,
    'refresco cgico': 15.00,
    'refresco mediano': 25.00,
    'Coca Cola': 30.00,
    'agua natural': 15.00,
    'agua medio': 25.00,
    'agua litro': 40.00
};

const containerPersonas = document.getElementById('container-personas');
const btnAgregarPersona = document.getElementById('btn-agregar-persona');
const btnEnviarWhatsapp = document.getElementById('btn-enviar-whatsapp');
const totalFinalSpan = document.getElementById('total-final');
const numeroPedidoDisplay = document.getElementById('numero-pedido-display');

// Nuevas referencias para la entrega a domicilio
const checkboxEntregaDomicilio = document.getElementById('checkbox-entrega-domicilio');
const containerDatosDomicilio = document.getElementById('container-datos-domicilio');
const inputDireccion = document.getElementById('input-direccion');
const inputTelefonoContacto = document.getElementById('input-telefono-contacto');


// Lógica para el folio secuencial
function obtenerFolioActual() {
    return parseInt(localStorage.getItem('ultimoNumeroPedido') || '0');
}

function actualizarFolio() {
    let nuevoFolio = obtenerFolioActual() + 1;
    localStorage.setItem('ultimoNumeroPedido', nuevoFolio);
    numeroPedidoDisplay.textContent = nuevoFolio;
}

// Función para reiniciar el formulario
function reiniciarPedido() {
    containerPersonas.innerHTML = ''; // Elimina todas las personas
    totalFinalSpan.textContent = '$0.00'; // Reinicia el total final
    agregarPersona(); // Agrega una nueva persona para empezar el nuevo pedido
    numeroPedidoDisplay.textContent = obtenerFolioActual(); // Muestra el folio actual

    // Reiniciar también los campos de entrega a domicilio
    checkboxEntregaDomicilio.checked = false; // Desmarcar el checkbox
    containerDatosDomicilio.style.display = 'none'; // Ocultar el contenedor de domicilio
    inputDireccion.value = ''; // Limpiar campo de dirección
    inputTelefonoContacto.value = ''; // Limpiar campo de teléfono
}


// Función principal para recalcular todos los totales
function recalcularTotales() {
    let totalCuenta = 0;
    const personaOrdenes = document.querySelectorAll('.persona-orden');

    personaOrdenes.forEach(personaOrden => {
        let totalPersona = 0;
        const filas = personaOrden.querySelectorAll('.fila-producto');

        filas.forEach(fila => {
            const cantidad = parseInt(fila.querySelector('.cantidad').value) || 0;
            const producto = fila.querySelector('.producto-select').value;
            const precioUnitario = productos[producto] || 0;
            const subtotal = cantidad * precioUnitario;

            fila.querySelector('.subtotal span').textContent = subtotal.toFixed(2);
            totalPersona += subtotal;
        });

        personaOrden.querySelector('.total-persona-span').textContent = totalPersona.toFixed(2);
        totalCuenta += totalPersona;
    });

    totalFinalSpan.textContent = `$${totalCuenta.toFixed(2)}`;
}

// Actualiza las opciones de guiso/textura según el producto seleccionado
function actualizarOpciones(fila) {
    const productoSelect = fila.querySelector('.producto-select');
    let opcionesAdicionalesHTML = '';

    if (productoSelect.value.startsWith('sope')) {
        opcionesAdicionalesHTML = `
            <select class="opciones-adicionales">
                <option value="">(opción)</option>
                <option value="blandito">blandito</option>
                <option value="medio">medio</option>
                <option value="dorado">dorado</option>
            </select>
        `;
    } else if (productoSelect.value === 'tostada') {
        opcionesAdicionalesHTML = `
            <select class="opciones-adicionales">
                <option value="">(guiso)</option>
                <option value="cuero">cuero</option>
                <option value="pata">pata</option>
                <option value="surtida">surtida</option>
                <option value="carnaza">carnaza</option>
                <option value="pollo">pollo</option>
            </select>
        `;
    }

    const tdProducto = productoSelect.parentElement;
    const existingOptions = tdProducto.querySelector('.opciones-adicionales');
    if (existingOptions) existingOptions.remove();

    if (opcionesAdicionalesHTML) {
        tdProducto.insertAdjacentHTML('beforeend', opcionesAdicionalesHTML);
        tdProducto.querySelector('.opciones-adicionales').addEventListener('change', recalcularTotales);
    }
}

/**
 * Agrega una fila de producto a una tabla específica.
 * @param {HTMLElement} tbodyElement El <tbody> donde se añadirá la fila.
 */
function agregarFilaProducto(tbodyElement) {
    const productoInicial = 'sope de pollo';
    const precioInicial = productos[productoInicial];

    const nuevaFila = document.createElement('tr');
    nuevaFila.classList.add('fila-producto');
    nuevaFila.innerHTML = `
        <td><input type="number" value="1" min="1" class="cantidad"></td>
        <td>
            <select class="producto-select">
                ${Object.keys(productos).map(producto => `<option value="${producto}">${producto}</option>`).join('')}
            </select>
            <input type="text" class="comentarios" placeholder="Comentarios adicionales">
        </td>
        <td class="precio-unitario">$<span>${precioInicial.toFixed(2)}</span></td>
        <td class="subtotal">$<span>${precioInicial.toFixed(2)}</span></td>
        <td><button class="btn-eliminar">❌</button></td>
    `;

    tbodyElement.appendChild(nuevaFila);

    const cantidadInput = nuevaFila.querySelector('.cantidad');
    const productoSelect = nuevaFila.querySelector('.producto-select');
    const comentariosInput = nuevaFila.querySelector('.comentarios');
    const precioUnitarioSpan = nuevaFila.querySelector('.precio-unitario span');
    const btnEliminar = nuevaFila.querySelector('.btn-eliminar');

    productoSelect.addEventListener('change', () => {
        const productoSeleccionado = productoSelect.value;
        const precio = productos[productoSeleccionado];
        precioUnitarioSpan.textContent = precio.toFixed(2);
        recalcularTotales();
        actualizarOpciones(nuevaFila);
    });

    cantidadInput.addEventListener('input', recalcularTotales);
    comentariosInput.addEventListener('input', recalcularTotales);

    btnEliminar.addEventListener('click', () => {
        nuevaFila.remove();
        recalcularTotales();
    });

    recalcularTotales();
    actualizarOpciones(nuevaFila);
}

/**
 * Agrega una nueva sección de persona al pedido.
 */
function agregarPersona() {
    const nuevaPersona = document.createElement('div');
    nuevaPersona.classList.add('persona-orden');

    nuevaPersona.innerHTML = `
        <h3>Pedido de:</h3>
        <input type="text" class="nombre-persona" placeholder="Nombre de la persona">
        <div class="productos-persona">
            <table>
                <thead>
                    <tr>
                        <th>Cant.</th>
                        <th>Producto</th>
                        <th class="precio-col">Precio Unit.</th>
                        <th>Subtotal</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody class="lista-productos-persona">
                </tbody>
            </table>
            <button class="btn-agregar-orden">➕ Agregar Producto</button>
        </div>
        <div class="totales-persona">
            <span>Subtotal de esta persona:</span>
            $<span class="total-persona-span">0.00</span>
        </div>
    `;

    containerPersonas.appendChild(nuevaPersona);

    const tbody = nuevaPersona.querySelector('.lista-productos-persona');
    const btnAgregarOrden = nuevaPersona.querySelector('.btn-agregar-orden');

    agregarFilaProducto(tbody);
    btnAgregarOrden.addEventListener('click', () => agregarFilaProducto(tbody));
}

// Función para generar el mensaje de WhatsApp
function generarMensajeWhatsApp() {
    const pedidoNumero = numeroPedidoDisplay.textContent;
    let mensaje = `*Pedido # ${pedidoNumero}*\n\n`;

    // Incluir datos de entrega a domicilio si está activo
    if (checkboxEntregaDomicilio.checked) {
        const direccion = inputDireccion.value.trim();
        const telefono = inputTelefonoContacto.value.trim();
        mensaje += `*ENTREGA A DOMICILIO*\n`;
        mensaje += `*Dirección:* ${direccion || 'No especificada'}\n`;
        mensaje += `*Teléfono:* ${telefono || 'No especificado'}\n\n`;
    } else {
        mensaje += `*Para recoger en local*\n\n`;
    }


    const personas = document.querySelectorAll('.persona-orden');
    personas.forEach(persona => {
        const nombre = persona.querySelector('.nombre-persona').value || 'Sin nombre';
        mensaje += `*Para: ${nombre}*\n`;

        const filas = persona.querySelectorAll('.fila-producto');
        filas.forEach(fila => {
            const cantidad = fila.querySelector('.cantidad').value;
            const producto = fila.querySelector('.producto-select').value;
            const opcionesAdicionales = fila.querySelector('.opciones-adicionales');
            const comentarios = fila.querySelector('.comentarios').value;
            const subtotal = fila.querySelector('.subtotal span').textContent;

            let detalleProducto = `${cantidad} x ${producto}`;
            if (opcionesAdicionales && opcionesAdicionales.value) {
                detalleProducto += ` (${opcionesAdicionales.value})`;
            }
            if (comentarios) {
                detalleProducto += ` - ${comentarios}`;
            }

            mensaje += `- ${detalleProducto}: $${subtotal}\n`;
        });

        const subtotalPersona = persona.querySelector('.total-persona-span').textContent;
        mensaje += `_Subtotal de ${nombre}: $${subtotalPersona}_\n\n`;
    });

    const totalFinal = totalFinalSpan.textContent.replace('$', '');
    mensaje += `*TOTAL FINAL: $${totalFinal}*`;

    return encodeURIComponent(mensaje);
}

// Asignar eventos
btnAgregarPersona.addEventListener('click', agregarPersona);

// Evento para mostrar/ocultar los campos de domicilio
checkboxEntregaDomicilio.addEventListener('change', () => {
    if (checkboxEntregaDomicilio.checked) {
        containerDatosDomicilio.style.display = 'block';
    } else {
        containerDatosDomicilio.style.display = 'none';
        // Opcional: limpiar los campos al ocultarlos
        inputDireccion.value = '';
        inputTelefonoContacto.value = '';
    }
});


btnEnviarWhatsapp.addEventListener('click', () => {
    // Primero, genera y envía el mensaje de WhatsApp para el pedido ACTUAL
    const numeroWhatsApp = '3171012714';
    const mensaje = generarMensajeWhatsApp();
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(url, '_blank');

    // Luego, actualiza el folio para el SIGUIENTE pedido
    actualizarFolio();
    // Y finalmente, reinicia el formulario para el nuevo pedido
    reiniciarPedido();
});

// Inicializar la página con el folio actual (o 1 si es la primera vez)
// Primero actualizamos el folio para que muestre el siguiente al iniciar
actualizarFolio();
reiniciarPedido(); // Inicializa un pedido nuevo al cargar la página por primera vez