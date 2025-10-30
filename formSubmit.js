// Configuración de FormSubmit
document.addEventListener('DOMContentLoaded', function () {
    // Establecer URL de éxito dinámicamente
    const successUrl = window.location.href.split('?')[0] + '?success=true';

    // Crear input hidden si no existe
    let successUrlInput = document.getElementById('formSuccessUrl');
    if (!successUrlInput) {
        successUrlInput = document.createElement('input');
        successUrlInput.type = 'hidden';
        successUrlInput.id = 'formSuccessUrl';
        successUrlInput.name = '_next';
        document.getElementById('contactForm').appendChild(successUrlInput);
    }
    successUrlInput.value = successUrl;

    // Manejar parámetros de URL para mostrar mensajes
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showAlert('¡Consulta enviada con éxito! Nos pondremos en contacto contigo pronto.', 'success');
    }
});

// Validación y envío del formulario
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    if (validateForm()) {
        submitForm();
    }
});

// Validación del formulario
function validateForm() {
    let isValid = true;
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    // Remover estados de error previos
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
    });

    // Validar campos requeridos
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        }
    });

    // Validar email
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value && !emailRegex.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    }

    return isValid;
}

// Función para mostrar alertas (añadida)
function showAlert(message, type) {
    // Crear elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Insertar antes del formulario
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alertDiv, form);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Envío del formulario
function submitForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = submitBtn.querySelector('.submit-text');
    const spinner = submitBtn.querySelector('.spinner-border');

    // Mostrar estado de carga
    submitText.textContent = 'Enviando...';
    spinner.classList.remove('d-none');
    submitBtn.disabled = true;

    // control de depuración por consola
    console.log('Enviando formulario a:', form.action);
    console.log('Datos del formulario:', new FormData(form));


    // Enviar formulario usando FormSubmit
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    })
        .then(response => {
        console.log('Respuesta recibida:', response.status, response.statusText);
        if (response.ok) {
            showAlert('¡Consulta enviada con éxito! Nos pondremos en contacto contigo pronto.', 'success');
            form.reset();
            
            // Redirigir a página de éxito después de 2 segundos
            setTimeout(() => {
                window.location.href = document.getElementById('formSuccessUrl').value;
            }, 2000);
        } else {
            throw new Error(`Error HTTP: ${response.status}`);
        }
    })
       .catch(error => {
        console.error('Error en el envío:', error);
        showAlert('Error al enviar la consulta. Por favor, intente nuevamente.', 'error');
    })
    .finally(() => {
        // Restaurar estado normal del botón
        submitText.textContent = 'Enviar Consulta';
        spinner.classList.add('d-none');
        submitBtn.disabled = false;
    });
}