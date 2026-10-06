/* ============================================
   dom-refs.js
   Referencias a elementos del DOM extraídas de app.js.
   Ningún nombre de variable ni selector fue modificado
   respecto al original — solo se movieron de lugar.

   Debe cargarse ANTES que app.js en index.html.
   ============================================ */

const loginView =
    document.getElementById('loginView');

const dashboardView =
    document.getElementById('dashboardView');

const loginForm =
    document.getElementById('loginForm');

const loginMessage =
    document.getElementById('loginMessage');

const welcomeMessage =
    document.getElementById('welcomeMessage');

const logoutButton =
    document.getElementById('logoutButton');

const patientsView =
    document.getElementById('patientsView');

const patientsButton =
    document.getElementById('patientsButton');

const newPatientButton =
    document.getElementById('newPatientButton');

const newPatientButtonList =
    document.getElementById('newPatientButtonList');

const backToDashboard =
    document.getElementById('backToDashboard');

const patientsTableBody =
    document.getElementById('patientsTableBody');

const patientsMessage =
    document.getElementById('patientsMessage');

const patientSearch =
    document.getElementById('patientSearch');

const patientDetailView =
    document.getElementById('patientDetailView');

const backToPatientsButton =
    document.querySelector('.fp-back-link');

const editPatientButton =
    document.getElementById('editPatientButton');

const editPatientView =
    document.getElementById('editPatientView');

const newPatientView =
    document.getElementById('newPatientView');

const newClinicalNoteView =
    document.getElementById('newClinicalNoteView');

const newPatientForm =
    document.getElementById('newPatientForm');

const cancelNewPatientButton =
    document.getElementById('cancelNewPatientButton');

const cancelNewPatientButtonBottom =
    document.getElementById('cancelNewPatientButtonBottom');

const newPatientMessage =
    document.getElementById('newPatientMessage');

const patientFullName =
    document.getElementById('fp-nombre-completo');

const detailFirstName =
    document.getElementById('detailFirstName');

const detailLastName =
    document.getElementById('detailLastName');

const detailBirthDate =
    document.getElementById('detailBirthDate');

const detailGender =
    document.getElementById('detailGender');

const detailPhone =
    document.getElementById('detailPhone');

const detailEmail =
    document.getElementById('detailEmail');

const detailAddress =
    document.getElementById('detailAddress');

const detailStatus =
    document.getElementById('fp-estado');

const patientStatusDot =
    document.getElementById('fp-status-dot');

const detailAllergies =
    document.getElementById('detailAllergies');

const detailAllergyAnesthetics =
    document.getElementById('detailAllergyAnesthetics');

const detailMedications =
    document.getElementById('detailMedications');

const detailMedicalConditions =
    document.getElementById('detailMedicalConditions');

const detailHypertension =
    document.getElementById('detailHypertension');

const detailDiabetes =
    document.getElementById('detailDiabetes');

const detailHeartDisease =
    document.getElementById('detailHeartDisease');

const detailBleedingDisorder =
    document.getElementById('detailBleedingDisorder');

const detailPregnancy =
    document.getElementById('detailPregnancy');

const detailPreviousSurgery =
    document.getElementById('detailPreviousSurgery');

const detailAnesthesiaReaction =
    document.getElementById('detailAnesthesiaReaction');

const detailSmoking =
    document.getElementById('detailSmoking');

const detailAlcohol =
    document.getElementById('detailAlcohol');

const detailOtherConditions =
    document.getElementById('detailOtherConditions');

const detailSurgeryDetails =
    document.getElementById('detailSurgeryDetails');

const detailAnesthesiaReactionDetails =
    document.getElementById(
        'detailAnesthesiaReactionDetails'
    );

const detailMedicalNotes =
    document.getElementById('detailMedicalNotes');

const clinicalNotesContainer =
    document.getElementById('clinicalNotesContainer');

const clinicalNotesMessage =
    document.getElementById('clinicalNotesMessage');

const newClinicalNoteButton =
    document.getElementById('newClinicalNoteButton');

const cancelClinicalNoteButton =
    document.getElementById('cancelClinicalNoteButton');

const cancelClinicalNoteButtonBottom =
    document.getElementById('cancelClinicalNoteButtonBottom');

const newClinicalNoteForm =
    document.getElementById('newClinicalNoteForm');

const clinicalNoteDate =
    document.getElementById('clinicalNoteDate');

const newTreatmentButton =
    document.getElementById('newTreatmentButton');

const newTreatmentView =
    document.getElementById('newTreatmentView');

const cancelTreatmentButton =
    document.getElementById('cancelTreatmentButton');

const cancelTreatmentButtonBottom =
    document.getElementById('cancelTreatmentButtonBottom');

const newTreatmentForm =
    document.getElementById('newTreatmentForm');

const treatmentStartDate =
    document.getElementById('treatmentStartDate');

const treatmentsContainer =
    document.getElementById('treatmentsContainer');

const treatmentsMessage =
    document.getElementById('treatmentsMessage');

const editTreatmentView =
    document.getElementById('editTreatmentView');

const editTreatmentForm =
    document.getElementById('editTreatmentForm');

const editTreatmentName =
    document.getElementById('editTreatmentName');

const editTreatmentDescription =
    document.getElementById('editTreatmentDescription');

const editTreatmentStatus =
    document.getElementById('editTreatmentStatus');

const editTreatmentStartDate =
    document.getElementById('editTreatmentStartDate');

const editTreatmentEndDate =
    document.getElementById('editTreatmentEndDate');

const editTreatmentEstimatedCost =
    document.getElementById('editTreatmentEstimatedCost');

const editTreatmentNotes =
    document.getElementById('editTreatmentNotes');

const patientDetailMessage =
    document.getElementById('patientDetailMessage');

/* ---- Referencias que en app.js estaban declaradas
   a mitad de archivo, cerca de donde se usan por
   primera vez. Se centralizan aquí sin cambiar nombres
   ni selectores. ---- */

const editMedicalHistoryButton =
    document.getElementById('editMedicalHistoryButton');

const editMedicalHistoryView =
    document.getElementById('editMedicalHistoryView');

const cancelEditMedicalHistoryButton =
    document.getElementById('cancelEditMedicalHistoryButton');

const cancelEditMedicalHistoryButtonBottom =
    document.getElementById('cancelEditMedicalHistoryButtonBottom');

const editMedicalHistoryForm =
    document.getElementById('editMedicalHistoryForm');

const editPatientForm =
    document.getElementById('editPatientForm');

const cancelEditPatientButton =
    document.getElementById('cancelEditPatientButton');

const cancelEditPatientButtonBottom =
    document.getElementById('cancelEditPatientButtonBottom');

const logoutConfirmModal = document.getElementById('logoutConfirmModal');
const cancelLogoutModalButton = document.getElementById('cancelLogoutModalButton');
const confirmLogoutModalButton = document.getElementById('confirmLogoutModalButton');

const successModal =
    document.getElementById('successModal');

const successModalTitle =
    document.getElementById('successModalTitle');

const successModalMessage =
    document.getElementById('successModalMessage');

const successModalButton =
    document.getElementById('successModalButton');
