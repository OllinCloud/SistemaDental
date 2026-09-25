/* ============================================
   patient-indicators.js
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {

    const SIN_ALERGIA = ["no registrado", "ninguna", "ninguno", "no", "n/a", "sin alergias", "negativo", ""];
    const ACTIVO = ["activo"];

    function normalizar(texto) {
        return (texto || "").trim().toLowerCase();
    }

    function actualizarAlergia(elemento) {
        if (!elemento) return;
        const texto = normalizar(elemento.textContent);
        const hayAlergia = !SIN_ALERGIA.includes(texto);
        elemento.classList.toggle("has-allergy", hayAlergia);
    }

    function actualizarEstado(elemento) {
        if (!elemento) return;
        const texto = normalizar(elemento.textContent);
        const esActivo = ACTIVO.includes(texto);
        elemento.classList.toggle("is-inactive", !esActivo);
    }

    function revisarTodo() {
        // Alergias generales
        actualizarAlergia(
            document.getElementById("detailAllergies") || 
            document.querySelector('[data-field="alergias"]') ||
            document.querySelector('.alergias-val')
        );

        // Alergia a anestésicos
        actualizarAlergia(
            document.getElementById("detailAllergyAnesthetics") || 
            document.querySelector('[data-field="anestesicos"]') ||
            document.querySelector('.anestesicos-val')
        );
        
        // Estado
        actualizarEstado(
            document.getElementById("fp-estado") || 
            document.getElementById("detailStatus")
        );
    }

    // Revisar apenas carga la página
    revisarTodo();

    // Observar todo el contenedor de la ficha o el body para no perder ningún cambio
    const objetivo = document.getElementById("patientDetailView") || 
                     document.querySelector(".ficha-paciente") || 
                     document.querySelector("main") || 
                     document.body;

    if (objetivo) {
        const observer = new MutationObserver(revisarTodo);
        observer.observe(objetivo, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    }

});
