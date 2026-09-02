const images = document.querySelectorAll('.gallery img');
const overlay = document.querySelector('.overlay');
const overlayBg = document.querySelector('.overlay-bg'); 
const zoomed = document.getElementById('zoomed');
const player = document.getElementById('player');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(player);
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const corazonesContainer = document.querySelector('.corazones');

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

setInterval(crearCorazon, 500);

source.connect(analyser);
analyser.connect(audioCtx.destination);

let currentColor = [255,0,100];

function animateOverlay() {
  analyser.getByteFrequencyData(dataArray);
  let bass = 0;
  for (let i = 0; i < 10; i++) bass += dataArray[i];
  bass = bass / 10;

  overlayBg.style.backgroundColor = 
    `rgba(${currentColor[0]},${currentColor[1]},${currentColor[2]},${0.2 + bass/255 * 0.4})`;

  if (!player.paused) requestAnimationFrame(animateOverlay);
}

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

overlay.addEventListener('click', () => {
  overlay.classList.remove("active");
  zoomed.src = "";
  player.pause();
  player.currentTime = 0;
});
