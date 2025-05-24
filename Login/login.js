document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const formTitle = document.getElementById('form-title');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const messageCloseBtn = document.getElementById('message-close');

    // Usuarios almacenados en memoria (simulación de base de datos)
    // Se inicializa con un usuario por defecto
    let users = [
        { username: 'Maria', password: 'Maria123' }
    ];

    /**
     * Muestra un mensaje en la caja de mensajes.
     * @param {string} message - El texto del mensaje.
     * @param {string} type - El tipo de mensaje ('success' o 'error').
     */
    const showMessage = (message, type) => {
        messageText.textContent = message;
        messageBox.className = `message-box show ${type}`; // Añade clases para mostrar y tipo
        setTimeout(() => {
            messageBox.classList.remove('show'); // Oculta el mensaje después de 3 segundos
        }, 3000);
    };

    // Cierra el mensaje al hacer clic en el botón 'X'
    messageCloseBtn.addEventListener('click', () => {
        messageBox.classList.remove('show');
    });

    /**
     * Alterna la visibilidad de la contraseña en un campo de entrada.
     * @param {string} inputId - El ID del campo de entrada de contraseña.
     */
    window.togglePasswordVisibility = (inputId) => {
        const passwordInput = document.getElementById(inputId);
        const icon = passwordInput.nextElementSibling.querySelector('i'); // El icono es el siguiente hermano del input

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    };

    /**
     * Muestra el formulario de registro con animación.
     */
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        // Pequeño retraso para que la animación de salida del login se vea antes de la entrada del registro
        setTimeout(() => {
            registerForm.classList.add('active');
            formTitle.textContent = 'Registrarse';
            clearFormErrors(); // Limpia errores al cambiar de formulario
        }, 300); // Ajusta este tiempo si la animación no se ve fluida
    });

    /**
     * Muestra el formulario de inicio de sesión con animación.
     */
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        // Pequeño retraso para que la animación de salida del registro se vea antes de la entrada del login
        setTimeout(() => {
            loginForm.classList.add('active');
            formTitle.textContent = 'Iniciar Sesión';
            clearFormErrors(); // Limpia errores al cambiar de formulario
        }, 300); // Ajusta este tiempo si la animación no se ve fluida
    });

    /**
     * Limpia todos los mensajes de error de los formularios.
     */
    const clearFormErrors = () => {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    };

    /**
     * Valida los campos del formulario de registro.
     * @param {string} username - El nombre de usuario.
     * @param {string} password - La contraseña.
     * @param {string} confirmPassword - La confirmación de la contraseña.
     * @returns {boolean} - True si la validación es exitosa, false en caso contrario.
     */
    const validateRegisterForm = (username, password, confirmPassword) => {
        let isValid = true;
        clearFormErrors();

        // Validación de nombre de usuario
        if (username.length < 3) {
            document.getElementById('register-username-error').textContent = 'El usuario debe tener al menos 3 caracteres.';
            isValid = false;
        } else if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
            document.getElementById('register-username-error').textContent = 'Este usuario ya existe.';
            isValid = false;
        }

        // Validación de contraseña
        if (password.length < 6) {
            document.getElementById('register-password-error').textContent = 'La contraseña debe tener al menos 6 caracteres.';
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            document.getElementById('register-password-error').textContent = 'La contraseña debe contener al menos una mayúscula.';
            isValid = false;
        } else if (!/[a-z]/.test(password)) {
            document.getElementById('register-password-error').textContent = 'La contraseña debe contener al menos una minúscula.';
            isValid = false;
        } else if (!/[0-9]/.test(password)) {
            document.getElementById('register-password-error').textContent = 'La contraseña debe contener al menos un número.';
            isValid = false;
        }

        // Validación de confirmación de contraseña
        if (password !== confirmPassword) {
            document.getElementById('register-confirm-password-error').textContent = 'Las contraseñas no coinciden.';
            isValid = false;
        }

        return isValid;
    };

    /**
     * Maneja el envío del formulario de registro.
     */
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('register-confirm-password').value.trim();

        if (validateRegisterForm(username, password, confirmPassword)) {
            // Si la validación es exitosa, añade el nuevo usuario
            users.push({ username, password });
            showMessage('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
            // Limpia los campos del formulario de registro
            registerForm.reset();
            // Vuelve al formulario de login
            setTimeout(() => {
                showLoginLink.click(); // Simula un clic para volver al login
            }, 1500); // Pequeño retraso para que el usuario vea el mensaje de éxito
        } else {
            showMessage('Por favor, corrige los errores en el formulario de registro.', 'error');
        }
    });

    /**
     * Maneja el envío del formulario de inicio de sesión.
     */
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            showMessage(`¡Bienvenido, ${user.username}! Has iniciado sesión correctamente.`, 'success');
            // Redirige al usuario a la página principal de la aplicación (index.html en el directorio padre)
            setTimeout(() => {
                window.location.href = 'Inicio.html'; // Se asume que index.html está en el directorio padre
            }, 1000); // Pequeño retraso para que el usuario vea el mensaje de éxito
        } else {
            showMessage('Usuario o contraseña incorrectos.', 'error');
        }
    });
});
