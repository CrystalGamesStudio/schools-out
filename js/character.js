export default class Character {
    constructor(canvasHeight, groundY) {
        this.x = 50;
        this.y = groundY - 60; // Start on the ground
        this.width = 40;
        this.height = 60;
        this.velocity = 0;
        this.gravity = 0.5;
        this.jumpStrength = -10;
        this.canvasHeight = canvasHeight;
        this.groundY = groundY;
        this.maxEnergy = 100;
        this.energy = this.maxEnergy;
        this.energyConsumptionRate = 0.5;
        this.energyRefillRate = 2;
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
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    jump() {
        // Allow jumping only if there's energy
        if (this.energy > 0) {
            this.velocity = this.jumpStrength;
        }
    }

    shoot() {
        // Implement shooting logic (to be added later)
    }

    getEnergyPercentage() {
        return (this.energy / this.maxEnergy) * 100;
    }
}
