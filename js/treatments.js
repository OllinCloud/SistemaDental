/* ============================================
   treatments.js
   Tratamientos e historial de tratamientos: abrir/cancelar
   el formulario de nuevo tratamiento, guardarlo (con su
   historial inicial), listar tratamientos del paciente,
   editar un tratamiento existente (detectando cambios y
   registrándolos en el historial), eliminar un tratamiento
   (con su historial) y renderizar el historial de eventos
   de cada tratamiento.

   Extraído de app.js tal cual, sin cambios de comportamiento.
   Las operaciones de escritura de varios pasos (crear
   tratamiento + historial inicial; actualizar tratamiento +
   registrar historial de cambios; eliminar historial +
   eliminar tratamiento) se mantienen exactamente igual:
   son deliberadamente no transaccionales en el original y
   no se tocó ese comportamiento.

   Depende de:
   - dom-refs.js: newTreatmentButton, patientDetailView,
     newTreatmentView, treatmentStartDate, cancelTreatmentButton,
     cancelTreatmentButtonBottom, newTreatmentForm,
     treatmentsContainer, treatmentsMessage, editTreatmentView,
     editTreatmentForm, editTreatmentName, editTreatmentDescription,
     editTreatmentStatus, editTreatmentStartDate, editTreatmentEndDate,
     editTreatmentEstimatedCost, editTreatmentNotes
     (cancelEditTreatmentButton se obtiene con getElementById,
     igual que en el original)
   - ui-feedback.js: showSuccessModal()
   - app.js: supabaseClient, escapeHtml(), setTodayDate(),
     currentPatientId (variable de estado compartida)

   Debe cargarse DESPUÉS de app.js en index.html, ya que usa
   supabaseClient, escapeHtml(), setTodayDate() y currentPatientId
   definidos ahí.
   ============================================ */

let currentTreatmentId = null;


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
