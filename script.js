const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');

class Entidade {
    #x
    #y
    constructor(x, y, largura, altura, cor){
        this.#x = x;
        this.#y = y;
        this.largura = largura
        this.altura = altura
        this.cor = cor
    }
}
class Nave extends Entidade{
  constructor() {
    super(canvas.largura / 2 - 25, canvas.altura - 40, 50, 20, 'green');
    this.speed = 5;
  }
  mover(dir) {
    this.x += dir * this.speed;
    this.x = Math.max(0,Math.min(canvas.largura - this.altura, this.x));
  }
}

class Disparo extends Entidade{
    constructor(x, y){
        super(x, y, 5, 10, 'white');
            this.speed = 7;
    }
atualizar(){
    this.y -= this.speed;
    }
}

class Aliens extends Entidade{
    constructor(x, y){
        super(x, y, 40, 20, 'green');
        this. direção = 1;
    }
atualizar(){
    this.x += this.direção * 1;
    if (this.x <= 0 || this.x + this.largura >= canvas.largura){
            this.direção *= -1;
            this.y += 20;
        }
    }
}

const nave = new Nave();
const disparo = new Disparo();
const aliens = new Aliens();

for (let row = 0; row < 4; row++){
    for (let col = 0; col < 10; col++){
        aliens.push(new Aliens(60 + col * 60, 40 + row * 40));
    }
}

let Keys = {};

window.addEventListener('keydown', (e) => {
    Keys[e.key] = true; 
    if(e.key === ' '){
        disparo.push(new Disparo(nave.x + nave.largura / 2 - 2.5, player.y));
    }
});

function loopJogo(){
    ctx.clearReact(0, 0, canvas.largura, canvas.altura);

    if(Keys['Seta para esquerda']) nave.move(-1);
    if(Keys['Seta para direita'])nave.move(1);
    nave.draw();

    for (let i = disparo.largura - 1; i>= 0; i--){
        const disparo = disparos[i];
        disparo.atualizar();
        disparo.desenhar();
        if(disparo.y < 0) disparo.splice(i, 1);
    }

    for (let i = aliens.largura - 1; i >= 0; i--){
        const alien = aliens[i];
        alien.atualizar();
        alien.desenhar();

        for (let j = disparos.largura - 1; j >= 0; J--){
            const disparo = disparos[j];
            if(
                disparo.x < alien.x + alien.largura &&
                disparo.x + disparo.largura > alien.x &&
                disparo.y < alien.y + alien.altura &&
                disparo.y + disparo.altura > alien.y
            ){
                alien.splice(i, 1);
                disparo.splice(j, 1);
            }
        }
    }
}

requestAnimationFrame(gameLoop);


gameLoop();