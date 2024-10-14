export default class Obstacle {
    constructor(canvasWidth, groundY, width, height, type) {
        this.x = canvasWidth;
        this.y = groundY - height; // Place the obstacle on the ground
        this.width = width;
        this.height = height;
        this.type = type;
        this.speed = 5;
    }

    update() {
        this.x -= this.speed;
    }

    render(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}
