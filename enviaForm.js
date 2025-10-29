
// Configuración de FormSubmit
document.addEventListener('DOMContentLoaded', function () {
    // Establecer URL de éxito dinámicamente
    const successUrl = window.location.href.split('?')[0] + '?success=true';
    document.getElementById('formSuccessUrl').value = successUrl;

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

    // Enviar formulario usando FormSubmit
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    })
        .then(response => {
            if (response.ok) {
                showAlert('¡Consulta enviada con éxito! Nos pondremos en contacto contigo pronto.', 'success');
                form.reset();

                // Redirigir a página de éxito después de 2 segundos
                setTimeout(() => {
                    window.location.href = document.getElementById('formSuccessUrl').value;
                }, 2000);
            } else {
                throw new Error('Error en el envío');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Error al enviar la consulta. Por favor, intente nuevamente.', 'error');
        })
        .finally(() => {
            // Restaurar estado normal del botón
            submitText.textContent = 'Enviar Consulta';
            spinner.classList.add('d-none');
            submitBtn.disabled = false;
        });
}