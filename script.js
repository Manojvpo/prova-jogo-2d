const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');

class Entidade {
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }

    desenhar() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class Nave extends Entidade {
    constructor() {
        super(canvas.width / 2 - 25, canvas.height - 40, 50, 20, 'green');
        this.speed = 5;
    }

    mover(dir) {
        this.x += dir * this.speed;
        this.x = Math.max(0, Math.min(canvas.width - this.largura, this.x));
    }
}

class Disparo extends Entidade {
    constructor(x, y) {
        super(x, y, 5, 10, 'white');
        this.speed = 7;
    }

    atualizar() {
        this.y -= this.speed;
    }
}

class Alien extends Entidade {
    constructor(x, y, velocidade) {
        super(x, y, 40, 20, 'red');
        this.direcao = 1;
        this.velocidade = velocidade;
    }

    atualizar() {
        this.x += this.direcao * this.velocidade;
        if (this.x <= 0 || this.x + this.largura >= canvas.width) {
            this.direcao *= -1;
            this.y += 50;  
        }
    }
}

const nave = new Nave();
const disparos = [];
const aliens = [];

let gameOver = false;
let pontuacao = 0;

const larguraAlien = 50;  
const alturaAlien = 20;
const velocidade = 1;

for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
       
        aliens.push(new Alien(30 + col * larguraAlien, 30 + row * 50, velocidade));
    }
}

let keys = {};

window.addEventListener('keydown', (e) => {
    if (gameOver) return;
    keys[e.key] = true;
    if (e.key === ' ') {
        disparos.push(new Disparo(nave.x + nave.largura / 2 - 2.5, nave.y));
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function verificarColisaoAlienNave() {
    for (let i = 0; i < aliens.length; i++) {
        const a = aliens[i];
        if (
            a.x < nave.x + nave.largura &&
            a.x + a.largura > nave.x &&
            a.y < nave.y + nave.altura &&
            a.y + a.altura > nave.y
        ) {
            gameOver = true;
            break;
        }
    }
}

function verificarColisaoAlienChao() {
    for (let i = 0; i < aliens.length; i++) {
        const a = aliens[i];
        if (a.y + a.altura >= canvas.height - 40) {
            gameOver = true;
            break;
        }
    }
}

function loopJogo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText(`Pontuação: ${pontuacao}`, canvas.width / 2 - 100, canvas.height / 2 + 50);
        return; 
    }

    if (keys['ArrowLeft']) nave.mover(-1);
    if (keys['ArrowRight']) nave.mover(1);
    nave.desenhar();

    for (let i = disparos.length - 1; i >= 0; i--) {
        const d = disparos[i];
        d.atualizar();
        d.desenhar();
        if (d.y < 0) disparos.splice(i, 1);
    }

    for (let i = aliens.length - 1; i >= 0; i--) {
        const a = aliens[i];
        a.atualizar();
        a.desenhar();

        for (let j = disparos.length - 1; j >= 0; j--) {
            const d = disparos[j];
            if (
                d.x < a.x + a.largura &&
                d.x + d.largura > a.x &&
                d.y < a.y + a.altura &&
                d.y + d.altura > a.y
            ) {
                aliens.splice(i, 1);
                disparos.splice(j, 1);
                pontuacao += 10;
                break;
            }
        }
    }

    verificarColisaoAlienNave();
    verificarColisaoAlienChao();

   
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Pontuação: ${pontuacao}`, 10, 30);

    requestAnimationFrame(loopJogo);
}

loopJogo();
