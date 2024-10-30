import gameConfig from './game-config.js';
import SvgRenderer from './svg-renderer.js';

export default class Character extends SvgRenderer {
    constructor(canvasHeight, groundY, characterConfig) {
        super(characterConfig.svg, characterConfig.width, characterConfig.height);
        this.x = gameConfig.game.startX;
        this.y = groundY - characterConfig.height;
        this.velocity = 0;
        this.gravity = gameConfig.game.gravity;
        this.jumpStrength = characterConfig.jumpStrength;
        this.canvasHeight = canvasHeight;
        this.groundY = groundY;
        this.maxEnergy = gameConfig.game.maxEnergy;
        this.energy = this.maxEnergy;
        this.energyConsumptionRate = gameConfig.game.energyConsumptionRate;
        this.energyRefillRate = gameConfig.game.energyRefillRate;
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
        super.render(ctx, this.x, this.y);
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

    isOnGround() {
        return this.y + this.height >= this.groundY;
    }

    preserveEnergy() {
        this.energyConsumptionRate = 0;
    }

    resumeEnergyConsumption() {
        this.energyConsumptionRate = gameConfig.game.energyConsumptionRate;
    }

    updateSize(canvasHeight, groundY) {
        const scale = canvasHeight / 600; // Original height
        this.width *= scale;
        this.height *= scale;
        this.y = groundY - this.height;
        this.jumpStrength *= scale;
    }
}