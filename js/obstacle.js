import gameConfig from './gameConfig.js';

export default class Obstacle {
    constructor(canvasWidth, groundY, type) {
        this.canvasWidth = canvasWidth;
        this.groundY = groundY;
        this.type = type;
        this.speed = gameConfig.obstacle.speed;
        this.setProperties();
    }

    setProperties() {
        const obstacleConfig = gameConfig.obstacle[this.type];
        this.width = obstacleConfig.width;
        this.height = obstacleConfig.height;
        this.color = obstacleConfig.color;
        this.x = this.canvasWidth;
        this.y = this.groundY - this.height;
    }

    update() {
        this.x -= this.speed;
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        
        switch (this.type) {
            case 'alarm_clock':
                this.drawAlarmClock(ctx);
                break;
            case 'book':
                this.drawBook(ctx);
                break;
            case 'pencil_case':
                this.drawPencilCase(ctx);
                break;
        }
    }

    drawAlarmClock(ctx) {
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    drawBook(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    drawPencilCase(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}
