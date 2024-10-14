import gameConfig from './gameConfig.js';

export default class UI {
    constructor(canvas, isMobile) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.isMobile = isMobile;
        this.startAgainButton = document.getElementById('start-again');
        this.selectCharacterButton = document.getElementById('select-character');
        this.characterButtons = [];
    }

    init() {
        this.addStartAgainListener();
        this.addSelectCharacterListener();
        if (this.isMobile) {
            this.addTouchListeners();
        }
        this.createCharacterButtons();
    }

    addStartAgainListener() {
        this.startAgainButton.addEventListener('click', () => {
            if (this.onStartAgain) this.onStartAgain();
        });
    }

    addSelectCharacterListener() {
        this.selectCharacterButton.addEventListener('click', () => {
            if (this.onSelectCharacter) this.onSelectCharacter();
        });
    }

    addTouchListeners() {
        let touchStartTime = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            
            if (x > this.canvas.width / 2) {
                touchStartTime = Date.now();
            } else {
                this.handleCanvasClick(x, touch.clientY - rect.top);
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            
            if (x > this.canvas.width / 2) {
                const duration = Date.now() - touchStartTime;
                if (this.onComboInput) this.onComboInput(duration);
            }
        });
    }

    createCharacterButtons() {
        const buttonWidth = 100;
        const buttonHeight = 100;
        const spacing = 20;
        const totalWidth = (buttonWidth * gameConfig.characters.types.length) + (spacing * (gameConfig.characters.types.length - 1));
        let startX = (this.canvas.width - totalWidth) / 2;

        gameConfig.characters.types.forEach((type, index) => {
            const button = {
                x: startX + (buttonWidth + spacing) * index,
                y: gameConfig.game.groundY - buttonHeight,
                width: buttonWidth,
                height: buttonHeight,
                type: type,
                color: gameConfig.characters[type].color
            };
            this.characterButtons.push(button);
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleCanvasClick(x, y);
        });
    }

    handleCanvasClick(x, y) {
        this.characterButtons.forEach(button => {
            if (x > button.x && x < button.x + button.width &&
                y > button.y && y < button.y + button.height) {
                if (this.onCharacterSelect) this.onCharacterSelect(button.type);
            }
        });

        if (this.onJump && y < gameConfig.game.groundY) {
            this.onJump();
        }
    }

    renderScore(score) {
        const barWidth = 200;
        const barHeight = 30;
        const x = 10;
        const y = 10;

        // Draw background
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(x, y, barWidth, barHeight);

        // Draw border
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(x, y, barWidth, barHeight);

        // Draw text
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Score', x + barWidth / 2, y + barHeight / 2);

        // Draw score
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${score}`, x + barWidth - 5, y + barHeight / 2);
    }

    renderEnergyBar(energyPercentage) {
        const barWidth = 200;
        const barHeight = 30;
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
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Energy', x + barWidth / 2, y + barHeight / 2);

        // Draw percentage
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${Math.round(energyPercentage)}%`, x + barWidth - 5, y + barHeight / 2);
    }

    renderObstaclesJumped(obstaclesJumped) {
        const barWidth = 200;
        const barHeight = 30;
        const x = 10;
        const y = 50; // Position it below the score

        // Draw background
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(x, y, barWidth, barHeight);

        // Draw border
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(x, y, barWidth, barHeight);

        // Draw text
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Obstacles Jumped', x + barWidth / 2, y + barHeight / 2);

        // Draw count
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${obstaclesJumped}`, x + barWidth - 5, y + barHeight / 2);
    }

    renderLevel(level) {
        const barWidth = 100;
        const barHeight = 30;
        const x = this.canvas.width - barWidth - 10;
        const y = 50; // Position it below the energy bar

        // Draw background
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(x, y, barWidth, barHeight);

        // Draw border
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(x, y, barWidth, barHeight);

        // Draw text
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`Level ${level}`, x + barWidth / 2, y + barHeight / 2);
    }

    renderGameOverScreen(score, obstaclesJumped, level) {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Game Over text
        this.ctx.fillStyle = 'red';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 50);
        this.ctx.fillText(`Final Score: ${score}`, this.canvas.width / 2, this.canvas.height / 2);       

        // Display the buttons
        const buttonY = this.canvas.height * 0.7;

        this.startAgainButton.style.display = 'block';
        this.startAgainButton.style.left = '35%';
        this.startAgainButton.style.top = `${buttonY}px`;

        this.selectCharacterButton.style.display = 'block';
        this.selectCharacterButton.style.left = '65%';
        this.selectCharacterButton.style.top = `${buttonY}px`;

        this.ctx.fillText(`Obstacles Jumped: ${obstaclesJumped}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.ctx.fillText(`Level: ${level}`, this.canvas.width / 2, this.canvas.height / 2 + 80);
    }

    hideGameOverButtons() {
        this.startAgainButton.style.display = 'none';
        this.selectCharacterButton.style.display = 'none';
    }

    renderCharacterSelection() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Choose Your Character', this.canvas.width / 2, 50);

        this.characterButtons.forEach(button => {
            this.ctx.fillStyle = button.color;
            this.ctx.fillRect(button.x, button.y, button.width, button.height);
            this.ctx.strokeStyle = 'white';
            this.ctx.strokeRect(button.x, button.y, button.width, button.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(button.type, button.x + button.width / 2, button.y + button.height + 20);
        });
    }

    renderCombo(letter, morse, input, elapsedTime) {
        const x = this.canvas.width / 2;
        const y = 100;

        const remainingTime = Math.max(0, (gameConfig.game.comboInputTimeout - elapsedTime) / 1000);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Enter Morse code for: ${letter}`, x, y);
        this.ctx.fillText(`Morse code: ${morse}`, x, y + 40);
        this.ctx.fillText(`Your input: ${input}`, x, y + 80);
        this.ctx.fillText(`Time remaining: ${remainingTime.toFixed(1)}s`, x, y + 120);

        // Draw input visualization
        const dotSize = 20;
        const dashSize = 40;
        const spacing = 10;
        let currentX = x - (morse.length * (dotSize + spacing)) / 2;

        for (let i = 0; i < morse.length; i++) {
            this.ctx.strokeStyle = i < input.length ? 'green' : 'white';
            this.ctx.lineWidth = 2;
            if (morse[i] === '.') {
                this.ctx.beginPath();
                this.ctx.arc(currentX + dotSize / 2, y + 160, dotSize / 2, 0, Math.PI * 2);
                this.ctx.stroke();
                currentX += dotSize + spacing;
            } else {
                this.ctx.beginPath();
                this.ctx.moveTo(currentX, y + 160);
                this.ctx.lineTo(currentX + dashSize, y + 160);
                this.ctx.stroke();
                currentX += dashSize + spacing;
            }
        }
    }
}
