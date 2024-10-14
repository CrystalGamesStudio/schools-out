export default class Enemy {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // e.g., 'math_teacher', 'science_teacher', 'gym_teacher'
        this.speed = 3; // Speed at which the enemy moves
        this.direction = 1; // 1 for right, -1 for left
    }

    update() {
        // Move the enemy
        this.x += this.speed * this.direction;

        // Simple AI: change direction when reaching screen edges
        if (this.x <= 0 || this.x + this.width >= 800) { // Assuming 800px canvas width
            this.direction *= -1;
        }
    }

    render(ctx) {
        // Placeholder rendering - replace with sprite drawing later
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isHit(projectile) {
        // Check if the enemy is hit by a projectile
        return (
            projectile.x < this.x + this.width &&
            projectile.x + projectile.width > this.x &&
            projectile.y < this.y + this.height &&
            projectile.y + projectile.height > this.y
        );
    }
}
