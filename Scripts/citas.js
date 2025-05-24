document.addEventListener('DOMContentLoaded', function() {
    // Cargar el sidebar dinámicamente
    // Esta lógica se ejecuta solo una vez cuando el DOM está completamente cargado.
    fetch('sidebar/sidebar.html')
        .then(response => response.text())
        .then(data => {
            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.innerHTML = data; // Usar innerHTML para reemplazar el contenido
                // Marcar como activo el elemento del menú correspondiente
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                document.querySelectorAll('.sidebar-menu a').forEach(link => {
                    if (link.getAttribute('href') === currentPage) {
                        link.parentElement.classList.add('active');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar el sidebar:', error);
        });

    // --- Funcionalidad de Notificaciones (reutilizada de index.js) ---
    function mostrarNotificacion(mensaje, tipo = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${tipo} show`;
        notification.innerHTML = `<i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i> ${mensaje}`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // --- Lógica JavaScript Común para Abrir/Cerrar Modales ---

    // Función para abrir un modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            // Opcional: enfocar el primer elemento interactuable dentro del modal
            const firstFocusableElement = modal.querySelector('input, button, select, textarea');
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        }
    }

    // Función para cerrar un modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    // --- Datos de Citas (ejemplo) ---
    // Esta sería tu fuente de datos real, ya sea desde una API o una base de datos
    let appointmentsData = [
        {
            id: 'upcoming-0',
            title: 'Consulta cardiológica',
            start: '2025-05-22T14:30:00',
            end: '2025-05-22T15:15:00',
            location: 'Centro de Salud Norte, Consultorio 12, Montería, Córdoba', // Added city/state for map
            doctor: 'Dra. García (Cardióloga)',
            notes: 'Llevar resultados de análisis recientes',
            status: 'upcoming'
        },
        {
            id: 'upcoming-1',
            title: 'Análisis de sangre',
            start: '2025-05-23T09:00:00',
            end: '2025-05-23T09:30:00',
            location: 'Laboratorio Central, Calle 29 # 5-10, Montería, Córdoba', // Added specific address for map
            doctor: 'Enf. Ruiz',
            notes: 'Ayunas de 8 horas',
            status: 'upcoming'
        },
        {
            id: 'upcoming-2',
            title: 'Revisión oftalmológica',
            start: '2025-06-10T10:00:00',
            end: '2025-06-10T10:45:00',
            location: 'Clínica Vista, Carrera 4 # 24-50, Montería, Córdoba', // Added specific address for map
            doctor: 'Dr. Martínez (Oftalmólogo)',
            notes: '',
            status: 'upcoming'
        },
        {
            id: 'history-0',
            title: 'Cardiólogo',
            start: '2024-06-05T09:00:00', // Ejemplo de fecha pasada
            end: '2024-06-05T09:45:00',
            location: 'Clínica del Corazón, Avenida Circunvalar # 15-20, Montería, Córdoba',
            doctor: 'Dr. Pérez',
            notes: 'Revisión anual, todo en orden.',
            status: 'completed'
        },
        {
            id: 'history-1',
            title: 'Vacunación',
            start: '2024-05-28T11:00:00',
            end: '2024-05-28T11:30:00',
            location: 'Centro de Vacunación Municipal, Calle 41 # 10-30, Montería, Córdoba',
            doctor: 'Enfermera Ruiz',
            notes: 'Vacuna antigripal.',
            status: 'completed'
        },
        {
            id: 'history-2',
            title: 'Consulta general',
            start: '2024-05-20T16:00:00',
            end: '2024-05-20T16:45:00',
            location: 'Clínica Familiar, Carrera 6 # 60-05, Montería, Córdoba',
            doctor: 'Dr. Gómez',
            notes: 'Cancelada por indisposición del paciente.',
            status: 'canceled'
        },
        {
            id: 'history-3',
            title: 'Análisis de sangre',
            start: '2024-05-15T08:00:00',
            end: '2024-05-15T08:30:00',
            location: 'Laboratorio Central, Calle 29 # 5-10, Montería, Córdoba',
            doctor: 'Laboratorio Central',
            notes: 'Resultados enviados por correo.',
            status: 'completed'
        }
    ];

    // Función para renderizar las tarjetas de citas y la tabla de historial
    function renderAppointments() {
        const upcomingGrid = document.querySelector('.appointments-grid');
        const historyTableBody = document.querySelector('.history-table tbody');

        upcomingGrid.innerHTML = '';
        historyTableBody.innerHTML = '';

        appointmentsData.forEach(appointment => {
            const isUpcoming = new Date(appointment.start) >= new Date();

            if (isUpcoming && appointment.status !== 'canceled') {
                const card = document.createElement('div');
                card.className = `appointment-card ${appointment.status === 'upcoming' ? 'today' : ''}`; // Simplified for now
                card.dataset.appointmentId = appointment.id;
                card.dataset.appointmentType = appointment.title;
                card.dataset.appointmentLocation = appointment.location;
                card.dataset.appointmentDoctor = appointment.doctor;
                card.dataset.appointmentNotes = appointment.notes;

                const startDate = new Date(appointment.start);
                const endDate = new Date(appointment.end);
                const formattedDate = flatpickr.formatDate(startDate, "D d/m"); // Ej: Lun 22/05
                const formattedTime = flatpickr.formatDate(startDate, "H:i") + ' - ' + flatpickr.formatDate(endDate, "H:i");

                let badgeClass = 'badge';
                let badgeText = 'Próxima';
                if (appointment.status === 'urgent') { badgeClass += ' urgent'; badgeText = 'Urgente'; }
                else if (appointment.status === 'reminder') { badgeClass += ' reminder'; badgeText = 'Recordatorio'; }
                else if (appointment.status === 'routine') { badgeClass += ' routine'; badgeText = 'Rutina'; }

                let iconClass = 'fas fa-calendar-day'; // Default icon
                if (appointment.title.toLowerCase().includes('sangre') || appointment.title.toLowerCase().includes('análisis')) {
                    iconClass = 'fas fa-flask';
                } else if (appointment.title.toLowerCase().includes('oftalmológica') || appointment.title.toLowerCase().includes('ojo')) {
                    iconClass = 'fas fa-eye';
                } else if (appointment.title.toLowerCase().includes('vacunación') || appointment.title.toLowerCase().includes('vacuna')) {
                    iconClass = 'fas fa-syringe';
                } else if (appointment.title.toLowerCase().includes('cardio')) {
                    iconClass = 'fas fa-heartbeat';
                } else if (appointment.title.toLowerCase().includes('dental') || appointment.title.toLowerCase().includes('odontología')) {
                    iconClass = 'fas fa-tooth';
                }

                card.innerHTML = `
                    <div class="card-header">
                        <i class="${iconClass}"></i>
                        <span class="${badgeClass}">${badgeText}</span>
                    </div>
                    <div class="card-body">
                        <h3>${appointment.title}</h3>
                        <p class="appointment-date-time" data-date="${flatpickr.formatDate(startDate, "Y-m-d")}" data-time="${flatpickr.formatDate(startDate, "H:i")}">${formattedDate}, ${formattedTime}</p>
                        <p class="appointment-location">${appointment.location}</p>
                        <p class="appointment-doctor">${appointment.doctor}</p>
                        <div class="appointment-notes">
                            <p>${appointment.notes || ''}</p>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="primary-button small confirm-btn">
                            <i class="fas fa-check-circle"></i> Confirmar asistencia
                        </button>
                        <button class="secondary-button small open-modal-btn" data-modal-id="modalRecordatorioCita">
                            <i class="fas fa-bell"></i> Recordatorio
                        </button>
                        <button class="secondary-button small open-modal-btn" data-modal-id="modalComoLlegar">
                            <i class="fas fa-directions"></i> Cómo llegar
                        </button>
                        <button class="secondary-button small open-modal-btn" data-modal-id="modalReprogramarCita">
                            <i class="fas fa-calendar-pen"></i> Reprogramar
                        </button>
                        <button class="danger-button small open-modal-btn" data-modal-id="modalCancelarCitaConfirmacion">
                            <i class="fas fa-calendar-xmark"></i> Cancelar
                        </button>
                    </div>
                `;
                upcomingGrid.appendChild(card);
            } else {
                // Historial de citas
                const row = historyTableBody.insertRow();
                row.dataset.appointmentId = appointment.id;
                row.dataset.date = flatpickr.formatDate(new Date(appointment.start), "d/m/Y");
                row.dataset.type = appointment.title;
                row.dataset.professional = appointment.doctor;
                row.dataset.status = appointment.status;
                row.dataset.location = appointment.location;
                row.dataset.notes = appointment.notes;

                row.innerHTML = `
                    <td data-label="Fecha">${flatpickr.formatDate(new Date(appointment.start), "dd/MM/yyyy")}</td>
                    <td data-label="Tipo">${appointment.title}</td>
                    <td data-label="Profesional">${appointment.doctor}</td>
                    <td data-label="Estado"><span class="status ${appointment.status}">${appointment.status === 'completed' ? 'Completada' : 'Cancelada'}</span></td>
                    <td data-label="Acciones" class="actions-cell">
                        <button class="icon-button details-btn open-modal-btn" data-modal-id="modalDetallesCitaHistorial" title="Ver detalles">
                            <i class="fas fa-info-circle"></i>
                        </button>
                        ${appointment.status === 'completed' && appointment.title.toLowerCase().includes('informe') ? `<button class="icon-button report-btn open-modal-btn" data-modal-id="modalVerInforme" title="Ver informe"><i class="fas fa-file-medical"></i></button>` : ''}
                        ${appointment.status === 'completed' && appointment.title.toLowerCase().includes('vacunación') ? `<button class="icon-button certificate-btn open-modal-btn" data-modal-id="modalVerCertificado" title="Certificado"><i class="fas fa-certificate"></i></button>` : ''}
                        ${appointment.status === 'completed' && appointment.title.toLowerCase().includes('análisis') ? `<button class="icon-button results-btn open-modal-btn" data-modal-id="modalVerResults" title="Ver resultados"><i class="fas fa-chart-line"></i></button>` : ''}
                        ${appointment.status === 'canceled' ? `<button class="icon-button reschedule-btn open-modal-btn" data-modal-id="modalReprogramarCita" title="Reprogramar"><i class="fas fa-calendar-plus"></i></button>` : ''}
                    </td>
                `;
                historyTableBody.appendChild(row);
            }
        });
        attachEventListeners(); // Re-attach event listeners after rendering
    }

    // Función para adjuntar todos los event listeners a los elementos dinámicos
    function attachEventListeners() {
        // Eliminar listeners antiguos para evitar duplicados
        document.querySelectorAll('.open-modal-btn').forEach(button => {
            button.removeEventListener('click', handleOpenModalClick);
        });
        document.querySelectorAll('.modal .close, .close-modal-btn').forEach(button => {
            button.removeEventListener('click', handleCloseModalClick);
        });
        document.querySelectorAll('.appointment-card .confirm-btn').forEach(button => {
            button.removeEventListener('click', handleConfirmAppointment);
        });
        if (document.getElementById('confirmarCancelacionBtn')) {
            document.getElementById('confirmarCancelacionBtn').removeEventListener('click', handleConfirmCancelation);
        }
        if (document.getElementById('new-appointment-form')) {
            document.getElementById('new-appointment-form').removeEventListener('submit', handleNewAppointmentSubmit);
        }
        if (document.getElementById('reprogramar-cita-form')) {
            document.getElementById('reprogramar-cita-form').removeEventListener('submit', handleRescheduleSubmit);
        }

        // Añadir nuevos listeners
        document.querySelectorAll('.open-modal-btn').forEach(button => {
            button.addEventListener('click', handleOpenModalClick);
        });
        document.querySelectorAll('.modal .close, .close-modal-btn').forEach(button => {
            button.addEventListener('click', handleCloseModalClick);
        });
        document.querySelectorAll('.appointment-card .confirm-btn').forEach(button => {
            button.addEventListener('click', handleConfirmAppointment);
        });
        if (document.getElementById('confirmarCancelacionBtn')) {
            document.getElementById('confirmarCancelacionBtn').addEventListener('click', handleConfirmCancelation);
        }
        if (document.getElementById('new-appointment-form')) {
            document.getElementById('new-appointment-form').addEventListener('submit', handleNewAppointmentSubmit);
        }
        if (document.getElementById('reprogramar-cita-form')) {
            document.getElementById('reprogramar-cita-form').addEventListener('submit', handleRescheduleSubmit);
        }
    }

    function handleOpenModalClick(event) {
        event.stopPropagation();
        const modalId = this.dataset.modalId;
        
        if (modalId === 'modalDetallesCitaHistorial') {
            const row = this.closest('tr');
            document.getElementById('historialCitaFecha').textContent = row.dataset.date;
            document.getElementById('historialCitaTipo').textContent = row.dataset.type;
            document.getElementById('historialCitaProfesional').textContent = row.dataset.professional;
            document.getElementById('historialCitaEstado').textContent = row.dataset.status === 'completed' ? 'Completada' : 'Cancelada';
            document.getElementById('historialCitaLugar').textContent = row.dataset.location || 'N/A';
            document.getElementById('historialCitaNotas').textContent = row.dataset.notes || 'No hay notas disponibles para esta cita.';
        } else if (modalId === 'modalReprogramarCita') {
            const card = this.closest('.appointment-card') || this.closest('tr');
            let title = '';
            if (card.classList.contains('appointment-card')) {
                title = card.querySelector('h3').textContent;
            } else {
                title = card.dataset.type + ' con ' + card.dataset.professional;
            }
            document.getElementById('reprogramarCitaTitulo').textContent = title;
            const now = new Date();
            document.getElementById('new-appointment-date').value = flatpickr.formatDate(now, "Y-m-d");
            document.getElementById('new-appointment-time').value = flatpickr.formatDate(now, "H:i");
        } else if (modalId === 'modalCancelarCitaConfirmacion') {
            const card = this.closest('.appointment-card');
            const title = card.querySelector('h3').textContent;
            document.getElementById('cancelarCitaTitulo').textContent = title;
            currentAppointmentCard = card;
        } else if (modalId === 'modalRecordatorioCita') {
            const card = this.closest('.appointment-card');
            document.getElementById('recordatorioTipo').textContent = card.dataset.appointmentType;
            document.getElementById('recordatorioProfesional').textContent = card.dataset.appointmentDoctor;
            const dateTimeText = card.querySelector('.appointment-date-time').textContent;
            const dateMatch = dateTimeText.match(/(\d{2}\/\d{2})/);
            const timeMatch = dateTimeText.match(/(\d{2}:\d{2})/);
            document.getElementById('recordatorioFecha').textContent = dateMatch ? dateMatch[0] : '';
            document.getElementById('recordatorioHora').textContent = timeMatch ? timeMatch[0] : '';
            document.getElementById('recordatorioLugar').textContent = card.dataset.appointmentLocation;
        } else if (modalId === 'modalComoLlegar') {
            const appointmentMapFrame = document.getElementById('appointmentMapFrame');
            const card = this.closest('.appointment-card');
            let locationText = card ? card.dataset.appointmentLocation : 'Montería, Córdoba'; // Default to Montería
            document.getElementById('comoLlegarDireccion').textContent = locationText;
            
            // Construct Google Maps embed URL
            // Using a generic search query for the location to make it dynamic
            const mapQuery = encodeURIComponent(locationText);
            appointmentMapFrame.src = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
        } else if (modalId === 'modalNuevaCita') {
            const now = new Date();
            document.getElementById('appointment-date').value = flatpickr.formatDate(now, "Y-m-d");
            document.getElementById('appointment-time').value = flatpickr.formatDate(now, "H:i");
        } else if (modalId === 'modalVerCalendario') {
            const calendarEl = document.getElementById('fullCalendar');
            // Ensure calendar is re-rendered if it already exists
            if (calendarEl._fullCalendar) { // Check if FullCalendar instance already exists
                calendarEl._fullCalendar.destroy();
            }

            let calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'es', // Configurar idioma a español
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                events: appointmentsData.map(apt => ({
                    id: apt.id,
                    title: apt.title + ' - ' + apt.doctor, // Show doctor in title
                    start: apt.start,
                    end: apt.end,
                    backgroundColor: apt.status === 'canceled' ? '#e57373' : (new Date(apt.start) < new Date() && apt.status !== 'completed' ? '#ffb74d' : '#26a69a'),
                    borderColor: apt.status === 'canceled' ? '#d32f2f' : (new Date(apt.start) < new Date() && apt.status !== 'completed' ? '#fb8c00' : '#00796b'),
                    textColor: 'white',
                    extendedProps: {
                        location: apt.location,
                        doctor: apt.doctor,
                        notes: apt.notes,
                        status: apt.status
                    }
                })),
                eventClick: function(info) {
                    // Optional: display appointment details when clicking on a calendar event
                    const event = info.event;
                    let details = `
                        <strong>Cita:</strong> ${event.title}<br>
                        <strong>Fecha:</strong> ${flatpickr.formatDate(event.start, "d/m/Y H:i")}<br>
                        <strong>Lugar:</strong> ${event.extendedProps.location}<br>
                        <strong>Estado:</strong> ${event.extendedProps.status === 'completed' ? 'Completada' : (event.extendedProps.status === 'canceled' ? 'Cancelada' : 'Próxima')}
                    `;
                    if (event.extendedProps.notes) {
                        details += `<br><strong>Notas:</strong> ${event.extendedProps.notes}`;
                    }
                    mostrarNotificacion(details, 'info');
                }
            });
            calendar.render();
            calendarEl._fullCalendar = calendar; // Store the calendar instance
        }

        openModal(modalId);
    }

    function handleCloseModalClick() {
        const modalId = this.dataset.modalId || this.closest('.modal').id;
        closeModal(modalId);
    }

    function handleConfirmAppointment() {
        const card = this.closest('.appointment-card');
        const title = card.querySelector('h3').textContent;
        mostrarNotificacion(`Asistencia a "${title}" confirmada.`, 'success');
        this.textContent = 'Asistencia Confirmada';
        this.classList.remove('primary-button');
        this.classList.add('secondary-button');
        this.disabled = true;
        // Actualizar el estado en appointmentsData
        const appointmentId = card.dataset.appointmentId;
        const index = appointmentsData.findIndex(apt => apt.id === appointmentId);
        if (index !== -1) {
            appointmentsData[index].status = 'confirmed'; // O un estado adecuado
        }
        renderAppointments(); // Re-renderizar para reflejar cambios
    }

    let currentAppointmentCard = null; // Variable para almacenar la tarjeta de cita seleccionada

    function handleConfirmCancelation() {
        if (currentAppointmentCard) {
            const appointmentId = currentAppointmentCard.dataset.appointmentId;
            const title = currentAppointmentCard.querySelector('h3').textContent;
            
            // Actualizar el estado en appointmentsData
            const index = appointmentsData.findIndex(apt => apt.id === appointmentId);
            if (index !== -1) {
                appointmentsData[index].status = 'canceled';
            }

            mostrarNotificacion(`Cita "${title}" ha sido cancelada.`, 'info');
            closeModal('modalCancelarCitaConfirmacion');
            currentAppointmentCard = null;
            renderAppointments(); // Re-renderizar para reflejar cambios
        } else {
            mostrarNotificacion('No se pudo determinar qué cita cancelar.', 'warning');
        }
    }

    function handleNewAppointmentSubmit(event) {
        event.preventDefault();
        const type = document.getElementById('appointment-type').value;
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;
        const location = document.getElementById('appointment-location').value;
        const professional = document.getElementById('appointment-professional').value;
        const notes = document.getElementById('appointment-notes').value;

        if (type && date && time && location) {
            const newAppointment = {
                id: `new-${Date.now()}`,
                title: type,
                start: `${date}T${time}:00`,
                end: `${date}T${time}:00`, // Asumiendo que la duración se puede calcular o es fija
                location: location,
                doctor: professional || 'N/A',
                notes: notes,
                status: 'upcoming'
            };
            appointmentsData.push(newAppointment);
            appointmentsData.sort((a, b) => new Date(a.start) - new Date(b.start)); // Mantener orden

            mostrarNotificacion(`Nueva cita de ${type} con ${professional || 'N/A'} el ${date} a las ${time} en ${location} agendada.`, 'success');
            closeModal('modalNuevaCita');
            this.reset();
            renderAppointments(); // Re-renderizar para incluir la nueva cita
        } else {
            mostrarNotificacion('Por favor, completa los campos obligatorios para la nueva cita.', 'warning');
        }
    }

    function handleRescheduleSubmit(event) {
        event.preventDefault();
        const newDate = document.getElementById('new-appointment-date').value;
        const newTime = document.getElementById('new-appointment-time').value;
        const notes = document.getElementById('reprogramar-notes').value;
        const originalTitle = document.getElementById('reprogramarCitaTitulo').textContent;

        // Necesitamos saber qué cita estamos reprogramando.
        // Esto requeriría pasar el ID de la cita al modal de reprogramación.
        // Por ahora, solo se mostrará la notificación.
        
        if (newDate && newTime) {
            // Lógica para encontrar y actualizar la cita en appointmentsData
            // Por ejemplo, si tuvieras un ID de la cita en el modal de reprogramar
            // const appointmentToRescheduleId = someElement.dataset.appointmentId;
            // const index = appointmentsData.findIndex(apt => apt.id === appointmentToRescheduleId);
            // if (index !== -1) {
            //     appointmentsData[index].start = `${newDate}T${newTime}:00`;
            //     appointmentsData[index].end = `${newDate}T${newTime}:00`; // Ajustar duración si es necesario
            //     appointmentsData[index].notes = notes;
            //     appointmentsData[index].status = 'upcoming'; // O un estado específico de reprogramada
            // }
            appointmentsData.sort((a, b) => new Date(a.start) - new Date(b.start)); // Mantener orden

            mostrarNotificacion(`Cita "${originalTitle}" reprogramada para el ${newDate} a las ${newTime}.`, 'success');
            closeModal('modalReprogramarCita');
            this.reset();
            renderAppointments(); // Re-renderizar para reflejar cambios
        } else {
            mostrarNotificacion('Por favor, selecciona la nueva fecha y hora para reprogramar.', 'warning');
        }
    }

    // --- Flatpickr Initialization ---
    flatpickr(".datepicker", {
        dateFormat: "Y-m-d",
        locale: "es",
        altInput: true,
        altFormat: "F j, Y",
        allowInput: true
    });

    flatpickr(".timepicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        locale: "es"
    });

    // --- Funcionalidad de filtros (placeholder) ---
    document.getElementById('reset-filters').addEventListener('click', function() {
        document.getElementById('filter-date').value = '';
        document.getElementById('filter-type').value = 'all';
        mostrarNotificacion('Filtros reiniciados.', 'info');
        // Aquí iría la lógica para recargar las citas sin filtros
        renderAppointments();
    });

    // Inicializar la renderización de citas al cargar la página
    renderAppointments();
});
