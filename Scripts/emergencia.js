// emergencia.js - Gestión de la página de emergencia

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el mapa
    initMap();

    // Cargar el sidebar
    loadSidebar();

    // Configurar eventos
    setupEventListeners();

    // Cargar datos de ejemplo
    loadEmergencyData();

    // Ocultar todos los modales al inicio
    hideAllModals();
});

/**
 * Carga el contenido del sidebar dinámicamente.
 */
function loadSidebar() {
    fetch('sidebar/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            // Marcar como activo el elemento del menú correspondiente
            const currentPage = window.location.pathname.split('/').pop() || 'Inicio.html';
            document.querySelectorAll('.sidebar-menu a').forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.parentElement.classList.add('active');
                }
            });
        })
        .catch(error => console.error('Error loading sidebar:', error));
}

/**
 * Inicializa el mapa de ubicación
 */
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error("Elemento 'map' no encontrado.");
        return;
    }

    // Intenta obtener la ubicación del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = [position.coords.latitude, position.coords.longitude];
                setupLeafletMap(mapElement, coords);
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error);
                const defaultCoords = [40.4168, -3.7038]; // Coordenadas de Madrid por defecto
                setupLeafletMap(mapElement, defaultCoords);
                showNotification('warning', '<i class="fas fa-exclamation-triangle"></i> No se pudo obtener la ubicación. Mostrando ubicación de ejemplo.');
            }
        );
    } else {
        console.error("Geolocalización no soportada por el navegador.");
        const defaultCoords = [40.4168, -3.7038]; // Coordenadas de Madrid por defecto
        setupLeafletMap(mapElement, defaultCoords);
        showNotification('error', '<i class="fas fa-times-circle"></i> Geolocalización no soportada.');
    }
}

/**
 * Configura el mapa de Leaflet con las coordenadas proporcionadas
 * @param {HTMLElement} mapElement El elemento div del mapa
 * @param {Array<number>} coords Array con latitud y longitud
 */
function setupLeafletMap(mapElement, coords) {
    const map = L.map(mapElement).setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker(coords).addTo(map)
        .bindPopup('Mi ubicación actual')
        .openPopup();

    mapElement._map = map;
    mapElement._marker = marker;
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Botón de activar emergencia
    const activateEmergencyBtn = document.getElementById('activate-emergency');
    if (activateEmergencyBtn) {
        activateEmergencyBtn.addEventListener('click', activateEmergencyModal);
    } else {
        console.warn("Botón 'activate-emergency' no encontrado.");
    }

    // Botón de cancelar emergencia (dentro del modal)
    const cancelEmergencyBtn = document.getElementById('cancel-emergency');
    if (cancelEmergencyBtn) {
        cancelEmergencyBtn.addEventListener('click', cancelEmergency);
    } else {
         console.warn("Botón 'cancel-emergency' no encontrado.");
    }

    // Botón de confirmar emergencia (dentro del modal)
    const confirmEmergencyBtn = document.getElementById('confirm-emergency');
    if (confirmEmergencyBtn) {
        confirmEmergencyBtn.addEventListener('click', confirmEmergency);
    } else {
        console.warn("Botón 'confirm-emergency' no encontrado.");
    }

    // Botón de enviar alerta
    const sendAlertBtn = document.getElementById('send-alert');
    if (sendAlertBtn) {
        sendAlertBtn.addEventListener('click', sendEmergencyAlert);
    } else {
        console.warn("Botón 'send-alert' no encontrado.");
    }

    // Botón de mostrar información médica
    const showMedicalInfoBtn = document.getElementById('show-medical-info');
    if (showMedicalInfoBtn) {
        showMedicalInfoBtn.addEventListener('click', showMedicalInfoModal);
    } else {
        console.warn("Botón 'show-medical-info' no encontrado.");
    }

    // Botón de cerrar modal de información médica
    const closeMedicalModalBtn = document.querySelector('#medical-info-modal .close-modal');
    if (closeMedicalModalBtn) {
        closeMedicalModalBtn.addEventListener('click', () => {
            hideModal('medical-info-modal');
            showNotification('info', '<i class="fas fa-eye-slash"></i> Información médica oculta.');
        });
    } else {
        console.warn("Botón de cierre del modal médico no encontrado.");
    }

    // Botón de primeros auxilios
    const showFirstAidBtn = document.getElementById('show-first-aid');
    if (showFirstAidBtn) {
        showFirstAidBtn.addEventListener('click', showFirstAidModal);
    } else {
        console.warn("Botón 'show-first-aid' no encontrado.");
    }

    // Botón de actualizar ubicación
    const refreshLocationBtn = document.getElementById('refresh-location');
    if (refreshLocationBtn) {
        refreshLocationBtn.addEventListener('click', refreshLocation);
    } else {
        console.warn("Botón 'refresh-location' no encontrado.");
    }

    // Botón de compartir ubicación
    const shareLocationBtn = document.getElementById('share-location');
    if (shareLocationBtn) {
        shareLocationBtn.addEventListener('click', showShareLocationModal);
    } else {
        console.warn("Botón 'share-location' no encontrado.");
    }

    // Botón de guardar mensaje
    const saveMessageBtn = document.getElementById('save-message');
    if (saveMessageBtn) {
        saveMessageBtn.addEventListener('click', saveEmergencyMessage);
        showNotification('success', '<i class="fas fa-save"></i> Mensaje de emergencia guardado.');
    } else {
        console.warn("Botón 'save-message' no encontrado.");
    }

    // Botón de editar contactos
    const editContactsBtn = document.getElementById('edit-contacts');
    if (editContactsBtn) {
        editContactsBtn.addEventListener('click', showEditContactsModal);
    } else {
        console.warn("Botón 'edit-contacts' no encontrado.");
    }

    // Botones de acción de contacto (llamar, mensaje, ubicación)
    document.querySelectorAll('.contact-actions .call-button').forEach(button => {
        button.addEventListener('click', () => {
            const contactName = button.closest('.contact-card').querySelector('.contact-details h3').textContent;
            showNotification('info', `<i class="fas fa-phone"></i> Llamando a ${contactName}...`);
            console.log(`Llamando a ${contactName}`);
            // Aquí iría la lógica real para llamar
        });
    });

    document.querySelectorAll('.contact-actions .message-button').forEach(button => {
        button.addEventListener('click', () => {
            const contactName = button.closest('.contact-card').querySelector('.contact-details h3').textContent;
            showNotification('info', `<i class="fas fa-sms"></i> Enviando mensaje a ${contactName}...`);
            console.log(`Enviando mensaje a ${contactName}`);
            // Aquí iría la lógica real para enviar un mensaje
        });
    });

    document.querySelectorAll('.contact-actions .location-button').forEach(button => {
        button.addEventListener('click', () => {
            const contactName = button.closest('.contact-card').querySelector('.contact-details h3').textContent;
            showNotification('info', `<i class="fas fa-map-marker-alt"></i> Compartiendo ubicación con ${contactName}...`);
            console.log(`Compartiendo ubicación con ${contactName}`);
            shareLocation(); // Reutilizamos la función de compartir ubicación
        });
    });

    // Botón de llamar al 112
    const call112Btn = document.querySelector('.call-emergency .primary-button');
    if (call112Btn) {
        call112Btn.addEventListener('click', call112);
    } else {
        console.warn("Botón 'Llamar al 112' no encontrado.");
    }

    // Variables del mensaje de emergencia
    const variableTags = document.querySelectorAll('.variable-tag');
    variableTags.forEach(tag => {
        tag.addEventListener('click', function() {
            insertVariable(this.dataset.variable);
        });
    });

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(event) {
        const emergencyModal = document.getElementById('emergency-modal');
        const medicalInfoModal = document.getElementById('medical-info-modal');
        // No hay modales específicos para primeros auxilios, compartir ubicación o editar contactos en el HTML proporcionado.

        if (event.target === emergencyModal) {
            hideModal('emergency-modal');
            showNotification('info', '<i class="fas fa-times"></i> Activación de emergencia cancelada.');
        }
        if (event.target === medicalInfoModal) {
            hideModal('medical-info-modal');
            showNotification('info', '<i class="fas fa-eye-slash"></i> Información médica oculta.');
        }
        // No necesitamos manejar clics fuera para modales que no existen en el HTML.
    });
}

/**
 * Muestra el modal de activación de emergencia
 */
function activateEmergencyModal() {
    const modal = document.getElementById('emergency-modal');
    if (modal) {
        modal.style.display = 'flex';
        startEmergencyCountdown();
    } else {
        console.warn("Modal de emergencia no encontrado.");
    }
}

/**
 * Inicia la cuenta regresiva de emergencia
 */
function startEmergencyCountdown() {
    const modal = document.getElementById('emergency-modal');
    if (!modal) return;

    let seconds = 5;
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.textContent = seconds;
    } else {
        console.warn("Elemento 'countdown' no encontrado.");
    }

    modal._countdown = setInterval(() => {
        seconds--;
        if (countdownElement) {
            countdownElement.textContent = seconds;
        }

        if (seconds <= 0) {
            clearInterval(modal._countdown);
            confirmEmergency();
        }
    }, 1000);
}

/**
 * Cancela la activación de emergencia
 */
function cancelEmergency() {
    const modal = document.getElementById('emergency-modal');
    if (modal && modal._countdown) {
        clearInterval(modal._countdown);
    }
    if (modal) {
        modal.style.display = 'none';
        showNotification('info', '<i class="fas fa-times"></i> Activación de emergencia cancelada.');
    } else {
        console.warn("Modal de emergencia no encontrado.");
    }
}

/**
 * Confirma la activación de emergencia
 */
function confirmEmergency() {
    const modal = document.getElementById('emergency-modal');
    if (modal && modal._countdown) {
        clearInterval(modal._countdown);
    }
    if (modal) {
        modal.style.display = 'none';
    }  else {
        console.warn("Modal de emergencia no encontrado.");
    }

    showNotification('emergency', '<i class="fas fa-bell"></i> ¡Emergencia activada! Se ha alertado a tus contactos y servicios de emergencia.');
    console.log('Modo emergencia activado - Notificando contactos...');

    const emergencyBtn = document.getElementById('activate-emergency');
    if (emergencyBtn) {
        emergencyBtn.disabled = true;
        emergencyBtn.innerHTML = '<i class="fas fa-check"></i> Emergencia activada';
        setTimeout(() => {
            emergencyBtn.disabled = false;
            emergencyBtn.innerHTML = '<i class="fas fa-bell"></i> Activar Emergencia';
        }, 30000);
    } else {
        console.warn("Botón 'activate-emergency' no encontrado.");
    }
}

/**
 * Envía una alerta de emergencia a los contactos
 */
function sendEmergencyAlert() {
    const messageTextElement = document.getElementById('emergency-message-text');
    if (!messageTextElement) {
        console.error("Elemento 'emergency-message-text' no encontrado.");
        return;
    }
    const messageText = messageTextElement.value;

    const locationElement = document.querySelector('.location-details p:nth-child(2)');
    const medicalInfoElement = document.querySelector('#medical-info-modal .medical-info-content');
    const primaryContactNameElement = document.querySelector('.contacts-grid .primary-contact .contact-details h3');
    const primaryContactPhoneElement = document.querySelector('.contacts-grid .primary-contact .contact-details .phone');

    const finalMessage = messageText
        .replace('[ubicación]', locationElement?.textContent || 'Ubicación no disponible')
        .replace('[datos médicos]', medicalInfoElement?.textContent?.replace(/\n/g, ', ') || 'Datos médicos no disponibles')
        .replace('[contacto]', (primaryContactNameElement?.textContent || '') + ' (' + (primaryContactPhoneElement?.textContent || 'Contacto no disponible') + ')');

    showNotification('success', '<i class="fas fa-paper-plane"></i> Alerta enviada a tus contactos de emergencia');
    console.log('Enviando alerta a contactos:', finalMessage);
}

/**
 * Muestra el modal de información médica
 */
function showMedicalInfoModal() {
    const medicalInfoModal = document.getElementById('medical-info-modal');
    if (medicalInfoModal) {
        medicalInfoModal.style.display = 'flex';
    } else {
        console.warn("Modal de información médica no encontrado.");
    }
}

/**
 * Muestra el modal de primeros auxilios (simulado)
 */
function showFirstAidModal() {
    // No hay un modal específico para primeros auxilios en el HTML,
    // así que mostramos una notificación directamente.
    showNotification('info', '<i class="fas fa-book-medical"></i> Abriendo guía de primeros auxilios...');
    console.log('Mostrando guía de primeros auxilios (sin modal implementado)');
    // Aquí podrías redirigir a una página o mostrar contenido directamente en la página.
}

/**
 * Actualiza la ubicación
 */
function refreshLocation() {
    const btn = document.getElementById('refresh-location');
    if (!btn) {
        console.error("Botón 'refresh-location' no encontrado.");
        return;
    }
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Localizando...';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newCoords = [position.coords.latitude, position.coords.longitude];
                updateMapAndLocation(newCoords);
                showNotification('success', '<i class="fas fa-map-marker-alt"></i> Ubicación actualizada correctamente');
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error);
                showNotification('error', '<i class="fas fa-exclamation-triangle"></i> No se pudo actualizar la ubicación.');
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        console.error("Geolocalización no soportada por el navegador.");
        showNotification('error', '<i class="fas fa-times-circle"></i> Geolocalización no soportada.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
    }
}

/**
 * Actualiza el mapa y la información de ubicación en la interfaz
 * @param {Array<number>} coords Array con la nueva latitud y longitud
 */
function updateMapAndLocation(coords) {
    const mapElement = document.getElementById('map');
    if (mapElement && mapElement._map && mapElement._marker) {
        mapElement._map.setView(coords, 13);
        mapElement._marker.setLatLng(coords)
            .setPopupContent('Mi ubicación actual: ' + new Date().toLocaleTimeString())
            .openPopup();

        const locationDetails = document.querySelector('.location-details p:nth-child(2)');
        const timestampElement = document.querySelector('.timestamp');
        if (locationDetails) {
            locationDetails.textContent = `Lat: ${coords[0].toFixed(5)}, Lon: ${coords[1].toFixed(5)}`;
        } else {
             console.warn("Elemento '.location-details p:nth-child(2)' no encontrado.");
        }
        if (timestampElement) {
            timestampElement.innerHTML = '<i class="fas fa-clock"></i> Actualizado ahora';
        } else {
             console.warn("Elemento '.timestamp' no encontrado.");
        }
    } else {
        console.warn("Mapa no inicializado correctamente o elemento 'map' no encontrado.");
    }
}

/**
 * Muestra el modal para compartir ubicación (simulado)
 */
function showShareLocationModal() {
    // No hay un modal específico para compartir ubicación en el HTML,
    // así que llamamos a la función de compartir directamente.
    shareLocation();
}

/**
 * Comparte la ubicación actual
 */
function shareLocation() {
    if (navigator.share) {
        navigator.share({
            title: 'Mi ubicación de emergencia',
            text: 'Esta es mi ubicación actual en caso de emergencia:',
            url: window.location.href
        }).then(() => {
            showNotification('success', '<i class="fas fa-share-alt"></i> Ubicación compartida exitosamente');
        }).catch((error) => {
            console.error('Error al compartir:', error);
            showNotification('warning', '<i class="fas fa-exclamation-triangle"></i> No se pudo compartir la ubicación');
        });
    } else {
        showNotification('info', '<i class="fas fa-share-alt"></i> La función de compartir no está disponible en este navegador.');
        console.log('Compartiendo ubicación actual (simulado - Web Share API no soportada)');
    }
}

/**
 * Guarda el mensaje de emergencia personalizado (simulado)
 */
function saveEmergencyMessage() {
    const messageInputElement = document.getElementById('emergency-message-text');
    if (!messageInputElement) {
        console.error("Elemento 'emergency-message-text' no encontrado.");
        return;
    }
    const message = messageInputElement.value;

    localStorage.setItem('emergencyMessage', message);
    // La notificación de guardado se muestra directamente en el event listener.
    console.log('Mensaje de emergencia guardado:', message);
}

/**
 * Muestra el modal para editar contactos (simulado)
 */
function showEditContactsModal() {
    // No hay un modal específico para editar contactos en el HTML,
    // así que mostramos una notificación indicando la acción.
    showNotification('info', '<i class="fas fa-edit"></i> Redirigiendo a la página de edición de contactos...');
    console.log('Editando contactos de emergencia (sin modal implementado)');
    // Aquí podrías redirigir a una página real de edición de contactos.
}

/**
 * Inserta una variable en el mensaje de emergencia
 * @param {string} variable La variable a insertar (ubicación, datos médicos, contacto)
 */
function insertVariable(variable) {
    const textarea = document.getElementById('emergency-message-text');
    if (!textarea) {
         console.error("Elemento 'emergency-message-text' no encontrado.");
        return;
    }
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = textarea.value;

    textarea.value = text.substring(0, startPos) + `[${variable}]` + text.substring(endPos);
    textarea.focus();
    textarea.selectionStart = startPos + variable.length + 2;
    textarea.selectionEnd = startPos + variable.length + 2;
}

/**
 * Carga datos de emergencia (simulado)
 */
function loadEmergencyData() {
    const savedMessage = localStorage.getItem('emergencyMessage');
    const messageInput = document.getElementById('emergency-message-text');
    if (messageInput && savedMessage) {
        messageInput.value = savedMessage;
    }
    setTimeout(() => {
        console.log('Datos de emergencia cargados (simulado)');
    }, 500);
}

/**
 * Muestra una notificación en la parte superior derecha
 * @param {string} type Tipo de notificación (success, error, warning, info, emergency)
 * @param {string} message El mensaje a mostrar
 */
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if(notification.parentNode) {
                  document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }, 10);
}

/**
 * Oculta un modal específico
 * @param {string} modalId El ID del modal a ocultar
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.warn(`Modal con ID '${modalId}' no encontrado.`);
    }
}

/**
 * Oculta todos los modales con la clase 'modal'
 */
function hideAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

/**
 * Simula la llamada al 112
 */
function call112() {
    showNotification('emergency', '<i class="fas fa-phone-alt"></i> Llamando al 112...');
    console.log('Llamando al 112 (simulado)');
    // Aquí iría la lógica real para iniciar una llamada al 112
    window.location.href = 'tel:112'; // Intento de llamada real (puede depender del dispositivo)
}

// Inyectar estilos para las notificaciones (reutilizando tus estilos)
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(120%);
    transition: transform 0.3s ease;
    z-index: 1000;
    max-width: 300px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    background-color: var(--color-success);
    border-left: 4px solid #689f38; /* Un tono más oscuro para el borde */
}

.notification.error {
    background-color: var(--color-danger);
    border-left: 4px solid #c62828; /* Un tono más oscuro para el borde */
}

.notification.warning {
    background-color: var(--color-warning);
    border-left: 4px solid #f9a825; /* Un tono más oscuro para el borde */
}

.notification.info {
    background-color: var(--color-info);
    border-left: 4px solid #1e88e5; /* Un tono más oscuro para el borde */
}

.notification.emergency {
    background-color: var(--color-emergency);
    border-left: 4px solid #d32f2f;
    animation: pulse 1.5s infinite;
}

.notification i {
    font-size: 1.2rem;
}
`;
document.head.appendChild(notificationStyles);