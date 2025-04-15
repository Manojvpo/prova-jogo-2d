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