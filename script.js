const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');

class Entidade {
    constructor(x, y, largura, altura, cor){
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
            this.y += 30;
        }
    }
}

const nave = new Nave();
const disparos = [];
const aliens = [];

let gameOver = false;
let pontuacao = 0; // Variável para armazenar a pontuação

// Criar apenas uma vez os aliens iniciais
const velocidade = 1; // Você pode ajustar a velocidade dos aliens se necessário
for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
        aliens.push(new Alien(30 + col * 45, 30 + row * 30, velocidade));
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
            // Alien colidiu com a nave
            gameOver = true;
            break;
        }
    }
}

function verificarColisaoAlienChao() {
    for (let i = 0; i < aliens.length; i++) {
        const a = aliens[i];
        if (a.y + a.altura >= canvas.height - 40) {
            // Alien atingiu o chão
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
        return; // Fim do jogo, não continua o loop
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
                pontuacao += 10; // Incrementa 10 pontos por alien destruído
                break;
            }
        }
    }

    // Verificar se o jogo terminou
    verificarColisaoAlienNave();
    verificarColisaoAlienChao();

    // Exibir a pontuação atual
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Pontuação: ${pontuacao}`, 10, 30);

    requestAnimationFrame(loopJogo);
}

loopJogo();