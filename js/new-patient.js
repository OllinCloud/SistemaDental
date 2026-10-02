/* ============================================
   new-patient.js
   Alta de un nuevo paciente: cerrar/cancelar el formulario
   (regresando a dashboard o a la lista de pacientes según de
   dónde se haya abierto) y guardar paciente + antecedentes
   médicos iniciales en Supabase.

   Extraído de app.js tal cual, sin cambios de comportamiento.

   Depende de:
   - dom-refs.js: newPatientView, dashboardView, patientsView,
     newPatientForm, newPatientMessage, cancelNewPatientButton,
     cancelNewPatientButtonBottom
   - app.js: supabaseClient
   - patients.js: loadPatients() (se invoca de forma diferida,
     dentro del submit, así que funciona sin importar el orden
     relativo entre este archivo y patients.js)
   - navigation.js: asigna 'dashboard' o 'patients' a
     newPatientOrigin (variable declarada aquí) al abrir el
     formulario desde el sidebar o desde la lista de pacientes;
     esa asignación ocurre dentro de listeners (ejecución
     diferida), por lo que funciona sin importar el orden de
     carga entre navigation.js y este archivo.

   Debe cargarse DESPUÉS de app.js en index.html, ya que usa
   supabaseClient definido ahí.
   ============================================ */

let newPatientOrigin = '';


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
