// Función para sanitizar las entradas y evitar posibles inyecciones de código
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.innerText = input;
    return div.innerHTML;
}

// Función para validar el input contra scripts maliciosos y otros patrones peligrosos
function validateInput(input) {
    const forbiddenPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /\bon\w+\s*=/gi,
        /javascript:/gi,
        /<[^>]*>/g,
        /['";(){}]/g
    ];
    return !forbiddenPatterns.some(pattern => pattern.test(input));
}

// Inicializar EmailJS con tu clave pública
(function() {
    emailjs.init("HnANh1dgCeeuthEpt");
})();

const formulario = document.getElementById('formulario-contacto');
const botonEnviar = formulario.querySelector('.submit-btn');
const spanBoton = botonEnviar.querySelector('span');
const iconoBoton = botonEnviar.querySelector('i');

// Mostrar u ocultar mensaje de error
function showError(inputId, message) {
    const errorSpan = document.getElementById(`error-${inputId}`);
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
}

function hideError(inputId) {
    const errorSpan = document.getElementById(`error-${inputId}`);
    errorSpan.style.display = 'none';
}

formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener y sanitizar los valores del formulario
    const nombre = sanitizeInput(this.nombre.value);
    const email = sanitizeInput(this.email.value);
    const mensaje = sanitizeInput(this.mensaje.value);
    
    let isValid = true;

    // Validar campo Nombre
    if (!nombre) {
        showError('nombre', 'Por favor, ingresa tu nombre.');
        isValid = false;
    } else if (!validateInput(nombre)) {
        showError('nombre', 'El nombre contiene caracteres no permitidos.');
        isValid = false;
    } else {
        hideError('nombre');
    }

    // Validar campo Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('email', 'Por favor, ingresa tu correo electrónico.');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Por favor, ingresa un correo electrónico válido.');
        isValid = false;
    } else {
        hideError('email');
    }

    // Validar campo Mensaje
    if (!mensaje) {
        showError('mensaje', 'Por favor, ingresa tu mensaje.');
        isValid = false;
    } else if (!validateInput(mensaje)) {
        showError('mensaje', 'El mensaje contiene caracteres no permitidos.');
        isValid = false;
    } else {
        hideError('mensaje');
    }

    // Si hay algún error, detener el envío
    if (!isValid) {
        return;
    }

    // Cambiar estado del botón a "enviando"
    botonEnviar.disabled = true;
    spanBoton.textContent = 'Enviando...';
    iconoBoton.className = 'fas fa-spinner fa-spin';

    // Preparar los parámetros para el envío
    const templateParams = {
        from_name: nombre,
        reply_to: email,
        message: mensaje,
        to_name: 'Cristóbal',
    };

    // Enviar el email
    emailjs.send('service_6hbremp', 'template_vimzk09', templateParams)
    .then(() => {
        // Éxito
        spanBoton.textContent = '¡Enviado!';
        iconoBoton.className = 'fas fa-check';

        // Limpiar el formulario
        formulario.reset();
        hideError('nombre');
        hideError('email');
        hideError('mensaje');

        // Restaurar el botón después de 3 segundos
        setTimeout(() => {
            spanBoton.textContent = 'Enviar';
            iconoBoton.className = 'fas fa-paper-plane';
            botonEnviar.disabled = false;
        }, 3000);
    })
    .catch((error) => {
        // Error
        console.error('Error:', error);
        spanBoton.textContent = 'Error';
        iconoBoton.className = 'fas fa-exclamation-triangle';

        // Restaurar el botón después de 3 segundos
        setTimeout(() => {
            spanBoton.textContent = 'Enviar';
            iconoBoton.className = 'fas fa-paper-plane';
            botonEnviar.disabled = false;
        }, 3000);
    });
});
