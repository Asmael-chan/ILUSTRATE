/* =============================================================
   CYBER.JS — Cursor Cyberpunk + Matrix Hacker Effect
   ILUSTRARTE — Revista Escolar Alberto Lleras
   ============================================================= */

/* ── 1. CURSOR CYBERPUNK ── */
(function () {
  // Crear el elemento del cursor
  const cursor = document.createElement('div');
  cursor.className = 'cyber-cursor';
  cursor.innerHTML = `
    <div class="cyber-cursor-outer"></div>
    <div class="cyber-cursor-dot"></div>
    <div class="cyber-cursor-cross"></div>
  `;
  document.body.appendChild(cursor);

  let mouseX = -100, mouseY = -100;
  let posX = -100, posY = -100;
  let raf;

  // Suavizado del cursor (lag effect)
  function animate() {
    posX += (mouseX - posX) * 0.18;
    posY += (mouseY - posY) * 0.18;
    cursor.style.left = posX + 'px';
    cursor.style.top  = posY + 'px';
    raf = requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover en elementos interactivos
  const interactivos = 'a, button, .boton-cyberpunk, .seccion, .sidebar-toggle, .sidebar-menu a';
  document.querySelectorAll(interactivos).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Click flash
  document.addEventListener('mousedown', () => cursor.querySelector('.cyber-cursor-outer').style.transform = 'translate(-50%,-50%) scale(0.7)');
  document.addEventListener('mouseup',   () => cursor.querySelector('.cyber-cursor-outer').style.transform = 'translate(-50%,-50%) scale(1)');

  animate();
})();


/* ── 2. MATRIX HACKER — CANVAS LATERAL ── */
(function () {
  // Crear canvas que ocupa solo los laterales
  const canvas = document.createElement('canvas');
  canvas.id = 'matrixCanvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 500;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Caracteres: binario + hex + katakana-like
  const CHARS = '01 10 01 11 00 10 1A 0F 3E B7 DF 4C 01 10 11 00 ア イ ウ エ オ カ キ ク 01 10 0xF 0x3 01 00 11 10'.split(' ');
  const VERDE     = '#00ff88';
  const VERDE_DIM = '#00aa55';
  const CYAN      = '#00f7ff';
  const BLANCO    = '#e0ffe8';

  let cols = [];
  const FONT_SIZE  = 13;
  const COL_WIDTH  = 16;   // px entre columnas
  const SIDE_W     = 90;   // ancho de cada banda lateral en px
  let W, H, leftCols, rightCols;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;

    // Solo creamos columnas en los márgenes laterales
    leftCols  = Math.floor(SIDE_W / COL_WIDTH);
    rightCols = Math.floor(SIDE_W / COL_WIDTH);

    // Reiniciar columnas
    cols = [];

    // Columnas lado izquierdo
    for (let i = 0; i < leftCols; i++) {
      cols.push(makeCol(i * COL_WIDTH + 4));
    }
    // Columnas lado derecho
    for (let i = 0; i < rightCols; i++) {
      cols.push(makeCol(W - SIDE_W + i * COL_WIDTH + 4));
    }
  }

  function makeCol(x) {
    return {
      x,
      y: randomBetween(-H, 0),            // posición Y inicial aleatoria
      speed: randomBetween(1.2, 3.8),     // velocidades distintas
      length: randomBetween(6, 22),        // largo de la "serpiente"
      chars: [],
      timer: 0,
      changeRate: randomBetween(3, 12),   // cada cuántos frames cambia el char
      color: Math.random() > 0.85 ? CYAN : VERDE,  // alguna columna cyan rara
      bright: Math.random() > 0.7,        // columnas más brillantes
    };
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function drawCol(col) {
    col.timer++;

    // Avanzar posición
    col.y += col.speed;

    // Si salió completamente de pantalla, reiniciar
    if (col.y - col.length * FONT_SIZE > H) {
      col.y = randomBetween(-H * 0.5, 0);
      col.speed = randomBetween(1.2, 3.8);
      col.length = randomBetween(6, 22);
      col.color = Math.random() > 0.85 ? CYAN : VERDE;
      col.bright = Math.random() > 0.7;
      col.chars = [];
    }

    // Regenerar chars periódicamente (efecto mutación)
    if (col.timer % col.changeRate === 0) {
      col.chars = [];
      for (let k = 0; k < col.length; k++) {
        col.chars[k] = randomChar();
      }
    }

    // Dibujar cada char de la serpiente
    for (let k = 0; k < col.length; k++) {
      const charY = col.y - k * FONT_SIZE;
      if (charY < 0 || charY > H) continue;

      const t = k / col.length; // 0 = cabeza, 1 = cola

      let alpha, color;

      if (k === 0) {
        // Cabeza: blanca/brillante
        color = BLANCO;
        alpha = 1;
      } else if (k < 3) {
        // Hombros: muy brillante
        color = col.color;
        alpha = col.bright ? 0.9 : 0.75;
      } else {
        // Cola: se desvanece
        color = col.color === CYAN ? CYAN : VERDE_DIM;
        alpha = Math.max(0, 0.65 - t * 0.7);
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle   = color;
      ctx.font        = `bold ${FONT_SIZE}px 'Courier New', monospace`;

      const ch = col.chars[k] || randomChar();
      ctx.fillText(ch, col.x, charY);

      // Glow en la cabeza
      if (k < 2) {
        ctx.shadowColor = col.color;
        ctx.shadowBlur  = col.bright ? 18 : 10;
      } else {
        ctx.shadowBlur = 0;
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
  }

  function loop() {
    // Limpiar solo los laterales con trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    // Izquierda
    ctx.fillRect(0, 0, SIDE_W, H);
    // Derecha
    ctx.fillRect(W - SIDE_W, 0, SIDE_W, H);

    cols.forEach(drawCol);

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();

  // Ocultar los .binario divs del HTML ya que usamos canvas
  document.querySelectorAll('.binario').forEach(el => el.style.display = 'none');
})();