import gameConfig from '../game-config.js';

export default class AudioControl {
    constructor(gameAudio) {
        this.gameAudio = gameAudio;
        this.button = this.createButton();
        this.updateButtonAppearance();
    }

    createButton() {
        const button = document.createElement('div');
        button.className = 'audio-control-button';

        button.addEventListener('click', () => {
            if (this.gameAudio.isMuted) {
                this.gameAudio.unmute();
            } else {
                this.gameAudio.mute();
            }
            this.updateButtonAppearance();
        });

        return button;
    }

    updateButtonAppearance() {
        this.button.innerHTML = this.gameAudio.isMuted ? 
            gameConfig.audio.icons.muted : gameConfig.audio.icons.unmuted;
    }

    show() {
        document.body.appendChild(this.button);
    }

    hide() {
        if (this.button.parentNode) {
            this.button.parentNode.removeChild(this.button);
        }
    }
} 