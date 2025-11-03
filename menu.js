// Menú hamburguesa con cambio de ícono
(function () {
  const btn = document.getElementById("menuToggle");
  const menu = document.getElementById("menuLista");

  if (!btn || !menu) return;

  btn.addEventListener("click", function () {
    const abierto = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", abierto ? "true" : "false");
    btn.textContent = abierto ? "✖ Cerrar" : "☰ Menú";
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "☰ Menú";
    });
  });
})();
