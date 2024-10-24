import gameConfig from './game-config.js';

export default class GameAudio {
    constructor() {
        this.sounds = {
            gameOver: new window.Audio(gameConfig.audio.gameOver),
            gameStarts: new window.Audio(gameConfig.audio.gameStarts),
            lowEnergy: new window.Audio(gameConfig.audio.lowEnergy),
            jump: new window.Audio(gameConfig.audio.jump)
        };
        this.isLowEnergyPlaying = false;
        this.isMuted = !gameConfig.audio.defaultOn;
    }

    play(soundName) {
        if (this.sounds[soundName] && !this.isMuted) {
            this.sounds[soundName].currentTime = 0; // Reset the audio to the beginning
            this.sounds[soundName].play();
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.isLowEnergyPlaying = false;
    }

    playLowEnergy() {
        if (!this.isLowEnergyPlaying) {
            this.play('lowEnergy');
            this.isLowEnergyPlaying = true;
        }
    }

    stopLowEnergy() {
        if (this.isLowEnergyPlaying) {
            this.sounds.lowEnergy.pause();
            this.sounds.lowEnergy.currentTime = 0;
            this.isLowEnergyPlaying = false;
        }
    }

    mute() {
        this.isMuted = true;
        Object.values(this.sounds).forEach(sound => {
            sound.muted = true;
        });
    }

    unmute() {
        this.isMuted = false;
        Object.values(this.sounds).forEach(sound => {
            sound.muted = false;
        });
    }
}
