// Navigation buttons functionality
document.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', function () {
        // Remove active class from all buttons
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.classList.remove('active-view');
        });
        // Add active class to clicked button
        this.classList.add('active-view');

        // Hide all content views
        document.querySelectorAll('.content-view').forEach(view => {
            view.classList.add('d-none');
        });
        // Show selected content view
        const viewId = 'view-' + this.getAttribute('data-view');
        document.getElementById(viewId).classList.remove('d-none');
    });
});

// Form submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Gracias por tu consulta. Nos pondremos en contacto contigo pronto.');
    this.reset();
});
