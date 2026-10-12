const deletePatientButton =
    document.getElementById('deletePatientButton');

const deletePatientConfirmModal =
    document.getElementById('deletePatientConfirmModal');

const cancelDeletePatientButton =
    document.getElementById('cancelDeletePatientButton');

const confirmDeletePatientButton =
    document.getElementById('confirmDeletePatientButton');

const deletePatientMessage =
    document.getElementById('deletePatientMessage');

function closeDeletePatientModal() {
    if (confirmDeletePatientButton.disabled) {
        return;
    }

    deletePatientConfirmModal.classList.add('hidden');
    deletePatientMessage.textContent = '';
}

if (deletePatientButton) {
    deletePatientButton.addEventListener('click', function () {
        if (!currentPatientId) {
            patientDetailMessage.textContent =
                'No se encontró el identificador del paciente.';
            return;
        }

        deletePatientMessage.textContent = '';
        deletePatientConfirmModal.classList.remove('hidden');
    });
}

if (cancelDeletePatientButton) {
    cancelDeletePatientButton.addEventListener(
        'click',
        closeDeletePatientModal
    );
}

if (deletePatientConfirmModal) {
    deletePatientConfirmModal.addEventListener('click', function (event) {
        if (event.target === deletePatientConfirmModal) {
            closeDeletePatientModal();
        }
    });
}

if (confirmDeletePatientButton) {
    confirmDeletePatientButton.addEventListener(
        'click',
        async function () {
            const patientId = currentPatientId;

            if (!patientId) {
                deletePatientMessage.textContent =
                    'No se encontró el identificador del paciente. Cierra esta ventana e inténtalo de nuevo.';
                return;
            }

            confirmDeletePatientButton.disabled = true;
            confirmDeletePatientButton.textContent = 'Eliminando...';
            deletePatientMessage.textContent = '';

            let deletedRows;

            try {
                const { data, error } = await supabaseClient
                    .from('patients')
                    .delete()
                    .eq('id', patientId)
                    .select('id');

                if (error) {
                    throw error;
                }

                deletedRows = data;
            } catch (error) {
                console.error('Error al eliminar paciente:', error);
                deletePatientMessage.textContent =
                    'No fue posible eliminar al paciente. Inténtalo de nuevo.';
                confirmDeletePatientButton.disabled = false;
                confirmDeletePatientButton.textContent =
                    'Sí, eliminar paciente';
                return;
            }

            if (
                !Array.isArray(deletedRows) ||
                deletedRows.length !== 1 ||
                !deletedRows[0] ||
                deletedRows[0].id !== patientId
            ) {
                console.error(
                    'La eliminación no confirmó exactamente un paciente:',
                    deletedRows
                );
                deletePatientMessage.textContent =
                    'No se pudo confirmar la eliminación de exactamente un paciente. No se mostrará como eliminada.';
                confirmDeletePatientButton.disabled = false;
                confirmDeletePatientButton.textContent =
                    'Sí, eliminar paciente';
                return;
            }

            currentPatientId = null;
            deletePatientConfirmModal.classList.add('hidden');
            showView(patientsView);
            setActiveNavItem('patientsNavItem');

            try {
                await loadPatients();
            } catch (error) {
                console.error(
                    'Paciente eliminado, pero no se pudo actualizar la lista:',
                    error
                );
                patientsMessage.textContent =
                    'El paciente se eliminó, pero no fue posible actualizar la lista.';
            }

            confirmDeletePatientButton.disabled = false;
            confirmDeletePatientButton.textContent =
                'Sí, eliminar paciente';

            showSuccessModal(
                'Paciente eliminado',
                'El paciente se eliminó permanentemente.'
            );
        }
    );
}
