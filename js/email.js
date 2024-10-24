(function() {
    // Inicializar EmailJS con tu clave pública
    emailjs.init("HnANh1dgCeeuthEpt"); // ← Reemplaza esto con tu clave pública de EmailJS
})();

const formulario = document.getElementById('formulario-contacto');
const botonEnviar = formulario.querySelector('.submit-btn');
const spanBoton = botonEnviar.querySelector('span');
const iconoBoton = botonEnviar.querySelector('i');

formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener y sanitizar los valores del formulario
    const nombre = sanitizeInput(this.nombre.value);
    const email = sanitizeInput(this.email.value);
    const mensaje = sanitizeInput(this.mensaje.value);

    // Validar campos vacíos
    if (!nombre || !email || !mensaje) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Validar formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }

    // Cambiar estado del botón a "enviando"
    botonEnviar.disabled = true;
    spanBoton.textContent = 'Enviando...';
    iconoBoton.className = 'fas fa-spinner fa-spin';

    // Preparar los parámetros para el envío
    const templateParams = {
        from_name: nombre,
        reply_to: email, // Este campo sirve para responder al correo del usuario
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
