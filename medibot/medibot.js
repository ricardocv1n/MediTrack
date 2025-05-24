document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Elementos del DOM ---
    const medibotContainer = document.getElementById('medibotContainer');
    const medibotToggle = document.getElementById('medibotToggle');
    const medibotHeader = document.getElementById('medibotHeader');
    const medibotMessages = document.getElementById('medibotMessages');
    const medibotInput = document.getElementById('medibotInput'); // Corregido: document.getElementById
    const medibotSendButton = document.getElementById('medibotSend');
    const medibotQuickActions = document.getElementById('medibotQuickActions');
    const medibotMinimize = document.getElementById('medibotMinimize');
    const medibotClose = document.getElementById('medibotClose');
    const notificationBadge = document.getElementById('notificationBadge');
    const medibotVoiceInput = document.getElementById('medibotVoiceInput');

    // --- 2. Datos del usuario (simulados) y respuestas predefinidas ---
    const userData = {
        name: "Usuario",
        caregiverMode: false,
        emergencyContacts: ["+1234567890 (Juan Pérez)", "+9876543210 (María García)"],
        medications: [
            { id: 'med1', name: "Paracetamol", dose: "500mg", time: "14:00", lastTaken: "13:55" },
            { id: 'med2', name: "Ibuprofeno", dose: "400mg", time: "08:00 y 20:00", lastTaken: "08:00" },
            { id: 'med3', name: "Vitamina C", dose: "1000mg", time: "09:00", lastTaken: "09:00" }
        ],
        appointments: [
            { id: 'appt1', doctor: "Dr. García", specialty: "Cardiólogo", date: "22 de Mayo", time: "10:00 AM", location: "Hospital Central, Consultorio 402", notes: "Llevar estudios previos." },
            { id: 'appt2', doctor: "Dra. López", specialty: "Dermatóloga", date: "15 de Junio", time: "16:30", location: "Clínica Piel Sana, Piso 3", notes: "Revisión anual de lunares." }
        ],
        healthTips: [
            {
                category: "Bienestar General",
                text: "¡Excelente trabajo cuidando de tu salud hoy! Recuerda que cada pequeño paso cuenta. 💖",
                image: "https://placehold.co/400x200/4a89dc/ffffff?text=Bienestar",
                tip: "¿Sabías que caminar 30 minutos al día puede reducir significativamente el riesgo de enfermedades cardíacas?",
                article: "https://www.who.int/es/news-room/fact-sheets/detail/physical-activity"
            },
            {
                category: "Hidratación",
                text: "La hidratación es clave para tu bienestar. ¿Has bebido suficiente agua hoy? 💧",
                image: "https://placehold.co/400x200/3bafda/ffffff?text=Hidratacion",
                tip: "Intenta beber al menos 8 vasos de agua al día para mantener tu cuerpo hidratado y funcionando óptimamente.",
                article: "https://www.mayoclinic.org/es/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256"
            },
            {
                category: "Nutrición",
                text: "Una dieta rica en frutas y verduras fortalece tu sistema inmune. ¡Colores en tu plato, salud en tu cuerpo! 🍎🥦",
                image: "https://placehold.co/400x200/2ecc71/ffffff?text=Nutricion",
                tip: "Consume al menos 5 porciones de frutas y verduras al día para obtener los nutrientes necesarios.",
                article: "https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet"
            },
            {
                category: "Sueño",
                text: "El sueño reparador es tan importante como la alimentación y el ejercicio. Prioriza tus horas de descanso. 😴",
                image: "https://placehold.co/400x200/f39c12/ffffff?text=Descanso",
                tip: "Intenta mantener un horario de sueño regular, incluso los fines de semana, para mejorar la calidad de tu descanso.",
                article: "https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html"
            },
            {
                category: "Actividad Física",
                text: "¡Activa tu cuerpo! La actividad física regular mejora tu estado de ánimo y energía. 🏃‍♀️",
                image: "https://placehold.co/400x200/8e44ad/ffffff?text=Actividad+Fisica",
                tip: "No necesitas un gimnasio. Bailar, subir escaleras o un paseo enérgico son excelentes opciones.",
                article: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/aha-recs-for-physical-activity-in-adults"
            },
            {
                category: "Salud Cardiovascular",
                text: "Cuida tu corazón, es el motor de tu vida. ❤️",
                image: "https://placehold.co/400x200/e74c3c/ffffff?text=Corazon",
                tip: "Una dieta equilibrada, ejercicio y evitar el tabaco son tus mejores aliados para un corazón sano.",
                article: "https://www.who.int/es/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)"
            }
        ],
        curiosities: [
            "¿Sabías que el hueso más pequeño del cuerpo humano está en el oído? Se llama estribo.",
            "¿Sabías que el corazón humano late alrededor de 100,000 veces al día?",
            "¿Sabías que la piel es el órgano más grande del cuerpo, cubriendo un área de unos 2 metros cuadrados en un adulto promedio?",
            "¿Sabías que tus ojos parpadean unas 15-20 veces por minuto? ¡Eso son más de 20,000 veces al día!",
            "¿Sabías que el cerebro humano pesa aproximadamente 1.4 kg, pero consume alrededor del 20% del oxígeno y calorías de tu cuerpo?"
        ],
        voicePreference: {
            lang: 'es-ES',
            voiceIndex: 0,
            rate: 1
        },
        symptomsHistory: [],
        caregivers: [ // Simulación de pacientes a cargo del cuidador
            { id: 'patient1', name: 'Carlos Ruíz', medications: [{ name: 'Amlodipino', time: '09:00' }], lastCheckIn: '2024-05-20' },
            { id: 'patient2', name: 'Ana Mendoza', medications: [{ name: 'Insulina', time: '08:00, 20:00' }], lastCheckIn: '2024-05-21' }
        ]
    };

    // --- 3. Estado del chatbot y variables de voz ---
    let isOpen = false;
    let isMinimized = false;
    let unreadMessages = 0;
    let currentUtterance = null;
    let currentConversationState = 'initial'; // Controla el flujo de la conversación
    let conversationData = {}; // Almacena datos temporales para flujos guiados (ej. síntoma actual, cita a cancelar)

    // Configuración de SpeechRecognition y SpeechSynthesis
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;
    let recognition = null;
    let voices = [];

    SpeechSynthesis.onvoiceschanged = () => {
        voices = SpeechSynthesis.getVoices();
        const defaultVoice = voices.find(voice => voice.lang === 'es-ES' && voice.name.includes('Google español'));
        if (defaultVoice) {
            userData.voicePreference.voiceIndex = voices.indexOf(defaultVoice);
        } else if (voices.length > 0) {
            const esVoice = voices.find(voice => voice.lang.startsWith('es'));
            if (esVoice) {
                userData.voicePreference.voiceIndex = voices.indexOf(esVoice);
            } else {
                userData.voicePreference.voiceIndex = 0;
            }
        }
        console.log("Voces cargadas:", voices);
        console.log("Voz predeterminada seleccionada:", voices[userData.voicePreference.voiceIndex]?.name || "Ninguna");
    };


    // --- 4. Funciones de la interfaz ---

    function toggleMedibot() {
        isOpen = !isOpen;
        medibotContainer.classList.toggle('active', isOpen);
        medibotToggle.setAttribute('aria-expanded', isOpen);
        medibotToggle.style.display = isOpen ? 'none' : 'flex';

        if (isOpen) {
            if (isMinimized) {
                toggleMinimize();
            }
            medibotInput.focus();
            resetUnreadMessages();
            medibotToggle.classList.remove('pulse');
            if (medibotMessages.children.length === 0 || currentConversationState === 'initial_welcome_shown') {
                showWelcomeMessage();
                currentConversationState = 'initial_welcome_shown';
            } else {
                medibotMessages.scrollTop = medibotMessages.scrollHeight;
            }
            checkProactiveMessages();
        } else {
            stopSpeaking();
            currentConversationState = 'initial';
            medibotToggle.style.display = 'flex';
        }
    }

    function toggleMinimize() {
        isMinimized = !isMinimized;
        medibotContainer.classList.toggle('minimized', isMinimized);
        medibotMinimize.innerHTML = isMinimized ? '<i class="fas fa-expand"></i>' : '<i class="fas fa-minus"></i>';

        if (!isMinimized) {
            medibotMessages.scrollTop = medibotMessages.scrollHeight;
            medibotInput.focus();
        }
    }

    function addMessage(htmlContent, senderClass) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', senderClass, 'fade-in');
        messageDiv.innerHTML = htmlContent;
        medibotMessages.appendChild(messageDiv);
        medibotMessages.scrollTop = medibotMessages.scrollHeight;

        if (senderClass === 'bot-message' && !isOpen) {
            incrementUnreadMessages();
        }
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator', 'bot-message');
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `<span></span><span></span><span></span>`;
        medibotMessages.appendChild(typingDiv);
        medibotMessages.scrollTop = medibotMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function speak(text) {
        stopSpeaking();
        if (!SpeechSynthesis) {
            console.warn("SpeechSynthesis no está soportado en este navegador.");
            return;
        }

        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = userData.voicePreference.lang;
        currentUtterance.rate = userData.voicePreference.rate;

        if (voices.length > userData.voicePreference.voiceIndex) {
            currentUtterance.voice = voices[userData.voicePreference.voiceIndex];
        } else {
            const esVoice = voices.find(voice => voice.lang.startsWith('es'));
            if (esVoice) {
                currentUtterance.voice = esVoice;
            } else if (voices.length > 0) {
                currentUtterance.voice = voices[0];
            }
        }
        SpeechSynthesis.speak(currentUtterance);
    }

    function stopSpeaking() {
        if (SpeechSynthesis.speaking) {
            SpeechSynthesis.cancel();
        }
        currentUtterance = null;
    }

    function addBotMessage(htmlContent, speakText = null, addFeedback = false) {
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addMessage(htmlContent, 'bot-message');
            const textToSpeak = speakText || messageToPlainText(htmlContent);
            speak(textToSpeak);

            if (addFeedback) {
                setTimeout(() => {
                    addFeedbackButtons();
                }, 1000);
            }
        }, 800);
    }

    function messageToPlainText(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        div.querySelectorAll('button, img, ul, ol, hr, strong, em, i, span').forEach(el => {
            if (el.tagName === 'STRONG' || el.tagName === 'EM' || el.tagName === 'I' || el.tagName === 'SPAN') {
                el.outerHTML = el.textContent;
            } else {
                el.remove();
            }
        });
        let text = div.textContent || div.innerText || "";
        text = text.replace(/\s+/g, ' ').trim();
        return text;
    }

    function addUserMessage(text) {
        stopSpeaking();
        addMessage(text, 'user-message');
        medibotInput.value = '';
        setTimeout(() => processUserMessage(text), 500);
    }

    function createQuickActionButton(text, actionHandler, className = 'quick-action-btn') {
        const button = document.createElement('button');
        button.className = className;
        button.innerHTML = text;
        button.addEventListener('click', () => {
            actionHandler();
            stopSpeaking();
        });
        return button;
    }

    function navigateToPage(pageUrl) {
        window.location.href = pageUrl;
    }

    // --- 5. Lógica de Respuestas y Acciones ---

    function showWelcomeMessage() {
        const welcomeMessageHTML = `
            <div class="medibot-card">
                <h4><i class="fas fa-robot"></i> ¡Hola ${userData.name}!</h4>
                <p>Soy MediBot, tu asistente de salud personal. Estoy aquí para ayudarte con:</p>
                <ul>
                    <li>Gestión de citas médicas</li>
                    <li>Recordatorios de medicación</li>
                    <li>Consejos de salud personalizados</li>
                    <li>Soporte en emergencias</li>
                </ul>
                <p>¿En qué puedo ayudarte hoy? Puedes elegir una opción rápida o escribirme tu pregunta.</p>
            </div>
        `;
        const speakText = `¡Hola ${userData.name}! Soy Medibot, tu asistente de salud personal. Estoy aquí para ayudarte con gestión de citas médicas, recordatorios de medicación, consejos de salud personalizados y soporte en emergencias. ¿En qué puedo ayudarte hoy? Puedes elegir una opción rápida o escribirme tu pregunta.`;
        addBotMessage(welcomeMessageHTML, speakText);
        setupQuickActions();
    }

    function setupQuickActions() {
        medibotQuickActions.innerHTML = '';

        const actions = [
            { text: '<i class="fas fa-clipboard-list"></i> Mi Resumen de Hoy', action: showDailySummary },
            { text: '<i class="fas fa-calendar-alt"></i> Mis Citas', action: showAppointments },
            { text: '<i class="fas fa-pills"></i> Mi Medicación', action: showMedications },
            { text: '<i class="fas fa-plus-circle"></i> Registrar Síntoma', action: startSymptomLogging },
            { text: '<i class="fas fa-lightbulb"></i> Consejos de Salud', action: showHealthTips }
            // Eliminado: { text: '<i class="fas fa-exclamation-triangle"></i> Emergencia', action: showEmergencyInfo, class: 'emergency-btn' }
        ];

        actions.forEach(action => {
            const button = createQuickActionButton(action.text, action.action, action.class);
            medibotQuickActions.appendChild(button);
        });
        medibotQuickActions.scrollTop = medibotQuickActions.scrollHeight;
    }

    function showAppointments() {
        let messageHTML = `
            <div class="medibot-card">
                <h4><i class="fas fa-calendar-alt"></i> Tus Próximas Citas</h4>
        `;
        let speakText = "Aquí están tus próximas citas: ";

        if (userData.appointments.length > 0) {
            userData.appointments.forEach(appt => {
                messageHTML += `
                    <p><strong>${appt.doctor}</strong> (${appt.specialty})</p>
                    <p>${appt.date} a las ${appt.time}</p>
                    <hr>
                `;
                speakText += `${appt.doctor} de ${appt.specialty} el ${appt.date} a las ${appt.time}. `;
            });
        } else {
            messageHTML += `<p>No tienes citas programadas actualmente.</p>`;
            speakText += "No tienes citas programadas actualmente.";
        }

        messageHTML += `
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="quick-action-btn" onclick="startAppointmentManagement('schedule')">
                        <i class="fas fa-plus"></i> Programar Nueva Cita
                    </button>
                    <button class="quick-action-btn" onclick="startAppointmentManagement('cancel')">
                        <i class="fas fa-times-circle"></i> Cancelar Cita
                    </button>
                    <button class="quick-action-btn" onclick="navigateToPage('Citas.html')">
                        <i class="fas fa-external-link-alt"></i> Ir a Citas
                    </button>
                </div>
            </div>
        `;
        speakText += " ¿Necesitas programar una nueva cita, cancelar alguna, o ir a la sección de citas?";
        addBotMessage(messageHTML, speakText, true);
    }

    function startAppointmentManagement(actionType) {
        if (actionType === 'schedule') {
            currentConversationState = 'schedule_appointment_specialty';
            addBotMessage("Claro, para programar una cita, ¿qué especialidad médica necesitas? Por ejemplo: 'Dermatología', 'Cardiología'.", "Claro, para programar una cita, ¿qué especialidad médica necesitas? Por ejemplo: Dermatología, Cardiología.");
        } else if (actionType === 'cancel') {
            if (userData.appointments.length === 0) {
                addBotMessage("No tienes citas programadas para cancelar en este momento.", "No tienes citas programadas para cancelar en este momento.");
                currentConversationState = 'initial';
                return;
            }
            currentConversationState = 'cancel_appointment_select';
            let apptList = userData.appointments.map((appt, index) => `${index + 1}. ${appt.doctor} (${appt.specialty}) el ${appt.date}`).join('<br>');
            addBotMessage(`Para cancelar una cita, por favor, dime el número de la cita que quieres cancelar de la siguiente lista:<br>${apptList}`, `Para cancelar una cita, por favor, dime el número de la cita que quieres cancelar.`);
        } else if (actionType === 'view_details') {
            if (userData.appointments.length === 0) {
                addBotMessage("No tienes citas para ver detalles en este momento.", "No tienes citas para ver detalles en este momento.");
                currentConversationState = 'initial';
                return;
            }
            currentConversationState = 'view_appointment_details_select';
            let apptList = userData.appointments.map((appt, index) => `${index + 1}. ${appt.doctor} (${appt.specialty}) el ${appt.date}`).join('<br>');
            addBotMessage(`¿De qué cita te gustaría ver los detalles? Por favor, dime el número de la lista:<br>${apptList}`, `¿De qué cita te gustaría ver los detalles? Por favor, dime el número de la lista.`);
        }
    }

    function continueAppointmentManagement(message) {
        const lowerCaseMessage = message.toLowerCase();

        if (currentConversationState === 'schedule_appointment_specialty') {
            conversationData.specialty = message;
            currentConversationState = 'schedule_appointment_date';
            addBotMessage(`Entendido, para ${message}. ¿Qué día y hora te gustaría? Por ejemplo: 'el próximo martes por la mañana' o 'el 15 de junio a las 4 PM'.`, `Entendido, para ${message}. ¿Qué día y hora te gustaría? Por ejemplo: el próximo martes por la mañana o el 15 de junio a las 4 P M.`);
        } else if (currentConversationState === 'schedule_appointment_date') {
            conversationData.dateTime = message;
            const newApptId = 'appt' + (userData.appointments.length + 1);
            userData.appointments.push({
                id: newApptId,
                doctor: 'Pendiente', // Podría ser un LLM quien asigne un doctor o pedirlo al usuario
                specialty: conversationData.specialty,
                date: conversationData.dateTime.split(' a las ')[0] || conversationData.dateTime,
                time: conversationData.dateTime.split(' a las ')[1] || 'No especificado',
                location: 'Por definir',
                notes: 'Cita programada por MediBot.'
            });
            addBotMessage(`Perfecto, he registrado tu solicitud para una cita de <strong>${conversationData.specialty}</strong> el <strong>${conversationData.dateTime}</strong>. Te redirigiré a la sección de Citas para que puedas confirmar y ver los detalles.`, `Perfecto, he registrado tu solicitud para una cita de ${conversationData.specialty} el ${conversationData.dateTime}. Te redirigiré a la sección de Citas para que puedas confirmar y ver los detalles.`);
            navigateToPage('Citas.html');
            currentConversationState = 'initial';
            conversationData = {};
        } else if (currentConversationState === 'cancel_appointment_select') {
            const apptIndex = parseInt(message) - 1;
            if (!isNaN(apptIndex) && apptIndex >= 0 && apptIndex < userData.appointments.length) {
                const apptToCancel = userData.appointments[apptIndex];
                conversationData.apptToCancel = apptToCancel;
                currentConversationState = 'cancel_appointment_confirm';
                addBotMessage(`¿Estás seguro de que quieres cancelar la cita con el <strong>${apptToCancel.doctor}</strong> (${apptToCancel.specialty}) el <strong>${apptToCancel.date}</strong> a las <strong>${apptToCancel.time}</strong>?`, `¿Estás seguro de que quieres cancelar la cita con el ${apptToCancel.doctor} el ${apptToCancel.date} a las ${apptToCancel.time}?`);
                medibotQuickActions.innerHTML = '';
                medibotQuickActions.appendChild(createQuickActionButton('<i class="fas fa-check"></i> Sí, cancelar', () => confirmCancelAppointment(true)));
                medibotQuickActions.appendChild(createQuickActionButton('<i class="fas fa-times"></i> No, mantener', () => confirmCancelAppointment(false)));
            } else {
                addBotMessage("Lo siento, ese no es un número de cita válido. Por favor, intenta de nuevo.", "Lo siento, ese no es un número de cita válido. Por favor, intenta de nuevo.");
            }
        } else if (currentConversationState === 'view_appointment_details_select') {
            const apptIndex = parseInt(message) - 1;
            if (!isNaN(apptIndex) && apptIndex >= 0 && apptIndex < userData.appointments.length) {
                const appt = userData.appointments[apptIndex];
                let detailsHTML = `
                    <div class="medibot-card">
                        <h4><i class="fas fa-info-circle"></i> Detalles de la Cita</h4>
                        <p><strong>Doctor:</strong> ${appt.doctor}</p>
                        <p><strong>Especialidad:</strong> ${appt.specialty}</p>
                        <p><strong>Fecha:</strong> ${appt.date}</p>
                        <p><strong>Hora:</strong> ${appt.time}</p>
                        <p><strong>Ubicación:</strong> ${appt.location}</p>
                        <p><strong>Notas:</strong> ${appt.notes}</p>
                    </div>
                `;
                let detailsSpeakText = `Detalles de la cita: Doctor ${appt.doctor}, Especialidad ${appt.specialty}, Fecha ${appt.date}, Hora ${appt.time}, Ubicación ${appt.location}. Notas: ${appt.notes}.`;
                addBotMessage(detailsHTML, detailsSpeakText, true);
                currentConversationState = 'initial';
                setupQuickActions();
            } else {
                addBotMessage("Lo siento, ese no es un número de cita válido. Por favor, intenta de nuevo.", "Lo siento, ese no es un número de cita válido. Por favor, intenta de nuevo.");
            }
        }
    }

    function confirmCancelAppointment(confirm) {
        if (confirm && conversationData.apptToCancel) {
            const cancelledAppt = conversationData.apptToCancel;
            userData.appointments = userData.appointments.filter(appt => appt.id !== cancelledAppt.id);
            addBotMessage(`La cita con el <strong>${cancelledAppt.doctor}</strong> el <strong>${cancelledAppt.date}</strong> ha sido cancelada.`, `La cita con el ${cancelledAppt.doctor} el ${cancelledAppt.date} ha sido cancelada.`);
            navigateToPage('Citas.html'); // Redirigir para reflejar el cambio
        } else {
            addBotMessage("La cancelación de la cita ha sido anulada.", "La cancelación de la cita ha sido anulada.");
        }
        currentConversationState = 'initial';
        conversationData = {};
        setupQuickActions();
    }

    function showMedications() {
        let messageHTML = `
            <div class="medibot-card">
                <h4><i class="fas fa-pills"></i> Tu Medicación Actual</h4>
        `;
        let speakText = "Aquí está tu medicación actual: ";

        if (userData.medications.length > 0) {
            userData.medications.forEach(med => {
                messageHTML += `
                    <p><strong>${med.name}</strong> (${med.dose})</p>
                    <p>Horario: ${med.time}</p>
                    <p>Última toma: ${med.lastTaken || 'No registrada'}</p>
                    <hr>
                `;
                speakText += `${med.name}, dosis ${med.dose}, horario ${med.time}. Última toma: ${med.lastTaken || 'No registrada'}. `;
            });
        } else {
            messageHTML += `<p>No tienes medicamentos registrados actualmente.</p>`;
            speakText += "No tienes medicamentos registrados actualmente.";
        }

        messageHTML += `
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="quick-action-btn" onclick="startMedicationManagement('add')">
                        <i class="fas fa-plus"></i> Añadir Medicamento
                    </button>
                    <button class="quick-action-btn" onclick="startMedicationManagement('taken')">
                        <i class="fas fa-check"></i> Marcar Dosis Tomada
                    </button>
                    <button class="quick-action-btn" onclick="startMedicationManagement('upcoming')">
                        <i class="fas fa-clock"></i> Próximas Dosis
                    </button>
                    <button class="quick-action-btn" onclick="navigateToPage('Registrar-medicacion.html')">
                        <i class="fas fa-external-link-alt"></i> Ir a Medicación
                    </button>
                </div>
            </div>
        `;
        speakText += " ¿Quieres añadir un nuevo medicamento, marcar una dosis como tomada, ver tus próximas dosis o ir a la sección de medicación?";
        addBotMessage(messageHTML, speakText, true);
    }

    function startMedicationManagement(actionType) {
        if (actionType === 'add') {
            currentConversationState = 'add_medication_name';
            addBotMessage("Para añadir un medicamento, ¿cuál es su nombre? Por ejemplo: 'Aspirina', 'Amoxicilina'.", "Para añadir un medicamento, ¿cuál es su nombre? Por ejemplo: Aspirina, Amoxicilina.");
        } else if (actionType === 'taken') {
            if (userData.medications.length === 0) {
                addBotMessage("No tienes medicamentos registrados para marcar como tomados.", "No tienes medicamentos registrados para marcar como tomados.");
                currentConversationState = 'initial';
                return;
            }
            currentConversationState = 'mark_medication_taken_select';
            let medList = userData.medications.map((med, index) => `${index + 1}. ${med.name} (${med.time})`).join('<br>');
            addBotMessage(`¿Qué medicamento has tomado? Por favor, dime el número de la lista:<br>${medList}`, `¿Qué medicamento has tomado? Por favor, dime el número de la lista.`);
        } else if (actionType === 'upcoming') {
            showUpcomingDoses();
        }
    }

    function continueMedicationManagement(message) {
        const lowerCaseMessage = message.toLowerCase();

        if (currentConversationState === 'add_medication_name') {
            conversationData.newMed = { name: message };
            currentConversationState = 'add_medication_dose';
            addBotMessage(`Entendido, ${message}. ¿Cuál es la dosis y la frecuencia? Por ejemplo: '500mg cada 8 horas' o '1000mg una vez al día'.`, `Entendido, ${message}. ¿Cuál es la dosis y la frecuencia? Por ejemplo: 500 miligramos cada 8 horas o 1000 miligramos una vez al día.`);
        } else if (currentConversationState === 'add_medication_dose') {
            conversationData.newMed.dose = message;
            currentConversationState = 'add_medication_time';
            addBotMessage(`Y, ¿cuál es el horario específico de toma? Por ejemplo: '08:00 y 20:00' o '14:00'.`, `Y, ¿cuál es el horario específico de toma? Por ejemplo: 08:00 y 20:00 o 14:00.`);
        } else if (currentConversationState === 'add_medication_time') {
            conversationData.newMed.time = message;
            conversationData.newMed.id = 'med' + (userData.medications.length + 1); // Simple ID
            userData.medications.push(conversationData.newMed);
            addBotMessage(`¡Listo! He añadido <strong>${conversationData.newMed.name}</strong> (${conversationData.newMed.dose}) con horario ${conversationData.newMed.time}. Te redirigiré a la sección de Medicación.`, `Listo. He añadido ${conversationData.newMed.name} con dosis ${conversationData.newMed.dose} y horario ${conversationData.newMed.time}. Te redirigiré a la sección de Medicación.`);
            navigateToPage('Registrar-medicacion.html');
            currentConversationState = 'initial';
            conversationData = {};
        } else if (currentConversationState === 'mark_medication_taken_select') {
            const medIndex = parseInt(message) - 1;
            if (!isNaN(medIndex) && medIndex >= 0 && medIndex < userData.medications.length) {
                const medTaken = userData.medications[medIndex];
                medTaken.lastTaken = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                addBotMessage(`¡Perfecto! Has marcado <strong>${medTaken.name}</strong> como tomado a las ${medTaken.lastTaken}.`, `Perfecto. Has marcado ${medTaken.name} como tomado a las ${medTaken.lastTaken}.`);
                currentConversationState = 'initial';
                setupQuickActions();
            } else {
                addBotMessage("Lo siento, ese no es un número de medicamento válido. Por favor, intenta de nuevo.", "Lo siento, ese no es un número de medicamento válido. Por favor, intenta de nuevo.");
            }
        }
    }

    function showUpcomingDoses() {
        const now = new Date();
        const upcomingMeds = userData.medications.filter(med => {
            const [medHour, medMin] = med.time.split(':').map(Number);
            const medTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), medHour, medMin); // Usar medHour y medMin
            const diffMinutes = (medTime.getTime() - now.getTime()) / (1000 * 60);

            return medTime > now; // Solo dosis futuras hoy
        }).sort((a, b) => {
            const [h1, m1] = a.time.split(':').map(Number);
            const [h2, m2] = b.time.split(':').map(Number);
            return (h1 * 60 + m1) - (h2 * 60 + m2);
        });

        let messageHTML = `<div class="medibot-card"><h4><i class="fas fa-clock"></i> Tus Próximas Dosis</h4>`;
        let speakText = "Tus próximas dosis son: ";

        if (upcomingMeds.length > 0) {
            upcomingMeds.forEach(med => {
                messageHTML += `<p><strong>${med.name}</strong> (${med.dose}) a las ${med.time}</p>`;
                speakText += `${med.name} dosis ${med.dose} a las ${med.time}. `;
            });
            messageHTML += `<p>Recuerda tomar tu medicación a tiempo.</p>`;
            speakText += "Recuerda tomar tu medicación a tiempo.";
        } else {
            messageHTML += `<p>No tienes próximas dosis programadas para hoy.</p>`;
            speakText += "No tienes próximas dosis programadas para hoy.";
        }
        messageHTML += `
            <button class="quick-action-btn" onclick="navigateToPage('Registrar-medicacion.html')">
                <i class="fas fa-external-link-alt"></i> Gestionar Medicación
            </button>
        </div>`;
        addBotMessage(messageHTML, speakText, true);
        currentConversationState = 'initial';
    }


    function showEmergencyInfo() {
        let messageHTML = `
            <div class="medibot-card">
                <h4><i class="fas fa-exclamation-triangle"></i> Protocolo de Emergencia</h4>
                <p>En caso de emergencia, por favor:</p>
                <ol>
                    <li>Mantén la calma</li>
                    <li>Presiona el botón de emergencia rojo</li>
                    <li>Describe tu situación brevemente si puedes</li>
                </ol>
                <p>Contactaremos inmediatamente a tus contactos de emergencia:</p>
                <ul>
        `;
        let speakText = "En caso de emergencia, por favor, mantén la calma y presiona el botón de emergencia rojo. Contactaremos inmediatamente a tus contactos de emergencia: ";
        userData.emergencyContacts.forEach(contact => {
            messageHTML += `<li>${contact}</li>`;
            speakText += `${contact}. `;
        });
        messageHTML += `
                </ul>
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="quick-action-btn emergency-btn" onclick="handleEmergencyActivation()">
                        <i class="fas fa-bell"></i> Activar Emergencia
                    </button>
                    <button class="quick-action-btn emergency-btn" onclick="callEmergencyContacts()">
                        <i class="fas fa-phone-alt"></i> Llamar Contactos
                    </button>
                    <button class="quick-action-btn emergency-btn" onclick="showFirstAidGuide()">
                        <i class="fas fa-medkit"></i> Guía Primeros Auxilios
                    </button>
                    <button class="quick-action-btn emergency-btn" onclick="navigateToPage('emergencia.html')">
                        <i class="fas fa-external-link-alt"></i> Ir a Sección Emergencia
                    </button>
                </div>
            </div>
        `;
        speakText += " Puedes activar la emergencia, llamar a tus contactos, ver una guía de primeros auxilios o ir a la sección de emergencia.";
        addBotMessage(messageHTML, speakText);
    }

    function handleEmergencyActivation() {
        stopSpeaking();
        const modalContent = `
            <div class="modal-content small-content">
                <h2 style="text-align: center;">Confirmar Emergencia</h2>
                <p style="text-align: center;">¿Estás seguro de que necesitas activar el protocolo de emergencia? Esto notificará a tus contactos.</p>
                <div class="modal-actions justify-center">
                    <button type="button" class="secondary-button" onclick="closeCustomModal('emergencyConfirmModal'); addBotMessage('Entendido. La alerta de emergencia ha sido cancelada.', 'Entendido. La alerta de emergencia ha sido cancelada.');">No, cancelar</button>
                    <button type="button" class="danger-button" onclick="confirmEmergencyAction();">Sí, activar</button>
                </div>
            </div>
        `;
        showCustomModal(modalContent, 'emergencyConfirmModal');
    }

    function confirmEmergencyAction() {
        closeCustomModal('emergencyConfirmModal');
        console.log("Activando emergencia y contactando a:", userData.emergencyContacts);

        let messageHTML = `
            <div class="medibot-card">
                <h4><i class="fas fa-check-circle"></i> Alerta de Emergencia Enviada</h4>
                <p>He notificado a tus contactos de emergencia.</p>
                <p>Por favor, mantén la calma. Describe tu situación para que pueda asistirte mejor.</p>
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="quick-action-btn" onclick="addBotMessage('Entendido. Mantente en un lugar seguro. ¿Necesitas algo más por el momento?')">
                        Estoy bien ahora
                    </button>
                    <button class="quick-action-btn" onclick="addBotMessage('Por favor, indica tu ubicación actual y tus síntomas. Estoy intentando contactar con los servicios de emergencia.')">
                        Necesito más ayuda
                    </button>
                </div>
            </div>
        `;
        const speakText = "Alerta de emergencia enviada. He notificado a tus contactos de emergencia. Por favor, mantén la calma. Describe tu situación para que pueda asistirte mejor.";
        addBotMessage(messageHTML, speakText);
    }

    function callEmergencyContacts() {
        let messageHTML = `<div class="medibot-card"><h4><i class="fas fa-phone-alt"></i> Llamando a Contactos de Emergencia</h4>`;
        let speakText = "Llamando a tus contactos de emergencia: ";
        userData.emergencyContacts.forEach(contact => {
            messageHTML += `<p>Llamando a: <strong>${contact}</strong></p>`;
            speakText += `${contact}. `;
        });
        messageHTML += `<p>Esto es una simulación. En una aplicación real, se iniciaría una llamada o se enviaría un SMS.</p>
            <button class="quick-action-btn" onclick="addBotMessage('Espero que todo esté bien. ¿Necesitas algo más?')">
                <i class="fas fa-check"></i> Entendido
            </button>
        </div>`;
        addBotMessage(messageHTML, speakText);
    }

    function showFirstAidGuide() {
        let messageHTML = `
            <div class="medibot-card">
                <h4><i class="fas fa-medkit"></i> Guía Básica de Primeros Auxilios</h4>
                <p>Recuerda que esto es una guía básica y no reemplaza la atención médica profesional.</p>
                <ul>
                    <li><strong>Para cortes menores:</strong> Lava con agua y jabón, aplica presión con un paño limpio y cúbrelo con un vendaje.</li>
                    <li><strong>Para quemaduras leves:</strong> Enfría la zona con agua fría (no helada) durante 10-15 minutos. No uses hielo ni cremas.</li>
                    <li><strong>Para esguinces:</strong> Aplica el método RICE (Reposo, Hielo, Compresión, Elevación).</li>
                </ul>
                <p>Para situaciones más graves, activa el protocolo de emergencia.</p>
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="quick-action-btn emergency-btn" onclick="showEmergencyInfo()">
                        <i class="fas fa-exclamation-triangle"></i> Activar Emergencia
                    </button>
                    <button class="quick-action-btn" onclick="navigateToPage('PrimerosAuxilios.html')">
                        <i class="fas fa-external-link-alt"></i> Ver Guía Completa
                    </button>
                </div>
            </div>
        `;
        let speakText = "Guía Básica de Primeros Auxilios. Para cortes menores: Lava con agua y jabón, aplica presión y cúbrelo. Para quemaduras leves: Enfría con agua fría. Para esguinces: Aplica el método RICE. Para situaciones más graves, activa el protocolo de emergencia.";
        addBotMessage(messageHTML, speakText, true);
    }

    function showCustomModal(htmlContent, modalId) {
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        modal.innerHTML = htmlContent;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeCustomModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    function showHealthTips() {
        const randomIndex = Math.floor(Math.random() * userData.healthTips.length);
        const tip = userData.healthTips[randomIndex];

        let messageHTML = `
            <div class="medibot-card">
                <h4><i class="fas fa-lightbulb"></i> Consejo de Salud: ${tip.category}</h4>
                <p>${tip.text}</p>
                <p class="tip">${tip.tip}</p>
                ${tip.image ? `<img src="${tip.image}" alt="Consejo de salud" class="message-image" onerror="this.onerror=null;this.src='https://placehold.co/400x200/cccccc/333333?text=Imagen+no+disponible';">` : ''}
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="quick-action-btn" onclick="showHealthTips()">
                        <i class="fas fa-random"></i> Otro Consejo
                    </button>
                    ${tip.article ? `<button class="quick-action-btn" onclick="window.open('${tip.article}', '_blank')">
                        <i class="fas fa-external-link-alt"></i> Leer Artículo
                    </button>` : ''}
                    <button class="quick-action-btn" onclick="navigateToPage('ConsejosSalud.html')">
                        <i class="fas fa-external-link-alt"></i> Ver más consejos
                    </button>
                </div>
            </div>
        `;
        const speakText = `Consejo de Salud de ${tip.category}: ${tip.text} ${tip.tip}`;
        addBotMessage(messageHTML, speakText, true);
    }

    function showRandomCuriosity() {
        const randomIndex = Math.floor(Math.random() * userData.curiosities.length);
        const curiosity = userData.curiosities[randomIndex];
        addBotMessage(`
            <div class="medibot-card">
                <h4><i class="fas fa-question-circle"></i> Dato Curioso</h4>
                <p>${curiosity}</p>
                <button class="quick-action-btn" onclick="showRandomCuriosity()">
                    <i class="fas fa-random"></i> Otra Curiosidad
                </button>
            </div>
        `, `Dato Curioso: ${curiosity}`, true);
    }

    function showDailySummary() {
        const numMedications = userData.medications.length;
        const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
        const numAppointments = userData.appointments.filter(appt =>
            appt.date.includes('hoy') || appt.date.includes('Hoy') || appt.date.includes(today)
        ).length;

        let summaryHTML = `<div class="medibot-card"><h4><i class="fas fa-clipboard-list"></i> Tu Resumen de Hoy</h4>`;
        let speakText = "Aquí tienes tu resumen de hoy: ";

        if (numMedications > 0) {
            summaryHTML += `<p>Hoy tienes <strong>${numMedications}</strong> medicamento(s) registrado(s). Asegúrate de tomar tus dosis a tiempo.</p>`;
            speakText += `Tienes ${numMedications} medicamentos registrados. `;
        } else {
            summaryHTML += `<p>No tienes medicamentos registrados para hoy.</p>`;
            speakText += "No tienes medicamentos registrados para hoy. ";
        }
        if (numAppointments > 0) {
            summaryHTML += `<p>Tienes <strong>${numAppointments}</strong> cita(s) programada(s) para hoy. Revisa la sección de Citas para más detalles.</p>`;
            speakText += `Tienes ${numAppointments} citas programadas para hoy. `;
        } else {
            summaryHTML += `<p>No tienes citas programadas para hoy.</p>`;
            speakText += `No tienes citas programadas para hoy. `;
        }
        summaryHTML += `<p>¡Sigue cuidándote! Si necesitas registrar síntomas o actividades, usa el Historial Médico.</p>
            <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                <button class="quick-action-btn" onclick="navigateToPage('Registrar-medicacion.html')">
                    <i class="fas fa-pills"></i> Registrar Medicación
                </button>
                <button class="quick-action-btn" onclick="navigateToPage('HistorialMedico.html')">
                    <i class="fas fa-history"></i> Historial Médico
                </button>
            </div>
        </div>`;
        speakText += " ¡Sigue cuidándote! Si necesitas registrar síntomas o actividades, usa el Historial Médico.";
        addBotMessage(summaryHTML, speakText, true);
    }

    function startSymptomLogging() {
        currentConversationState = 'logging_symptom_name';
        addBotMessage("Claro, ¿qué síntoma te gustaría registrar? Por ejemplo: 'dolor de cabeza', 'fiebre', 'cansancio'.", "Claro, ¿qué síntoma te gustaría registrar? Por ejemplo: dolor de cabeza, fiebre, cansancio.");
    }

    function continueSymptomLogging(message) {
        const lowerCaseMessage = message.toLowerCase();
        if (currentConversationState === 'logging_symptom_name') {
            conversationData.currentSymptom = { name: message };
            currentConversationState = 'logging_symptom_details';
            addBotMessage(`Entendido, ¿qué intensidad tiene el ${message}? (leve, moderada, grave) ¿Y hace cuánto tiempo lo sientes?`, `Entendido, ¿qué intensidad tiene el ${message}? (leve, moderada, grave) ¿Y hace cuánto tiempo lo sientes?`);
        } else if (currentConversationState === 'logging_symptom_details') {
            const intensityMatch = lowerCaseMessage.match(/(leve|moderada|grave)/);
            const durationMatch = lowerCaseMessage.match(/(\d+)\s*(horas?|dias?|minutos?)/);

            let intensity = intensityMatch ? intensityMatch[1] : 'no especificada';
            let duration = durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : 'no especificada';

            conversationData.currentSymptom.intensity = intensity;
            conversationData.currentSymptom.duration = duration;
            conversationData.currentSymptom.timestamp = new Date().toLocaleString('es-ES');

            userData.symptomsHistory.push(conversationData.currentSymptom);
            console.log("Síntoma registrado:", conversationData.currentSymptom);

            let confirmationMessage = `Perfecto, he registrado tu síntoma: <strong>${conversationData.currentSymptom.name}</strong>, intensidad <strong>${conversationData.currentSymptom.intensity}</strong>, duración <strong>${conversationData.currentSymptom.duration}</strong>.`;
            addBotMessage(confirmationMessage + " Recuerda que soy un asistente de información. Para un diagnóstico o tratamiento médico, siempre consulta a un profesional de la salud.", confirmationMessage + " Recuerda que soy un asistente de información. Para un diagnóstico o tratamiento médico, siempre consulta a un profesional de la salud.", true);
            currentConversationState = 'initial';
            conversationData = {};
        }
    }

    function showReportGuide() {
        let messageHTML = `
            <div class="medibot-card">
                <h4><i class="fas fa-chart-bar"></i> Guía de Informes de Salud</h4>
                <p>En la sección de Informes, puedes generar y visualizar resúmenes de tu progreso de salud, como:</p>
                <ul>
                    <li>Informes de adherencia a la medicación</li>
                    <li>Tendencias de síntomas registrados</li>
                    <li>Resúmenes de citas y tratamientos</li>
                </ul>
                <p>Te redirigiré a la sección para que puedas explorarlos.</p>
                <button class="quick-action-btn" onclick="navigateToPage('Informe.html')">
                    <i class="fas fa-external-link-alt"></i> Ir a Informes
                </button>
            </div>
        `;
        let speakText = "En la sección de Informes, puedes generar y visualizar resúmenes de tu progreso de salud, como informes de adherencia a la medicación, tendencias de síntomas registrados y resúmenes de citas y tratamientos. Te redirigiré a la sección para que puedas explorarlos.";
        addBotMessage(messageHTML, speakText, true);
    }

    function showCaregiverGuide() {
        let messageHTML = `
            <div class="medibot-card">
                <h4><i class="fas fa-user-friends"></i> Guía del Modo Cuidador</h4>
                <p>El Modo Cuidador te permite gestionar el perfil de salud de tus seres queridos. Aquí puedes:</p>
                <ul>
                    <li>Ver su medicación y próximas dosis</li>
                    <li>Registrar síntomas o actividades en su nombre</li>
                    <li>Acceder a sus contactos de emergencia</li>
                </ul>
        `;
        let speakText = "El Modo Cuidador te permite gestionar el perfil de salud de tus seres queridos. Aquí puedes ver su medicación y próximas dosis, registrar síntomas o actividades en su nombre y acceder a sus contactos de emergencia.";

        if (userData.caregivers && userData.caregivers.length > 0) {
            messageHTML += `<p>Actualmente estás cuidando a:</p><ul>`;
            userData.caregivers.forEach(patient => {
                messageHTML += `<li><strong>${patient.name}</strong> (Último check-in: ${patient.lastCheckIn})</li>`;
                speakText += `${patient.name}. `;
            });
            messageHTML += `</ul>`;
            messageHTML += `<div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                <button class="quick-action-btn" onclick="navigateToPage('Modo_Cuidador.html')">
                    <i class="fas fa-external-link-alt"></i> Ir a Modo Cuidador
                </button>
                <button class="quick-action-btn" onclick="addBotMessage('Para ver la medicación de un paciente, por favor, dime su nombre. Por ejemplo: \'Medicacion de Carlos\'.')">
                    <i class="fas fa-pills"></i> Ver Medicación de Paciente
                </button>
            </div>`;
            speakText += "Te redirigiré a la sección de Modo Cuidador.";
        } else {
            messageHTML += `<p>Actualmente no tienes pacientes registrados en Modo Cuidador.</p>
                <button class="quick-action-btn" onclick="navigateToPage('Modo_Cuidador.html')">
                    <i class="fas fa-plus"></i> Añadir Paciente
                </button>`;
            speakText += "Actualmente no tienes pacientes registrados en Modo Cuidador. Puedes añadir un paciente.";
        }
        messageHTML += `</div>`;
        addBotMessage(messageHTML, speakText, true);
    }

    function handleClarification(queryType) {
        let messageHTML = `<div class="medibot-card"><h4><i class="fas fa-question-circle"></i> Aclaración</h4>`;
        let speakText = "Por favor, especifica: ";

        if (queryType === 'historial') {
            messageHTML += `<p>¿Te refieres al historial de:</p>
                <ul>
                    <li>Citas</li>
                    <li>Medicamentos</li>
                    <li>Síntomas</li>
                    <li>Documentos</li>
                </ul>
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="quick-action-btn" onclick="navigateToPage('Citas.html')"><i class="fas fa-calendar-alt"></i> Citas</button>
                    <button class="quick-action-btn" onclick="navigateToPage('Registrar-medicacion.html')"><i class="fas fa-pills"></i> Medicamentos</button>
                    <button class="quick-action-btn" onclick="navigateToPage('HistorialMedico.html')"><i class="fas fa-history"></i> Síntomas/Documentos</button>
                </div>`;
            speakText += "Citas, medicamentos, síntomas o documentos?";
        } else if (queryType === 'configuracion') {
            messageHTML += `<p>¿Qué aspecto de la configuración te interesa?</p>
                <ul>
                    <li>Perfil personal</li>
                    <li>Notificaciones</li>
                    <li>Contactos de emergencia</li>
                </ul>
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="quick-action-btn" onclick="navigateToPage('Perfil-Configuracion.html')"><i class="fas fa-user-edit"></i> Perfil</button>
                    <button class="quick-action-btn" onclick="navigateToPage('Perfil-Configuracion.html')"><i class="fas fa-bell"></i> Notificaciones</button>
                    <button class="quick-action-btn" onclick="navigateToPage('Perfil-Configuracion.html')"><i class="fas fa-phone-alt"></i> Contactos</button>
                </div>`;
            speakText += "Perfil personal, notificaciones o contactos de emergencia?";
        }
        messageHTML += `</div>`;
        addBotMessage(messageHTML, speakText, true);
    }


    function addFeedbackButtons() {
        const feedbackHTML = `
            <div class="medibot-card feedback-card">
                <p>¿Te fue útil esta respuesta?</p>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    <button class="quick-action-btn" onclick="handleFeedback('yes')"><i class="fas fa-thumbs-up"></i> Sí</button>
                    <button class="quick-action-btn" onclick="handleFeedback('no')"><i class="fas fa-thumbs-down"></i> No</button>
                </div>
            </div>
        `;
        addMessage(feedbackHTML, 'bot-message');
    }

    function handleFeedback(type) {
        console.log("Feedback recibido:", type);
        addBotMessage(type === 'yes' ? "¡Genial! Me alegro de haberte ayudado. 😊" : "Lo siento. ¿Podrías darme más detalles para mejorar? Puedes escribir tu pregunta de otra forma.", type === 'yes' ? "Genial. Me alegro de haberte ayudado." : "Lo siento. ¿Podrías darme más detalles para mejorar? Puedes escribir tu pregunta de otra forma.");
        const feedbackCard = document.querySelector('.feedback-card');
        if (feedbackCard) {
            feedbackCard.remove();
        }
    }

    function checkProactiveMessages() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        userData.medications.forEach(med => {
            const [medHour, medMin] = med.time.split(':').map(Number);
            const medTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), medHour, medMin); // Usar medHour y medMin
            const diffMinutes = (medTime.getTime() - now.getTime()) / (1000 * 60);

            if (diffMinutes > 0 && diffMinutes <= 60) {
                addBotMessage(`¡Hola! Son las ${currentHour}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}. Recuerda que tienes una dosis de <strong>${med.name}</strong> a las ${med.time}. ¿Ya te lo has tomado o necesitas un recordatorio en 15 minutos?`, `Hola. Son las ${currentHour} y ${currentMinutes} minutos. Recuerda que tienes una dosis de ${med.name} a las ${med.time}. ¿Ya te lo has tomado o necesitas un recordatorio en 15 minutos?`);
                return;
            }
        });

        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const tomorrowDateString = tomorrow.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

        userData.appointments.forEach(appt => {
            if (appt.date.includes(tomorrowDateString)) {
                addBotMessage(`Mañana, ${appt.date}, tienes una cita con el <strong>${appt.doctor}</strong> a las ${appt.time}. ¿Necesitas indicaciones para llegar o quieres que te recuerde los detalles de la cita?`, `Mañana, ${appt.date}, tienes una cita con el ${appt.doctor} a las ${appt.time}. ¿Necesitas indicaciones para llegar o quieres que te recuerde los detalles de la cita?`);
                return;
            }
        });
    }


    // --- 6. Procesamiento de Mensajes del Usuario (NLP simple) ---
    function processUserMessage(message) {
        const lowerCaseMessage = message.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // Manejo del estado de conversación para flujos guiados
        if (currentConversationState.startsWith('logging_symptom')) {
            continueSymptomLogging(message);
            return;
        } else if (currentConversationState.startsWith('schedule_appointment') || currentConversationState.startsWith('cancel_appointment') || currentConversationState.startsWith('view_appointment_details')) {
            continueAppointmentManagement(message);
            return;
        } else if (currentConversationState.startsWith('add_medication') || currentConversationState.startsWith('mark_medication_taken')) {
            continueMedicationManagement(message);
            return;
        }


        // Respuestas basadas en palabras clave (si no está en un flujo guiado)
        if (lowerCaseMessage.includes("hola") || lowerCaseMessage.includes("saludos") || lowerCaseMessage.includes("que tal")) {
            showWelcomeMessage();
        } else if (lowerCaseMessage.includes("cita") || lowerCaseMessage.includes("citas") || lowerCaseMessage.includes("doctor") || lowerCaseMessage.includes("turnos")) {
            showAppointments();
        } else if (lowerCaseMessage.includes("medicamento") || lowerCaseMessage.includes("medicina") || lowerCaseMessage.includes("pildora") || lowerCaseMessage.includes("pastilla")) {
            showMedications();
        } else if (lowerCaseMessage.includes("emergencia") || lowerCaseMessage.includes("urgencia") || lowerCaseMessage.includes("ayuda")) {
            showEmergencyInfo(); // Mantener la función de emergencia accesible por comando de voz/texto
        } else if (lowerCaseMessage.includes("consejo") || lowerCaseMessage.includes("salud") || lowerCaseMessage.includes("tip")) {
            showHealthTips();
        } else if (lowerCaseMessage.includes("historial") || lowerCaseMessage.includes("sintomas") || lowerCaseMessage.includes("documentos") || lowerCaseMessage.includes("tratamientos") || lowerCaseMessage.includes("diagnosticos")) {
            if (lowerCaseMessage.includes("sintoma") || lowerCaseMessage.includes("sintomas")) {
                startSymptomLogging();
            } else if (lowerCaseMessage.includes("medicacion") || lowerCaseMessage.includes("medicamentos")) {
                addBotMessage('Te redirigiré a la sección de Historial de Medicación.', 'Te redirigiré a la sección de Historial de Medicación.');
                navigateToPage('Registrar-medicacion.html');
            } else if (lowerCaseMessage.includes("citas")) {
                addBotMessage('Te redirigiré a la sección de Historial de Citas.', 'Te redirigiré a la sección de Historial de Citas.');
                navigateToPage('Citas.html');
            } else {
                handleClarification('historial');
            }
        } else if (lowerCaseMessage.includes("recordatorio") || lowerCaseMessage.includes("alarma")) {
            addBotMessage('Puedes gestionar tus recordatorios en la sección de Recordatorios. Te llevaré allí. ¿Necesitas ayuda para configurar uno nuevo?', 'Puedes gestionar tus recordatorios en la sección de Recordatorios. Te llevaré allí. ¿Necesitas ayuda para configurar uno nuevo?');
            navigateToPage('Recordatorios.html');
        } else if (lowerCaseMessage.includes("configuracion") || lowerCaseMessage.includes("ajustes") || lowerCaseMessage.includes("perfil")) {
            handleClarification('configuracion');
        } else if (lowerCaseMessage.includes("informe semanal") || lowerCaseMessage.includes("reporte") || lowerCaseMessage.includes("informes")) {
            showReportGuide();
        } else if (lowerCaseMessage.includes("cuidador") || lowerCaseMessage.includes("modo cuidador") || lowerCaseMessage.includes("paciente a cargo")) {
            showCaregiverGuide();
        } else if (lowerCaseMessage.includes("notas") || lowerCaseMessage.includes("apuntes")) {
            addBotMessage('Puedes tomar notas personales en la sección de Notas Personales. Te llevaré allí. ¿Hay algo que te gustaría anotar?', 'Puedes tomar notas personales en la sección de Notas Personales. Te llevaré allí. ¿Hay algo que te gustaría anotar?');
            navigateToPage('Notas_Personales.html');
        } else if (lowerCaseMessage.includes("gracias") || lowerCaseMessage.includes("muchas gracias")) {
            addBotMessage("De nada, estoy aquí para ayudarte. 😊", "De nada, estoy aquí para ayudarte.");
        } else if (lowerCaseMessage.includes("como estoy hoy") || lowerCaseMessage.includes("mi resumen") || lowerCaseMessage.includes("que tengo hoy")) {
            showDailySummary();
        } else if (lowerCaseMessage.includes("dato curioso") || lowerCaseMessage.includes("curiosidad")) {
            showRandomCuriosity();
        } else if (lowerCaseMessage.includes("añadir medicamento") || lowerCaseMessage.includes("registrar medicamento")) {
            startMedicationManagement('add');
        } else if (lowerCaseMessage.includes("programar cita") || lowerCaseMessage.includes("nueva cita")) {
            startAppointmentManagement('schedule');
        } else if (lowerCaseMessage.includes("proximas dosis") || lowerCaseMessage.includes("dosis pendientes")) {
            showUpcomingDoses();
        } else if (lowerCaseMessage.includes("llamar emergencia") || lowerCaseMessage.includes("llamar contactos")) {
            callEmergencyContacts();
        } else if (lowerCaseMessage.includes("primeros auxilios") || lowerCaseMessage.includes("guia de primeros auxilios")) {
            showFirstAidGuide();
        } else if (lowerCaseMessage.includes("ayuda") || lowerCaseMessage.includes("que puedes hacer") || lowerCaseMessage.includes("funciones")) {
            showWelcomeMessage();
        }
        else {
            addBotMessage("Lo siento, no he entendido tu solicitud. ¿Podrías reformularla? O quizás, ¿alguna de estas opciones te ayuda?", "Lo siento, no he entendido tu solicitud. ¿Podrías reformularla? O quizás, alguna de estas opciones te ayuda.");
            setupQuickActions();
        }
    }

    // --- 7. Manejo de Notificaciones ---
    function incrementUnreadMessages() {
        unreadMessages++;
        notificationBadge.textContent = unreadMessages;
        notificationBadge.classList.remove('hidden');
        medibotToggle.classList.add('pulse');
    }

    function resetUnreadMessages() {
        unreadMessages = 0;
        notificationBadge.classList.add('hidden');
        medibotToggle.classList.remove('pulse');
    }

    // --- 8. Event Listeners ---
    medibotToggle.addEventListener('click', toggleMedibot);

    medibotHeader.addEventListener('click', (e) => {
        if (!e.target.closest('.control-btn')) {
            toggleMinimize();
        }
    });

    medibotMinimize.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMinimize();
    });

    medibotClose.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMedibot();
    });

    medibotSendButton.addEventListener('click', () => {
        const messageText = medibotInput.value.trim();
        if (messageText) {
            addUserMessage(messageText);
        }
    });

    medibotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            medibotSendButton.click();
        }
    });

    // --- Funcionalidad de Voz (SpeechRecognition y SpeechSynthesis) ---
    window.showCustomModal = showCustomModal;
    window.closeCustomModal = closeCustomModal;
    window.confirmEmergencyAction = confirmEmergencyAction;
    window.startAppointmentManagement = startAppointmentManagement;
    window.confirmCancelAppointment = confirmCancelAppointment;
    window.startMedicationManagement = startMedicationManagement;
    window.handleFeedback = handleFeedback;
    window.callEmergencyContacts = callEmergencyContacts; // Hacer global
    window.showFirstAidGuide = showFirstAidGuide; // Hacer global
    window.showReportGuide = showReportGuide; // Hacer global
    window.showCaregiverGuide = showCaregiverGuide; // Hacer global


    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = userData.voicePreference.lang;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            medibotInput.value = transcript;
            medibotSendButton.click();
        };

        recognition.onend = () => {
            medibotVoiceInput.classList.remove('active');
            medibotVoiceInput.innerHTML = '<i class="fas fa-microphone" aria-hidden="true"></i>';
            console.log("Reconocimiento de voz detenido.");
        };

        recognition.onerror = (event) => {
            medibotVoiceInput.classList.remove('active');
            medibotVoiceInput.innerHTML = '<i class="fas fa-microphone" aria-hidden="true"></i>';
            console.error("Error en el reconocimiento de voz:", event.error);
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                addBotMessage("No tengo permiso para usar el micrófono. Por favor, asegúrate de que el navegador tenga acceso al micrófono.", "No tengo permiso para usar el micrófono. Por favor, asegúrate de que el navegador tenga acceso al micrófono.");
            } else if (event.error === 'no-speech') {
                addBotMessage("No te he escuchado. ¿Podrías intentarlo de nuevo?", "No te he escuchado. ¿Podrías intentarlo de nuevo?");
            } else {
                addBotMessage("Ha ocurrido un error con el reconocimiento de voz. Por favor, intenta escribir tu mensaje.", "Ha ocurrido un error con el reconocimiento de voz. Por favor, intenta escribir tu mensaje.");
            }
        };

        medibotVoiceInput.addEventListener('click', () => {
            if (SpeechSynthesis.speaking) {
                stopSpeaking();
            }

            if (recognition && recognition.recognizing) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                    medibotVoiceInput.classList.add('active');
                    medibotVoiceInput.innerHTML = '<i class="fas fa-microphone-alt-slash" aria-hidden="true"></i>';
                } catch (e) {
                    console.error("Error al iniciar el reconocimiento de voz:", e);
                    medibotVoiceInput.classList.remove('active');
                    medibotVoiceInput.innerHTML = '<i class="fas fa-microphone" aria-hidden="true"></i>';
                    addBotMessage("No pude iniciar el reconocimiento de voz. Asegúrate de que tu micrófono esté conectado y los permisos estén otorgados.", "No pude iniciar el reconocimiento de voz. Asegúrate de que tu micrófono esté conectado y los permisos estén otorgados.");
                }
            }
        });
    } else {
        medibotVoiceInput.style.display = 'none';
        console.warn("SpeechRecognition no está soportado en este navegador. El botón de voz ha sido ocultado.");
    }

    // Hacer funciones globales para que puedan ser llamadas desde onclick en HTML
    window.addBotMessage = addBotMessage;
    window.navigateToPage = navigateToPage;
    window.showHealthTips = showHealthTips;
    window.showRandomCuriosity = showRandomCuriosity;
    window.handleEmergencyActivation = handleEmergencyActivation;
});
