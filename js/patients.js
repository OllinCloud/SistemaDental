/* ============================================
   patients.js
   Gestión de pacientes: listado y búsqueda, ficha de detalle
   del paciente y edición de sus datos personales.

   Extraído de app.js tal cual, sin cambios de comportamiento.

   Depende de:
   - dom-refs.js: patientsView, patientsTableBody, patientsMessage,
     patientSearch, patientDetailView, patientDetailMessage,
     backToPatientsButton, editPatientButton, editPatientView,
     editPatientForm, cancelEditPatientButton(Bottom), los campos
     detail*, patientFullName, detailStatus, patientStatusDot
   - navigation.js: setActiveNavItem()
   - ui-feedback.js: showSuccessModal()
   - app.js (por ahora): supabaseClient, escapeHtml(),
     MEDICAL_HISTORY_COLUMNS, currentPatientId (variable de
     estado compartida), loadClinicalNotes(), loadTreatments()

   Todas esas dependencias se usan dentro de funciones o listeners
   (ejecución diferida), nunca al cargar este archivo, así que
   puede cargarse en cualquier posición después de dom-refs.js.
   ============================================ */

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
