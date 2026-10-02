/* ============================================
   navigation.js
   Navegación general de la SPA: login/dashboard, cambio
   entre vistas del sidebar (showView, setActiveNavItem),
   botones del menú lateral y el reloj del dashboard.

   Extraído de app.js tal cual, sin cambios de comportamiento.

   Depende de las referencias declaradas en dom-refs.js
   (loginView, dashboardView, patientsView, etc.) y de
   loadPatients() / newPatientForm.reset(), que hoy siguen
   viviendo en app.js — funciona porque esas llamadas ocurren
   dentro de listeners (diferidas), nunca de forma inmediata.
   Debe cargarse después de dom-refs.js.
   ============================================ */

// ========================================
// MOSTRAR LOGIN
// ========================================

function showLogin() {

    // Ocultar todo el cascarón del sistema (sidebar y vistas)
    const appShell = document.querySelector('.app-shell');
    if (appShell) {
        appShell.classList.add('hidden');
    }

    // Ocultar todas las pantallas internas
    const allViews = [
        dashboardView,
        patientsView,
        patientDetailView,
        editPatientView,
        editMedicalHistoryView,
        newPatientView,
        newClinicalNoteView,
        newTreatmentView,
        editTreatmentView
    ];

    allViews.forEach(function (view) {
        if (view) {
            view.classList.add('hidden');
        }
    });

    // Mostrar la pantalla de inicio de sesión
    if (loginView) {
        loginView.classList.remove('hidden');
    }

    document.body.classList.remove('dashboard-active');
    window.scrollTo(0, 0);

}


// ========================================
// MOSTRAR DASHBOARD
// ========================================

function showDashboard() {

    // Mostrar el cascarón del sistema
    const appShell = document.querySelector('.app-shell');
    if (appShell) {
        appShell.classList.remove('hidden');
    }

    if (loginView) {
        loginView.classList.add('hidden');
    }

    if (dashboardView) {
        dashboardView.classList.remove('hidden');
    }

    setActiveNavItem('dashboardNavItem');

    document.body.classList.add('dashboard-active');

}


// ========================================
// NAVEGACIÓN DEL SIDEBAR
// ========================================
// Antes cada botón sabía "de qué vista venía" y ocultaba
// solo esa. Con el sidebar fijo, cualquier botón de
// navegación puede pulsarse desde CUALQUIER vista, así que
// necesitamos una función genérica que oculte todas las
// vistas y muestre únicamente la solicitada.

function showView(targetView) {

    const allViews = [
        dashboardView,
        patientsView,
        patientDetailView,
        editPatientView,
        editMedicalHistoryView,
        newPatientView,
        newClinicalNoteView,
        newTreatmentView,
        editTreatmentView
    ];

    allViews.forEach(function (view) {

        if (view) {
            view.classList.add('hidden');
        }
    });

    targetView.classList.remove('hidden');
}


function setActiveNavItem(navItemId) {

    const navItems =
        document.querySelectorAll('.sidebar .nav-item');

    navItems.forEach(function (item) {
        item.classList.remove('active');
    });

    const activeItem =
        document.getElementById(navItemId);

    if (activeItem) {
        activeItem.classList.add('active');
    }
}


document
    .getElementById('dashboardNavButton')
    .addEventListener('click', function () {

        showView(dashboardView);
        setActiveNavItem('dashboardNavItem');

    });


patientsButton.addEventListener(
    'click',
    async function () {

        showView(patientsView);
        setActiveNavItem('patientsNavItem');

        await loadPatients();

    }
);


newPatientButton.addEventListener(
    'click',
    function () {

        newPatientOrigin = 'dashboard';

        showView(newPatientView);
        setActiveNavItem('newPatientNavItem');

        newPatientForm.reset();
        newPatientMessage.textContent = '';
    }
);


newPatientButtonList.addEventListener(
    'click',
    function () {

        newPatientOrigin = 'patients';

        showView(newPatientView);
        setActiveNavItem('newPatientNavItem');

        newPatientForm.reset();
        newPatientMessage.textContent = '';
    }
);


backToDashboard.addEventListener(
    'click',
    function () {

        patientsView.classList.add('hidden');

        dashboardView.classList.remove('hidden');

        setActiveNavItem('dashboardNavItem');

    }
);


/* ========================================
   FECHA Y HORA - DASHBOARD
   ======================================== */

function updateDashboardClock() {
    const now = new Date();

    const date = now.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const time = now.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const dateElement = document.getElementById('dashboard-date');
    const timeElement = document.getElementById('dashboard-time');

    if (dateElement) {
        dateElement.textContent = date;
    }

    if (timeElement) {
        timeElement.textContent = time;
    }
}

updateDashboardClock();
setInterval(updateDashboardClock, 1000);
