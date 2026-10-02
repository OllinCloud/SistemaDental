/* ============================================
   clinical-notes.js
   Notas clínicas: abrir/cancelar el formulario de nueva nota,
   guardarla en Supabase y renderizar el listado de notas
   clínicas del paciente.

   Extraído de app.js tal cual, sin cambios de comportamiento.

   Depende de:
   - dom-refs.js: newClinicalNoteButton, patientDetailView,
     newClinicalNoteView, clinicalNoteDate, newClinicalNoteForm,
     cancelClinicalNoteButton, cancelClinicalNoteButtonBottom,
     clinicalNotesContainer, clinicalNotesMessage
   - ui-feedback.js: showSuccessModal()
   - app.js: supabaseClient, escapeHtml(), setTodayDate(),
     currentPatientId (variable de estado compartida)

   Debe cargarse DESPUÉS de app.js en index.html, ya que usa
   supabaseClient, escapeHtml(), setTodayDate() y currentPatientId
   definidos ahí.
   ============================================ */

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
