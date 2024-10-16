import Character from './character.js';
import Obstacle from './obstacle.js';
import UI from './ui.js';
import GameAudio from './audio.js';
import gameConfig from './game-config.js';

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
        this.isAudioOn = gameConfig.audio.defaultOn;
        if (!this.isAudioOn) {
            this.audio.mute();
        }
        this.obstaclesJumped = 0;
        this.level = 1;
        this.comboActive = false;
        this.comboLetter = '';
        this.comboMorse = '';
        this.comboInput = '';
        this.comboStartTime = 0;
        this.comboEnergyPreservationEndTime = 0;
        this.isPaused = false;
        this.animationFrameId = null;
        this.lastComboEndTime = 0;
    }

    async init() {
        if (!window.uiTemplates) {
            console.error('UI templates not loaded. Make sure ui-templates.js is included and loaded properly.');
            return;
        }
        await window.uiTemplates.load();
        this.canvas.width = gameConfig.canvas.width;
        this.canvas.height = gameConfig.canvas.height;
        this.addKeyListeners();
        this.ui.init();
        this.ui.startAgain = () => {
            this.resetGame();
        };
        this.ui.selectCharacter = () => {
            this.showCharacterSelection();
        };
        this.ui.onJump = () => this.handleJump();
        this.ui.onCharacterSelect = (type) => this.startGameWithCharacter(type);
        this.showCharacterSelection();
    }

    addKeyListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling when spacebar is pressed
            }
            if (e.code === 'Enter' && this.comboActive) {
                e.preventDefault();
                this.handleMorseInput('start');
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            if (e.code === 'Enter' && this.comboActive) {
                this.handleMorseInput('end');
            }
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
        this.ui.hideGameOverScreen();
        this.isCharacterSelectionActive = true;
        this.isGameStarted = false;
        this.ui.renderCharacterSelection();
    }

    startGameWithCharacter(type) {
        this.selectedCharacterType = type;
        this.isCharacterSelectionActive = false;
        this.ui.hideCharacterSelection();
        this.resetGame();
        this.isGameStarted = true;
        this.audio.play('gameStarts');
    }

    resetGame() {
        this.ui.hideGameOverScreen();
        if (!this.selectedCharacterType) {
            this.showCharacterSelection();
            return;
        }
        const characterConfig = gameConfig.characters[this.selectedCharacterType];
        this.character = new Character(this.canvas.height, this.groundY, characterConfig);
        this.obstacles = [];
        this.score = 0;
        this.isGameOver = false;
        this.ui.hideGameOverScreen();
        this.isGameStarted = true;
        this.isCharacterSelectionActive = false;
        this.audio.stopAll();
        this.audio.play('gameStarts');
        this.obstaclesJumped = 0;
        this.level = 1;
        this.updateLevel();
        this.startGame();
    }

    gameLoop() {
        if (!this.isGameOver) {
            this.update();
            this.render();
            this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
        } else {
            this.handleGameOver();
        }
    }

    handleGameOver() {
        cancelAnimationFrame(this.animationFrameId);
        this.ui.renderGameOverScreen(this.score, this.obstaclesJumped, this.level);
    }

    startGame() {
        this.isGameOver = false;
        this.isGameStarted = true;
        this.ui.init(); // Reinitialize UI elements
        this.gameLoop();
    }

    update() {
        if (!this.isGameStarted || this.isGameOver) return;

        if (this.comboActive) {
            // Only update the combo timer when combo is active
            const elapsedTime = Date.now() - this.comboStartTime;
            this.ui.renderCombo(this.comboLetter, this.comboMorse, this.comboInput, elapsedTime);
            
            if (elapsedTime > gameConfig.game.comboInputTimeout) {
                this.endCombo();
            }
            return; // Skip other updates while combo is active
        }

        if (this.keys['Space']) {
            this.handleJump();
        }

        this.character.update();
        this.updateObstacles();
        this.checkCollisions();
        this.checkObstaclesJumped();
        this.score++;

        // Check if energy is low
        const energyPercentage = this.character.getEnergyPercentage();
        if (energyPercentage <= gameConfig.game.energyPercentageThreshold) {
            this.audio.playLowEnergy();
        } else {
            this.audio.stopLowEnergy();
        }

        // Check if energy has run out
        if (energyPercentage === 0) {
            console.log('Game Over state triggered');
            this.isGameOver = true;
            this.audio.play('gameOver');
        }

        // Check if we can start a new combo
        if (!this.character.isOnGround() && 
            !this.comboActive && 
            Math.random() < gameConfig.game.comboChance &&
            Date.now() - this.lastComboEndTime > gameConfig.game.comboCooldown) {
            this.startCombo();
        }

        // Check if energy preservation is active
        if (Date.now() < this.comboEnergyPreservationEndTime) {
            this.character.preserveEnergy();
        } else {
            this.character.resumeEnergyConsumption();
        }

        this.updateLevel();

        // Update UI elements
        this.ui.updateScore(this.score);
        this.ui.updateEnergyBar(this.character.getEnergyPercentage());
        this.ui.updateObstaclesJumped(this.obstaclesJumped);
        this.ui.updateLevel(this.level);
    }

    checkObstaclesJumped() {
        this.obstacles.forEach(obstacle => {
            if (!obstacle.passed && obstacle.x + obstacle.width < this.character.x) {
                obstacle.passed = true;
                this.obstaclesJumped++;
            }
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the ground
        this.ctx.fillStyle = gameConfig.game.groundColor;
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        
        if (this.isCharacterSelectionActive) {
            // Don't render game elements during character selection
            return;
        }

        if (this.isGameStarted) {
            this.character.render(this.ctx);
            this.obstacles.forEach(obstacle => obstacle.render(this.ctx));
        }

        if (this.isGameOver) {
            this.ui.renderGameOverScreen(this.score, this.obstaclesJumped, this.level);
        }

        if (this.comboActive) {
            this.ui.renderCombo(this.comboLetter, this.comboMorse, this.comboInput, Date.now() - this.comboStartTime);
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

    updateLevel() {
        const totalPoints = this.score + this.obstaclesJumped;
        const levels = gameConfig.game.levels;
        let newLevel = 1;

        for (let i = 0; i < levels.length; i++) {
            if (totalPoints >= levels[i]) {
                newLevel = i + 1;
            } else {
                break;
            }
        }

        if (newLevel !== this.level) {
            this.level = newLevel;
        }
    }

    getMorseInput(duration) {
        return duration < gameConfig.game.comboInputThreshold ? '.' : '-';
    }

    startCombo() {
        const letters = Object.keys(gameConfig.morse);
        this.comboLetter = letters[Math.floor(Math.random() * letters.length)];
        this.comboMorse = gameConfig.morse[this.comboLetter];
        this.comboInput = '';
        this.comboActive = true;
        this.comboStartTime = Date.now();
        this.ui.renderCombo(this.comboLetter, this.comboMorse, this.comboInput, 0);
    }

    endCombo() {
        this.comboActive = false;
        this.ui.hideCombo();
        this.lastComboEndTime = Date.now(); // Set the last combo end time
    }

    comboSuccess() {
        this.comboEnergyPreservationEndTime = Date.now() + gameConfig.game.comboDuration;
        this.audio.play('comboSuccess'); // Assuming you have a success sound
    }

    startAgain() {
        this.resetGame();
    }

    selectCharacter() {
        this.showCharacterSelection();
    }

    handleMorseInput(action) {
        if (action === 'start') {
            this.morseInputStartTime = Date.now();
        } else if (action === 'end') {
            const duration = Date.now() - this.morseInputStartTime;
            const input = this.getMorseInput(duration);
            this.comboInput += input;
            
            if (this.comboInput === this.comboMorse) {
                console.log('Correct Morse code entered');
                this.comboSuccess();
                this.endCombo();
                this.ui.hideCombo(); 
                this.ui.showCorrectComboFeedback();
            } else if (!this.comboMorse.startsWith(this.comboInput)) {
                console.log('Incorrect Morse code, resetting input');
                this.comboInput = '';
            }
            
            if (this.comboActive) {
                this.ui.renderCombo(this.comboLetter, this.comboMorse, this.comboInput, Date.now() - this.comboStartTime);
            }
        }
    }
}
