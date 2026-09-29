# Clase 2 - UNA Artes Multimediales

Arte generativo interactivo inspirado en la obra abstracta y constructiva de Vasili Kandinsky, desarrollado con **p5.js**.

## 🎨 Características

- **Visualización a pantalla completa (Fullscreen):** El lienzo se adapta dinámicamente a la resolución de cualquier pantalla (`windowWidth`, `windowHeight`) y responde a eventos de redimensionamiento de ventana.
- **Panel de control HUD interactivo:** Permite manipular los parámetros visuales en tiempo real manteniendo el fondo visible con efecto de desenfoque (*glassmorphism*).
- **Parámetros configurables:**
  - *Cantidad de Figuras:* Densidad de formas geométricas centrales (círculos concéntricos, arcos, triángulos, polígonos).
  - *Líneas de Tensión:* Red estructural de líneas diagonales y transversales.
  - *Grosor de Trazo:* Calibre de contornos y líneas de tensión.
  - *Curvas vs Rectas:* Balance probabilístico entre formas angulares y circulares.
  - *Variación Cromática:* Ajuste de paleta armónica basada en pigmentos Kandinsky.
- **Generación determinista y semilla fija:** Mantén la composición fija mientras ajustas sliders gracias al control de semilla aleatoria (`randomSeed`).

## ⌨️ Atajos de teclado

| Tecla | Acción |
| :--- | :--- |
| **`F`** | Alternar modo Pantalla Completa (*Fullscreen*) |
| **`Espacio`** | Regenerar composición con nueva semilla y parámetros |
| **`H`** | Ocultar / Mostrar el panel de controles |

## 🚀 Cómo ejecutarlo

Puedes abrir directamente el archivo `index.html` en cualquier navegador web moderno, o servirlo localmente mediante cualquier servidor estático (por ejemplo: `npx serve .` o Live Server en VS Code).
