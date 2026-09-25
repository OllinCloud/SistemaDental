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

const loginView =
    document.getElementById('loginView');

const dashboardView =
    document.getElementById('dashboardView');

const loginForm =
    document.getElementById('loginForm');

const loginMessage =
    document.getElementById('loginMessage');

const welcomeMessage =
    document.getElementById('welcomeMessage');

const logoutButton =
    document.getElementById('logoutButton');

const patientsView =
    document.getElementById('patientsView');

const patientsButton =
    document.getElementById('patientsButton');

const newPatientButton =
    document.getElementById('newPatientButton');

const newPatientButtonList =
    document.getElementById('newPatientButtonList');

let newPatientOrigin = '';

const backToDashboard =
    document.getElementById('backToDashboard');

const patientsTableBody =
    document.getElementById('patientsTableBody');

const patientsMessage =
    document.getElementById('patientsMessage');

const patientSearch =
    document.getElementById('patientSearch');

const patientDetailView =
    document.getElementById('patientDetailView');

const backToPatientsButton =
    document.querySelector('.fp-back-link');

const editPatientButton =
    document.getElementById('editPatientButton');

const editPatientView =
    document.getElementById('editPatientView');

const newPatientView =
    document.getElementById('newPatientView');

const newClinicalNoteView =
    document.getElementById('newClinicalNoteView');

const newPatientForm =
    document.getElementById('newPatientForm');

const cancelNewPatientButton =
    document.getElementById('cancelNewPatientButton');

const cancelNewPatientButtonBottom =
    document.getElementById('cancelNewPatientButtonBottom');

const newPatientMessage =
    document.getElementById('newPatientMessage');

const patientFullName =
    document.getElementById('fp-nombre-completo');

const detailFirstName =
    document.getElementById('detailFirstName');

const detailLastName =
    document.getElementById('detailLastName');

const detailBirthDate =
    document.getElementById('detailBirthDate');

const detailGender =
    document.getElementById('detailGender');

const detailPhone =
    document.getElementById('detailPhone');

const detailEmail =
    document.getElementById('detailEmail');

const detailAddress =
    document.getElementById('detailAddress');

const detailStatus =
    document.getElementById('fp-estado');

const patientStatusDot =
    document.getElementById('fp-status-dot');

const detailAllergies =
    document.getElementById('detailAllergies');

const detailAllergyAnesthetics =
    document.getElementById('detailAllergyAnesthetics');

const detailMedications =
    document.getElementById('detailMedications');

const detailMedicalConditions =
    document.getElementById('detailMedicalConditions');

const detailHypertension =
    document.getElementById('detailHypertension');

const detailDiabetes =
    document.getElementById('detailDiabetes');

const detailHeartDisease =
    document.getElementById('detailHeartDisease');

const detailBleedingDisorder =
    document.getElementById('detailBleedingDisorder');

const detailPregnancy =
    document.getElementById('detailPregnancy');

const detailPreviousSurgery =
    document.getElementById('detailPreviousSurgery');

const detailAnesthesiaReaction =
    document.getElementById('detailAnesthesiaReaction');

const detailSmoking =
    document.getElementById('detailSmoking');

const detailAlcohol =
    document.getElementById('detailAlcohol');

const detailOtherConditions =
    document.getElementById('detailOtherConditions');

const detailSurgeryDetails =
    document.getElementById('detailSurgeryDetails');

const detailAnesthesiaReactionDetails =
    document.getElementById(
        'detailAnesthesiaReactionDetails'
    );

const detailMedicalNotes =
    document.getElementById('detailMedicalNotes');

const clinicalNotesContainer =
    document.getElementById('clinicalNotesContainer');

const clinicalNotesMessage =
    document.getElementById('clinicalNotesMessage');

const newClinicalNoteButton =
    document.getElementById('newClinicalNoteButton');

const cancelClinicalNoteButton =
    document.getElementById('cancelClinicalNoteButton');

const cancelClinicalNoteButtonBottom =
    document.getElementById('cancelClinicalNoteButtonBottom');

const newClinicalNoteForm =
    document.getElementById('newClinicalNoteForm');

const clinicalNoteDate =
    document.getElementById('clinicalNoteDate');

const newTreatmentButton =
    document.getElementById('newTreatmentButton');

const newTreatmentView =
    document.getElementById('newTreatmentView');

const cancelTreatmentButton =
    document.getElementById('cancelTreatmentButton');

const cancelTreatmentButtonBottom =
    document.getElementById('cancelTreatmentButtonBottom');

const newTreatmentForm =
    document.getElementById('newTreatmentForm');

const treatmentStartDate =
    document.getElementById('treatmentStartDate');

const treatmentsContainer =
    document.getElementById('treatmentsContainer');

const treatmentsMessage =
    document.getElementById('treatmentsMessage');

const editTreatmentView =
    document.getElementById('editTreatmentView');

const editTreatmentForm =
    document.getElementById('editTreatmentForm');

const editTreatmentName =
    document.getElementById('editTreatmentName');

const editTreatmentDescription =
    document.getElementById('editTreatmentDescription');

const editTreatmentStatus =
    document.getElementById('editTreatmentStatus');

const editTreatmentStartDate =
    document.getElementById('editTreatmentStartDate');

const editTreatmentEndDate =
    document.getElementById('editTreatmentEndDate');

const editTreatmentEstimatedCost =
    document.getElementById('editTreatmentEstimatedCost');

const editTreatmentNotes =
    document.getElementById('editTreatmentNotes');

let currentTreatmentId = null;

const patientDetailMessage =
    document.getElementById('patientDetailMessage');

let currentPatientId = null;

// Lista de columnas de "medical_history" reutilizada en varias
// consultas (antes estaba copiada y pegada en 3 lugares distintos).
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
function setTodayDate(inputElement) {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    inputElement.value = `${year}-${month}-${day}`;
}

if (newClinicalNoteButton) {

    newClinicalNoteButton.addEventListener(
        'click',
        function () {

            if (!currentPatientId) {

                console.error(
                    'No existe un paciente seleccionado.'
                );

                return;
            }

            patientDetailView.classList.add('hidden');
            newClinicalNoteView.classList.remove('hidden');

            setTodayDate(clinicalNoteDate);

        }
    );

}

function cancelNewClinicalNote() {

    newClinicalNoteView.classList.add('hidden');
    patientDetailView.classList.remove('hidden');

    newClinicalNoteForm.reset();
}

if (cancelClinicalNoteButton) {

    cancelClinicalNoteButton.addEventListener(
        'click',
        cancelNewClinicalNote
    );

}

if (cancelClinicalNoteButtonBottom) {

    cancelClinicalNoteButtonBottom.addEventListener(
        'click',
        cancelNewClinicalNote
    );

}

if (newClinicalNoteForm) {

    newClinicalNoteForm.addEventListener(
        'submit',
        async function (event) {

            event.preventDefault();

            if (!currentPatientId) {

                console.error(
                    'No existe un paciente seleccionado.'
                );

                return;
            }

            const noteDate =
                document.getElementById('clinicalNoteDate').value;

            const subjective =
                document.getElementById('clinicalNoteSubjective').value.trim();

            const objective =
                document.getElementById('clinicalNoteObjective').value.trim();

            const assessment =
                document.getElementById('clinicalNoteAssessment').value.trim();

            const plan =
                document.getElementById('clinicalNotePlan').value.trim();

            const notes =
                document.getElementById('clinicalNoteNotes').value.trim();


            const { error } = await supabaseClient
                .from('clinical_notes')
                .insert([
                    {
                        patient_id: currentPatientId,
                        note_date: noteDate,
                        subjective: subjective,
                        objective: objective,
                        assessment: assessment,
                        plan: plan,
                        notes: notes
                    }
                ]);


            if (error) {

                console.error(
                    'Error al guardar la nota clínica:',
                    error
                );

                alert(
                    'No fue posible guardar la nota clínica.'
                );

                return;
            }


            newClinicalNoteForm.reset();

            showSuccessModal(
                'Nota clínica guardada',
                'La nueva nota clínica se registró correctamente.'
            );


            newClinicalNoteView.classList.add('hidden');
            patientDetailView.classList.remove('hidden');


            await loadClinicalNotes(currentPatientId);

        }
    );

}

if (newTreatmentButton) {

    newTreatmentButton.addEventListener(
        'click',
        function () {

            if (!currentPatientId) {

                console.error(
                    'No existe un paciente seleccionado.'
                );

                return;
            }

            patientDetailView.classList.add('hidden');
            newTreatmentView.classList.remove('hidden');

            setTodayDate(treatmentStartDate);

        }
    );

}

function cancelNewTreatment() {

    newTreatmentView.classList.add('hidden');
    patientDetailView.classList.remove('hidden');

    newTreatmentForm.reset();
}

if (cancelTreatmentButton) {

    cancelTreatmentButton.addEventListener(
        'click',
        cancelNewTreatment
    );

}

if (cancelTreatmentButtonBottom) {

    cancelTreatmentButtonBottom.addEventListener(
        'click',
        cancelNewTreatment
    );

}


if (newTreatmentForm) {

    newTreatmentForm.addEventListener(
        'submit',
        async function (event) {

            event.preventDefault();

            if (!currentPatientId) {

                console.error(
                    'No existe un paciente seleccionado.'
                );

                return;
            }

            const name =
                document.getElementById('treatmentName').value.trim();

            const description =
                document.getElementById('treatmentDescription').value.trim();

            const status =
                document.getElementById('treatmentStatus').value;

            const startDate =
                document.getElementById('treatmentStartDate').value;

            const endDate =
                document.getElementById('treatmentEndDate').value;

            const estimatedCostValue =
                document.getElementById('treatmentCost').value;

            const notes =
                document.getElementById('treatmentNotes').value.trim();

            const treatmentNameInput =
                document.getElementById('treatmentName');

            const treatmentStartDateInput =
                document.getElementById('treatmentStartDate');

            const treatmentEndDateInput =
                document.getElementById('treatmentEndDate');

            const treatmentCostInput =
                document.getElementById('treatmentCost');


            // ==============================
            // VALIDACIONES
            // ==============================

            if (!name) {

                alert(
                    'El nombre del tratamiento es obligatorio.'
                );

                treatmentNameInput.focus();

                return;
            }


            if (!startDate) {

                alert(
                    'La fecha de inicio es obligatoria.'
                );

                treatmentStartDateInput.focus();

                return;
            }


            if (endDate && endDate < startDate) {

                alert(
                    'La fecha de finalización no puede ser anterior a la fecha de inicio.'
                );

                treatmentEndDateInput.focus();

                return;
            }


            if (estimatedCostValue !== '') {

                const parsedCost =
                    Number(estimatedCostValue);

                if (
                    Number.isNaN(parsedCost) ||
                    parsedCost < 0
                ) {

                    alert(
                        'El costo estimado debe ser un número válido mayor o igual a 0.'
                    );

                    treatmentCostInput.focus();

                    return;
                }
            }


            const estimatedCost =
                estimatedCostValue === ''
                    ? null
                    : Number(estimatedCostValue);


            // ==============================
            // CREAR TRATAMIENTO
            // ==============================

            const {
                data: treatment,
                error: treatmentError
            } = await supabaseClient
                .from('treatments')
                .insert([
                    {
                        patient_id: currentPatientId,
                        name: name,
                        description: description,
                        status: status,
                        start_date: startDate,
                        end_date: endDate || null,
                        estimated_cost: estimatedCost,
                        notes: notes
                    }
                ])
                .select()
                .single();


            if (treatmentError) {

                console.error(
                    'Error al guardar el tratamiento:',
                    treatmentError
                );

                alert(
                    'No fue posible guardar el tratamiento.'
                );

                return;
            }


            // ==============================
            // REGISTRAR HISTORIAL
            // ==============================

            const {
                error: historyError
            } = await supabaseClient
                .from('treatment_history')
                .insert([
                    {
                        treatment_id: treatment.id,
                        event_date: new Date().toISOString(),
                        status: status,
                        description: 'Tratamiento creado.',
                        notes: 'Registro inicial del tratamiento.'
                    }
                ]);


            if (historyError) {

                console.error(
                    'Error al registrar el historial del tratamiento:',
                    historyError
                );

                alert(
                    'El tratamiento se guardó, pero no fue posible registrar su historial.'
                );

                return;
            }


            // ==============================
            // FINALIZAR
            // ==============================

            newTreatmentForm.reset();


            showSuccessModal(
                'Tratamiento guardado',
                'El tratamiento se registró correctamente.'
            );


            newTreatmentView.classList.add('hidden');
            patientDetailView.classList.remove('hidden');


            await loadTreatments(
                currentPatientId
            );

        }
    );

}


// ========================================
// MOSTRAR LOGIN
// ========================================

function showLogin() {

    loginView.classList.remove('hidden');

    dashboardView.classList.add('hidden');

    patientsView.classList.add('hidden');

    patientDetailView.classList.add('hidden');

}


// ========================================
// MOSTRAR DASHBOARD
// ========================================

function showDashboard() {

    loginView.classList.add('hidden');

    dashboardView.classList.remove('hidden');

    setActiveNavItem('dashboardNavItem');

    document.body.classList.add('dashboard-active');

}


// ========================================
// OBTENER PERFIL
// ========================================

async function loadProfile(userId) {

    const { data, error } =
        await supabaseClient
            .from('profiles')
            .select('first_name, last_name, role')
            .eq('id', userId)
            .single();


    if (error) {

        console.error(
            'Error obteniendo perfil:',
            error
        );

        welcomeMessage.textContent =
            'No fue posible cargar el perfil.';

        return;

    }


    welcomeMessage.textContent =
        `Bienvenido, ${data.first_name} ${data.last_name}`;

}


async function loadPatients() {

    patientsMessage.textContent =
        'Cargando pacientes...';

    patientsTableBody.innerHTML = '';

    if (patientSearch) {
        patientSearch.value = '';
    }


    const {
        data,
        error,
        status
    } = await supabaseClient
        .from('patients')
        .select(
            'id, first_name, last_name, phone, email, status'
        )
        .order('last_name', {
            ascending: true
        });



    if (error) {

        patientsMessage.textContent =
            'Error al cargar pacientes.';

        return;
    }


    if (!data || data.length === 0) {

        patientsMessage.textContent =
            'No hay pacientes registrados.';

        return;
    }


    patientsMessage.textContent =
        `${data.length} paciente(s) encontrado(s).`;


    data.forEach(function (patient, index) {

        const card =
            document.createElement('div');

        card.className = 'patient-list-card';

        const initials =
            (
                (patient.first_name ? patient.first_name[0] : '') +
                (patient.last_name ? patient.last_name[0] : '')
            ).toUpperCase();

        const isActive =
            patient.status === 'active';

        card.innerHTML = `
            <div class="patient-list-card-top">

                <div class="patient-avatar-block">

                    <div class="patient-avatar">
                        ${escapeHtml(initials) || '?'}
                    </div>

                    <div>
                        <p class="patient-list-name">
                            ${escapeHtml(patient.first_name)} ${escapeHtml(patient.last_name)}
                        </p>
                    </div>

                </div>

            </div>

            <div class="patient-status-row ${isActive ? '' : 'inactive'}">
                <span class="patient-status-dot"></span>
                ${isActive ? 'Activo' : 'Inactivo'}
            </div>

            <div class="patient-list-divider"></div>

            <div class="patient-list-detail">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.3a16 16 0 0 0 6 6l1.5-1.4a2 2 0 0 1 2.1-.4c1 .4 2 .6 3 .7a2 2 0 0 1 1.4 2.7Z"/></svg>
                <div>
                    <div class="patient-list-detail-label">Teléfono</div>
                    <div class="patient-list-detail-value">${escapeHtml(patient.phone) || 'No registrado'}</div>
                </div>
            </div>

            <div class="patient-list-detail">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
                <div>
                    <div class="patient-list-detail-label">Correo</div>
                    <div class="patient-list-detail-value">${escapeHtml(patient.email) || 'No registrado'}</div>
                </div>
            </div>

            <button
                type="button"
                class="view-patient-button"
                data-patient-id="${escapeHtml(patient.id)}">
                Ver ficha
            </button>
        `;


        patientsTableBody.appendChild(card);

    });


}


// ========================================
// BUSCADOR DE PACIENTES
// ========================================
// Filtra las tarjetas ya renderizadas por nombre o apellido,
// sin volver a consultar Supabase (más rápido, y funciona
// aunque haya poca conexión).

function filterPatientCards() {

    const query =
        patientSearch.value
            .trim()
            .toLowerCase();

    const cards =
        patientsTableBody.querySelectorAll('.patient-list-card');

    let visibleCount = 0;

    cards.forEach(function (card) {

        const nameElement =
            card.querySelector('.patient-list-name');

        const name =
            nameElement
                ? nameElement.textContent.trim().toLowerCase()
                : '';

        const matches =
            query === '' || name.includes(query);

        card.classList.toggle('hidden', !matches);

        if (matches) {
            visibleCount++;
        }
    });

    if (query !== '') {

        patientsMessage.textContent =
            visibleCount > 0
                ? `${visibleCount} paciente(s) encontrado(s) para "${patientSearch.value.trim()}".`
                : `No se encontraron pacientes para "${patientSearch.value.trim()}".`;
    }
}


if (patientSearch) {

    patientSearch.addEventListener(
        'input',
        filterPatientCards
    );

}


document.addEventListener('click', async function (event) {

    const viewPatientButton =
        event.target.closest('.view-patient-button');

    if (!viewPatientButton) {
        return;
    }

    const patientId =
        viewPatientButton.dataset.patientId;

    await loadPatientDetail(patientId);
});


document.addEventListener('click', async function (event) {

    const editTreatmentButton =
        event.target.closest('.edit-treatment-button');

    if (!editTreatmentButton) {
        return;
    }

    const treatmentId =
        editTreatmentButton.dataset.treatmentId;

    await loadTreatmentForEdit(treatmentId);
});


document.addEventListener('click', async function (event) {

    const deleteTreatmentButton =
        event.target.closest('.delete-treatment-button');

    if (!deleteTreatmentButton) {
        return;
    }

    const treatmentId =
        deleteTreatmentButton.dataset.treatmentId;

    const treatmentName =
        deleteTreatmentButton.dataset.treatmentName || 'este tratamiento';

    const confirmed = window.confirm(
        `¿Seguro que deseas eliminar "${treatmentName}"? Esta acción no se puede deshacer y también se eliminará su historial.`
    );

    if (!confirmed) {
        return;
    }

    await deleteTreatment(treatmentId);
});


document
    .getElementById('cancelEditTreatmentButton')
    .addEventListener('click', function () {

        editTreatmentView.classList.add('hidden');
        patientDetailView.classList.remove('hidden');

    });


editTreatmentForm.addEventListener(
    'submit',
    async function (event) {

        event.preventDefault();

        if (!currentTreatmentId) {

            console.error(
                'No hay un tratamiento seleccionado.'
            );

            return;
        }


        // ==============================
        // VALIDACIONES
        // ==============================

        const name =
            editTreatmentName.value.trim();

        const description =
            editTreatmentDescription.value.trim();

        const status =
            editTreatmentStatus.value;

        const startDate =
            editTreatmentStartDate.value;

        const endDate =
            editTreatmentEndDate.value;

        const estimatedCostValue =
            editTreatmentEstimatedCost.value;

        const notes =
            editTreatmentNotes.value.trim();


        if (!name) {

            alert(
                'El nombre del tratamiento es obligatorio.'
            );

            editTreatmentName.focus();

            return;
        }


        if (!startDate) {

            alert(
                'La fecha de inicio es obligatoria.'
            );

            editTreatmentStartDate.focus();

            return;
        }


        if (endDate && endDate < startDate) {

            alert(
                'La fecha de finalización no puede ser anterior a la fecha de inicio.'
            );

            editTreatmentEndDate.focus();

            return;
        }


        if (estimatedCostValue !== '') {

            const parsedCost =
                Number(estimatedCostValue);

            if (
                Number.isNaN(parsedCost) ||
                parsedCost < 0
            ) {

                alert(
                    'El costo estimado debe ser un número válido mayor o igual a 0.'
                );

                editTreatmentEstimatedCost.focus();

                return;
            }
        }


        const estimatedCost =
            estimatedCostValue === ''
                ? null
                : Number(estimatedCostValue);


        // ==============================
        // OBTENER DATOS ACTUALES
        // ==============================

        const {
            data: currentTreatment,
            error: currentTreatmentError
        } = await supabaseClient
            .from('treatments')
            .select(`
                id,
                name,
                description,
                status,
                start_date,
                end_date,
                estimated_cost,
                notes
            `)
            .eq(
                'id',
                currentTreatmentId
            )
            .single();


        if (currentTreatmentError) {

            console.error(
                'Error al obtener el tratamiento actual:',
                currentTreatmentError
            );

            alert(
                'No fue posible obtener la información actual del tratamiento.'
            );

            return;
        }


        if (!currentTreatment) {

            alert(
                'No se encontró el tratamiento.'
            );

            return;
        }


        // ==============================
        // DETECTAR CAMBIOS
        // ==============================

        const changes = [];


        if (
            (currentTreatment.name || '') !== name
        ) {

            changes.push(
                `Nombre cambiado de "${currentTreatment.name || '(vacío)'}" a "${name}".`
            );
        }


        if (
            (currentTreatment.description || '') !== description
        ) {

            changes.push(
                'Descripción del tratamiento modificada.'
            );
        }


        if (
            currentTreatment.status !== status
        ) {

            changes.push(
                `Estado cambiado de "${getTreatmentStatusLabel(currentTreatment.status)}" a "${getTreatmentStatusLabel(status)}".`
            );
        }


        if (
            (currentTreatment.start_date || '') !== startDate
        ) {

            changes.push(
                `Fecha de inicio cambiada de "${currentTreatment.start_date || '(vacía)'}" a "${startDate}".`
            );
        }


        if (
            (currentTreatment.end_date || '') !== (endDate || '')
        ) {

            changes.push(
                `Fecha de finalización cambiada de "${currentTreatment.end_date || '(vacía)'}" a "${endDate || '(vacía)'}".`
            );
        }


        const currentCost =
            currentTreatment.estimated_cost !== null &&
            currentTreatment.estimated_cost !== undefined
                ? Number(currentTreatment.estimated_cost)
                : null;


        if (currentCost !== estimatedCost) {

            changes.push(
                `Costo estimado cambiado de "${formatTreatmentCost(currentCost)}" a "${formatTreatmentCost(estimatedCost)}".`
            );
        }


        if (
            (currentTreatment.notes || '') !== notes
        ) {

            changes.push(
                'Observaciones modificadas.'
            );
        }


        // ==============================
        // NO HAY CAMBIOS
        // ==============================

        if (changes.length === 0) {

            alert(
                'No se detectaron cambios en el tratamiento.'
            );

            return;
        }


        // ==============================
        // ACTUALIZAR TRATAMIENTO
        // ==============================

        const {
            error: updateError
        } = await supabaseClient
            .from('treatments')
            .update({
                name:
                    name,

                description:
                    description,

                status:
                    status,

                start_date:
                    startDate,

                end_date:
                    endDate || null,

                estimated_cost:
                    estimatedCost,

                notes:
                    notes
            })
            .eq(
                'id',
                currentTreatmentId
            );


        if (updateError) {

            console.error(
                'Error al actualizar el tratamiento:',
                updateError
            );

            alert(
                'No fue posible actualizar el tratamiento.'
            );

            return;
        }


        // ==============================
        // REGISTRAR HISTORIAL
        // ==============================

        const {
            error: historyError
        } = await supabaseClient
            .from('treatment_history')
            .insert([
                {
                    treatment_id:
                        currentTreatmentId,

                    event_date:
                        new Date().toISOString(),

                    status:
                        status,

                    description:
                        'Tratamiento actualizado.',

                    notes:
                        changes.join('\n')
                }
            ]);


        if (historyError) {

            console.error(
                'Error al registrar el historial:',
                historyError
            );

            alert(
                'El tratamiento se actualizó, pero no fue posible registrar su historial.'
            );

            return;
        }


        // ==============================
        // FINALIZAR
        // ==============================

        showSuccessModal(
            'Tratamiento actualizado',
            'Los cambios del tratamiento se guardaron correctamente.'
        );


        editTreatmentView.classList.add('hidden');
        patientDetailView.classList.remove('hidden');


        await loadTreatments(
            currentPatientId
        );

    }
);


function getTreatmentStatusLabel(status) {

    const labels = {
        planned: 'Planeado',
        in_progress: 'En progreso',
        completed: 'Completado',
        cancelled: 'Cancelado'
    };

    return labels[status] || status || '(vacío)';
}


function formatTreatmentCost(cost) {

    if (cost === null || cost === undefined) {
        return '(vacío)';
    }

    return `$${Number(cost).toFixed(2)}`;
}


async function loadPatientDetail(patientId) {

    if (!patientId) {

        patientDetailMessage.textContent =
            'No se encontró el identificador del paciente.';

        return;
    }

    currentPatientId = patientId;

    patientsView.classList.add('hidden');

    patientDetailView.classList.remove('hidden');
    window.scrollTo({
    top: 0,
    behavior: 'instant'
});

    patientDetailMessage.textContent =
        'Cargando información del paciente...';

    const {
        data,
        error
    } = await supabaseClient
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

    if (error) {

        patientDetailMessage.textContent =
            'No fue posible cargar la información del paciente.';

        console.error(error);

        return;
    }

    const {
        data: medicalHistory,
        error: medicalHistoryError
    } = await supabaseClient
        .from('medical_history')
        .select(MEDICAL_HISTORY_COLUMNS)
        .eq('patient_id', patientId)
        .maybeSingle();

    if (medicalHistory) {

        detailAllergies.textContent =
            medicalHistory.allergies || 'No registrado';

        detailAllergyAnesthetics.textContent =
            medicalHistory.allergy_to_anesthetics
                ? 'Sí'
                : 'No';

        detailMedications.textContent =
            medicalHistory.current_medications ||
            'No registrado';

        detailMedicalConditions.textContent =
            medicalHistory.medical_conditions ||
            'No registrado';

        detailHypertension.textContent =
            medicalHistory.hypertension
                ? 'Sí'
                : 'No';

        detailDiabetes.textContent =
            medicalHistory.diabetes
                ? 'Sí'
                : 'No';

        detailHeartDisease.textContent =
            medicalHistory.heart_disease
                ? 'Sí'
                : 'No';

        detailBleedingDisorder.textContent =
            medicalHistory.bleeding_disorder
                ? 'Sí'
                : 'No';

        detailPregnancy.textContent =
            medicalHistory.pregnancy
                ? 'Sí'
                : 'No';

        detailPreviousSurgery.textContent =
            medicalHistory.previous_surgery
                ? 'Sí'
                : 'No';

        detailAnesthesiaReaction.textContent =
            medicalHistory.anesthesia_reaction
                ? 'Sí'
                : 'No';

        detailSmoking.textContent =
            medicalHistory.smoking
                ? 'Sí'
                : 'No';

        detailAlcohol.textContent =
            medicalHistory.alcohol
                ? 'Sí'
                : 'No';

        detailOtherConditions.textContent =
            medicalHistory.other_conditions ||
            'No registrado';

        detailSurgeryDetails.textContent =
            medicalHistory.surgery_details ||
            'No registrado';

        detailAnesthesiaReactionDetails.textContent =
            medicalHistory.anesthesia_reaction_details ||
            'No registrado';

        detailMedicalNotes.textContent =
            medicalHistory.notes ||
            'No registrado';

    } else {

    }

    detailFirstName.textContent =
        data.first_name || 'No registrado';

    detailLastName.textContent =
        data.last_name || 'No registrado';

    detailBirthDate.textContent =
        data.birth_date || data.date_of_birth || 'No registrada';

    detailGender.textContent =
        data.gender || 'No registrado';

    detailPhone.textContent =
        data.phone || 'No registrado';

    detailEmail.textContent =
        data.email || 'No registrado';

    detailAddress.textContent =
        data.address || data.street_address || 'No registrada';

    if (detailStatus) {
        const isActive = data.status === 'active';

        detailStatus.textContent = isActive ? 'Activo' : 'Inactivo';

        if (patientStatusDot) {
            patientStatusDot.classList.toggle('fp-dot-activo', isActive);
            patientStatusDot.classList.toggle('fp-dot-inactivo', !isActive);
        }
    }

    if (patientFullName) {
        patientFullName.textContent =
            `${data.first_name} ${data.last_name}`;
    }

    patientDetailMessage.textContent = '';

    patientsView.classList.add('hidden');

    patientDetailView.classList.remove('hidden');

    await loadClinicalNotes(patientId);

    await loadTreatments(patientId);
}


async function loadPatientEditForm(patientId) {

    const { data, error } = await supabaseClient
        .from('patients')
        .select(`
            id,
            first_name,
            last_name,
            birth_date,
            gender,
            phone,
            email,
            address,
            emergency_contact,
            emergency_phone,
            status
        `)
        .eq('id', patientId)
        .single();

    if (error) {
        console.error('Error al cargar paciente:', error);
        return;
    }

    document.getElementById('editFirstName').value =
        data.first_name || '';

    document.getElementById('editLastName').value =
        data.last_name || '';

    document.getElementById('editBirthDate').value =
        data.birth_date || '';

    const genderMap = {
        male: 'M',
        female: 'F',
        other: 'O',
        M: 'M',
        F: 'F',
        O: 'O'
    };

    document.getElementById('editGender').value =
        genderMap[data.gender] || '';

    document.getElementById('editPhone').value =
        data.phone || '';

    document.getElementById('editEmail').value =
        data.email || '';

    document.getElementById('editAddress').value =
        data.address || '';

    document.getElementById('editEmergencyContact').value =
        data.emergency_contact || '';

    document.getElementById('editEmergencyPhone').value =
        data.emergency_phone || '';

    document.getElementById('editStatus').value =
        data.status || 'active';
}


async function loadMedicalHistoryEditForm(patientId) {

    const { data, error } = await supabaseClient
        .from('medical_history')
        .select(MEDICAL_HISTORY_COLUMNS)
        .eq('patient_id', patientId)
        .maybeSingle();

    if (error) {
        console.error(
            'Error al cargar antecedentes médicos:',
            error
        );
        return;
    }

    if (!data) {
        return;
    }

    document.getElementById('editAllergies').value =
        data.allergies || '';

    document.getElementById('editCurrentMedications').value =
        data.current_medications || '';

    document.getElementById('editMedicalConditions').value =
        data.medical_conditions || '';

    document.getElementById('editOtherConditions').value =
        data.other_conditions || '';

    document.getElementById('editAllergyToAnesthetics').checked =
        data.allergy_to_anesthetics || false;

    document.getElementById('editHypertension').checked =
        data.hypertension || false;

    document.getElementById('editDiabetes').checked =
        data.diabetes || false;

    document.getElementById('editHeartDisease').checked =
        data.heart_disease || false;

    document.getElementById('editBleedingDisorder').checked =
        data.bleeding_disorder || false;

    document.getElementById('editPregnancy').checked =
        data.pregnancy || false;

    document.getElementById('editPreviousSurgery').checked =
        data.previous_surgery || false;

    document.getElementById('editAnesthesiaReaction').checked =
        data.anesthesia_reaction || false;

    document.getElementById('editSmoking').checked =
        data.smoking || false;

    document.getElementById('editAlcohol').checked =
        data.alcohol || false;

    document.getElementById('editSurgeryDetails').value =
        data.surgery_details || '';

    document.getElementById('editAnesthesiaReactionDetails').value =
        data.anesthesia_reaction_details || '';

    document.getElementById('editMedicalNotes').value =
        data.notes || '';
}


async function loadClinicalNotes(patientId) {

    clinicalNotesMessage.textContent =
        'Cargando notas clínicas...';

    clinicalNotesContainer
        .querySelectorAll('.clinical-note')
        .forEach(function (noteElement) {
            noteElement.remove();
        });

    const {
        data,
        error
    } = await supabaseClient
        .from('clinical_notes')
        .select(`
            id,
            note_date,
            subjective,
            objective,
            assessment,
            plan,
            notes
        `)
        .eq('patient_id', patientId)
        .order('note_date', {
            ascending: false
        });

    if (error) {

        clinicalNotesMessage.textContent =
            'No fue posible cargar las notas clínicas.';

        console.error(error);

        return;
    }

    if (!data || data.length === 0) {

        clinicalNotesMessage.textContent =
            'No hay notas clínicas registradas.';

        return;
    }

    clinicalNotesMessage.textContent =
        `${data.length} nota(s) clínica(s) encontrada(s).`;

    data.forEach(function (note) {

        const noteElement =
            document.createElement('div');

        noteElement.classList.add(
            'clinical-note'
        );

        const date =
            new Date(note.note_date);

        const formattedDate =
            date.toLocaleDateString(
                'es-MX',
                {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }
            );

        noteElement.innerHTML = `
            <div class="clinical-note-header">
                <strong>
                    ${formattedDate}
                </strong>
            </div>

            <div class="clinical-note-section">
                <span>Información del paciente</span>
                <p>
                    ${escapeHtml(note.subjective) || 'No registrado'}
                </p>
            </div>

            <div class="clinical-note-section">
                <span>Hallazgos clínicos</span>
                <p>
                    ${escapeHtml(note.objective) || 'No registrado'}
                </p>
            </div>

            <div class="clinical-note-section">
                <span>Evaluación</span>
                <p>
                    ${escapeHtml(note.assessment) || 'No registrado'}
                </p>
            </div>

            <div class="clinical-note-section">
                <span>Plan</span>
                <p>
                    ${escapeHtml(note.plan) || 'No registrado'}
                </p>
            </div>

            <div class="clinical-note-section">
                <span>Observaciones</span>
                <p>
                    ${escapeHtml(note.notes) || 'No registrado'}
                </p>
            </div>
        `;

        clinicalNotesContainer.appendChild(
            noteElement
        );
    });
}


async function loadTreatments(patientId) {

    treatmentsMessage.textContent =
        'Cargando tratamientos...';

    treatmentsContainer
        .querySelectorAll('.treatment-card')
        .forEach(function (treatmentElement) {
            treatmentElement.remove();
        });

    const {
        data,
        error
    } = await supabaseClient
        .from('treatments')
        .select(`
            id,
            name,
            description,
            status,
            start_date,
            end_date,
            estimated_cost,
            notes
        `)
        .eq('patient_id', patientId)
        .order('start_date', {
            ascending: false
        });

    if (error) {

        treatmentsMessage.textContent =
            'No fue posible cargar los tratamientos.';

        console.error(error);

        return;
    }

    if (!data || data.length === 0) {

        treatmentsMessage.textContent =
            'No hay tratamientos registrados.';

        return;
    }

    treatmentsMessage.textContent =
        `${data.length} tratamiento(s) encontrado(s).`;

    data.forEach(async function (treatment) {

        const treatmentElement =
            document.createElement('div');

        treatmentElement.classList.add(
            'treatment-card'
        );

        treatmentElement.innerHTML = `
            <div class="treatment-header">

                <div>
                    <h4>
                        ${escapeHtml(treatment.name)}
                    </h4>

                    <span class="treatment-status">
                        ${getTreatmentStatusLabel(
                            treatment.status
                        )}
                    </span>
                </div>

                <div class="treatment-header-actions">

                    <button
                        type="button"
                        class="edit-treatment-button"
                        data-treatment-id="${escapeHtml(treatment.id)}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="delete-treatment-button"
                        data-treatment-id="${escapeHtml(treatment.id)}"
                        data-treatment-name="${escapeHtml(treatment.name)}"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

            <div class="treatment-data-grid">

                <div>
                    <span>Descripción</span>
                    <p>
                        ${
                            escapeHtml(treatment.description) ||
                            'No registrada'
                        }
                    </p>
                </div>

                <div>
                    <span>Fecha de inicio</span>
                    <p>
                        ${
                            treatment.start_date ||
                            'No registrada'
                        }
                    </p>
                </div>

                <div>
                    <span>Fecha de finalización</span>
                    <p>
                        ${
                            treatment.end_date ||
                            'No registrada'
                        }
                    </p>
                </div>

                <div>
                    <span>Costo estimado</span>
                    <p>
                        ${
                            treatment.estimated_cost !== null
                                ? `$${Number(
                                    treatment.estimated_cost
                                ).toFixed(2)}`
                                : 'No registrado'
                        }
                    </p>
                </div>

                <div>
                    <span>Observaciones</span>
                    <p>
                        ${
                            escapeHtml(treatment.notes) ||
                            'No registradas'
                        }
                    </p>
                </div>

            </div>

            <div class="treatment-history">

                <h5>Historial del tratamiento</h5>

                <div id="history-${treatment.id}">
                    <p>Cargando historial...</p>
                </div>

            </div>
        `;

        treatmentsContainer.appendChild(
            treatmentElement
        );

        await loadTreatmentHistory(
            treatment.id
        );
    });
}


async function loadTreatmentForEdit(treatmentId) {

    const {
        data,
        error
    } = await supabaseClient
        .from('treatments')
        .select(`
            id,
            name,
            description,
            status,
            start_date,
            end_date,
            estimated_cost,
            notes
        `)
        .eq('id', treatmentId)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    if (!data) {
        console.error(
            'No se encontró el tratamiento.'
        );
        return;
    }

    currentTreatmentId = data.id;

    editTreatmentName.value =
        data.name || '';

    editTreatmentDescription.value =
        data.description || '';

    editTreatmentStatus.value =
        data.status || 'planned';

    editTreatmentStartDate.value =
        data.start_date || '';

    editTreatmentEndDate.value =
        data.end_date || '';

    editTreatmentEstimatedCost.value =
        data.estimated_cost !== null
            ? data.estimated_cost
            : '';

    editTreatmentNotes.value =
        data.notes || '';

    patientDetailView.classList.add('hidden');
    editTreatmentView.classList.remove('hidden');
}


async function deleteTreatment(treatmentId) {

    if (!treatmentId) {

        console.error(
            'No se proporcionó un identificador de tratamiento.'
        );

        return;
    }

    // Se elimina primero el historial (treatment_history)
    // porque depende del tratamiento mediante una llave foránea.
    // Si la base de datos no tiene ON DELETE CASCADE configurado,
    // borrar el tratamiento primero fallaría o dejaría historial huérfano.
    const {
        error: historyError
    } = await supabaseClient
        .from('treatment_history')
        .delete()
        .eq('treatment_id', treatmentId);

    if (historyError) {

        console.error(
            'Error al eliminar el historial del tratamiento:',
            historyError
        );

        alert(
            'No fue posible eliminar el historial del tratamiento.'
        );

        return;
    }

    const {
        error: treatmentError
    } = await supabaseClient
        .from('treatments')
        .delete()
        .eq('id', treatmentId);

    if (treatmentError) {

        console.error(
            'Error al eliminar el tratamiento:',
            treatmentError
        );

        alert(
            'No fue posible eliminar el tratamiento.'
        );

        return;
    }

    showSuccessModal(
        'Tratamiento eliminado',
        'El tratamiento y su historial se eliminaron correctamente.'
    );

    await loadTreatments(currentPatientId);
}


async function loadTreatmentHistory(treatmentId) {

    const historyContainer =
        document.getElementById(
            `history-${treatmentId}`
        );

    const {
        data,
        error
    } = await supabaseClient
        .from('treatment_history')
        .select(`
            id,
            event_date,
            status,
            description,
            notes
        `)
        .eq('treatment_id', treatmentId)
        .order('event_date', {
            ascending: false
        });

    if (error) {

        historyContainer.innerHTML =
            '<p>No fue posible cargar el historial.</p>';

        console.error(error);

        return;
    }

    if (!data || data.length === 0) {

        historyContainer.innerHTML =
            '<p>No hay eventos registrados.</p>';

        return;
    }

    historyContainer.innerHTML = '';

    data.forEach(function (event) {

        const historyElement =
            document.createElement('div');

        historyElement.classList.add(
            'history-item'
        );

        const date =
            new Date(event.event_date);

        const formattedDate =
            date.toLocaleDateString(
                'es-MX',
                {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }
            );

        historyElement.innerHTML = `
            <div class="history-date">
                ${formattedDate}
            </div>

            <div class="history-status">
                ${getTreatmentStatusLabel(
                    event.status
                )}
            </div>

            <div class="history-description">
                ${
                    escapeHtml(event.description) ||
                    'Sin descripción'
                }
            </div>

            ${
                event.notes
                    ? `
                        <div class="history-notes">
                            ${escapeHtml(event.notes)}
                        </div>
                      `
                    : ''
            }
        `;

        historyContainer.appendChild(
            historyElement
        );
    });
}


backToPatientsButton.addEventListener(
    'click',
    function (event) {

        event.preventDefault();

        patientDetailView.classList.add('hidden');

        patientsView.classList.remove('hidden');

        setActiveNavItem('patientsNavItem');

    }
);


if (editPatientButton) {
    editPatientButton.addEventListener('click', async function () {

        if (!currentPatientId) {
            return;
        }

        await loadPatientEditForm(currentPatientId);

        patientDetailView.classList.add('hidden');
        editPatientView.classList.remove('hidden');

    });
}


const editMedicalHistoryButton =
    document.getElementById('editMedicalHistoryButton');

const editMedicalHistoryView =
    document.getElementById('editMedicalHistoryView');

if (editMedicalHistoryButton) {

    editMedicalHistoryButton.addEventListener('click', async function () {

        if (!currentPatientId) {
            return;
        }

        await loadMedicalHistoryEditForm(currentPatientId);

        patientDetailView.classList.add('hidden');
        editMedicalHistoryView.classList.remove('hidden');

    });

}


const cancelEditMedicalHistoryButton =
    document.getElementById('cancelEditMedicalHistoryButton');

const cancelEditMedicalHistoryButtonBottom =
    document.getElementById('cancelEditMedicalHistoryButtonBottom');

function cancelMedicalHistoryEdit() {

    editMedicalHistoryView.classList.add('hidden');
    patientDetailView.classList.remove('hidden');

}

if (cancelEditMedicalHistoryButton) {
    cancelEditMedicalHistoryButton.addEventListener(
        'click',
        cancelMedicalHistoryEdit
    );
}

if (cancelEditMedicalHistoryButtonBottom) {
    cancelEditMedicalHistoryButtonBottom.addEventListener(
        'click',
        cancelMedicalHistoryEdit
    );
}


const editMedicalHistoryForm =
    document.getElementById('editMedicalHistoryForm');

if (editMedicalHistoryForm) {

    editMedicalHistoryForm.addEventListener('submit', async function (event) {

        event.preventDefault();

        const message =
            document.getElementById('editMedicalHistoryMessage');

        message.textContent = 'Guardando cambios...';

        const medicalHistoryData = {
            patient_id: currentPatientId,

            allergies:
                document.getElementById('editAllergies').value.trim() || null,

            allergy_to_anesthetics:
                document.getElementById('editAllergyToAnesthetics').checked,

            current_medications:
                document.getElementById('editCurrentMedications').value.trim() || null,

            medical_conditions:
                document.getElementById('editMedicalConditions').value.trim() || null,

            hypertension:
                document.getElementById('editHypertension').checked,

            diabetes:
                document.getElementById('editDiabetes').checked,

            heart_disease:
                document.getElementById('editHeartDisease').checked,

            bleeding_disorder:
                document.getElementById('editBleedingDisorder').checked,

            pregnancy:
                document.getElementById('editPregnancy').checked,

            previous_surgery:
                document.getElementById('editPreviousSurgery').checked,

            surgery_details:
                document.getElementById('editSurgeryDetails').value.trim() || null,

            anesthesia_reaction:
                document.getElementById('editAnesthesiaReaction').checked,

            anesthesia_reaction_details:
                document.getElementById('editAnesthesiaReactionDetails').value.trim() || null,

            smoking:
                document.getElementById('editSmoking').checked,

            alcohol:
                document.getElementById('editAlcohol').checked,

            other_conditions:
                document.getElementById('editOtherConditions').value.trim() || null,

            notes:
                document.getElementById('editMedicalNotes').value.trim() || null
        };

        const { data: existingHistory, error: checkError } =
            await supabaseClient
                .from('medical_history')
                .select('id')
                .eq('patient_id', currentPatientId)
                .maybeSingle();

        if (checkError) {

            console.error(
                'Error al verificar antecedentes médicos:',
                checkError
            );

            message.textContent =
                'No fue posible verificar los antecedentes médicos.';

            return;
        }

        if (existingHistory) {

            const { error: updateError } =
                await supabaseClient
                    .from('medical_history')
                    .update(medicalHistoryData)
                    .eq('patient_id', currentPatientId);

            if (updateError) {

                console.error(
                    'Error al actualizar antecedentes médicos:',
                    updateError
                );

                message.textContent =
                    'No fue posible actualizar los antecedentes médicos.';

                return;
            }

        } else {

            const { error: insertError } =
                await supabaseClient
                    .from('medical_history')
                    .insert(medicalHistoryData);

            if (insertError) {

                console.error(
                    'Error al crear antecedentes médicos:',
                    insertError
                );

                message.textContent =
                    'No fue posible crear los antecedentes médicos.';

                return;
            }
        }

        message.textContent = '';

        editMedicalHistoryView.classList.add('hidden');
        patientDetailView.classList.remove('hidden');

        showSuccessModal(
            'Cambios guardados',
            'Los antecedentes médicos del paciente se actualizaron correctamente.'
        );

        await loadPatientDetail(currentPatientId);
    });
}


const editPatientForm =
    document.getElementById('editPatientForm');

if (editPatientForm) {

    editPatientForm.addEventListener('submit', async function (event) {

        event.preventDefault();

        const firstName =
            document.getElementById('editFirstName').value.trim();

        const lastName =
            document.getElementById('editLastName').value.trim();

        const birthDate =
            document.getElementById('editBirthDate').value;

        const gender =
            document.getElementById('editGender').value;

        const phone =
            document.getElementById('editPhone').value.trim();

        const email =
            document.getElementById('editEmail').value.trim();

        const address =
            document.getElementById('editAddress').value.trim();

        const emergencyContact =
            document.getElementById('editEmergencyContact').value.trim();

        const emergencyPhone =
            document.getElementById('editEmergencyPhone').value.trim();

        const status =
            document.getElementById('editStatus').value;

        const message =
            document.getElementById('editPatientMessage');

        message.textContent = 'Guardando cambios...';

        const { error } = await supabaseClient
            .from('patients')
            .update({
                first_name: firstName,
                last_name: lastName,
                birth_date: birthDate || null,
                gender: gender || null,
                phone: phone || null,
                email: email || null,
                address: address || null,
                emergency_contact: emergencyContact || null,
                emergency_phone: emergencyPhone || null,
                status: status
            })
            .eq('id', currentPatientId);

        if (error) {

            console.error(
                'Error al actualizar paciente:',
                error
            );

            message.textContent =
                'No fue posible guardar los cambios.';

            return;
        }

        message.textContent = '';

        await loadPatientDetail(currentPatientId);

        editPatientView.classList.add('hidden');
        patientDetailView.classList.remove('hidden');

        showSuccessModal(
            'Cambios guardados',
            'Los datos personales del paciente se actualizaron correctamente.'
        );

    });
}


const cancelEditPatientButton =
    document.getElementById('cancelEditPatientButton');

const cancelEditPatientButtonBottom =
    document.getElementById('cancelEditPatientButtonBottom');

function cancelPatientEdit() {

    editPatientView.classList.add('hidden');
    patientDetailView.classList.remove('hidden');

}

if (cancelEditPatientButton) {

    cancelEditPatientButton.addEventListener(
        'click',
        cancelPatientEdit
    );

}

if (cancelEditPatientButtonBottom) {

    cancelEditPatientButtonBottom.addEventListener(
        'click',
        cancelPatientEdit
    );

}


// ========================================
// NAVEGACIÓN DEL SIDEBAR
// ========================================
// Antes cada botón sabía "de qué vista venía" y ocultaba
// solo esa. Con el sidebar fijo, cualquier botón de
// navegación puede pulsarse desde CUALQUIER vista, así que
// necesitamos una función genérica que oculte todas las
// vistas y muestre únicamente la solicitada.

function showView(targetView) {

    const allViews = [
        dashboardView,
        patientsView,
        patientDetailView,
        editPatientView,
        editMedicalHistoryView,
        newPatientView,
        newClinicalNoteView,
        newTreatmentView,
        editTreatmentView
    ];

    allViews.forEach(function (view) {

        if (view) {
            view.classList.add('hidden');
        }
    });

    targetView.classList.remove('hidden');
}


function setActiveNavItem(navItemId) {

    const navItems =
        document.querySelectorAll('.sidebar .nav-item');

    navItems.forEach(function (item) {
        item.classList.remove('active');
    });

    const activeItem =
        document.getElementById(navItemId);

    if (activeItem) {
        activeItem.classList.add('active');
    }
}


document
    .getElementById('dashboardNavButton')
    .addEventListener('click', function () {

        showView(dashboardView);
        setActiveNavItem('dashboardNavItem');

    });


patientsButton.addEventListener(
    'click',
    async function () {

        showView(patientsView);
        setActiveNavItem('patientsNavItem');

        await loadPatients();

    }
);


newPatientButton.addEventListener(
    'click',
    function () {

        newPatientOrigin = 'dashboard';

        showView(newPatientView);
        setActiveNavItem('newPatientNavItem');

        newPatientForm.reset();
        newPatientMessage.textContent = '';
    }
);


newPatientButtonList.addEventListener(
    'click',
    function () {

        newPatientOrigin = 'patients';

        showView(newPatientView);
        setActiveNavItem('newPatientNavItem');

        newPatientForm.reset();
        newPatientMessage.textContent = '';
    }
);


function closeNewPatientView() {

    newPatientView.classList.add('hidden');

    if (newPatientOrigin === 'dashboard') {

        dashboardView.classList.remove('hidden');

    } else {

        patientsView.classList.remove('hidden');

    }

    newPatientForm.reset();
    newPatientMessage.textContent = '';
}


cancelNewPatientButton.addEventListener(
    'click',
    closeNewPatientView
);


cancelNewPatientButtonBottom.addEventListener(
    'click',
    closeNewPatientView
);


newPatientForm.addEventListener(
    'submit',
    async function (event) {

        event.preventDefault();

        newPatientMessage.textContent =
            'Guardando paciente...';

        const {
            data: { user },
            error: sessionError
        } = await supabaseClient.auth.getUser();

        if (sessionError || !user) {

            newPatientMessage.textContent =
                'No se pudo identificar al usuario actual.';

            return;
        }

        const firstName =
            document.getElementById('newFirstName')
                .value
                .trim();

        const lastName =
            document.getElementById('newLastName')
                .value
                .trim();

        if (!firstName || !lastName) {

            newPatientMessage.textContent =
                'Nombre y apellidos son obligatorios.';

            return;
        }

        const birthDate =
            document.getElementById('newBirthDate').value;

        const gender =
            document.getElementById('newGender').value;

        const phone =
            document.getElementById('newPhone')
                .value
                .trim();

        const email =
            document.getElementById('newEmail')
                .value
                .trim();

        const address =
            document.getElementById('newAddress')
                .value
                .trim();

        const emergencyContact =
            document.getElementById('newEmergencyContact')
                .value
                .trim();

        const emergencyPhone =
            document.getElementById('newEmergencyPhone')
                .value
                .trim();

        function getNewPatientTextField(fieldId) {

            const field =
                newPatientForm.elements.namedItem(fieldId);

            return field.value.trim() || null;
        }

        function getNewPatientCheckbox(fieldId) {

            const field =
                newPatientForm.elements.namedItem(fieldId);

            return field.checked;
        }

        const medicalHistory = {
            allergies: getNewPatientTextField('newAllergies'),

            allergy_to_anesthetics:
                getNewPatientCheckbox('newAllergyToAnesthetics'),

            current_medications:
                getNewPatientTextField('newCurrentMedications'),

            medical_conditions:
                getNewPatientTextField('newMedicalConditions'),

            hypertension:
                getNewPatientCheckbox('newHypertension'),

            diabetes:
                getNewPatientCheckbox('newDiabetes'),

            heart_disease:
                getNewPatientCheckbox('newHeartDisease'),

            bleeding_disorder:
                getNewPatientCheckbox('newBleedingDisorder'),

            pregnancy:
                getNewPatientCheckbox('newPregnancy'),

            previous_surgery:
                getNewPatientCheckbox('newPreviousSurgery'),

            surgery_details:
                getNewPatientTextField('newSurgeryDetails'),

            anesthesia_reaction:
                getNewPatientCheckbox('newAnesthesiaReaction'),

            anesthesia_reaction_details:
                getNewPatientTextField(
                    'newAnesthesiaReactionDetails'
                ),

            smoking:
                getNewPatientCheckbox('newSmoking'),

            alcohol:
                getNewPatientCheckbox('newAlcohol'),

            other_conditions:
                getNewPatientTextField('newOtherConditions'),

            notes:
                getNewPatientTextField('newMedicalNotes')
        };

        const {
            data,
            error
        } = await supabaseClient
            .from('patients')
            .insert({
                dentist_id: user.id,
                first_name: firstName,
                last_name: lastName,
                birth_date: birthDate || null,
                gender: gender || null,
                phone: phone || null,
                email: email || null,
                address: address || null,
                emergency_contact:
                    emergencyContact || null,
                emergency_phone:
                    emergencyPhone || null
            })
            .select('id')
            .single();

        if (error) {

            console.error(
                'Error al guardar paciente:',
                error
            );

            newPatientMessage.textContent =
                'No se pudo guardar el paciente.';

            return;
        }

        const patientId = data.id;

        const { error: medicalHistoryError } =
            await supabaseClient
                .from('medical_history')
                .insert({
                    patient_id: patientId,
                    ...medicalHistory
                });

        if (medicalHistoryError) {

            console.error(
                'Error al guardar antecedentes médicos:',
                medicalHistoryError
            );

            newPatientMessage.textContent =
                `Error antecedentes: ${medicalHistoryError.message}`;

            return;
        }

        newPatientForm.reset();

        newPatientMessage.textContent =
            'Paciente guardado correctamente.';

        await loadPatients();

        newPatientView.classList.add('hidden');
        patientsView.classList.remove('hidden');
    }
);


backToDashboard.addEventListener(
    'click',
    function () {

        patientsView.classList.add('hidden');

        dashboardView.classList.remove('hidden');

        setActiveNavItem('dashboardNavItem');

    }
);


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
    'submit',
    async function (event) {

        event.preventDefault();


        const email =
            document.getElementById('email').value;

        const password =
            document.getElementById('password').value;


        loginMessage.textContent =
            'Iniciando sesión...';


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.error(error);

            loginMessage.textContent =
                'Correo o contraseña incorrectos.';

            return;

        }



        await loadProfile(data.user.id);

        showDashboard();

    }
);


// ========================================
// CERRAR SESIÓN
// ========================================

logoutButton.addEventListener(
    'click',
    async function () {

        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(error);

            return;

        }


        showLogin();

    }
);


// ========================================
// COMPROBAR SESIÓN EXISTENTE
// ========================================

async function checkSession() {

    const { data } =
        await supabaseClient.auth.getSession();


    if (data.session) {

        await loadProfile(
            data.session.user.id
        );

        showDashboard();

    } else {

        showLogin();

    }

}


checkSession();


const successModal =
    document.getElementById('successModal');

const successModalTitle =
    document.getElementById('successModalTitle');

const successModalMessage =
    document.getElementById('successModalMessage');

const successModalButton =
    document.getElementById('successModalButton');


function showSuccessModal(title, message) {

    successModalTitle.textContent = title;
    successModalMessage.textContent = message;

    successModal.classList.remove('hidden');
}


function closeSuccessModal() {

    successModal.classList.add('hidden');
}


if (successModalButton) {

    successModalButton.addEventListener(
        'click',
        closeSuccessModal
    );

}

/* ========================================
   FECHA Y HORA - DASHBOARD
   ======================================== */

function updateDashboardClock() {
    const now = new Date();

    const date = now.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const time = now.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const dateElement = document.getElementById('dashboard-date');
    const timeElement = document.getElementById('dashboard-time');

    if (dateElement) {
        dateElement.textContent = date;
    }

    if (timeElement) {
        timeElement.textContent = time;
    }
}

updateDashboardClock();
setInterval(updateDashboardClock, 1000);
