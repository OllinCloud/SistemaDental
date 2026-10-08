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
