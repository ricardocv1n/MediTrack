document.addEventListener('DOMContentLoaded', function() {
    // La lógica de carga del sidebar se ha movido a index.html para evitar duplicidad.

    // --- Funcionalidad de Notificaciones ---
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

    // --- Datos de ejemplo para la página de inicio ---
    const healthData = {
        pressure: [
            { date: '2025-05-10', time: '09:00', sys: 120, dia: 80 },
            { date: '2025-05-11', time: '14:30', sys: 122, dia: 81 },
            { date: '2025-05-12', time: '08:15', sys: 118, dia: 78 },
            { date: '2025-05-13', time: '17:00', sys: 125, dia: 85 },
            { date: '2025-05-14', time: '10:00', sys: 120, dia: 80 },
            { date: '2025-05-15', time: '11:45', sys: 128, dia: 82 },
            { date: '2025-05-16', time: '09:30', sys: 120, dia: 80 }
        ],
        adherence: {
            total: 85, // percentage
            taken: 17,
            scheduled: 20,
            details: [
                { name: 'Paracetamol', taken: 5, scheduled: 5, percentage: 100 },
                { name: 'Ibuprofeno', taken: 4, scheduled: 5, percentage: 80 },
                { name: 'Amoxicilina', taken: 8, scheduled: 10, percentage: 80 }
            ]
        },
        upcomingAppointments: [
            {
                id: 'cita1',
                doctor: 'Dra. García',
                specialty: 'Cardiología',
                dateTime: 'Mañana, 15 de Mayo a las 10:30',
                location: 'Hospital Central, Consultorio 402',
                notes: 'Llevar estudios previos.'
            },
            {
                id: 'cita2',
                doctor: 'Dr. Martínez',
                specialty: 'Odontología',
                dateTime: 'Viernes, 18 de Mayo a las 16:15',
                location: 'Clínica Dental Sonrisa, Piso 3',
                notes: 'Revisión anual.'
            }
        ]
    };

    // --- Actualizar tarjeta de presión arterial en el dashboard ---
    function updateBloodPressureCard() {
        const lastReading = healthData.pressure[healthData.pressure.length - 1];
        if (lastReading) {
            // Actualizar el texto de la última medición
            const lastMeasurementP = document.querySelector('.summary-card.blood-pressure .last-measurement');
            if (lastMeasurementP) {
                lastMeasurementP.textContent = `Última: ${lastReading.sys}/${lastReading.dia} mmHg`;
            }

            // Actualizar el estado y el color del círculo
            const statusP = document.querySelector('.summary-card.blood-pressure .status');
            if (statusP) {
                let statusText = 'Normal';
                let statusColor = 'var(--color-success)'; // Usar la variable CSS

                if (lastReading.sys >= 140 || lastReading.dia >= 90) {
                    statusText = 'Elevada';
                    statusColor = 'var(--color-danger)'; // Usar la variable CSS
                } else if (lastReading.sys >= 120 || lastReading.dia >= 80) {
                    statusText = 'Prehipertensión';
                    statusColor = 'var(--color-warning)'; // Usar la variable CSS
                }
                // Actualizar el texto del estado
                statusP.textContent = statusText;
                // Crear o actualizar el icono del círculo
                let circleIcon = statusP.querySelector('.fas.fa-circle');
                if (!circleIcon) {
                    circleIcon = document.createElement('i');
                    circleIcon.classList.add('fas', 'fa-circle');
                    statusP.prepend(circleIcon); // Añadir al principio del párrafo
                }
                circleIcon.style.color = statusColor;
            }
        }
    }
    updateBloodPressureCard(); // Llamar al cargar la página para inicializar

    // --- Inicialización de Chart.js para Presión Arterial (Gráfica principal) ---
    let mainBloodPressureChart; // Variable para mantener la instancia de la gráfica principal

    function initializeMainBloodPressureChart() {
        const bpChartCtx = document.getElementById('healthChart'); // Usar el ID original 'healthChart'
        if (!bpChartCtx) return;

        // Destruir la instancia de la gráfica existente si la hay
        if (mainBloodPressureChart) {
            mainBloodPressureChart.destroy();
        }

        // Preparar las etiquetas y los datos
        // Usaremos las fechas como etiquetas directas ya que no tenemos el adaptador de fechas
        const labels = healthData.pressure.map(p => `${p.date}`); // Solo la fecha
        const systolicData = healthData.pressure.map(p => p.sys);
        const diastolicData = healthData.pressure.map(p => p.dia);

        mainBloodPressureChart = new Chart(bpChartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Sistólica',
                        data: systolicData,
                        borderColor: 'var(--color-primary)', // Color para sistólica
                        backgroundColor: 'rgba(38, 166, 154, 0.2)', // Fondo semitransparente para sistólica
                        fill: false,
                        tension: 0.3,
                        pointRadius: 5, // Aumentar el tamaño de los puntos
                        pointBackgroundColor: 'var(--color-primary)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 7, // Tamaño del punto al pasar el ratón
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'var(--color-primary)',
                        pointHitRadius: 10 // Área de detección del punto
                    },
                    {
                        label: 'Diastólica',
                        data: diastolicData,
                        borderColor: 'var(--color-secondary)', // Color para diastólica
                        backgroundColor: 'rgba(128, 203, 196, 0.2)', // Fondo semitransparente para diastólica
                        fill: false,
                        tension: 0.3,
                        pointRadius: 5, // Aumentar el tamaño de los puntos
                        pointBackgroundColor: 'var(--color-secondary)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 7, // Tamaño del punto al pasar el ratón
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'var(--color-secondary)',
                        pointHitRadius: 10 // Área de detección del punto
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true, // Mostrar leyenda para sistólica y diastólica
                        position: 'top', // Posicionar la leyenda en la parte superior
                        labels: {
                            color: 'var(--color-dark)', // Color del texto de la leyenda
                            font: {
                                size: 14 // Tamaño de fuente de la leyenda
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo del tooltip
                        titleColor: '#fff', // Color del título del tooltip
                        bodyColor: '#fff', // Color del cuerpo del tooltip
                        borderColor: 'var(--color-primary)', // Borde del tooltip
                        borderWidth: 1, // Ancho del borde del tooltip
                        cornerRadius: 4, // Radio de la esquina del tooltip
                        callbacks: {
                            title: function(context) {
                                // Formatear la fecha y hora para el título del tooltip
                                const dataIndex = context[0].dataIndex;
                                const date = healthData.pressure[dataIndex].date;
                                const time = healthData.pressure[dataIndex].time;
                                return `${date} ${time}`;
                            },
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y + ' mmHg';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        // No se usa 'time' type sin el adaptador, solo etiquetas de categoría
                        title: {
                            display: true,
                            text: 'Fecha',
                            color: 'var(--color-dark)', // Color del título del eje
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            color: 'var(--color-gray-dark)' // Color de las etiquetas del eje
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)' // Color de las líneas de la cuadrícula
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Presión Arterial (mmHg)',
                            color: 'var(--color-dark)', // Color del título del eje
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            color: 'var(--color-gray-dark)' // Color de las etiquetas del eje
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)' // Color de las líneas de la cuadrícula
                        }
                    }
                }
            }
        });
    }

    initializeMainBloodPressureChart(); // Llamar para inicializar la gráfica principal al cargar la página

    // --- Event Listeners para Modales y Acciones ---
    document.querySelectorAll('.open-modal-btn').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.dataset.modalId;
            if (modalId === 'modalDetallesDosis') {
                // Llenar datos del modal de detalles de dosis
                document.getElementById('detalleDosisMedicamento').textContent = 'Paracetamol 500mg';
                document.getElementById('detalleDosisHora').textContent = '14:00';
                document.getElementById('detalleDosisInstrucciones').textContent = 'Tomar cada 8 horas con alimentos.';
                document.getElementById('detalleDosisUltimaToma').textContent = '13 de Mayo, 06:00';
            } else if (modalId === 'modalRegistrarDosis') {
                // Llenar datos del modal de registrar dosis
                document.getElementById('medicamentoDosisAtrasada').textContent = 'Ibuprofeno';
                document.getElementById('horaDosisProgramada').textContent = '10:00';
                document.getElementById('horaTomaReal').value = new Date().toTimeString().slice(0, 5); // Hora actual
            } else if (modalId === 'modalRegistrarPresion') {
                // Llenar datos del modal de registrar presión
                const today = new Date().toISOString().slice(0, 10);
                document.getElementById('fechaPresion').value = today;
                document.getElementById('horaPresion').value = new Date().toTimeString().slice(0, 5);
            } else if (modalId === 'modalAnadirSintoma') {
                // Llenar datos del modal de añadir síntoma
                const today = new Date().toISOString().slice(0, 10);
                document.getElementById('fechaSintoma').value = today;
                document.getElementById('horaSintoma').value = new Date().toTimeString().slice(0, 5);
            } else if (modalId === 'modalHistorialPresion') {
                // Renderizar la gráfica y la lista de historial de presión al abrir el modal
                renderPressureHistoryChart();
                renderPressureHistoryList();
            } else if (modalId === 'modalDetallesAdherencia') {
                renderAdherenceDetails();
            } else if (modalId === 'modalRecordatorioCita') {
                const appointmentId = this.dataset.appointmentId;
                const appointment = healthData.upcomingAppointments.find(apt => apt.id === appointmentId);
                if (appointment) {
                    document.getElementById('recordatorioMedico').textContent = appointment.doctor;
                    document.getElementById('recordatorioEspecialidad').textContent = appointment.specialty;
                    document.getElementById('recordatorioFechaHora').textContent = appointment.dateTime;
                    document.getElementById('recordatorioLugar').textContent = appointment.location;
                }
            }
            openModal(modalId);
        });
    });

    document.querySelectorAll('.modal .close, .close-modal-btn').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.dataset.modalId || this.closest('.modal').id;
            closeModal(modalId);
        });
    });

    // --- Funcionalidad específica de los botones del dashboard ---
    document.querySelector('.summary-card.upcoming-dose .confirmar-toma-btn').addEventListener('click', function() {
        mostrarNotificacion('Dosis de Paracetamol 500mg confirmada.', 'success');
        this.textContent = 'Confirmado';
        this.classList.remove('primary-button');
        this.classList.add('secondary-button');
        this.disabled = true;
    });

    document.getElementById('submitRegistrarDosis').addEventListener('click', function(event) {
        event.preventDefault();
        const medicamento = document.getElementById('medicamentoDosisAtrasada').textContent;
        const horaToma = document.getElementById('horaTomaReal').value;
        mostrarNotificacion(`Dosis de ${medicamento} registrada a las ${horaToma}.`, 'success');
        closeModal('modalRegistrarDosis');
    });

    document.getElementById('submitRegistrarPresion').addEventListener('click', function(event) {
        event.preventDefault();
        const sistolica = document.getElementById('sistolica').value;
        const diastolica = document.getElementById('diastolica').value;
        const fecha = document.getElementById('fechaPresion').value;
        const hora = document.getElementById('horaPresion').value;
        mostrarNotificacion(`Presión arterial registrada: ${sistolica}/${diastolica} mmHg el ${fecha} a las ${hora}.`, 'success');
        
        // Agregar la nueva lectura al historial de presión arterial
        healthData.pressure.push({ date: fecha, time: hora, sys: parseInt(sistolica), dia: parseInt(diastolica) });
        
        // Actualizar la tarjeta de presión arterial y la gráfica principal
        updateBloodPressureCard();
        initializeMainBloodPressureChart(); // Re-inicializar la gráfica principal para actualizar sus datos

        // Si el modal de historial de presión está abierto, actualiza las gráficas y la lista
        if (document.getElementById('modalHistorialPresion').classList.contains('show')) {
            renderPressureHistoryChart();
            renderPressureHistoryList();
        }
        closeModal('modalRegistrarPresion');
    });

    document.getElementById('submitAnadirSintoma').addEventListener('click', async function(event) {
        event.preventDefault();
        const nombreSintoma = document.getElementById('nombreSintoma').value;
        const intensidadSintoma = document.getElementById('intensidadSintoma').value;
        const descripcionSintoma = document.getElementById('descripcionSintoma').value;
        const fechaSintoma = document.getElementById('fechaSintoma').value;
        const horaSintoma = document.getElementById('horaSintoma').value;

        if (nombreSintoma) {
            mostrarNotificacion(`Síntoma "${nombreSintoma}" (${intensidadSintoma}) registrado.`, 'success');
            closeModal('modalAnadirSintoma');

            // Abrir modal de análisis de síntoma
            openModal('modalAnalisisSintoma');
            document.getElementById('analisisSintomaNombre').textContent = nombreSintoma;
            document.getElementById('analisisSintomaText').textContent = 'Cargando análisis...';
            document.getElementById('analisisSintomaLoading').classList.remove('hidden');

            try {
                // Llamada a la API de Gemini para generar el análisis del síntoma
                let chatHistory = [];
                chatHistory.push({ role: "user", parts: [{ text: `Genera un breve análisis médico general sobre el síntoma "${nombreSintoma}", su posible intensidad (${intensidadSintoma}), y una descripción como "${descripcionSintoma}". Incluye posibles causas comunes y recomendaciones generales. Limita la respuesta a 150 palabras. No incluyas advertencias sobre buscar ayuda médica profesional, solo información general.` }] });
                const payload = { contents: chatHistory };
                const apiKey = ""; // Dejar vacío para que Canvas lo proporcione
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const analysisText = result.candidates[0].content.parts[0].text;
                    document.getElementById('analisisSintomaText').textContent = analysisText;
                } else {
                    document.getElementById('analisisSintomaText').textContent = 'No se pudo generar el análisis del síntoma en este momento.';
                }
            } catch (error) {
                console.error('Error al llamar a la API de Gemini:', error);
                document.getElementById('analisisSintomaText').textContent = 'Hubo un error al generar el análisis. Por favor, inténtalo de nuevo.';
            } finally {
                document.getElementById('analisisSintomaLoading').classList.add('hidden');
            }
        } else {
            mostrarNotificacion('Por favor, ingresa el nombre del síntoma.', 'warning');
        }
    });

    document.getElementById('confirmarAccionBtn').addEventListener('click', function() {
        // Lógica para confirmar omitir dosis, etc.
        mostrarNotificacion('Acción confirmada.', 'info');
        closeModal('modalConfirmacionOmitirDosis');
    });

    document.getElementById('generateTipBtn').addEventListener('click', async function() {
        const tipElement = document.getElementById('dailyHealthTip');
        const loadingIndicator = document.getElementById('tipLoadingIndicator');
        tipElement.textContent = ''; // Clear previous tip
        loadingIndicator.classList.remove('hidden'); // Show loading indicator

        try {
            // Llamada a la API de Gemini para generar un consejo de salud
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: "Genera un consejo de salud diario breve y motivador. Limita la respuesta a 30 palabras." }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Dejar vacío para que Canvas lo proporcione
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const healthTip = result.candidates[0].content.parts[0].text;
                tipElement.textContent = healthTip;
            } else {
                tipElement.textContent = 'No se pudo generar un consejo en este momento.';
            }
        } catch (error) {
            console.error('Error al llamar a la API de Gemini para el consejo:', error);
            tipElement.textContent = 'Hubo un error al generar el consejo. Por favor, inténtalo de nuevo.';
        } finally {
            loadingIndicator.classList.add('hidden'); // Hide loading indicator
        }
    });

    document.getElementById('submitRegistrarMedicacion').addEventListener('click', function(event) {
        event.preventDefault();
        const nombre = document.getElementById('medicacionNombre').value;
        const dosis = document.getElementById('medicacionDosis').value;
        const frecuencia = document.getElementById('medicacionFrecuencia').value;
        mostrarNotificacion(`Medicación "${nombre}" (${dosis}, ${frecuencia}) registrada.`, 'success');
        closeModal('modalRegistrarMedicacion');
    });

    // --- Funciones para renderizar datos en modales de historial/detalles ---
    let pressureHistoryChartInstance; // Variable para la instancia de la gráfica del modal

    function renderPressureHistoryChart() {
        const pressureChartCtx = document.getElementById('pressureHistoryChart');
        if (!pressureChartCtx) return;

        if (pressureHistoryChartInstance) { // Destroy existing chart instance if it exists
            pressureHistoryChartInstance.destroy();
        }

        // Usaremos las fechas como etiquetas directas ya que no tenemos el adaptador de fechas
        const labels = healthData.pressure.map(p => `${p.date}`);
        const systolicData = healthData.pressure.map(p => p.sys);
        const diastolicData = healthData.pressure.map(p => p.dia);

        pressureHistoryChartInstance = new Chart(pressureChartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Sistólica',
                        data: systolicData,
                        borderColor: 'var(--color-primary)', // Color para sistólica
                        backgroundColor: 'rgba(38, 166, 154, 0.2)', // Fondo semitransparente para sistólica
                        fill: false,
                        tension: 0.1,
                        pointRadius: 5,
                        pointBackgroundColor: 'var(--color-primary)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'var(--color-primary)',
                        pointHitRadius: 10
                    },
                    {
                        label: 'Diastólica',
                        data: diastolicData,
                        borderColor: 'var(--color-secondary)', // Color para diastólica
                        backgroundColor: 'rgba(128, 203, 196, 0.2)', // Fondo semitransparente para diastólica
                        fill: false,
                        tension: 0.1,
                        pointRadius: 5,
                        pointBackgroundColor: 'var(--color-secondary)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'var(--color-secondary)',
                        pointHitRadius: 10
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'var(--color-dark)',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'var(--color-primary)',
                        borderWidth: 1,
                        cornerRadius: 4,
                        callbacks: {
                            title: function(context) {
                                const dataIndex = context[0].dataIndex;
                                const date = healthData.pressure[dataIndex].date;
                                const time = healthData.pressure[dataIndex].time;
                                return `${date} ${time}`;
                            },
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y + ' mmHg';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        // No se usa 'time' type sin el adaptador, solo etiquetas de categoría
                        title: {
                            display: true,
                            text: 'Fecha',
                            color: 'var(--color-dark)',
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            color: 'var(--color-gray-dark)'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Presión Arterial (mmHg)',
                            color: 'var(--color-dark)',
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            color: 'var(--color-gray-dark)'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }

    function renderAdherenceDetails() {
        document.getElementById('adherenciaTotal').textContent = `${healthData.adherence.total}%`;
        // Asegurarse de que el elemento nextSibling exista antes de intentar acceder a textContent
        const adherenceTotalElement = document.getElementById('adherenciaTotal');
        if (adherenceTotalElement && adherenceTotalElement.nextSibling) {
            adherenceTotalElement.nextSibling.textContent = ` (${healthData.adherence.taken} de ${healthData.adherence.scheduled} dosis)`;
        }


        const lista = document.getElementById('listaDetalleAdherencia');
        lista.innerHTML = '';
        healthData.adherence.details.forEach(med => {
            const li = document.createElement('li');
            li.textContent = `${med.name}: ${med.taken}/${med.scheduled} (${med.percentage}%)`;
            lista.appendChild(li);
        });
    }
});

// --- Funcionalidad de Cierre de Sesión ---
document.getElementById('logoutBtn').addEventListener('click', function() {
    // Aquí puedes agregar la lógica para cerrar sesión
    mostrarNotificacion('Sesión cerrada.', 'info');
    // Redirigir a la página de inicio de sesión o realizar otra acción
});

// --- Funcionalidad de Recordatorios ---
document.querySelectorAll('.recordatorio-cita').forEach(recordatorio => {
    recordatorio.addEventListener('click', function() {
        const citaId = this.dataset.citaId;
        const cita = healthData.upcomingAppointments.find(c => c.id === citaId);
        if (cita) {
            document.getElementById('recordatorioMedico').textContent = cita.doctor;
            document.getElementById('recordatorioEspecialidad').textContent = cita.specialty;
            document.getElementById('recordatorioFechaHora').textContent = cita.dateTime;
            document.getElementById('recordatorioLugar').textContent = cita.location;
            openModal('modalRecordatorioCita');
        }
    });
});
