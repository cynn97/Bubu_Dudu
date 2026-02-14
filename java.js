const bubu = document.getElementById("bubu");
const dudu = document.getElementById("dudu");
const letter = document.getElementById("letter");
const hint = document.getElementById("hint");
const status = document.getElementById("status");
const backBtn = document.getElementById("backBtn");
const music = document.getElementById("music");
const game = document.getElementById("game");

let x = 30;
let y = 60;
let gameWon = false;
let musicStarted = false;
let heartInterval = null;

document.addEventListener("keydown", (e) => {
    if (gameWon) return;

    const step = 10;
    bubu.classList.add("walk");
    status.innerText = "♥♥♥ Bubuuuuuuuuuuuuuu ♥♥♥";

    if (!musicStarted) {
        fadeInMusic();
        musicStarted = true;
    }

    if (e.key === "ArrowRight") {
        x += step;
        bubu.style.transform = "scaleX(1)";
    }
    if (e.key === "ArrowLeft") {
        x -= step;
        bubu.style.transform = "scaleX(-1)";
    }

    // Limitar movimiento dentro del escenario
    const maxX = Math.max(0, game.clientWidth - bubu.offsetWidth - 10);
    if (x < 0) x = 0;
    if (x > maxX) x = maxX;
    bubu.style.left = x + "px";
    checkWin();
});

document.addEventListener("keyup", () => {
    bubu.classList.remove("walk");
});

function checkWin() {
    const bubuRect = bubu.getBoundingClientRect();
    const duduRect = dudu.getBoundingClientRect();

    if (
        bubuRect.right > duduRect.left &&
        bubuRect.left < duduRect.right
    ) {
        winGame();
    }
}

function winGame() {
    gameWon = true;
    const floor = document.getElementById("floor");
    if (floor) floor.style.display = "none";
    
    dudu.classList.add("happy");
    bubu.classList.add("happy");
    
    // Posicionar diálogos sobre Bubu
    const bubuRect = bubu.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    const dialogBubu = document.getElementById("dialog-bubu");
    const dialogBubu2 = document.getElementById("dialog-bubu2");
    const dialogDudu = document.getElementById("dialog-dudu");

    // Posición de Bubu
    const offsetX = bubuRect.left - gameRect.left;
    const offsetY = bubuRect.top - gameRect.top;
    
    dialogBubu.style.left = offsetX + "px";
    dialogBubu.style.top = (offsetY - 80) + "px";
    dialogBubu2.style.left = offsetX + "px";
    dialogBubu2.style.top = (offsetY - 80) + "px";

    // Posicionar diálogo sobre Dudu
    const duduRect = dudu.getBoundingClientRect();
    const offsetXDudu = duduRect.left - gameRect.left;
    const offsetYDudu = duduRect.top - gameRect.top;

    dialogDudu.style.left = offsetXDudu + "px";
    dialogDudu.style.top = (offsetYDudu - 80) + "px";

    // 1️⃣ Bubu habla
    dialogBubu.style.display = "block";

    // 2️⃣ Bubu dice "¡Ábrela!"
    setTimeout(() => {
        dialogBubu.style.display = "none";
        dialogBubu2.style.display = "block";
    }, 2500);

    // 3️⃣ Dudu responde
    setTimeout(() => {
        dialogBubu2.style.display = "none";
        dialogDudu.style.display = "block";
    }, 4500);

    // 4️⃣ Ocultar diálogo de Dudu
    setTimeout(() => {
        dialogDudu.style.display = "none";
    }, 6500);

    // Mostrar icono de carta después
    setTimeout(() => {
        const letterIcon = document.getElementById("letter-icon");
        letterIcon.style.display = "block";

        if (!heartInterval) {
            heartInterval = setInterval(createHeart, 300);
        }
    }, 7000);
}

function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart-float";
    heart.innerText = "♥";

    const size = Math.random() * 15 + 15;
    heart.style.fontSize = size + "px";

    // Obtener posiciones reales - elegir si sale de Bubu o Dudu
    const bubuRect = bubu.getBoundingClientRect();
    const duduRect = dudu.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    // 50% de probabilidad de que salga de Bubu o Dudu
    const isFromBubu = Math.random() > 0.5;
    const sourceRect = isFromBubu ? bubuRect : duduRect;
    const centerX = sourceRect.left - gameRect.left + 40;

    heart.style.left = centerX + "px";
    heart.style.bottom = "120px";
    heart.style.animationDuration = (Math.random() * 2 + 2) + "s";

    game.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
}


function fadeInMusic() {
    music.volume = 0;
    // manejar posible rechazo de la promesa play() por políticas del navegador
    music.play().catch(() => {});
    let vol = 0;

    const fade = setInterval(() => {
        if (vol < 0.4) {
            vol += 0.02;
            music.volume = vol;
        } else {
            clearInterval(fade);
        }
    }, 100);
}

backBtn.addEventListener("click", () => {
    letter.style.display = "none";
    const floor = document.getElementById("floor");
    if (floor) floor.style.display = "block";

    hint.innerText = "Ayuda a Bubu a llegar hasta Dudu ♡";
    status.innerText = "♥♥♥";
    dudu.classList.remove("happy");
    bubu.classList.remove("happy");
    // remover clases de destaque
    status.classList.remove('status-highlight');
    hint.classList.remove('hint-highlight');
    // limpiar intervalo de corazones
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
    // eliminar corazones y pétalos que hayan quedado en el DOM
    document.querySelectorAll('.heart-float').forEach(el => el.remove());
    document.querySelectorAll('.petal').forEach(el => el.remove());
    // quitar la clase de animación para poder volver a abrir luego
    letter.classList.remove('pixel-open');
    // Ocultar diálogos e icono de carta
    document.getElementById("dialog-bubu").style.display = "none";
    document.getElementById("dialog-bubu2").style.display = "none";
    document.getElementById("letter-icon").style.display = "none";
    gameWon = false;
    x = 30;
    bubu.style.left = x + "px";
});

// Click en el icono de la carta para abrirla
const letterIcon = document.getElementById("letter-icon");
letterIcon.addEventListener("click", () => {
    letter.style.display = "block";
    letterIcon.style.display = "none";
    
    // Ocultar diálogos
    document.getElementById("dialog-bubu").style.display = "none";
    document.getElementById("dialog-bubu2").style.display = "none";
    
    hint.innerText = "♥♥♥";
    status.innerText = "Yeiiii✦";
    // aplicar clases de estilo para bajar y destacar el texto
    status.classList.add('status-highlight');
    hint.classList.add('hint-highlight');

    // animación estilo "carta píxel" al mostrarse
    letter.classList.remove('pixel-open');
    // Forzar reflow para reiniciar la animación si ya existía
    // eslint-disable-next-line no-unused-expressions
    letter.offsetWidth;
    letter.classList.add('pixel-open');
});

function createPetal() {
    const petal = document.createElement("div");
    petal.classList.add("petal");

    // Posición horizontal aleatoria
    petal.style.left = Math.random() * 600 + "px";

    // Duración aleatoria
    petal.style.animationDuration = (3 + Math.random() * 3) + "s";

    document.getElementById("game").appendChild(petal);

    // Eliminar cuando termine la animación
    setTimeout(() => {
        petal.remove();
    }, 6000);
}

// Crear pétalos cada 300ms
setInterval(createPetal, 300);

document.getElementById("leftBtn").addEventListener("click", () => {
    if (gameWon) return;
    x -= 10;
    if (x < 0) x = 0;
    bubu.style.left = x + "px";
});

document.getElementById("rightBtn").addEventListener("click", () => {
    if (gameWon) return;
    x += 10;
    const maxX = game.clientWidth - bubu.offsetWidth;
    if (x > maxX) x = maxX;
    bubu.style.left = x + "px";
});
