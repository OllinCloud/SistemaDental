const SUPABASE_URL = 'https://fipedetstdjgrvalpalh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sadr7pjvHWAM_Bh5HsmEaw_a3pa7qw5';


// ========================================
// SUPABASE
// ========================================

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// SEGURIDAD: ESCAPE DE HTML
// ========================================
// Evita inyección de HTML/JS (XSS) cuando insertamos
// datos que vienen de la base de datos (o de formularios)
// dentro de innerHTML. Todo valor dinámico que se muestre
// como texto debe pasar por esta función.

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return '';
    }

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


// ========================================
// ELEMENTOS DE LA INTERFAZ
// ========================================
// Las referencias del DOM ahora viven en dom-refs.js
// (cargado antes que este archivo en index.html).

// newPatientOrigin ahora vive en new-patient.js (cargado después
// de este archivo). navigation.js sigue asignándole 'dashboard'
// o 'patients' dentro de sus listeners; sigue funcionando porque
// esa asignación es diferida (ocurre al hacer clic, cuando todos
// los scripts ya se cargaron).

// currentTreatmentId ahora vive en treatments.js (cargado después
// de este archivo).

let currentPatientId = null;

// Lista de columnas de "medical_history" reutilizada en varias
// consultas (antes estaba copiada y pegada en 3 lugares distintos).
// Única fuente de verdad: también la usa medical-history.js y
// patients.js (cargados después de este archivo).
const MEDICAL_HISTORY_COLUMNS = `
    allergies,
    allergy_to_anesthetics,
    current_medications,
    medical_conditions,
    hypertension,
    diabetes,
    heart_disease,
    bleeding_disorder,
    pregnancy,
    previous_surgery,
    surgery_details,
    anesthesia_reaction,
    anesthesia_reaction_details,
    smoking,
    alcohol,
    other_conditions,
    notes
`;

// Antes había dos funciones casi idénticas
// (setCurrentDateForClinicalNote y setCurrentDateForTreatment).
// Se fusionaron en una sola función reutilizable que recibe
// el input al que hay que asignarle la fecha de hoy.
// La usan clinical-notes.js y treatments.js (cargados después
// de este archivo).
function setTodayDate(inputElement) {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    inputElement.value = `${year}-${month}-${day}`;
}

// El botón "+ Nueva nota clínica", su cancelación, el guardado del
// formulario (newClinicalNoteForm) y loadClinicalNotes() ahora
// viven en clinical-notes.js (cargado después de este archivo).

// El botón "+ Nuevo tratamiento", su cancelación, el guardado del
// formulario (newTreatmentForm), la edición/eliminación de
// tratamientos (listeners delegados en document), el submit de
// editTreatmentForm, getTreatmentStatusLabel(), formatTreatmentCost(),
// loadTreatments(), loadTreatmentForEdit(), deleteTreatment() y
// loadTreatmentHistory() ahora viven en treatments.js (cargado
// después de este archivo).


// showLogin() y showDashboard() ahora viven en navigation.js
// (cargado antes que este archivo).


// loadProfile() ahora vive en auth.js (cargado después de este archivo).


// loadPatients(), filterPatientCards(), el buscador y la apertura de la
// ficha (.view-patient-button) ahora viven en patients.js (cargado después
// de este archivo).


// loadPatientDetail() y loadPatientEditForm() ahora viven en patients.js.


// loadMedicalHistoryEditForm() ahora vive en medical-history.js.


// loadClinicalNotes() ahora vive en clinical-notes.js.


// El botón "volver a pacientes" y el botón de editar paciente ahora
// viven en patients.js.


// El botón "Editar antecedentes médicos", su cancelación y el submit
// del formulario (editMedicalHistoryForm) ahora viven en
// medical-history.js.


// La edición de datos personales del paciente (submit y cancelar)
// ahora vive en patients.js.


// showView(), setActiveNavItem() y los listeners del sidebar
// (dashboardNavButton, patientsButton, newPatientButton,
// newPatientButtonList) ahora viven en navigation.js.

// closeNewPatientView(), sus listeners de cancelar y el submit del
// formulario (newPatientForm) ahora viven en new-patient.js.


// El listener de backToDashboard ahora vive en navigation.js.


// El login y el cierre de sesión (con su modal de confirmación)
// ahora viven en auth.js (cargado después de este archivo).

// checkSession() y su llamada inicial ahora viven en auth.js
// (cargado después de este archivo).

// showSuccessModal, closeSuccessModal y su listener ahora
// viven en ui-feedback.js (cargado antes que este archivo).

// updateDashboardClock() y su intervalo ahora viven en
// navigation.js (cargado antes que este archivo).
