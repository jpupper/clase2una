let seed;
let btnRegenerar;
let btnFullscreen;
let btnTogglePanel;
let panel;
let panelVisible = true;

// Sliders y sus etiquetas
let sliderElementos, sliderDensidadLineas, sliderGrosor, sliderCurvatura, sliderCaosColor;
let labelElementos, labelDensidadLineas, labelGrosor, labelCurvatura, labelCaosColor;

// Paleta inspirada en Kandinsky (fondos cálidos/crema, tintas negras y acentos primarios/contrastantes)
const PALETA = [
  '#E63946', // Rojo bermellón
  '#1D3557', // Azul prusiano profundo
  '#457B9D', // Azul cerúleo
  '#F4A261', // Ocre / Naranja suave
  '#E76F51', // Siena quemado
  '#2A9D8F', // Verde esmeralda apagado
  '#E9C46A', // Amarillo cálido
  '#1A1A1A', // Negro tinta
  '#F7F4EA'  // Hueso / pergamino
];

function setup() {
  // Canvas a pantalla completa
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(document.body);
  angleMode(DEGREES);

  // Botón flotante para reabrir controles cuando el panel está oculto
  btnTogglePanel = createButton('⚙ Controles');
  btnTogglePanel.id('toggle-panel-btn');
  btnTogglePanel.mousePressed(togglePanel);

  // Panel de control flotante
  panel = createDiv();
  panel.id('controls-panel');

  // Cabecera del panel
  let header = createDiv().parent(panel).addClass('panel-header');
  createSpan('🎨 Kandinsky Generativo').parent(header).addClass('panel-title');
  let btnClose = createButton('✕').parent(header).addClass('panel-close-btn');
  btnClose.attribute('title', 'Ocultar panel (H)');
  btnClose.mousePressed(togglePanel);

  // Botones de acción principales
  let btnRow = createDiv().parent(panel).addClass('buttons-group');
  btnRegenerar = createButton('🎲 Regenerar').parent(btnRow).addClass('btn-action btn-regenerate');
  btnRegenerar.attribute('title', 'Regenerar composición (Espacio)');
  btnRegenerar.mousePressed(regenerarParametros);

  btnFullscreen = createButton('⛶ Pantalla Completa').parent(btnRow).addClass('btn-action btn-fullscreen');
  btnFullscreen.attribute('title', 'Alternar Pantalla Completa (F)');
  btnFullscreen.mousePressed(toggleFullscreenMode);

  // Contenedor de Sliders
  let slidersContainer = createDiv().parent(panel).addClass('slider-group');

  // Sliders y Etiquetas
  let row1 = createDiv().parent(slidersContainer).addClass('slider-row');
  labelElementos = createSpan().parent(row1).addClass('slider-label');
  sliderElementos = createSlider(10, 60, 30, 1).parent(row1).addClass('slider-control');

  let row2 = createDiv().parent(slidersContainer).addClass('slider-row');
  labelDensidadLineas = createSpan().parent(row2).addClass('slider-label');
  sliderDensidadLineas = createSlider(3, 25, 10, 1).parent(row2).addClass('slider-control');

  let row3 = createDiv().parent(slidersContainer).addClass('slider-row');
  labelGrosor = createSpan().parent(row3).addClass('slider-label');
  sliderGrosor = createSlider(1, 12, 3, 0.5).parent(row3).addClass('slider-control');

  let row4 = createDiv().parent(slidersContainer).addClass('slider-row');
  labelCurvatura = createSpan().parent(row4).addClass('slider-label');
  sliderCurvatura = createSlider(0, 100, 50, 1).parent(row4).addClass('slider-control');

  let row5 = createDiv().parent(slidersContainer).addClass('slider-row');
  labelCaosColor = createSpan().parent(row5).addClass('slider-label');
  sliderCaosColor = createSlider(1, 10, 5, 1).parent(row5).addClass('slider-control');

  // Indicador de atajos de teclado
  let hints = createDiv('Atajos: <b>[F]</b> Pantalla Completa &nbsp;|&nbsp; <b>[Espacio]</b> Regenerar &nbsp;|&nbsp; <b>[H]</b> Ocultar Panel')
    .parent(panel)
    .addClass('panel-hints');

  // Inicializar con valores aleatorios
  regenerarParametros();
}

function togglePanel() {
  panelVisible = !panelVisible;
  if (panelVisible) {
    panel.removeClass('collapsed');
    btnTogglePanel.removeClass('visible');
  } else {
    panel.addClass('collapsed');
    btnTogglePanel.addClass('visible');
  }
}

function toggleFullscreenMode() {
  let fs = fullscreen();
  fullscreen(!fs);
  actualizarBotonFullscreen(!fs);
}

function actualizarBotonFullscreen(isFs) {
  if (btnFullscreen) {
    if (isFs) {
      btnFullscreen.html('⛶ Salir');
    } else {
      btnFullscreen.html('⛶ Pantalla Completa');
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  actualizarBotonFullscreen(fullscreen());
}

function keyPressed() {
  if (key === 'f' || key === 'F') {
    toggleFullscreenMode();
  } else if (key === ' ') {
    regenerarParametros();
  } else if (key === 'h' || key === 'H') {
    togglePanel();
  }
}

function regenerarParametros() {
  seed = floor(random(1000000));

  // Asignar nuevos valores aleatorios a los sliders
  sliderElementos.value(floor(random(15, 50)));
  sliderDensidadLineas.value(floor(random(5, 20)));
  sliderGrosor.value(floor(random(1, 8)));
  sliderCurvatura.value(floor(random(20, 90)));
  sliderCaosColor.value(floor(random(1, 10)));
}

function actualizarEtiquetas() {
  labelElementos.html(`Cantidad de Figuras: ${sliderElementos.value()}`);
  labelDensidadLineas.html(`Líneas de Tensión: ${sliderDensidadLineas.value()}`);
  labelGrosor.html(`Grosor de Trazo: ${sliderGrosor.value()}px`);
  labelCurvatura.html(`Curvas vs Rectas: ${sliderCurvatura.value()}%`);
  labelCaosColor.html(`Variación Cromática: ${sliderCaosColor.value()}`);
}

function draw() {
  actualizarEtiquetas();

  // La semilla mantiene fija la distribución espacial mientras ajustás sliders
  randomSeed(seed);

  // Fondo sutil estilo tela / papel envejecido
  background('#F5F0E1');
  dibujarTexturaFondo();

  let numElementos = sliderElementos.value();
  let numLineas = sliderDensidadLineas.value();
  let baseStroke = sliderGrosor.value();
  let probCurva = sliderCurvatura.value();

  // 1. Redes de líneas tensas y diagonales que cruzan el plano (estructurales)
  for (let i = 0; i < numLineas; i++) {
    push();
    stroke(random(PALETA));
    strokeWeight(random(1, baseStroke * 1.5));
    if (random() > 0.4) stroke('#1A1A1A');

    let x1 = random(-50, width + 50);
    let y1 = random(-50, height + 50);
    let x2 = random(-50, width + 50);
    let y2 = random(-50, height + 50);

    line(x1, y1, x2, y2);

    // Cruzamientos menores o perpendiculares tipo Kandinsky
    if (random() > 0.6) {
      let mx = lerp(x1, x2, random(0.2, 0.8));
      let my = lerp(y1, y2, random(0.2, 0.8));
      let ang = random(30, 90);
      let len = random(20, 100);
      push();
      translate(mx, my);
      rotate(ang);
      line(-len / 2, 0, len / 2, 0);
      pop();
    }
    pop();
  }

  // 2. Formas geométricas principales: Círculos concéntricos, polígonos, arcos
  for (let i = 0; i < numElementos; i++) {
    push();
    let x = random(width * 0.1, width * 0.9);
    let y = random(height * 0.1, height * 0.9);
    translate(x, y);
    rotate(random(360));

    let col = color(random(PALETA));
    col.setAlpha(random(160, 240));
    fill(col);

    stroke('#1A1A1A');
    strokeWeight(random(0.5, baseStroke));

    let tipo = floor(random(5));
    let tam = random(30, 160);

    if (random(100) < probCurva) {
      // Formas curvas: Círculos concéntricos o Semicírculos/Arcos
      if (tipo % 2 === 0) {
        // Círculos concéntricos
        ellipse(0, 0, tam, tam);
        if (random() > 0.3) {
          fill(random(PALETA));
          ellipse(0, 0, tam * 0.6, tam * 0.6);
        }
        if (random() > 0.5) {
          fill(random(PALETA));
          ellipse(0, 0, tam * 0.25, tam * 0.25);
        }
      } else {
        // Semicírculo / Arco segmentado
        arc(0, 0, tam, tam, 0, 180, PIE);
        if (random() > 0.5) {
          fill(random(PALETA));
          arc(0, 0, tam * 0.6, tam * 0.6, 180, 360, CHORD);
        }
      }
    } else {
      // Formas angulares: Triángulos, polígonos y grillas
      if (tipo === 1) {
        // Triángulo dinámico
        let x1 = 0, y1 = -tam * 0.6;
        let x2 = tam * 0.5, y2 = tam * 0.5;
        let x3 = -tam * 0.5, y3 = tam * 0.4;
        triangle(x1, y1, x2, y2, x3, y3);
      } else if (tipo === 2) {
        // Polígono irregular libre
        beginShape();
        let lados = floor(random(4, 7));
        for (let a = 0; a < 360; a += 360 / lados) {
          let r = tam * 0.5 * random(0.6, 1.2);
          vertex(cos(a) * r, sin(a) * r);
        }
        endShape(CLOSE);
      } else {
        // Cuadrilátero estilizado / Tablero pequeño
        rectMode(CENTER);
        rect(0, 0, tam * 0.7, tam * 0.7);
        if (random() > 0.5) {
          line(-tam * 0.35, 0, tam * 0.35, 0);
          line(0, -tam * 0.35, 0, tam * 0.35);
        }
      }
    }
    pop();
  }

  // 3. Arcos libres y curvas flotantes
  let arcosSueltos = floor(numElementos * 0.4);
  for (let i = 0; i < arcosSueltos; i++) {
    push();
    noFill();
    stroke(random(PALETA));
    strokeWeight(random(1, baseStroke * 1.8));
    let x = random(width);
    let y = random(height);
    let r = random(60, 250);
    let startAng = random(360);
    let sweep = random(45, 220);
    arc(x, y, r, r, startAng, startAng + sweep);
    pop();
  }
}

// Simula la rugosidad mate del soporte pictórico escalado al área visible
function dibujarTexturaFondo() {
  push();
  stroke(40, 30, 20, 15);
  strokeWeight(1);
  let numPuntos = floor((width * height) / 1600);
  for (let i = 0; i < numPuntos; i++) {
    point(random(width), random(height));
  }
  pop();
}