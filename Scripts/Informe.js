// Informe.js - Gestión del informe semanal

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gráficos
    initCharts();
    
    // Configurar eventos
    setupEventListeners();
    
    // Cargar datos del informe
    loadReportData();
});

/**
 * Inicializa los gráficos del informe
 */
function initCharts() {
    // Gráfico de adherencia
    const adherenceCtx = document.getElementById('adherenceChart').getContext('2d');
    const adherenceChart = new Chart(adherenceCtx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Adherencia (%)',
                data: [85, 90, 95, 100, 90, 85, 100],
                backgroundColor: '#26a69a',
                borderColor: '#00796b',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '% de dosis tomadas';
                        }
                    }
                }
            }
        }
    });

    // Gráfico de medicamentos
    const medsCtx = document.getElementById('medicationChart').getContext('2d');
    const medicationChart = new Chart(medsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Paracetamol', 'Ibuprofeno', 'Omeprazol', 'Losartán'],
            datasets: [{
                data: [24, 12, 7, 14],
                backgroundColor: [
                    '#26a69a',
                    '#80cbc4',
                    '#b2dfdb',
                    '#e0f2f1'
                ],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + ' dosis';
                        }
                    }
                },
                datalabels: {
                    display: false
                }
            },
            cutout: '70%'
        },
        plugins: [ChartDataLabels]
    });

    // Guardar referencias a los gráficos
    document.getElementById('adherenceChart')._chart = adherenceChart;
    document.getElementById('medicationChart')._chart = medicationChart;
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Navegación entre semanas
    document.getElementById('prev-week').addEventListener('click', loadPreviousWeek);
    document.getElementById('next-week').addEventListener('click', loadNextWeek);
    
    // Botones de vista de gráficos
    document.querySelectorAll('.chart-action-button').forEach(button => {
        button.addEventListener('click', function() {
            switchChartView(this);
        });
    });
    
    // Botón para añadir evento de salud
    document.getElementById('add-health-event').addEventListener('click', function() {
        document.getElementById('health-event-modal').style.display = 'flex';
    });
    
    // Cerrar modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('health-event-modal').style.display = 'none';
    });
    
    document.querySelector('.close-modal-btn').addEventListener('click', function() {
        document.getElementById('health-event-modal').style.display = 'none';
    });
    
    // Formulario de evento de salud
    document.getElementById('health-event-form').addEventListener('submit', saveHealthEvent);
    
    // Botones de acción del informe
    document.getElementById('print-report').addEventListener('click', printReport);
    document.getElementById('share-report').addEventListener('click', shareReport);
    document.getElementById('download-report').addEventListener('click', downloadReport);
    
    // Botones de recomendaciones
    document.querySelectorAll('.recommendation-card .primary-button').forEach(button => {
        button.addEventListener('click', function() {
            applyRecommendation(this);
        });
    });
}

/**
 * Carga los datos del informe
 */
function loadReportData() {
    // Simulación de carga de datos desde una API
    showLoading();
    
    setTimeout(() => {
        // Aquí iría la lógica para cargar datos reales
        console.log('Datos del informe semanal cargados');
        hideLoading();
    }, 1000);
}

/**
 * Carga la semana anterior
 */
function loadPreviousWeek() {
    showLoading();
    // Simular carga de datos
    setTimeout(() => {
        updateWeekDisplay('Semana del 5 al 11 de Junio 2023');
        hideLoading();
    }, 800);
}

/**
 * Carga la semana siguiente
 */
function loadNextWeek() {
    showLoading();
    // Simular carga de datos
    setTimeout(() => {
        updateWeekDisplay('Semana del 19 al 25 de Junio 2023');
        hideLoading();
    }, 800);
}

/**
 * Actualiza el display de la semana
 */
function updateWeekDisplay(weekText) {
    document.querySelector('.current-period').textContent = weekText;
}

/**
 * Cambia la vista de los gráficos
 */
function switchChartView(button) {
    const container = button.closest('.chart-actions');
    container.querySelectorAll('.chart-action-button').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // Aquí iría la lógica para actualizar los gráficos
    console.log('Cambiando vista a:', button.dataset.period || button.dataset.view);
}

/**
 * Guarda un nuevo evento de salud
 */
function saveHealthEvent(e) {
    e.preventDefault();
    
    const eventType = document.getElementById('event-type').value;
    const eventDate = document.getElementById('event-date').value;
    const eventTime = document.getElementById('event-time').value;
    const eventTitle = document.getElementById('event-title').value;
    const eventDescription = document.getElementById('event-description').value;
    
    if (!eventType || !eventDate || !eventTitle) {
        showNotification('error', '<i class="fas fa-exclamation-circle"></i> Por favor completa los campos requeridos');
        return;
    }
    
    // Aquí iría la lógica para guardar en el servidor
    console.log('Guardando evento:', {
        eventType, eventDate, eventTime, eventTitle, eventDescription
    });
    
    showNotification('success', '<i class="fas fa-check-circle"></i> Evento de salud guardado correctamente');
    document.getElementById('health-event-modal').style.display = 'none';
    document.getElementById('health-event-form').reset();
    
    // Recargar los eventos (en una app real harías una nueva petición)
    setTimeout(() => {
        addNewEventToTimeline({
            date: eventDate,
            title: eventTitle,
            description: eventDescription,
            type: eventType
        });
    }, 500);
}

/**
 * Añade un nuevo evento a la línea de tiempo
 */
function addNewEventToTimeline(event) {
    const dateObj = new Date(event.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('es-ES', { month: 'short' });
    
    const eventTypeMap = {
        'appointment': { icon: 'calendar-alt', text: 'Cita médica' },
        'test': { icon: 'flask', text: 'Prueba médica' },
        'symptom': { icon: 'exclamation-triangle', text: 'Síntoma' },
        'note': { icon: 'sticky-note', text: 'Nota' },
        'medication': { icon: 'pills', text: 'Medicación' },
        'other': { icon: 'calendar-plus', text: 'Evento' }
    };
    
    const typeInfo = eventTypeMap[event.type] || eventTypeMap['other'];
    
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.innerHTML = `
        <div class="timeline-date">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
        </div>
        <div class="timeline-content">
            <h3>${event.title}</h3>
            <p class="event-description">${event.description || 'Sin descripción adicional'}</p>
            <div class="event-meta">
                <span class="event-type"><i class="fas fa-${typeInfo.icon}"></i> ${typeInfo.text}</span>
                ${event.time ? `<span class="event-time"><i class="fas fa-clock"></i> ${event.time}</span>` : ''}
            </div>
        </div>
    `;
    
    const timeline = document.querySelector('.events-timeline');
    timeline.insertBefore(timelineItem, timeline.firstChild);
}

/**
 * Aplica una recomendación
 */
function applyRecommendation(button) {
    const card = button.closest('.recommendation-card');
    const title = card.querySelector('h3').textContent;
    
    showNotification('success', `<i class="fas fa-check"></i> Recomendación "${title}" aplicada`);
    console.log('Aplicando recomendación:', title);
}

/**
 * Imprime el informe
 */
function printReport() {
    showNotification('info', '<i class="fas fa-print"></i> Preparando informe para impresión...');
    console.log('Imprimiendo informe semanal');
    // En una implementación real: window.print();
}

/**
 * Comparte el informe
 */
function shareReport() {
    showNotification('info', '<i class="fas fa-share-alt"></i> Compartiendo informe con tu médico...');
    console.log('Compartiendo informe semanal');
}

/**
 * Descarga el informe como PDF
 */
function downloadReport() {
    showNotification('info', '<i class="fas fa-file-pdf"></i> Generando PDF del informe...');
    
    // Simular generación de PDF
    setTimeout(() => {
        showNotification('success', '<i class="fas fa-download"></i> Informe descargado correctamente');
    }, 2000);
    
    console.log('Descargando informe semanal como PDF');
}

/**
 * Muestra el estado de carga
 */
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    document.body.appendChild(loading);
}

/**
 * Oculta el estado de carga
 */
function hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.remove();
    }
}
     

/**
 * Muestra una notificación
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }, 10);
}

// Inyectar estilos para notificaciones y loading
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
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
    background-color: var(--success-color);
    border-left: 4px solid var(--success-dark);
}

.notification.error {
    background-color: var(--danger-color);
    border-left: 4px solid var(--danger-dark);
}

.notification.info {
    background-color: var(--info-color);
    border-left: 4px solid var(--info-dark);
}

.notification i {
    font-size: 1.2rem;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.loading-overlay i {
    font-size: 3rem;
    color: var(--primary-color);
}
`;
document.head.appendChild(additionalStyles);