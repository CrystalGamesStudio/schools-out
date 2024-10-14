import Game from './game.js';

class Main {
    constructor() {
        this.game = new Game();
    }

    init() {
        this.game.init();
        this.gameLoop();
    }

    gameLoop() {
        this.game.update();
        this.game.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

const main = new Main();
main.init();
