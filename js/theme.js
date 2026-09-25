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

// 4) Actualiza solo el ícono del botón (sin etiqueta de texto)
function actualizarBoton(esOscuro) {
    const icon = document.getElementById("themeIcon");
    if (icon) icon.textContent = esOscuro ? "☀️" : "🌙";
}