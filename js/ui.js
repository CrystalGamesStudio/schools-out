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
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.handleCanvasClick(x, y);
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

    renderGameOverScreen(score) {
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
}
