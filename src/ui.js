import gameConfig from './game-config.js';
import authService from './services/auth.js';

export default class UI {
    constructor(canvas, isMobile, game) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.isMobile = isMobile;
        this.uiOverlay = document.getElementById('ui-overlay');
        this.game = game;
    }

    init() {
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
        const scoreTemplate = window.uiTemplates.get('score-template');
        this.uiOverlay.appendChild(scoreTemplate.cloneNode(true));
        this.scoreElement = document.querySelector('.score .value');
    }

    renderEnergyBarTemplate() {
        const energyBarTemplate = window.uiTemplates.get('energy-bar-template');
        this.uiOverlay.appendChild(energyBarTemplate.cloneNode(true));
        this.energyBar = document.querySelector('.energy-bar');
        this.energyFill = document.getElementById('energy-fill');
        this.energyValue = document.getElementById('energy-value');
    }

    renderObstaclesJumpedTemplate() {
        const obstaclesJumpedTemplate = window.uiTemplates.get('obstacles-jumped-template');
        this.uiOverlay.appendChild(obstaclesJumpedTemplate.cloneNode(true));
        this.obstaclesJumpedElement = document.querySelector('.obstacles-jumped .value');
    }

    renderLevelTemplate() {
        const levelTemplate = window.uiTemplates.get('level-template');
        this.uiOverlay.appendChild(levelTemplate.cloneNode(true));
        this.levelElement = document.querySelector('.level .value');
    }

    renderCharacterSelection() {
        this.uiOverlay.innerHTML = ''; // Clear previous UI elements
        const characterSelectionTemplate = window.uiTemplates.get('character-selection-template');
        this.uiOverlay.appendChild(characterSelectionTemplate.cloneNode(true));
        const characterOptions = document.getElementById('character-options');
        gameConfig.characters.types.forEach(type => {
            const button = document.createElement('button');
            button.className = 'character-button';
            
            // Create SVG element for the miniature
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            svgElement.innerHTML = gameConfig.characters[type].svg;
            
            button.appendChild(svgElement);
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            button.appendChild(nameSpan);
            
            button.addEventListener('click', () => {
                if (this.onCharacterSelect) this.onCharacterSelect(type);
            });
            characterOptions.appendChild(button);
        });
    }

    updateScore(score) {
        if (this.scoreElement) {
            this.scoreElement.textContent = score;
        } else {
            this.renderScoreTemplate(); // Try to re-render if not found
        }
    }

    updateEnergyBar(energyPercentage) {
        if (this.energyFill && this.energyValue) {
            this.energyFill.style.width = `${energyPercentage}%`;
            this.energyValue.textContent = `${Math.round(energyPercentage)}%`;
            this.energyFill.style.backgroundColor = 
                energyPercentage > gameConfig.game.energyPercentageThreshold 
                ? gameConfig.ui.energyBarHighColor 
                : gameConfig.ui.energyBarLowColor;
        } else {
            this.renderEnergyBarTemplate(); // Try to re-render if not found
        }
    }

    updateObstaclesJumped(obstaclesJumped) {
        if (this.obstaclesJumpedElement) {
            this.obstaclesJumpedElement.textContent = obstaclesJumped;
        } else {
            this.renderObstaclesJumpedTemplate(); // Try to re-render if not found
        }
    }

    updateLevel(level) {
        if (this.levelElement) {
            this.levelElement.textContent = level;
        } else {
            this.renderLevelTemplate(); // Try to re-render if not found
        }
    }

    renderGameOverScreen(score, obstaclesJumped, level) {
        //this.uiOverlay.innerHTML = ''; // Clear previous UI elements
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
                if (this[gameConfig.gameOverButtons[button].action]) {
                    this[gameConfig.gameOverButtons[button].action]();
                }
            });
            gameOverButtons.appendChild(buttonElement);
        });
    }

    renderMainMenu() {
        const mainMenuTemplate = window.uiTemplates.get('main-menu-template');
        this.uiOverlay.appendChild(mainMenuTemplate.cloneNode(true));
        const mainMenuButtons = document.getElementById('main-menu-buttons');
        gameConfig.mainMenuButtons.types.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = gameConfig.mainMenuButtons[button].text;
            buttonElement.style.backgroundColor = gameConfig.mainMenuButtons[button].color;
            buttonElement.style.color = gameConfig.mainMenuButtons[button].fontColor;
            buttonElement.addEventListener('click', () => {
                if (this[gameConfig.mainMenuButtons[button].action]) {
                    this[gameConfig.mainMenuButtons[button].action]();
                }
            });
            mainMenuButtons.appendChild(buttonElement);
        });
        this.uiOverlay.style.pointerEvents = 'auto'; // Enable pointer events
    }

    renderLoginScreen() {
        this.removeChild('.register-screen');
        this.removeChild('.forgot-password-screen');

        const loginScreenTemplate = window.uiTemplates.get('login-screen-template');
        this.uiOverlay.appendChild(loginScreenTemplate.cloneNode(true));
        const loginButtons = document.getElementById('login-buttons');
        gameConfig.loginButtons.types.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = gameConfig.loginButtons[button].text;
            buttonElement.style.backgroundColor = gameConfig.loginButtons[button].color;
            buttonElement.style.color = gameConfig.loginButtons[button].fontColor;
            buttonElement.addEventListener('click', () => {
                if (this[gameConfig.loginButtons[button].action]) {
                    this[gameConfig.loginButtons[button].action]();
                }
            });
            loginButtons.appendChild(buttonElement);
        });

        this.uiOverlay.style.pointerEvents = 'auto'; // Enable pointer events
    }

    renderRegisterScreen() {
        this.removeChild('.login-screen');
        this.removeChild('.forgot-password-screen');
        const registerScreenTemplate = window.uiTemplates.get('register-screen-template');
        this.uiOverlay.appendChild(registerScreenTemplate.cloneNode(true));
        const registerButtons = document.getElementById('register-buttons');
        gameConfig.registerButtons.types.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = gameConfig.registerButtons[button].text;
            buttonElement.style.backgroundColor = gameConfig.registerButtons[button].color;
            buttonElement.style.color = gameConfig.registerButtons[button].fontColor;
            buttonElement.addEventListener('click', () => {
                if (this[gameConfig.registerButtons[button].action]) this[gameConfig.registerButtons[button].action]();
            });
            registerButtons.appendChild(buttonElement);
        });
        this.uiOverlay.style.pointerEvents = 'auto'; // Enable pointer events
    }

    renderForgotPasswordScreen() {
        this.removeChild('.register-screen');
        this.removeChild('.login-screen');

        const forgotPasswordScreenTemplate = window.uiTemplates.get('forgot-password-screen-template');
        this.uiOverlay.appendChild(forgotPasswordScreenTemplate.cloneNode(true));
        const forgotPasswordButtons = document.getElementById('forgot-password-buttons');
        gameConfig.forgotPasswordButtons.types.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = gameConfig.forgotPasswordButtons[button].text;
            buttonElement.style.backgroundColor = gameConfig.forgotPasswordButtons[button].color;
            buttonElement.style.color = gameConfig.forgotPasswordButtons[button].fontColor;
            buttonElement.addEventListener('click', () => {
                if (this[gameConfig.forgotPasswordButtons[button].action]) this[gameConfig.forgotPasswordButtons[button].action]();
            });
            forgotPasswordButtons.appendChild(buttonElement);
        });
        this.uiOverlay.style.pointerEvents = 'auto'; // Enable pointer events
    }   

    async postLogin() {
        await authService.signIn(document.getElementById('login-email').value, document.getElementById('login-password').value);

        if (authService.isAuthenticated()) {
            this.hideLoginScreen();
            this.renderMainMenu();
        }
    }

    async postRegister() {
        await authService.signUp(document.getElementById('register-email').value, document.getElementById('register-password').value);

        if (authService.isFullyRegistered()) {
            this.hideRegisterScreen();
            this.renderLoginScreen();
        }
    }

    async postForgotPassword() {
        await authService.sendPasswordResetEmail(document.getElementById('forgot-password-email').value);

        this.hideForgotPasswordScreen();
        this.renderLoginScreen();
    }

    howToMenu() {
        const howToMenuTemplate = window.uiTemplates.get('how-to-template');
        this.uiOverlay.appendChild(howToMenuTemplate.cloneNode(true));
        const howToMenuButtons = document.getElementById('how-to-buttons');
        
        gameConfig.howToButtons.types.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = gameConfig.howToButtons[button].text;
            buttonElement.style.backgroundColor = gameConfig.howToButtons[button].color;
            buttonElement.style.color = gameConfig.howToButtons[button].fontColor;
            buttonElement.addEventListener('click', () => {
                if (this[gameConfig.howToButtons[button].action]) {
                    this[gameConfig.howToButtons[button].action]();
                }
            });
            howToMenuButtons.appendChild(buttonElement);
        });
    }

    removeChild(selector) {
        const element = this.uiOverlay.querySelector(selector);
        if (element) {
            this.uiOverlay.removeChild(element);
        }
    }

    hideForgotPasswordScreen() {
        this.removeChild('.forgot-password-screen');
    }

    hideRegisterScreen() {
        this.removeChild('.register-screen');
    }

    hideLoginScreen() {
        this.removeChild('.login-screen');
    }

    hideHowToMenu() {
        this.removeChild('.how-to');
    }

    renderHowToMenu() {
        this.removeChild('.main-menu');
    }

    hideMainMenu() {
        this.removeChild('.main-menu');
    }

    hideGameOverScreen() {
        this.removeChild('.game-over');
    }

    hideCharacterSelection() {
        this.removeChild('.character-selection');
    }

    backToMenu() {
        this.hideHowToMenu();
        this.renderMainMenu();
        this.removeChild('.forgot-password-screen');
        this.removeChild('.register-screen');
        this.removeChild('.login-screen');
    }

    startGame() {
        this.renderCharacterSelection();
    }

    howToPlay() {
        this.hideMainMenu();
        this.howToMenu();
    }

    mainMenu() {
        this.hideCharacterSelection();
        this.hideGameOverScreen();
        this.renderMainMenu();
    }

    renderCombo(letter, morse, input, elapsedTime) {
        const comboTemplate = window.uiTemplates.get('combo-template');
        if (!comboTemplate) {
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
    }

    renderComboVisualization(morse, input) {
        const visualization = this.uiOverlay.querySelector('#combo-visualization');
        if (!visualization) {
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

    showCorrectComboFeedback() {
        const correctComboTemplate = window.uiTemplates.get('correct-combo-template');
        if (correctComboTemplate) {
            const correctComboElement = correctComboTemplate.cloneNode(true);
            this.uiOverlay.appendChild(correctComboElement);
            setTimeout(() => {
                this.hideCorrectComboFeedback();
            }, gameConfig.game.correctComboFeedbackDuration);
        }
    }

    hideCorrectComboFeedback() {
        const correctComboElement = this.uiOverlay.querySelector('.combo-feedback');
        if (correctComboElement) {
            this.uiOverlay.removeChild(correctComboElement);
        }
    }

    addTouchListeners() {
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            if (x > this.canvas.width / 2) {
                if (this.onJump) this.onJump();
            }
        });
    }

    removeElement(selector) {
        const element = this.uiOverlay.querySelector(selector);
        if (element) {
            element.remove();
        }
    }

    hideCombo() {
        this.removeElement('.combo');
    }

    hideScore() {
        this.removeElement('.score');
    }

    hideLevel() {
        this.removeElement('.level');
    }

    hideObstaclesJumped() {
        this.removeElement('.obstacles-jumped');
    }

    hideEnergyBar() {
        this.removeElement('.energy-bar');
    }

    updateCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        if (this.game && this.game.isGameStarted) {
            this.updateUIElements();
        }
    }

    updateUIElements() {
        // Adjust positions and sizes of UI elements based on new canvas size
        const scale = this.canvas.width / 800; // Original width
        
        // Update score position
        const scoreElement = document.querySelector('.score');
        if (scoreElement) {
            scoreElement.style.fontSize = `${16 * scale}px`;
            scoreElement.style.top = `${10 * scale}px`;
            scoreElement.style.left = `${10 * scale}px`;
        }

        // Update energy bar
        const energyBar = document.querySelector('.energy-bar');
        if (energyBar) {
            energyBar.style.width = `${gameConfig.ui.energyBarWidth * scale}px`;
            energyBar.style.height = `${gameConfig.ui.energyBarHeight * scale}px`;
            energyBar.style.top = `${10 * scale}px`;
            energyBar.style.right = `${10 * scale}px`;
        }

        // Update other UI elements similarly...
        // For example:
        const obstaclesJumpedElement = document.querySelector('.obstacles-jumped');
        if (obstaclesJumpedElement) {
            obstaclesJumpedElement.style.fontSize = `${16 * scale}px`;
            obstaclesJumpedElement.style.top = `${10 * scale}px`;
            // Adjust position as needed
        }

        const levelElement = document.querySelector('.level');
        if (levelElement) {
            levelElement.style.fontSize = `${16 * scale}px`;
            levelElement.style.top = `${10 * scale}px`;
            levelElement.style.right = `${10 * scale}px`;
        }
    }
}