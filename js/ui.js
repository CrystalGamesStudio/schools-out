import gameConfig from './gameConfig.js';

export default class UI {
    constructor(canvas, isMobile) {
        console.log('UI constructor called');
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.isMobile = isMobile;
        this.uiOverlay = document.getElementById('ui-overlay');
        this.characterButtons = [];
    }

    init() {
        console.log('UI init method called');
        this.uiOverlay.innerHTML = ''; // Clear any existing content
        this.renderScoreTemplate();
        this.renderEnergyBarTemplate();
        this.renderObstaclesJumpedTemplate();
        this.renderLevelTemplate();
        if (this.isMobile) {
            this.addTouchListeners();
        }
    }

    renderScoreTemplate() {
        console.log('Rendering score template');
        const scoreTemplate = window.uiTemplates.get('score-template');
        console.log('Score template:', scoreTemplate);
        this.uiOverlay.appendChild(scoreTemplate.cloneNode(true));
        this.scoreElement = document.querySelector('.score .value');
        console.log('Score value element:', this.scoreElement);
        console.log('UI overlay contents:', this.uiOverlay.innerHTML);
    }

    renderEnergyBarTemplate() {
        console.log('Rendering energy bar template');
        const energyBarTemplate = window.uiTemplates.get('energy-bar-template');
        this.uiOverlay.appendChild(energyBarTemplate.cloneNode(true));
        this.energyBar = document.querySelector('.energy-bar');
        this.energyFill = document.getElementById('energy-fill');
        this.energyValue = document.getElementById('energy-value');
    }

    renderObstaclesJumpedTemplate() {
        console.log('Rendering obstacles jumped template');
        const obstaclesJumpedTemplate = window.uiTemplates.get('obstacles-jumped-template');
        this.uiOverlay.appendChild(obstaclesJumpedTemplate.cloneNode(true));
        this.obstaclesJumpedElement = document.querySelector('.obstacles-jumped .value');
    }

    renderLevelTemplate() {
        console.log('Rendering level template');
        const levelTemplate = window.uiTemplates.get('level-template');
        this.uiOverlay.appendChild(levelTemplate.cloneNode(true));
        this.levelElement = document.querySelector('.level .value');
    }

    renderCharacterSelection() {
        console.log('Rendering Character Selection screen');
        this.uiOverlay.innerHTML = ''; // Clear previous UI elements
        const characterSelectionTemplate = window.uiTemplates.get('character-selection-template');
        this.uiOverlay.appendChild(characterSelectionTemplate.cloneNode(true));
        const characterOptions = document.getElementById('character-options');
        gameConfig.characters.types.forEach(type => {
            const button = document.createElement('button');
            button.textContent = type;
            button.style.backgroundColor = gameConfig.characters[type].color;
            button.style.color = gameConfig.characters[type].fontColor;
            button.addEventListener('click', () => {
                console.log(`Character ${type} selected`);
                if (this.onCharacterSelect) this.onCharacterSelect(type);
            });
            characterOptions.appendChild(button);
        });
        this.uiOverlay.style.pointerEvents = 'auto'; // Enable pointer events
        console.log('Character Selection screen rendered');
    }

    hideCharacterSelection() {
        const characterSelectionElement = this.uiOverlay.querySelector('.character-selection');
        if (characterSelectionElement) {
            this.uiOverlay.removeChild(characterSelectionElement);
        }
        this.uiOverlay.style.pointerEvents = 'none'; // Disable pointer events
    }

    updateScore(score) {
        if (this.scoreElement) {
            this.scoreElement.textContent = score;
        } else {
            console.error('Score element not found');
            this.renderScoreTemplate(); // Try to re-render if not found
        }
    }

    updateEnergyBar(energyPercentage) {
        console.log('Updating energy bar:', energyPercentage);
        if (this.energyFill && this.energyValue) {
            this.energyFill.style.width = `${energyPercentage}%`;
            this.energyValue.textContent = `${Math.round(energyPercentage)}%`;
            this.energyFill.style.backgroundColor = 
                energyPercentage > gameConfig.game.energyPercentageThreshold 
                ? gameConfig.ui.energyBarHighColor 
                : gameConfig.ui.energyBarLowColor;
        } else {
            console.error('Energy bar elements not found');
            this.renderEnergyBarTemplate(); // Try to re-render if not found
        }
    }

    updateObstaclesJumped(obstaclesJumped) {
        if (this.obstaclesJumpedElement) {
            this.obstaclesJumpedElement.textContent = obstaclesJumped;
        } else {
            console.error('Obstacles jumped element not found');
            this.renderObstaclesJumpedTemplate(); // Try to re-render if not found
        }
    }

    updateLevel(level) {
        if (this.levelElement) {
            this.levelElement.textContent = level;
        } else {
            console.error('Level element not found');
            this.renderLevelTemplate(); // Try to re-render if not found
        }
        this.uiOverlay.style.pointerEvents = 'none'; // Disable pointer events
    }

    renderGameOverScreen(score, obstaclesJumped, level) {
        console.log('Rendering Game Over screen');
        this.uiOverlay.innerHTML = ''; // Clear previous UI elements
        const gameOverTemplate = window.uiTemplates.get('game-over-template');
        this.uiOverlay.appendChild(gameOverTemplate.cloneNode(true));
        document.getElementById('final-score').textContent = score;
        document.getElementById('final-obstacles-jumped').textContent = obstaclesJumped;
        document.getElementById('final-level').textContent = level;

        const gameOverButtons = document.getElementById('game-over-buttons');
        gameConfig.gameOverButtons.types.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = gameConfig.gameOverButtons[button].text;
            buttonElement.style.backgroundColor = gameConfig.gameOverButtons[button].color;
            buttonElement.style.color = gameConfig.gameOverButtons[button].fontColor;
            buttonElement.addEventListener('click', () => {
                console.log(`${button} button clicked`);
                if (this[gameConfig.gameOverButtons[button].action]) {
                    this[gameConfig.gameOverButtons[button].action]();
                } else {
                    console.error(`Action ${gameConfig.gameOverButtons[button].action} not found`);
                }
            });
            gameOverButtons.appendChild(buttonElement);
        });
        
        this.uiOverlay.style.pointerEvents = 'auto'; // Enable pointer events
        console.log('Game Over screen rendered'); // Added console log
    }

    hideGameOverScreen() {
        const gameOverElement = this.uiOverlay.querySelector('.game-over');
        if (gameOverElement) {
            this.uiOverlay.removeChild(gameOverElement);
        }
        this.uiOverlay.style.pointerEvents = 'none'; // Disable pointer events
    }

    renderCombo(letter, morse, input, elapsedTime) {
        console.log('Rendering combo template');
        const comboTemplate = window.uiTemplates.get('combo-template');
        if (!comboTemplate) {
            console.error('Combo template not found');
            return;
        }
        
        // Remove existing combo element if present
        const existingCombo = this.uiOverlay.querySelector('.combo');
        if (existingCombo) {
            existingCombo.remove();
        }
        
        // Clone and append the new combo content
        const comboElement = comboTemplate.cloneNode(true);
        this.uiOverlay.appendChild(comboElement);
        
        // Update the combo content
        const letterElement = this.uiOverlay.querySelector('#combo-letter');
        const morseElement = this.uiOverlay.querySelector('#combo-morse');
        const inputElement = this.uiOverlay.querySelector('#combo-input');
        const timeElement = this.uiOverlay.querySelector('#combo-time');
        
        if (letterElement) letterElement.textContent = letter;
        if (morseElement) morseElement.textContent = morse;
        if (inputElement) inputElement.textContent = input;
        
        const remainingTime = Math.max(0, (gameConfig.game.comboInputTimeout - elapsedTime) / 1000);
        if (timeElement) timeElement.textContent = `${remainingTime.toFixed(1)}s`;
        
        this.renderComboVisualization(morse, input);
        
        console.log('Combo template rendered:', {letter, morse, input, remainingTime});
    }

    renderComboVisualization(morse, input) {
        const visualization = this.uiOverlay.querySelector('#combo-visualization');
        if (!visualization) {
            console.error('Combo visualization element not found');
            return;
        }
        visualization.innerHTML = '';
        for (let i = 0; i < morse.length; i++) {
            const span = document.createElement('span');
            span.textContent = morse[i];
            span.className = i < input.length ? 'correct' : 'pending';
            visualization.appendChild(span);
        }
    }

    hideCombo() {
        const comboElement = this.uiOverlay.querySelector('.combo');
        if (comboElement) {
            comboElement.remove();
        }
        this.uiOverlay.style.pointerEvents = 'none'; // Disable pointer events
        console.log('Combo hidden');
    }

    addTouchListeners() {
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            console.log(`Touch event detected at (${x}, ${y})`);
            
            if (x > this.canvas.width / 2) {
                console.log('Jump triggered by touch');
                if (this.onJump) this.onJump();
            }
        });
    }

    // Add these methods to handle game over button clicks
    startAgain() {
        console.log('Start Again method called in UI');
        if (this.startAgain) this.startAgain();
    }

    selectCharacter() {
        console.log('Select Character method called in UI');
        if (this.selectCharacter) this.selectCharacter();
    }
}
