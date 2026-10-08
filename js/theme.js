/* ============================================
   theme.js
   Toggle de tema claro/oscuro con persistencia
   Aplica a TODA la página (incluye formulario de
   nuevo paciente y listado de pacientes), porque
   la clase se agrega en <body> y afecta a todo
   lo que esté dentro.
   ============================================ */

// 1) Aplicar el tema guardado LO ANTES POSIBLE,
//    para evitar el "parpadeo" de claro -> oscuro.
//    Esta parte se ejecuta apenas se carga el script,
//    sin esperar a DOMContentLoaded.
(function aplicarTemaInicial() {
    const temaGuardado = localStorage.getItem("theme");
    const prefiereOscuroSistema = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    const debeUsarOscuro = temaGuardado
        ? temaGuardado === "dark"
        : prefiereOscuroSistema;

    if (debeUsarOscuro) {
        document.documentElement.classList.add("dark-mode-preload");
        // Nota: usamos <html> aquí porque <body> puede no existir todavía
        // en este punto tan temprano de la carga.
    }
})();

document.addEventListener("DOMContentLoaded", function () {

    // 2) Pasar la clase de <html> (preload) a <body>,
    //    que es donde realmente vive tu CSS .dark-mode
    const debeIniciarOscuro = document.documentElement.classList.contains(
        "dark-mode-preload"
    );
    document.documentElement.classList.remove("dark-mode-preload");

    if (debeIniciarOscuro) {
        document.body.classList.add("dark-mode");
    }

    actualizarBoton(debeIniciarOscuro);

});

// 3) DELEGACIÓN DE EVENTOS: escucha clics en todo el documento
//    en vez de buscar #themeToggle una sola vez. Esto funciona
//    aunque el botón:
//    - esté oculto al cargar (display:none, dentro de un tab/sección)
//    - se cree DESPUÉS de forma dinámica (fetch, innerHTML, JS)
//    - se reemplace/recree varias veces
document.addEventListener("click", function (event) {
    const boton = event.target.closest("#themeToggle");
    if (!boton) return; // el clic no fue en el botón de tema

    const esOscuroAhora = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", esOscuroAhora ? "dark" : "light");
    actualizarBoton(esOscuroAhora);
});

// 4) Actualiza el ícono y la etiqueta del botón
function actualizarBoton(esOscuro) {
    const icon = document.getElementById("themeIcon");
    const label = document.querySelector("#themeToggle .theme-toggle-label");

    if (icon) {
        icon.innerHTML = esOscuro
            ? '<svg class="theme-icon-moon" viewBox="0 0 20 20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15.8 12.1A6.5 6.5 0 0 1 7.9 4.2a6.5 6.5 0 1 0 7.9 7.9Z" /></svg>'
            : '<svg class="theme-icon-sun" viewBox="0 0 20 20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="3" /><path d="M10 2v1.5M10 16.5V18M18 10h-1.5M3.5 10H2m13.66-5.66-1.06 1.06M5.4 14.6l-1.06 1.06m11.32 0-1.06-1.06M5.4 5.4 4.34 4.34" /></svg>';
    }

    if (label) label.textContent = esOscuro ? "Modo claro" : "Modo oscuro";
}
