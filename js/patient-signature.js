const patientSignatureButton =
    document.getElementById('openPatientSignatureButton');

const patientSignatureModal =
    document.getElementById('patientSignatureModal');

const patientSignatureCanvas =
    document.getElementById('patientSignatureCanvas');

const patientSignatureContext =
    patientSignatureCanvas.getContext('2d');

const patientSignatureStatus =
    document.getElementById('patientSignatureStatus');

const patientSignatureMessage =
    document.getElementById('patientSignatureMessage');

const patientReviewedHistoryCheckbox =
    document.getElementById('patientReviewedHistoryCheckbox');

const savePatientSignatureButton =
    document.getElementById('savePatientSignatureButton');

let patientSignatureHasStrokes = false;
let patientSignatureIsDrawing = false;
let patientSignatureRecordExists = false;
let patientSignatureIsSaving = false;

const PATIENT_SIGNATURE_BUCKET = 'patient-signatures';
const PATIENT_SIGNATURE_MAX_BYTES = 1024 * 1024;

function updatePatientSignatureStatus(history, error, patientId) {
    if (patientId !== currentPatientId) {
        return;
    }

    patientSignatureRecordExists = Boolean(history && !error);
    patientSignatureButton.disabled = Boolean(error) || !history;

    if (error) {
        patientSignatureStatus.textContent =
            'No fue posible verificar el estado de la firma.';
        console.error('Error al cargar el estado de la firma:', error);
        return;
    }

    if (!history) {
        patientSignatureStatus.textContent =
            'Antecedentes médicos pendientes: deben registrarse antes de firmar.';
        return;
    }

    if (!history.signature_path || !history.signed_at) {
        patientSignatureStatus.textContent =
            'Estado de firma: pendiente de nueva firma.';
        return;
    }

    const signedAt = new Date(history.signed_at);

    if (Number.isNaN(signedAt.getTime())) {
        patientSignatureStatus.textContent =
            'Firma registrada, pero no se pudo verificar su fecha.';
        return;
    }

    patientSignatureStatus.textContent =
        `Historial firmado el ${signedAt.toLocaleString('es-MX')}.`;
}

async function getPatientSignatureRecord(patientId) {
    return await supabaseClient
        .from('medical_history')
        .select('id, signature_path, signed_at')
        .eq('patient_id', patientId)
        .maybeSingle();
}

function configurePatientSignatureCanvas() {
    const bounds = patientSignatureCanvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    patientSignatureCanvas.width =
        Math.max(1, Math.round(bounds.width * pixelRatio));
    patientSignatureCanvas.height =
        Math.max(1, Math.round(bounds.height * pixelRatio));

    patientSignatureContext.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );
    patientSignatureContext.lineWidth = 2.4;
    patientSignatureContext.lineCap = 'round';
    patientSignatureContext.lineJoin = 'round';
    patientSignatureContext.strokeStyle = '#0B6176';
}

function clearPatientSignature() {
    const bounds = patientSignatureCanvas.getBoundingClientRect();

    patientSignatureContext.clearRect(
        0,
        0,
        bounds.width,
        bounds.height
    );
    patientSignatureHasStrokes = false;
}

function closePatientSignatureModal() {
    if (patientSignatureIsSaving) {
        return;
    }

    patientSignatureModal.classList.add('hidden');
    patientSignatureMessage.textContent = '';
    patientReviewedHistoryCheckbox.checked = false;
    clearPatientSignature();
}

function getPatientSignatureBlob() {
    return new Promise(function (resolve, reject) {
        patientSignatureCanvas.toBlob(function (blob) {
            if (!blob) {
                reject(new Error('No se pudo generar la imagen de firma.'));
                return;
            }

            resolve(blob);
        }, 'image/png');
    });
}

function isNotFoundStorageError(error) {
    return Boolean(
        error &&
        (error.statusCode === 404 ||
            error.statusCode === '404' ||
            error.status === 404)
    );
}

function signatureMetadataMatches(record, path, signedAt) {
    return Boolean(
        record &&
        record.signature_path === path &&
        record.signed_at &&
        new Date(record.signed_at).getTime() ===
            new Date(signedAt).getTime()
    );
}

async function restorePatientSignatureFile(path, backupBlob) {
    const storage = supabaseClient.storage.from(PATIENT_SIGNATURE_BUCKET);

    if (backupBlob) {
        const { error } = await storage.upload(path, backupBlob, {
            contentType: 'image/png',
            upsert: true
        });

        if (error) {
            throw error;
        }

        return;
    }

    const { error } = await storage.remove([path]);

    if (error) {
        throw error;
    }
}

function isPatientSignaturePathForPatient(path, patientId) {
    return (
        typeof path === 'string' &&
        path.startsWith(`${patientId}/`) &&
        !path.split('/').includes('..')
    );
}

async function refreshPatientSignatureStatus(patientId) {
    const { data, error } = await getPatientSignatureRecord(patientId);
    updatePatientSignatureStatus(data, error, patientId);
    return { data, error };
}

if (patientSignatureButton) {
    patientSignatureButton.addEventListener('click', async function () {
        const patientId = currentPatientId;

        if (!patientId) {
            patientSignatureStatus.textContent =
                'Selecciona un paciente antes de firmar.';
            return;
        }

        patientSignatureButton.disabled = true;
        savePatientSignatureButton.disabled = true;
        patientSignatureStatus.textContent =
            'Verificando que existan los antecedentes médicos...';

        try {
            const { data, error } =
                await getPatientSignatureRecord(patientId);

            if (error) {
                throw error;
            }

            if (patientId !== currentPatientId) {
                return;
            }

            updatePatientSignatureStatus(data, null, patientId);

            if (!data) {
                patientSignatureMessage.textContent =
                    'No existe un historial médico para este paciente. Registra sus antecedentes antes de firmar.';
                patientSignatureModal.classList.remove('hidden');
                return;
            }

            patientSignatureMessage.textContent = '';
            patientReviewedHistoryCheckbox.checked = false;
            patientSignatureModal.classList.remove('hidden');
            configurePatientSignatureCanvas();
            clearPatientSignature();
            savePatientSignatureButton.disabled = false;
        } catch (error) {
            console.error(
                'Error al verificar los antecedentes médicos:',
                error
            );
            patientSignatureRecordExists = false;
            patientSignatureButton.disabled = true;
            patientSignatureStatus.textContent =
                'No fue posible verificar los antecedentes médicos.';
        } finally {
            if (patientId === currentPatientId) {
                patientSignatureButton.disabled =
                    !patientSignatureRecordExists;
            }
        }
    });
}

patientSignatureCanvas.addEventListener(
    'pointerdown',
    function (event) {
        event.preventDefault();
        patientSignatureIsDrawing = true;
        patientSignatureHasStrokes = true;
        patientSignatureCanvas.setPointerCapture(event.pointerId);

        const bounds = patientSignatureCanvas.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        patientSignatureContext.beginPath();
        patientSignatureContext.moveTo(x, y);
        patientSignatureContext.lineTo(x + 0.1, y + 0.1);
        patientSignatureContext.stroke();
    }
);

patientSignatureCanvas.addEventListener(
    'pointermove',
    function (event) {
        if (!patientSignatureIsDrawing) {
            return;
        }

        event.preventDefault();
        const bounds = patientSignatureCanvas.getBoundingClientRect();

        patientSignatureContext.lineTo(
            event.clientX - bounds.left,
            event.clientY - bounds.top
        );
        patientSignatureContext.stroke();
    }
);

function stopPatientSignatureDrawing() {
    patientSignatureIsDrawing = false;
    patientSignatureContext.beginPath();
}

patientSignatureCanvas.addEventListener(
    'pointerup',
    stopPatientSignatureDrawing
);

patientSignatureCanvas.addEventListener(
    'pointercancel',
    stopPatientSignatureDrawing
);

patientSignatureCanvas.addEventListener(
    'lostpointercapture',
    stopPatientSignatureDrawing
);

document
    .getElementById('clearPatientSignatureButton')
    .addEventListener('click', clearPatientSignature);

document
    .getElementById('cancelPatientSignatureButton')
    .addEventListener('click', closePatientSignatureModal);

patientSignatureModal.addEventListener('click', function (event) {
    if (event.target === patientSignatureModal) {
        closePatientSignatureModal();
    }
});

document.addEventListener('keydown', function (event) {
    if (
        event.key === 'Escape' &&
        !patientSignatureModal.classList.contains('hidden')
    ) {
        closePatientSignatureModal();
    }
});

savePatientSignatureButton.addEventListener(
    'click',
    async function () {
        const patientId = currentPatientId;

        if (!patientId) {
            patientSignatureMessage.textContent =
                'No hay un paciente seleccionado.';
            return;
        }

        if (!patientSignatureHasStrokes) {
            patientSignatureMessage.textContent =
                'Dibuja la firma antes de continuar.';
            return;
        }

        if (!patientReviewedHistoryCheckbox.checked) {
            patientSignatureMessage.textContent =
                'Confirma que el paciente revisó sus antecedentes médicos.';
            return;
        }

        savePatientSignatureButton.disabled = true;
        patientSignatureIsSaving = true;
        savePatientSignatureButton.textContent = 'Guardando firma...';
        patientSignatureMessage.textContent = '';

        let uploadedSignaturePath = null;
        let backupBlob = null;
        let previousSignatureMetadata = null;

        try {
            const {
                data: medicalHistory,
                error: historyError
            } = await getPatientSignatureRecord(patientId);

            if (historyError) {
                throw new Error(
                    'No fue posible verificar los antecedentes médicos.'
                );
            }

            if (!medicalHistory) {
                updatePatientSignatureStatus(null, null, patientId);
                throw new Error(
                    'El historial médico ya no existe; no se guardó la firma.'
                );
            }

            previousSignatureMetadata = {
                signature_path: medicalHistory.signature_path,
                signed_at: medicalHistory.signed_at
            };

            const imageBlob = await getPatientSignatureBlob();

            if (imageBlob.size > PATIENT_SIGNATURE_MAX_BYTES) {
                throw new Error(
                    'La firma supera el límite de 1 MB. Limpia el área y vuelve a firmar.'
                );
            }

            const signaturePath = `${patientId}/signature.png`;
            const storage = supabaseClient.storage.from(
                PATIENT_SIGNATURE_BUCKET
            );
            const {
                data: existingFile,
                error: backupError
            } = await storage.download(signaturePath);

            if (backupError && !isNotFoundStorageError(backupError)) {
                throw new Error(
                    'No fue posible proteger la firma anterior antes de reemplazarla.'
                );
            }

            backupBlob = existingFile || null;

            if (
                !backupBlob &&
                medicalHistory.signature_path === signaturePath &&
                medicalHistory.signed_at
            ) {
                patientSignatureStatus.textContent =
                    'La firma registrada no tiene un archivo disponible; no se reemplazó.';
                throw new Error(
                    'Hay una firma registrada cuyo archivo no está disponible; no se reemplazó.'
                );
            }

            if (patientId !== currentPatientId) {
                throw new Error(
                    'Cambió el paciente seleccionado; no se guardó la firma.'
                );
            }

            patientSignatureStatus.textContent =
                'Guardando firma; no se confirmará hasta terminar Storage y la base de datos.';
            uploadedSignaturePath = signaturePath;
            const { error: uploadError } = await storage.upload(
                signaturePath,
                imageBlob,
                {
                    contentType: 'image/png',
                    upsert: true
                }
            );

            if (uploadError) {
                try {
                    await restorePatientSignatureFile(
                        signaturePath,
                        backupBlob
                    );
                    uploadedSignaturePath = null;
                } catch (restoreError) {
                    console.error(
                        'Error al restaurar el archivo de firma anterior:',
                        restoreError
                    );
                    throw new Error(
                        'Falló la carga y también la restauración del archivo anterior. Verifica Storage; la firma no se confirmó.'
                    );
                }

                try {
                    const refreshed =
                        await refreshPatientSignatureStatus(patientId);

                    if (refreshed.error) {
                        updatePatientSignatureStatus(
                            null,
                            refreshed.error,
                            patientId
                        );
                    }
                } catch (statusError) {
                    console.error(
                        'No se pudo verificar la firma anterior tras el fallo de Storage:',
                        statusError
                    );
                    updatePatientSignatureStatus(
                        null,
                        statusError,
                        patientId
                    );
                }

                throw new Error(
                    'No fue posible guardar la imagen en Storage. La firma anterior se conservó.'
                );
            }

            const signedAt = new Date().toISOString();

            let updateResult;

            try {
                updateResult = await supabaseClient
                    .from('medical_history')
                    .update({
                        signature_path: signaturePath,
                        signed_at: signedAt
                    })
                    .eq('patient_id', patientId)
                    .select('id, signature_path, signed_at');
            } catch (error) {
                updateResult = { data: null, error };
            }

            let savedHistory = null;

            if (!updateResult.error && Array.isArray(updateResult.data)) {
                if (
                    updateResult.data.length === 1 &&
                    signatureMetadataMatches(
                        updateResult.data[0],
                        signaturePath,
                        signedAt
                    )
                ) {
                    savedHistory = updateResult.data[0];
                }
            }

            if (!savedHistory) {
                let verification;

                try {
                    verification =
                        await getPatientSignatureRecord(patientId);
                } catch (verificationError) {
                    verification = {
                        data: null,
                        error: verificationError
                    };
                }

                if (verification.error) {
                    console.error(
                        'No se pudo verificar el resultado del guardado de la firma:',
                        verification.error
                    );
                    uploadedSignaturePath = null;
                    patientSignatureStatus.textContent =
                        'Estado de firma: pendiente de verificación. No se restauró ni eliminó el PNG porque la base de datos podría apuntar a la firma nueva.';
                    throw new Error(
                        'El resultado del guardado es indeterminado. El archivo se conservó; vuelve a consultar el estado antes de reintentar.'
                    );
                }

                if (signatureMetadataMatches(
                    verification.data,
                    signaturePath,
                    signedAt
                )
                ) {
                    savedHistory = verification.data;
                }
            }

            if (!savedHistory) {
                try {
                    await restorePatientSignatureFile(
                        signaturePath,
                        backupBlob
                    );
                    uploadedSignaturePath = null;
                } catch (restoreError) {
                    console.error(
                        'Error al restaurar la firma anterior tras fallo de base de datos:',
                        restoreError
                    );
                    updatePatientSignatureStatus(
                        null,
                        restoreError,
                        patientId
                    );
                    throw new Error(
                        'La imagen se cargó, pero la base de datos no confirmó el guardado y Storage no pudo restaurarse. La firma no se muestra como confirmada.'
                    );
                }

                const refreshed =
                    await refreshPatientSignatureStatus(patientId);

                if (refreshed.error) {
                    updatePatientSignatureStatus(
                        null,
                        refreshed.error,
                        patientId
                    );
                    throw new Error(
                        'No se confirmó el guardado. Storage se restauró, pero no se pudo verificar el estado actual.'
                    );
                }

                if (
                    !refreshed.data ||
                    refreshed.data.signature_path !==
                        medicalHistory.signature_path ||
                    refreshed.data.signed_at !== medicalHistory.signed_at
                ) {
                    patientSignatureStatus.textContent =
                        'El guardado falló parcialmente; la firma queda pendiente de verificación.';
                }

                throw new Error(
                    'La base de datos no confirmó la firma; se restauró el archivo anterior.'
                );
            }

            uploadedSignaturePath = null;

            updatePatientSignatureStatus(
                savedHistory,
                null,
                patientId
            );

            let cleanupWarning = '';

            if (
                medicalHistory.signature_path &&
                medicalHistory.signature_path !== signaturePath &&
                isPatientSignaturePathForPatient(
                    medicalHistory.signature_path,
                    patientId
                )
            ) {
                try {
                    const { error: cleanupError } = await storage.remove([
                        medicalHistory.signature_path
                    ]);

                    if (cleanupError) {
                        throw cleanupError;
                    }
                } catch (cleanupError) {
                    console.error(
                        'No se pudo retirar el archivo de firma anterior:',
                        cleanupError
                    );
                    cleanupWarning =
                        ' La firma nueva está guardada, pero no se pudo retirar el archivo anterior.';
                }
            }

            uploadedSignaturePath = null;

            patientSignatureModal.classList.add('hidden');
            patientReviewedHistoryCheckbox.checked = false;
            clearPatientSignature();

            showSuccessModal(
                cleanupWarning
                    ? 'Firma guardada con advertencia'
                    : 'Firma guardada',
                cleanupWarning
                    ? `El historial quedó firmado correctamente.${cleanupWarning}`
                    : 'El historial médico quedó firmado correctamente.'
            );
        } catch (error) {
            console.error('Error al guardar la firma:', error);
            patientSignatureMessage.textContent =
                error.message || 'No fue posible guardar la firma.';
        } finally {
            if (uploadedSignaturePath) {
                try {
                    await restorePatientSignatureFile(
                        uploadedSignaturePath,
                        backupBlob
                    );
                    uploadedSignaturePath = null;
                    patientSignatureMessage.textContent +=
                        ' Se restauró el archivo anterior; la firma nueva no está confirmada.';
                } catch (restoreError) {
                    console.error(
                        'Error al restaurar la firma tras un fallo parcial:',
                        restoreError
                    );
                    updatePatientSignatureStatus(
                        null,
                        restoreError,
                        patientId
                    );
                    patientSignatureMessage.textContent +=
                        ' No se pudo restaurar el archivo anterior; verifica Storage. La firma no se confirmó.';
                }

                if (!uploadedSignaturePath) {
                    try {
                        const refreshed =
                            await refreshPatientSignatureStatus(patientId);

                        if (
                            refreshed.error ||
                            !refreshed.data ||
                            refreshed.data.signature_path !==
                                previousSignatureMetadata.signature_path ||
                            refreshed.data.signed_at !==
                                previousSignatureMetadata.signed_at
                        ) {
                            patientSignatureStatus.textContent =
                                'El guardado falló parcialmente; la firma queda pendiente de verificación.';
                        }
                    } catch (statusError) {
                        console.error(
                            'No se pudo verificar el estado tras restaurar Storage:',
                            statusError
                        );
                        updatePatientSignatureStatus(
                            null,
                            statusError,
                            patientId
                        );
                    }
                }
            }

            patientSignatureIsSaving = false;
            savePatientSignatureButton.disabled = false;
            savePatientSignatureButton.textContent = 'Confirmar firma';
        }
    }
);
