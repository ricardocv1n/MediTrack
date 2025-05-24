// Datos de perfil ficticios para María López  de Montería
const profileData = {
    name: "María López ",
    role: "Paciente",
    email: "María.López@email.com",
    phone: "+57 310 123 4567",
    address: "Calle 29 # 14-50, Montería, Córdoba",
    bio: "Paciente en MediTrack, interesada en el bienestar integral.",
    profileImage: "https://placehold.co/150x150/b2dfdb/00796b?text=SR" // Placeholder con iniciales SR
};

// Traducciones para los elementos de la interfaz
const translations = {
    es: {
        profileAndSettings: "Perfil y Configuración",
        managePersonalInformation: "Gestiona tu información personal y preferencias de la cuenta.",
        profile: "Perfil",
        security: "Seguridad",
        preferences: "Preferencias",
        accountActions: "Acciones de Cuenta",
        personalInfo: "Información personal",
        contactDetails: "Datos de contacto",
        email: "Correo electrónico",
        phone: "Teléfono",
        address: "Dirección",
        saveChanges: "Guardar cambios",
        securitySettings: "Configuración de seguridad",
        changePassword: "Cambiar contraseña",
        updatePasswordRegularly: "Actualiza tu contraseña regularmente para mayor seguridad",
        change: "Cambiar",
        twoFactorAuth: "Verificación en dos pasos",
        addSecurityLayer: "Añade una capa adicional de seguridad a tu cuenta",
        loginActivity: "Actividad de inicio de sesión",
        reviewRecentAccess: "Revisa los accesos recientes a tu cuenta",
        viewActivity: "Ver actividad",
        activeSessions: "Sesiones activas",
        manageConnectedDevices: "Gestiona los dispositivos conectados a tu cuenta",
        manage: "Gestionar",
        preferencesTitle: "Preferencias",
        language: "Idioma",
        selectPreferredLanguage: "Selecciona tu idioma preferido",
        notifications: "Notificaciones",
        toggleSystemNotifications: "Activa o desactiva las notificaciones del sistema",
        accountSettings: "Configuración de la cuenta",
        downloadMyData: "Descargar mis datos",
        deleteAccount: "Eliminar cuenta",
        logout: "Cerrar Sesión",
        editProfile: "Editar perfil",
        fullName: "Nombre completo",
        biography: "Biografía",
        cancel: "Cancelar",
        currentPassword: "Contraseña actual",
        newPassword: "Nueva contraseña",
        confirmNewPassword: "Confirmar nueva contraseña",
        securityLow: "Seguridad: baja",
        securityMedium: "Seguridad: media",
        securityHigh: "Seguridad: alta",
        updatePassword: "Actualizar contraseña",
        recentActivity: "Actividad reciente",
        close: "Cerrar",
        activeSessionsTitle: "Sesiones activas",
        closeSession: "Cerrar sesión",
        closeAllSessions: "Cerrar todas las sesiones",
        deleteAccountConfirm: "¿Estás seguro de que deseas eliminar tu cuenta?",
        irreversibleAction: "Esta acción es irreversible. Se eliminarán todos tus datos personales, historial médico y configuraciones asociadas a esta cuenta.",
        confirmDeletePrompt: "Para confirmar, escribe \"ELIMINAR\" en el siguiente campo:",
        deleteAccountPermanently: "Eliminar cuenta permanentemente",
        downloadMyDataTitle: "Descargar mis datos",
        downloadFormat: "Formato de descarga",
        jsonFormat: "JSON (Formato universal)",
        csvFormat: "CSV (Para hojas de cálculo)",
        pdfFormat: "PDF (Documento imprimible)",
        dataRange: "Rango de datos",
        allMyData: "Todos mis datos",
        onlyProfileInfo: "Solo información de perfil",
        onlyMedicalHistory: "Solo historial médico",
        last12Months: "Últimos 12 meses",
        generateFile: "Generar archivo",
        changesSaved: "Cambios guardados correctamente",
        passwordsDoNotMatch: "Las contraseñas no coinciden",
        passwordUpdated: "Contraseña actualizada correctamente",
        accountDeleted: "Cuenta eliminada permanentemente",
        downloadingData: "Descargando datos en formato {format} ({range})",
        downloadCompleted: "Descarga completada",
        twoFactorAuthEnabled: "Verificación en dos pasos activada",
        twoFactorAuthDisabled: "Verificación en dos pasos desactivada",
        notificationsEnabled: "Notificaciones activadas",
        notificationsDisabled: "Notificaciones desactivadas",
        chromeWindows: "Navegador Chrome - Windows",
        androidChrome: "Android - Chrome Mobile",
        monteriaColombia: "Montería, Colombia",
        barranquillaColombia: "Barranquilla, Colombia",
        activeNow: "Activo ahora",
        active2HoursAgo: "Activo hace 2 horas"
    },
    en: {
        profileAndSettings: "Profile & Settings",
        managePersonalInformation: "Manage your personal information and account preferences.",
        profile: "Profile",
        security: "Security",
        preferences: "Preferences",
        accountActions: "Account Actions",
        personalInfo: "Personal Information",
        contactDetails: "Contact Details",
        email: "Email",
        phone: "Phone",
        address: "Address",
        saveChanges: "Save changes",
        securitySettings: "Security Settings",
        changePassword: "Change Password",
        updatePasswordRegularly: "Update your password regularly for better security",
        change: "Change",
        twoFactorAuth: "Two-factor authentication",
        addSecurityLayer: "Add an extra layer of security to your account",
        loginActivity: "Login Activity",
        reviewRecentAccess: "Review recent access to your account",
        viewActivity: "View activity",
        activeSessions: "Active Sessions",
        manageConnectedDevices: "Manage devices connected to your account",
        manage: "Manage",
        preferencesTitle: "Preferences",
        language: "Language",
        selectPreferredLanguage: "Select your preferred language",
        notifications: "Notifications",
        toggleSystemNotifications: "Enable or disable system notifications",
        accountSettings: "Account Settings",
        downloadMyData: "Download My Data",
        deleteAccount: "Delete Account",
        logout: "Log Out",
        editProfile: "Edit Profile",
        fullName: "Full Name",
        biography: "Biography",
        cancel: "Cancel",
        currentPassword: "Current Password",
        newPassword: "New Password",
        confirmNewPassword: "Confirm New Password",
        securityLow: "Security: low",
        securityMedium: "Security: medium",
        securityHigh: "Security: high",
        updatePassword: "Update Password",
        recentActivity: "Recent Activity",
        close: "Close",
        activeSessionsTitle: "Active Sessions",
        closeSession: "Close session",
        closeAllSessions: "Close all sessions",
        deleteAccountConfirm: "Are you sure you want to delete your account?",
        irreversibleAction: "This action is irreversible. All your personal data, medical history, and settings associated with this account will be deleted.",
        confirmDeletePrompt: "To confirm, type \"DELETE\" in the field below:",
        deleteAccountPermanently: "Delete account permanently",
        downloadMyDataTitle: "Download My Data",
        downloadFormat: "Download Format",
        jsonFormat: "JSON (Universal format)",
        csvFormat: "CSV (For spreadsheets)",
        pdfFormat: "PDF (Printable document)",
        dataRange: "Data Range",
        allMyData: "All my data",
        onlyProfileInfo: "Only profile information",
        onlyMedicalHistory: "Only medical history",
        last12Months: "Last 12 months",
        generateFile: "Generate file",
        changesSaved: "Changes saved successfully",
        passwordsDoNotMatch: "Passwords do not match",
        passwordUpdated: "Password updated successfully",
        accountDeleted: "Account deleted permanently",
        downloadingData: "Downloading data in {format} format ({range})",
        downloadCompleted: "Download completed",
        twoFactorAuthEnabled: "Two-factor authentication enabled",
        twoFactorAuthDisabled: "Two-factor authentication disabled",
        notificationsEnabled: "Notifications enabled",
        notificationsDisabled: "Notifications disabled",
        chromeWindows: "Chrome Browser - Windows",
        androidChrome: "Android - Chrome Mobile",
        monteriaColombia: "Montería, Colombia",
        barranquillaColombia: "Barranquilla, Colombia",
        activeNow: "Active now",
        active2HoursAgo: "Active 2 hours ago"
    }
};

// Obtener el idioma actual de localStorage o usar 'es' por defecto
let currentLanguage = localStorage.getItem('appLanguage') || 'es';

// Función para aplicar las traducciones
function applyTranslations() {
    // Seleccionar todos los elementos con el atributo data-translate-key
    const translatableElements = document.querySelectorAll('[data-translate-key]');

    translatableElements.forEach(element => {
        const key = element.getAttribute('data-translate-key');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            // Para inputs con placeholder, usar setAttribute
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', translations[currentLanguage][key]);
            } else {
                // Para otros elementos, actualizar textContent
                element.textContent = translations[currentLanguage][key];
            }
        }
    });

    // Actualizar el valor seleccionado en el dropdown de idioma
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }

    // Actualizar texto de seguridad de contraseña (si el modal está activo)
    const passwordStrengthText = document.querySelector('#changePasswordModal .strength-text');
    if (passwordStrengthText) {
        const newPasswordInput = document.getElementById('newPassword');
        const password = newPasswordInput ? newPasswordInput.value : '';
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;

        let strengthKey = 'securityLow';
        if (strength >= 4) strengthKey = 'securityHigh';
        else if (strength >= 2) strengthKey = 'securityMedium';
        passwordStrengthText.textContent = translations[currentLanguage][strengthKey];
    }
}


// Cargar el sidebar y aplicar datos de perfil
document.addEventListener('DOMContentLoaded', () => {
    fetch('sidebar/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;

            // Actualizar la foto de perfil en el sidebar
            const sidebarProfileImage = document.getElementById('sidebarProfileImage');
            if (sidebarProfileImage) {
                sidebarProfileImage.src = profileData.profileImage;
                sidebarProfileImage.alt = `Foto de perfil de ${profileData.name}`;
            }

            // Marcar como activo el elemento del menú correspondiente
            const currentPage = window.location.pathname.split('/').pop() || 'Inicio.html';
            document.querySelectorAll('.sidebar-menu a').forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });

            // Aplicar datos de perfil a la página
            document.querySelector('.profile-image').src = profileData.profileImage;
            document.querySelector('.profile-image').alt = `Foto de perfil de ${profileData.name}`;
            document.querySelector('.profile-name').textContent = profileData.name;
            document.querySelector('.profile-role').textContent = profileData.role;
            document.getElementById('email').value = profileData.email;
            document.getElementById('phone').value = profileData.phone;
            document.getElementById('address').value = profileData.address;
            document.getElementById('newName').value = profileData.name;
            document.getElementById('newEmail').value = profileData.email;
            document.getElementById('newPhone').value = profileData.phone;
            document.getElementById('newAddress').value = profileData.address;
            document.getElementById('newBio').value = profileData.bio;

            applyTranslations(); // Aplicar traducciones después de cargar el sidebar y datos iniciales
        })
        .catch(error => console.error('Error al cargar el sidebar:', error));

    // Funcionalidad de las pestañas
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Desactivar todas las pestañas y contenidos
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activar la pestaña y el contenido correspondiente
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            tab.classList.add('active');
        });
    });

    // Funcionalidad de los modales
    const openModalButtons = document.querySelectorAll('[data-modal-id]');
    const closeModalButtons = document.querySelectorAll('.close-button, .close-modal');
    const modals = document.querySelectorAll('.modal');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-id');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Evitar el scroll del fondo
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const modalId = button.getAttribute('data-modal-id');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto'; // Restablecer el scroll
            } else {
                // Si el botón de cierre no tiene data-modal-id, cierra todos los modales activos
                modals.forEach(m => {
                    m.classList.remove('active');
                    m.setAttribute('aria-hidden', 'true');
                });
                document.body.style.overflow = 'auto';
            }
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
            event.target.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto'; // Restablecer el scroll
        }
    });

    // Funcionalidad del botón "Guardar cambios" (ejemplo básico)
    // Este botón ahora solo existe dentro del modal de edición de perfil
    const editProfileForm = document.querySelector('#editProfileModal .modal-form');
    editProfileForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Aquí iría la lógica para guardar los cambios del perfil (por ejemplo, enviar a un servidor)
        // Actualizar los datos en la página principal con los nuevos valores del modal
        profileData.name = document.getElementById('newName').value;
        profileData.email = document.getElementById('newEmail').value;
        profileData.phone = document.getElementById('newPhone').value;
        profileData.address = document.getElementById('newAddress').value;
        profileData.bio = document.getElementById('newBio').value;

        document.querySelector('.profile-name').textContent = profileData.name;
        document.getElementById('email').value = profileData.email;
        document.getElementById('phone').value = profileData.phone;
        document.getElementById('address').value = profileData.address;

        showNotification(translations[currentLanguage].changesSaved, 'success');
        document.getElementById('editProfileModal').classList.remove('active');
        document.getElementById('editProfileModal').setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    });


    // Funcionalidad para cambiar la contraseña
    const changePasswordForm = document.querySelector('#changePasswordModal .modal-form');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrengthBar = document.querySelectorAll('#changePasswordModal .strength-bar');
    const passwordStrengthText = document.querySelector('#changePasswordModal .strength-text');

    newPasswordInput.addEventListener('input', () => {
        const password = newPasswordInput.value;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;

        for (let i = 0; i < passwordStrengthBar.length; i++) {
            passwordStrengthBar[i].style.backgroundColor = i < strength ? '#4caf50' : '#ddd';
        }

        let strengthKey = 'securityLow';
        if (strength >= 4) strengthKey = 'securityHigh';
        else if (strength >= 2) strengthKey = 'securityMedium';
        passwordStrengthText.textContent = translations[currentLanguage][strengthKey];
    });

    changePasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            showNotification(translations[currentLanguage].passwordsDoNotMatch, 'error');
            return;
        }
        showNotification(translations[currentLanguage].passwordUpdated, 'success');
        changePasswordForm.reset();
        document.getElementById('changePasswordModal').classList.remove('active');
        document.getElementById('changePasswordModal').setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    });

    // Funcionalidad para eliminar la cuenta
    const confirmDeleteInput = document.getElementById('confirmDelete');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');

    confirmDeleteInput.addEventListener('input', () => {
        confirmDeleteButton.disabled = confirmDeleteInput.value !== 'ELIMINAR';
    });

    confirmDeleteButton.addEventListener('click', () => {
        showNotification(translations[currentLanguage].accountDeleted, 'error'); // Usar 'error' para indicar una acción destructiva
        setTimeout(() => {
            window.location.href = 'Login/login.html'; // Redirigir a la página de login
        }, 1500); // Dar tiempo para que la notificación sea visible
    });

    // Funcionalidad para descargar datos
    const downloadDataForm = document.getElementById('downloadDataModal').querySelector('.modal-form');
    downloadDataForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const dataFormat = document.getElementById('dataFormat').value;
        const dataRange = document.getElementById('dataRange').value;
        showNotification(translations[currentLanguage].downloadingData.replace('{format}', dataFormat).replace('{range}', dataRange), 'info');
        setTimeout(() => {
            showNotification(translations[currentLanguage].downloadCompleted, 'success');
            document.getElementById('downloadDataModal').classList.remove('active');
            document.getElementById('downloadDataModal').setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }, 2000);
    });

    // Funcionalidad del interruptor de verificación en dos pasos
    const twoFactorAuthSwitch = document.getElementById('twoFactorAuth');
    twoFactorAuthSwitch.addEventListener('change', () => {
        if (twoFactorAuthSwitch.checked) {
            showNotification(translations[currentLanguage].twoFactorAuthEnabled, 'success');
        } else {
            showNotification(translations[currentLanguage].twoFactorAuthDisabled, 'info');
        }
    });

    // Funcionalidad del interruptor de notificaciones
    const notificationsEnabledSwitch = document.getElementById('notificationsEnabled');
    notificationsEnabledSwitch.addEventListener('change', () => {
        if (notificationsEnabledSwitch.checked) {
            showNotification(translations[currentLanguage].notificationsEnabled, 'success');
        } else {
            showNotification(translations[currentLanguage].notificationsDisabled, 'info');
        }
    });

    // Funcionalidad del selector de idioma
    const languageSelect = document.getElementById('language');
    languageSelect.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        localStorage.setItem('appLanguage', currentLanguage); // Guardar en localStorage
        applyTranslations();
        showNotification(`Idioma cambiado a ${event.target.options[event.target.selectedIndex].text}`, 'info');
    });

    // Botón de cerrar sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            showNotification("Cerrando sesión...", 'info');
            setTimeout(() => {
                window.location.href = '../index.html'; // Redirigir a la página de login
            }, 1000);
        });
    }

    // Función para mostrar notificaciones
    function showNotification(message, type) {
        const notificationContainer = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        // Eliminar la notificación después de un tiempo
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
});
