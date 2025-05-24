document.addEventListener('DOMContentLoaded', () => {
    const editReminderModal = document.getElementById('edit-reminder-modal');
    const deleteReminderModal = document.getElementById('delete-reminder-modal');
    const notificationContainer = document.getElementById('notification-container');
    const remindersGrid = document.querySelector('.reminders-grid');
    const saveNewReminderBtn = document.getElementById('save-new-reminder-btn');
    const saveEditedReminderBtn = document.getElementById('save-edited-reminder-btn');
    const confirmDeleteReminderBtn = document.getElementById('confirm-delete-reminder-btn');
    const newReminderTitleInput = document.getElementById('new-reminder-title');
    const newReminderDescriptionInput = document.getElementById('new-reminder-description');
    const newReminderTimeInput = document.getElementById('new-reminder-time');
    const editReminderTitleInput = document.getElementById('edit-reminder-title');
    const editReminderDescriptionInput = document.getElementById('edit-reminder-description');
    const editReminderTimeInput = document.getElementById('edit-reminder-time');
    const editReminderIdInput = document.getElementById('edit-reminder-id');
    const deleteReminderTitleSpan = document.getElementById('delete-reminder-title');
    const deleteReminderIdInput = document.getElementById('delete-reminder-id');

    let reminders = [ // Simulación de datos de recordatorios
        { id: 1, title: 'Tomar agua', description: 'Recuerda beber un vaso de agua cada 2 horas.', time: '08:00' },
        { id: 2, title: 'Ejercicio suave', description: 'Haz estiramientos a las 10:00 y 16:00.', time: '10:00' },
        { id: 3, title: 'Toma de presión', description: 'Mide tu presión arterial después del desayuno.', time: '09:00' }
    ];

    function renderReminders() {
        remindersGrid.innerHTML = '';
        reminders.forEach(reminder => {
            const reminderCard = document.createElement('div');
            reminderCard.classList.add('reminder-card');
            reminderCard.dataset.reminderId = reminder.id;
            reminderCard.innerHTML = `
                <i class="fas fa-bell"></i>
                <h3>${reminder.title}</h3>
                <p>${reminder.description}</p>
                <div class="reminder-actions">
                    <button class="primary-button small edit-reminder-btn" data-id="${reminder.id}">Editar</button>
                    <button class="secondary-button small delete-reminder-btn" data-id="${reminder.id}">Eliminar</button>
                </div>
            `;
            remindersGrid.appendChild(reminderCard);
        });

        // Agregar event listeners a los botones recién renderizados
        document.querySelectorAll('.edit-reminder-btn').forEach(button => {
            button.addEventListener('click', openEditModal);
        });
        document.querySelectorAll('.delete-reminder-btn').forEach(button => {
            button.addEventListener('click', openDeleteModal);
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.innerHTML = `<div class="notification-message">${message}</div>`;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3500);
    }

    function openModal(modal) {
        modal.classList.add('active');
    }

    function closeModal(modal) {
        modal.classList.remove('active');
    }

    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalId;
            const modal = document.getElementById(modalId);
            closeModal(modal);
        });
    });

    function openEditModal(event) {
        const reminderId = parseInt(event.target.dataset.id);
        const reminderToEdit = reminders.find(r => r.id === reminderId);

        if (reminderToEdit) {
            editReminderTitleInput.value = reminderToEdit.title;
            editReminderDescriptionInput.value = reminderToEdit.description;
            editReminderTimeInput.value = reminderToEdit.time;
            editReminderIdInput.value = reminderId;
            openModal(editReminderModal);
        }
    }

    function openDeleteModal(event) {
        const reminderId = parseInt(event.target.dataset.id);
        const reminderToDelete = reminders.find(r => r.id === reminderId);

        if (reminderToDelete) {
            deleteReminderTitleSpan.textContent = reminderToDelete.title;
            deleteReminderIdInput.value = reminderId;
            openModal(deleteReminderModal);
        }
    }

    saveNewReminderBtn.addEventListener('click', () => {
        const title = newReminderTitleInput.value.trim();
        const description = newReminderDescriptionInput.value.trim();
        const time = newReminderTimeInput.value;

        if (title && description && time) {
            const newId = reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1;
            const newReminder = { id: newId, title, description, time };
            reminders.push(newReminder);
            renderReminders();
            newReminderTitleInput.value = '';
            newReminderDescriptionInput.value = '';
            newReminderTimeInput.value = '';
            showNotification('Recordatorio guardado con éxito', 'success');
        } else {
            showNotification('Por favor, completa todos los campos', 'warning');
        }
    });

    saveEditedReminderBtn.addEventListener('click', () => {
        const idToUpdate = parseInt(editReminderIdInput.value);
        const updatedTitle = editReminderTitleInput.value.trim();
        const updatedDescription = editReminderDescriptionInput.value.trim();
        const updatedTime = editReminderTimeInput.value;

        if (updatedTitle && updatedDescription && updatedTime) {
            reminders = reminders.map(r =>
                r.id === idToUpdate ? { ...r, title: updatedTitle, description: updatedDescription, time: updatedTime } : r
            );
            renderReminders();
            closeModal(editReminderModal);
            showNotification('Recordatorio editado con éxito', 'success');
        } else {
            showNotification('Por favor, completa todos los campos', 'warning');
        }
    });

    confirmDeleteReminderBtn.addEventListener('click', () => {
        const idToDelete = parseInt(deleteReminderIdInput.value);
        reminders = reminders.filter(r => r.id !== idToDelete);
        renderReminders();
        closeModal(deleteReminderModal);
        showNotification('Recordatorio eliminado con éxito', 'success');
    });

    // Inicializar la lista de recordatorios
    renderReminders();
});