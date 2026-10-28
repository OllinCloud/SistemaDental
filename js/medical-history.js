/* ============================================
   medical-history.js
   Antecedentes médicos: abrir el formulario de edición
   precargado, cancelarlo y guardar los cambios en Supabase
   (actualiza si ya existe un registro para el paciente,
   lo crea si no existe).

   Extraído de app.js tal cual, sin cambios de comportamiento.

   Depende de:
   - dom-refs.js: editMedicalHistoryButton, editMedicalHistoryView,
     patientDetailView, cancelEditMedicalHistoryButton,
     cancelEditMedicalHistoryButtonBottom, editMedicalHistoryForm
   - ui-feedback.js: showSuccessModal()
   - app.js: supabaseClient, MEDICAL_HISTORY_COLUMNS (fuente única
     de verdad para las columnas de "medical_history"),
     currentPatientId (variable de estado compartida)
   - patients.js: loadPatientDetail() (se invoca de forma diferida,
     dentro del submit, así que funciona sin importar el orden
     relativo entre este archivo y patients.js)

   Debe cargarse DESPUÉS de app.js en index.html, ya que usa
   supabaseClient, MEDICAL_HISTORY_COLUMNS y currentPatientId
   definidos ahí.
   ============================================ */

let medicalHistorySignatureObjectUrl = null;

function getMedicalHistorySignaturePanel() {
    let panel =
        document.getElementById('medicalHistorySignaturePanel');

    if (panel) {
        return panel;
    }

    panel = document.createElement('div');
    panel.id = 'medicalHistorySignaturePanel';
    panel.className = 'form-section';

    const title = document.createElement('h3');
    title.textContent = 'Firma de confirmación';

    const status = document.createElement('p');
    status.id = 'medicalHistorySignatureState';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    const image = document.createElement('img');
    image.id = 'medicalHistorySignatureImage';
    image.alt = 'Firma del paciente';
    image.hidden = true;
    image.style.maxWidth = '100%';
    image.style.maxHeight = '200px';
    image.style.objectFit = 'contain';
    image.style.border = '1px solid var(--line)';
    image.style.borderRadius = '6px';

    const date = document.createElement('p');
    date.id = 'medicalHistorySignatureDate';
    date.hidden = true;

    panel.append(title, status, image, date);

    const firstSection =
        editMedicalHistoryForm.querySelector('.form-section');

    if (firstSection) {
        editMedicalHistoryForm.insertBefore(panel, firstSection);
    } else {
        editMedicalHistoryForm.prepend(panel);
    }

    return panel;
}

function showMedicalHistorySignatureState(state, signedAt) {
    const panel = getMedicalHistorySignaturePanel();
    const status =
        panel.querySelector('#medicalHistorySignatureState');
    const image =
        panel.querySelector('#medicalHistorySignatureImage');
    const date =
        panel.querySelector('#medicalHistorySignatureDate');

    if (medicalHistorySignatureObjectUrl) {
        URL.revokeObjectURL(medicalHistorySignatureObjectUrl);
        medicalHistorySignatureObjectUrl = null;
    }

    image.removeAttribute('src');
    image.hidden = true;
    date.hidden = true;

    if (state === 'signed') {
        status.textContent = 'Estado: Firmado';
        image.hidden = false;
        image.src = medicalHistorySignatureObjectUrl =
            signedAt.objectUrl;
        date.textContent =
            `Fecha de firma: ${signedAt.date.toLocaleString('es-MX')}`;
        date.hidden = false;
        return;
    }

    status.textContent = state === 'pending'
        ? 'Estado: Pendiente de firma'
        : 'Estado: Error al cargar la firma';
}

async function loadMedicalHistorySignature(patientId, history) {
    if (patientId !== currentPatientId) {
        return;
    }

    if (
        !history ||
        !history.signature_path ||
        !history.signed_at
    ) {
        showMedicalHistorySignatureState('pending');
        return;
    }

    const signedAt = new Date(history.signed_at);

    if (
        Number.isNaN(signedAt.getTime()) ||
        !isPatientSignaturePathForPatient(
            history.signature_path,
            patientId
        )
    ) {
        console.error(
            'Los metadatos de firma no son válidos para este paciente.'
        );
        showMedicalHistorySignatureState('error');
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .storage
            .from(PATIENT_SIGNATURE_BUCKET)
            .download(history.signature_path);

        if (error || !data) {
            throw error || new Error(
                'Storage no devolvió el archivo de firma.'
            );
        }

        if (patientId !== currentPatientId) {
            return;
        }

        const objectUrl = URL.createObjectURL(data);
        showMedicalHistorySignatureState('signed', {
            objectUrl,
            date: signedAt
        });
    } catch (signatureError) {
        if (patientId !== currentPatientId) {
            return;
        }

        console.error(
            'Error al cargar la firma privada del paciente:',
            signatureError
        );
        showMedicalHistorySignatureState('error');
    }
}

async function loadMedicalHistoryEditForm(patientId) {

    showMedicalHistorySignatureState('pending');

    let data;
    let error;

    try {
        ({ data, error } = await supabaseClient
            .from('medical_history')
            .select(MEDICAL_HISTORY_COLUMNS)
            .eq('patient_id', patientId)
            .maybeSingle());
    } catch (queryError) {
        console.error(
            'Error al cargar antecedentes médicos:',
            queryError
        );
        if (patientId === currentPatientId) {
            showMedicalHistorySignatureState('error');
        }
        return;
    }

    if (patientId !== currentPatientId) {
        return;
    }

    if (error) {
        console.error(
            'Error al cargar antecedentes médicos:',
            error
        );
        showMedicalHistorySignatureState('error');
        return;
    }

    if (!data) {
        showMedicalHistorySignatureState('pending');
        return;
    }

    let signatureRecord;
    let signatureRecordError;

    try {
        ({
            data: signatureRecord,
            error: signatureRecordError
        } = await getPatientSignatureRecord(patientId));
    } catch (queryError) {
        console.error(
            'Error al consultar el estado de la firma:',
            queryError
        );
        signatureRecordError = queryError;
    }

    if (patientId !== currentPatientId) {
        return;
    }

    if (signatureRecordError) {
        console.error(
            'Error al consultar el estado de la firma:',
            signatureRecordError
        );
        showMedicalHistorySignatureState('error');
    } else {
        await loadMedicalHistorySignature(
            patientId,
            signatureRecord
        );
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


if (editMedicalHistoryButton) {

    editMedicalHistoryButton.addEventListener('click', async function () {

        if (!currentPatientId) {
            return;
        }

        await loadMedicalHistoryEditForm(currentPatientId);

        patientDetailView.classList.add('hidden');
        editMedicalHistoryView.classList.remove('hidden');
        editMedicalHistoryView.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    });

}


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
