import Character from './character.js';
import Obstacle from './obstacle.js';
import UI from './ui.js';
import GameAudio from './audio.js';
import gameConfig from './gameConfig.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.character = null;
        this.obstacles = [];
        this.score = 0;
        this.isGameOver = false;
        this.keys = {};
        this.lastJumpTime = 0;
        this.jumpCooldown = gameConfig.game.jumpCooldown;
        this.groundY = gameConfig.game.groundY;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.ui = new UI(this.canvas, this.isMobile);
        this.selectedCharacterType = null;
        this.isGameStarted = false;
        this.isCharacterSelectionActive = true;
        this.audio = new GameAudio();
    }

    init() {
        this.canvas.width = gameConfig.canvas.width;
        this.canvas.height = gameConfig.canvas.height;
        this.addKeyListeners();
        this.ui.init();
        this.ui.onStartAgain = () => this.resetGame();
        this.ui.onSelectCharacter = () => this.showCharacterSelection();
        this.ui.onJump = () => this.handleJump();
        this.ui.onCharacterSelect = (type) => this.startGameWithCharacter(type);
        // The character selection is now handled by the UI class
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

    handleJump() {
        const currentTime = Date.now();
        if (currentTime - this.lastJumpTime > this.jumpCooldown) {
            this.character.jump();
            this.lastJumpTime = currentTime;
            this.audio.play('jump');
        }
    }

    showCharacterSelection() {
        this.isGameOver = false;
        this.isCharacterSelectionActive = true;
        this.isGameStarted = false;
        this.ui.hideGameOverButtons();
    }

    startGameWithCharacter(type) {
        this.selectedCharacterType = type;
        this.isCharacterSelectionActive = false;
        this.resetGame();
        this.isGameStarted = true;
        this.audio.play('gameStarts');
    }

    resetGame() {
        if (!this.selectedCharacterType) {
            this.isCharacterSelectionActive = true;
            return;
        }
        const characterConfig = gameConfig.characters[this.selectedCharacterType];
        this.character = new Character(this.canvas.height, this.groundY, characterConfig);
        this.obstacles = [];
        this.score = 0;
        this.isGameOver = false;
        this.ui.hideGameOverButtons();
        this.isGameStarted = true;
        this.isCharacterSelectionActive = false;
        this.audio.stopAll();
        this.audio.play('gameStarts'); // Play the game start sound when resetting the game
    }

    update() {
        if (!this.isGameStarted || this.isGameOver) return;

        if (this.keys['Space']) {
            this.handleJump();
        }

        this.character.update();
        this.updateObstacles();
        this.checkCollisions();
        this.score++;

        // Check if energy is low
        const energyPercentage = this.character.getEnergyPercentage();
        if (energyPercentage <= 20) {
            this.audio.playLowEnergy();
        } else {
            this.audio.stopLowEnergy();
        }

        // Check if energy has run out
        if (energyPercentage === 0) {
            this.isGameOver = true;
            this.audio.play('gameOver');
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the ground
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        
        if (this.isCharacterSelectionActive) {
            this.ui.renderCharacterSelection();
        } else if (this.isGameStarted) {
            this.character.render(this.ctx);
            this.obstacles.forEach(obstacle => obstacle.render(this.ctx));

            // Render UI elements
            this.ui.renderScore(this.score);
            this.ui.renderEnergyBar(this.character.getEnergyPercentage());

            if (this.isGameOver) {
                this.ui.renderGameOverScreen(this.score);
            }
        }
    }

    updateObstacles() {
        this.obstacles.forEach(obstacle => obstacle.update());
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.isOffScreen());

        if (Math.random() < gameConfig.game.obstacleSpawnChance) {
            this.addObstacle();
        }
    }

    checkCollisions() {
        for (let obstacle of this.obstacles) {
            if (this.character.x < obstacle.x + obstacle.width &&
                this.character.x + this.character.width > obstacle.x &&
                this.character.y < obstacle.y + obstacle.height &&
                this.character.y + this.character.height > obstacle.y) {
                this.isGameOver = true;
                this.audio.play('gameOver');
                break;
            }
        }
    }

    addObstacle() {
        const types = gameConfig.obstacle.types;
        const type = types[Math.floor(Math.random() * types.length)];
        const obstacle = new Obstacle(this.canvas.width, this.groundY, type);
        this.obstacles.push(obstacle);
    }
}
