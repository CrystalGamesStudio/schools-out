import Character from './character.js';
import Obstacle from './obstacle.js';
import Enemy from './enemy.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.character = null;
        this.obstacles = [];
        this.enemies = [];
        this.score = 0;
        this.isGameOver = false;
        this.startAgainButton = document.getElementById('start-again');
        this.keys = {};
        this.lastJumpTime = 0;
        this.jumpCooldown = 150; // Reduced cooldown for more responsive jumping
        this.groundY = 500; // Define the ground level
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.jumpArea = { x: 0, y: 0, width: this.canvas.width / 2, height: this.canvas.height };
    }

    init() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.resetGame();
        this.addKeyListeners();
        this.addTouchListeners();
        this.addStartAgainListener();
    }

    addKeyListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling when spacebar is pressed
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    addTouchListeners() {
        if (this.isMobile) {
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent default touch behavior
                const touch = e.touches[0];
                if (touch.clientX < this.jumpArea.width) {
                    this.handleJump();
                }
            });
        }
    }

    handleJump() {
        const currentTime = Date.now();
        if (currentTime - this.lastJumpTime > this.jumpCooldown) {
            this.character.jump();
            this.lastJumpTime = currentTime;
        }
    }

    addStartAgainListener() {
        this.startAgainButton.addEventListener('click', () => {
            this.resetGame();
        });
    }

    resetGame() {
        this.character = new Character(this.canvas.height, this.groundY);
        this.obstacles = [];
        this.enemies = [];
        this.score = 0;
        this.isGameOver = false;
        this.startAgainButton.style.display = 'none';
    }

    update() {
        if (this.isGameOver) return;

        if (this.keys['Space']) {
            this.handleJump();
        }

        this.character.update();
        this.updateObstacles();
        this.updateEnemies();
        this.checkCollisions();
        this.score++;

        // Check if energy has run out
        if (this.character.getEnergyPercentage() === 0) {
            this.isGameOver = true;
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the ground
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        
        this.character.render(this.ctx);
        this.obstacles.forEach(obstacle => obstacle.render(this.ctx));
        this.enemies.forEach(enemy => enemy.render(this.ctx));

        // Render score
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 50, 50);

        // Render energy bar
        this.renderEnergyBar();

        if (this.isGameOver) {
            this.renderGameOverScreen();
        }
    }

    renderEnergyBar() {
        const energyPercentage = this.character.getEnergyPercentage();
        const barWidth = 200;
        const barHeight = 20;
        const x = this.canvas.width - barWidth - 10;
        const y = 10;

        // Draw background
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(x, y, barWidth, barHeight);

        // Draw energy level
        this.ctx.fillStyle = energyPercentage > 20 ? 'green' : 'red';
        this.ctx.fillRect(x, y, barWidth * (energyPercentage / 100), barHeight);

        // Draw border
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(x, y, barWidth, barHeight);

        // Draw text
        this.ctx.fillStyle = 'black';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Energy', x + barWidth / 2 - 25, y + barHeight + 16);
    }

    renderGameOverScreen() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Game Over text
        this.ctx.fillStyle = 'red';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 50);
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);       

        // Display the button
        this.startAgainButton.style.display = 'block';
        this.startAgainButton.style.position = 'absolute';
        this.startAgainButton.style.left = '50%';
        this.startAgainButton.style.top = '60%';
        this.startAgainButton.style.transform = 'translate(-50%, -50%)';
    }

    updateObstacles() {
        this.obstacles.forEach(obstacle => obstacle.update());
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.isOffScreen());

        if (Math.random() < 0.02) {
            this.addObstacle();
        }
    }

    updateEnemies() {
        this.enemies.forEach(enemy => enemy.update);

        if (Math.random() < 0.005) {
            this.addEnemy();
        }
    }

    checkCollisions() {
        // Check collisions with obstacles
        for (let obstacle of this.obstacles) {
            if (this.character.x < obstacle.x + obstacle.width &&
                this.character.x + this.character.width > obstacle.x &&
                this.character.y < obstacle.y + obstacle.height &&
                this.character.y + this.character.height > obstacle.y) {
                this.isGameOver = true;
                break;
            }
        }

        // Check collisions with enemies
        for (let enemy of this.enemies) {
            if (this.character.x < enemy.x + enemy.width &&
                this.character.x + this.character.width > enemy.x &&
                this.character.y < enemy.y + enemy.height &&
                this.character.y + this.character.height > enemy.y) {
                this.isGameOver = true;
                break;
            }
        }
    }

    addObstacle() {
        const types = ['alarm_clock', 'book', 'pencil_case'];
        const type = types[Math.floor(Math.random() * types.length)];
        const obstacle = new Obstacle(this.canvas.width, this.groundY, 30, 50, type);
        this.obstacles.push(obstacle);
    }

    addEnemy() {
        const types = ['math_teacher', 'science_teacher', 'gym_teacher'];
        const type = types[Math.floor(Math.random() * types.length)];
        const enemy = new Enemy(this.canvas.width, this.groundY - 60, 40, 60, type);
        this.enemies.push(enemy);
    }
}
