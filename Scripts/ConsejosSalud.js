document.addEventListener('DOMContentLoaded', () => {
    // --- Modales ---
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });

    modalOverlays.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });

    // --- Pestañas (Sin cambios en la lógica básica) ---
    const tabButtons = document.querySelectorAll('.explore-tips .tab-button');
    const tabContents = document.querySelectorAll('.explore-tips .tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
        });
    });

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons[0].classList.add('active');
        document.querySelector(`.tab-content[data-tab="${tabButtons[0].getAttribute('data-tab')}]`).classList.add('active');
    }

    // --- Notificaciones ---
    const notificationContainer = document.createElement('div');
    notificationContainer.classList.add('notification-container');
    document.body.appendChild(notificationContainer);

    function showNotification(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.textContent = message;
        notificationContainer.appendChild(notification);
        setTimeout(() => notification.classList.remove('notification-fade-out'), 10);
        setTimeout(() => {
            notification.classList.add('notification-fade-out');
            notification.addEventListener('transitionend', () => notification.remove());
        }, duration);
    }

    // --- Funcionalidad de "Ver más" del Consejo (Modal Simple) ---
    const viewTipDetailButtons = document.querySelectorAll('.tip-card .open-modal-btn[data-modal="tip-details-modal"]');
    const tipDetailsModal = document.getElementById('tip-details-modal');
    const tipDetailsContent = tipDetailsModal ? tipDetailsModal.querySelector('.modal-body') : null;
    const closeTipDetailsModalButton = tipDetailsModal ? tipDetailsModal.querySelector('.close-modal-btn') : null;

    if (viewTipDetailButtons && tipDetailsModal && tipDetailsContent && closeTipDetailsModalButton) {
        viewTipDetailButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tipCard = button.closest('.tip-card');
                const tipTitle = tipCard.querySelector('h3').textContent;
                const tipDescription = tipCard.querySelector('h4').textContent + '. ' + tipCard.querySelector('p').textContent;
                const tipId = tipCard.getAttribute('data-tip-id');

                tipDetailsContent.innerHTML = `
                    <h4>${tipTitle}</h4>
                    <p>${tipDescription}</p>
                    <button class="primary-button small open-modal-btn" data-modal="detailed-tip-modal" data-tip-id="${tipId}">Ver detalles completos</button>
                `;
                tipDetailsModal.classList.add('active');
                document.body.classList.add('modal-open');
            });
        });

        closeTipDetailsModalButton.addEventListener('click', () => {
            tipDetailsModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        });

        tipDetailsModal.addEventListener('click', (event) => {
            if (event.target === tipDetailsModal) {
                tipDetailsModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }

    // --- Funcionalidad de "Ver detalles completos" del Consejo (Modal Detallado) ---
    const viewDetailedTipButtons = document.querySelectorAll('.open-modal-btn[data-modal="detailed-tip-modal"]');
    const detailedTipModal = document.getElementById('detailed-tip-modal');
    const detailedTipContent = detailedTipModal ? detailedTipModal.querySelector('.modal-body') : null;
    const closeDetailedTipModalButton = detailedTipModal ? detailedTipModal.querySelector('.close-modal-btn') : null;

    if (viewDetailedTipButtons && detailedTipModal && detailedTipContent && closeDetailedTipModalButton) {
        viewDetailedTipButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tipId = button.getAttribute('data-tip-id');
                // Aquí podrías usar una API gratuita para obtener detalles del consejo basado en el ID
                // Ejemplo usando una API de "consejos" simulada (tendrías que implementarla o encontrar una real)
                fetch(`https://api.example.com/health-tips/${tipId}`) // Reemplaza con una API real si encuentras una
                    .then(response => response.json())
                    .then(tipData => {
                        detailedTipContent.innerHTML = `
                            <div class="detailed-tip-header">
                                <div class="tip-icon-large">
                                    ${tipData.category === 'Actividad física' ? '<i class="fas fa-walking"></i>' : ''}
                                    ${tipData.category === 'Nutrición' ? '<i class="fas fa-apple-alt"></i>' : ''}
                                    ${tipData.category === 'Salud mental' ? '<i class="fas fa-leaf"></i>' : ''}
                                    ${tipData.category === 'Sueño' ? '<i class="fas fa-moon"></i>' : ''}
                                    ${tipData.category === 'Prevención' ? '<i class="fas fa-shield-alt"></i>' : ''}
                                    </div>
                                <div class="tip-header-content">
                                    <h4 id="detailed-tip-title">${tipData.title}</h4>
                                    <div class="tip-meta">
                                        <span class="category"><i class="fas fa-tag"></i> ${tipData.category}</span>
                                        <span class="difficulty"><i class="fas fa-star"></i> ${tipData.difficulty || 'N/A'}</span>
                                        ${tipData.duration ? `<span class="duration"><i class="far fa-clock"></i> ${tipData.duration}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                            <div class="detailed-tip-content">
                                ${tipData.description ? `<div class="tip-description"><h5>Descripción</h5><p>${tipData.description}</p></div>` : ''}
                                ${tipData.benefits ? `<div class="tip-benefits"><h5>Beneficios</h5><ul>${tipData.benefits.map(benefit => `<li><i class="fas fa-check-circle"></i> ${benefit}</li>`).join('')}</ul></div>` : ''}
                                ${tipData.instructions ? `<div class="tip-instructions"><h5>Cómo hacerlo</h5><ol>${tipData.instructions.map(instruction => `<li>${instruction}</li>`).join('')}</ol></div>` : ''}
                                ${tipData.notes ? `<div class="tip-tracking"><h5>Notas</h5><p>${tipData.notes}</p></div>` : ''}
                                <div class="modal-actions">
                                    <button class="primary-button">Guardar consejo</button>
                                    <button class="secondary-button">Compartir</button>
                                </div>
                            </div>
                        `;
                        detailedTipModal.classList.add('active');
                        document.body.classList.add('modal-open');
                    })
                    .catch(error => {
                        console.error("Error al cargar los detalles del consejo:", error);
                        detailedTipContent.innerHTML = "<p>No se pudieron cargar los detalles del consejo.</p>";
                        detailedTipModal.classList.add('active');
                        document.body.classList.add('modal-open');
                    });
            });
        });

        closeDetailedTipModalButton.addEventListener('click', () => {
            detailedTipModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        });

        detailedTipModal.addEventListener('click', (event) => {
            if (event.target === detailedTipModal) {
                detailedTipModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }

    // --- Funcionalidad de los botones de los retos con Notificación ---
    const joinChallengeButtons = document.querySelectorAll('.challenge-card .primary-button');
    joinChallengeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const challengeTitle = button.closest('.challenge-card').querySelector('h3').textContent;
            showNotification(`Te has unido al reto "${challengeTitle}". ¡A por ello!`, 'success');
            // Aquí podrías agregar la lógica real para registrar al usuario en el reto
        });
    });

    // --- Funcionalidad de los botones de los artículos con Notificación ---
    const readArticleButtons = document.querySelectorAll('.article-card .text-button');
    readArticleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const articleTitle = button.closest('.article-card').querySelector('h3').textContent;
            showNotification(`Abriendo el artículo "${articleTitle}". Disfruta la lectura.`, 'info');
            // Aquí podrías agregar la lógica real para navegar al artículo completo
        });
    });
});