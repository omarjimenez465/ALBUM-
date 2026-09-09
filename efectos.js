// Selección de elementos
const images = document.querySelectorAll('.gallery img');
const overlay = document.querySelector('.overlay');
const overlayBg = document.querySelector('.overlay-bg'); 
const zoomed = document.getElementById('zoomed');
const player = document.getElementById('player');
const corazonesContainer = document.querySelector('.corazones');

// Configuración de AudioContext y Analyser
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(player);
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Conexiones de audio
source.connect(analyser);
analyser.connect(audioCtx.destination);

// Función para crear corazones flotantes
function crearCorazon() {
  const corazon = document.createElement('div');
  corazon.classList.add('corazon');
  corazon.textContent = '💗'; 

  corazon.style.left = Math.random() * 100 + 'vw';
  corazon.style.fontSize = (20 + Math.random() * 20) + 'px';

  corazonesContainer.appendChild(corazon);

  setTimeout(() => {
    corazon.remove();
  }, 6000);
}

// Generar corazones cada medio segundo
setInterval(crearCorazon, 500);

// Color inicial por defecto
let currentColor = [255,0,100];

// Animación del overlay según la música
function animateOverlay() {
  analyser.getByteFrequencyData(dataArray);
  let bass = 0;
  for (let i =  ​0; i < 10; i++) bass += dataArray[i];
  bass = bass / 10;

  overlayBg.style.backgroundColor = 
    `rgba(${currentColor[0]},${currentColor[1]},${currentColor[2]},${0.2 + bass/255 * 0.4})`;

  if (!player.paused) requestAnimationFrame(animateOverlay);
}

// Evento al hacer clic en una imagen
images.forEach(img => {
  img.addEventListener('click', () => {
    zoomed.src = img.src;
    overlay.classList.add("active");

    player.src = img.dataset.song;
    player.play();

    currentColor = img.dataset.colors.split(",").map(Number);

    audioCtx.resume();
    animateOverlay();
  });
});

// Evento al cerrar el overlay
overlay.addEventListener('click', () => {
  overlay.classList.remove("active");
  zoomed.src = "";
  player.pause();
  player.currentTime = 0;
});

// ===== CONTADOR DE ANIVERSARIO =====
function calcularAniversario() {
  const hoy = new Date();
  let anio = hoy.getFullYear();
  let mes = hoy.getMonth();

  // Si hoy es 23 o ya pasó, pasa al siguiente mes
  if (hoy.getDate() >= 9) {
    mes++;
    if (mes > 8) { mes =  ​0; anio++; }
  }

  const fechaAniv = new Date(anio, mes,  ​23);
  const diff = Math.ceil((fechaAniv - hoy) / (1000 * 60 *  ​60 *  ​24));
  const dias = diff ===  ​1 ? "1 día" : diff + " días";

  document.getElementById("contador").textContent =
    `Faltan ${dias} para nuestro aniversario 💕`;
}

calcularAniversario();
