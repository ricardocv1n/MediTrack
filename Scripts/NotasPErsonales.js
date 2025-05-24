// Importar módulos de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, getDoc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// Variables globales para Firebase
let app;
let db;
let auth;
let userId = null;
let notesCollectionRef;

// Referencias a elementos del DOM
const notesGrid = document.getElementById('notes-grid-container');
const addNoteForm = document.getElementById('add-note-form');
const noteTitleInput = document.getElementById('note-title');
const noteCategorySelect = document.getElementById('note-category');
const noteDescriptionTextarea = document.getElementById('note-description');
const noteTagsInput = document.getElementById('note-tags-input');
const selectedTagsContainer = document.querySelector('.selected-tags');
const newNoteMoodOptions = document.querySelectorAll('#add-note-form .mood-options input[name="mood"]');
const addNoteButton = document.getElementById('add-new-note-button');
const addNoteModal = document.getElementById('addNoteModal'); // Referencia al modal de agregar nota

const editNoteModal = document.getElementById('editNoteModal');
const editNoteForm = document.getElementById('edit-note-form');
const editNoteIdInput = document.getElementById('edit-note-id');
const editNoteTitleInput = document.getElementById('edit-note-title');
const editNoteCategorySelect = document.getElementById('edit-note-category');
const editNoteDescriptionTextarea = document.getElementById('edit-note-description');
const editNoteTagsInput = document.getElementById('edit-note-tags');
const editTagsListContainer = document.querySelector('.edit-tags-list');
const editNoteMoodOptions = document.querySelectorAll('#editNoteModal .mood-options input[name="edit-mood"]');
const closeModalButtons = document.querySelectorAll('.close-button'); // Botones de cierre para todos los modales

const confirmDeleteModal = document.getElementById('confirmDeleteModal');
const cancelDeleteButton = document.querySelector('.cancel-delete');
const confirmDeleteButton = document.querySelector('.confirm-delete');
let noteToDeleteId = null;

const notificationContainer = document.getElementById('notification-container');

const noteFilterSelect = document.getElementById('note-filter');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Referencias para las estadísticas
const totalNotesSpan = document.getElementById('total-notes-stat');
const thisWeekNotesSpan = document.getElementById('this-week-notes-stat');

let currentNewNoteTags = [];
let currentEditNoteTags = [];
let allNotes = []; // Para almacenar todas las notas y permitir el filtrado/búsqueda en el cliente

// Función para inicializar Firebase
async function initFirebase() {
    try {
        // Las variables globales __firebase_config y __app_id son proporcionadas por el entorno de Canvas
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // Mostrar el ID de usuario en algún lugar de la UI si es necesario para depuración o colaboración
        const userIdDisplay = document.createElement('div');
        userIdDisplay.id = 'userIdDisplay';
        userIdDisplay.className = 'text-xs text-gray-500 mt-2';
        document.querySelector('.main-content').prepend(userIdDisplay); // Añadir al inicio del contenido principal

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                userId = user.uid;
                userIdDisplay.textContent = `User ID: ${userId}`;
                notesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/notes`);
                setupRealtimeListener();
            } else {
                // Si no hay usuario autenticado, intenta iniciar sesión anónimamente
                try {
                    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Error signing in:", error);
                    showNotification('Error al iniciar sesión. Algunas funciones pueden no estar disponibles.', 'error');
                }
            }
        });
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        showNotification('Error al inicializar la aplicación. Por favor, recarga la página.', 'error');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type} animate__animated animate__fadeInRight`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('animate__fadeInRight');
        notification.classList.add('animate__fadeOutRight');
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    }, duration);
}

// Función para abrir modal
function openModal(modalElement) {
    modalElement.classList.remove('fade-out'); // Asegúrate de que no haya animación de salida activa
    modalElement.classList.add('active'); // Esto activará display: flex y la animación fadeIn del CSS
}

// Función para cerrar modal
function closeModal(modalElement) {
    modalElement.classList.add('fade-out'); // Inicia la animación de salida
    modalElement.classList.remove('active'); // Elimina la clase 'active' para que el CSS oculte el modal después de la animación

    // Escucha el final de la animación de salida
    modalElement.addEventListener('animationend', function handler() {
        modalElement.classList.remove('fade-out'); // Limpia la clase de animación de salida
        // El modal volverá a display: none automáticamente porque la clase 'active' fue removida
        modalElement.removeEventListener('animationend', handler); // Elimina el listener para evitar ejecuciones duplicadas
    }, { once: true }); // Asegura que el listener se ejecute solo una vez
}

// Función para renderizar notas
function renderNotes(notesToRender) {
    notesGrid.innerHTML = ''; // Limpiar notas existentes

    if (notesToRender.length === 0) {
        notesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h4>No hay notas para mostrar</h4>
                <p>Parece que aún no has añadido ninguna nota o tu filtro/búsqueda no encontró resultados.</p>
            </div>
        `;
        return;
    }

    // Agrupar notas por fecha
    const groupedNotes = notesToRender.reduce((acc, note) => {
        const date = new Date(note.timestamp.toDate()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(note);
        return acc;
    }, {});

    for (const date in groupedNotes) {
        const timelineDateDiv = document.createElement('div');
        timelineDateDiv.className = 'timeline-date';
        timelineDateDiv.textContent = date;
        notesGrid.appendChild(timelineDateDiv);

        const notesForDateGrid = document.createElement('div');
        notesForDateGrid.className = 'notes-grid'; // Reutilizar la clase notes-grid para las notas de cada día
        notesGrid.appendChild(notesForDateGrid);

        groupedNotes[date].forEach(note => {
            const noteCard = document.createElement('article');
            noteCard.className = `note-card ${note.category}-note`; // Añadir clase de categoría
            noteCard.dataset.noteId = note.id;

            const moodIcons = {
                1: 'fa-grin-hearts',
                2: 'fa-smile',
                3: 'fa-meh',
                4: 'fa-frown',
                5: 'fa-sad-tear'
            };
            const selectedMoodIcon = moodIcons[note.mood] || 'fa-meh'; // Default a meh

            const categoryIcons = {
                'symptom': 'fa-head-side-cough',
                'medication': 'fa-pills',
                'appointment': 'fa-calendar-check',
                'activity': 'fa-walking',
                'diet': 'fa-utensils',
                'other': 'fa-sticky-note'
            };
            const selectedCategoryIcon = categoryIcons[note.category] || 'fa-sticky-note';
            // Usar un mapeo para el texto de la categoría en lugar de depender del select
            const categoryTextMap = {
                'symptom': 'Síntoma',
                'medication': 'Medicación',
                'appointment': 'Cita médica',
                'activity': 'Actividad',
                'diet': 'Dieta',
                'other': 'Otro'
            };
            const categoryText = categoryTextMap[note.category] || 'Otro';


            noteCard.innerHTML = `
                <div class="note-header">
                    <div class="note-icon">
                        <i class="fas ${selectedCategoryIcon}"></i>
                    </div>
                    <div class="note-title-date">
                        <h3>${note.title}</h3>
                        <span class="note-date-time"><i class="fas fa-clock"></i> ${new Date(note.timestamp.toDate()).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span class="note-category">${categoryText}</span>
                </div>
                <div class="note-body">
                    <p>${note.description}</p>
                    <div class="note-tags">
                        ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ${note.mood ? `
                    <div class="note-mood">
                        <span>Estado de ánimo:</span>
                        <div class="mood-ratings">
                            ${[1, 2, 3, 4, 5].map(m => `<i class="fas ${moodIcons[m]} ${note.mood === m ? (m <= 2 ? 'happy' : (m >= 4 ? 'sad' : '')) : ''}"></i>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
                <footer class="note-actions">
                    <button class="action-button favorite-note ${note.isFavorite ? 'active' : ''}" title="Marcar como favorita">
                        <i class="${note.isFavorite ? 'fas' : 'far'} fa-star"></i>
                    </button>
                    <button class="action-button edit-note-btn" data-note-id="${note.id}" title="Editar nota">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-button delete-note-btn" data-note-id="${note.id}" title="Eliminar nota">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </footer>
            `;
            notesForDateGrid.appendChild(noteCard);
        });
    }
}


// Función para añadir una nueva nota
async function addNote(event) {
    event.preventDefault();

    const title = noteTitleInput.value.trim();
    const category = noteCategorySelect.value;
    const description = noteDescriptionTextarea.value.trim();
    const mood = document.querySelector('#add-note-form .mood-options input[name="mood"]:checked')?.value || null;

    if (!title || !category || !description) {
        showNotification('Por favor, completa todos los campos obligatorios.', 'warning');
        return;
    }

    try {
        await addDoc(notesCollectionRef, {
            title,
            category,
            description,
            tags: currentNewNoteTags,
            mood: mood ? parseInt(mood) : null,
            timestamp: new Date(),
            isFavorite: false
        });
        showNotification('Nota añadida correctamente.', 'success');
        addNoteForm.reset();
        currentNewNoteTags = [];
        selectedTagsContainer.innerHTML = '';
        // Resetear el mood a la opción por defecto (meh)
        document.getElementById('mood-3').checked = true;
        closeModal(addNoteModal); // Cerrar el modal después de guardar
    } catch (error) {
        console.error("Error adding document: ", error);
        showNotification('Error al añadir la nota.', 'error');
    }
}

// Función para cargar los datos de una nota en el modal de edición
async function loadNoteForEdit(noteId) {
    try {
        const noteDoc = doc(db, `artifacts/${appId}/users/${userId}/notes`, noteId);
        const noteSnapshot = await getDoc(noteDoc);

        if (noteSnapshot.exists()) {
            const noteData = noteSnapshot.data();
            editNoteIdInput.value = noteId;
            editNoteTitleInput.value = noteData.title;
            editNoteCategorySelect.value = noteData.category;
            editNoteDescriptionTextarea.value = noteData.description;

            // Cargar etiquetas
            currentEditNoteTags = noteData.tags || [];
            displayTags(currentEditNoteTags, true);

            // Cargar estado de ánimo
            editNoteMoodOptions.forEach(radio => {
                if (parseInt(radio.value) === noteData.mood) {
                    radio.checked = true;
                } else {
                    radio.checked = false; // Asegurarse de desmarcar los demás
                }
            });
            if (!noteData.mood) { // Si no hay mood, desmarcar todos
                editNoteMoodOptions.forEach(radio => radio.checked = false);
            }

            openModal(editNoteModal);
        } else {
            showNotification('Nota no encontrada.', 'error');
        }
    } catch (error) {
        console.error("Error loading note for edit: ", error);
        showNotification('Error al cargar la nota para edición.', 'error');
    }
}

// Función para actualizar una nota
async function updateNote(event) {
    event.preventDefault();

    const noteId = editNoteIdInput.value;
    const title = editNoteTitleInput.value.trim();
    const category = editNoteCategorySelect.value;
    const description = editNoteDescriptionTextarea.value.trim();
    const mood = document.querySelector('#edit-note-form .mood-options input[name="edit-mood"]:checked')?.value || null; // Corregido el selector del mood

    if (!title || !category || !description) {
        showNotification('Por favor, completa todos los campos obligatorios.', 'warning');
        return;
    }

    try {
        const noteDocRef = doc(db, `artifacts/${appId}/users/${userId}/notes`, noteId);
        await updateDoc(noteDocRef, {
            title,
            category,
            description,
            tags: currentEditNoteTags,
            mood: mood ? parseInt(mood) : null
        });
        showNotification('Nota actualizada correctamente.', 'success');
        closeModal(editNoteModal);
    } catch (error) {
        console.error("Error updating document: ", error);
        showNotification('Error al actualizar la nota.', 'error');
    }
}

// Función para eliminar una nota
async function deleteNoteConfirmed() {
    if (!noteToDeleteId) return;

    try {
        const noteDocRef = doc(db, `artifacts/${appId}/users/${userId}/notes`, noteToDeleteId);
        await deleteDoc(noteDocRef);
        showNotification('Nota eliminada correctamente.', 'success');
        closeModal(confirmDeleteModal);
        noteToDeleteId = null;
    } catch (error) {
        console.error("Error removing document: ", error);
        showNotification('Error al eliminar la nota.', 'error');
    }
}

// Función para crear un elemento de etiqueta (tag)
function createTagElement(tagText, isEditable = true, isEditModal = false) {
    const tagSpan = document.createElement('span');
    tagSpan.className = 'tag selected-tag';
    tagSpan.textContent = tagText;

    if (isEditable) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-tag-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            if (isEditModal) {
                removeTag(tagText, true);
            } else {
                removeTag(tagText, false);
            }
            tagSpan.remove();
        };
        tagSpan.appendChild(removeBtn);
    }
    return tagSpan;
}

// Función para añadir una etiqueta a la lista de etiquetas de la nota actual
function addTag(tagText, isEditModal = false) {
    const tagsArray = isEditModal ? currentEditNoteTags : currentNewNoteTags;
    const tagsContainer = isEditModal ? editTagsListContainer : selectedTagsContainer;
    const tagsInput = isEditModal ? editNoteTagsInput : noteTagsInput;

    if (tagText && !tagsArray.includes(tagText)) {
        tagsArray.push(tagText);
        tagsContainer.appendChild(createTagElement(tagText, true, isEditModal));
        tagsInput.value = '';
    }
}

// Función para eliminar una etiqueta de la lista de etiquetas de la nota actual
function removeTag(tagText, isEditModal = false) {
    const tagsArray = isEditModal ? currentEditNoteTags : currentNewNoteTags;
    const index = tagsArray.indexOf(tagText);
    if (index > -1) {
        tagsArray.splice(index, 1);
    }
}

// Función para mostrar las etiquetas en la UI
function displayTags(tags, isEditModal = false) {
    const tagsContainer = isEditModal ? editTagsListContainer : selectedTagsContainer;
    tagsContainer.innerHTML = '';
    tags.forEach(tagText => {
        tagsContainer.appendChild(createTagElement(tagText, true, isEditModal));
    });
}

// Función para actualizar el resumen de estadísticas
function updateStatsSummary() {
    const total = allNotes.length;
    totalNotesSpan.innerHTML = `${total} <small>Notas totales</small>`;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const notesThisWeek = allNotes.filter(note => {
        // Asegurarse de que timestamp es un objeto Date
        const noteDate = note.timestamp instanceof Date ? note.timestamp : note.timestamp.toDate();
        return noteDate >= oneWeekAgo;
    }).length;

    thisWeekNotesSpan.innerHTML = `${notesThisWeek} <small>Esta semana</small>`;
}

// Función para aplicar filtros y búsqueda
function applyFiltersAndSearch() {
    let filteredNotes = [...allNotes]; // Trabajar con una copia de todas las notas

    const selectedCategory = noteFilterSelect.value;
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (selectedCategory !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.category === selectedCategory);
    }

    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.description.toLowerCase().includes(searchTerm) ||
            (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm))) // Verificar si tags existe
        );
    }

    // Ordenar por fecha descendente
    filteredNotes.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());

    renderNotes(filteredNotes);
    updateStatsSummary(); // Actualizar las estadísticas después de filtrar
}

// Configurar el listener en tiempo real de Firestore
function setupRealtimeListener() {
    if (!userId) {
        console.warn("User ID not available for Firestore listener.");
        return;
    }

    // Limpiar el listener anterior si existe
    if (notesCollectionRef && notesCollectionRef.unsubscribe) {
        notesCollectionRef.unsubscribe();
    }

    // Consulta con ordenación por timestamp descendente
    const q = query(notesCollectionRef, orderBy('timestamp', 'desc'));

    onSnapshot(q, (snapshot) => {
        allNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Si no hay notas en Firestore, cargar notas de ejemplo
        if (allNotes.length === 0) {
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            const twoDaysAgo = new Date(now);
            twoDaysAgo.setDate(now.getDate() - 2);
            const threeDaysAgo = new Date(now);
            threeDaysAgo.setDate(now.getDate() - 3);

            allNotes = [
                {
                    id: 'sample-note-1',
                    title: 'Dolor de garganta leve',
                    category: 'symptom',
                    description: 'Sentí una ligera molestia al tragar esta mañana. Probablemente por el cambio de clima.',
                    tags: ['garganta', 'molestia', 'clima'],
                    mood: 4, // Frown
                    timestamp: new Date(now.setHours(now.getHours() - 2)), // Hace 2 horas
                    isFavorite: false
                },
                {
                    id: 'sample-note-2',
                    title: 'Recordatorio de vitaminas',
                    category: 'medication',
                    description: 'Tomar la vitamina D y el complejo B después del desayuno. No olvidar el hierro.',
                    tags: ['vitaminas', 'suplementos', 'hierro'],
                    mood: 2, // Smile
                    timestamp: new Date(now.setHours(now.getHours() - 5)), // Hace 5 horas
                    isFavorite: true
                },
                {
                    id: 'sample-note-3',
                    title: 'Caminata en el parque',
                    category: 'activity',
                    description: 'Caminé 45 minutos en el parque. Me sentí con mucha energía y despejé la mente.',
                    tags: ['ejercicio', 'aire libre', 'bienestar'],
                    mood: 1, // Grin hearts
                    timestamp: new Date(yesterday.setHours(10, 0, 0)), // Ayer a las 10:00 AM
                    isFavorite: false
                },
                {
                    id: 'sample-note-4',
                    title: 'Cena ligera',
                    category: 'diet',
                    description: 'Preparé una ensalada con pollo a la parrilla y vegetales. Me sentí ligero después y dormí bien.',
                    tags: ['cena', 'saludable', 'ensalada'],
                    mood: 2, // Smile
                    timestamp: new Date(twoDaysAgo.setHours(20, 30, 0)), // Hace dos días a las 8:30 PM
                    isFavorite: true
                },
                {
                    id: 'sample-note-5',
                    title: 'Registro de ingesta de agua',
                    category: 'diet',
                    description: 'Hoy bebí 2.5 litros de agua. Mi objetivo es 3 litros diarios. Me siento más hidratado.',
                    tags: ['hidratación', 'agua', 'objetivo'],
                    mood: 2, // Smile
                    timestamp: new Date(now.setHours(now.getHours() - 1)), // Hace 1 hora
                    isFavorite: false
                },
                {
                    id: 'sample-note-6',
                    title: 'Sesión de meditación',
                    category: 'activity',
                    description: 'Completé 15 minutos de meditación guiada. Ayudó a reducir el estrés. Intentaré 20 minutos mañana.',
                    tags: ['meditación', 'estrés', 'mindfulness'],
                    mood: 1, // Grin hearts
                    timestamp: new Date(yesterday.setHours(21, 0, 0)), // Ayer a las 9:00 PM
                    isFavorite: false
                }
            ];
        }

        applyFiltersAndSearch(); // Aplicar filtros y búsqueda cada vez que los datos cambian
    }, (error) => {
        console.error("Error getting real-time notes: ", error);
        showNotification('Error al cargar las notas en tiempo real.', 'error');
    });
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Listener para abrir el modal de añadir nueva nota
    if (addNoteButton) {
        addNoteButton.addEventListener('click', () => {
            openModal(addNoteModal);
            addNoteForm.reset(); // Limpiar el formulario al abrir
            currentNewNoteTags = []; // Resetear etiquetas
            selectedTagsContainer.innerHTML = ''; // Limpiar visualización de etiquetas
            document.getElementById('mood-3').checked = true; // Seleccionar mood por defecto
        });
    }

    // Listener para añadir nueva nota
    if (addNoteForm) {
        addNoteForm.addEventListener('submit', addNote);
    }

    // Listener para añadir etiquetas a la nueva nota
    if (noteTagsInput) {
        noteTagsInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && noteTagsInput.value.trim()) {
                e.preventDefault();
                addTag(noteTagsInput.value.trim(), false);
            }
        });
    }

    // Listeners para abrir modal de edición
    notesGrid.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-note-btn');
        if (editBtn) {
            const noteId = editBtn.dataset.noteId;
            loadNoteForEdit(noteId);
        }
    });

    // Listener para actualizar nota
    if (editNoteForm) {
        editNoteForm.addEventListener('submit', updateNote);
    }

    // Listener para añadir etiquetas en el modal de edición
    if (editNoteTagsInput) {
        editNoteTagsInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && editNoteTagsInput.value.trim()) {
                e.preventDefault();
                addTag(editNoteTagsInput.value.trim(), true);
            }
        });
    }

    // Listener para el botón de favorito
    notesGrid.addEventListener('click', async (e) => {
        const favBtn = e.target.closest('.favorite-note');
        if (favBtn) {
            const noteId = favBtn.closest('.note-card').dataset.noteId;
            const noteDocRef = doc(db, `artifacts/${appId}/users/${userId}/notes`, noteId);
            const noteSnapshot = await getDoc(noteDocRef);
            if (noteSnapshot.exists()) {
                const currentFavoriteStatus = noteSnapshot.data().isFavorite || false;
                await updateDoc(noteDocRef, { isFavorite: !currentFavoriteStatus });
                showNotification(`Nota ${!currentFavoriteStatus ? 'marcada como favorita' : 'desmarcada de favoritos'}.`, 'info');
            }
        }
    });

    // Listeners para eliminar nota (abrir modal de confirmación)
    notesGrid.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-note-btn');
        if (deleteBtn) {
            noteToDeleteId = deleteBtn.dataset.noteId;
            openModal(confirmDeleteModal);
        }
    });

    // Listeners para botones del modal de confirmación
    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', () => closeModal(confirmDeleteModal));
    }
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', deleteNoteConfirmed);
    }

    // Listeners para cerrar modales con el botón de cierre (X) y el botón "Cancelar"
    closeModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Listeners para cerrar modales haciendo clic fuera del contenido del modal
    window.addEventListener('click', (e) => {
        if (e.target === addNoteModal) {
            closeModal(addNoteModal);
        }
        if (e.target === editNoteModal) {
            closeModal(editNoteModal);
        }
        if (e.target === confirmDeleteModal) {
            closeModal(confirmDeleteModal);
        }
    });

    // Listeners para filtros y búsqueda
    if (noteFilterSelect) {
        noteFilterSelect.addEventListener('change', applyFiltersAndSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('input', applyFiltersAndSearch);
    }
    if (searchButton) {
        searchButton.addEventListener('click', applyFiltersAndSearch);
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    setupEventListeners();
});
