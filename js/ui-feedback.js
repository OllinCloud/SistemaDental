/* ============================================
   ui-feedback.js
   Modal de éxito reutilizable (showSuccessModal /
   closeSuccessModal), usado por patients.js, treatments.js,
   clinical-notes.js y medical-history.js — hoy, dentro de
   app.js — tras guardar cambios.

   Depende de las referencias successModal, successModalTitle,
   successModalMessage y successModalButton, declaradas en
   dom-refs.js. Debe cargarse después de ese archivo.
   ============================================ */

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
