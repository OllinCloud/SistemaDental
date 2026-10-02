/* ============================================
   auth.js
   Autenticación con Supabase: cargar perfil, iniciar sesión,
   cerrar sesión (con modal de confirmación) y comprobar si
   ya existe una sesión al cargar la página.

   Extraído de app.js tal cual, sin cambios de comportamiento.

   IMPORTANTE — ORDEN DE CARGA:
   Este archivo debe cargarse DESPUÉS de app.js, porque
   supabaseClient todavía se declara allí y checkSession()
   se ejecuta de inmediato al final de este archivo.
   (Cuando supabaseClient se extraiga a su propio módulo,
   este archivo podrá cargarse antes de app.js.)

   Depende de:
   - dom-refs.js: loginForm, loginMessage, welcomeMessage,
     logoutButton, logoutConfirmModal, cancelLogoutModalButton,
     confirmLogoutModalButton
   - navigation.js: showLogin(), showDashboard()
   - app.js: supabaseClient
   ============================================ */

// ========================================
// OBTENER PERFIL
// ========================================

async function loadProfile(userId) {

    const { data, error } =
        await supabaseClient
            .from('profiles')
            .select('first_name, last_name, role')
            .eq('id', userId)
            .single();


    if (error) {

        console.error(
            'Error obteniendo perfil:',
            error
        );

        welcomeMessage.textContent =
            'No fue posible cargar el perfil.';

        return;

    }


    welcomeMessage.textContent =
        `Bienvenido, ${data.first_name} ${data.last_name}`;

}


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
    'submit',
    async function (event) {

        event.preventDefault();


        const email =
            document.getElementById('email').value;

        const password =
            document.getElementById('password').value;


        loginMessage.textContent =
            'Iniciando sesión...';


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.error(error);

            loginMessage.textContent =
                'Correo o contraseña incorrectos.';

            return;

        }



        await loadProfile(data.user.id);

        showDashboard();

    }
);


// ========================================
// CERRAR SESIÓN CON MODAL DE ADVERTENCIA
// ========================================

// 1. Abrir modal de advertencia al presionar "Cerrar sesión"
if (logoutButton && logoutConfirmModal) {
    logoutButton.addEventListener('click', function () {
        logoutConfirmModal.classList.remove('hidden');
    });
}

// 2. Cerrar modal al presionar "Cancelar"
if (cancelLogoutModalButton && logoutConfirmModal) {
    cancelLogoutModalButton.addEventListener('click', function () {
        logoutConfirmModal.classList.add('hidden');
    });
}

// 3. Cerrar si el usuario hace clic fuera de la tarjeta (en el fondo oscuro)
if (logoutConfirmModal) {
    logoutConfirmModal.addEventListener('click', function (e) {
        if (e.target === logoutConfirmModal) {
            logoutConfirmModal.classList.add('hidden');
        }
    });
}

// Ejecutar cierre de sesión cuando el usuario confirma en el modal
if (confirmLogoutModalButton) {
    confirmLogoutModalButton.addEventListener('click', async function () {
        // 1. Cerrar la ventana emergente
        if (logoutConfirmModal) {
            logoutConfirmModal.classList.add('hidden');
        }

        // 2. Intentar cerrar sesión en Supabase sin bloquear la interfaz si falla
        try {
            await supabaseClient.auth.signOut();
        } catch (err) {
            console.warn('Advertencia al cerrar sesión:', err);
        }

        // 3. Limpiar campos del formulario de login
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (loginMessage) loginMessage.textContent = '';

        // 4. Siempre enviar al usuario a la pantalla de login
        showLogin();
    });
}

// COMPROBAR SESIÓN EXISTENTE
// ========================================

async function checkSession() {

    const { data } =
        await supabaseClient.auth.getSession();


    if (data.session) {

        await loadProfile(
            data.session.user.id
        );

        showDashboard();

    } else {

        showLogin();

    }

}


checkSession();
