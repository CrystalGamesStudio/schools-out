import gameConfig from './game-config.js';
import SvgRenderer from './svg-renderer.js';

export default class Obstacle extends SvgRenderer {
    constructor(canvasWidth, groundY, type) {
        const obstacleConfig = gameConfig.obstacle[type];
        super(obstacleConfig.svg, obstacleConfig.width, obstacleConfig.height);
        this.canvasWidth = canvasWidth;
        this.groundY = groundY;
        this.type = type;
        this.speed = gameConfig.obstacle.speed;
        this.x = canvasWidth;
        this.y = groundY - this.height;
    }

    update() {
        this.x -= this.speed;
    }

    render(ctx) {
        super.render(ctx, this.x, this.y);
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}
