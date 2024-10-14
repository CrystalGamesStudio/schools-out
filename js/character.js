import gameConfig from './gameConfig.js';

export default class Character {
    constructor(canvasHeight, groundY, characterConfig) {
        this.x = gameConfig.game.startX;
        this.y = groundY - characterConfig.height;
        this.width = characterConfig.width;
        this.height = characterConfig.height;
        this.color = characterConfig.color;
        this.velocity = 0;
        this.gravity = gameConfig.game.gravity;
        this.jumpStrength = characterConfig.jumpStrength;
        this.canvasHeight = canvasHeight;
        this.groundY = groundY;
        this.maxEnergy = gameConfig.game.maxEnergy;
        this.energy = this.maxEnergy;
        this.energyConsumptionRate = gameConfig.game.energyConsumptionRate;
        this.energyRefillRate = gameConfig.game.energyRefillRate;
        this.level = 1;
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Prevent character from going above the canvas
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }

        // Check if character is on the ground
        if (this.y + this.height >= this.groundY) {
            this.y = this.groundY - this.height;
            this.velocity = 0;
            // Refill energy when on the ground
            this.energy = Math.min(this.energy + this.energyRefillRate, this.maxEnergy);
        } else {
            // Consume energy when in the air
            this.energy = Math.max(this.energy - this.energyConsumptionRate, 0);
        }
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Render level inside the character
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.level.toString(), this.x + this.width / 2, this.y + this.height / 2);
    }

    jump() {
        // Allow jumping only if there's energy
        if (this.energy > 0) {
            this.velocity = this.jumpStrength;
        }
    }

    getEnergyPercentage() {
        return (this.energy / this.maxEnergy) * 100;
    }

    setLevel(level) {
        this.level = level;
    }

    isOnGround() {
        return this.y + this.height >= this.groundY;
    }

    preserveEnergy() {
        this.energyConsumptionRate = 0;
    }

    resumeEnergyConsumption() {
        this.energyConsumptionRate = gameConfig.game.energyConsumptionRate;
    }
}
