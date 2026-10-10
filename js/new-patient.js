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
let newPatientSubmissionLocked = false;

const newPatientPhoneInput = document.getElementById('newPhone');
MexicanPhone.attach(newPatientPhoneInput);


function normalizePatientName(value) {

    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}


function showPossibleDuplicatePatients(matches) {

    return new Promise(function (resolve) {

        const overlay = document.createElement('div');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'duplicatePatientsTitle');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(15,23,42,.62);display:grid;place-items:center;padding:20px;';

        const dialog = document.createElement('div');
        dialog.style.cssText = 'width:min(620px,100%);max-height:85vh;overflow:auto;background:var(--surface,#fff);color:var(--text,#172b3a);border-radius:12px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.28);';

        const title = document.createElement('h2');
        title.id = 'duplicatePatientsTitle';
        title.textContent = 'Posibles pacientes duplicados';
        dialog.appendChild(title);

        const intro = document.createElement('p');
        intro.textContent = 'Encontramos registros con el mismo nombre y apellidos. Revisa los datos antes de continuar.';
        dialog.appendChild(intro);

        const list = document.createElement('ul');
        list.style.cssText = 'padding-left:22px;';
        matches.forEach(function (patient) {
            const item = document.createElement('li');
            item.style.marginBottom = '14px';
            const name = document.createElement('strong');
            name.textContent = `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
            item.appendChild(name);
            const details = document.createElement('div');
            const complementary = [];
            if (patient.phone) complementary.push(`Teléfono: ${patient.phone}`);
            if (patient.email) complementary.push(`Correo: ${patient.email}`);
            if (patient.birth_date) complementary.push(`Fecha de nacimiento: ${patient.birth_date}`);
            details.textContent = [`Estado: ${patient.status === 'active' ? 'Activo' : 'Inactivo'}`, ...complementary].join(' · ');
            item.appendChild(details);
            list.appendChild(item);
        });
        dialog.appendChild(list);

        const patientChoice = document.createElement('select');
        patientChoice.setAttribute('aria-label', 'Expediente que quieres abrir');
        patientChoice.style.cssText = 'max-width:100%;padding:8px;margin-top:8px;';
        matches.forEach(function (patient) {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.first_name || ''} ${patient.last_name || ''} · ${patient.status === 'active' ? 'Activo' : 'Inactivo'}${patient.phone ? ` · ${patient.phone}` : ''}`;
            patientChoice.appendChild(option);
        });
        if (matches.length > 1) dialog.appendChild(patientChoice);

        const actions = document.createElement('div');
        actions.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;margin-top:20px;';
        const choices = [
            ['Regresar al formulario', 'cancel'],
            ['Es el mismo paciente', 'same'],
            ['Es un paciente diferente', 'different']
        ];
        choices.forEach(function ([label, choice]) {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = label;
            button.addEventListener('click', function () {
                overlay.remove();
                resolve(choice === 'same' ? { choice, patientId: patientChoice.value } : { choice });
            });
            actions.appendChild(button);
        });
        dialog.appendChild(actions);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        actions.querySelector('button').focus();
    });
}


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

        if (newPatientSubmissionLocked) return;
        newPatientSubmissionLocked = true;
        const submitButtons = newPatientForm.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => button.disabled = true);

        const unlockSubmission = function () {
            newPatientSubmissionLocked = false;
            submitButtons.forEach(button => button.disabled = false);
        };

        newPatientMessage.textContent =
            'Guardando paciente...';

        const {
            data: { user },
            error: sessionError
        } = await supabaseClient.auth.getUser();

        if (sessionError || !user) {

            newPatientMessage.textContent =
                'No se pudo identificar al usuario actual.';

            unlockSubmission();

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

            unlockSubmission();

            return;
        }

        const birthDate =
            document.getElementById('newBirthDate').value;

        const gender =
            document.getElementById('newGender').value;

        const phoneInput = newPatientPhoneInput;
        const phone = MexicanPhone.normalize(phoneInput.value);

        if (!birthDate) {

            newPatientMessage.textContent =
                'Fecha de nacimiento y teléfono son obligatorios.';

            unlockSubmission();

            return;
        }

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

        newPatientMessage.textContent = 'Buscando posibles pacientes duplicados...';

        let possibleDuplicates;
        try {
            const { data: existingPatients, error: duplicateSearchError } =
                await supabaseClient
                    .from('patients')
                    .select('id, first_name, last_name, status, phone, email, birth_date')
                    .eq('dentist_id', user.id);

            if (duplicateSearchError) throw duplicateSearchError;

            const normalizedFirstName = normalizePatientName(firstName);
            const normalizedLastName = normalizePatientName(lastName);
            possibleDuplicates = (existingPatients || []).filter(function (patient) {
                return normalizePatientName(patient.first_name || '') === normalizedFirstName &&
                    normalizePatientName(patient.last_name || '') === normalizedLastName;
            });
        } catch (duplicateSearchError) {
            console.error('Error al buscar posibles pacientes duplicados:', duplicateSearchError);
            newPatientMessage.textContent = 'No se pudo comprobar si ya existe un paciente con ese nombre. Inténtalo de nuevo.';
            unlockSubmission();
            return;
        }

        if (
            !MexicanPhone.isValid(phoneInput)
        ) {
            newPatientMessage.textContent =
                'Ingresa un teléfono válido de 10 dígitos, sin lada internacional';
            unlockSubmission();
            return;
        }

        if (possibleDuplicates.length) {
            newPatientMessage.textContent = 'Revisa los posibles pacientes duplicados.';
            const duplicateChoice = await showPossibleDuplicatePatients(possibleDuplicates);

            if (duplicateChoice.choice === 'cancel') {
                newPatientMessage.textContent = '';
                unlockSubmission();
                return;
            }

            if (duplicateChoice.choice === 'same') {
                newPatientView.classList.add('hidden');
                dashboardView.classList.add('hidden');
                patientsView.classList.add('hidden');
                unlockSubmission();
                await loadPatientDetail(duplicateChoice.patientId);
                return;
            }
        }

        newPatientMessage.textContent = 'Guardando paciente...';

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

            unlockSubmission();

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
        unlockSubmission();
    }
);
