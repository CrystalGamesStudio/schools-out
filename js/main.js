import Game from './game.js';

class Main {
    constructor() {
        this.game = new Game();
    }

    init() {
        this.game.init();
    }
}

const main = new Main();
main.init();