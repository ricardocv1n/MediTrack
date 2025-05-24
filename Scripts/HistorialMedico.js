document.addEventListener('DOMContentLoaded', function() {
    // --- Variables ---
    const sidebarContainer = document.getElementById('sidebar-container');
    const tabs = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Diagnósticos
    const addDiagnosisBtn = document.getElementById('add-diagnosis');
    const diagnosisModal = document.getElementById('diagnosis-modal');
    const diagnosisForm = document.getElementById('diagnosis-form');
    const diagnosticsGrid = document.querySelector('.diagnostics-grid');
    const diagnosisDetailsModal = document.getElementById('diagnosis-details-modal');

    // Tratamientos
    const addTreatmentButton = document.getElementById('add-treatment');
    const viewAllTreatmentsButton = document.getElementById('view-all-treatments-btn');
    const treatmentModal = document.getElementById('treatment-modal');
    const treatmentForm = document.getElementById('treatment-form');
    const treatmentsGrid = document.querySelector('.treatments-grid');
    const treatmentDetailsModal = document.getElementById('treatment-details-modal');

    // Eventos
    const addEventButton = document.getElementById('add-event');
    const viewAllEventsButton = document.getElementById('view-all-events-btn');
    const eventModal = document.getElementById('event-modal');
    const eventForm = document.getElementById('event-form');
    const eventsGrid = document.querySelector('.events-grid');
    const eventDetailsModal = document.getElementById('event-details-modal');

    // Documentos
    const uploadDocumentButton = document.getElementById('upload-document');
    const viewAllDocumentsButton = document.getElementById('view-all-documents-btn');
    const documentModal = document.getElementById('document-modal');
    const documentForm = document.getElementById('document-form');
    const documentsGrid = document.querySelector('.documents-grid');
    const documentDetailsModal = document.getElementById('document-details-modal');

    // Otros
    const changePatientBtn = document.getElementById('change-patient');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal-overlay'); // All modal overlays

    // --- Datos simulados (reemplazar con tu lógica real) ---
    let currentPatient = { id: 'MT-458792', name: 'María López', age: 42, bloodType: 'A+' };
    let diagnosticsData = [
        { id: 1, name: 'Hipertensión arterial', severity: 'warning', doctor: 'Dr. Gómez', date: '2022-03-12', lastReading: '140/90 mmHg', lastReadingDate: 'Ayer 14:30', adherence: 85, notes: 'Controlar TA 2 veces al día. Dieta baja en sodio. Próxima cita con cardiología.', nextControl: '2024-06-15', specialist: 'Cardiología' },
        { id: 2, name: 'Diabetes tipo 2', severity: 'stable', doctor: 'Dra. Ruiz', date: '2021-11-05', lastReading: '110 mg/dL', lastReadingDate: 'Hoy 08:45', adherence: 92, notes: 'Control glucémico estable. Continuar con metformina 850mg cada 12h. Revisar HbA1c en próximo control.', nextControl: '2024-06-20', specialist: 'Endocrinología' },
        { id: 3, name: 'Artrosis rodilla derecha', severity: 'urgent', doctor: 'Dr. Mendoza', date: '2023-01-22', lastReading: '6/10', lastReadingDate: 'Ayer 18:20', adherence: 78, notes: 'Episodio de dolor agudo. Aplicar hielo y tomar paracetamol según necesidad. Valorar infiltración si no mejora.', nextControl: '2024-07-10', specialist: 'Traumatología' }
    ];
    let nextDiagnosisId = 4;

    let treatmentsData = [
        { id: 'T1', name: 'Losartán 50mg', diagnosisId: '1', diagnosisName: 'Hipertensión arterial', doctor: 'Dr. Gómez', startDate: '2022-03-15', dosage: '1 pastilla cada 24h', notes: 'Control de presión arterial. Tomar con el desayuno.', adherence: 90, status: 'activo' },
        { id: 'T2', name: 'Metformina 850mg', diagnosisId: '2', diagnosisName: 'Diabetes tipo 2', doctor: 'Dra. Ruiz', startDate: '2021-11-10', dosage: '1 pastilla cada 12h', notes: 'Control de glucosa. Tomar con las comidas principales.', adherence: 92, status: 'activo' },
        { id: 'T3', name: 'Paracetamol 500mg', diagnosisId: '3', diagnosisName: 'Artrosis rodilla derecha', doctor: 'Dr. Mendoza', startDate: '2023-01-25', dosage: '1 pastilla cada 8h (si dolor)', notes: 'Alivio del dolor por artrosis. No exceder 3g/día.', adherence: 70, status: 'activo' },
        { id: 'T4', name: 'Levotiroxina 75mcg', diagnosisId: '4', diagnosisName: 'Hipotiroidismo', doctor: 'Dra. Vargas', startDate: '2020-09-05', dosage: '1 pastilla en ayunas', notes: 'Sustitución hormonal. Control de TSH periódico.', adherence: 95, status: 'activo' },
        { id: 'T5', name: 'Fisioterapia Rodilla', diagnosisId: '3', diagnosisName: 'Artrosis rodilla derecha', doctor: 'Lic. Laura Castro (Fisioterapeuta)', startDate: '2023-02-01', dosage: '3 sesiones/semana', notes: 'Ejercicios de fortalecimiento y movilidad. Duración 3 meses.', adherence: 80, status: 'activo' }
    ];
    let nextTreatmentId = treatmentsData.length > 0 ? Math.max(...treatmentsData.map(t => parseInt(t.id.replace('T', '')))) + 1 : 1;

    let eventsData = [
        { id: 'E1', name: 'Cirugía de Apendicectomía', date: '2023-10-15', hospital: 'Hospital Central de Montería', doctor: 'Dr. Juan Pérez (Cirujano)', description: 'Extirpación de apéndice inflamado debido a apendicitis aguda. Recuperación postoperatoria sin complicaciones, alta a los 3 días.' },
        { id: 'E2', name: 'Episodio de Bronquitis Aguda', date: '2024-02-20', hospital: 'Clínica La Esperanza', doctor: 'Dra. Ana García (Neumóloga)', description: 'Infección respiratoria tratada con antibióticos y broncodilatadores. Mejora significativa en 7 días, persistencia de tos seca por 2 semanas.' },
        { id: 'E3', name: 'Vacunación Anual (Influenza)', date: '2024-04-01', hospital: 'Centro de Salud Urbano', doctor: 'Enfermera Jefe María Rojas', description: 'Administración de vacuna contra la influenza estacional. Sin reacciones adversas reportadas.' },
        { id: 'E4', name: 'Consulta de Nutrición', date: '2024-05-05', hospital: 'Centro Nutricional Vida Sana', doctor: 'Lic. Sofía Restrepo (Nutricionista)', description: 'Primera consulta para plan de alimentación balanceado. Se establecieron metas de peso y hábitos saludables.' }
    ];
    let nextEventId = eventsData.length > 0 ? Math.max(...eventsData.map(e => parseInt(e.id.replace('E', '')))) + 1 : 1;

    let documentsData = [
        { id: 'D1', name: 'Resultados de Laboratorio General', date: '2024-05-10', type: 'Análisis Clínico', description: 'Hemograma completo, perfil lipídico y función renal. Todos los valores dentro de rangos normales.' },
        { id: 'D2', name: 'Receta Médica - Ibuprofeno 600mg', date: '2024-05-15', type: 'Receta', description: 'Receta para Ibuprofeno 600mg, tomar cada 8 horas por 5 días para dolor muscular.' },
        { id: 'D3', name: 'Informe de Consulta Cardiológica', date: '2024-04-22', type: 'Informe Médico', description: 'Informe de seguimiento cardiológico. Electrocardiograma normal, se ajusta dosis de antihipertensivo.' },
        { id: 'D4', name: 'Radiografía de Rodilla Derecha', date: '2023-01-25', type: 'Imagen Diagnóstica', description: 'Radiografía que muestra signos de artrosis leve en la articulación de la rodilla derecha.' }
    ];
    let nextDocumentId = documentsData.length > 0 ? Math.max(...documentsData.map(d => parseInt(d.id.replace('D', '')))) + 1 : 1;


    // --- Funciones de Interfaz de Usuario (UI) ---

    // Function to show notifications
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.classList.add('notification-container');
    document.body.appendChild(notificationContainer);

    function showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('notification-fade-out');
            notification.addEventListener('transitionend', () => notification.remove());
        }, duration);
    }

    function activateTab(tabId) {
        tabs.forEach(tab => tab.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        const activeTab = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        const activePanel = document.getElementById(`${tabId}-panel`);
        if (activeTab) activeTab.classList.add('active');
        if (activePanel) activePanel.classList.add('active');

        // Render content specific to the activated tab
        if (tabId === 'diagnostics') {
            renderDiagnostics();
        } else if (tabId === 'treatments') {
            renderTreatments();
        } else if (tabId === 'events') {
            renderEvents();
        } else if (tabId === 'documents') {
            renderDocuments();
        }
    }

    function openModal(modal) {
        if (modal) modal.classList.add('active');
    }

    function closeModal(modal) {
        if (modal) modal.classList.remove('active');
    }

    // --- Patient Section Functions ---
    function renderPatientInfo() {
        document.querySelector('.patient-name').textContent = `${currentPatient.name} (${currentPatient.age} años)`;
        document.querySelector('.patient-meta .meta-item:nth-child(1)').innerHTML = `<i class="fas fa-id-card"></i> ID: ${currentPatient.id}`;
        document.querySelector('.patient-meta .meta-item:nth-child(2)').innerHTML = `<i class="fas fa-tint"></i> ${currentPatient.bloodType}`;
        
        // Update quick stats (simulated values)
        document.querySelector('.patient-quickstats .stat-item:nth-child(1) .stat-number').textContent = diagnosticsData.length;
        document.querySelector('.patient-quickstats .stat-item:nth-child(2) .stat-number').textContent = treatmentsData.length;
        // Calculate adherence percentage (example: average of all treatments' adherence)
        const totalAdherence = treatmentsData.reduce((sum, t) => sum + t.adherence, 0);
        const averageAdherence = treatmentsData.length > 0 ? Math.round(totalAdherence / treatmentsData.length) : 0;
        document.querySelector('.patient-quickstats .stat-item:nth-child(3) .stat-number').textContent = `${averageAdherence}%`;
    }

    // --- Diagnósticos Functions ---
    function renderDiagnostics() {
        if (!diagnosticsGrid) return;
        diagnosticsGrid.innerHTML = '';
        if (diagnosticsData.length === 0) {
            diagnosticsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-notes-medical"></i>
                    <h4>No hay diagnósticos registrados</h4>
                    <p>Añade un nuevo diagnóstico para empezar a gestionar tu historial médico.</p>
                    <button class="primary-button small" id="add-diagnosis-empty">
                        <i class="fas fa-plus"></i> Añadir diagnóstico
                    </button>
                </div>
            `;
            document.getElementById('add-diagnosis-empty').addEventListener('click', () => {
                populateDiagnosisModal();
                openModal(diagnosisModal);
            });
        } else {
            diagnosticsData.forEach(diagnostic => {
                const card = createDiagnosticCard(diagnostic);
                diagnosticsGrid.appendChild(card);
            });
        }
    }

    function createDiagnosticCard(diagnostic) {
        const card = document.createElement('div');
        card.classList.add('diagnostic-card', diagnostic.severity);
        card.dataset.diagnosisId = diagnostic.id;
        card.innerHTML = `
            <div class="card-header">
                <div class="condition-status">
                    <span class="status-indicator ${diagnostic.severity}"></span>
                    <h4>${diagnostic.name}</h4>
                </div>
                <div class="card-actions">
                    <button class="icon-button view-diagnostic-details-btn" data-diagnostic-id="${diagnostic.id}" title="Más información">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="icon-button edit-diagnosis" data-diagnostic-id="${diagnostic.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-button delete-diagnosis" data-diagnostic-id="${diagnostic.id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="diagnostic-meta">
                    <span class="meta-item"><i class="fas fa-user-md"></i> ${diagnostic.doctor}</span>
                    <span class="meta-item"><i class="fas fa-calendar-alt"></i> ${diagnostic.date}</span>
                </div>
                <div class="diagnostic-stats">
                    <div class="stat-item">
                        <div class="stat-label">Última lectura</div>
                        <div class="stat-value ${diagnostic.severity === 'urgent' ? 'critical' : (diagnostic.severity === 'warning' ? 'warning' : 'normal')}">${diagnostic.lastReading}</div>
                        <div class="stat-date">${diagnostic.lastReadingDate}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Adherencia</div>
                        <div class="stat-progress"><div class="progress-bar" style="width: ${diagnostic.adherence}%;"></div></div>
                        <div class="stat-percent">${diagnostic.adherence}%</div>
                    </div>
                </div>
                <div class="diagnostic-notes">
                    <p>${diagnostic.notes}</p>
                </div>
                <div class="diagnostic-next"><i class="fas fa-calendar-day"></i> Próximo control: <strong>${diagnostic.nextControl}</strong> con ${diagnostic.specialist || ''}</div>
            </div>
        `;

        // Add event listeners for the buttons within the card
        card.querySelector('.view-diagnostic-details-btn').addEventListener('click', () => showDiagnosisDetails(diagnostic.id));
        card.querySelector('.edit-diagnosis').addEventListener('click', () => {
            populateDiagnosisModal(diagnostic);
            openModal(diagnosisModal);
        });
        card.querySelector('.delete-diagnosis').addEventListener('click', () => {
            // Using a custom modal for confirmation instead of alert/confirm
            showConfirmationModal(
                `¿Estás seguro de que deseas eliminar el diagnóstico "${diagnostic.name}"?`,
                () => { // On confirm
                    diagnosticsData = diagnosticsData.filter(d => d.id !== diagnostic.id);
                    renderDiagnostics();
                    renderPatientInfo(); // Update patient stats
                    showNotification('Diagnóstico eliminado correctamente', 'success');
                }
            );
        });

        return card;
    }

    function populateDiagnosisModal(diagnostic = null) {
        document.getElementById('diagnosis-id').value = diagnostic ? diagnostic.id : '';
        document.getElementById('diagnosis-name').value = diagnostic ? diagnostic.name : '';
        document.getElementById('diagnosis-date').value = diagnostic ? diagnostic.date : '';
        document.getElementById('diagnosis-doctor').value = diagnostic ? diagnostic.doctor : '';
        document.getElementById('diagnosis-severity').value = diagnostic ? diagnostic.severity : 'stable';
        document.getElementById('diagnosis-notes').value = diagnostic ? diagnostic.notes : '';
        // Update modal title based on whether it's an edit or add operation
        document.getElementById('diagnosis-modal-title').textContent = diagnostic ? 'Editar Diagnóstico' : 'Añadir Nuevo Diagnóstico';
    }

    function showDiagnosisDetails(id) {
        const diagnostic = diagnosticsData.find(d => d.id === id);
        if (diagnostic) {
            document.getElementById('detail-diagnosis-name').textContent = diagnostic.name;
            document.getElementById('detail-diagnosis-date').textContent = diagnostic.date;
            document.getElementById('detail-diagnosis-doctor').textContent = diagnostic.doctor;
            document.getElementById('detail-diagnosis-severity').textContent = diagnostic.severity;
            document.getElementById('detail-diagnosis-last-reading').textContent = diagnostic.lastReading;
            document.getElementById('detail-diagnosis-last-reading-date').textContent = diagnostic.lastReadingDate;
            document.getElementById('detail-diagnosis-adherence').textContent = diagnostic.adherence;
            document.getElementById('detail-diagnosis-notes').textContent = diagnostic.notes;
            document.getElementById('detail-diagnosis-next-control').textContent = diagnostic.nextControl;
            openModal(diagnosisDetailsModal);
        } else {
            showNotification('Diagnóstico no encontrado.', 'error');
        }
    }

    // --- Tratamientos Functions ---
    function renderTreatments() {
        if (!treatmentsGrid) return;
        treatmentsGrid.innerHTML = ''; // Clear existing cards

        if (treatmentsData.length === 0) {
            treatmentsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-prescription-bottle-alt"></i>
                    <h4>No hay tratamientos activos</h4>
                    <p>Agrega un nuevo tratamiento para empezar a gestionarlos.</p>
                    <button class="primary-button small" id="add-treatment-empty">
                        <i class="fas fa-plus"></i> Agregar tratamiento
                    </button>
                </div>
            `;
            document.getElementById('add-treatment-empty').addEventListener('click', () => {
                populateTreatmentModal();
                openModal(treatmentModal);
            });
        } else {
            treatmentsData.forEach(treatment => {
                const card = createTreatmentCard(treatment);
                treatmentsGrid.appendChild(card);
            });
        }
    }

    function createTreatmentCard(treatment) {
        const card = document.createElement('div');
        card.classList.add('treatment-card');
        card.setAttribute('data-treatment-id', treatment.id);
        card.innerHTML = `
            <div class="card-header">
                <h4>${treatment.name}</h4>
                <div class="card-actions">
                    <button class="icon-button view-treatment-details-btn" data-treatment-id="${treatment.id}" title="Más información">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="icon-button edit-treatment-btn" data-treatment-id="${treatment.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-button delete-treatment-btn" data-treatment-id="${treatment.id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="treatment-meta">
                    <span class="meta-item">
                        <i class="fas fa-user-md"></i> ${treatment.doctor}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-calendar-alt"></i> Inicio: ${treatment.startDate}
                    </span>
                </div>
                <div class="treatment-notes">
                    <p>Dosis: ${treatment.dosage}</p>
                    <p>Notas: ${treatment.notes}</p>
                    <p>Diagnóstico: ${treatment.diagnosisName || 'N/A'}</p>
                </div>
            </div>
        `;

        // Add event listeners for the buttons within the new card
        card.querySelector('.view-treatment-details-btn').addEventListener('click', () => showTreatmentDetails(treatment.id));
        card.querySelector('.edit-treatment-btn').addEventListener('click', () => {
            populateTreatmentModal(treatment);
            openModal(treatmentModal);
        });
        card.querySelector('.delete-treatment-btn').addEventListener('click', () => {
            showConfirmationModal(
                `¿Estás seguro de que deseas eliminar el tratamiento "${treatment.name}"?`,
                () => { // On confirm
                    treatmentsData = treatmentsData.filter(t => t.id !== treatment.id);
                    renderTreatments();
                    renderPatientInfo(); // Update patient stats
                    showNotification('Tratamiento eliminado correctamente', 'success');
                }
            );
        });

        return card;
    }

    function populateTreatmentModal(treatment = null) {
        const treatmentNameInput = document.getElementById('treatment-name');
        const treatmentDiagnosisSelect = document.getElementById('treatment-diagnosis');
        const treatmentDoctorInput = document.getElementById('treatment-doctor');
        const treatmentStartDateInput = document.getElementById('treatment-start-date');
        const treatmentDosageInput = document.getElementById('treatment-dosage');
        const treatmentNotesTextarea = document.getElementById('treatment-notes');
        const treatmentIdInput = document.getElementById('treatment-id'); // Hidden input for ID

        // Clear previous options and populate with current diagnostics
        treatmentDiagnosisSelect.innerHTML = '<option value="">Seleccione un diagnóstico</option>';
        diagnosticsData.forEach(diag => {
            const option = document.createElement('option');
            option.value = diag.id;
            option.textContent = diag.name;
            treatmentDiagnosisSelect.appendChild(option);
        });

        if (treatment) {
            // Editing existing treatment
            treatmentNameInput.value = treatment.name;
            treatmentDiagnosisSelect.value = treatment.diagnosisId;
            treatmentDoctorInput.value = treatment.doctor;
            treatmentStartDateInput.value = treatment.startDate;
            treatmentDosageInput.value = treatment.dosage;
            treatmentNotesTextarea.value = treatment.notes;
            treatmentIdInput.value = treatment.id; // Set hidden ID for editing
            document.getElementById('treatment-modal-title').textContent = 'Editar Tratamiento';
        } else {
            // Adding new treatment
            treatmentNameInput.value = '';
            treatmentDiagnosisSelect.value = '';
            treatmentDoctorInput.value = '';
            treatmentStartDateInput.value = '';
            treatmentDosageInput.value = '';
            treatmentNotesTextarea.value = '';
            treatmentIdInput.value = ''; // Clear hidden ID for new entry
            document.getElementById('treatment-modal-title').textContent = 'Agregar Nuevo Tratamiento';
        }
    }

    function showTreatmentDetails(id) {
        const treatment = treatmentsData.find(t => t.id === id);
        if (treatment) {
            document.getElementById('detail-treatment-name').textContent = treatment.name;
            document.getElementById('detail-treatment-diagnosis').textContent = treatment.diagnosisName || 'N/A';
            document.getElementById('detail-treatment-doctor').textContent = treatment.doctor;
            document.getElementById('detail-treatment-start-date').textContent = treatment.startDate;
            document.getElementById('detail-treatment-dosage').textContent = treatment.dosage;
            document.getElementById('detail-treatment-notes').textContent = treatment.notes;
            document.getElementById('detail-treatment-adherence').textContent = treatment.adherence;
            document.getElementById('detail-treatment-status').textContent = treatment.status;
            openModal(treatmentDetailsModal);
        } else {
            showNotification('Tratamiento no encontrado.', 'error');
        }
    }

    function showAllTreatmentsModal() {
        const allTreatmentsModal = document.getElementById('all-treatments-modal');
        const treatmentsListModal = allTreatmentsModal.querySelector('.treatments-list-modal');
        treatmentsListModal.innerHTML = ''; // Clear previous content

        if (treatmentsData.length === 0) {
            treatmentsListModal.innerHTML = '<p class="empty-state-text">No hay tratamientos registrados.</p>';
        } else {
            treatmentsData.forEach(treatment => {
                const treatmentItem = document.createElement('div');
                treatmentItem.classList.add('treatment-item-modal');
                treatmentItem.innerHTML = `
                    <h4>${treatment.name}</h4>
                    <p><i class="fas fa-tag"></i> Diagnóstico: ${treatment.diagnosisName || 'N/A'}</p>
                    <p><i class="fas fa-user-md"></i> Médico: ${treatment.doctor}</p>
                    <p><i class="fas fa-calendar-alt"></i> Inicio: ${treatment.startDate}</p>
                    <p><i class="fas fa-pills"></i> Dosis: ${treatment.dosage}</p>
                    <p class="notes">Notas: ${treatment.notes}</p>
                    <p><i class="fas fa-percent"></i> Adherencia: ${treatment.adherence}%</p>
                    <p><i class="fas fa-check-circle"></i> Estado: ${treatment.status}</p>
                `;
                treatmentsListModal.appendChild(treatmentItem);
            });
        }
        openModal(allTreatmentsModal);
    }

    // --- Events Functions ---
    function renderEvents() {
        if (!eventsGrid) return;
        eventsGrid.innerHTML = '';
        if (eventsData.length === 0) {
            eventsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-check"></i>
                    <h4>No hay eventos registrados</h4>
                    <p>Registra un nuevo evento médico para mantener tu historial completo.</p>
                    <button class="primary-button small" id="add-event-empty">
                        <i class="fas fa-plus"></i> Registrar evento
                    </button>
                </div>
            `;
            document.getElementById('add-event-empty').addEventListener('click', () => {
                populateEventModal();
                openModal(eventModal);
            });
        } else {
            eventsData.forEach(event => {
                const card = createEventCard(event);
                eventsGrid.appendChild(card);
            });
        }
    }

    function createEventCard(event) {
        const card = document.createElement('div');
        card.classList.add('event-card');
        card.dataset.eventId = event.id;
        card.innerHTML = `
            <div class="card-header">
                <h4>${event.name}</h4>
                <div class="card-actions">
                    <button class="icon-button view-event-details-btn" data-event-id="${event.id}" title="Más información">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="icon-button edit-event-btn" data-event-id="${event.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-button delete-event-btn" data-event-id="${event.id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="event-meta">
                    <span class="meta-item"><i class="fas fa-calendar-alt"></i> ${event.date}</span>
                    <span class="meta-item"><i class="fas fa-hospital"></i> ${event.hospital}</span>
                </div>
                <div class="event-notes">
                    <p>Médico: ${event.doctor}</p>
                    <p>${event.description}</p>
                </div>
            </div>
        `;

        card.querySelector('.view-event-details-btn').addEventListener('click', () => showEventDetails(event.id));
        card.querySelector('.edit-event-btn').addEventListener('click', () => {
            populateEventModal(event);
            openModal(eventModal);
        });
        card.querySelector('.delete-event-btn').addEventListener('click', () => {
            showConfirmationModal(
                `¿Estás seguro de que deseas eliminar el evento "${event.name}"?`,
                () => { // On confirm
                    eventsData = eventsData.filter(e => e.id !== event.id);
                    renderEvents();
                    showNotification('Evento eliminado correctamente', 'success');
                }
            );
        });
        return card;
    }

    function populateEventModal(event = null) {
        document.getElementById('event-id').value = event ? event.id : '';
        document.getElementById('event-name').value = event ? event.name : '';
        document.getElementById('event-date').value = event ? event.date : '';
        document.getElementById('event-hospital').value = event ? event.hospital : '';
        document.getElementById('event-doctor').value = event ? event.doctor : '';
        document.getElementById('event-description').value = event ? event.description : '';
        document.getElementById('event-modal-title').textContent = event ? 'Editar Evento' : 'Registrar Nuevo Evento';
    }

    function showEventDetails(id) {
        const event = eventsData.find(e => e.id === id);
        if (event) {
            document.getElementById('detail-event-name').textContent = event.name;
            document.getElementById('detail-event-date').textContent = event.date;
            document.getElementById('detail-event-hospital').textContent = event.hospital;
            document.getElementById('detail-event-doctor').textContent = event.doctor;
            document.getElementById('detail-event-description').textContent = event.description;
            openModal(eventDetailsModal);
        } else {
            showNotification('Evento no encontrado.', 'error');
        }
    }

    function showAllEventsModal() {
        const allEventsModal = document.getElementById('all-events-modal');
        const eventListModal = allEventsModal.querySelector('.event-list-modal');
        eventListModal.innerHTML = ''; // Clear previous content

        if (eventsData.length === 0) {
            eventListModal.innerHTML = '<p class="empty-state-text">No hay eventos registrados.</p>';
        } else {
            eventsData.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.classList.add('event-item-modal');
                eventItem.innerHTML = `
                    <h4>${event.name}</h4>
                    <p><i class="fas fa-calendar-alt"></i> Fecha: ${event.date}</p>
                    <p><i class="fas fa-hospital"></i> Hospital: ${event.hospital}</p>
                    <p><i class="fas fa-user-md"></i> Médico: ${event.doctor}</p>
                    <p class="event-description">Descripción: ${event.description}</p>
                `;
                eventListModal.appendChild(eventItem);
            });
        }
        openModal(allEventsModal);
    }

    // --- Documents Functions ---
    function renderDocuments() {
        if (!documentsGrid) return;
        documentsGrid.innerHTML = '';
        if (documentsData.length === 0) {
            documentsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-medical-alt"></i>
                    <h4>No hay documentos subidos</h4>
                    <p>Sube tus documentos médicos para tenerlos siempre a mano.</p>
                    <button class="primary-button small" id="upload-document-empty">
                        <i class="fas fa-upload"></i> Subir documento
                    </button>
                </div>
            `;
            document.getElementById('upload-document-empty').addEventListener('click', () => {
                populateDocumentModal();
                openModal(documentModal);
            });
        } else {
            documentsData.forEach(doc => {
                const card = createDocumentCard(doc);
                documentsGrid.appendChild(card);
            });
        }
    }

    function createDocumentCard(doc) {
        const card = document.createElement('div');
        card.classList.add('document-card');
        card.dataset.documentId = doc.id;
        card.innerHTML = `
            <div class="card-header">
                <h4>${doc.name}</h4>
                <div class="card-actions">
                    <button class="icon-button view-document-details-btn" data-document-id="${doc.id}" title="Más información">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="icon-button edit-document-btn" data-document-id="${doc.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-button delete-document-btn" data-document-id="${doc.id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="document-meta">
                    <span class="meta-item"><i class="fas fa-calendar-alt"></i> ${doc.date}</span>
                    <span class="meta-item"><i class="fas fa-file-alt"></i> Tipo: ${doc.type}</span>
                </div>
                <div class="document-notes">
                    <p>${doc.description}</p>
                </div>
            </div>
        `;

        card.querySelector('.view-document-details-btn').addEventListener('click', () => showDocumentDetails(doc.id));
        card.querySelector('.edit-document-btn').addEventListener('click', () => {
            populateDocumentModal(doc);
            openModal(documentModal);
        });
        card.querySelector('.delete-document-btn').addEventListener('click', () => {
            showConfirmationModal(
                `¿Estás seguro de que deseas eliminar el documento "${doc.name}"?`,
                () => { // On confirm
                    documentsData = documentsData.filter(d => d.id !== doc.id);
                    renderDocuments();
                    showNotification('Documento eliminado correctamente', 'success');
                }
            );
        });
        return card;
    }

    function populateDocumentModal(doc = null) {
        document.getElementById('document-id').value = doc ? doc.id : '';
        document.getElementById('document-name').value = doc ? doc.name : '';
        document.getElementById('document-date').value = doc ? doc.date : '';
        document.getElementById('document-type').value = doc ? doc.type : '';
        document.getElementById('document-description').value = doc ? doc.description : '';
        document.getElementById('document-modal-title').textContent = doc ? 'Editar Documento' : 'Subir Nuevo Documento';
    }

    function showDocumentDetails(id) {
        const doc = documentsData.find(d => d.id === id);
        if (doc) {
            document.getElementById('detail-document-name').textContent = doc.name;
            document.getElementById('detail-document-date').textContent = doc.date;
            document.getElementById('detail-document-type').textContent = doc.type;
            document.getElementById('detail-document-description').textContent = doc.description;
            openModal(documentDetailsModal);
        } else {
            showNotification('Documento no encontrado.', 'error');
        }
    }

    function showAllDocumentsModal() {
        const allDocumentsModal = document.getElementById('all-documents-modal');
        const documentListModal = allDocumentsModal.querySelector('.document-list-modal');
        documentListModal.innerHTML = ''; // Clear previous content

        if (documentsData.length === 0) {
            documentListModal.innerHTML = '<p class="empty-state-text">No hay documentos registrados.</p>';
        } else {
            documentsData.forEach(doc => {
                const docItem = document.createElement('div');
                docItem.classList.add('document-item-modal');
                docItem.innerHTML = `
                    <h4>${doc.name}</h4>
                    <p><i class="fas fa-calendar-alt"></i> Fecha: ${doc.date}</p>
                    <p><i class="fas fa-file-alt"></i> Tipo: ${doc.type}</p>
                    <p class="document-description">Descripción: ${doc.description}</p>
                    <a href="#" class="text-button" onclick="showNotification('Simulando descarga de documento: ${doc.name}.','info'); return false;"><i class="fas fa-download"></i> Descargar</a>
                `;
                documentListModal.appendChild(docItem);
            });
        }
        openModal(allDocumentsModal);
    }

    // --- Custom Confirmation Modal (replaces alert/confirm) ---
    function showConfirmationModal(message, onConfirmCallback) {
        // Create modal elements if they don't exist
        let confirmationModal = document.getElementById('custom-confirmation-modal');
        if (!confirmationModal) {
            confirmationModal = document.createElement('div');
            confirmationModal.id = 'custom-confirmation-modal';
            confirmationModal.classList.add('modal-overlay');
            confirmationModal.innerHTML = `
                <div class="modal-content small-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-question-circle"></i> Confirmación</h3>
                        <button class="close-modal" data-modal-id="custom-confirmation-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p id="confirmation-message"></p>
                    </div>
                    <div class="modal-footer justify-center">
                        <button class="danger-button" id="confirm-action-btn">Confirmar</button>
                        <button class="secondary-button close-modal" data-modal-id="custom-confirmation-modal">Cancelar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(confirmationModal);

            // Add event listeners for the new modal
            confirmationModal.querySelector('.close-modal').addEventListener('click', () => closeModal(confirmationModal));
            confirmationModal.addEventListener('click', (e) => {
                if (e.target === confirmationModal) {
                    closeModal(confirmationModal);
                }
            });
        }

        document.getElementById('confirmation-message').textContent = message;
        
        const confirmBtn = document.getElementById('confirm-action-btn');
        // Remove previous listener to avoid multiple calls
        confirmBtn.onclick = null; 
        confirmBtn.addEventListener('click', () => {
            onConfirmCallback();
            closeModal(confirmationModal);
        });

        openModal(confirmationModal);
    }


    // --- Event Listeners ---

    // Cargar el sidebar
    fetch('sidebar/sidebar.html')
        .then(response => response.text())
        .then(data => {
            if (sidebarContainer) {
                sidebarContainer.innerHTML = data;
                // Marcar como activo el elemento del menú correspondiente
                const currentPage = window.location.pathname.split('/').pop() || 'Inicio.html';
                document.querySelectorAll('#sidebar-container .sidebar-menu a').forEach(link => {
                    if (link.getAttribute('href') === currentPage) {
                        link.parentElement.classList.add('active');
                    }
                });
            }
        })
        .catch(error => console.error('Error loading sidebar:', error));

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            activateTab(this.getAttribute('data-tab'));
        });
    });

    // Event listener for "Agregar diagnóstico" button
    if (addDiagnosisBtn) {
        addDiagnosisBtn.addEventListener('click', () => {
            populateDiagnosisModal();
            openModal(diagnosisModal);
        });
    }

    // Event listeners for closing modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-id');
            closeModal(document.getElementById(modalId));
        });
    });

    // Close modal when clicking outside content
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Handle diagnosis form submission
    if (diagnosisForm) {
        diagnosisForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const diagnosisId = document.getElementById('diagnosis-id').value;
            const newDiagnosisData = {
                name: document.getElementById('diagnosis-name').value,
                date: document.getElementById('diagnosis-date').value,
                doctor: document.getElementById('diagnosis-doctor').value,
                severity: document.getElementById('diagnosis-severity').value,
                notes: document.getElementById('diagnosis-notes').value,
                // Add default/mock values for other fields if not provided by form
                lastReading: 'N/A',
                lastReadingDate: 'N/A',
                adherence: 100,
                nextControl: 'N/A',
                specialist: 'N/A'
            };

            if (diagnosisId) {
                // Edit existing diagnosis
                const index = diagnosticsData.findIndex(d => d.id == diagnosisId);
                if (index !== -1) {
                    diagnosticsData[index] = { ...diagnosticsData[index], ...newDiagnosisData, id: parseInt(diagnosisId) };
                    showNotification(`Diagnóstico "${newDiagnosisData.name}" actualizado correctamente`, 'success');
                }
            } else {
                // Add new diagnosis
                const newId = diagnosticsData.length > 0 ? Math.max(...diagnosticsData.map(d => d.id)) + 1 : 1;
                const finalNewDiagnosis = { id: newId, ...newDiagnosisData };
                diagnosticsData.unshift(finalNewDiagnosis);
                showNotification(`Diagnóstico "${newDiagnosisData.name}" agregado correctamente`, 'success');
            }
            renderDiagnostics();
            renderPatientInfo(); // Update patient stats
            closeModal(diagnosisModal);
            this.reset();
        });
    }

    // Event listener for "Cambiar Paciente" button
    if (changePatientBtn) {
        const changePatientModal = document.createElement('div');
        changePatientModal.classList.add('modal-overlay');
        changePatientModal.id = 'change-patient-modal';
        changePatientModal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" data-modal-id="change-patient-modal">&times;</button>
                <div class="modal-header">
                    <h3><i class="fas fa-exchange-alt"></i> Cambiar Paciente</h3>
                </div>
                <div class="modal-body">
                    <p>Funcionalidad para seleccionar otro paciente (simulado).</p>
                    <button class="primary-button" id="select-other-patient">Seleccionar otro paciente</button>
                </div>
            </div>
        `;
        document.body.appendChild(changePatientModal);
        const selectOtherPatientBtn = document.getElementById('select-other-patient');

        changePatientBtn.addEventListener('click', () => openModal(changePatientModal));
        changePatientModal.querySelector('.close-modal').addEventListener('click', () => closeModal(changePatientModal));
        changePatientModal.addEventListener('click', (e) => {
            if (e.target === changePatientModal) {
                closeModal(changePatientModal);
            }
        });
        if (selectOtherPatientBtn) {
            selectOtherPatientBtn.addEventListener('click', () => {
                showNotification(`Paciente cambiado a (simulado) Nuevo Paciente`, 'info');
                closeModal(changePatientModal);
                currentPatient = { id: 'TEMP-ID', name: 'Nuevo Paciente', age: 30, bloodType: 'O+' }; // Update simulated patient
                renderPatientInfo(); // Re-render patient info with new data
            });
        }
    }

    // --- Treatment Modals and Logic ---
    if (addTreatmentButton) {
        addTreatmentButton.addEventListener('click', () => {
            populateTreatmentModal();
            openModal(treatmentModal);
        });
    }

    if (viewAllTreatmentsButton) {
        viewAllTreatmentsButton.addEventListener('click', showAllTreatmentsModal);
    }

    if (treatmentForm) {
        treatmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const treatmentId = document.getElementById('treatment-id').value;
            const selectedDiagnosisId = document.getElementById('treatment-diagnosis').value;
            const selectedDiagnosisName = document.getElementById('treatment-diagnosis').selectedOptions[0].textContent;

            const newTreatmentData = {
                name: document.getElementById('treatment-name').value,
                diagnosisId: selectedDiagnosisId,
                diagnosisName: selectedDiagnosisName,
                doctor: document.getElementById('treatment-doctor').value,
                startDate: document.getElementById('treatment-start-date').value,
                dosage: document.getElementById('treatment-dosage').value,
                notes: document.getElementById('treatment-notes').value,
                adherence: 100, // Default for new/edited treatments
                status: 'activo' // Default status
            };

            if (treatmentId) {
                // Edit existing treatment
                const index = treatmentsData.findIndex(t => t.id === treatmentId);
                if (index !== -1) {
                    treatmentsData[index] = { ...treatmentsData[index], ...newTreatmentData, id: treatmentId };
                    showNotification(`Tratamiento "${newTreatmentData.name}" actualizado correctamente`, 'success');
                }
            } else {
                // Add new treatment
                const newId = 'T' + nextTreatmentId++;
                const finalNewTreatment = { id: newId, ...newTreatmentData };
                treatmentsData.unshift(finalNewTreatment);
                showNotification(`Tratamiento "${newTreatmentData.name}" agregado correctamente`, 'success');
            }
            renderTreatments();
            renderPatientInfo(); // Update patient stats
            closeModal(treatmentModal);
            this.reset();
        });
    }

    // --- Events Modals and Logic ---
    if (addEventButton) {
        addEventButton.addEventListener('click', () => {
            populateEventModal();
            openModal(eventModal);
        });
    }

    if (viewAllEventsButton) {
        viewAllEventsButton.addEventListener('click', showAllEventsModal);
    }

    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const eventId = document.getElementById('event-id').value;
            const newEventData = {
                name: document.getElementById('event-name').value,
                date: document.getElementById('event-date').value,
                hospital: document.getElementById('event-hospital').value,
                doctor: document.getElementById('event-doctor').value,
                description: document.getElementById('event-description').value,
            };

            if (eventId) {
                // Edit existing event
                const index = eventsData.findIndex(e => e.id === eventId);
                if (index !== -1) {
                    eventsData[index] = { ...eventsData[index], ...newEventData, id: eventId };
                    showNotification(`Evento "${newEventData.name}" actualizado correctamente`, 'success');
                }
            } else {
                // Add new event
                const newId = 'E' + nextEventId++;
                const finalNewEvent = { id: newId, ...newEventData };
                eventsData.unshift(finalNewEvent); // Add to beginning for visibility
                showNotification(`Evento "${newEventData.name}" agregado correctamente`, 'success');
            }
            renderEvents();
            showNotification('Evento agregado correctamente', 'success'); // Consistent notification
            closeModal(eventModal);
            this.reset();
        });
    }

    // --- Documents Modals and Logic ---
    if (uploadDocumentButton) {
        uploadDocumentButton.addEventListener('click', () => {
            populateDocumentModal();
            openModal(documentModal);
        });
    }

    if (viewAllDocumentsButton) {
        viewAllDocumentsButton.addEventListener('click', showAllDocumentsModal);
    }

    if (documentForm) {
        documentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const documentId = document.getElementById('document-id').value;
            const newDocumentData = {
                name: document.getElementById('document-name').value,
                date: document.getElementById('document-date').value,
                type: document.getElementById('document-type').value,
                description: document.getElementById('document-description').value,
            };

            if (documentId) {
                // Edit existing document
                const index = documentsData.findIndex(d => d.id === documentId);
                if (index !== -1) {
                    documentsData[index] = { ...documentsData[index], ...newDocumentData, id: documentId };
                    showNotification(`Documento "${newDocumentData.name}" actualizado correctamente`, 'success');
                }
            } else {
                // Add new document
                const newId = 'D' + nextDocumentId++;
                const finalNewDocument = { id: newId, ...newDocumentData };
                documentsData.unshift(finalNewDocument); // Add to beginning for visibility
                showNotification(`Documento "${newDocumentData.name}" agregado correctamente`, 'success');
            }
            renderDocuments();
            showNotification('Documento agregado correctamente', 'success'); // Consistent notification
            closeModal(documentModal);
            this.reset();
        });
    }


    // --- Initialization ---
    renderPatientInfo(); // Render patient info on load
    activateTab('diagnostics'); // Set initial active tab
});
